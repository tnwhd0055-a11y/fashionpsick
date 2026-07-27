/* SIK Storefront — shared demo data (KRW) + asset paths.
   Paths are relative to index.html. */
(function () {
  var SW = {
    blackbrown: { color: "#2a211b", label: "Black Brown" },
    black:      { color: "#1c1c1c", label: "Black" },
    lightgrey:  { color: "#cfcfcf", label: "Light Grey" },
    silver:     { color: "#c9ccd1", label: "Silver" },
    ivory:      { color: "#ece7dd", label: "Ivory" },
  };

  // ── Products ──────────────────────────────────────────────
  // cat: 카테고리 (Necklaces / Tops / Accessories)
  // colors: 색상별 갤러리(있으면 PDP 스와치가 갤러리 전환) — 없으면 gallery 사용
  // detail: 'stone' = 기존 목걸이 풀 상세 / 'generic' = 갤러리+스펙+노티스 자동
  var products = [
    // 1) 기존 시그니처 목걸이 (유지)
    {
      id: "stone-bead", cat: "Necklaces",
      name: "EP.1 내추럴 스톤 비즈 목걸이",
      subtitle: "Natural Stone Bead Necklace · Black Brown",
      price: 19900, compareAt: 29900, badge: "Signature",
      buy: "https://m.smartstore.naver.com/athleticstore/products/13635362111",
      image: "assets/necklace-model.jpg",
      frontImage: "assets/necklace-1.png",
      gallery: ["assets/necklace-model.jpg", "assets/necklace-1.png", "assets/necklace-2.png", "assets/necklace-3.png"],
      swatches: [SW.blackbrown], length: "42 cm + 5 cm",
      detail: "stone",
    },

    // 2) 블랙 펄 비즈 목걸이 (신규)
    {
      id: "blackpoint-necklace", cat: "Necklaces",
      name: "EP.2 블랙 펄 비즈 목걸이",
      subtitle: "Black Pearl Beaded Necklace · Black",
      price: 23900, compareAt: 29900, badge: "New",
      buy: "https://m.smartstore.naver.com/athleticstore/products/13683518219",
      image: "assets/blackpoint-worn.jpg",
      frontImage: "assets/blackpoint-front.jpg",
      gallery: ["assets/blackpoint-worn.jpg", "assets/blackpoint-full.jpg", "assets/blackpoint-front.jpg", "assets/blackpoint-clasp.jpg"],
      swatches: [SW.black], length: "43 cm + 5 cm",
      detail: "generic",
      spec: [["브랜드", "SIK"], ["제품명", "EP.2 블랙 펄 비즈 목걸이"], ["컬러", "블랙"], ["소재", "블랙 시드비즈 · 담수진주 · 스테인리스 클래스프"], ["사이즈", "43cm + 연장 체인 5cm"], ["제조국", "중국"]],
      blurb: "블랙 시드비즈에 담수진주와 포인트 비즈를 더한 데일리 목걸이. 단독으로도, 레이어드로도 잘 어울립니다.",
    },

    // 3) 메쉬 반팔 셔츠 (신규)
    {
      id: "mesh-shirt", cat: "Tops",
      name: "메쉬 반팔 셔츠",
      subtitle: "Mesh Short-Sleeve Shirt · Ivory",
      price: 34900, compareAt: 49000, badge: "New",
      image: "assets/mesh-model.jpg",
      frontImage: "assets/mesh-front.jpg",
      gallery: ["assets/mesh-model.jpg", "assets/mesh-closeup.jpg", "assets/mesh-back.jpg", "assets/mesh-front.jpg"],
      swatches: [SW.ivory],
      detail: "generic",
      spec: [["브랜드", "SIK"], ["제품명", "메쉬 반팔 셔츠"], ["컬러", "아이보리"], ["소재", "폴리 메쉬 혼방"], ["사이즈", "준비 중 (곧 업데이트)"], ["제조국", "수입"]],
      blurb: "통기성 좋은 메쉬 소재의 반팔 셔츠. 여름철 데일리와 레이어드에 모두 활용하기 좋습니다.",
    },

    // 4) 세미크롭 반팔 티셔츠 (2색 — 스와치로 갤러리 전환)
    {
      id: "semicrop-tee", cat: "Tops",
      name: "세미크롭 반팔 티셔츠",
      subtitle: "Semi-Crop Short-Sleeve Tee",
      price: 18900, compareAt: 29900, badge: "New",
      image: "assets/tee-black-model.jpg",
      frontImage: "assets/tee-black-flat.jpg",
      colors: [
        { label: "Black", color: "#1a1a1a", gallery: ["assets/tee-black-model.jpg", "assets/tee-black-back.jpg", "assets/tee-black-flat.jpg"] },
        { label: "Light Grey", color: "#cfcfcf", gallery: ["assets/tee-grey-model.jpg", "assets/tee-grey-back.jpg", "assets/tee-grey-flat.jpg"] },
      ],
      swatches: [SW.black, SW.lightgrey],
      detail: "generic",
      spec: [["브랜드", "SIK"], ["제품명", "세미크롭 반팔 티셔츠"], ["컬러", "블랙 / 라이트 그레이"], ["소재", "코튼 혼방"], ["핏", "세미크롭 · 머슬핏"], ["사이즈", "준비 중 (곧 업데이트)"], ["제조국", "수입"]],
      blurb: "몸에 붙지 않으면서 실루엣을 살리는 세미크롭 기장의 반팔 티셔츠. 두 컬러로 준비했습니다.",
    },

    // 5) 세미크롭 반팔 2-PACK (번들)
    {
      id: "semicrop-tee-2pack", cat: "Tops",
      name: "세미크롭 반팔 티셔츠 [2-PACK]",
      subtitle: "2 Colors Bundle · Black + Light Grey",
      price: 29900, compareAt: 37800, badge: "2-PACK",
      image: "assets/tee-2pack-collage.jpg",
      frontImage: "assets/tee-2pack-flats.jpg",
      gallery: ["assets/tee-2pack-collage.jpg", "assets/tee-black-model.jpg", "assets/tee-grey-model.jpg", "assets/tee-black-flat.jpg", "assets/tee-grey-flat.jpg"],
      swatches: [SW.black, SW.lightgrey],
      detail: "generic",
      spec: [["브랜드", "SIK"], ["구성", "세미크롭 반팔 티셔츠 블랙 1 + 라이트 그레이 1"], ["소재", "코튼 혼방"], ["핏", "세미크롭 · 머슬핏"], ["사이즈", "준비 중 (곧 업데이트)"], ["제조국", "수입"]],
      blurb: "블랙과 라이트 그레이 두 컬러를 함께 구성한 2팩. 낱개로 사는 것보다 합리적입니다.",
    },

    // 6) 웨스턴 벨트 (신규)
    {
      id: "western-belt", cat: "Accessories",
      name: "웨스턴 벨트",
      subtitle: "Western Belt · Silver",
      price: 24900, badge: "New",
      buy: "https://m.smartstore.naver.com/athleticstore/products/13683518247",
      image: "assets/belt-1.jpg",
      frontImage: "assets/belt-2.jpg",
      gallery: ["assets/belt-1.jpg", "assets/belt-2.jpg", "assets/belt-3.jpg"],
      swatches: [SW.black],
      detail: "generic",
      spec: [["브랜드", "SIK"], ["제품명", "웨스턴 벨트"], ["컬러", "블랙 (실버 버클)"], ["소재", "인조가죽 · 메탈 버클"], ["사이즈", "총길이 105cm · 폭 2cm · 버클 4.5 x 3.5cm"], ["제조국", "중국"]],
      blurb: "실버 버클과 포인트 팁이 돋보이는 웨스턴 무드 벨트. 데님과 슬랙스 모두에 잘 어울립니다.",
    },
  ];

  window.SIK_DATA = { products: products, SW: SW };
  window.SIK_PRODUCT_IMG = products[1].image;   // 홈 시그니처 = 블랙 포인트 목걸이
  window.SIK_CATEGORIES = ["Tops", "Necklaces", "Accessories"];

  // Real logo assets (transparent PNG, derived from the brand mark).
  window.SIK_LOGO = {
    light: "assets/logo-sik-wordmark-black.png",
    dark: "assets/logo-sik-wordmark-white.png",
    lockupDark: "assets/logo-sik-lockup-white.png",
    lockupLight: "assets/logo-sik-lockup-black.png",
  };

  window.SIK_ICONS = {
    head: "assets/icon-head",
    dumbbell: "assets/icon-dumbbell",
    necklace: "assets/icon-necklace",
    tshirt: "assets/icon-tshirt",
    hanger: "assets/icon-hanger",
  };

  window.SIK_MUSCLE = {
    light: "assets/icon-muscle-w.png",
    dark: "assets/icon-muscle-b.png",
  };

  var IG = "https://www.instagram.com/fashionpsick/";
  window.SIK_INSTAGRAM = IG;

  // Naver SmartStore — 모바일 URL(m.)이라 폰에서 네이버 앱으로 잘 넘어감 (로그인 세션 유지 → 구매전환↑).
  // 제품별 링크는 각 product 의 buy 필드. 아직 스토어에 없는 제품은 이 스토어 홈으로 떨어진다.
  window.SIK_SMARTSTORE = "https://m.smartstore.naver.com/athleticstore";

  window.SIK_UTILITY = ["Find a Store", "Help", "Naver Store"];

  window.SIK_FOOTER = [
    { title: "Shop", links: ["Tops", "Necklaces", "Accessories"] },
    { title: "Help", links: ["Shipping", "Returns", "문의 · Contact"] },
    { title: "Brand", links: ["About", "Instagram", "Naver Store"] },
  ];
})();
