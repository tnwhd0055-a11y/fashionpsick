/* SIK Storefront — Home (에디토리얼 리디자인, 2026-07)
   인트로 커튼(screen-intro.jsx)이 걷힌 뒤 드러나는 화면.
   헤더/푸터는 kit-shared 의 SikHeader / SikFooter 를 쓴다. */

const HOME_CSS = `
/* ── 히어로 : 사진 두 장만 여백 위에 비대칭으로 띄운다. 헤드라인 없음 ── */
.sk-hero{display:grid;grid-template-columns:repeat(12,1fr);gap:0 24px;
  padding:clamp(56px,8vw,120px) var(--sk-pad) clamp(56px,7vw,110px)}
.sk-shot{background:var(--bone);overflow:hidden}
.sk-shot img{width:100%;height:100%;object-fit:cover;display:block}
.sk-cap{margin-top:14px;padding-top:10px;border-top:1px solid var(--warm-line);color:var(--warm-mute)}
.sk-hero-a{grid-column:3/7;margin:0}
.sk-hero-a .sk-shot{aspect-ratio:4/5}
.sk-hero-b{grid-column:9/12;align-self:center;transform:translateY(6%);margin:0}
.sk-hero-b .sk-shot{aspect-ratio:4/5}   /* 1:1 로 자르면 전신컷의 머리가 날아간다 */

/* ── 브랜드 시그니처 ── */
.sk-sign{text-align:center;padding:0 var(--sk-pad) clamp(64px,9vw,124px)}
.sk-sign .sk-handle{display:inline-block;font-size:clamp(17px,1.5vw,21px);color:inherit;text-decoration:none}
.sk-sign .sk-handle:hover{text-decoration:underline;text-underline-offset:5px}
.sk-sign p{margin:14px 0 0;color:var(--warm-mute);font-size:clamp(14px,1.15vw,17px)}

/* ── 제품 그리드 : 카드 테두리도 배지도 없이, 사진이 프레임을 꽉 채운다 ── */
.sk-grid-sec{padding:0 var(--sk-pad) clamp(64px,9vw,130px)}
.sk-sec-head{display:flex;justify-content:space-between;align-items:baseline;
  padding-bottom:18px;border-bottom:1px solid var(--warm-line);margin-bottom:clamp(28px,4vw,54px)}
.sk-sec-head h2{margin:0}
.sk-sec-head .sk-count{color:var(--warm-mute)}
.sk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(24px,3.2vw,52px) clamp(16px,2.4vw,36px)}
.sk-card{display:block;color:inherit;text-decoration:none}
.sk-card .sk-shot{aspect-ratio:3/4}
.sk-card img{transition:transform .8s cubic-bezier(.2,.7,.3,1)}
.sk-card:hover img{transform:scale(1.035)}
.sk-meta{display:flex;justify-content:space-between;gap:14px;margin-top:16px;align-items:baseline}
.sk-meta .sk-name{word-break:keep-all}   /* 한글 제품명이 어절 중간에서 끊기지 않게 */
.sk-meta .sk-price{color:var(--warm-mute);white-space:nowrap}

/* ── 에디토리얼 스플릿 ──
   배경을 bone 으로 두면 흰 배경 제품컷이 네모 박스처럼 떠 보인다. 흰 바탕으로 통일. */
.sk-split{background:var(--paper);display:grid;grid-template-columns:1fr 1fr;align-items:center}
.sk-split .sk-pic{aspect-ratio:1/1;overflow:hidden}
.sk-split .sk-pic img{width:100%;height:100%;object-fit:cover;display:block}
.sk-split .sk-say{padding:clamp(32px,6vw,96px)}
.sk-split .sk-eyebrow{color:var(--warm-mute);margin:0 0 22px}
.sk-split h3{font-size:clamp(32px,4.6vw,66px);margin:0 0 24px}
.sk-split p{max-width:34ch;color:var(--warm-mute);font-size:14px;line-height:1.9;letter-spacing:-.01em;margin:0}
.sk-split .sk-go{display:inline-block;margin-top:32px;border-bottom:1px solid var(--ink);
  padding-bottom:4px;color:inherit;text-decoration:none}

/* ── 로드 모션 ── */
.sk-rise{opacity:0;transform:translateY(18px);animation:sk-rise .95s cubic-bezier(.2,.7,.3,1) forwards}
.sk-rise-2{animation-delay:.14s}
@keyframes sk-rise{to{opacity:1;transform:none}}

@media (max-width:820px){
  /* 히어로는 자라식으로 화면 끝까지 흘린다 */
  .sk-hero{display:block;padding:0 0 clamp(48px,11vw,64px)}
  .sk-hero-a .sk-shot{aspect-ratio:3/4}
  .sk-hero-a .sk-cap{margin:12px var(--sk-pad) 0}
  .sk-hero-b{transform:none;margin:52px var(--sk-pad) 0;width:72%}

  .sk-grid{grid-template-columns:repeat(2,1fr)}
  /* 2단에선 한 줄에 이름+가격이 안 들어간다. align-items 를 건드리면
     자식이 max-content 폭이 돼 줄바꿈을 안 하므로 stretch 그대로 둔다. */
  .sk-meta{flex-direction:column;gap:6px}

  .sk-split{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){
  .sk-rise{animation:none;opacity:1;transform:none}
  .sk-card img{transition:none}
}
`;

function HomePage({ nav, openProduct }) {
  const { SikHeader, SikFooter } = window;
  const P = window.SIK_DATA.products;
  const won = (n) => "₩" + n.toLocaleString("en-US");

  // 히어로 두 컷 — 크게 한 장, 작게 한 장. 없으면 조용히 건너뛴다.
  const heroA = P.find((p) => p.id === "semicrop-tee") || P[0];
  const heroB = P.find((p) => p.id === "mesh-shirt") || P[1];

  // 스플릿에 세울 제품 (EP.2 목걸이)
  const feature = P.find((p) => p.id === "blackpoint-necklace") || P[0];
  const featureFlat = feature.frontImage || feature.image;

  const open = (id) => (e) => { e.preventDefault(); openProduct(id); };

  return (
    <div style={{ background: "var(--paper)" }}>
      <style>{HOME_CSS}</style>
      <SikHeader nav={nav} active={null} />

      <section className="sk-hero">
        <figure className="sk-hero-a sk-rise">
          <a href="#" className="sk-shot" style={{ display: "block" }} onClick={open(heroA.id)}>
            <img src={heroA.image} alt={heroA.name} />
          </a>
          <figcaption className="sk-cap sk-hair-sm">{heroA.subtitle || heroA.name}</figcaption>
        </figure>
        <figure className="sk-hero-b sk-rise sk-rise-2">
          <a href="#" className="sk-shot" style={{ display: "block" }} onClick={open(heroB.id)}>
            <img src={heroB.image} alt={heroB.name} />
          </a>
          <figcaption className="sk-cap sk-hair-sm">{heroB.subtitle || heroB.name}</figcaption>
        </figure>
      </section>

      <section className="sk-sign sk-ser">
        <a className="sk-handle" href={window.SIK_INSTAGRAM} target="_blank" rel="noreferrer">
          {window.SIK_HANDLE}
        </a>
        <p>{window.SIK_HANDLE_SUB}</p>
      </section>

      <section className="sk-grid-sec">
        <div className="sk-sec-head">
          <h2 className="sk-hair">NEW IN</h2>
          <span className="sk-count sk-hair-sm sk-num">{String(P.length).padStart(2, "0")}</span>
        </div>
        <div className="sk-grid">
          {P.map((p) => (
            <a key={p.id} className="sk-card" href="#" onClick={open(p.id)}>
              <div className="sk-shot"><img src={p.image} alt={p.name} loading="lazy" /></div>
              <div className="sk-meta sk-hair-sm">
                <span className="sk-name">{p.name}</span>
                <span className="sk-price sk-num">{won(p.price)}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="sk-split">
        <a className="sk-pic" href="#" onClick={open(feature.id)}>
          <img src={featureFlat} alt={feature.name} />
        </a>
        <div className="sk-say">
          <p className="sk-eyebrow sk-hair-sm">EPISODE 02</p>
          <h3 className="sk-disp">black pearl</h3>
          <p>{feature.blurb}</p>
          <a className="sk-go sk-ser sk-cap-track" href="#" onClick={open(feature.id)}>VIEW PRODUCT</a>
        </div>
      </section>

      <SikFooter nav={nav} />
    </div>
  );
}
window.HomePage = HomePage;
