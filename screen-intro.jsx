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
  background-image: url("assets/hero-desktop.jpg");
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

/* 하단 스크림 — 어떤 사진이 와도 흰 글씨 대비를 보장 */
.sik-intro-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(17,17,17,.42) 0%,
    rgba(17,17,17,0) 26%,
    rgba(17,17,17,0) 46%,
    rgba(17,17,17,.72) 100%);
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

.sik-intro-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sik-intro-top img { height: clamp(20px, 2vw, 28px); width: auto; }
.sik-intro-utility {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: var(--track-wider);
  text-transform: uppercase;
  color: rgba(255,255,255,.72);
}

.sik-intro-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }

.sik-intro-kicker {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: var(--track-wider);
  text-transform: uppercase;
  color: rgba(255,255,255,.78);
  margin-bottom: 14px;
}
.sik-intro-mark { display: block; width: clamp(200px, 26vw, 420px); height: auto; }
.sik-intro-tag {
  margin-top: 16px;
  font-size: clamp(13px, 1.2vw, 15px);
  color: rgba(255,255,255,.86);
  word-break: keep-all;
  max-width: 26em;
}

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
  .sik-intro-bottom { flex-direction: column; align-items: flex-start; gap: 20px; }
  .sik-intro-cue { align-self: center; }
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
            <div className="sik-intro-utility">SS Collection</div>
          </div>

          <div className="sik-intro-bottom">
            <div>
              <div className="sik-intro-kicker">Fashion Psick</div>
              <img className="sik-intro-mark" src={window.SIK_LOGO.dark} alt="SIK" />
              <div className="sik-intro-tag">운동과 일상의 경계 없이. 오늘의 무드를 완성하는 SIK.</div>
            </div>
            <div className="sik-intro-cue"><i /><span>Scroll</span></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

window.IntroCurtain = IntroCurtain;
