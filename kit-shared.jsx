/* SIK Storefront — shared layout + placeholder helpers.
   Exports to window: Studio, Editorial, SectionHead, PageWrap. */

/* Soft-cloud studio block standing in for product photography. */
function Studio({ ratio = "4 / 5", label = "SIK", style = {} }) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        background: "var(--soft-cloud)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--stone)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* Full-bleed editorial / lifestyle block: neutral dark tone, bottom scrim,
   optional burned-in display headline + Korean line + on-image CTA. */
function Editorial({
  ratio = "16 / 9",
  tone = "#1a1a1a",
  image,
  imagePos = "center",
  kicker,
  headline,
  korean,
  cta,
  onCta,
  align = "bottom-left",
  display = false,
  style = {},
}) {
  const justify = align.startsWith("center") ? "center" : "flex-end";
  const items = align.endsWith("center") ? "center" : "flex-start";
  const bg = image
    ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: imagePos, backgroundColor: tone }
    : { background: `linear-gradient(150deg, ${tone} 0%, #0d0d0d 100%)` };
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: justify,
        alignItems: items,
        ...bg,
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "var(--image-scrim-bottom)" }} />
      {kicker && (
        <span style={{ position: "absolute", top: 24, left: 28, zIndex: 1, fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--on-ink-mute)" }}>
          {kicker}
        </span>
      )}
      <div style={{ position: "relative", zIndex: 1, padding: 32, textAlign: items === "center" ? "center" : "left", maxWidth: 640 }}>
        {headline && (
          <div
            className="sik-ed-headline"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: display ? "clamp(48px, 6vw, 96px)" : "clamp(32px, 3.5vw, 56px)",
              lineHeight: 0.92,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              color: "var(--on-ink)",
            }}
          >
            {headline}
          </div>
        )}
        {korean && (
          <div style={{ marginTop: 14, fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 500, color: "var(--on-ink)" }}>
            {korean}
          </div>
        )}
        {cta && (
          <div style={{ marginTop: 22 }}>
            <button
              onClick={onCta}
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 44,
                padding: "0 26px",
                background: "var(--paper)",
                color: "var(--ink)",
                border: "none",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {cta}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* Section header: optional kicker + uppercase XL title, hairline-free. */
function SectionHead({ kicker, title, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
      <div>
        {kicker && <div className="sik-kicker" style={{ marginBottom: 8 }}>{kicker}</div>}
        <h2 className="sik-heading-xl">{title}</h2>
      </div>
      {action && (
        <a href="#" onClick={(e) => { e.preventDefault(); onAction && onAction(); }} className="sik-link" style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
          {action}
        </a>
      )}
    </div>
  );
}

/* A row of the brand's 5 line-icons with labels. variant 'w'|'b'. */
function BrandIcons({ variant = "b", items, gap = 28, size = 40, style = {} }) {
  const I = window.SIK_ICONS;
  const def = items || [
    { key: "dumbbell", label: "Gym" },
    { key: "necklace", label: "Necklaces" },
    { key: "tshirt", label: "Apparel" },
    { key: "hanger", label: "Lookbook" },
    { key: "head", label: "Brand" },
  ];
  const color = variant === "w" ? "var(--on-ink)" : "var(--ink)";
  return (
    <div style={{ display: "flex", gap, alignItems: "flex-end", flexWrap: "wrap", ...style }}>
      {def.map((it) => (
        <div key={it.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <img src={`${I[it.key]}-${variant}.png`} alt={it.label} style={{ height: size, width: "auto" }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

/* Centered content container with page gutters. */
function PageWrap({ children, style = {} }) {
  return (
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--gutter-page)", ...style }}>
      {children}
    </div>
  );
}

Object.assign(window, { Studio, Editorial, SectionHead, PageWrap, BrandIcons });
