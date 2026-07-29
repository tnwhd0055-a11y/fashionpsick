/* SIK Storefront — shared layout + placeholder helpers.
   Exports to window: Studio, Editorial, SectionHead, PageWrap, SikHeader, SikFooter. */

/* ============================================================
   에디토리얼 헤더 / 푸터 (2026-07 리디자인)
   ------------------------------------------------------------
   서체는 세 레지스터로만 쓴다. 섞으면 새 워드마크와 싸운다.
     .sk-ser   세리프  — 브랜드 목소리 · 내비게이션
     .sk-hair  얇은 대문자 — 가격 · 품번 · 라벨 같은 데이터
     .sk-disp  굵은 소문자 — 로고와 같은 목소리, 아주 드물게
   클래스는 기존 .sik-* 와 부딪히지 않게 .sk-* 를 쓴다.
   ============================================================ */
const SIK_UI_CSS = `
:root{ --sk-pad:clamp(20px,4.5vw,68px); --sk-nav:clamp(12px,1.05vw,15px); --sk-tag:clamp(12px,1vw,14px); }

.sk-ser{font-family:var(--font-serif);font-weight:400;letter-spacing:.01em;line-height:1.3}
.sk-cap-track{letter-spacing:.045em}
.sk-hair{font-family:var(--font-grot);font-weight:400;font-size:11px;letter-spacing:.2em;text-transform:uppercase;line-height:1}
.sk-hair-sm{font-family:var(--font-grot);font-weight:400;font-size:10px;letter-spacing:.22em;text-transform:uppercase;line-height:1}
.sk-num{font-variant-numeric:tabular-nums;letter-spacing:.08em}
.sk-disp{font-family:var(--font-grot);font-weight:800;text-transform:lowercase;letter-spacing:-.045em;line-height:.88}

.sk-rail{border-bottom:1px solid var(--warm-line);padding:13px var(--sk-pad) 12px;text-align:center;font-size:var(--sk-tag);color:var(--ink);margin:0}

.sk-head{position:sticky;top:0;z-index:30;background:var(--paper);border-bottom:1px solid var(--warm-line);
  display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:48px;padding:20px var(--sk-pad)}
.sk-mark{display:block;height:28px;width:auto}
.sk-nav{display:flex;gap:32px;font-size:var(--sk-nav)}
.sk-nav a{position:relative;padding-bottom:2px;color:inherit;text-decoration:none}
.sk-nav a::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:currentColor;
  transform:scaleX(0);transform-origin:left;transition:transform .32s cubic-bezier(.2,.7,.3,1)}
.sk-nav a:hover::after,.sk-nav a[data-active="1"]::after{transform:scaleX(1)}
.sk-ig{justify-self:end;font-size:var(--sk-nav);color:inherit;text-decoration:none}

.sk-burger{display:none;background:none;border:0;cursor:pointer;padding:4px 0;width:26px;flex-direction:column;gap:6px}
.sk-burger span{display:block;height:2px;background:var(--ink);border-radius:1px}

.sk-menu{position:fixed;inset:0;z-index:40;background:var(--paper);padding:20px var(--sk-pad);display:flex;flex-direction:column}
.sk-menu-top{display:flex;justify-content:space-between;align-items:center;min-height:28px}
.sk-menu-close{background:none;border:0;cursor:pointer;font-family:var(--font-serif);font-size:26px;line-height:1;color:var(--ink)}
.sk-menu ul{list-style:none;margin:clamp(28px,7vh,64px) 0 0;padding:0}
.sk-menu li{border-bottom:1px solid var(--warm-line)}
.sk-menu li a{display:block;padding:20px 0;font-size:clamp(26px,7vw,40px);color:inherit;text-decoration:none}

.sk-foot{padding:clamp(56px,7vw,96px) var(--sk-pad) 44px;border-top:1px solid var(--warm-line);background:var(--paper)}
.sk-foot-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px}
.sk-foot h4{color:var(--warm-mute);margin:0 0 16px}
.sk-foot ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;font-size:var(--sk-tag)}
.sk-foot ul a{color:inherit;text-decoration:none}
.sk-foot .sk-mark{height:32px;margin-bottom:22px}
.sk-foot .sk-biz{color:var(--warm-mute);font-size:11px;line-height:2;letter-spacing:-.01em;max-width:44ch;margin:0}
.sk-foot .sk-biz a{color:inherit}
.sk-foot-end{display:flex;justify-content:space-between;gap:20px;margin-top:clamp(40px,6vw,80px);
  padding-top:22px;border-top:1px solid var(--warm-line);color:var(--warm-mute)}

/* 품절 표시 — 사진 위 왼쪽 아래 칩. 한글이라 대문자용 넓은 자간은 안 쓴다. */
.sk-sold{position:absolute;left:0;bottom:0;z-index:1;background:var(--paper);color:var(--ink);
  padding:7px 11px;font-family:var(--font-sans);font-size:11px;font-weight:600;
  letter-spacing:.02em;line-height:1;pointer-events:none}
.is-sold img{opacity:.72}
.is-sold:hover img{transform:none}

/* 상품정보제공고시 — 접이식 작은 글씨. 11px 아래로 내리지 말 것(위 주석 참고). */
.sk-notice{max-width:760px;margin:0 auto;padding:0 var(--sk-pad) clamp(48px,6vw,80px);
  font-family:var(--font-sans);font-size:11px;line-height:1.9;color:var(--warm-mute)}
.sk-notice summary{cursor:pointer;padding:12px 0;border-top:1px solid var(--warm-line);
  border-bottom:1px solid var(--warm-line);letter-spacing:.02em;list-style:none}
.sk-notice summary::-webkit-details-marker{display:none}
.sk-notice summary::after{content:"+";float:right;font-size:13px;line-height:1}
.sk-notice[open] summary::after{content:"−"}
.sk-notice dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:16px 0 0}
.sk-notice dt{font-weight:600}
.sk-notice dd{margin:0;color:var(--ink);word-break:keep-all}

@media (max-width:820px){
  /* 모바일에선 .sk-nav 가 숨겨져 있어 이 값은 INSTAGRAM 만 쓴다.
     워드마크보다 확실히 작아야 헤더의 주인공이 로고로 읽힌다. */
  :root{ --sk-nav:11px; }
  .sk-head{grid-template-columns:1fr auto 1fr;gap:0;padding:15px var(--sk-pad)}
  .sk-burger{display:flex;justify-self:start;width:22px;gap:5px}
  .sk-head .sk-mark{justify-self:center;height:20px}
  .sk-nav{display:none}
  .sk-foot-grid{grid-template-columns:1fr 1fr;gap:34px}
  .sk-foot-grid>:first-child{grid-column:1/-1}
  .sk-foot-end{flex-direction:column;gap:10px}
}
@media (prefers-reduced-motion:reduce){ .sk-nav a::after{transition:none} }
`;

/* 상단 태그라인 + 스티키 헤더 + 모바일 전체화면 메뉴. */
function SikHeader({ nav, active }) {
  const [open, setOpen] = React.useState(false);
  const L = window.SIK_LOGO;
  const IG = window.SIK_INSTAGRAM;
  const links = window.SIK_NAV;

  // 메뉴가 열려 있는 동안에만 배경 스크롤을 잠근다.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const goto = (key) => (e) => { e.preventDefault(); setOpen(false); nav(key); };

  return (
    <React.Fragment>
      <style>{SIK_UI_CSS}</style>

      {/* 소문자 문구라 대문자용 자간(sk-cap-track)은 붙이지 않는다 */}
      <p className="sk-rail sk-ser">{window.SIK_TAGLINE}</p>

      <header className="sk-head">
        <button className="sk-burger" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}>
          <span /><span /><span />
        </button>
        <a href="#" onClick={goto("home")} aria-label="SIK 홈">
          <img className="sk-mark" src={L.light} alt="SIK" />
        </a>
        <nav className="sk-nav sk-ser sk-cap-track">
          {links.map((l) => (
            <a key={l.key} href="#" data-active={l.key === active ? "1" : null} onClick={goto(l.key)}>{l.label}</a>
          ))}
        </nav>
        <a className="sk-ig sk-ser sk-cap-track" href={IG} target="_blank" rel="noreferrer">INSTAGRAM</a>
      </header>

      {open && (
        <div className="sk-menu">
          <div className="sk-menu-top">
            <button className="sk-menu-close" aria-label="메뉴 닫기" onClick={() => setOpen(false)}>&times;</button>
            <a className="sk-ig sk-ser sk-cap-track" href={IG} target="_blank" rel="noreferrer">INSTAGRAM</a>
          </div>
          <ul className="sk-ser sk-cap-track">
            {links.map((l) => <li key={l.key}><a href="#" onClick={goto(l.key)}>{l.label}</a></li>)}
            <li><a href="#" onClick={goto("About")}>ABOUT</a></li>
          </ul>
        </div>
      )}
    </React.Fragment>
  );
}

/* 상품정보제공고시 — 상세 맨 아래, 접어둔 작은 글씨.
   공정위 「전자상거래 등에서의 상품 등의 정보제공에 관한 고시」가 요구하는
   의류·패션잡화 항목. 국내 쇼핑몰이 다 이 자리에 이 크기로 둔다.
   다만 "안 보이게" 만들면 안 된다 — 고시는 소비자가 쉽게 확인할 수 있게
   제공하라고 요구하고, 일부러 읽기 어렵게 하면 그 자체가 위반이다.
   그래서 푸터 사업자정보와 같은 11px 로 맞췄다. 더 줄이지 말 것. */
function ProductInfoNotice({ product }) {
  const B = window.SIK_BIZ;
  const spec = product.spec || [];
  const pick = (key, fallback) => {
    const hit = spec.filter((row) => row[0] === key)[0];
    return hit && hit[1] ? hit[1] : fallback;
  };
  const seller = B.company + (B.tel ? " " + B.tel : "");

  const rows = [
    ["품명 및 모델명", product.name],
    ["소재 / 재질", pick("소재", "상세페이지 참조")],
    ["색상", pick("컬러", "상세페이지 참조")],
    ["치수", pick("사이즈", product.length || "상세페이지 참조")],
    ["제조자 / 수입자", B.company],
    ["제조국", pick("제조국", "확인 중")],
    ["취급 시 주의사항", "상세페이지 하단 Notice 참조"],
    ["품질보증기준", "관련 법 및 소비자분쟁해결기준에 따름"],
    ["A/S 책임자와 전화번호", seller],
  ];

  return (
    <details className="sk-notice">
      <summary>상품정보제공고시</summary>
      <dl>
        {rows.map(([k, v]) => (
          <React.Fragment key={k}>
            <dt>{k}</dt><dd>{v}</dd>
          </React.Fragment>
        ))}
      </dl>
    </details>
  );
}

function SikFooter({ nav }) {
  const L = window.SIK_LOGO;
  const IG = window.SIK_INSTAGRAM;
  const BIZ = window.SIK_BIZ;
  const goto = (key) => (e) => { e.preventDefault(); nav(key); };
  return (
    <footer className="sk-foot">
      <div className="sk-foot-grid">
        <div>
          <img className="sk-mark" src={L.light} alt="SIK" />
          {/* 아직 못 받은 항목(대표자명·통신판매업 신고번호)은 줄을 아예 안 그린다.
              "000" 같은 자리표시자를 띄우면 허위 표시로 보일 수 있다. */}
          <p className="sk-biz">
            상호 {BIZ.company}
            {BIZ.owner && <React.Fragment> · 대표 {BIZ.owner}</React.Fragment>}
            {" · "}사업자등록번호 {BIZ.bizNo}<br />
            {BIZ.mailOrderNo
              ? <React.Fragment>통신판매업신고 {BIZ.mailOrderNo}<br /></React.Fragment>
              : BIZ.mailOrderExempt
                ? <React.Fragment>통신판매업신고 {BIZ.mailOrderExempt}<br /></React.Fragment>
                : null}
            주소 {BIZ.address}<br />
            고객센터 <a href={"tel:" + BIZ.tel.replace(/-/g, "")}>{BIZ.tel}</a>
            {" · "}호스팅 {BIZ.host}<br />
            <a href={IG} target="_blank" rel="noreferrer">instagram @fashionpsick</a>
          </p>
        </div>
        <div>
          <h4 className="sk-hair-sm">SHOP</h4>
          <ul className="sk-ser sk-cap-track">
            {window.SIK_NAV.map((l) => <li key={l.key}><a href="#" onClick={goto(l.key)}>{l.label}</a></li>)}
          </ul>
        </div>
        <div>
          <h4 className="sk-hair-sm">BRAND</h4>
          <ul className="sk-ser sk-cap-track">
            <li><a href="#" onClick={goto("About")}>ABOUT</a></li>
            <li><a href={IG} target="_blank" rel="noreferrer">INSTAGRAM</a></li>
            <li><a href={window.SIK_SMARTSTORE} target="_blank" rel="noreferrer">NAVER STORE</a></li>
          </ul>
        </div>
      </div>
      <div className="sk-foot-end sk-hair-sm">
        <span>© 2026 SIK</span>
        <span>FITNESS AND FASHION</span>
      </div>
    </footer>
  );
}

/* Soft-cloud studio block standing in for product photography. */
function Studio({ ratio = "4 / 5", label = "SIK", style = {} }) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        background: "var(--soft-cloud)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--stone)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* Full-bleed editorial / lifestyle block: neutral dark tone, bottom scrim,
   optional burned-in display headline + Korean line + on-image CTA. */
function Editorial({
  ratio = "16 / 9",
  tone = "#1a1a1a",
  image,
  imagePos = "center",
  kicker,
  headline,
  korean,
  cta,
  onCta,
  align = "bottom-left",
  display = false,
  className = "",
  art = null,
  style = {},
}) {
  const justify = align.startsWith("center") ? "center" : "flex-end";
  const items = align.endsWith("center") ? "center" : "flex-start";
  const bg = image
    ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: imagePos, backgroundColor: tone }
    : { background: `linear-gradient(150deg, ${tone} 0%, #0d0d0d 100%)` };
  return (
    <div
      className={className}
      style={{
        position: "relative",
        aspectRatio: ratio,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: justify,
        alignItems: items,
        ...bg,
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "var(--image-scrim-bottom)" }} />
      {art}
      {kicker && (
        <span style={{ position: "absolute", top: 24, left: 28, zIndex: 1, fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--on-ink-mute)" }}>
          {kicker}
        </span>
      )}
      <div style={{ position: "relative", zIndex: 1, padding: 32, textAlign: items === "center" ? "center" : "left", maxWidth: 640 }}>
        {headline && (
          <div
            className="sik-ed-headline"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: display ? "clamp(48px, 6vw, 96px)" : "clamp(32px, 3.5vw, 56px)",
              lineHeight: 0.92,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              color: "var(--on-ink)",
            }}
          >
            {headline}
          </div>
        )}
        {korean && (
          <div style={{ marginTop: 14, fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 500, color: "var(--on-ink)" }}>
            {korean}
          </div>
        )}
        {cta && (
          <div style={{ marginTop: 22 }}>
            <button
              onClick={onCta}
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 44,
                padding: "0 26px",
                background: "var(--paper)",
                color: "var(--ink)",
                border: "none",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {cta}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* Section header: optional kicker + uppercase XL title, hairline-free. */
function SectionHead({ kicker, title, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
      <div>
        {kicker && <div className="sik-kicker" style={{ marginBottom: 8 }}>{kicker}</div>}
        <h2 className="sik-heading-xl">{title}</h2>
      </div>
      {action && (
        <a href="#" onClick={(e) => { e.preventDefault(); onAction && onAction(); }} className="sik-link" style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
          {action}
        </a>
      )}
    </div>
  );
}

/* A row of the brand's 5 line-icons with labels. variant 'w'|'b'. */
function BrandIcons({ variant = "b", items, gap = 28, size = 40, style = {} }) {
  const I = window.SIK_ICONS;
  const def = items || [
    { key: "dumbbell", label: "Gym" },
    { key: "necklace", label: "Necklaces" },
    { key: "tshirt", label: "Apparel" },
    { key: "hanger", label: "Lookbook" },
    { key: "head", label: "Brand" },
  ];
  const color = variant === "w" ? "var(--on-ink)" : "var(--ink)";
  return (
    <div style={{ display: "flex", gap, alignItems: "flex-end", justifyContent: "center", flexWrap: "wrap", ...style }}>
      {def.map((it) => (
        <div key={it.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <img src={`${I[it.key]}-${variant}.png`} alt={it.label} style={{ height: size, width: "auto" }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

/* Centered content container with page gutters. */
function PageWrap({ children, style = {} }) {
  return (
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--gutter-page)", ...style }}>
      {children}
    </div>
  );
}

Object.assign(window, { Studio, Editorial, SectionHead, PageWrap, BrandIcons, SikHeader, SikFooter, ProductInfoNotice });
