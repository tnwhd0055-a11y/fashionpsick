/* SIK Storefront — Product (PDP) */
function ProductPage({ nav, openProduct, productId }) {
  const { PriceTag, SwatchDot, Button, IconButton, DisclosureRow } = window.SIKDesignSystem_7bbf7d;
  const { PageWrap, SikHeader, SikFooter } = window;
  const P = window.SIK_DATA.products;

  const product = P.find((p) => p.id === productId) || P[0];
  const cat = product.cat || "Necklaces";
  // 브레드크럼은 상단 내비와 같은 말을 써야 한다. 목걸이는 ACCESSORIES 로 묶여 있다.
  const navKey = product.id === "western-belt" ? "Belt" : (cat === "Necklaces" ? "Accessories" : cat);
  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;

  const [sw, setSw] = React.useState(0);
  const [thumb, setThumb] = React.useState(0);

  // 색상별 갤러리(있으면) → 스와치가 갤러리를 전환. 없으면 product.gallery.
  const gallery = hasColors ? product.colors[sw].gallery : (product.gallery || [product.image]);
  const swatches = hasColors
    ? product.colors.map((c) => ({ color: c.color, label: c.label }))
    : (product.swatches || []);
  React.useEffect(() => { setThumb(0); }, [sw]);

  const heart = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A4.5 4.5 0 0 0 14.5 5L12 7.5 9.5 5A4.5 4.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  );

  return (
    <div style={{ background: "var(--paper)" }}>
      <SikHeader nav={nav} active={null} />

      <div style={{ boxShadow: "var(--shadow-sticky-edge)" }}>
        <PageWrap>
          <div style={{ display: "flex", alignItems: "center", height: 52, fontSize: 13, color: "var(--mute)" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); nav("home"); }} style={{ color: "var(--mute)", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>/</span>
            <a href="#" onClick={(e) => { e.preventDefault(); nav(navKey); }} style={{ color: "var(--mute)", textDecoration: "none" }}>{window.SIK_NAV_LABEL(navKey)}</a>
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
            <div style={{ aspectRatio: "1 / 1", backgroundColor: "var(--soft-cloud)", backgroundImage: `url(${gallery[thumb]})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />
          </div>

          {/* Info */}
          <div>
            <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 600, lineHeight: 1.35, letterSpacing: "0.01em", color: "var(--ink)", margin: 0, wordBreak: "keep-all" }}>{product.name}</h1>
            <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 6 }}>{product.subtitle}</div>
            <div style={{ marginTop: "var(--space-lg)" }}>
              <window.SIK_CompactPrice price={product.price} compareAt={product.compareAt} size={17} />
            </div>

            {swatches.length > 0 && (
              <div style={{ marginTop: "var(--space-2xl)" }}>
                <div style={pdpLabel}>Color{hasColors ? " — " + swatches[sw].label : ""}</div>
                <div style={{ display: "flex", gap: "var(--space-md)" }}>
                  {swatches.map((s, i) => (
                    <SwatchDot key={i} color={s.color} label={s.label} size={24} selected={i === sw} onClick={() => setSw(i)} />
                  ))}
                </div>
              </div>
            )}

            {product.length && (
              <div style={{ marginTop: "var(--space-xl)" }}>
                <div style={pdpLabel}>Length</div>
                <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                  <button style={{ height: 40, padding: "0 16px", border: "1px solid var(--ink)", background: "var(--ink)", color: "var(--on-ink)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, cursor: "default" }}>
                    {product.length}
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-2xl)" }}>
              <Button as="a" href={product.buy || window.SIK_SMARTSTORE} target="_blank" rel="noopener noreferrer" variant="primary" size="lg" fullWidth style={{ fontSize: 17 }}>네이버에서 구매하기</Button>
              <IconButton label="Wishlist" variant="outline" size={56}>{heart}</IconButton>
            </div>
            <div style={{ fontSize: 12, color: "var(--mute)", marginTop: "var(--space-md)" }}>
              결제는 네이버페이 · 스마트스토어로 연결됩니다.
            </div>

            {product.blurb && (
              <div style={{ marginTop: "var(--space-2xl)" }}>
                <DisclosureRow label="Product" defaultOpen>
                  <span style={{ fontSize: 15 }}>{product.blurb}</span>
                </DisclosureRow>
                <DisclosureRow label="Shipping & Returns">
                  영업일 기준 2–3일 출고 · 단순 변심 교환/반품은 수령 후 7일 이내 가능합니다.
                </DisclosureRow>
              </div>
            )}
          </div>
        </div>
      </PageWrap>

      {product.detail === "stone" ? <StoneDetail product={product} /> : <GenericDetail product={product} gallery={gallery} />}

      <window.ProductInfoNotice product={product} />

      <SikFooter nav={nav} />
    </div>
  );
}

/* ── 신규 제품 공통 상세 (갤러리 + 스펙 + 노티스) ─────────────── */
function GenericDetail({ product, gallery }) {
  const img = { display: "block", width: "100%", height: "auto", background: "var(--soft-cloud)" };
  const eyebrow = { fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ink)" };
  const body = { fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.85, color: "var(--mute)", margin: 0 };
  const won = (n) => n.toLocaleString("en-US");
  const detailShots = (gallery || []).slice(0, 6);

  return (
    <section style={{ background: "var(--paper)", borderTop: "var(--divider-hairline)" }}>
      <div className="sik-detail" style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-4xl) var(--gutter-page) var(--space-5xl)" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
          <span style={{ ...eyebrow, color: "var(--mute)" }}>Product Detail</span>
        </div>

        <div style={{ textAlign: "center", padding: "0 0 var(--space-3xl)" }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 var(--space-lg)" }}>{product.name}</h2>
          {product.blurb && <p style={{ ...body, textAlign: "center" }}>{product.blurb}</p>}
          <div style={{ marginTop: "var(--space-2xl)", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--mute)", letterSpacing: "0.02em" }}>OPEN 특가</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 30, fontWeight: 800, color: "var(--ink)" }}>
              {won(product.price)}<span style={{ fontSize: 18, fontWeight: 600 }}>원</span>
            </span>
            {typeof product.compareAt === "number" && product.compareAt > product.price && (
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--mute)", textDecoration: "line-through" }}>{won(product.compareAt)}원</span>
            )}
          </div>
        </div>

        {detailShots.map((src, i) => (
          <React.Fragment key={i}>
            <img src={src} alt="" style={img} />
            {i < detailShots.length - 1 && <div style={{ height: "var(--space-md)" }} />}
          </React.Fragment>
        ))}

        {Array.isArray(product.spec) && (
          <div style={{ textAlign: "center", padding: "var(--space-4xl) 0" }}>
            <div style={{ ...eyebrow, marginBottom: "var(--space-xl)" }}>Detail</div>
            <dl style={{ display: "inline-grid", gridTemplateColumns: "auto auto", gap: "10px 18px", textAlign: "left", margin: 0 }}>
              {/* 제조국은 여기 두지 않는다. 맨 아래 상품정보제공고시로 모았다. */}
              {product.spec.filter(([k]) => k !== "제조국").map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--mute)" }}>{k}</dt>
                  <dd style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink)", margin: 0 }}>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        )}

        <div style={{ textAlign: "center", padding: "0 0 var(--space-2xl)" }}>
          <div style={{ ...eyebrow, marginBottom: "var(--space-xl)" }}>Notice</div>
          <p style={{ ...body, fontSize: 14, lineHeight: 2 }}>
            촬영 환경 및 모니터에 따라 실제 색상과 차이가 있을 수 있습니다.<br />
            제품 특성 및 측정 방법에 따라 1~3cm 정도 오차가 발생할 수 있습니다.<br />
            세탁 및 보관 방법에 따라 변형이 생길 수 있으니 주의해 주세요.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── 기존 스톤 비즈 목걸이 풀 상세 (원본 유지) ─────────────── */
function StoneDetail({ product }) {
  const A = "assets/";
  const img = { display: "block", width: "100%", height: "auto" };
  const eyebrow = { fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ink)" };
  const body = { fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.85, color: "var(--mute)", margin: 0 };

  return (
    <section style={{ background: "var(--paper)", borderTop: "var(--divider-hairline)" }}>
      <div className="sik-detail" style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-4xl) var(--gutter-page) var(--space-5xl)" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
          <span style={{ ...eyebrow, color: "var(--mute)" }}>Product Detail</span>
        </div>
        <img src={A + "detail-logo.png"} alt="SIK" style={{ ...img, background: "#000" }} />
        <div style={{ textAlign: "center", padding: "var(--space-3xl) 0 var(--space-2xl)" }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: "0 0 var(--space-lg)" }}>
            [SIK] 내추럴 스톤 비즈 목걸이 – 블랙브라운
          </h2>
          <p style={{ ...body, textAlign: "center" }}>
            자연에서 영감을 받은 블랙과 브라운 컬러의 스톤 비즈를 조합해<br />차분하면서도 세련된 분위기를 담았습니다.<br />
            단독으로 착용해도 포인트가 되며, 다른 액세서리와<br />레이어드해 다양한 무드를 연출할 수 있습니다.
          </p>
        </div>
        <img src={A + "detail-model.jpg"} alt="" style={img} />
        <div style={{ textAlign: "center", padding: "var(--space-4xl) 0" }}>
          <div style={{ ...eyebrow, marginBottom: "var(--space-xl)" }}>Detail</div>
          <dl style={{ display: "inline-grid", gridTemplateColumns: "auto auto", gap: "10px 18px", textAlign: "left", margin: 0 }}>
            {/* 제조국은 여기 두지 않는다. 맨 아래 상품정보제공고시로 모았다. */}
            {(product.spec || []).filter(([k]) => k !== "제조국").map(([k, v]) => (
              <React.Fragment key={k}>
                <dt style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--mute)" }}>{k}</dt>
                <dd style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink)", margin: 0 }}>{v}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
        <img src={A + "detail-flat.jpg"} alt="" style={img} />
        <div style={{ height: "var(--space-md)" }} />
        <img src={A + "detail-clasp.jpg"} alt="" style={img} />
        <div style={{ textAlign: "center", padding: "var(--space-4xl) 0" }}>
          <div style={{ ...eyebrow, marginBottom: "var(--space-xl)" }}>Notice</div>
          <p style={{ ...body, fontSize: 14, lineHeight: 2 }}>
            천연 스톤 특성상 비즈마다 색상, 무늬, 크기에 미세한 차이가 있을 수 있습니다.<br />
            제작 과정에서 미세한 스크래치 및 개체 차이가 발생할 수 있으며,<br />이는 불량 사유에 해당하지 않습니다.<br />
            물, 땀, 향수, 화장품과의 접촉은 변색 및 손상의 원인이 될 수 있으니 주의해 주세요.<br />
            사용 후에는 부드러운 천으로 가볍게 닦아 습기가 적은 곳에 보관해 주세요.
          </p>
        </div>
        <img src={A + "detail-macro.jpg"} alt="" style={img} />
        <div style={{ height: "var(--space-md)" }} />
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
