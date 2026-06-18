/* @ds-bundle: {"format":3,"namespace":"SIKDesignSystem_7bbf7d","components":[{"name":"PriceTag","sourcePath":"components/commerce/PriceTag.jsx"},{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"SwatchDot","sourcePath":"components/commerce/SwatchDot.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"FilterChip","sourcePath":"components/forms/FilterChip.jsx"},{"name":"SearchField","sourcePath":"components/forms/SearchField.jsx"},{"name":"DisclosureRow","sourcePath":"components/navigation/DisclosureRow.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"}],"sourceHashes":{"components/commerce/PriceTag.jsx":"d2426f135e41","components/commerce/ProductCard.jsx":"245c82fcbe88","components/commerce/SwatchDot.jsx":"5f89c343af5d","components/core/Badge.jsx":"a4d65a9e3e2d","components/core/Button.jsx":"107973b3950b","components/core/IconButton.jsx":"e9fea4bd3df7","components/forms/FilterChip.jsx":"6ad7c06fc5b7","components/forms/SearchField.jsx":"13f56fa78a43","components/navigation/DisclosureRow.jsx":"2a92872d8d49","components/navigation/Footer.jsx":"729bbc604d75","components/navigation/NavBar.jsx":"182b786baba4","ui_kits/storefront/About.jsx":"fcc706f1f79f","ui_kits/storefront/Collection.jsx":"1697daa09b40","ui_kits/storefront/Home.jsx":"50b1db36c41a","ui_kits/storefront/Product.jsx":"5936b41a3b4a","ui_kits/storefront/data.js":"8c4199c8e068","ui_kits/storefront/kit-shared.jsx":"7d6679885b57"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SIKDesignSystem_7bbf7d = window.SIKDesignSystem_7bbf7d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/commerce/PriceTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Formats a number as KRW (₩) with thousands separators. */
function won(value) {
  if (typeof value !== "number") return value;
  return "₩" + value.toLocaleString("ko-KR");
}

/**
 * SIK PriceTag — the only place a chromatic color appears in
 * retail chrome. Regular price in ink; on sale, the discounted
 * price + "% off" go red (--sale) with the original struck through.
 */
function PriceTag({
  price,
  compareAt,
  size = "md",
  style = {},
  ...rest
}) {
  const onSale = typeof compareAt === "number" && compareAt > price;
  const pct = onSale ? Math.round((1 - price / compareAt) * 100) : 0;
  const sizes = {
    lg: "var(--heading-lg-size)",
    md: "var(--body-md-size)",
    sm: "var(--body-sm-size)"
  };
  const fs = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "sik-price",
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--space-sm)",
      fontFamily: "var(--font-sans)",
      fontSize: fs,
      fontWeight: "var(--weight-semibold)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      color: onSale ? "var(--sale)" : "var(--ink)"
    }
  }, won(price)), onSale && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mute)",
      fontWeight: "var(--weight-regular)",
      textDecoration: "line-through"
    }
  }, won(compareAt)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sale)"
    }
  }, pct, "% off")));
}
Object.assign(__ds_scope, { PriceTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/PriceTag.jsx", error: String((e && e.message) || e) }); }

// components/commerce/SwatchDot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SIK SwatchDot — colorway picker dot. Selected state draws the
 * signature concentric ring (2px ink outer + white interior gap)
 * with NO size change. Light colorways get a faint hairline ring
 * so they stay visible on paper.
 */
function SwatchDot({
  color = "#111111",
  selected = false,
  size = 16,
  label,
  onClick,
  style = {},
  ...rest
}) {
  const isLight = (() => {
    const hex = String(color).replace("#", "");
    if (hex.length < 6) return false;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b > 225;
  })();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    "aria-pressed": selected,
    title: label,
    onClick: onClick,
    className: "sik-swatch",
    style: {
      width: size,
      height: size,
      padding: 0,
      borderRadius: "var(--radius-full)",
      background: color,
      cursor: "pointer",
      boxShadow: selected ? "0 0 0 2px var(--paper), 0 0 0 4px var(--ink)" : isLight ? "inset 0 0 0 1px var(--hairline)" : "none",
      border: "none",
      outline: "none",
      transition: "box-shadow .15s ease",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { SwatchDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/SwatchDot.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SIK ProductCard — the photograph IS the card. Zero radius,
 * zero shadow, zero internal padding. Full-bleed image on a
 * soft-cloud studio backdrop; metadata sits directly below with
 * an 8px rhythm: swatches, badge, name, subtitle, price.
 */
function ProductCard({
  image,
  name,
  subtitle,
  price,
  compareAt,
  badge,
  swatches = [],
  ratio = "1 / 1",
  imageFit = "cover",
  href,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(0);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href || "#",
    onClick: onClick,
    className: "sik-product-card",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "block",
      textDecoration: "none",
      color: "inherit",
      background: "var(--paper)",
      borderRadius: "var(--radius-card)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: ratio,
      background: "var(--soft-cloud)",
      overflow: "hidden"
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    loading: "lazy",
    style: {
      width: "100%",
      height: "100%",
      objectFit: imageFit,
      objectPosition: "center",
      display: "block",
      transform: hover ? "scale(1.03)" : "scale(1)",
      transition: "transform .5s ease"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--stone)",
      fontSize: "var(--label-sm-size)",
      letterSpacing: "var(--track-wide)",
      textTransform: "uppercase"
    }
  }, "SIK"), badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "var(--space-md)",
      left: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      padding: "4px 10px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--label-sm-size)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--track-wide)",
      textTransform: "uppercase",
      color: "var(--ink)",
      background: "var(--paper)",
      border: "1px solid var(--hairline)"
    }
  }, badge))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)",
      paddingTop: "var(--space-md)"
    }
  }, swatches.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-sm)",
      alignItems: "center"
    }
  }, swatches.map((s, i) => /*#__PURE__*/React.createElement(__ds_scope.SwatchDot, {
    key: i,
    color: s.color,
    label: s.label,
    selected: i === active,
    onClick: e => {
      e.preventDefault();
      setActive(i);
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--body-md-size)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--ink)",
      lineHeight: 1.3
    }
  }, name), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--caption-size)",
      color: "var(--mute)",
      lineHeight: 1.3
    }
  }, subtitle), /*#__PURE__*/React.createElement(__ds_scope.PriceTag, {
    price: price,
    compareAt: compareAt,
    size: "sm",
    style: {
      marginTop: "var(--space-xs)"
    }
  })));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SIK Badge — a hairline-outlined label that sits on product
 * imagery ("Just In", "Limited", "Coming Soon"). Squared, ink
 * text on paper. The `inverse` variant flips to ink fill for
 * dark moments; `kicker` is a borderless spaced eyebrow label.
 */
function Badge({
  children,
  variant = "outline",
  style = {},
  ...rest
}) {
  const palettes = {
    outline: {
      bg: "var(--paper)",
      fg: "var(--ink)",
      border: "1px solid var(--hairline)"
    },
    inverse: {
      bg: "var(--ink)",
      fg: "var(--on-ink)",
      border: "1px solid var(--ink)"
    },
    kicker: {
      bg: "transparent",
      fg: "var(--mute)",
      border: "none"
    }
  };
  const p = palettes[variant] || palettes.outline;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "sik-badge",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-xs)",
      padding: variant === "kicker" ? 0 : "4px 10px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--label-sm-size)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--track-wide)",
      textTransform: "uppercase",
      lineHeight: 1.3,
      color: p.fg,
      background: p.bg,
      border: p.border,
      borderRadius: "var(--radius-chip)",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SIK Button — the universal squared, uppercase, letter-spaced CTA.
 * Variants: primary (ink), secondary (soft-cloud), outline (hairline),
 * onImage (white pill-free block on photography), ghost (text only).
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  as = "button",
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const sizes = {
    lg: {
      height: 56,
      padding: "0 36px",
      font: "var(--label-md-size)"
    },
    md: {
      height: "var(--control-height)",
      padding: "0 28px",
      font: "var(--label-md-size)"
    },
    sm: {
      height: "var(--control-height-sm)",
      padding: "0 18px",
      font: "var(--label-sm-size)"
    }
  };
  const palettes = {
    primary: {
      bg: "var(--ink)",
      fg: "var(--on-ink)",
      border: "var(--ink)"
    },
    secondary: {
      bg: "var(--soft-cloud)",
      fg: "var(--ink)",
      border: "var(--soft-cloud)"
    },
    outline: {
      bg: "transparent",
      fg: "var(--ink)",
      border: "var(--hairline)"
    },
    onImage: {
      bg: "var(--paper)",
      fg: "var(--ink)",
      border: "var(--paper)"
    },
    ghost: {
      bg: "transparent",
      fg: "var(--ink)",
      border: "transparent"
    }
  };
  const s = sizes[size] || sizes.md;
  const p = palettes[variant] || palettes.primary;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-sm)",
    width: fullWidth ? "100%" : "auto",
    height: s.height,
    padding: s.padding,
    fontFamily: "var(--font-sans)",
    fontSize: s.font,
    fontWeight: "var(--weight-semibold)",
    letterSpacing: "var(--track-wide)",
    textTransform: "uppercase",
    textDecoration: "none",
    lineHeight: 1,
    color: p.fg,
    background: p.bg,
    border: `1px solid ${p.border}`,
    borderRadius: "var(--radius-button)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : hover ? 0.82 : 1,
    transform: press && !disabled ? "scale(0.97)" : "scale(1)",
    transition: "opacity .18s ease, transform .12s ease",
    whiteSpace: "nowrap",
    userSelect: "none",
    ...style
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: "sik-button",
    style: base,
    disabled: as === "button" ? disabled : undefined,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SIK IconButton — circular chrome control for back, carousel
 * paddles, wishlist, share, close, etc. Pass an icon node as
 * children (e.g. an inline <svg> or a Lucide element).
 */
function IconButton({
  children,
  variant = "soft",
  size = 40,
  label,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const palettes = {
    soft: {
      bg: "var(--soft-cloud)",
      fg: "var(--ink)",
      border: "transparent"
    },
    bare: {
      bg: "transparent",
      fg: "var(--ink)",
      border: "transparent"
    },
    outline: {
      bg: "var(--paper)",
      fg: "var(--ink)",
      border: "var(--hairline)"
    },
    inverse: {
      bg: "var(--ink)",
      fg: "var(--on-ink)",
      border: "var(--ink)"
    }
  };
  const p = palettes[variant] || palettes.soft;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    className: "sik-icon-button",
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      padding: 0,
      color: p.fg,
      background: p.bg,
      border: `1px solid ${p.border}`,
      borderRadius: "var(--radius-full)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : hover ? 0.7 : 1,
      transition: "opacity .18s ease",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/FilterChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SIK FilterChip — squared selectable chip. Default is paper with
 * a hairline border; selected flips fully inverted to ink fill.
 * No middle state. Optional trailing count in muted parens.
 */
function FilterChip({
  children,
  selected = false,
  count,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-pressed": selected,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    className: "sik-filter-chip",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-xs)",
      height: "var(--control-height-sm)",
      padding: "0 16px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--label-md-size)",
      fontWeight: "var(--weight-medium)",
      letterSpacing: "var(--track-wide)",
      textTransform: "uppercase",
      lineHeight: 1,
      color: selected ? "var(--on-ink)" : "var(--ink)",
      background: selected ? "var(--ink)" : "var(--paper)",
      border: `1px solid ${selected ? "var(--ink)" : "var(--hairline)"}`,
      borderRadius: "var(--radius-chip)",
      cursor: "pointer",
      opacity: hover && !selected ? 0.7 : 1,
      transition: "opacity .15s ease",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), children, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: selected ? "var(--on-ink-mute)" : "var(--mute)",
      fontWeight: "var(--weight-regular)"
    }
  }, "(", count, ")"));
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SIK SearchField — soft-cloud field with a leading magnifier.
 * On focus it flips to paper with the signature "glove": a 2px
 * ink border read as a soft halo against a soft-cloud outer ring.
 */
function SearchField({
  value,
  defaultValue,
  onChange,
  placeholder = "Search",
  size = "md",
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const height = size === "sm" ? "var(--control-height-sm)" : "var(--control-height)";
  return /*#__PURE__*/React.createElement("div", {
    className: "sik-search",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-sm)",
      height,
      padding: "0 16px",
      background: focus ? "var(--paper)" : "var(--soft-cloud)",
      border: focus ? "2px solid var(--ink)" : "2px solid transparent",
      borderRadius: "var(--radius-input)",
      boxShadow: focus ? "0 0 0 4px var(--soft-cloud)" : "none",
      transition: "background .15s ease, box-shadow .15s ease",
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--mute)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })), /*#__PURE__*/React.createElement("input", _extends({
    type: "search",
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--body-md-size)",
      color: "var(--ink)"
    }
  }, rest)));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/navigation/DisclosureRow.jsx
try { (() => {
/**
 * SIK DisclosureRow — PDP / FAQ accordion row. Label left,
 * chevron right, 1px hairline divider below, generous vertical
 * padding. Squared, flat, no fill on open.
 */
function DisclosureRow({
  label,
  children,
  defaultOpen = false,
  emphasis = "body",
  style = {}
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const labelWeight = emphasis === "heading" ? "var(--weight-semibold)" : "var(--weight-semibold)";
  const labelSize = emphasis === "heading" ? "var(--heading-md-size)" : "var(--body-md-size)";
  return /*#__PURE__*/React.createElement("div", {
    className: "sik-disclosure",
    style: {
      borderBottom: "var(--divider-hairline)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-expanded": open,
    onClick: () => setOpen(o => !o),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-md)",
      padding: "var(--space-xl) 0",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      textAlign: "left",
      fontFamily: "var(--font-sans)",
      fontSize: labelSize,
      fontWeight: labelWeight,
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--ink)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform .2s ease"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), open && children != null && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: "var(--space-xl)",
      color: "var(--charcoal)",
      fontSize: "var(--body-md-size)",
      lineHeight: "var(--body-leading)"
    }
  }, children));
}
Object.assign(__ds_scope, { DisclosureRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/DisclosureRow.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SIK Footer — flat, paper, single hairline top divider. Brand
 * wordmark + tagline, link columns, then a fine-print row.
 */
function Footer({
  columns = [],
  wordmark = "SIK",
  logoSrc,
  tagline = "운동과 일상의 경계 없이.",
  fineprint = "© SIK. All rights reserved.",
  /** When set, every column link becomes an anchor to this URL (opens new tab). */
  linkHref,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "sik-footer",
    style: {
      background: "var(--paper)",
      borderTop: "var(--divider-hairline)",
      padding: "var(--space-3xl) var(--gutter-page) var(--space-xl)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-3xl)",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 280
    }
  }, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: wordmark,
    style: {
      height: 30,
      width: "auto",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: 32,
      letterSpacing: "var(--track-wide)",
      textTransform: "uppercase",
      color: "var(--ink)"
    }
  }, wordmark), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: "var(--space-md)",
      color: "var(--mute)",
      fontSize: "var(--body-sm-size)",
      lineHeight: "var(--body-leading)"
    }
  }, tagline)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-4xl)"
    }
  }, columns.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.title,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--label-md-size)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--track-wide)",
      textTransform: "uppercase",
      color: "var(--ink)"
    }
  }, col.title), col.links.map(label => /*#__PURE__*/React.createElement("a", _extends({
    key: label,
    href: linkHref || "#"
  }, linkHref ? {
    target: "_blank",
    rel: "noopener noreferrer"
  } : {}, {
    style: {
      fontSize: "var(--caption-size)",
      color: "var(--mute)",
      textDecoration: "none"
    }
  }), label)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-3xl)",
      paddingTop: "var(--space-lg)",
      borderTop: "var(--divider-hairline)",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--utility-size)",
      color: "var(--mute)"
    }
  }, fineprint), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--utility-size)",
      color: "var(--mute)",
      letterSpacing: "var(--track-wide)"
    }
  }, "BY PSICKFOOD \xB7 KOREA")));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
const ic = d => /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, d);

/**
 * SIK NavBar — utility strip + primary nav. Wordmark left,
 * centered uppercase links (active gets a 2px ink underline),
 * right cluster of search + wishlist + bag. Flat, squared,
 * hairline bottom edge.
 */
function NavBar({
  links = ["New", "Necklaces", "Gymwear", "Lookbook", "About"],
  active,
  utility = ["Find a Store", "Help", "Naver Store"],
  /** When set, every utility item becomes an anchor to this URL (opens new tab). */
  utilityHref,
  wordmark = "SIK",
  logoSrc,
  bagCount,
  onNavClick,
  onUtilityClick,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "sik-navbar",
    style: {
      background: "var(--paper)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--utility-bar-height)",
      background: "var(--soft-cloud)",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "var(--space-lg)",
      padding: "0 var(--gutter-page)"
    }
  }, utility.map(label => {
    const uStyle = {
      fontSize: "var(--label-sm-size)",
      color: "var(--ink)",
      fontWeight: "var(--weight-medium)",
      cursor: "pointer",
      textDecoration: "none"
    };
    return utilityHref ? /*#__PURE__*/React.createElement("a", {
      key: label,
      href: utilityHref,
      target: "_blank",
      rel: "noopener noreferrer",
      style: uStyle
    }, label) : /*#__PURE__*/React.createElement("span", {
      key: label,
      style: uStyle,
      onClick: () => onUtilityClick && onUtilityClick(label)
    }, label);
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      height: "var(--nav-height)",
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      padding: "0 var(--gutter-page)",
      boxShadow: "var(--shadow-sticky-edge)"
    }
  }, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: wordmark,
    style: {
      height: 26,
      width: "auto",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
      fontSize: 30,
      letterSpacing: "var(--track-wide)",
      textTransform: "uppercase",
      color: "var(--ink)"
    }
  }, wordmark), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2xl)",
      justifyContent: "center"
    }
  }, links.map(l => {
    const isActive = l === active;
    return /*#__PURE__*/React.createElement("a", {
      key: l,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavClick && onNavClick(l);
      },
      style: {
        fontSize: "var(--label-md-size)",
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "var(--track-wide)",
        textTransform: "uppercase",
        color: "var(--ink)",
        textDecoration: "none",
        paddingBottom: 4,
        borderBottom: isActive ? "2px solid var(--ink)" : "2px solid transparent",
        whiteSpace: "nowrap"
      }
    }, l);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-lg)",
      justifyContent: "flex-end",
      alignItems: "center",
      color: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Search",
    style: btn
  }, ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Wishlist",
    style: btn
  }, ic(/*#__PURE__*/React.createElement("path", {
    d: "M19 14c1.49-1.46 3-3.21 3-5.5A4.5 4.5 0 0 0 14.5 5L12 7.5 9.5 5A4.5 4.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Bag",
    style: {
      ...btn,
      position: "relative"
    }
  }, ic(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 10a4 4 0 0 1-8 0"
  }))), bagCount != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -4,
      right: -6,
      minWidth: 16,
      height: 16,
      padding: "0 4px",
      background: "var(--ink)",
      color: "var(--on-ink)",
      fontSize: 10,
      fontWeight: 700,
      borderRadius: "var(--radius-full)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, bagCount)))));
}
const btn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  padding: 0,
  border: "none",
  background: "transparent",
  color: "inherit",
  cursor: "pointer"
};
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/About.jsx
try { (() => {
/* SIK Storefront — About */
function About({
  nav
}) {
  const {
    NavBar,
    Footer,
    Button
  } = window.SIKDesignSystem_7bbf7d;
  const {
    Editorial,
    PageWrap,
    BrandIcons
  } = window;
  const footerCols = window.SIK_FOOTER;
  const L = window.SIK_LOGO;
  const IMG = window.SIK_PRODUCT_IMG;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    active: "About",
    links: ["New", "Necklaces", "About"],
    bagCount: 2,
    onNavClick: nav,
    logoSrc: L.light,
    utility: window.SIK_UTILITY,
    utilityHref: window.SIK_INSTAGRAM
  }), /*#__PURE__*/React.createElement(Editorial, {
    ratio: "16 / 6.5",
    tone: "#1a1a1a",
    display: true,
    kicker: "The brand",
    headline: /*#__PURE__*/React.createElement(React.Fragment, null, "Sport", /*#__PURE__*/React.createElement("br", null), "Healty& Everyday"),
    korean: "\uC6B4\uB3D9\uACFC \uC77C\uC0C1\uC758 \uACBD\uACC4 \uC5C6\uC774.",
    align: "bottom-center"
  }), /*#__PURE__*/React.createElement(PageWrap, {
    style: {
      paddingTop: "var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620,
      margin: "0 auto",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sik-kicker",
    style: {
      marginBottom: "var(--space-lg)"
    }
  }, "Our story"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 22,
      lineHeight: 1.7,
      color: "var(--ink)",
      fontWeight: 500,
      margin: 0,
      textWrap: "pretty"
    }
  }, "SIK\uC740 \uD53C\uD2B8\uB2C8\uC2A4 \uB77C\uC774\uD504\uC2A4\uD0C0\uC77C\uC5D0\uC11C \uCD9C\uBC1C\uD55C \uC561\uC138\uC11C\uB9AC \uBE0C\uB79C\uB4DC\uC785\uB2C8\uB2E4. \uCC9C\uC5F0 \uC870\uAC1C\uB85C \uB9CC\uB4E0 \uBBF8\uB2C8\uBA40\uD55C \uBAA9\uAC78\uC774\uB294 \uC6B4\uB3D9\uD560 \uB54C\uB3C4, \uD3C9\uC0C1\uC2DC\uC5D0\uB3C4 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uC5B4\uC6B8\uB9BD\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      lineHeight: 1.8,
      color: "var(--charcoal)",
      marginTop: "var(--space-xl)",
      textWrap: "pretty"
    }
  }, "\uD53C\uC2DD\uD478\uB4DC(@psickfood)\uC5D0\uC11C \uC2DC\uC791\uB41C SIK\uC740 \uC9D0\uC6E8\uC5B4\uC640 \uB370\uC77C\uB9AC\uB8E9\uC758 \uACBD\uACC4\uB97C \uC9C0\uC6C1\uB2C8\uB2E4. \uACFC\uD55C \uC7A5\uC2DD \uC5C6\uC774, \uC808\uC81C\uB41C \uB514\uC790\uC778\uC73C\uB85C \u2014 \uB9E4\uC77C \uCC29\uC6A9\uD560 \uC218 \uC788\uB294 \uAC00\uBCBC\uC6C0\uC744 \uB9CC\uB4ED\uB2C8\uB2E4."))), /*#__PURE__*/React.createElement(PageWrap, {
    style: {
      paddingTop: "var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(BrandIcons, {
    variant: "b",
    size: 46,
    gap: "clamp(28px, 6vw, 72px)"
  }))), /*#__PURE__*/React.createElement(PageWrap, {
    style: {
      paddingTop: "var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement(Editorial, {
    ratio: "4 / 5",
    image: IMG,
    imagePos: "center",
    kicker: "The piece",
    headline: "Natural shell"
  }), /*#__PURE__*/React.createElement(Editorial, {
    ratio: "4 / 5",
    tone: "#161616",
    kicker: "In the everyday",
    headline: "Kept for the day"
  }))), /*#__PURE__*/React.createElement(PageWrap, {
    style: {
      paddingTop: "var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-3xl)",
      borderTop: "var(--divider-hairline)",
      paddingTop: "var(--space-3xl)"
    }
  }, [["Natural", "천연 조개 소재. 가공을 최소화한 본연의 질감."], ["Minimal", "두 톤의 절제된 디자인. 과한 컬러도, 장식도 없습니다."], ["Everyday", "운동과 일상 어디서나. 가볍게 매일 착용하는 무게."]].map(([h, p]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    className: "sik-heading-md",
    style: {
      marginBottom: 10
    }
  }, h), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      lineHeight: 1.7,
      color: "var(--mute)",
      margin: 0
    }
  }, p))))), /*#__PURE__*/React.createElement(PageWrap, {
    style: {
      paddingTop: "var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sik-display-xl",
    style: {
      fontSize: "clamp(40px, 5vw, 64px)"
    }
  }, "Wear it your way"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-xl)",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => nav("Necklaces")
  }, "Shop the collection")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement(Footer, {
    columns: footerCols,
    logoSrc: L.light,
    linkHref: window.SIK_INSTAGRAM
  })));
}
window.About = About;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Collection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* SIK Storefront — Collection (single product) */
function Collection({
  nav,
  openProduct
}) {
  const {
    NavBar,
    Footer,
    ProductCard
  } = window.SIKDesignSystem_7bbf7d;
  const {
    PageWrap
  } = window;
  const P = window.SIK_DATA.products;
  const footerCols = window.SIK_FOOTER;
  const L = window.SIK_LOGO;
  const NAV = ["New", "Necklaces", "About"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    active: "Necklaces",
    links: NAV,
    bagCount: 2,
    onNavClick: nav,
    logoSrc: L.light,
    utility: window.SIK_UTILITY,
    utilityHref: window.SIK_INSTAGRAM
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      boxShadow: "var(--shadow-sticky-edge)"
    }
  }, /*#__PURE__*/React.createElement(PageWrap, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      height: 52
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--mute)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      nav("New");
    },
    style: {
      color: "var(--mute)",
      textDecoration: "none"
    }
  }, "Home"), " / ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink)"
    }
  }, "Necklaces"))))), /*#__PURE__*/React.createElement(PageWrap, {
    style: {
      paddingTop: "var(--space-3xl)",
      paddingBottom: "var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 520,
      marginBottom: "var(--space-3xl)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "sik-heading-xl",
    style: {
      fontSize: 28
    }
  }, "Necklaces"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: "var(--charcoal)",
      marginTop: 12
    }
  }, "SIK\uC740 \uB2E8 \uD558\uB098\uC758 \uBAA9\uAC78\uC774\uB9CC \uB9CC\uB4ED\uB2C8\uB2E4 \u2014 \uCC9C\uC5F0 \uC2A4\uD1A4 \uBE44\uC988, \uBE14\uB799\uBE0C\uB77C\uC6B4.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      marginBottom: "var(--space-lg)"
    }
  }, P.length, " item"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-sm)"
    }
  }, P.map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.id
  }, p, {
    onClick: e => {
      e.preventDefault();
      openProduct(p.id);
    }
  }))))), /*#__PURE__*/React.createElement(Footer, {
    columns: footerCols,
    logoSrc: L.light,
    linkHref: window.SIK_INSTAGRAM
  }));
}
window.Collection = Collection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Collection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Home.jsx
try { (() => {
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
function Home({
  nav,
  openProduct
}) {
  const {
    NavBar,
    Footer,
    Button
  } = window.SIKDesignSystem_7bbf7d;
  const {
    Editorial,
    PageWrap
  } = window;
  const product = window.SIK_DATA.products[0];
  const footerCols = window.SIK_FOOTER;
  const L = window.SIK_LOGO;
  const IMG = window.SIK_PRODUCT_IMG;
  const ICONS = window.SIK_ICONS;
  const MUSCLE = window.SIK_MUSCLE;
  const NAV = ["New", "Necklaces", "About"];
  const won = n => "KRW " + n.toLocaleString("en-US");

  // The brand's 5 line-icons, white variant for the ink hero.
  const heroIcons = [{
    key: "head",
    alt: "Brand"
  }, {
    key: "dumbbell",
    alt: "Gym"
  }, {
    key: "necklace",
    alt: "Necklaces"
  }, {
    key: "tshirt",
    alt: "Apparel"
  }, {
    key: "hanger",
    alt: "Lookbook"
  }];

  // ── Merge effect: the 5 icons periodically converge into the muscle mark ──
  const stageRef = React.useRef(null);
  const iconRefs = React.useRef([]);
  const [entered, setEntered] = React.useState(false);
  const [merged, setMerged] = React.useState(false);
  const [deltas, setDeltas] = React.useState(() => heroIcons.map(() => ({
    x: 0,
    y: 0
  })));
  const measure = React.useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sr = stage.getBoundingClientRect();
    const cx = sr.left + sr.width / 2;
    const cy = sr.top + sr.height / 2;
    setDeltas(iconRefs.current.map(el => {
      if (!el) return {
        x: 0,
        y: 0
      };
      const r = el.getBoundingClientRect();
      return {
        x: cx - (r.left + r.width / 2),
        y: cy - (r.top + r.height / 2)
      };
    }));
  }, []);

  // Entrance: stagger the icons up, once.
  React.useEffect(() => {
    measure();
    const t = setTimeout(() => setEntered(true), 80);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Loop: spread → merge into muscle → hold → spread, on a calm cadence.
  React.useEffect(() => {
    if (!entered) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let unmerge, iv;
    const cycle = () => {
      measure(); // capture spread positions just before converging
      setMerged(true);
      unmerge = setTimeout(() => setMerged(false), 2600);
    };
    const start = setTimeout(() => {
      cycle();
      iv = setInterval(cycle, 7000);
    }, 2600);
    return () => {
      clearTimeout(start);
      clearInterval(iv);
      clearTimeout(unmerge);
    };
  }, [entered, measure]);
  const iconStyle = i => {
    if (!entered) return {
      opacity: 0,
      transform: "translateY(16px) scale(1)",
      transitionDelay: i * 0.08 + "s"
    };
    if (merged) return {
      opacity: 0,
      transform: `translate(${deltas[i].x}px, ${deltas[i].y}px) scale(.18)`,
      transitionDelay: "0s"
    };
    return {
      opacity: 1,
      transform: "translate(0,0) scale(1)",
      transitionDelay: i * 0.05 + "s"
    };
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement("style", null, HERO_CSS), /*#__PURE__*/React.createElement(NavBar, {
    active: "New",
    links: NAV,
    bagCount: 2,
    onNavClick: nav,
    logoSrc: L.light,
    utility: window.SIK_UTILITY,
    utilityHref: window.SIK_INSTAGRAM
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--ink)"
    }
  }, /*#__PURE__*/React.createElement(PageWrap, {
    style: {
      minHeight: "clamp(440px, 60vh, 620px)",
      display: "flex",
      alignItems: "center",
      gap: "clamp(40px, 5vw, 88px)",
      flexWrap: "wrap",
      padding: "clamp(56px,8vh,104px) var(--gutter-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 440px",
      minWidth: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sik-kicker",
    style: {
      color: "var(--on-ink-mute)",
      marginBottom: 20
    }
  }, "SS Collection"), /*#__PURE__*/React.createElement("h1", {
    className: "sik-display",
    style: {
      color: "var(--on-ink)",
      fontSize: "clamp(56px, 7.5vw, 116px)"
    }
  }, "Fashion Psick"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--on-ink)",
      fontSize: 17,
      fontWeight: 500,
      marginTop: 22,
      maxWidth: 420
    }
  }, "\uC6B4\uB3D9\uACFC \uC77C\uC0C1\uC758 \uACBD\uACC4 \uC5C6\uC774. \uB2E8 \uD558\uB098\uC758 \uBAA9\uAC78\uC774."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "onImage",
    size: "lg",
    onClick: () => openProduct(product.id)
  }, "Shop the necklace"))), /*#__PURE__*/React.createElement("div", {
    className: "sik-hero-art",
    style: {
      flex: "1 1 360px",
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "sik-hero-ghost",
    src: L.dark,
    alt: "",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sik-hero-stage",
    ref: stageRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "sik-hero-icons"
  }, heroIcons.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.key,
    ref: el => iconRefs.current[i] = el,
    className: "sik-hero-icon",
    style: iconStyle(i)
  }, /*#__PURE__*/React.createElement("img", {
    className: "sik-hero-icon-img",
    src: ICONS[it.key] + "-w.png",
    alt: it.alt,
    style: {
      animationDelay: i * 0.55 + "s"
    }
  })))), /*#__PURE__*/React.createElement("img", {
    className: "sik-hero-muscle",
    src: MUSCLE.light,
    alt: "SIK",
    style: {
      opacity: merged ? 1 : 0,
      transform: merged ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-50%) scale(.55)"
    }
  }))))), /*#__PURE__*/React.createElement(PageWrap, {
    style: {
      paddingTop: "var(--space-5xl)",
      paddingBottom: "var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sik-kicker",
    style: {
      textAlign: "center",
      marginBottom: "var(--space-2xl)"
    }
  }, "Signature"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 420,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => openProduct(product.id),
    "aria-label": product.name,
    style: {
      display: "block",
      width: "100%",
      padding: 0,
      border: "none",
      cursor: "pointer",
      aspectRatio: "3 / 4.4",
      backgroundColor: "var(--soft-cloud)",
      backgroundImage: `url(${IMG})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 600,
      color: "var(--ink)",
      letterSpacing: "0.01em"
    }
  }, product.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: "var(--charcoal)",
      marginTop: 4
    }
  }, won(product.price))))), /*#__PURE__*/React.createElement(PageWrap, {
    style: {
      paddingBottom: "var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement(Editorial, {
    ratio: "16 / 6",
    tone: "#111",
    kicker: "The brand",
    headline: "Worn at the gym. Kept for the day.",
    cta: "Our story",
    onCta: () => nav("About")
  })), /*#__PURE__*/React.createElement(Footer, {
    columns: footerCols,
    logoSrc: L.light,
    linkHref: window.SIK_INSTAGRAM
  }));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Product.jsx
try { (() => {
/* SIK Storefront — Product (PDP) */
function Product({
  nav,
  openProduct,
  productId
}) {
  const {
    NavBar,
    Footer,
    ProductCard,
    PriceTag,
    SwatchDot,
    Button,
    IconButton,
    DisclosureRow
  } = window.SIKDesignSystem_7bbf7d;
  const {
    Studio,
    PageWrap
  } = window;
  const P = window.SIK_DATA.products;
  const footerCols = window.SIK_FOOTER;
  const L = window.SIK_LOGO;
  const product = P.find(p => p.id === productId) || P[0];
  const gallery = product.gallery || [product.image];
  const [sw, setSw] = React.useState(0);
  const [len, setLen] = React.useState(product.length);
  const [thumb, setThumb] = React.useState(0);
  const NAV = ["New", "Necklaces", "About"];
  const heart = /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 14c1.49-1.46 3-3.21 3-5.5A4.5 4.5 0 0 0 14.5 5L12 7.5 9.5 5A4.5 4.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    active: "Necklaces",
    links: NAV,
    bagCount: 2,
    onNavClick: nav,
    logoSrc: L.light,
    utility: window.SIK_UTILITY,
    utilityHref: window.SIK_INSTAGRAM
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      boxShadow: "var(--shadow-sticky-edge)"
    }
  }, /*#__PURE__*/React.createElement(PageWrap, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      height: 52,
      fontSize: 13,
      color: "var(--mute)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      nav("New");
    },
    style: {
      color: "var(--mute)",
      textDecoration: "none"
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: "0 8px"
    }
  }, "/"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      nav("Necklaces");
    },
    style: {
      color: "var(--mute)",
      textDecoration: "none"
    }
  }, "Necklaces"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: "0 8px"
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink)"
    }
  }, product.name)))), /*#__PURE__*/React.createElement(PageWrap, {
    style: {
      paddingTop: "var(--space-2xl)",
      paddingBottom: "var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.15fr 1fr",
      gap: "var(--space-4xl)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "72px 1fr",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)"
    }
  }, gallery.map((src, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setThumb(i),
    style: {
      padding: 0,
      border: i === thumb ? "1px solid var(--ink)" : "1px solid var(--hairline)",
      background: "transparent",
      cursor: "pointer",
      aspectRatio: "1 / 1",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      backgroundImage: `url(${src})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "1 / 1",
      backgroundColor: "var(--soft-cloud)",
      backgroundImage: `url(${gallery[thumb]})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "sik-heading-xl",
    style: {
      fontSize: 28
    }
  }, product.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--mute)",
      marginTop: 8
    }
  }, product.subtitle), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-xl)"
    }
  }, /*#__PURE__*/React.createElement(PriceTag, {
    price: product.price,
    compareAt: product.compareAt,
    size: "lg"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-2xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: pdpLabel
  }, "Color \u2014 ", product.swatches[sw].label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-md)"
    }
  }, product.swatches.map((s, i) => /*#__PURE__*/React.createElement(SwatchDot, {
    key: i,
    color: s.color,
    label: s.label,
    size: 24,
    selected: i === sw,
    onClick: () => setSw(i)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: pdpLabel
  }, "Length"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-sm)",
      flexWrap: "wrap"
    }
  }, [product.length].map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    onClick: () => setLen(l),
    style: {
      height: 40,
      padding: "0 16px",
      border: len === l ? "1px solid var(--ink)" : "1px solid var(--hairline)",
      background: len === l ? "var(--ink)" : "var(--paper)",
      color: len === l ? "var(--on-ink)" : "var(--ink)",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer"
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-sm)",
      marginTop: "var(--space-2xl)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: window.SIK_SMARTSTORE,
    target: "_blank",
    rel: "noopener noreferrer",
    variant: "primary",
    size: "lg",
    fullWidth: true,
    style: {
      fontSize: 17
    }
  }, "\uB124\uC774\uBC84\uC5D0\uC11C \uAD6C\uB9E4\uD558\uAE30"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Wishlist",
    variant: "outline",
    size: 56
  }, heart)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--mute)",
      marginTop: "var(--space-md)"
    }
  }, "\uACB0\uC81C\uB294 \uB124\uC774\uBC84\uD398\uC774 \xB7 \uC2A4\uB9C8\uD2B8\uC2A4\uD1A0\uC5B4\uB85C \uC5F0\uACB0\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-2xl)"
    }
  }, /*#__PURE__*/React.createElement(DisclosureRow, {
    label: "Materials & Care",
    defaultOpen: true
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "\uCC9C\uC5F0 \uC870\uAC1C \xB7 \uB098\uC77C\uB860 \uCF54\uB4DC \xB7 \uC2A4\uD14C\uC778\uB9AC\uC2A4 \uD074\uB798\uC2A4\uD504. \uB540\uACFC \uBB3C\uC5D0 \uAC15\uD55C \uC18C\uC7AC\uB85C\uC6B4\uB3D9 \uC911\uC5D0\uB3C4\uCC29\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.")), /*#__PURE__*/React.createElement(DisclosureRow, {
    label: "Shipping & Returns"
  }, "\uC601\uC5C5\uC77C \uAE30\uC900 2\u20133\uC77C \uCD9C\uACE0 \xB7 \uB2E8\uC21C \uBCC0\uC2EC \uAD50\uD658/\uBC18\uD488\uC740 \uC218\uB839 \uD6C4 7\uC77C \uC774\uB0B4 \uAC00\uB2A5\uD569\uB2C8\uB2E4."), /*#__PURE__*/React.createElement(DisclosureRow, {
    label: "Reviews (124)"
  }, "\uD3C9\uADE0 4.9 / 5.0 \u2014 \"\uAC00\uBCCD\uACE0 \uC5B4\uB514\uC5D0\uB098 \uC798 \uC5B4\uC6B8\uB824\uC694.\""))))), /*#__PURE__*/React.createElement(ProductDetail, null), /*#__PURE__*/React.createElement(Footer, {
    columns: footerCols,
    logoSrc: L.light,
    linkHref: window.SIK_INSTAGRAM
  }));
}

/* ── 상세 설명 (Korean detail page) ───────────────────────── */
function ProductDetail() {
  const A = "../../assets/";
  const img = {
    display: "block",
    width: "100%",
    height: "auto"
  };
  const eyebrow = {
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--ink)"
  };
  const body = {
    fontFamily: "var(--font-sans)",
    fontSize: 15,
    lineHeight: 1.85,
    color: "var(--mute)",
    margin: 0
  };
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      borderTop: "var(--divider-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: "0 auto",
      padding: "var(--space-4xl) var(--gutter-page) var(--space-5xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: "var(--space-2xl)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...eyebrow,
      color: "var(--mute)"
    }
  }, "Product Detail")), /*#__PURE__*/React.createElement("img", {
    src: A + "detail-logo.png",
    alt: "SIK",
    style: {
      ...img,
      background: "#000"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "var(--space-3xl) 0 var(--space-2xl)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 22,
      fontWeight: 700,
      color: "var(--ink)",
      margin: "0 0 var(--space-lg)"
    }
  }, "[SIK] \uB0B4\uCD94\uB7F4 \uC2A4\uD1A4 \uBE44\uC988 \uBAA9\uAC78\uC774 \u2013 \uBE14\uB799\uBE0C\uB77C\uC6B4"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      textAlign: "center"
    }
  }, "\uC790\uC5F0\uC5D0\uC11C \uC601\uAC10\uC744 \uBC1B\uC740 \uBE14\uB799\uACFC \uBE0C\uB77C\uC6B4 \uCEEC\uB7EC\uC758 \uC2A4\uD1A4 \uBE44\uC988\uB97C \uC870\uD569\uD574", /*#__PURE__*/React.createElement("br", null), "\uCC28\uBD84\uD558\uBA74\uC11C\uB3C4 \uC138\uB828\uB41C \uBD84\uC704\uAE30\uB97C \uB2F4\uC558\uC2B5\uB2C8\uB2E4.", /*#__PURE__*/React.createElement("br", null), "\uB2E8\uB3C5\uC73C\uB85C \uCC29\uC6A9\uD574\uB3C4 \uD3EC\uC778\uD2B8\uAC00 \uB418\uBA70, \uB2E4\uB978 \uC561\uC138\uC11C\uB9AC\uC640", /*#__PURE__*/React.createElement("br", null), "\uB808\uC774\uC5B4\uB4DC\uD574 \uB2E4\uC591\uD55C \uBB34\uB4DC\uB97C \uC5F0\uCD9C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-2xl)",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--mute)",
      letterSpacing: "0.02em"
    }
  }, "1\uCC28 \uD310\uB9E4 \xB7 OPEN \uD2B9\uAC00"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 30,
      fontWeight: 800,
      color: "var(--ink)"
    }
  }, "19,900", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, "\uC6D0")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--mute)"
    }
  }, "\uC218\uB7C9 20\uAC1C \uD55C\uC815"))), /*#__PURE__*/React.createElement("img", {
    src: A + "detail-model.jpg",
    alt: "",
    style: img
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "var(--space-4xl) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...eyebrow,
      marginBottom: "var(--space-xl)"
    }
  }, "Detail"), /*#__PURE__*/React.createElement("dl", {
    style: {
      display: "inline-grid",
      gridTemplateColumns: "auto auto",
      gap: "10px 18px",
      textAlign: "left",
      margin: 0
    }
  }, [["브랜드", "SIK"], ["제품명", "내추럴 스톤 비즈 목걸이"], ["컬러", "블랙브라운"], ["소재", "내추럴 스톤 비즈"], ["사이즈", "42cm + 연장 체인 5cm"], ["제조국", "외국"]].map(([k, v]) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: k
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--mute)"
    }
  }, k), /*#__PURE__*/React.createElement("dd", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: "var(--ink)",
      margin: 0
    }
  }, v))))), /*#__PURE__*/React.createElement("img", {
    src: A + "detail-flat.jpg",
    alt: "",
    style: img
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--space-md)"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: A + "detail-clasp.jpg",
    alt: "",
    style: img
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "var(--space-4xl) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...eyebrow,
      marginBottom: "var(--space-xl)"
    }
  }, "Notice"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...body,
      fontSize: 14,
      lineHeight: 2
    }
  }, "\uCC9C\uC5F0 \uC2A4\uD1A4 \uD2B9\uC131\uC0C1 \uBE44\uC988\uB9C8\uB2E4 \uC0C9\uC0C1, \uBB34\uB2AC, \uD06C\uAE30\uC5D0 \uBBF8\uC138\uD55C \uCC28\uC774\uAC00 \uC788\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.", /*#__PURE__*/React.createElement("br", null), "\uC81C\uC791 \uACFC\uC815\uC5D0\uC11C \uBBF8\uC138\uD55C \uC2A4\uD06C\uB798\uCE58 \uBC0F \uAC1C\uCCB4 \uCC28\uC774\uAC00 \uBC1C\uC0DD\uD560 \uC218 \uC788\uC73C\uBA70,", /*#__PURE__*/React.createElement("br", null), "\uC774\uB294 \uBD88\uB7C9 \uC0AC\uC720\uC5D0 \uD574\uB2F9\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.", /*#__PURE__*/React.createElement("br", null), "\uBB3C, \uB540, \uD5A5\uC218, \uD654\uC7A5\uD488\uACFC\uC758 \uC811\uCD09\uC740 \uBCC0\uC0C9 \uBC0F \uC190\uC0C1\uC758 \uC6D0\uC778\uC774 \uB420 \uC218 \uC788\uC73C\uB2C8 \uC8FC\uC758\uD574 \uC8FC\uC138\uC694.", /*#__PURE__*/React.createElement("br", null), "\uC0AC\uC6A9 \uD6C4\uC5D0\uB294 \uBD80\uB4DC\uB7EC\uC6B4 \uCC9C\uC73C\uB85C \uAC00\uBCCD\uAC8C \uB2E6\uC544 \uC2B5\uAE30\uAC00 \uC801\uC740 \uACF3\uC5D0 \uBCF4\uAD00\uD574 \uC8FC\uC138\uC694.")), /*#__PURE__*/React.createElement("img", {
    src: A + "detail-macro.jpg",
    alt: "",
    style: img
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--space-md)"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: A + "detail-v.jpg",
    alt: "",
    style: img
  })));
}
const pdpLabel = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--ink)",
  marginBottom: "var(--space-md)"
};
window.Product = Product;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Product.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/data.js
try { (() => {
/* SIK Storefront — shared demo data (KRW) + asset paths.
   Paths are relative to ui_kits/storefront/index.html. */
(function () {
  var SW = {
    blackbrown: {
      color: "#2a211b",
      label: "Black Brown"
    }
  };

  // Real product photography (natural stone bead necklace, black brown).
  // Photo 1 is the model/thumbnail; the studio shots follow on the detail gallery.
  var IMG = "../../assets/necklace-model.jpg";
  var GALLERY = ["../../assets/necklace-model.jpg", "../../assets/necklace-1.png", "../../assets/necklace-2.png", "../../assets/necklace-3.png"];

  // The store sells exactly one product, in one colour.
  var products = [{
    id: "stone-bead",
    name: "식 내추럴 스톤 비즈 목걸이",
    subtitle: "Natural Stone Bead Necklace · Black Brown",
    price: 19900,
    compareAt: 29900,
    badge: "Signature",
    image: IMG,
    gallery: GALLERY,
    swatches: [SW.blackbrown],
    length: "42 cm + 5 cm",
    cat: "Necklaces"
  }];
  window.SIK_DATA = {
    products: products,
    SW: SW
  };
  window.SIK_PRODUCT_IMG = IMG;

  // Real logo assets (transparent PNG, derived from the brand mark).
  window.SIK_LOGO = {
    light: "../../assets/logo-sik-wordmark-black.png",
    // black "SIK" — for light surfaces
    dark: "../../assets/logo-sik-wordmark-white.png",
    // white "SIK" — for dark surfaces
    lockupDark: "../../assets/logo-sik-lockup-white.png",
    // icons + SIK, white — for dark surfaces
    lockupLight: "../../assets/logo-sik-lockup-black.png" // icons + SIK, black — for light surfaces
  };

  // The brand's own 5 line-icons, sliced from the logo (white + black variants).
  window.SIK_ICONS = {
    head: "../../assets/icon-head",
    dumbbell: "../../assets/icon-dumbbell",
    necklace: "../../assets/icon-necklace",
    tshirt: "../../assets/icon-tshirt",
    hanger: "../../assets/icon-hanger"
  };

  // The brand mascot the 5 icons merge into (transparent, white + ink).
  window.SIK_MUSCLE = {
    light: "../../assets/icon-muscle-w.png",
    // white — for dark surfaces
    dark: "../../assets/icon-muscle-b.png" // ink   — for light surfaces
  };

  // Brand Instagram — every contact / help link points here.
  var IG = "https://www.instagram.com/fashionpsick/";
  window.SIK_INSTAGRAM = IG;

  // Naver SmartStore — "Add to bag" / checkout deep-link.
  window.SIK_SMARTSTORE = "https://smartstore.naver.com/athleticstore/products/13635362111";

  // Utility strip — all route to Instagram (via NavBar's utilityHref).
  window.SIK_UTILITY = ["Find a Store", "Help", "Naver Store"];
  window.SIK_FOOTER = [{
    title: "Shop",
    links: ["스톤 비즈 목걸이", "Size Guide", "Care"]
  }, {
    title: "Help",
    links: ["Shipping", "Returns", "문의 · Contact"]
  }, {
    title: "Brand",
    links: ["About", "Instagram", "Naver Store"]
  }];
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/data.js", error: String((e && e.message) || e) }); }

// ui_kits/storefront/kit-shared.jsx
try { (() => {
/* SIK Storefront — shared layout + placeholder helpers.
   Exports to window: Studio, Editorial, SectionHead, PageWrap. */

/* Soft-cloud studio block standing in for product photography. */
function Studio({
  ratio = "4 / 5",
  label = "SIK",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: ratio,
      background: "var(--soft-cloud)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--stone)"
    }
  }, label));
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
  style = {}
}) {
  const justify = align.startsWith("center") ? "center" : "flex-end";
  const items = align.endsWith("center") ? "center" : "flex-start";
  const bg = image ? {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: imagePos,
    backgroundColor: tone
  } : {
    background: `linear-gradient(150deg, ${tone} 0%, #0d0d0d 100%)`
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: ratio,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: justify,
      alignItems: items,
      ...bg,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--image-scrim-bottom)"
    }
  }), kicker && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 24,
      left: 28,
      zIndex: 1,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--on-ink-mute)"
    }
  }, kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      padding: 32,
      textAlign: items === "center" ? "center" : "left",
      maxWidth: 640
    }
  }, headline && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: display ? "clamp(48px, 6vw, 96px)" : "clamp(32px, 3.5vw, 56px)",
      lineHeight: 0.92,
      letterSpacing: "-0.01em",
      textTransform: "uppercase",
      color: "var(--on-ink)"
    }
  }, headline), korean && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      fontWeight: 500,
      color: "var(--on-ink)"
    }
  }, korean), cta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCta,
    style: {
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
      cursor: "pointer"
    }
  }, cta))));
}

/* Section header: optional kicker + uppercase XL title, hairline-free. */
function SectionHead({
  kicker,
  title,
  action,
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 24,
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, kicker && /*#__PURE__*/React.createElement("div", {
    className: "sik-kicker",
    style: {
      marginBottom: 8
    }
  }, kicker), /*#__PURE__*/React.createElement("h2", {
    className: "sik-heading-xl"
  }, title)), action && /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onAction && onAction();
    },
    className: "sik-link",
    style: {
      fontSize: 14,
      fontWeight: 600,
      whiteSpace: "nowrap"
    }
  }, action));
}

/* A row of the brand's 5 line-icons with labels. variant 'w'|'b'. */
function BrandIcons({
  variant = "b",
  items,
  gap = 28,
  size = 40,
  style = {}
}) {
  const I = window.SIK_ICONS;
  const def = items || [{
    key: "dumbbell",
    label: "Gym"
  }, {
    key: "necklace",
    label: "Necklaces"
  }, {
    key: "tshirt",
    label: "Apparel"
  }, {
    key: "hanger",
    label: "Lookbook"
  }, {
    key: "head",
    label: "Brand"
  }];
  const color = variant === "w" ? "var(--on-ink)" : "var(--ink)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap,
      alignItems: "flex-end",
      flexWrap: "wrap",
      ...style
    }
  }, def.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.key,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${I[it.key]}-${variant}.png`,
    alt: it.label,
    style: {
      height: size,
      width: "auto"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color
    }
  }, it.label))));
}

/* Centered content container with page gutters. */
function PageWrap({
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--gutter-page)",
      ...style
    }
  }, children);
}
Object.assign(window, {
  Studio,
  Editorial,
  SectionHead,
  PageWrap,
  BrandIcons
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/kit-shared.jsx", error: String((e && e.message) || e) }); }

__ds_ns.PriceTag = __ds_scope.PriceTag;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.SwatchDot = __ds_scope.SwatchDot;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.DisclosureRow = __ds_scope.DisclosureRow;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.NavBar = __ds_scope.NavBar;

})();
