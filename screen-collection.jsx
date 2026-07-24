/* SIK Storefront — Collection (category grid) */
// 카테고리별 브랜드 라인 아이콘 (사진 위 컴팩트 표시)
window.SIK_CAT_ICON = function (cat) {
  if (cat === "Necklaces") return "assets/icon-necklace-b.png";
  if (cat === "Accessories") return "assets/icon-hanger-b.png";
  return "assets/icon-tshirt-b.png"; // Tops 등
};

// 컴팩트 가격 (정가 취소선 + 판매가 + 할인율%) — Gramicci 스타일
function CompactPrice({ price, compareAt, size = 13 }) {
  const won = (n) => n.toLocaleString("en-US") + "원";
  const onSale = typeof compareAt === "number" && compareAt > price;
  const pct = onSale ? Math.round((1 - price / compareAt) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, fontFamily: "var(--font-sans)", fontSize: size, flexWrap: "wrap" }}>
      {onSale && <span style={{ color: "var(--mute)", textDecoration: "line-through", fontSize: size - 1 }}>{won(compareAt)}</span>}
      <span style={{ fontWeight: 700, color: "var(--ink)" }}>{won(price)}</span>
      {onSale && <span style={{ color: "var(--sale)", fontWeight: 700 }}>{pct}%</span>}
    </div>
  );
}
window.SIK_CompactPrice = CompactPrice;

function ProductTile({ p, onOpen }) {
  const { SwatchDot } = window.SIKDesignSystem_7bbf7d;
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
      {/* 카테고리 아이콘 — 사진 바로 위 컴팩트 */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 6 }}>
        <img src={window.SIK_CAT_ICON(p.cat)} alt={p.cat} style={{ height: 22, width: "auto", opacity: 0.85 }} />
      </div>
      <div style={{ position: "relative", aspectRatio: "4 / 5", background: "var(--soft-cloud)", overflow: "hidden" }}>
        <img src={p.image} alt={p.name} loading="lazy" style={imgStyle(!hover)} />
        <img src={hoverImg} alt="" loading="lazy" style={imgStyle(hover)} />
        {p.badge && (
          <span style={{ position: "absolute", top: "var(--space-md)", left: "var(--space-md)", display: "inline-flex", padding: "3px 8px", fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink)", background: "var(--paper)", border: "1px solid var(--hairline)" }}>{p.badge}</span>
        )}
      </div>
      <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 4, textAlign: "center", alignItems: "center" }}>
        {(p.swatches || []).length > 0 && (
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 2 }}>
            {p.swatches.map((s, i) => <SwatchDot key={i} color={s.color} label={s.label} size={13} />)}
          </div>
        )}
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.35 }}>{p.name}</div>
        <CompactPrice price={p.price} compareAt={p.compareAt} />
      </div>
    </a>
  );
}
window.ProductTile = ProductTile;

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
