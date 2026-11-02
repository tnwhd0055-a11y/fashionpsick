// SIK 사장님 카톡 알림 — 새 주문·문의·후기가 생기면 사장님 카카오톡 '나와의 채팅'으로 보낸다 (카카오 '나에게 보내기').
//  ① 관리자 화면 [카톡 알림 연결] → { action: "connect-url" } → 카카오 동의 화면 주소를 돌려준다
//  ② 카카오가 ?code=… 로 이 함수를 다시 부르면 토큰을 저장한다 (notify_config 표, 브라우저에서는 못 읽음)
//  ③ DB 트리거가 x-sik-hook 비밀값과 { kind, ref } 로 부르면 내용을 만들어 보낸다
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SIK_SECRET_KEY")!;
const KAKAO_ID = Deno.env.get("KAKAO_REST_API_KEY")!;
const KAKAO_SECRET = Deno.env.get("KAKAO_CLIENT_SECRET")!;
const SELF = `${SB_URL}/functions/v1/notify`;
const SITE = "https://sikseoul.com";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
const page = (msg: string) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font-family:sans-serif;padding:40px;text-align:center"><h2>${msg}</h2><p><a href="${SITE}/#admin">관리자 화면으로</a></p>`, { headers: { "Content-Type": "text/html; charset=utf-8" } });

const sb = async (path: string, init: RequestInit = {}) => {
  const r = await fetch(SB_URL + path, { ...init, headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", ...(init.headers || {}) } });
  const t = await r.text();
  if (!r.ok) throw new Error(`supabase ${r.status} ${t}`);
  return t ? JSON.parse(t) : null;
};
const config = async () => (await sb("/rest/v1/notify_config?id=eq.1&select=*"))[0];
const saveConfig = (patch: Record<string, unknown>) => sb("/rest/v1/notify_config?id=eq.1", { method: "PATCH", body: JSON.stringify(patch) });

// 연결 요청의 state — 위조 방지용 서명 (hook_secret 으로 HMAC)
const hmac = async (secret: string, data: string) => {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(data)))).map((b) => b.toString(16).padStart(2, "0")).join("");
};

const kakaoToken = async (params: Record<string, string>) => {
  const r = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams({ client_id: KAKAO_ID, client_secret: KAKAO_SECRET, ...params }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`kakao token ${r.status} ${JSON.stringify(j)}`);
  return j;
};

// 유효한 액세스 토큰 — 만료됐으면 refresh. 카카오가 새 refresh 토큰을 주면(만료 1달 전부터) 같이 저장해서 연결이 계속 이어진다
async function accessToken() {
  const c = await config();
  if (!c?.kakao_refresh) return null;
  if (c.kakao_access && new Date(c.kakao_access_until).getTime() > Date.now() + 60_000) return c.kakao_access;
  const t = await kakaoToken({ grant_type: "refresh_token", refresh_token: c.kakao_refresh });
  await saveConfig({ kakao_access: t.access_token, kakao_access_until: new Date(Date.now() + t.expires_in * 1000).toISOString(), ...(t.refresh_token ? { kakao_refresh: t.refresh_token } : {}) });
  return t.access_token;
}

async function sendMemo(text: string) {
  const token = await accessToken();
  if (!token) return { ok: false, code: "NOT_CONNECTED" };
  const tpl = { object_type: "text", text: text.slice(0, 200), link: { web_url: `${SITE}/#admin`, mobile_web_url: `${SITE}/#admin` }, button_title: "관리자 화면" };
  const r = await fetch("https://kapi.kakao.com/v2/api/talk/memo/default/send", {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams({ template_object: JSON.stringify(tpl) }),
  });
  return { ok: r.ok, status: r.status, detail: r.ok ? undefined : await r.text() };
}

const won = (n: number) => Number(n || 0).toLocaleString("ko-KR") + "원";
const PAY: Record<string, string> = { bank: "무통장", kakaopay: "카카오페이", naverpay: "네이버페이", card: "카드" };

async function message(kind: string, ref: string) {
  if (kind === "order") {
    const [o] = await sb(`/rest/v1/orders?order_no=eq.${encodeURIComponent(ref)}&select=order_no,status,pay_method,amount,depositor,order_items(name,option,qty)`);
    if (!o) return null;
    const items = (o.order_items || []).map((i: any) => `· ${i.name}${i.option ? " " + i.option : ""} ×${i.qty}`).join("\n");
    const head = o.status === "awaiting_deposit" ? `🛍 새 주문 (입금 대기)\n입금자 ${o.depositor}` : `🛍 새 주문 (결제 완료)`;
    return `${head}\n${o.order_no}\n${PAY[o.pay_method] || o.pay_method} ${won(o.amount)}\n${items}`;
  }
  if (kind === "qna") {
    const [q] = await sb(`/rest/v1/qna?id=eq.${Number(ref)}&select=product_id,is_private,question`);
    if (!q) return null;
    const [p] = await sb(`/rest/v1/products?id=eq.${encodeURIComponent(q.product_id)}&select=name&limit=1`);
    return `❓ 새 상품 문의${q.is_private ? " (비밀글)" : ""}\n${p?.name || q.product_id}\n"${q.question.slice(0, 80)}"`;
  }
  if (kind === "review") {
    const [r] = await sb(`/rest/v1/reviews?id=eq.${Number(ref)}&select=product_id,rating,body`);
    if (!r) return null;
    const [p] = await sb(`/rest/v1/products?id=eq.${encodeURIComponent(r.product_id)}&select=name&limit=1`);
    return `⭐ 새 후기 ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}\n${p?.name || r.product_id}\n"${r.body.slice(0, 80)}"`;
  }
  return null;
}

async function isAdmin(req: Request) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const u = await fetch(`${SB_URL}/auth/v1/user`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` } });
  if (!u.ok) return false;
  const user = await u.json();
  return (await sb(`/rest/v1/admins?user_id=eq.${user.id}&select=user_id`)).length > 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const url = new URL(req.url);
  try {
    // ② 카카오 동의 후 돌아옴
    if (req.method === "GET" && (url.searchParams.get("code") || url.searchParams.get("error"))) {
      const c = await config();
      const [ts, sig] = String(url.searchParams.get("state") || "").split(".");
      if (!ts || sig !== (await hmac(c.hook_secret, ts)) || Date.now() - Number(ts) > 15 * 60_000) return page("연결 요청이 만료되었습니다. 관리자 화면에서 다시 눌러 주세요.");
      if (url.searchParams.get("error")) return page("카카오 동의가 취소되었습니다.");
      const t = await kakaoToken({ grant_type: "authorization_code", redirect_uri: SELF, code: url.searchParams.get("code")! });
      await saveConfig({ kakao_refresh: t.refresh_token, kakao_access: t.access_token, kakao_access_until: new Date(Date.now() + t.expires_in * 1000).toISOString(), kakao_connected_at: new Date().toISOString(), enabled: true });
      const sent = await sendMemo("✅ SIK 주문 알림이 연결되었습니다.\n새 주문·문의·후기가 생기면 여기로 알려드려요.");
      return page(sent.ok ? "카톡 알림이 연결되었습니다 ✅ 카카오톡 '나와의 채팅'을 확인하세요." : "연결은 됐지만 시험 메시지를 못 보냈습니다. 카카오 동의항목에서 '카카오톡 메시지 전송'을 켰는지 확인해 주세요.");
    }
    if (req.method !== "POST") return json({ ok: false }, 405);
    const body = await req.json().catch(() => ({}));

    // ① 관리자: 연결 주소 / 시험 발송 / 켜고 끄기
    if (body.action) {
      if (!(await isAdmin(req))) return json({ ok: false, code: "FORBIDDEN" }, 403);
      const c = await config();
      if (body.action === "connect-url") {
        const ts = String(Date.now());
        const q = new URLSearchParams({ client_id: KAKAO_ID, redirect_uri: SELF, response_type: "code", scope: "talk_message", state: `${ts}.${await hmac(c.hook_secret, ts)}` });
        return json({ ok: true, url: `https://kauth.kakao.com/oauth/authorize?${q}` });
      }
      if (body.action === "test") return json(await sendMemo("🔔 SIK 알림 시험 메시지입니다."));
      if (body.action === "toggle") { await saveConfig({ enabled: !!body.enabled }); return json({ ok: true }); }
      return json({ ok: false, code: "ACTION" }, 400);
    }

    // ③ DB 트리거
    const c = await config();
    if (req.headers.get("x-sik-hook") !== c.hook_secret) return json({ ok: false }, 401);
    const text = await message(String(body.kind || ""), String(body.ref || ""));
    if (!text) return json({ ok: false, code: "NO_TARGET" });
    return json(await sendMemo(text));
  } catch (e) {
    console.error(e);
    return json({ ok: false, code: "SERVER_ERROR" }, 500);
  }
});
