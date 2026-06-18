/* SIK Storefront — shared demo data (KRW) + asset paths.
   Paths are relative to ui_kits/storefront/index.html. */
(function () {
  var SW = {
    blackbrown: { color: "#2a211b", label: "Black Brown" },
  };

  // Real product photography (natural stone bead necklace, black brown).
  // Photo 1 is the model/thumbnail; the studio shots follow on the detail gallery.
  var IMG = "assets/necklace-model.jpg";
  var GALLERY = [
    "assets/necklace-model.jpg",
    "assets/necklace-1.png",
    "assets/necklace-2.png",
    "assets/necklace-3.png",
  ];

  // The store sells exactly one product, in one colour.
  var products = [
    { id: "stone-bead", name: "식 내추럴 스톤 비즈 목걸이", subtitle: "Natural Stone Bead Necklace · Black Brown", price: 19900, compareAt: 29900, badge: "Signature", image: IMG, gallery: GALLERY, swatches: [SW.blackbrown], length: "42 cm + 5 cm", cat: "Necklaces" },
  ];

  window.SIK_DATA = { products: products, SW: SW };
  window.SIK_PRODUCT_IMG = IMG;

  // Real logo assets (transparent PNG, derived from the brand mark).
  window.SIK_LOGO = {
    light: "assets/logo-sik-wordmark-black.png",          // black "SIK" — for light surfaces
    dark: "assets/logo-sik-wordmark-white.png",           // white "SIK" — for dark surfaces
    lockupDark: "assets/logo-sik-lockup-white.png",       // icons + SIK, white — for dark surfaces
    lockupLight: "assets/logo-sik-lockup-black.png",      // icons + SIK, black — for light surfaces
  };

  // The brand's own 5 line-icons, sliced from the logo (white + black variants).
  window.SIK_ICONS = {
    head: "assets/icon-head",
    dumbbell: "assets/icon-dumbbell",
    necklace: "assets/icon-necklace",
    tshirt: "assets/icon-tshirt",
    hanger: "assets/icon-hanger",
  };

  // The brand mascot the 5 icons merge into (transparent, white + ink).
  window.SIK_MUSCLE = {
    light: "assets/icon-muscle-w.png",   // white — for dark surfaces
    dark: "assets/icon-muscle-b.png",    // ink   — for light surfaces
  };

  // Brand Instagram — every contact / help link points here.
  var IG = "https://www.instagram.com/fashionpsick/";
  window.SIK_INSTAGRAM = IG;

  // Naver SmartStore — "Add to bag" / checkout deep-link.
  window.SIK_SMARTSTORE = "https://smartstore.naver.com/athleticstore/products/13635362111";

  // Utility strip — all route to Instagram (via NavBar's utilityHref).
  window.SIK_UTILITY = ["Find a Store", "Help", "Naver Store"];

  window.SIK_FOOTER = [
    { title: "Shop", links: ["스톤 비즈 목걸이", "Size Guide", "Care"] },
    { title: "Help", links: ["Shipping", "Returns", "문의 · Contact"] },
    { title: "Brand", links: ["About", "Instagram", "Naver Store"] },
  ];
})();
