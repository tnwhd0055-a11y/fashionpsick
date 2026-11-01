// SIK 결제 서버 함수 — 포트원 결제를 확인해서 주문을 '결제 완료'로 바꾸고, 관리자 환불을 처리한다.
// 부르는 곳: ① 결제창이 닫힌 직후 사이트 ② 포트원 웹훅 ③ 관리자 화면(환불)
// 금액은 언제나 포트원 서버에 다시 물어서 확인한다. 요청 본문에 적힌 금액·상태는 믿지 않는다.
const PORTONE = "https://api.portone.io";
const SECRET = Deno.env.get("PORTONE_API_SECRET")!;
const STORE = Deno.env.get("PORTONE_STORE_ID")!;
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SIK_SECRET_KEY")!;          // Supabase 비밀 키 (service_role)

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const sb = async (path: string, init: RequestInit = {}) => {
  const r = await fetch(SB_URL + path, { ...init, headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", ...(init.headers || {}) } });
  const t = await r.text();
  if (!r.ok) throw new Error(`supabase ${r.status} ${t}`);
  return t ? JSON.parse(t) : null;
};
const rpc = (fn: string, args: unknown) => sb(`/rest/v1/rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });

const getPayment = async (id: string) => {
  const r = await fetch(`${PORTONE}/payments/${encodeURIComponent(id)}`, { headers: { Authorization: `PortOne ${SECRET}` } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`portone ${r.status} ${await r.text()}`);
  return await r.json();
};
const cancelPayment = (id: string, reason: string) =>
  fetch(`${PORTONE}/payments/${encodeURIComponent(id)}/cancel`, {
    method: "POST", headers: { Authorization: `PortOne ${SECRET}`, "Content-Type": "application/json" }, body: JSON.stringify({ reason }),
  });

const methodOf = (p: any) => {
  const m = p.method || {};
  if (m.type === "PaymentMethodEasyPay") return ({ KAKAOPAY: "kakaopay", NAVERPAY: "naverpay" } as Record<string, string>)[m.provider] || "card";
  return "card";
};

// 결제 확인 — paymentId 는 주문번호와 같다 (사이트가 그렇게 요청한다)
async function settle(paymentId: string, abort: boolean) {
  const p = await getPayment(paymentId);
  if (p && p.storeId && p.storeId !== STORE) return { ok: false, code: "WRONG_STORE" };
  if (p && p.status === "PAID") {
    const res: string = await rpc("confirm_payment", { p_order_no: paymentId, p_payment_id: p.id, p_paid_amount: p.amount.total, p_method: methodOf(p) });
    if (res === "PAID" || res === "ALREADY") return { ok: true, status: "paid" };
    if (res === "MISMATCH") {                                 // 금액 위변조 — 결제를 되돌리고 주문 취소
      await cancelPayment(p.id, "결제 금액 불일치");
      await rpc("fail_payment", { p_order_no: paymentId, p_note: "[결제 금액 불일치 — 자동 취소]" });
      return { ok: false, code: "MISMATCH" };
    }
    // 결제는 됐는데 주문이 이미 취소됨(결제창을 오래 열어둬서 자동 취소 등) — 돈만 빠지지 않게 바로 환불
    if (res.startsWith("BAD_STATUS:cancelled")) {
      await cancelPayment(p.id, "주문 취소 후 결제됨 — 자동 환불");
      return { ok: false, code: "ORDER_CANCELLED" };
    }
    return { ok: false, code: res };
  }
  // 결제 안 됨: 손님이 결제창을 닫았거나 실패. 사이트가 abort 로 알려주면 주문을 바로 취소해 재고를 돌린다
  if (!p || ["FAILED", "CANCELLED"].includes(p.status) || abort) {
    if (!p || p.status !== "PAID") await rpc("fail_payment", { p_order_no: paymentId, p_note: "[결제 미완료 — 자동 취소]" });
    return { ok: false, code: p ? p.status : "NOT_FOUND" };
  }
  return { ok: false, code: p.status };                        // READY 등 — 아직 진행 중
}

// 관리자 환불 — 로그인 토큰으로 관리자인지 확인한 뒤 포트원 결제 취소
async function refund(req: Request, orderNo: string) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const u = await fetch(`${SB_URL}/auth/v1/user`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` } });
  if (!u.ok) return json({ ok: false, code: "FORBIDDEN" }, 401);
  const user = await u.json();
  const adm = await sb(`/rest/v1/admins?user_id=eq.${user.id}&select=user_id`);
  if (!adm.length) return json({ ok: false, code: "FORBIDDEN" }, 403);
  const [o] = await sb(`/rest/v1/orders?order_no=eq.${encodeURIComponent(orderNo)}&select=status,payment_id,pay_method`);
  if (!o) return json({ ok: false, code: "NO_ORDER" }, 404);
  if (!["paid", "shipped"].includes(o.status) || !o.payment_id) return json({ ok: false, code: "BAD_STATUS" }, 400);
  const c = await cancelPayment(o.payment_id, "판매자 환불");
  if (!c.ok) return json({ ok: false, code: "PORTONE_CANCEL_FAILED", detail: await c.text() }, 502);
  await rpc("refund_order", { p_order_no: orderNo, p_note: "[관리자 환불]" });
  return json({ ok: true, status: "refunded" });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false }, 405);
  try {
    const body = await req.json().catch(() => ({}));
    if (body.action === "refund") return await refund(req, String(body.order_no || ""));
    // 사이트: { paymentId, abort? } / 포트원 웹훅: { type, data: { paymentId } }
    const paymentId = String(body.paymentId || body.data?.paymentId || "");
    if (!/^SIK-\d{6}-\d{4,}$/.test(paymentId)) return json({ ok: true, skipped: true });   // 웹훅 테스트 등은 무시
    return json(await settle(paymentId, !!body.abort));
  } catch (e) {
    console.error(e);
    return json({ ok: false, code: "SERVER_ERROR" }, 500);
  }
});
