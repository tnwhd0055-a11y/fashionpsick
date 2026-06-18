/* SIK Storefront — Home (single product) */
const HERO_CSS = `
.sik-hero-art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
.sik-hero-ghost {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: min(108%, 560px);
  height: auto;
  opacity: 0;
  pointer-events: none;
  animation: sik-ghost-in 1.1s cubic-bezier(.2,.7,.3,1) .1s both;
}
.sik-hero-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
}
.sik-hero-icons {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(18px, 2.6vw, 38px);
  flex-wrap: nowrap;
}
.sik-hero-icon {
  opacity: 0;
  transition: transform .9s cubic-bezier(.55,0,.2,1), opacity .55s ease;
  will-change: transform, opacity;
}
.sik-hero-icon-img {
  display: block;
  height: clamp(34px, 4vw, 52px);
  width: auto;
  animation: sik-float 6s ease-in-out infinite;
}
.sik-hero-muscle {
  position: absolute;
  top: 50%; left: 50%;
  z-index: 2;
  height: clamp(116px, 15vw, 188px);
  width: auto;
  opacity: 0;
  transform: translate(-50%, -50%) scale(.55);
  transition: transform .8s cubic-bezier(.34,1.45,.5,1) .12s, opacity .5s ease .12s;
  pointer-events: none;
}
@keyframes sik-ghost-in {
  from { opacity: 0; transform: translate(-50%, -46%); }
  to   { opacity: .09; transform: translate(-50%, -50%); }
}
@keyframes sik-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}
@media (prefers-reduced-motion: reduce) {
  .sik-hero-ghost { animation: none; opacity: .09; }
  .sik-hero-icon  { transition: none; opacity: 1 !important; transform: none !important; }
  .sik-hero-icon-img { animation: none; }
  .sik-hero-muscle { display: none; }
}
`;

function Home({ nav, openProduct }) {
  const { NavBar, Footer, Button } = window.SIKDesignSystem_7bbf7d;
  const { Editorial, PageWrap } = window;
  const product = window.SIK_DATA.products[0];
  const footerCols = window.SIK_FOOTER;
  const L = window.SIK_LOGO;
  const IMG = window.SIK_PRODUCT_IMG;
  const ICONS = window.SIK_ICONS;
  const MUSCLE = window.SIK_MUSCLE;
  const NAV = ["New", "Necklaces", "About"];
  const won = (n) => "KRW " + n.toLocaleString("en-US");

  // The brand's 5 line-icons, white variant for the ink hero.
  const heroIcons = [
    { key: "head", alt: "Brand" },
    { key: "dumbbell", alt: "Gym" },
    { key: "necklace", alt: "Necklaces" },
    { key: "tshirt", alt: "Apparel" },
    { key: "hanger", alt: "Lookbook" },
  ];

  // ── Merge effect: the 5 icons periodically converge into the muscle mark ──
  const stageRef = React.useRef(null);
  const iconRefs = React.useRef([]);
  const [entered, setEntered] = React.useState(false);
  const [merged, setMerged] = React.useState(false);
  const [deltas, setDeltas] = React.useState(() => heroIcons.map(() => ({ x: 0, y: 0 })));

  const measure = React.useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sr = stage.getBoundingClientRect();
    const cx = sr.left + sr.width / 2;
    const cy = sr.top + sr.height / 2;
    setDeltas(iconRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) };
    }));
  }, []);

  // Entrance: stagger the icons up, once.
  React.useEffect(() => {
    measure();
    const t = setTimeout(() => setEntered(true), 80);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
  }, [measure]);

  // Loop: spread → merge into muscle → hold → spread, on a calm cadence.
  React.useEffect(() => {
    if (!entered) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let unmerge, iv;
    const cycle = () => {
      measure();          // capture spread positions just before converging
      setMerged(true);
      unmerge = setTimeout(() => setMerged(false), 2600);
    };
    const start = setTimeout(() => {
      cycle();
      iv = setInterval(cycle, 7000);
    }, 2600);
    return () => { clearTimeout(start); clearInterval(iv); clearTimeout(unmerge); };
  }, [entered, measure]);

  const iconStyle = (i) => {
    if (!entered) return { opacity: 0, transform: "translateY(16px) scale(1)", transitionDelay: (i * 0.08) + "s" };
    if (merged) return { opacity: 0, transform: `translate(${deltas[i].x}px, ${deltas[i].y}px) scale(.18)`, transitionDelay: "0s" };
    return { opacity: 1, transform: "translate(0,0) scale(1)", transitionDelay: (i * 0.05) + "s" };
  };

  return (
    <div style={{ background: "var(--paper)" }}>
      <style>{HERO_CSS}</style>
      <NavBar active="New" links={NAV} bagCount={2} onNavClick={nav} logoSrc={L.light} utility={window.SIK_UTILITY} utilityHref={window.SIK_INSTAGRAM} />

      {/* Full-width ink campaign panel — copy left, brand-mark art right */}
      <div style={{ background: "var(--ink)" }}>
        <PageWrap style={{ minHeight: "clamp(440px, 60vh, 620px)", display: "flex", alignItems: "center", gap: "clamp(40px, 5vw, 88px)", flexWrap: "wrap", padding: "clamp(56px,8vh,104px) var(--gutter-page)" }}>
          <div style={{ flex: "1 1 440px", minWidth: 280 }}>
            <div className="sik-kicker" style={{ color: "var(--on-ink-mute)", marginBottom: 20 }}>SS Collection</div>
            <h1 className="sik-display" style={{ color: "var(--on-ink)", fontSize: "clamp(56px, 7.5vw, 116px)" }}>Fashion Psick</h1>
            <p style={{ color: "var(--on-ink)", fontSize: 17, fontWeight: 500, marginTop: 22, maxWidth: 420 }}>운동과 일상의 경계 없이. 단 하나의 목걸이.</p>
            <div style={{ marginTop: 32 }}>
              <Button variant="onImage" size="lg" onClick={() => openProduct(product.id)}>Shop the necklace</Button>
            </div>
          </div>

          {/* Brand-mark art: 5 line-icons that merge into the muscle mark */}
          <div className="sik-hero-art" style={{ flex: "1 1 360px", minWidth: 260 }}>
            <img className="sik-hero-ghost" src={L.dark} alt="" aria-hidden="true" />
            <div className="sik-hero-stage" ref={stageRef}>
              <div className="sik-hero-icons">
                {heroIcons.map((it, i) => (
                  <div
                    key={it.key}
                    ref={(el) => (iconRefs.current[i] = el)}
                    className="sik-hero-icon"
                    style={iconStyle(i)}
                  >
                    <img className="sik-hero-icon-img" src={ICONS[it.key] + "-w.png"} alt={it.alt} style={{ animationDelay: (i * 0.55) + "s" }} />
                  </div>
                ))}
              </div>
              <img
                className="sik-hero-muscle"
                src={MUSCLE.light}
                alt="SIK"
                style={{ opacity: merged ? 1 : 0, transform: merged ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-50%) scale(.55)" }}
              />
            </div>
          </div>
        </PageWrap>
      </div>

      {/* Signature — single vertical product shot, simple caption */}
      <PageWrap style={{ paddingTop: "var(--space-5xl)", paddingBottom: "var(--space-5xl)" }}>
        <div className="sik-kicker" style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>Signature</div>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <button
            onClick={() => openProduct(product.id)}
            aria-label={product.name}
            style={{ display: "block", width: "100%", padding: 0, border: "none", cursor: "pointer", aspectRatio: "3 / 4.4", backgroundColor: "var(--soft-cloud)", backgroundImage: `url(${IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <div style={{ marginTop: "var(--space-lg)" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)", letterSpacing: "0.01em" }}>{product.name}</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--charcoal)", marginTop: 4 }}>{won(product.price)}</div>
          </div>
        </div>
      </PageWrap>

      {/* Editorial brand band */}
      <PageWrap style={{ paddingBottom: "var(--space-5xl)" }}>
        <Editorial
          ratio="16 / 6"
          tone="#111"
          kicker="The brand"
          headline="Worn at the gym. Kept for the day."
          cta="Our story"
          onCta={() => nav("About")}
        />
      </PageWrap>

      <Footer columns={footerCols} logoSrc={L.light} linkHref={window.SIK_INSTAGRAM} />
    </div>
  );
}
window.Home = Home;
