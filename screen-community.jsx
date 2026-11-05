/* SIK Storefront — 상품 후기 · 상품 문의(Q&A), 관리자 문의·후기 관리, 사장님 카톡 알림 연결
   서버: supabase/007_qna_reviews_notify.sql, supabase/functions/notify. 호출은 shop.js (window.SIK_SHOP). */

const COMM_CSS = `
.cm{max-width:760px;margin:0 auto;padding:clamp(40px,6vw,72px) var(--gutter-page) 8px;font-family:var(--font-sans);color:var(--ink)}
.cm-tabs{display:flex;border-bottom:1px solid var(--ink);margin-bottom:20px}
.cm-tabs button{flex:1;height:52px;border:0;background:none;font:inherit;font-size:15px;font-weight:600;color:var(--stone);cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px}
.cm-tabs button[aria-selected="true"]{color:var(--ink);border-bottom-color:var(--ink)}
.cm-sum{display:flex;align-items:center;gap:16px;padding:8px 0 20px;border-bottom:1px solid var(--warm-line)}
.cm-avg{font-size:34px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}
.cm-stars{color:var(--ink);letter-spacing:2px;font-size:15px}
.cm-stars .off{color:var(--hairline)}
.cm-item{padding:18px 0;border-bottom:1px solid var(--warm-line)}
.cm-meta{display:flex;gap:10px;align-items:center;font-size:12px;color:var(--mute);margin-bottom:8px;flex-wrap:wrap}
.cm-badge{font-size:11px;font-weight:700;padding:3px 6px;background:var(--soft-cloud);color:var(--ink)}
.cm-body{font-size:14px;line-height:1.75;white-space:pre-wrap;word-break:keep-all;margin:0}
.cm-photos{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.cm-photos img{width:88px;height:88px;object-fit:cover;background:var(--soft-cloud);cursor:zoom-in;display:block}
.cm-q{width:100%;text-align:left;background:none;border:0;padding:16px 0;font:inherit;cursor:pointer;color:var(--ink);display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:start}
.cm-q .st{font-size:11px;font-weight:700;padding:3px 6px;white-space:nowrap}
.cm-q .st.done{background:var(--ink);color:var(--on-ink)}
.cm-q .st.wait{background:var(--soft-cloud);color:var(--mute)}
.cm-q .tx{font-size:14px;line-height:1.6;word-break:keep-all}
.cm-q .who{font-size:12px;color:var(--mute);white-space:nowrap}
.cm-a{background:var(--soft-cloud);padding:14px 16px;margin:0 0 16px;font-size:14px;line-height:1.75;white-space:pre-wrap;word-break:keep-all}
.cm-a b{display:block;font-size:12px;margin-bottom:4px}
.cm-form{border:1px solid var(--ink);padding:18px;margin:16px 0}
.cm-rate{display:flex;gap:4px}
.cm-rate button{width:40px;height:40px;border:1px solid var(--hairline);background:var(--paper);font-size:20px;cursor:pointer;color:var(--hairline);line-height:1}
.cm-rate button.on{color:var(--ink);border-color:var(--ink)}
.cm-zoom{position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;cursor:zoom-out;padding:16px}
.cm-zoom img{max-width:100%;max-height:100%}
`;

const Stars = ({ n, size }) => (
  <span className="cm-stars" style={size ? { fontSize: size } : null} aria-label={`별점 ${n}점`}>
    {"★★★★★".split("").map((s, i) => <span key={i} className={i < Math.round(n) ? "" : "off"}>★</span>)}
  </span>
);
const fmtDate = (t) => { const d = new Date(t); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`; };

function ProductCommunity({ product }) {
  const S = window.SIK_SHOP;
  const [tab, setTab] = React.useState("review");
  const [rv, setRv] = React.useState(null);
  const [qa, setQa] = React.useState(null);
  const loadRv = () => S.reviewList(product.id).then(setRv).catch(() => setRv({ count: 0, items: [] }));
  const loadQa = () => S.qnaList(product.id).then(setQa).catch(() => setQa([]));
  React.useEffect(() => { loadRv(); loadQa(); }, [product.id]);
  return (
    <section className="cm" id="reviews">
      <style>{COMM_CSS}</style>
      <div className="cm-tabs" role="tablist">
        <button role="tab" aria-selected={tab === "review"} onClick={() => setTab("review")}>후기 {rv ? rv.count : ""}</button>
        <button role="tab" aria-selected={tab === "qna"} onClick={() => setTab("qna")}>문의 {qa ? qa.length : ""}</button>
      </div>
      {tab === "review" ? <Reviews product={product} data={rv} reload={loadRv} /> : <Qna product={product} list={qa} reload={loadQa} />}
    </section>
  );
}

/* ── 후기 ───────────────────────────────────────────────── */
function Reviews({ product, data, reload }) {
  const [writing, setWriting] = React.useState(false);
  const [zoom, setZoom] = React.useState(null);
  if (!data) return <div className="sh-empty">불러오는 중…</div>;
  return (
    <div>
      <div className="cm-sum">
        {data.count > 0 ? (
          <React.Fragment>
            <span className="cm-avg">{Number(data.avg).toFixed(1)}</span>
            <div><Stars n={data.avg} size={18} /><div style={{ fontSize: 12, color: "var(--mute)", marginTop: 4 }}>구매 후기 {data.count}개</div></div>
          </React.Fragment>
        ) : <span style={{ fontSize: 14, color: "var(--mute)" }}>아직 후기가 없습니다. 첫 후기를 남겨 주세요.</span>}
        <button className="sh-btn line sm" style={{ marginLeft: "auto" }} onClick={() => setWriting(!writing)}>{writing ? "닫기" : "후기 쓰기"}</button>
      </div>
      {writing && <ReviewForm product={product} onDone={() => { setWriting(false); reload(); }} />}
      {data.items.map((r) => (
        <article key={r.id} className="cm-item">
          <div className="cm-meta"><Stars n={r.rating} /><span>{r.author}</span><span>{fmtDate(r.created_at)}</span>{r.option && <span>{r.option}</span>}<span className="cm-badge">구매 확인</span></div>
          <p className="cm-body">{r.body}</p>
          {r.photos && r.photos.length > 0 && (
            <div className="cm-photos">{r.photos.map((p) => <img key={p} src={p} alt="후기 사진" loading="lazy" onClick={() => setZoom(p)} />)}</div>
          )}
        </article>
      ))}
      {zoom && <div className="cm-zoom" onClick={() => setZoom(null)} role="dialog" aria-label="사진 크게 보기"><img src={zoom} alt="" /></div>}
    </div>
  );
}

function ReviewForm({ product, onDone }) {
  const S = window.SIK_SHOP;
  const last = S.lastOrder();
  const [step, setStep] = React.useState("find");
  const [f, setF] = React.useState({ orderNo: last ? last.order_no : "", phone: "", author: "", rating: 0, body: "" });
  const [targets, setTargets] = React.useState([]);
  const [pick, setPick] = React.useState(null);
  const [photos, setPhotos] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  const find = (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    S.reviewTargets(f.orderNo, f.phone).then((r) => {
      setBusy(false);
      if (!r.ok) { setErr(S.errorText({ message: "SIK:" + r.code + ":" })); return; }
      const mine = r.items.filter((i) => i.product_id === product.id);
      if (!mine.length) { setErr("이 주문에는 이 상품이 없습니다. 후기는 산 상품의 페이지에서 쓸 수 있습니다."); return; }
      if (mine.every((i) => i.done)) { setErr("이 상품은 이미 후기를 쓰셨습니다."); return; }
      setTargets(mine); setPick(mine.filter((i) => !i.done)[0]); setStep("write");
    }).catch((e2) => { setBusy(false); setErr(S.errorText(e2)); });
  };
  const addPhotos = (e) => {
    const files = [...e.target.files].slice(0, 4 - photos.length);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true); setErr("");
    Promise.all(files.map(S.uploadReviewPhoto)).then((urls) => setPhotos((p) => [...p, ...urls].slice(0, 4)))
      .catch((e2) => setErr(e2.message)).then(() => setBusy(false));
  };
  const submit = (e) => {
    e.preventDefault();
    if (!f.rating) { setErr("별점을 골라 주세요."); return; }
    setBusy(true); setErr("");
    S.reviewCreate({ ...f, productId: pick.product_id, option: pick.option, photos })
      .then(onDone).catch((e2) => { setErr(S.errorText(e2)); setBusy(false); });
  };

  return (
    <div className="cm-form">
      {err && <div className="sh-err" role="alert">{err}</div>}
      {step === "find" ? (
        <form onSubmit={find}>
          <p className="sh-note" style={{ marginBottom: 14 }}>상품을 받은 분만 후기를 쓸 수 있습니다. 주문번호와 주문할 때 적은 휴대폰 번호를 입력해 주세요.</p>
          <div className="sh-field"><label htmlFor="rv-no">주문번호</label><input id="rv-no" className="sh-in" placeholder="SIK-000000-0000" value={f.orderNo} onChange={(e) => setF({ ...f, orderNo: e.target.value })} required /></div>
          <div className="sh-field"><label htmlFor="rv-ph">휴대폰 번호</label><input id="rv-ph" className="sh-in" type="tel" inputMode="numeric" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
          <button className="sh-btn sh-full" disabled={busy}>{busy ? "확인 중…" : "주문 확인"}</button>
        </form>
      ) : (
        <form onSubmit={submit}>
          {targets.length > 1 && (
            <div className="sh-field"><label>옵션</label>
              <select className="sh-in" value={pick.option} onChange={(e) => setPick(targets.find((t) => t.option === e.target.value))}>
                {targets.map((t) => <option key={t.option} value={t.option} disabled={t.done}>{t.option || "기본"}{t.done ? " (작성 완료)" : ""}</option>)}
              </select>
            </div>
          )}
          <div className="sh-field"><label>별점</label>
            <div className="cm-rate" role="radiogroup" aria-label="별점">
              {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={f.rating === n} aria-label={`${n}점`} className={n <= f.rating ? "on" : ""} onClick={() => setF({ ...f, rating: n })}>★</button>)}
            </div>
          </div>
          <div className="sh-field"><label htmlFor="rv-body">후기</label>
            <textarea id="rv-body" className="sh-in" rows={5} style={{ height: "auto", padding: 12 }} maxLength={2000} placeholder="사이즈, 착용감, 색감 등 다른 분들께 도움이 되는 이야기를 들려주세요." value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
          </div>
          <div className="sh-field"><label>사진 (선택, 최대 4장)</label>
            <div className="cm-photos" style={{ marginTop: 0 }}>
              {photos.map((p) => <img key={p} src={p} alt="" onClick={() => setPhotos(photos.filter((x) => x !== p))} title="눌러서 빼기" />)}
              {photos.length < 4 && (
                <label className="sh-btn line sm" style={{ width: 88, height: 88, padding: 0, cursor: "pointer" }}>
                  +<input type="file" accept="image/*" multiple onChange={addPhotos} style={{ display: "none" }} />
                </label>
              )}
            </div>
          </div>
          <div className="sh-field"><label htmlFor="rv-name">이름 표시 <span style={{ fontWeight: 400, color: "var(--mute)" }}>(비우면 주문자 이름 첫 글자만 보입니다)</span></label>
            <input id="rv-name" className="sh-in" maxLength={20} value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} />
          </div>
          <button className="sh-btn sh-full" disabled={busy}>{busy ? "등록 중…" : "후기 등록"}</button>
        </form>
      )}
    </div>
  );
}

/* ── 상품 문의 ─────────────────────────────────────────────── */
function Qna({ product, list, reload }) {
  const S = window.SIK_SHOP;
  const [writing, setWriting] = React.useState(false);
  const [open, setOpen] = React.useState(null);
  const [secret, setSecret] = React.useState({});   // 비밀번호로 연 비밀글 { id: {question, answer} }
  const [pw, setPw] = React.useState("");
  const [err, setErr] = React.useState("");
  if (!list) return <div className="sh-empty">불러오는 중…</div>;

  const unlock = (q) => {
    setErr("");
    S.qnaView(q.id, pw).then((r) => { if (r) { setSecret({ ...secret, [q.id]: r }); setPw(""); } else setErr("비밀번호가 맞지 않습니다."); })
      .catch(() => setErr("확인하지 못했습니다."));
  };

  return (
    <div>
      <div className="cm-sum">
        <span style={{ fontSize: 14, color: "var(--mute)" }}>사이즈·배송 등 궁금한 점을 남겨 주세요. 답변은 보통 하루 안에 드립니다.</span>
        <button className="sh-btn line sm" style={{ marginLeft: "auto", flex: "none" }} onClick={() => setWriting(!writing)}>{writing ? "닫기" : "문의하기"}</button>
      </div>
      {writing && <QnaForm product={product} onDone={() => { setWriting(false); reload(); }} />}
      {list.length === 0 && <div className="sh-empty">아직 문의가 없습니다.</div>}
      {list.map((q) => {
        const s = secret[q.id], isOpen = open === q.id;
        const text = q.is_private && !s ? "🔒 비밀글입니다." : (s ? s.question : q.question);
        const answer = s ? s.answer : q.answer;
        return (
          <div key={q.id} style={{ borderBottom: "1px solid var(--warm-line)" }}>
            <button className="cm-q" aria-expanded={isOpen} onClick={() => { setOpen(isOpen ? null : q.id); setErr(""); setPw(""); }}>
              <span className={"st " + (q.answered ? "done" : "wait")}>{q.answered ? "답변완료" : "답변대기"}</span>
              <span className="tx">{text}</span>
              <span className="who">{q.author} · {fmtDate(q.created_at)}</span>
            </button>
            {isOpen && (q.is_private && !s ? (
              <div className="cm-a">
                <b>작성할 때 정한 비밀번호를 입력하세요</b>
                <div className="sh-2" style={{ marginTop: 6 }}>
                  <input className="sh-in" type="password" value={pw} onChange={(e) => setPw(e.target.value)} aria-label="비밀번호" onKeyDown={(e) => { if (e.key === "Enter") unlock(q); }} />
                  <button className="sh-btn sm" onClick={() => unlock(q)}>확인</button>
                </div>
                {err && <div style={{ color: "var(--sale)", fontSize: 12, marginTop: 6 }}>{err}</div>}
              </div>
            ) : answer ? (
              <div className="cm-a"><b>SIK 답변</b>{answer}</div>
            ) : (
              <div className="cm-a" style={{ color: "var(--mute)" }}>답변을 준비하고 있습니다.</div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function QnaForm({ product, onDone }) {
  const S = window.SIK_SHOP;
  const [f, setF] = React.useState({ author: "", password: "", question: "", isPrivate: false });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const submit = (e) => {
    e.preventDefault(); setBusy(true); setErr("");
    S.qnaAsk(product.id, f).then(onDone).catch((e2) => { setErr(S.errorText(e2)); setBusy(false); });
  };
  return (
    <form className="cm-form" onSubmit={submit}>
      {err && <div className="sh-err" role="alert">{err}</div>}
      <div className="sh-field"><label htmlFor="qa-q">문의 내용</label>
        <textarea id="qa-q" className="sh-in" rows={4} style={{ height: "auto", padding: 12 }} maxLength={1000} placeholder="예: 키 178cm, 75kg 인데 L 사이즈가 맞을까요?" value={f.question} onChange={(e) => setF({ ...f, question: e.target.value })} required />
      </div>
      <div className="sh-pay" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="sh-field"><label htmlFor="qa-n">이름</label><input id="qa-n" className="sh-in" maxLength={20} value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} required /></div>
        <div className="sh-field"><label htmlFor="qa-p">비밀번호 (4자리 이상)</label><input id="qa-p" className="sh-in" type="password" maxLength={20} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required /></div>
      </div>
      <label className="sh-check"><input type="checkbox" checked={f.isPrivate} onChange={(e) => setF({ ...f, isPrivate: e.target.checked })} /><span>비밀글로 쓰기 (나와 판매자만 볼 수 있음)</span></label>
      <p className="sh-note" style={{ margin: "4px 0 12px" }}>연락처·주소 같은 개인정보는 적지 말아 주세요. 주문 관련 문의는 비밀글을 권장합니다.</p>
      <button className="sh-btn sh-full" disabled={busy}>{busy ? "등록 중…" : "문의 등록"}</button>
    </form>
  );
}

/* ── 관리자: 문의 답변 · 후기 숨기기 ───────────────────────── */
function AdminCommunity() {
  const S = window.SIK_SHOP;
  const [qs, setQs] = React.useState(null);
  const [rs, setRs] = React.useState(null);
  const [draft, setDraft] = React.useState({});
  const [msg, setMsg] = React.useState("");
  const names = Object.fromEntries(window.SIK_DATA.products.map((p) => [p.id, p.name]));
  const load = () => { S.adminQna().then(setQs).catch((e) => setMsg(e.message)); S.adminReviews().then(setRs).catch((e) => setMsg(e.message)); };
  React.useEffect(load, []);
  const saveAnswer = (q) => S.adminQnaSave(q.id, draft[q.id] != null ? draft[q.id] : (q.answer || ""), null).then(() => { setMsg("답변을 저장했습니다."); load(); }).catch((e) => setMsg(e.message));
  const when = (t) => { const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
  const waiting = (qs || []).filter((q) => !q.answer && !q.hidden);
  return (
    <div>
      {msg && <div className="sh-err" style={{ background: "var(--soft-cloud)", color: "var(--ink)" }} role="status">{msg}</div>}
      <h2 style={{ fontSize: 15, margin: "8px 0 12px" }}>상품 문의 {qs && <span style={{ color: "var(--sale)" }}>· 답변 대기 {waiting.length}</span>}</h2>
      {qs === null ? <div className="sh-empty">불러오는 중…</div> : qs.length === 0 ? <div className="sh-empty">문의가 없습니다.</div> : qs.map((q) => (
        <article key={q.id} className="sh-order" style={{ opacity: q.hidden ? 0.5 : 1 }}>
          <header>
            <div><b>{names[q.product_id] || q.product_id}</b> <span className="when">{q.author} · {when(q.created_at)}{q.is_private ? " · 🔒 비밀글" : ""}</span></div>
            <span className="sh-pill" data-s={q.answer ? "delivered" : "awaiting_deposit"}>{q.hidden ? "숨김" : q.answer ? "답변완료" : "답변대기"}</span>
          </header>
          <p className="cm-body" style={{ margin: "0 0 10px" }}>{q.question}</p>
          <textarea className="sh-in" rows={3} style={{ height: "auto", padding: 10 }} placeholder="답변을 적고 저장하세요"
            value={draft[q.id] != null ? draft[q.id] : (q.answer || "")} onChange={(e) => setDraft({ ...draft, [q.id]: e.target.value })} aria-label="답변" />
          <div className="acts">
            <button className="sh-btn xs" onClick={() => saveAnswer(q)}>답변 저장</button>
            <button className="sh-btn line xs" onClick={() => S.adminQnaSave(q.id, null, !q.hidden).then(load)}>{q.hidden ? "다시 보이기" : "숨기기"}</button>
          </div>
        </article>
      ))}

      <h2 style={{ fontSize: 15, margin: "32px 0 12px" }}>구매 후기</h2>
      {rs === null ? <div className="sh-empty">불러오는 중…</div> : rs.length === 0 ? <div className="sh-empty">후기가 없습니다.</div> : rs.map((r) => (
        <article key={r.id} className="sh-order" style={{ opacity: r.hidden ? 0.5 : 1 }}>
          <header>
            <div><b>{names[r.product_id] || r.product_id}</b>{r.option && ` · ${r.option}`} <span className="when">{r.author} · {when(r.created_at)}</span></div>
            <Stars n={r.rating} />
          </header>
          <p className="cm-body">{r.body}</p>
          {r.photos && r.photos.length > 0 && <div className="cm-photos">{r.photos.map((p) => <a key={p} href={p} target="_blank" rel="noreferrer"><img src={p} alt="" /></a>)}</div>}
          <div className="acts"><button className="sh-btn line xs" onClick={() => S.adminReviewHide(r.id, !r.hidden).then(load)}>{r.hidden ? "다시 보이기" : "숨기기"}</button></div>
        </article>
      ))}
      <style>{COMM_CSS}</style>
    </div>
  );
}

/* ── 관리자: 사장님 카톡 알림 연결 ─────────────────────────── */
function AdminNotify() {
  const S = window.SIK_SHOP;
  const [st, setSt] = React.useState(null);
  // 카카오 동의 후 돌아오면 주소에 ?notify=결과 가 붙어 온다
  const [msg, setMsg] = React.useState(() => {
    const r = new URLSearchParams(location.search).get("notify");
    if (r) history.replaceState(history.state, "", location.pathname + location.hash);
    return ({ ok: "✅ 카톡 알림이 연결되었습니다. 카카오톡 '나와의 채팅'에 확인 메시지가 왔는지 보세요.",
      nosend: "연결은 됐지만 확인 메시지를 못 보냈습니다. 카카오 동의항목에서 '카카오톡 메시지 전송'이 켜져 있는지 확인해 주세요.",
      expired: "연결 요청 시간이 지났습니다. 다시 눌러 주세요.", cancel: "카카오 동의가 취소되었습니다." })[r] || "";
  });
  const load = () => S.notifyStatus().then(setSt).catch((e) => setMsg(e.message));
  React.useEffect(load, []);
  const connect = () => S.notifyAction("connect-url").then((r) => { if (r.url) location.href = r.url; else setMsg("연결 주소를 만들지 못했습니다."); }).catch((e) => setMsg(e.message));
  const test = () => S.notifyAction("test").then((r) => setMsg(r.ok ? "시험 메시지를 보냈습니다. 카카오톡 '나와의 채팅'을 확인하세요." : "보내지 못했습니다. 다시 연결해 주세요. (" + (r.code || r.status) + ")")).catch((e) => setMsg(e.message));
  const toggle = () => S.notifyAction("toggle", { enabled: !st.enabled }).then(load);
  return (
    <div className="sh-box" style={{ maxWidth: 560, borderColor: "var(--warm-line)" }}>
      <h2 style={{ fontSize: 15, margin: "0 0 6px" }}>카톡 알림</h2>
      <p className="sh-note" style={{ marginBottom: 12 }}>새 주문(무통장 접수·결제 완료), 상품 문의, 후기가 생기면 사장님 카카오톡 <b>'나와의 채팅'</b>으로 알려드립니다.</p>
      {msg && <p className="sh-note" style={{ color: "var(--ink)", marginBottom: 10 }}>{msg}</p>}
      {st === null ? <p className="sh-note">확인 중…</p> : st.connected ? (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span className="sh-pill" data-s={st.enabled ? "delivered" : "cancelled"}>{st.enabled ? "켜짐" : "꺼짐"}</span>
          <button className="sh-btn xs" onClick={test}>시험 메시지</button>
          <button className="sh-btn line xs" onClick={toggle}>{st.enabled ? "끄기" : "켜기"}</button>
          <button className="sh-btn line xs" onClick={connect}>다시 연결</button>
        </div>
      ) : (
        <button className="sh-kakao" onClick={connect} style={{ maxWidth: 320 }}>카카오톡으로 알림 받기 연결</button>
      )}
    </div>
  );
}

Object.assign(window, { ProductCommunity, AdminCommunity, AdminNotify });
