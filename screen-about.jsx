/* SIK Storefront — About */
function AboutPage({ nav }) {
  const { NavBar, Footer, Button } = window.SIKDesignSystem_7bbf7d;
  const { Editorial, PageWrap, BrandIcons } = window;
  const footerCols = window.SIK_FOOTER;
  const L = window.SIK_LOGO;
  const IMG = window.SIK_PRODUCT_IMG;

  return (
    <div style={{ background: "var(--paper)" }}>
      <NavBar active="About" links={["New", "Necklaces", "About"]} bagCount={2} onNavClick={nav} logoSrc={L.light} utility={window.SIK_UTILITY} utilityHref={window.SIK_INSTAGRAM} />

      <Editorial
        ratio="16 / 6.5"
        tone="#1a1a1a"
        display
        kicker="The brand"
        headline={<>Sport<br />Healty& Everyday</>}
        korean="운동과 일상의 경계 없이."
        align="bottom-center"
      />

      {/* Story */}
      <PageWrap style={{ paddingTop: "var(--space-5xl)" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <div className="sik-kicker" style={{ marginBottom: "var(--space-lg)" }}>Our story</div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 22, lineHeight: 1.7, color: "var(--ink)", fontWeight: 500, margin: 0, textWrap: "pretty", wordBreak: "keep-all" }}>
            SIK은 피트니스 라이프스타일에서 출발한 액세서리 브랜드입니다. 천연 조개로 만든 미니멀한 목걸이는 운동할 때도, 평상시에도 자연스럽게 어울립니다.
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.8, color: "var(--charcoal)", marginTop: "var(--space-xl)", textWrap: "pretty", wordBreak: "keep-all" }}>
            피식푸드(@psickfood)에서 시작된 SIK은 짐웨어와 데일리룩의 경계를 지웁니다. 과한 장식 없이, 절제된 디자인으로 — 매일 착용할 수 있는 가벼움을 만듭니다.
          </p>
        </div>
      </PageWrap>

      {/* Brand world icons */}
      <PageWrap style={{ paddingTop: "var(--space-5xl)" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BrandIcons variant="b" size={46} gap="clamp(28px, 6vw, 72px)" />
        </div>
      </PageWrap>

      {/* Two moods */}
      <PageWrap style={{ paddingTop: "var(--space-5xl)" }}>
        <div className="sik-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)" }}>
          <Editorial ratio="4 / 5" image={IMG} imagePos="center" kicker="The piece" headline="Natural shell" />
          <Editorial ratio="4 / 5" tone="#161616" kicker="In the everyday" headline="Kept for the day" />
        </div>
      </PageWrap>

      {/* Values */}
      <PageWrap style={{ paddingTop: "var(--space-5xl)" }}>
        <div className="sik-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3xl)", borderTop: "var(--divider-hairline)", paddingTop: "var(--space-3xl)" }}>
          {[
            ["Natural", "천연 조개 소재. 가공을 최소화한 본연의 질감."],
            ["Minimal", "두 톤의 절제된 디자인. 과한 컬러도, 장식도 없습니다."],
            ["Everyday", "운동과 일상 어디서나. 가볍게 매일 착용하는 무게."],
          ].map(([h, p]) => (
            <div key={h}>
              <div className="sik-heading-md" style={{ marginBottom: 10 }}>{h}</div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.7, color: "var(--mute)", margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>
      </PageWrap>

      {/* Closing CTA */}
      <PageWrap style={{ paddingTop: "var(--space-5xl)" }}>
        <div style={{ textAlign: "center" }}>
          <h2 className="sik-display-xl" style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>Wear it your way</h2>
          <div style={{ marginTop: "var(--space-xl)", display: "flex", justifyContent: "center" }}>
            <Button variant="primary" size="lg" onClick={() => nav("Necklaces")}>Shop the collection</Button>
          </div>
        </div>
      </PageWrap>

      <div style={{ marginTop: "var(--space-5xl)" }}>
        <Footer columns={footerCols} logoSrc={L.light} linkHref={window.SIK_INSTAGRAM} />
      </div>
    </div>
  );
}
window.AboutPage = AboutPage;
