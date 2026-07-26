/* SIK Storefront — Intro curtain
   들어오자마자 짐 캠페인 컷이 화면을 꽉 채우고, 스크롤(또는 클릭/키)하면
   위로 걷히면서 홈이 드러난다. 걷힌 뒤에는 완전히 언마운트되어 흔적이 없다. */

const INTRO_CSS = `
.sik-intro {
  position: fixed;
  inset: 0;
  z-index: 9000;
  overflow: hidden;
  background: #111;
  transform: translateY(0);
  transition: transform 900ms cubic-bezier(.76,0,.24,1);
  will-change: transform;
  cursor: pointer;
}
.sik-intro.is-lifted { transform: translateY(-100%); }

/* 배경 이미지로 깔아야 뷰포트별 자산이 확실히 갈린다 (picture/srcset 은 선택이 어긋나는 경우가 있음) */
.sik-intro-img {
  position: absolute;
  inset: 0;
  background-image: url("assets/hero-desktop-alt.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: sik-intro-zoom 9s ease-out both;
}
@media (max-width: 700px) {
  .sik-intro-img { background-image: url("assets/hero-mobile.jpg"); }
}
@keyframes sik-intro-zoom {
  from { transform: scale(1.06); }
  to   { transform: scale(1); }
}

/* 스크림 — 상단 로고와 하단 스크롤 표시의 대비만 확보 (사진은 최대한 그대로) */
.sik-intro-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(17,17,17,.34) 0%,
    rgba(17,17,17,0) 22%,
    rgba(17,17,17,0) 62%,
    rgba(17,17,17,.46) 100%);
  pointer-events: none;
}

.sik-intro-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(20px, 3.4vw, 44px) var(--gutter-page);
  pointer-events: none;
}

/* 상단 중앙에 워드마크만 작게 */
.sik-intro-top {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sik-intro-top img { height: clamp(16px, 1.5vw, 22px); width: auto; }

/* 하단 중앙에 스크롤 표시만 */
.sik-intro-bottom { display: flex; align-items: flex-end; justify-content: center; }

.sik-intro-cue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-bottom: 4px;
  flex: none;
}
.sik-intro-cue span {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: var(--track-wider);
  text-transform: uppercase;
  color: rgba(255,255,255,.8);
}
.sik-intro-cue i {
  display: block;
  width: 1px;
  height: 42px;
  background: linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.85));
  animation: sik-intro-cue 1.9s ease-in-out infinite;
  transform-origin: top;
}
@keyframes sik-intro-cue {
  0%   { transform: scaleY(.2); opacity: .2; }
  45%  { transform: scaleY(1);  opacity: 1; }
  100% { transform: scaleY(1);  opacity: 0; }
}

/* 진입 페이드 — 사진이 툭 튀지 않게 */
.sik-intro-inner > * { animation: sik-intro-fade 1s ease .25s both; }
@keyframes sik-intro-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

@media (max-width: 560px) {
  .sik-intro-cue i { height: 32px; }
}

@media (prefers-reduced-motion: reduce) {
  .sik-intro-img { animation: none; }
  .sik-intro-cue i { animation: none; }
}
`;

function IntroCurtain({ onDone }) {
  const [lifted, setLifted] = React.useState(false);
  const doneRef = React.useRef(false);

  const lift = React.useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLifted(true);
    window.setTimeout(onDone, 900);
  }, [onDone]);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0 });

    const onKey = (e) => {
      if ([" ", "Enter", "ArrowDown", "PageDown", "Escape"].indexOf(e.key) !== -1) { e.preventDefault(); lift(); }
    };
    window.addEventListener("wheel", lift, { passive: true });
    window.addEventListener("touchmove", lift, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("wheel", lift);
      window.removeEventListener("touchmove", lift);
      window.removeEventListener("keydown", onKey);
    };
  }, [lift]);

  return (
    <React.Fragment>
      <style>{INTRO_CSS}</style>
      <div className={"sik-intro" + (lifted ? " is-lifted" : "")} onClick={lift}>
        <div className="sik-intro-img" role="img" aria-label="SIK SS Collection" />
        <div className="sik-intro-scrim" />

        <div className="sik-intro-inner">
          <div className="sik-intro-top">
            <img src={window.SIK_LOGO.dark} alt="SIK" />
          </div>

          <div className="sik-intro-bottom">
            <div className="sik-intro-cue"><i /><span>Scroll</span></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

window.IntroCurtain = IntroCurtain;
