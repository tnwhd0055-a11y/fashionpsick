/* SIK Storefront — Home (에디토리얼 리디자인, 2026-07)
   인트로 커튼(screen-intro.jsx)이 걷힌 뒤 드러나는 화면.
   헤더/푸터는 kit-shared 의 SikHeader / SikFooter 를 쓴다. */

const HOME_CSS = `
/* ── 히어로 : 사진 두 장만 여백 위에 비대칭으로 띄운다. 헤드라인 없음 ── */
.sk-hero{display:grid;grid-template-columns:repeat(12,1fr);gap:0 24px;
  padding:clamp(56px,8vw,120px) var(--sk-pad) clamp(56px,7vw,110px)}
.sk-shot{position:relative;background:var(--bone);overflow:hidden}
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
/* 폭을 한 번 조여서 타일이 너무 커지지 않게 한다. 히어로가 이미 안쪽으로
   들어와 있어서, 그리드도 같은 여백감을 유지해야 한 페이지로 읽힌다. */
.sk-grid-inner{max-width:1060px;margin:0 auto}
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
/* .sk-hair-sm 의 넓은 자간(.22em)은 'NEW IN' 같은 영문 대문자 라벨용이다.
   한글 제품명에 그대로 걸면 글자가 뚝뚝 떨어져 읽기 힘들다 → 본문 자간으로 되돌린다.
   크기도 10px 은 한글엔 너무 작아 12px 로 올렸다(자간이 줄어든 만큼 폭은 그대로). */
.sk-meta .sk-name,.sk-meta .sk-price{font-size:12px;letter-spacing:0}
.sk-meta .sk-name{word-break:keep-all}   /* 한글 제품명이 어절 중간에서 끊기지 않게 */
.sk-meta .sk-price{color:var(--warm-mute);white-space:nowrap}
/* 히어로 캡션도 라벨이 아니라 읽는 문장이라 자간을 좁힌다 */
.sk-hero .sk-cap{font-size:11px;letter-spacing:.02em}

/* ── 로드 모션 ──
   정지 상태를 "시작 프레임"으로 두면 안 된다. 애니메이션이 실행되지 않는
   경우(감속 설정·재렌더 타이밍 등) 요소가 내려간 채로 굳어 레이아웃이 틀어진다.
   기본값은 항상 최종 위치로 두고, 키프레임 안에서만 시작 상태를 준다. */
.sk-rise{opacity:1;transform:none;animation:sk-rise .95s cubic-bezier(.2,.7,.3,1) both}
.sk-rise-2{animation-delay:.14s}
@keyframes sk-rise{
  from{opacity:0;transform:translateY(18px)}
  to{opacity:1;transform:none}
}

@media (max-width:820px){
  /* 첫 화면에 사진 두 장이 나란히 떠야 한다. 폭·간격은 레퍼런스 실측값:
     여백 5.8% | 큰 컷 44.5% | 사이 7.9% | 작은 컷 36.4% | 여백 5.4% */
  .sk-hero{grid-template-columns:5.8% 44.5% 7.9% 36.4% 5.4%;gap:0;
    padding:clamp(56px,20vw,96px) 0 clamp(72px,26vw,120px)}
  .sk-hero-a{grid-column:2}
  .sk-hero-a .sk-shot{aspect-ratio:3/4}
  /* translateY(%) 는 제 높이 기준이라 두 컷 높이가 다르면 어긋난다.
     레퍼런스처럼 뷰포트 기준 7.1% 만큼 내려야 해서 margin 으로 민다. */
  .sk-hero-b{grid-column:4;align-self:start;transform:none;margin-top:7.1vw}
  .sk-hero-b .sk-shot{aspect-ratio:3/4}
  /* 좁은 칸에 캡션을 넣으면 넘친다. 레퍼런스에도 캡션이 없다. */
  .sk-hero .sk-cap{display:none}

  .sk-grid{grid-template-columns:repeat(2,1fr)}
  /* 2단에선 한 줄에 이름+가격이 안 들어간다. align-items 를 건드리면
     자식이 max-content 폭이 돼 줄바꿈을 안 하므로 stretch 그대로 둔다. */
  .sk-meta{flex-direction:column;gap:6px}
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
        <div className="sk-grid-inner">
          <div className="sk-sec-head">
            <h2 className="sk-hair">NEW IN</h2>
            <span className="sk-count sk-hair-sm sk-num">{String(P.length).padStart(2, "0")}</span>
          </div>
          <div className="sk-grid">
            {P.map((p) => (
              <a key={p.id} className={"sk-card" + (p.soldOut ? " is-sold" : "")} href="#" onClick={open(p.id)}>
                <div className="sk-shot">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  {p.soldOut && <span className="sk-sold">일시 품절</span>}
                </div>
                <div className="sk-meta sk-hair-sm">
                  <span className="sk-name">{p.name}</span>
                  <span className="sk-price sk-num">{won(p.price)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <SikFooter nav={nav} />
    </div>
  );
}
window.HomePage = HomePage;
