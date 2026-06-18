/* SIK Storefront — Collection (single product) */
function CollectionPage({ nav, openProduct }) {
  const { NavBar, Footer, ProductCard } = window.SIKDesignSystem_7bbf7d;
  const { PageWrap } = window;
  const P = window.SIK_DATA.products;
  const footerCols = window.SIK_FOOTER;
  const L = window.SIK_LOGO;
  const NAV = ["New", "Necklaces", "About"];

  return (
    <div style={{ background: "var(--paper)" }}>
      <NavBar active="Necklaces" links={NAV} bagCount={2} onNavClick={nav} logoSrc={L.light} utility={window.SIK_UTILITY} utilityHref={window.SIK_INSTAGRAM} />

      {/* Sub-nav strip */}
      <div style={{ boxShadow: "var(--shadow-sticky-edge)" }}>
        <PageWrap>
          <div style={{ display: "flex", alignItems: "center", height: 52 }}>
            <span style={{ fontSize: 13, color: "var(--mute)" }}>
              <a href="#" onClick={(e) => { e.preventDefault(); nav("New"); }} style={{ color: "var(--mute)", textDecoration: "none" }}>Home</a> / <span style={{ color: "var(--ink)" }}>Necklaces</span>
            </span>
          </div>
        </PageWrap>
      </div>

      <PageWrap style={{ paddingTop: "var(--space-3xl)", paddingBottom: "var(--space-5xl)" }}>
        <div style={{ maxWidth: 520, marginBottom: "var(--space-3xl)" }}>
          <h1 className="sik-heading-xl" style={{ fontSize: 28 }}>Necklaces</h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--charcoal)", marginTop: 12 }}>
            SIK은 단 하나의 목걸이만 만듭니다 — 천연 스톤 비즈, 블랙브라운.
          </p>
        </div>
        <div style={{ fontSize: 13, color: "var(--mute)", marginBottom: "var(--space-lg)" }}>{P.length} item</div>
        <div className="sik-plp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-sm)" }}>
          {P.map((p) => (
            <ProductCard key={p.id} {...p} onClick={(e) => { e.preventDefault(); openProduct(p.id); }} />
          ))}
        </div>
      </PageWrap>

      <Footer columns={footerCols} logoSrc={L.light} linkHref={window.SIK_INSTAGRAM} />
    </div>
  );
}

window.CollectionPage = CollectionPage;
