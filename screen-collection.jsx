/* SIK Storefront — Collection (category grid) */
function ProductTile({ p, onOpen }) {
  const { PriceTag, SwatchDot } = window.SIKDesignSystem_7bbf7d;
  const [hover, setHover] = React.useState(false);
  const hoverImg = p.frontImage || p.image;
  const imgStyle = (show) => ({
    position: "absolute", inset: 0, width: "100%", height: "100%",
    objectFit: "contain", objectPosition: "center",
    transition: "opacity .35s ease", opacity: show ? 1 : 0,
  });
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onOpen(p.id); }}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{ display: "block", textDecoration: "none", color: "inherit" }}>
      <div style={{ position: "relative", aspectRatio: "4 / 5", background: "var(--soft-cloud)", overflow: "hidden" }}>
        <img src={p.image} alt={p.name} loading="lazy" style={imgStyle(!hover)} />
        <img src={hoverImg} alt="" loading="lazy" style={imgStyle(hover)} />
        {p.badge && (
          <span style={{ position: "absolute", top: "var(--space-md)", left: "var(--space-md)", display: "inline-flex", padding: "4px 10px", fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink)", background: "var(--paper)", border: "1px solid var(--hairline)" }}>{p.badge}</span>
        )}
      </div>
      <div style={{ paddingTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: 6 }}>
        {(p.swatches || []).length > 0 && (
          <div style={{ display: "flex", gap: 6 }}>
            {p.swatches.map((s, i) => <SwatchDot key={i} color={s.color} label={s.label} size={15} />)}
          </div>
        )}
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>{p.name}</div>
        {p.subtitle && <div style={{ fontSize: 13, color: "var(--mute)" }}>{p.subtitle}</div>}
        <PriceTag price={p.price} compareAt={p.compareAt} size="sm" />
      </div>
    </a>
  );
}

function CollectionPage({ nav, openProduct, category }) {
  const { NavBar, Footer } = window.SIKDesignSystem_7bbf7d;
  const { PageWrap } = window;
  const P = window.SIK_DATA.products;
  const footerCols = window.SIK_FOOTER;
  const L = window.SIK_LOGO;
  const CATS = window.SIK_CATEGORIES;
  const NAV = ["All", ...CATS, "About"];

  const active = CATS.includes(category) ? category : "All";
  const items = active === "All" ? P : P.filter((p) => p.cat === active);

  return (
    <div style={{ background: "var(--paper)" }}>
      <NavBar active={active} links={NAV} bagCount={2} onNavClick={nav} onLogoClick={() => nav("home")} logoSrc={L.light} utility={window.SIK_UTILITY} utilityHref={window.SIK_INSTAGRAM} />

      {/* Sub-nav strip */}
      <div style={{ boxShadow: "var(--shadow-sticky-edge)" }}>
        <PageWrap>
          <div style={{ display: "flex", alignItems: "center", height: 52, gap: 16 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("home"); }} style={{ fontSize: 13, color: "var(--mute)", textDecoration: "none" }}>Home</a>
            {["All", ...CATS].map((c) => (
              <a key={c} href="#" onClick={(e) => { e.preventDefault(); nav(c); }}
                 style={{ fontSize: 13, textDecoration: "none", color: c === active ? "var(--ink)" : "var(--mute)", fontWeight: c === active ? 600 : 400 }}>{c}</a>
            ))}
          </div>
        </PageWrap>
      </div>

      <PageWrap style={{ paddingTop: "var(--space-3xl)", paddingBottom: "var(--space-5xl)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-2xl)" }}>
          <h1 className="sik-heading-xl" style={{ fontSize: 28 }}>{active}</h1>
          <span style={{ fontSize: 13, color: "var(--mute)" }}>{items.length} item{items.length > 1 ? "s" : ""}</span>
        </div>
        <div className="sik-plp" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "var(--space-2xl) var(--space-lg)" }}>
          {items.map((p) => <ProductTile key={p.id} p={p} onOpen={openProduct} />)}
        </div>
      </PageWrap>

      <Footer columns={footerCols} logoSrc={L.light} linkHref={window.SIK_INSTAGRAM} />
    </div>
  );
}

window.CollectionPage = CollectionPage;
