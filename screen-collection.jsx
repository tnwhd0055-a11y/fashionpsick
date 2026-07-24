/* SIK Storefront — Collection (category grid) */
function CollectionPage({ nav, openProduct, category }) {
  const { NavBar, Footer, ProductCard } = window.SIKDesignSystem_7bbf7d;
  const { PageWrap } = window;
  const P = window.SIK_DATA.products;
  const footerCols = window.SIK_FOOTER;
  const L = window.SIK_LOGO;
  const CATS = window.SIK_CATEGORIES;
  const NAV = ["New", ...CATS, "About"];

  // category 가 유효 카테고리면 필터, 아니면 전체
  const active = CATS.includes(category) ? category : "All";
  const items = active === "All" ? P : P.filter((p) => p.cat === active);

  const COPY = {
    All: "SIK의 모든 제품 — 목걸이, 상의, 액세서리.",
    Tops: "몸을 살리는 핏의 상의 — 반팔 티셔츠와 셔츠.",
    Necklaces: "데일리로 즐기는 비즈 목걸이.",
    Accessories: "룩을 완성하는 포인트 아이템.",
  };

  return (
    <div style={{ background: "var(--paper)" }}>
      <NavBar active={active === "All" ? "New" : active} links={NAV} bagCount={2} onNavClick={nav} logoSrc={L.light} utility={window.SIK_UTILITY} utilityHref={window.SIK_INSTAGRAM} />

      {/* Sub-nav strip */}
      <div style={{ boxShadow: "var(--shadow-sticky-edge)" }}>
        <PageWrap>
          <div style={{ display: "flex", alignItems: "center", height: 52, gap: 16 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("New"); }} style={{ fontSize: 13, color: "var(--mute)", textDecoration: "none" }}>Home</a>
            {CATS.map((c) => (
              <a key={c} href="#" onClick={(e) => { e.preventDefault(); nav(c); }}
                 style={{ fontSize: 13, textDecoration: "none", color: c === active ? "var(--ink)" : "var(--mute)", fontWeight: c === active ? 600 : 400 }}>{c}</a>
            ))}
          </div>
        </PageWrap>
      </div>

      <PageWrap style={{ paddingTop: "var(--space-3xl)", paddingBottom: "var(--space-5xl)" }}>
        <div style={{ maxWidth: 520, marginBottom: "var(--space-3xl)" }}>
          <h1 className="sik-heading-xl" style={{ fontSize: 28 }}>{active === "All" ? "All" : active}</h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--charcoal)", marginTop: 12 }}>{COPY[active] || COPY.All}</p>
        </div>
        <div style={{ fontSize: 13, color: "var(--mute)", marginBottom: "var(--space-lg)" }}>{items.length} item{items.length > 1 ? "s" : ""}</div>
        <div className="sik-plp" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg) var(--space-sm)" }}>
          {items.map((p) => (
            <ProductCard key={p.id} image={p.image} name={p.name} subtitle={p.subtitle}
              price={p.price} compareAt={p.compareAt} badge={p.badge} swatches={p.swatches}
              onClick={(e) => { e.preventDefault(); openProduct(p.id); }} />
          ))}
        </div>
      </PageWrap>

      <Footer columns={footerCols} logoSrc={L.light} linkHref={window.SIK_INSTAGRAM} />
    </div>
  );
}

window.CollectionPage = CollectionPage;
