/* SIK Storefront — 자체 주문 화면: 상품 구매 버튼 · 장바구니 · 주문서 · 주문 완료 · 주문 조회 · 관리자
   데이터·서버 호출은 shop.js (window.SIK_SHOP). 화면 전환은 index.html 의 nav("cart") 등. */

const SHOP_CSS = `
.sh-wrap{max-width:760px;margin:0 auto;padding:clamp(32px,5vw,64px) var(--sk-pad) clamp(64px,8vw,120px);font-family:var(--font-sans);color:var(--ink)}
.sh-wrap.wide{max-width:1080px}
.sh-title{font-size:22px;font-weight:700;margin:0 0 6px;letter-spacing:-.01em}
.sh-sub{font-size:13px;color:var(--mute);margin:0 0 28px}
.sh-sec{border-top:1px solid var(--ink);padding:20px 0 28px}
.sh-sec h2{font-size:15px;font-weight:700;margin:0 0 16px}
.sh-row{display:grid;grid-template-columns:64px 1fr auto;gap:14px;align-items:center;padding:14px 0;border-bottom:1px solid var(--warm-line)}
.sh-row img{width:64px;height:64px;object-fit:cover;background:var(--soft-cloud);display:block}
.sh-row .nm{font-size:14px;font-weight:600;line-height:1.4;word-break:keep-all}
.sh-row .op{font-size:12px;color:var(--mute);margin-top:3px}
.sh-row .pr{font-size:14px;font-weight:600;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.sh-qty{display:inline-flex;align-items:center;border:1px solid var(--hairline);margin-top:8px}
.sh-qty button{width:28px;height:28px;border:0;background:none;cursor:pointer;font-size:15px;color:var(--ink)}
.sh-qty button:disabled{color:var(--stone);cursor:default}
.sh-qty span{min-width:26px;text-align:center;font-size:13px;font-variant-numeric:tabular-nums}
.sh-x{border:0;background:none;color:var(--mute);font-size:12px;cursor:pointer;padding:0;margin-left:10px;text-decoration:underline}
.sh-sum{display:grid;grid-template-columns:1fr auto;gap:8px 0;font-size:14px;padding:16px 0;font-variant-numeric:tabular-nums}
.sh-sum dt{color:var(--mute)} .sh-sum dd{margin:0;text-align:right}
.sh-sum .tot{font-size:17px;font-weight:700;color:var(--ink);padding-top:10px;border-top:1px solid var(--warm-line)}
.sh-note{font-size:12px;color:var(--mute);line-height:1.7;margin:0}
.sh-field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.sh-field label{font-size:12px;font-weight:600;color:var(--charcoal)}
.sh-in{height:46px;border:1px solid var(--hairline);padding:0 12px;font:inherit;font-size:15px;color:var(--ink);background:var(--paper);border-radius:0;width:100%;box-sizing:border-box}
.sh-in:focus{outline:none;border-color:var(--ink)}
.sh-in[readonly]{background:var(--soft-cloud)}
.sh-2{display:grid;grid-template-columns:1fr auto;gap:8px}
.sh-btn{height:52px;border:1px solid var(--ink);background:var(--ink);color:var(--on-ink);font:inherit;font-size:15px;font-weight:600;cursor:pointer;padding:0 20px;border-radius:0;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;box-sizing:border-box}
.sh-btn.line{background:var(--paper);color:var(--ink)}
.sh-btn.sm{height:46px;font-size:13px}
.sh-btn.xs{height:34px;font-size:12px;padding:0 12px}
.sh-btn:disabled{background:var(--soft-cloud);border-color:var(--hairline);color:var(--stone);cursor:not-allowed}
.sh-btn:focus-visible,.sh-pay button:focus-visible,.sh-chip:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.sh-full{width:100%}
.sh-pay{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.sh-pay button{height:56px;border:1px solid var(--hairline);background:var(--paper);font:inherit;font-size:14px;font-weight:600;cursor:pointer;color:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.sh-pay button[aria-pressed="true"]{border:2px solid var(--ink)}
.sh-pay button:disabled{color:var(--stone);cursor:not-allowed;background:var(--soft-cloud)}
.sh-pay small{font-size:11px;font-weight:400;color:var(--mute)}
.sh-check{display:flex;gap:10px;align-items:flex-start;font-size:14px;padding:10px 0;cursor:pointer}
.sh-check input{width:18px;height:18px;margin:1px 0 0;accent-color:var(--ink);flex:none}
.sh-terms{font-size:12px;color:var(--mute);line-height:1.8;background:var(--soft-cloud);padding:12px 14px;margin:0 0 4px 28px}
.sh-err{background:#fbeaec;color:var(--sale-deep);font-size:13px;padding:12px 14px;margin:0 0 14px;line-height:1.6}
.sh-ok{color:var(--in-stock)}
.sh-empty{text-align:center;padding:60px 0;color:var(--mute);font-size:14px}
.sh-box{border:1px solid var(--ink);padding:20px;margin:0 0 20px}
.sh-box .big{font-size:20px;font-weight:700;letter-spacing:.01em;font-variant-numeric:tabular-nums}
.sh-kv{display:grid;grid-template-columns:96px 1fr;gap:10px 12px;font-size:14px;margin:0}
.sh-kv dt{color:var(--mute)} .sh-kv dd{margin:0;word-break:keep-all}
.sh-pill{display:inline-block;font-size:11px;font-weight:700;padding:5px 8px;letter-spacing:.02em;background:var(--soft-cloud);color:var(--ink);white-space:nowrap}
.sh-pill[data-s="awaiting_deposit"],.sh-pill[data-s="pending"]{background:#fff4d6;color:#7a5200}
.sh-pill[data-s="paid"]{background:var(--ink);color:var(--on-ink)}
.sh-pill[data-s="shipped"]{background:#e3eefc;color:#1d4f91}
.sh-pill[data-s="delivered"]{background:#e2f2e9;color:var(--in-stock)}
.sh-pill[data-s="cancelled"],.sh-pill[data-s="refunded"]{background:var(--soft-cloud);color:var(--stone)}
.sh-steps{display:flex;gap:0;margin:18px 0 6px;font-size:12px;color:var(--stone)}
.sh-steps span{flex:1;text-align:center;padding-top:10px;border-top:3px solid var(--warm-line)}
.sh-steps span.on{color:var(--ink);font-weight:700;border-top-color:var(--ink)}
.sh-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 16px}
.sh-chip{height:34px;padding:0 12px;border:1px solid var(--hairline);background:var(--paper);font:inherit;font-size:13px;cursor:pointer;color:var(--ink)}
.sh-chip[aria-pressed="true"]{background:var(--ink);color:var(--on-ink);border-color:var(--ink)}
.sh-order{border:1px solid var(--warm-line);padding:16px;margin-bottom:12px}
.sh-order header{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}
.sh-order .no{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums}
.sh-order .when{font-size:12px;color:var(--mute)}
.sh-order .items{font-size:13px;margin:8px 0;padding:8px 0;border-top:1px dashed var(--warm-line);border-bottom:1px dashed var(--warm-line)}
.sh-order .acts{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:10px}
.sh-order .acts select,.sh-order .acts input{height:34px;border:1px solid var(--hairline);font:inherit;font-size:13px;padding:0 8px;border-radius:0;background:var(--paper)}
.sh-copy{border:0;background:none;font:inherit;font-size:12px;color:var(--mute);text-decoration:underline;cursor:pointer;padding:0 0 0 6px}
.sh-pdp-opts{display:flex;gap:8px;flex-wrap:wrap}
.sh-size{height:44px;min-width:56px;padding:0 14px;border:1px solid var(--hairline);background:var(--paper);font-family:var(--font-sans);font-size:14px;font-weight:500;cursor:pointer;color:var(--ink)}
.sh-size[aria-pressed="true"]{border-color:var(--ink);background:var(--ink);color:var(--on-ink)}
.sh-size:disabled{color:var(--stone);text-decoration:line-through;cursor:not-allowed;background:var(--soft-cloud)}
.sh-naver{display:inline-block;margin-top:12px;font-size:12px;color:var(--mute);text-decoration:underline;text-underline-offset:3px}
.sh-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:60;background:var(--ink);color:var(--on-ink);font-family:var(--font-sans);font-size:14px;padding:14px 18px;display:flex;gap:14px;align-items:center;box-shadow:0 8px 24px rgba(0,0,0,.18);max-width:calc(100vw - 32px)}
.sh-toast a{color:var(--on-ink);font-weight:700;text-decoration:underline;white-space:nowrap}
.sh-cart{display:inline-flex;align-items:center;gap:6px;color:inherit;text-decoration:none}
.sh-cart b{min-width:18px;height:18px;border-radius:9px;background:var(--ink);color:var(--on-ink);font-family:var(--font-sans);font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;padding:0 5px;letter-spacing:0}
.sh-post{position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px}
.sh-post-in{background:var(--paper);width:100%;max-width:500px;height:min(560px,calc(100vh - 32px));display:flex;flex-direction:column}
.sh-post-top{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--warm-line);font-family:var(--font-sans);font-size:15px}
.sh-post-top button{border:0;background:none;font-size:26px;line-height:1;cursor:pointer;color:var(--ink)}
.sh-post-body{flex:1;min-height:0}
.sh-test{background:#fff4d6;color:#7a5200;font-family:var(--font-sans);font-size:12px;text-align:center;padding:8px var(--sk-pad);line-height:1.5}
@media (max-width:620px){
  .sh-pay{grid-template-columns:1fr 1fr}
  .sh-kv{grid-template-columns:80px 1fr}
  .sh-row{grid-template-columns:56px 1fr auto;gap:10px}
  .sh-row img{width:56px;height:56px}
}
`;

function ShopStyle() { return <style>{SHOP_CSS}</style>; }

// 장바구니가 바뀌면 다시 그린다 (다른 탭에서 바뀌어도)
function useCart() {
  const S = window.SIK_SHOP;
  const [items, setItems] = React.useState(() => S.cart());
  React.useEffect(() => {
    const on = () => setItems(S.cart());
    window.addEventListener("sik-cart", on);
    window.addEventListener("storage", on);
    return () => { window.removeEventListener("sik-cart", on); window.removeEventListener("storage", on); };
  }, []);
  return items;
}

// 헤더 오른쪽 장바구니 링크
function CartLink({ nav }) {
  const S = window.SIK_SHOP;
  const items = useCart();
  if (!S || !S.on) return null;
  const n = items.reduce((a, it) => a + it.qty, 0);
  // 헤더는 모든 화면에 있으니 자체 주문 스타일도 여기서 한 번 깐다 (상품 페이지 구매 영역도 이걸 쓴다)
  return (
    <React.Fragment>
    <ShopStyle />
    <a className="sh-cart sk-ser sk-cap-track" href="#" onClick={(e) => { e.preventDefault(); nav("cart"); }} aria-label={`장바구니 ${n}개`}>
      CART{n > 0 && <b>{n}</b>}
    </a>
    </React.Fragment>
  );
}

// 테스트 기간 안내 띠 (자체 주문 화면 위에만)
function TestBanner() {
  return <div className="sh-test">지금은 <b>테스트 주문</b> 기간입니다. 이 주소에서 넣은 주문은 실제로 발송되지 않습니다.</div>;
}

/* ── 상품 페이지 구매 영역 ───────────────────────────────── */
function PdpBuy({ product, colorIndex, nav }) {
  const S = window.SIK_SHOP;
  const opts = S.options(product);
  const hasChoice = opts.length > 1 || opts[0] !== "";
  const byColor = !product.sizes && Array.isArray(product.colors);
  const [stock, setStock] = React.useState(null);
  const [pick, setPick] = React.useState(byColor ? opts[colorIndex] : (opts.length === 1 ? opts[0] : null));
  const [qty, setQty] = React.useState(1);
  const [toast, setToast] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => { S.stock().then(setStock).catch(() => setStock({})); }, [product.id]);
  React.useEffect(() => { if (byColor) setPick(opts[colorIndex]); }, [colorIndex]);
  React.useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(false), 4000); return () => clearTimeout(t); }, [toast]);

  const left = (o) => (stock ? (stock[product.id + "|" + o] || 0) : null);
  const allOut = stock && opts.every((o) => left(o) <= 0);
  const soldOut = product.soldOut || allOut;
  const cur = pick != null ? left(pick) : null;

  const check = () => {
    if (pick == null) { setMsg("사이즈를 선택해 주세요."); return false; }
    if (cur != null && cur < qty) { setMsg(cur > 0 ? `남은 재고는 ${cur}개입니다.` : "선택한 옵션은 품절입니다."); return false; }
    setMsg(""); return true;
  };
  const buyNow = () => { if (!check()) return; S.startCheckout([{ id: product.id, option: pick, qty }], false); nav("checkout"); };
  const add = () => { if (!check()) return; S.addToCart(product.id, pick, qty); setToast(true); };

  const naver = product.buy || window.SIK_SMARTSTORE;

  return (
    <div>
      {product.sizes && (
        <div style={{ marginTop: "var(--space-2xl)" }}>
          <div style={pdpLabel}>Size{pick ? " — " + pick : ""}</div>
          <div className="sh-pdp-opts">
            {opts.map((o) => (
              <button key={o} type="button" className="sh-size" aria-pressed={pick === o} disabled={left(o) === 0}
                onClick={() => { setPick(o); setMsg(""); }}>{o}</button>
            ))}
          </div>
          {cur != null && cur > 0 && cur <= 3 && <div style={{ fontSize: 12, color: "var(--sale)", marginTop: 8 }}>{pick} 사이즈 {cur}개 남음</div>}
        </div>
      )}

      {!soldOut && (
        <div style={{ marginTop: "var(--space-xl)" }}>
          <div style={pdpLabel}>Quantity</div>
          <div className="sh-qty" style={{ marginTop: 0 }}>
            <button type="button" aria-label="수량 줄이기" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>−</button>
            <span>{qty}</span>
            <button type="button" aria-label="수량 늘리기" disabled={qty >= 10} onClick={() => setQty(qty + 1)}>+</button>
          </div>
        </div>
      )}

      {msg && <div className="sh-err" style={{ marginTop: 16, marginBottom: 0 }} role="alert">{msg}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: "var(--space-2xl)" }}>
        {soldOut ? (
          <button className="sh-btn" disabled style={{ gridColumn: "1 / -1", height: 56, fontSize: 17 }}>일시 품절</button>
        ) : (
          <React.Fragment>
            <button type="button" className="sh-btn" style={{ height: 56, fontSize: 16 }} onClick={buyNow}>구매하기</button>
            <button type="button" className="sh-btn line" style={{ height: 56, fontSize: 16 }} onClick={add}>장바구니 담기</button>
          </React.Fragment>
        )}
      </div>
      <div style={{ fontSize: 12, color: "var(--mute)", marginTop: "var(--space-md)" }}>
        {soldOut
          ? <React.Fragment>재입고되면 인스타그램 <a href={window.SIK_INSTAGRAM} target="_blank" rel="noreferrer">@fashionpsick</a> 으로 안내드립니다.</React.Fragment>
          : `${S.PAY.filter((p) => p.ready).map((p) => p.label).join(" · ")} · ${S.won(S.SHIP.freeOver)} 이상 무료배송`}
      </div>
      {!product.soldOut && <a className="sh-naver" href={naver} target="_blank" rel="noopener noreferrer">네이버 스마트스토어에서 구매하기 →</a>}

      {toast && (
        <div className="sh-toast" role="status">
          장바구니에 담았습니다.
          <a href="#" onClick={(e) => { e.preventDefault(); setToast(false); nav("cart"); }}>장바구니 보기</a>
        </div>
      )}
    </div>
  );
}

/* ── 공통: 품목 줄 ───────────────────────────────────────── */
function ItemRow({ it, onQty, onRemove }) {
  const S = window.SIK_SHOP;
  const l = S.line(it);
  if (!l) return null;
  return (
    <div className="sh-row">
      <img src={l.image} alt="" />
      <div>
        <div className="nm">{l.name}</div>
        <div className="op">{[l.option, onQty ? null : `${l.qty}개`].filter(Boolean).join(" · ") || "단일 옵션"}</div>
        {onQty && (
          <div>
            <span className="sh-qty">
              <button type="button" aria-label="수량 줄이기" disabled={l.qty <= 1} onClick={() => onQty(l.qty - 1)}>−</button>
              <span>{l.qty}</span>
              <button type="button" aria-label="수량 늘리기" disabled={l.qty >= 10} onClick={() => onQty(l.qty + 1)}>+</button>
            </span>
            {onRemove && <button type="button" className="sh-x" onClick={onRemove}>삭제</button>}
          </div>
        )}
      </div>
      <div className="pr">{S.won(l.price * l.qty)}</div>
    </div>
  );
}

function Summary({ items, zip }) {
  const S = window.SIK_SHOP;
  const sum = items.reduce((a, it) => { const l = S.line(it); return a + (l ? l.price * l.qty : 0); }, 0);
  const fee = S.shippingFee(sum, zip);
  return (
    <React.Fragment>
      <dl className="sh-sum">
        <dt>상품 금액</dt><dd>{S.won(sum)}</dd>
        <dt>배송비</dt><dd>{fee === 0 ? "무료" : S.won(fee)}</dd>
        <dt className="tot">결제 예정 금액</dt><dd className="tot">{S.won(sum + fee)}</dd>
      </dl>
      <p className="sh-note">
        {sum < S.SHIP.freeOver && sum > 0 ? `${S.won(S.SHIP.freeOver - sum)} 더 담으면 무료배송입니다. ` : ""}
        제주 지역은 {S.won(S.SHIP.jeju)}이 추가됩니다.
      </p>
    </React.Fragment>
  );
}

/* ── 장바구니 ────────────────────────────────────────────── */
function CartPage({ nav }) {
  const S = window.SIK_SHOP;
  const { SikHeader, SikFooter } = window;
  const items = useCart();
  return (
    <div style={{ background: "var(--paper)" }}>
      <ShopStyle />
      <SikHeader nav={nav} active={null} />
      <TestBanner />
      <div className="sh-wrap">
        <h1 className="sh-title">장바구니</h1>
        <p className="sh-sub">담은 상품 {items.reduce((a, it) => a + it.qty, 0)}개</p>
        {items.length === 0 ? (
          <div className="sh-empty">
            장바구니가 비어 있습니다.
            <div style={{ marginTop: 20 }}><button className="sh-btn line sm" onClick={() => nav("All")}>쇼핑 계속하기</button></div>
          </div>
        ) : (
          <React.Fragment>
            <div className="sh-sec" style={{ paddingBottom: 0 }}>
              {items.map((it) => (
                <ItemRow key={it.id + "|" + it.option} it={it}
                  onQty={(q) => S.setQty(it.id, it.option, q)} onRemove={() => S.setQty(it.id, it.option, 0)} />
              ))}
            </div>
            <Summary items={items} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8, marginTop: 20 }}>
              <button className="sh-btn line" onClick={() => nav("All")}>쇼핑 계속하기</button>
              <button className="sh-btn" onClick={() => { S.startCheckout(items, true); nav("checkout"); }}>주문하기</button>
            </div>
          </React.Fragment>
        )}
      </div>
      <SikFooter nav={nav} />
    </div>
  );
}

/* ── 주문서 ──────────────────────────────────────────────── */
// 카카오(다음) 우편번호 서비스 — 키 없이 무료. 처음 누를 때 스크립트를 불러온다.
// 팝업 창은 휴대폰·인앱 브라우저에서 막히는 일이 많아서 화면 위 레이어로 띄운다.
function openPostcode(onPick) {
  const run = () => {
    const ov = document.createElement("div");
    ov.className = "sh-post";
    ov.innerHTML = '<div class="sh-post-in"><div class="sh-post-top"><b>주소 검색</b><button type="button" aria-label="닫기">&times;</button></div><div class="sh-post-body"></div></div>';
    const close = () => { ov.remove(); document.body.style.overflow = ""; };
    ov.querySelector("button").onclick = close;
    ov.onclick = (e) => { if (e.target === ov) close(); };
    document.body.appendChild(ov);
    document.body.style.overflow = "hidden";
    new window.daum.Postcode({
      oncomplete: (d) => { onPick({ zipcode: d.zonecode, address1: d.roadAddress || d.jibunAddress }); close(); },
      width: "100%", height: "100%",
    }).embed(ov.querySelector(".sh-post-body"), { autoClose: false });
  };
  if (window.daum && window.daum.Postcode) return run();
  const s = document.createElement("script");
  s.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  s.onload = run;
  document.head.appendChild(s);
}

const MEMO_PRESETS = ["", "문 앞에 놓아주세요", "경비실에 맡겨주세요", "배송 전 연락 바랍니다"];

function CheckoutPage({ nav }) {
  const S = window.SIK_SHOP;
  const { SikHeader, SikFooter } = window;
  const [{ items, fromCart }] = React.useState(() => S.checkoutItems());
  const [f, setF] = React.useState({ name: "", phone: "", zipcode: "", address1: "", address2: "", memo: "", depositor: "" });
  const [pay, setPay] = React.useState("bank");
  const [agree, setAgree] = React.useState({ privacy: false, order: false });
  const [showTerms, setShowTerms] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const phoneFmt = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    return d.length < 4 ? d : d.length < 8 ? `${d.slice(0, 3)}-${d.slice(3)}` : `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!agree.privacy || !agree.order) { setErr("필수 동의 항목에 체크해 주세요."); return; }
    if (!f.zipcode) { setErr("주소 검색으로 배송지를 입력해 주세요."); return; }
    setBusy(true); setErr("");
    const buyer = { ...f, depositor: f.depositor || f.name, privacy_agreed: true };
    S.createOrder(items, buyer, pay)
      .then((o) => (pay === "bank" ? o : S.pay(o, items, buyer, pay)))   // 간편결제·카드는 결제창까지 끝나야 완료
      .then(() => {
        if (fromCart) S.saveCart([]);   // 바로구매였으면 장바구니는 그대로 둔다
        nav("done");
      })
      .catch((e2) => {
        setErr(e2.payCancelled ? "결제가 완료되지 않았습니다. 다시 시도해 주세요." : /^SIK:/.test(e2.message) ? S.errorText(e2) : e2.message || S.errorText(e2));
        setBusy(false); window.scrollTo(0, 0);
      });
  };

  if (!items.length) {
    return (
      <div style={{ background: "var(--paper)" }}>
        <ShopStyle /><SikHeader nav={nav} active={null} />
        <div className="sh-wrap"><div className="sh-empty">주문할 상품이 없습니다.<div style={{ marginTop: 20 }}><button className="sh-btn line sm" onClick={() => nav("All")}>상품 보러 가기</button></div></div></div>
        <SikFooter nav={nav} />
      </div>
    );
  }

  const sum = items.reduce((a, it) => { const l = S.line(it); return a + (l ? l.price * l.qty : 0); }, 0);
  const total = sum + S.shippingFee(sum, f.zipcode);

  return (
    <div style={{ background: "var(--paper)" }}>
      <ShopStyle />
      <SikHeader nav={nav} active={null} />
      <TestBanner />
      <form className="sh-wrap" onSubmit={submit} noValidate>
        <h1 className="sh-title">주문서</h1>
        <p className="sh-sub">회원가입 없이 주문할 수 있습니다. 주문번호와 휴대폰 번호로 배송 상황을 확인하세요.</p>
        {err && <div className="sh-err" role="alert">{err}</div>}

        <section className="sh-sec" style={{ paddingBottom: 0 }}>
          <h2>주문 상품</h2>
          {items.map((it) => <ItemRow key={it.id + "|" + it.option} it={it} />)}
        </section>

        <section className="sh-sec">
          <h2>배송 정보</h2>
          <div className="sh-field">
            <label htmlFor="ck-name">받는 분</label>
            <input id="ck-name" className="sh-in" autoComplete="name" value={f.name} onChange={set("name")} maxLength={30} required />
          </div>
          <div className="sh-field">
            <label htmlFor="ck-phone">휴대폰 번호</label>
            <input id="ck-phone" className="sh-in" type="tel" inputMode="numeric" autoComplete="tel" placeholder="010-0000-0000"
              value={f.phone} onChange={(e) => setF({ ...f, phone: phoneFmt(e.target.value) })} required />
          </div>
          <div className="sh-field">
            <label htmlFor="ck-zip">주소</label>
            <div className="sh-2">
              <input id="ck-zip" className="sh-in" readOnly placeholder="우편번호" value={f.zipcode}
                onClick={() => openPostcode((a) => setF((p) => ({ ...p, ...a })))} />
              <button type="button" className="sh-btn line sm" onClick={() => openPostcode((a) => setF((p) => ({ ...p, ...a })))}>주소 검색</button>
            </div>
            <input className="sh-in" readOnly placeholder="주소 검색을 눌러 주세요" value={f.address1} aria-label="기본 주소"
              onClick={() => openPostcode((a) => setF((p) => ({ ...p, ...a })))} />
            <input className="sh-in" placeholder="상세주소 (동·호수)" value={f.address2} onChange={set("address2")} maxLength={100} aria-label="상세주소" autoComplete="address-line2" />
          </div>
          <div className="sh-field">
            <label htmlFor="ck-memo">배송 요청사항 <span style={{ fontWeight: 400, color: "var(--mute)" }}>(선택)</span></label>
            <select id="ck-memo" className="sh-in" value={MEMO_PRESETS.includes(f.memo) ? f.memo : "__"} onChange={(e) => setF({ ...f, memo: e.target.value === "__" ? " " : e.target.value })}>
              {MEMO_PRESETS.map((m) => <option key={m} value={m}>{m || "선택 안 함"}</option>)}
              <option value="__">직접 입력</option>
            </select>
            {!MEMO_PRESETS.includes(f.memo) && (
              <input className="sh-in" placeholder="요청사항을 입력해 주세요" value={f.memo.trimStart()} onChange={set("memo")} maxLength={200} aria-label="배송 요청사항 직접 입력" />
            )}
          </div>
        </section>

        <section className="sh-sec">
          <h2>결제 수단</h2>
          <div className="sh-pay" role="group" aria-label="결제 수단">
            {S.PAY.map((p) => (
              <button key={p.key} type="button" aria-pressed={pay === p.key} disabled={!p.ready} onClick={() => setPay(p.key)}>
                {p.label}{!p.ready && <small>준비 중</small>}
              </button>
            ))}
          </div>
          {pay === "bank" && (
            <div className="sh-field" style={{ marginTop: 16 }}>
              <label htmlFor="ck-dep">입금자명</label>
              <input id="ck-dep" className="sh-in" placeholder={f.name || "받는 분과 같으면 비워 두세요"} value={f.depositor} onChange={set("depositor")} maxLength={30} />
              <p className="sh-note">주문 후 안내되는 계좌로 3일 안에 입금해 주세요. 기한이 지나면 주문이 자동 취소됩니다.</p>
            </div>
          )}
        </section>

        <section className="sh-sec">
          <h2>결제 금액</h2>
          <Summary items={items} zip={f.zipcode} />
        </section>

        <section className="sh-sec">
          <label className="sh-check">
            <input type="checkbox" checked={agree.privacy} onChange={(e) => setAgree({ ...agree, privacy: e.target.checked })} />
            <span>[필수] 개인정보 수집·이용 동의 <button type="button" className="sh-copy" onClick={(e) => { e.preventDefault(); setShowTerms(!showTerms); }}>{showTerms ? "닫기" : "보기"}</button></span>
          </label>
          {showTerms && (
            <div className="sh-terms">
              수집 항목: 받는 분 이름, 휴대폰 번호, 배송지 주소, 배송 요청사항, 입금자명<br />
              이용 목적: 주문 처리, 상품 배송, 주문·배송 관련 안내 및 고객 상담<br />
              보유 기간: 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 계약·대금결제 및 재화 공급 기록 5년, 소비자 불만·분쟁 처리 기록 3년 보관 후 파기<br />
              동의를 거부할 수 있으나, 거부하시면 주문할 수 없습니다.
            </div>
          )}
          <label className="sh-check">
            <input type="checkbox" checked={agree.order} onChange={(e) => setAgree({ ...agree, order: e.target.checked })} />
            <span>[필수] 주문 상품과 결제 금액을 확인했으며, <a href="#" onClick={(e) => { e.preventDefault(); window.open(location.pathname + "#terms", "_blank"); }}>이용약관</a>에 동의합니다.</span>
          </label>
          <button type="submit" className="sh-btn sh-full" style={{ marginTop: 16, height: 58, fontSize: 17 }} disabled={busy}>
            {busy ? (pay === "bank" ? "주문 접수 중…" : "결제 진행 중…") : `${S.won(total)} ${pay === "bank" ? "주문하기" : "결제하기"}`}
          </button>
        </section>
      </form>
      <SikFooter nav={nav} />
    </div>
  );
}

/* ── 주문 완료 ───────────────────────────────────────────── */
function copyText(t, done) {
  const ok = () => done && done();
  if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, ok); else ok();
}

function DonePage({ nav }) {
  const S = window.SIK_SHOP;
  const { SikHeader, SikFooter } = window;
  const [o, setO] = React.useState(() => S.lastOrder());
  // 휴대폰 결제: 결제사 페이지에서 ?pay=return&paymentId=… 로 돌아온다
  const back = React.useMemo(() => { const q = new URLSearchParams(location.search); return q.get("pay") === "return" ? q : null; }, []);
  const [checking, setChecking] = React.useState(!!back);
  const [payErr, setPayErr] = React.useState("");
  React.useEffect(() => {
    if (!back) return;
    const id = back.get("paymentId");
    history.replaceState(history.state, "", location.pathname);   // 새로고침해도 다시 확인하지 않게 주소 정리
    S.finishPayment(id)
      .then((x) => { setO(x || S.lastOrder()); S.saveCart([]); })
      .catch((e) => setPayErr(back.get("code") ? (back.get("message") || "결제가 완료되지 않았습니다.") : e.message))
      .then(() => setChecking(false));
  }, []);
  const [copied, setCopied] = React.useState("");
  const cp = (t, k) => copyText(t, () => { setCopied(k); setTimeout(() => setCopied(""), 1600); });
  const due = o && o.deposit_deadline ? new Date(o.deposit_deadline) : null;
  const dueText = due ? `${due.getMonth() + 1}월 ${due.getDate()}일 ${String(due.getHours()).padStart(2, "0")}:${String(due.getMinutes()).padStart(2, "0")}까지` : "";

  return (
    <div style={{ background: "var(--paper)" }}>
      <ShopStyle />
      <SikHeader nav={nav} active={null} />
      <TestBanner />
      <div className="sh-wrap">
        {checking ? (
          <div className="sh-empty">결제를 확인하고 있습니다…</div>
        ) : payErr ? (
          <div className="sh-empty">
            <div className="sh-err" role="alert" style={{ textAlign: "left" }}>{payErr}</div>
            <button className="sh-btn line sm" onClick={() => nav("cart")}>장바구니로</button>
          </div>
        ) : !o ? (
          <div className="sh-empty">최근 주문 정보가 없습니다.<div style={{ marginTop: 20 }}><button className="sh-btn line sm" onClick={() => nav("lookup")}>주문 조회</button></div></div>
        ) : (
          <React.Fragment>
            <h1 className="sh-title">{o.pay_method === "bank" ? "주문이 접수되었습니다" : "결제가 완료되었습니다"}</h1>
            <p className="sh-sub">주문번호와 휴대폰 번호로 언제든 배송 상황을 확인할 수 있습니다.</p>

            <div className="sh-box">
              <div style={{ fontSize: 12, color: "var(--mute)", marginBottom: 4 }}>주문번호</div>
              <div className="big">{o.order_no}<button className="sh-copy" onClick={() => cp(o.order_no, "no")}>{copied === "no" ? "복사됨" : "복사"}</button></div>
            </div>

            {o.pay_method === "bank" && o.bank && (
              <div className="sh-box" style={{ background: "var(--bone)", borderColor: "var(--bone)" }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>아래 계좌로 입금해 주세요</h2>
                <dl className="sh-kv">
                  <dt>입금 금액</dt><dd><b style={{ fontSize: 18 }}>{S.won(o.amount)}</b></dd>
                  <dt>입금 계좌</dt>
                  <dd>{o.bank.name} {o.bank.account}<button className="sh-copy" onClick={() => cp(o.bank.account.replace(/-/g, ""), "acc")}>{copied === "acc" ? "복사됨" : "계좌 복사"}</button></dd>
                  <dt>예금주</dt><dd>{o.bank.holder}</dd>
                  <dt>입금 기한</dt><dd>{dueText}</dd>
                </dl>
                <p className="sh-note" style={{ marginTop: 14 }}>입금이 확인되면 영업일 기준 2–3일 안에 출고됩니다. 기한 안에 입금되지 않으면 주문이 자동 취소됩니다.</p>
              </div>
            )}

            <dl className="sh-sum" style={{ borderTop: "1px solid var(--ink)" }}>
              <dt>상품 금액</dt><dd>{S.won(o.items_amount)}</dd>
              <dt>배송비</dt><dd>{o.shipping_fee ? S.won(o.shipping_fee) : "무료"}</dd>
              <dt className="tot">총 결제 금액</dt><dd className="tot">{S.won(o.amount)}</dd>
            </dl>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 20 }}>
              <button className="sh-btn line" onClick={() => nav("home")}>홈으로</button>
              <button className="sh-btn" onClick={() => nav("lookup")}>주문 조회</button>
            </div>
          </React.Fragment>
        )}
      </div>
      <SikFooter nav={nav} />
    </div>
  );
}

/* ── 주문 조회 ───────────────────────────────────────────── */
function LookupPage({ nav }) {
  const S = window.SIK_SHOP;
  const { SikHeader, SikFooter } = window;
  const last = S.lastOrder();
  const [no, setNo] = React.useState(last ? last.order_no : "");
  const [phone, setPhone] = React.useState("");
  const [res, setRes] = React.useState(undefined);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  const go = (e) => {
    e.preventDefault(); setBusy(true); setErr("");
    S.lookup(no, phone).then((r) => { setRes(r); setBusy(false); }).catch((e2) => { setErr(S.errorText(e2)); setBusy(false); });
  };

  const steps = ["주문 접수", "결제 완료", "배송중", "배송 완료"];
  const stepOf = (s) => ({ pending: 0, awaiting_deposit: 0, paid: 1, shipped: 2, delivered: 3 })[s];
  const fmt = (t) => { if (!t) return ""; const d = new Date(t); return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`; };

  return (
    <div style={{ background: "var(--paper)" }}>
      <ShopStyle />
      <SikHeader nav={nav} active={null} />
      <TestBanner />
      <div className="sh-wrap">
        <h1 className="sh-title">주문 조회</h1>
        <p className="sh-sub">주문 완료 화면에 나온 주문번호와, 주문할 때 적은 휴대폰 번호를 입력하세요.</p>
        <form onSubmit={go} className="sh-sec">
          <div className="sh-field">
            <label htmlFor="lk-no">주문번호</label>
            <input id="lk-no" className="sh-in" placeholder="SIK-000000-0000" value={no} onChange={(e) => setNo(e.target.value)} required />
          </div>
          <div className="sh-field">
            <label htmlFor="lk-ph">휴대폰 번호</label>
            <input id="lk-ph" className="sh-in" type="tel" inputMode="numeric" placeholder="010-0000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          {err && <div className="sh-err" role="alert">{err}</div>}
          <button className="sh-btn sh-full" disabled={busy}>{busy ? "조회 중…" : "조회하기"}</button>
        </form>

        {res === null && <div className="sh-err" role="alert">일치하는 주문이 없습니다. 주문번호와 휴대폰 번호를 다시 확인해 주세요.</div>}
        {res && (
          <section className="sh-sec">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <h2 style={{ margin: 0 }}>{res.order_no}</h2>
              <span className="sh-pill" data-s={res.status}>{S.STATUS[res.status]}</span>
            </div>
            {stepOf(res.status) != null && (
              <div className="sh-steps" aria-label="진행 단계">
                {steps.map((s, i) => <span key={s} className={i <= stepOf(res.status) ? "on" : ""}>{s}</span>)}
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              {(res.items || []).map((it, i) => (
                <div key={i} className="sh-row" style={{ gridTemplateColumns: "1fr auto" }}>
                  <div><div className="nm">{it.name}</div><div className="op">{[it.option, `${it.qty}개`].filter(Boolean).join(" · ")}</div></div>
                  <div className="pr">{S.won(it.unit_price * it.qty)}</div>
                </div>
              ))}
            </div>
            <dl className="sh-kv" style={{ marginTop: 16 }}>
              <dt>주문일</dt><dd>{fmt(res.created_at)}</dd>
              <dt>받는 분</dt><dd>{res.buyer_name}</dd>
              <dt>배송지</dt><dd>{res.address}</dd>
              <dt>결제 금액</dt><dd><b>{S.won(res.amount)}</b> ({S.PAY.filter((p) => p.key === res.pay_method)[0].label})</dd>
              {res.status === "awaiting_deposit" && res.bank && (
                <React.Fragment><dt>입금 계좌</dt><dd>{res.bank.name} {res.bank.account} ({res.bank.holder})</dd></React.Fragment>
              )}
              {res.tracking_no && (
                <React.Fragment>
                  <dt>송장</dt>
                  <dd>{res.courier} {res.tracking_no} <a className="sh-copy" href={S.trackUrl(res.courier, res.tracking_no)} target="_blank" rel="noreferrer">배송 추적</a></dd>
                </React.Fragment>
              )}
            </dl>
          </section>
        )}
      </div>
      <SikFooter nav={nav} />
    </div>
  );
}

/* ── 관리자 ──────────────────────────────────────────────── */
function AdminPage({ nav }) {
  const S = window.SIK_SHOP;
  const [session, setSession] = React.useState(() => S.adminSession());
  const [cred, setCred] = React.useState({ email: "", password: "" });
  const [orders, setOrders] = React.useState(null);
  const [tab, setTab] = React.useState("todo");
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState("");
  const [ship, setShip] = React.useState({});

  const load = () => S.adminOrders().then(setOrders).catch((e) => {
    if (e.status === 401) { S.adminLogout(); setSession(null); } else setErr(S.errorText(e));
  });
  React.useEffect(() => { if (session) load(); }, [session]);

  const login = (e) => {
    e.preventDefault(); setErr(""); setBusy("login");
    S.adminLogin(cred.email, cred.password)
      .then(() => { setSession(S.adminSession()); setCred({ email: "", password: "" }); })
      .catch(() => setErr("이메일 또는 비밀번호가 맞지 않습니다."))
      .then(() => setBusy(""));
  };
  const act = (o, action, extra, confirmMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(o.order_no); setErr("");
    S.adminUpdate(o.order_no, action, extra).then(load).catch((e) => setErr(S.errorText(e))).then(() => setBusy(""));
  };

  const head = (
    <React.Fragment>
      <ShopStyle />
      <style>{"html,body{background:var(--paper)}"}</style>
    </React.Fragment>
  );

  if (!session) {
    return (
      <div>
        {head}
        <form className="sh-wrap" style={{ maxWidth: 420 }} onSubmit={login}>
          <img src={window.SIK_LOGO.light} alt="SIK" style={{ height: 24, marginBottom: 28 }} />
          <h1 className="sh-title">주문 관리</h1>
          <p className="sh-sub">Supabase 에서 만든 관리자 계정으로 로그인하세요.</p>
          {err && <div className="sh-err" role="alert">{err}</div>}
          <div className="sh-field"><label htmlFor="ad-em">이메일</label><input id="ad-em" className="sh-in" type="email" autoComplete="username" value={cred.email} onChange={(e) => setCred({ ...cred, email: e.target.value })} required /></div>
          <div className="sh-field"><label htmlFor="ad-pw">비밀번호</label><input id="ad-pw" className="sh-in" type="password" autoComplete="current-password" value={cred.password} onChange={(e) => setCred({ ...cred, password: e.target.value })} required /></div>
          <button className="sh-btn sh-full" disabled={busy === "login"}>{busy === "login" ? "로그인 중…" : "로그인"}</button>
          <p className="sh-note" style={{ marginTop: 16 }}><a href="#" onClick={(e) => { e.preventDefault(); nav("home"); }}>← 사이트로</a></p>
        </form>
      </div>
    );
  }

  const TABS = [
    ["todo", "처리할 주문", (o) => o.status === "awaiting_deposit" || o.status === "paid"],
    ["awaiting_deposit", "입금 대기", (o) => o.status === "awaiting_deposit"],
    ["paid", "발송 대기", (o) => o.status === "paid"],
    ["shipped", "배송중", (o) => o.status === "shipped"],
    ["done", "완료·취소", (o) => ["delivered", "cancelled", "refunded"].includes(o.status)],
    ["all", "전체", () => true],
  ];
  const list = orders || [];
  const filt = TABS.filter((t) => t[0] === tab)[0][2];
  const shown = list.filter(filt).filter((o) => o.status !== "pending" || tab === "all");
  const when = (t) => { const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
  const phone = (p) => p.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");

  return (
    <div>
      {head}
      <div className="sh-wrap wide">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div>
            <h1 className="sh-title">주문 관리</h1>
            <p className="sh-sub" style={{ margin: 0 }}>{session.email}</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="sh-btn line xs" onClick={load}>새로고침</button>
            <button className="sh-btn line xs" onClick={() => { S.adminLogout(); setSession(null); setOrders(null); }}>로그아웃</button>
          </div>
        </div>

        <div className="sh-tabs" role="group" aria-label="주문 상태">
          {TABS.map(([k, label, fn]) => (
            <button key={k} className="sh-chip" aria-pressed={tab === k} onClick={() => setTab(k)}>
              {label} {list.filter(fn).filter((o) => o.status !== "pending" || k === "all").length}
            </button>
          ))}
        </div>
        {err && <div className="sh-err" role="alert">{err}</div>}
        {orders === null && <div className="sh-empty">불러오는 중…</div>}
        {orders && shown.length === 0 && <div className="sh-empty">해당하는 주문이 없습니다.</div>}

        {shown.map((o) => {
          const s = ship[o.order_no] || { courier: S.COURIERS[0], tracking: o.tracking_no || "" };
          const address = `(${o.zipcode}) ${o.address1} ${o.address2}`.trim();
          return (
            <article key={o.id} className="sh-order">
              <header>
                <div>
                  <span className="no">{o.order_no}</span> <span className="when">{when(o.created_at)}</span>
                </div>
                <span className="sh-pill" data-s={o.status}>{S.STATUS[o.status]}</span>
              </header>
              <dl className="sh-kv" style={{ fontSize: 13 }}>
                <dt>받는 분</dt><dd>{o.buyer_name} · <a href={"tel:" + o.phone}>{phone(o.phone)}</a></dd>
                <dt>주소</dt><dd>{address}<button className="sh-copy" onClick={() => copyText(`${o.buyer_name} ${phone(o.phone)} ${address}`)}>복사</button></dd>
                {o.memo && <React.Fragment><dt>요청사항</dt><dd>{o.memo}</dd></React.Fragment>}
                <dt>결제</dt>
                <dd><b>{S.won(o.amount)}</b> · {S.PAY.filter((p) => p.key === o.pay_method)[0].label}
                  {o.pay_method === "bank" && <React.Fragment> · 입금자 <b>{o.depositor}</b></React.Fragment>}</dd>
                {o.tracking_no && <React.Fragment><dt>송장</dt><dd>{o.courier} {o.tracking_no}</dd></React.Fragment>}
                {o.admin_note && <React.Fragment><dt>메모</dt><dd>{o.admin_note}</dd></React.Fragment>}
              </dl>
              <div className="items">
                {(o.order_items || []).map((it) => <div key={it.id}>{it.name}{it.option && ` · ${it.option}`} × {it.qty} <span style={{ color: "var(--mute)" }}>({S.won(it.unit_price * it.qty)})</span></div>)}
              </div>
              <div className="acts">
                {o.status === "awaiting_deposit" && (
                  <button className="sh-btn xs" disabled={busy === o.order_no}
                    onClick={() => act(o, "mark_paid", null, `${o.depositor} 님 ${S.won(o.amount)} 입금을 확인했나요?`)}>입금 확인</button>
                )}
                {(o.status === "paid" || o.status === "shipped") && (
                  <React.Fragment>
                    <select aria-label="택배사" value={s.courier} onChange={(e) => setShip({ ...ship, [o.order_no]: { ...s, courier: e.target.value } })}>
                      {S.COURIERS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <input aria-label="송장번호" placeholder="송장번호" value={s.tracking} inputMode="numeric"
                      onChange={(e) => setShip({ ...ship, [o.order_no]: { ...s, tracking: e.target.value } })} />
                    <button className="sh-btn xs" disabled={busy === o.order_no || !s.tracking}
                      onClick={() => act(o, "ship", s)}>{o.status === "shipped" ? "송장 수정" : "발송 처리"}</button>
                  </React.Fragment>
                )}
                {o.status === "shipped" && <button className="sh-btn line xs" disabled={busy === o.order_no} onClick={() => act(o, "deliver")}>배송 완료</button>}
                {o.status === "paid" && o.pay_method !== "bank" && (
                  <button className="sh-btn line xs" disabled={busy === o.order_no}
                    onClick={() => {
                      if (!window.confirm(`${o.order_no} 결제 ${S.won(o.amount)}을 환불(결제 취소)할까요? 손님 카드·간편결제로 바로 돌아갑니다.`)) return;
                      setBusy(o.order_no); setErr("");
                      S.adminRefund(o.order_no).then(load).catch((e) => setErr("환불하지 못했습니다. " + e.message)).then(() => setBusy(""));
                    }}>결제 취소·환불</button>
                )}
                {["pending", "awaiting_deposit", "paid"].includes(o.status) && (o.status !== "paid" || o.pay_method === "bank") && (
                  <button className="sh-btn line xs" disabled={busy === o.order_no}
                    onClick={() => act(o, "cancel", { note: "[관리자 취소]" }, `${o.order_no} 주문을 취소할까요? 재고가 되돌아갑니다.${o.status === "paid" ? "\n입금된 금액은 직접 환불해 주셔야 합니다." : ""}`)}>주문 취소</button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { PdpBuy, CartLink, CartPage, CheckoutPage, DonePage, LookupPage, AdminPage });
