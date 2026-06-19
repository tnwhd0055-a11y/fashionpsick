/* SIK Storefront — Product (PDP) */
function ProductPage({ nav, openProduct, productId }) {
  const { NavBar, Footer, ProductCard, PriceTag, SwatchDot, Button, IconButton, DisclosureRow } = window.SIKDesignSystem_7bbf7d;
  const { Studio, PageWrap } = window;
  const P = window.SIK_DATA.products;
  const footerCols = window.SIK_FOOTER;
  const L = window.SIK_LOGO;

  const product = P.find((p) => p.id === productId) || P[0];
  const gallery = product.gallery || [product.image];
  const [sw, setSw] = React.useState(0);
  const [len, setLen] = React.useState(product.length);
  const [thumb, setThumb] = React.useState(0);
  const NAV = ["New", "Necklaces", "About"];

  const heart = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A4.5 4.5 0 0 0 14.5 5L12 7.5 9.5 5A4.5 4.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  );

  return (
    <div style={{ background: "var(--paper)" }}>
      <NavBar active="Necklaces" links={NAV} bagCount={2} onNavClick={nav} logoSrc={L.light} utility={window.SIK_UTILITY} utilityHref={window.SIK_INSTAGRAM} />

      <div style={{ boxShadow: "var(--shadow-sticky-edge)" }}>
        <PageWrap>
          <div style={{ display: "flex", alignItems: "center", height: 52, fontSize: 13, color: "var(--mute)" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("New"); }} style={{ color: "var(--mute)", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>/</span>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("Necklaces"); }} style={{ color: "var(--mute)", textDecoration: "none" }}>Necklaces</a>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--ink)" }}>{product.name}</span>
          </div>
        </PageWrap>
      </div>

      <PageWrap style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-5xl)" }}>
        <div className="sik-2col" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "var(--space-4xl)", alignItems: "start" }}>
          {/* Gallery */}
          <div className="sik-gallery" style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "var(--space-md)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {gallery.map((src, i) => (
                <button key={i} onClick={() => setThumb(i)} style={{ padding: 0, border: i === thumb ? "1px solid var(--ink)" : "1px solid var(--hairline)", background: "transparent", cursor: "pointer", aspectRatio: "1 / 1", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                </button>
              ))}
            </div>
            <div style={{ aspectRatio: "1 / 1", backgroundColor: "var(--soft-cloud)", backgroundImage: `url(${gallery[thumb]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          </div>

          {/* Info */}
          <div>
            <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 19, fontWeight: 600, lineHeight: 1.4, letterSpacing: "0.01em", color: "var(--ink)", margin: 0, wordBreak: "keep-all" }}>{product.name}</h1>
            <div style={{ fontSize: 14, color: "var(--mute)", marginTop: 8 }}>{product.subtitle}</div>
            <div style={{ marginTop: "var(--space-xl)" }}>
              <PriceTag price={product.price} compareAt={product.compareAt} size="lg" />
            </div>

            <div style={{ marginTop: "var(--space-2xl)" }}>
              <div style={pdpLabel}>Color — {product.swatches[sw].label}</div>
              <div style={{ display: "flex", gap: "var(--space-md)" }}>
                {product.swatches.map((s, i) => (
                  <SwatchDot key={i} color={s.color} label={s.label} size={24} selected={i === sw} onClick={() => setSw(i)} />
                ))}
              </div>
            </div>

            <div style={{ marginTop: "var(--space-xl)" }}>
              <div style={pdpLabel}>Length</div>
              <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                {[product.length].map((l) => (
                  <button key={l} onClick={() => setLen(l)} style={{ height: 40, padding: "0 16px", border: len === l ? "1px solid var(--ink)" : "1px solid var(--hairline)", background: len === l ? "var(--ink)" : "var(--paper)", color: len === l ? "var(--on-ink)" : "var(--ink)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-2xl)" }}>
              <Button as="a" href={window.SIK_SMARTSTORE} target="_blank" rel="noopener noreferrer" variant="primary" size="lg" fullWidth style={{ fontSize: 17 }}>네이버에서 구매하기</Button>
              <IconButton label="Wishlist" variant="outline" size={56}>{heart}</IconButton>
            </div>
            <div style={{ fontSize: 12, color: "var(--mute)", marginTop: "var(--space-md)" }}>
              결제는 네이버페이 · 스마트스토어로 연결됩니다.
            </div>

            <div style={{ marginTop: "var(--space-2xl)" }}>
              <DisclosureRow label="Materials & Care" defaultOpen>
                <span style={{ fontSize: 15 }}>천연 조개 · 나일론 코드 · 스테인리스 클래스프. 땀과 물에 강한 소재로운동 중에도착용할 수 있습니다.</span>
              </DisclosureRow>
              <DisclosureRow label="Shipping & Returns">
                영업일 기준 2–3일 출고 · 단순 변심 교환/반품은 수령 후 7일 이내 가능합니다.
              </DisclosureRow>
              <DisclosureRow label="Reviews (124)">
                평균 4.9 / 5.0 — "가볍고 어디에나 잘 어울려요."
              </DisclosureRow>
            </div>
          </div>
        </div>
      </PageWrap>

      <ProductDetail />

      <Footer columns={footerCols} logoSrc={L.light} linkHref={window.SIK_INSTAGRAM} />
    </div>
  );
}

/* ── 상세 설명 (Korean detail page) ───────────────────────── */
function ProductDetail() {
  const A = "assets/";
  const img = { display: "block", width: "100%", height: "auto" };
  const eyebrow = {
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--ink)",
  };
  const body = {
    fontFamily: "var(--font-sans)",
    fontSize: 15,
    lineHeight: 1.85,
    color: "var(--mute)",
    margin: 0,
  };

  return (
    <section style={{ background: "var(--paper)", borderTop: "var(--divider-hairline)" }}>
      <div className="sik-detail" style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-4xl) var(--gutter-page) var(--space-5xl)" }}>

        <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
          <span style={{ ...eyebrow, color: "var(--mute)" }}>Product Detail</span>
        </div>

        {/* 1 — brand banner */}
        <img src={A + "detail-logo.png"} alt="SIK" style={{ ...img, background: "#000" }} />

        <div style={{ textAlign: "center", padding: "var(--space-3xl) 0 var(--space-2xl)" }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 var(--space-lg)" }}>
            [SIK] 내추럴 스톤 비즈 목걸이 – 블랙브라운
          </h2>
          <p style={{ ...body, textAlign: "center" }}>
            자연에서 영감을 받은 블랙과 브라운 컬러의 스톤 비즈를 조합해<br />차분하면서도 세련된 분위기를 담았습니다.<br />
            단독으로 착용해도 포인트가 되며, 다른 액세서리와<br />레이어드해 다양한 무드를 연출할 수 있습니다.
          </p>
          <div style={{ marginTop: "var(--space-2xl)", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--mute)", letterSpacing: "0.02em" }}>
              1차 판매 · OPEN 특가
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 30, fontWeight: 800, color: "var(--ink)" }}>
              19,900<span style={{ fontSize: 18, fontWeight: 600 }}>원</span>
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--mute)" }}>
              수량 20개 한정
            </span>
          </div>
        </div>

        {/* 2 — model */}
        <img src={A + "detail-model.jpg"} alt="" style={img} />

        {/* DETAIL spec */}
        <div style={{ textAlign: "center", padding: "var(--space-4xl) 0" }}>
          <div style={{ ...eyebrow, marginBottom: "var(--space-xl)" }}>Detail</div>
          <dl style={{ display: "inline-grid", gridTemplateColumns: "auto auto", gap: "10px 18px", textAlign: "left", margin: 0 }}>
            {[
              ["브랜드", "SIK"],
              ["제품명", "내추럴 스톤 비즈 목걸이"],
              ["컬러", "블랙브라운"],
              ["소재", "내추럴 스톤 비즈"],
              ["사이즈", "42cm + 연장 체인 5cm"],
              ["제조국", "외국"],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <dt style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--mute)" }}>{k}</dt>
                <dd style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink)", margin: 0 }}>{v}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>

        {/* 3 — flat */}
        <img src={A + "detail-flat.jpg"} alt="" style={img} />

        <div style={{ height: "var(--space-md)" }} />

        {/* 4 — clasp */}
        <img src={A + "detail-clasp.jpg"} alt="" style={img} />

        {/* NOTICE */}
        <div style={{ textAlign: "center", padding: "var(--space-4xl) 0" }}>
          <div style={{ ...eyebrow, marginBottom: "var(--space-xl)" }}>Notice</div>
          <p style={{ ...body, fontSize: 14, lineHeight: 2 }}>
            천연 스톤 특성상 비즈마다 색상, 무늬, 크기에 미세한 차이가 있을 수 있습니다.<br />
            제작 과정에서 미세한 스크래치 및 개체 차이가 발생할 수 있으며,<br />이는 불량 사유에 해당하지 않습니다.<br />
            물, 땀, 향수, 화장품과의 접촉은 변색 및 손상의 원인이 될 수 있으니 주의해 주세요.<br />
            사용 후에는 부드러운 천으로 가볍게 닦아 습기가 적은 곳에 보관해 주세요.
          </p>
        </div>

        {/* 5 — macro */}
        <img src={A + "detail-macro.jpg"} alt="" style={img} />

        <div style={{ height: "var(--space-md)" }} />

        {/* 6 — V */}
        <img src={A + "detail-v.jpg"} alt="" style={img} />

      </div>
    </section>
  );
}

const pdpLabel = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--ink)",
  marginBottom: "var(--space-md)",
};

window.ProductPage = ProductPage;
