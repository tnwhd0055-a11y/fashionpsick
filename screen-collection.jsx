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
       className={p.soldOut ? "is-sold" : undefined}
       style={{ display: "block", textDecoration: "none", color: "inherit" }}>
      {/* 카테고리 아이콘 — 사진 바로 위 컴팩트 (왼쪽) */}
      <div style={{ display: "flex", justifyContent: "flex-start", paddingBottom: 6 }}>
        <img src={window.SIK_CAT_ICON(p.cat)} alt={p.cat} style={{ height: 20, width: "auto", opacity: 0.85 }} />
      </div>
      <div style={{ position: "relative", aspectRatio: "4 / 5", background: "var(--soft-cloud)", overflow: "hidden" }}>
        <img src={p.image} alt={p.name} loading="lazy" style={imgStyle(!hover)} />
        <img src={hoverImg} alt="" loading="lazy" style={imgStyle(hover)} />
        {p.soldOut && <span className="sk-sold">일시 품절</span>}
      </div>
      <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 4, textAlign: "left" }}>
        {(p.swatches || []).length > 0 && (
          <div style={{ display: "flex", gap: 5, marginBottom: 2 }}>
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
  const { PageWrap, SikHeader, SikFooter } = window;
  const keys = window.SIK_NAV.map((n) => n.key);
  const active = keys.includes(category) ? category : "All";
  const items = window.SIK_FILTER(active);

  return (
    <div style={{ background: "var(--paper)" }}>
      <SikHeader nav={nav} active={active} />

      <PageWrap style={{ paddingTop: "var(--space-3xl)", paddingBottom: "var(--space-5xl)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-2xl)" }}>
          <h1 className="sk-hair">{window.SIK_NAV_LABEL(active)}</h1>
          <span className="sk-hair-sm sk-num" style={{ color: "var(--warm-mute)" }}>
            {String(items.length).padStart(2, "0")}
          </span>
        </div>

        {items.length === 0 ? (
          /* BOTTOM 처럼 아직 취급 제품이 없는 카테고리 — 빈 화면 대신 안내 */
          <p className="sk-ser" style={{ color: "var(--warm-mute)", fontSize: 17, padding: "clamp(48px,10vw,120px) 0", textAlign: "center" }}>
            준비 중입니다.
          </p>
        ) : (
          <div className="sik-plp" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "var(--space-2xl) var(--space-lg)" }}>
            {items.map((p) => <ProductTile key={p.id} p={p} onOpen={openProduct} />)}
          </div>
        )}
      </PageWrap>

      <SikFooter nav={nav} />
    </div>
  );
}

window.CollectionPage = CollectionPage;
