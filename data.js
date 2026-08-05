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
      spec: [["브랜드", "SIK"], ["제품명", "내추럴 스톤 비즈 목걸이"], ["컬러", "블랙브라운"], ["소재", "내추럴 스톤 비즈"], ["사이즈", "42cm + 연장 체인 5cm"], ["제조국", "중국"]],
    },

    // 2) 플라티즈마 블랙 비즈 목걸이 (구 'EP.2 블랙 펄 비즈 목걸이')
    {
      id: "blackpoint-necklace", cat: "Necklaces",
      // 표시용 이름에만 예약배송 말머리를 붙인다. 상품정보제공고시의 '품명' 은
      // spec 의 제품명(말머리 없는 정식명)을 쓴다 — 배송 일정은 품명이 아니다.
      name: "[8.12 예약배송] 플라티즈마 블랙 비즈 목걸이",
      subtitle: "Platysma Black Beaded Necklace · Black",
      price: 19900, compareAt: 29900, badge: "New",
      buy: "https://m.smartstore.naver.com/athleticstore/products/13683518219",
      image: "assets/blackpoint-worn.jpg",
      frontImage: "assets/blackpoint-front.jpg",
      gallery: ["assets/blackpoint-worn.jpg", "assets/blackpoint-full.jpg", "assets/blackpoint-front.jpg", "assets/blackpoint-clasp.jpg"],
      swatches: [SW.black], length: "43 cm + 5 cm",
      detail: "generic",
      spec: [["브랜드", "SIK"], ["제품명", "플라티즈마 블랙 비즈 목걸이"], ["컬러", "블랙"], ["소재", "블랙 시드비즈 · 담수진주 · 스테인리스 클래스프"], ["사이즈", "43cm + 연장 체인 5cm"], ["제조국", "중국"]],
      blurb: "블랙 시드비즈에 담수진주와 포인트 비즈를 더한 데일리 목걸이. 단독으로도, 레이어드로도 잘 어울립니다.",
    },

    // 3) 델토이드 메쉬 반팔 셔츠 (구 '메쉬 반팔 셔츠')
    {
      id: "mesh-shirt", cat: "Tops",
      name: "델토이드 메쉬 반팔 셔츠",
      subtitle: "Deltoid Mesh Short-Sleeve Shirt · Ivory",
      price: 29900, compareAt: 49000, badge: "New",
      buy: "https://m.smartstore.naver.com/athleticstore/products/13697953747",
      image: "assets/mesh-model.jpg",
      frontImage: "assets/mesh-front.jpg",
      gallery: ["assets/mesh-model.jpg", "assets/mesh-closeup.jpg", "assets/mesh-back.jpg", "assets/mesh-front.jpg"],
      swatches: [SW.ivory],
      detail: "generic",
      // 사이즈: 중국 원표를 한 단계씩 내려 라벨링 (중국 L→M, XL→L, 2XL→XL).
      // 실측 숫자는 원표 그대로. 근거와 검수사항은 docs/사이즈표-델토이드-메쉬-반팔-셔츠.md
      spec: [["브랜드", "SIK"], ["제품명", "델토이드 메쉬 반팔 셔츠"], ["컬러", "아이보리"], ["소재", "폴리 메쉬 혼방"],
        ["사이즈", "M / L / XL · 어깨 52~56 · 가슴단면 52~56 · 총장 69~71 · 소매 24~26 (cm)"],
        ["사이즈 M", "어깨 52 · 가슴단면 52 · 총장 69 · 소매 24"],
        ["사이즈 L", "어깨 54 · 가슴단면 54 · 총장 70 · 소매 25"],
        ["사이즈 XL", "어깨 56 · 가슴단면 56 · 총장 71 · 소매 26"],
        ["제조국", "중국"]],
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
      soldOut: true,   // 2026-07-29 입고 전. 재고 도착하면 이 줄만 지우면 된다.
      spec: [["브랜드", "SIK"], ["제품명", "세미크롭 반팔 티셔츠"], ["컬러", "블랙 / 라이트 그레이"], ["소재", "코튼 혼방"], ["핏", "세미크롭 · 머슬핏"], ["사이즈", "준비 중 (곧 업데이트)"], ["제조국", "중국"]],
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
      soldOut: true,   // 낱개 티셔츠가 아직 안 와서 2팩도 못 보낸다. 입고되면 이 줄만 지운다.
      spec: [["브랜드", "SIK"], ["구성", "세미크롭 반팔 티셔츠 블랙 1 + 라이트 그레이 1"], ["소재", "코튼 혼방"], ["핏", "세미크롭 · 머슬핏"], ["사이즈", "준비 중 (곧 업데이트)"], ["제조국", "중국"]],
      blurb: "블랙과 라이트 그레이 두 컬러를 함께 구성한 2팩. 낱개로 사는 것보다 합리적입니다.",
    },

    // 6) 웨이스트 웨스턴 벨트 (구 '웨스턴 벨트')
    {
      id: "western-belt", cat: "Accessories",
      name: "웨이스트 웨스턴 벨트",
      subtitle: "Western Belt · Silver",
      price: 24900, compareAt: 34900, badge: "New",
      buy: "https://m.smartstore.naver.com/athleticstore/products/13683518247",
      // 대표컷은 belt-2(엇갈려 놓은 전체 컷). belt-1 은 버클 클로즈업이라
      // 3:4 타일에서 잘리면 뭔지 알아볼 수 없어서 뒤로 뺐다.
      image: "assets/belt-2.jpg",
      frontImage: "assets/belt-3.jpg",
      gallery: ["assets/belt-2.jpg", "assets/belt-3.jpg", "assets/belt-1.jpg"],
      swatches: [SW.black],
      detail: "generic",
      spec: [["브랜드", "SIK"], ["제품명", "웨이스트 웨스턴 벨트"], ["컬러", "블랙 (실버 버클)"], ["소재", "인조가죽 · 메탈 버클"], ["사이즈", "총길이 105cm · 폭 2cm · 버클 4.5 x 3.5cm"], ["제조국", "중국"]],
      blurb: "실버 버클과 포인트 팁이 돋보이는 웨스턴 무드 벨트. 데님과 슬랙스 모두에 잘 어울립니다.",
    },
  ];

  window.SIK_DATA = { products: products, SW: SW };
  window.SIK_PRODUCT_IMG = products[1].image;   // 홈 시그니처 = 블랙 포인트 목걸이
  window.SIK_CATEGORIES = ["Tops", "Necklaces", "Accessories"];

  // ── 상단 내비게이션 ────────────────────────────────────────
  // 화면에 보이는 라벨과 실제 product.cat 이 1:1 이 아니다.
  //  · BOTTOM  — 아직 취급 제품 없음 (빈 목록 → 컬렉션에서 "준비 중" 안내)
  //  · BELT    — Accessories 안의 단일 제품이지만 따로 노출
  //  · 목걸이  — ACCESSORIES 로 묶어서 보여준다
  window.SIK_NAV = [
    { key: "All", label: "ALL" },
    { key: "Tops", label: "TOP" },
    { key: "Bottoms", label: "BOTTOM" },
    { key: "Accessories", label: "ACCESSORIES" },
    { key: "Belt", label: "BELT" },
  ];

  window.SIK_NAV_LABEL = function (key) {
    var hit = window.SIK_NAV.filter(function (n) { return n.key === key; })[0];
    return hit ? hit.label : String(key || "").toUpperCase();
  };

  window.SIK_FILTER = function (key) {
    var P = window.SIK_DATA.products;
    if (!key || key === "All") return P;
    if (key === "Bottoms") return [];
    if (key === "Belt") return P.filter(function (p) { return p.id === "western-belt"; });
    if (key === "Accessories") {
      return P.filter(function (p) { return p.cat === "Accessories" || p.cat === "Necklaces"; });
    }
    return P.filter(function (p) { return p.cat === key; });
  };

  // ── 사업자 정보 ────────────────────────────────────────────
  // 전자상거래법 제10조. 소비자가 볼 수 있는 곳에 표시할 의무가 있다.
  // 빈 값은 아직 못 받은 항목 — 채워지기 전까진 화면에 줄 자체를 안 그린다.
  window.SIK_BIZ = {
    company: "피식푸드",                          // 사업자등록증상 상호 (브랜드명 SIK 와 다르다)
    owner: "",                                   // TODO 대표자 성명
    bizNo: "888-64-00737",
    // 간이과세자는 통신판매업 신고 의무가 면제된다 (전자상거래법 시행령 제6조 제2호).
    // 매출이 늘어 일반과세자로 전환되면 신고하고 번호를 mailOrderNo 에 적어야 한다.
    mailOrderNo: "",
    mailOrderExempt: "간이과세자 (전자상거래법 시행령 제6조에 따른 신고 면제)",
    address: "(03625) 서울특별시 서대문구 세무서길 78, 302호",
    tel: "010-3084-8082",
    host: "GitHub, Inc.",
  };

  window.SIK_TAGLINE = "fashion & fitness";
  window.SIK_HANDLE = "@fashionpsick";
  window.SIK_HANDLE_SUB = "fitness and fashion";

  // Real logo assets (transparent PNG, derived from the brand mark).
  // 2026-07: 워드마크를 새 로고(sik + 덤벨 마크)로 교체.
  window.SIK_LOGO = {
    light: "assets/logo-sik-ink.png",     // 밝은 배경 위
    dark: "assets/logo-sik-bone.png",     // 어두운 배경 위 (인트로 커튼 등)
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
