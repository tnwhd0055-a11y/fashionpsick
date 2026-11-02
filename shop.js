/* SIK 자체 주문 — 장바구니 · 주문 API · 관리자 로그인 (plain script, window.SIK_SHOP)
   서버(Supabase) 쪽 설계: supabase/001_shop.sql · 패피식 1억 쇼핑몰/docs/자체몰-주문결제-설계.md
   가격·배송비·재고는 서버가 최종 결정한다. 여기 계산은 화면 표시용일 뿐이다. */
(function () {
  var C = window.SIK_SHOP_CONFIG || {};
  var CART = "sik:cart", CHECKOUT = "sik:checkout", LAST = "sik:last-order", ADMIN = "sik:admin-session", MEMBER = "sik:member";

  // 테스트 기간에는 정식 주소(sikseoul.com)·Cloudflare 테스트 주소·로컬에서만 자체 주문을 켠다.
  // sikseoul.com 은 PG 심사(2026-11) 때문에 켰다 — 심사자가 장바구니·결제 화면을 확인해야 한다.
  // 예전 GitHub Pages 주소 손님은 계속 네이버 구매만 본다.
  var ON = /(^|\.)sikseoul\.com$|\.workers\.dev$|^localhost$|^127\.0\.0\.1$/.test(location.hostname) && !!C.supabaseKey;

  // 배송비 규칙 (표시용) — 아래 loadLive() 가 DB 설정으로 덮어쓴다. 실제 청구는 DB 가 계산한다.
  var SHIP = { fee: 3000, freeOver: 30000, jeju: 2000, remote: 3000, remoteZips: "40200-40240" };

  var read = function (k, store) { try { return JSON.parse((store || localStorage).getItem(k)) || null; } catch (e) { return null; } };
  var write = function (k, v, store) { try { (store || localStorage).setItem(k, JSON.stringify(v)); } catch (e) {} };

  // ── 상품 ──
  function product(id) { return window.SIK_DATA.products.filter(function (p) { return p.id === id; })[0]; }
  // 상품의 선택지: 사이즈가 있으면 사이즈, 색상 갤러리가 있으면 색 이름, 없으면 '' 하나
  function options(p) {
    if (p.sizes) return p.sizes;
    if (p.colors) return p.colors.map(function (c) { return c.label; });
    return [""];
  }
  function line(it) {
    var p = product(it.id);
    if (!p) return null;
    return { id: it.id, option: it.option || "", qty: it.qty, name: p.name, price: p.price, image: p.frontImage || p.image };
  }

  // ── 장바구니 ──
  function cart() { return (read(CART) || []).filter(function (it) { return product(it.id); }); }
  function saveCart(items) { write(CART, items); window.dispatchEvent(new Event("sik-cart")); }
  function addToCart(id, option, qty) {
    var items = cart(), hit = items.filter(function (it) { return it.id === id && (it.option || "") === (option || ""); })[0];
    if (hit) hit.qty = Math.min(10, hit.qty + (qty || 1));
    else items.push({ id: id, option: option || "", qty: qty || 1 });
    saveCart(items);
  }
  function setQty(id, option, qty) {
    saveCart(cart().map(function (it) { return it.id === id && it.option === option ? Object.assign({}, it, { qty: qty }) : it; })
      .filter(function (it) { return it.qty > 0; }));
  }
  function cartCount() { return cart().reduce(function (n, it) { return n + it.qty; }, 0); }

  // 주문서에 올릴 품목. 바로구매면 그 상품만, 아니면 장바구니 전체 (탭 세션에 저장 — 새로고침해도 유지)
  function startCheckout(items, fromCart) { write(CHECKOUT, { items: items, fromCart: !!fromCart }, sessionStorage); }
  function checkoutItems() { return read(CHECKOUT, sessionStorage) || { items: cart(), fromCart: true }; }

  function isRemote(zip) {
    if (!/^\d{5}$/.test(zip || "")) return false;
    var z = +zip;
    return String(SHIP.remoteZips || "").split(",").some(function (r) {
      var m = r.trim().match(/^(\d{5})(?:\s*-\s*(\d{5}))?$/);
      return m && z >= +m[1] && z <= +(m[2] || m[1]);
    });
  }
  function shippingFee(sum, zip) {
    return (sum >= SHIP.freeOver ? 0 : SHIP.fee) + (/^63/.test(zip || "") ? SHIP.jeju : isRemote(zip) ? SHIP.remote : 0);
  }

  // ── Supabase 호출 ──
  function headers(token) {
    var h = { apikey: C.supabaseKey, "Content-Type": "application/json" };
    if (token) h.Authorization = "Bearer " + token;
    return h;
  }
  function call(path, opt) {
    return fetch(C.supabaseUrl + path, opt).then(function (r) {
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) { var err = new Error((j && (j.message || j.error_description || j.msg)) || ("HTTP " + r.status)); err.status = r.status; throw err; }
        return j;
      });
    });
  }
  function rpc(fn, body, token) { return call("/rest/v1/rpc/" + fn, { method: "POST", headers: headers(token), body: JSON.stringify(body) }); }

  // 재고 — { "mesh-shirt|L": 4, ... }
  function stock() {
    return call("/rest/v1/products?select=id,option,stock,active", { headers: headers() }).then(function (rows) {
      var m = {}; rows.forEach(function (r) { m[r.id + "|" + r.option] = r.active ? r.stock : 0; }); return m;
    });
  }

  // ── 카카오 로그인 회원 (Supabase Auth) ──
  // 로그인 버튼 → 카카오 → Supabase → 이 사이트로 돌아오며 주소 #access_token=… 에 세션이 실려 온다.
  // 세션은 이 브라우저에만 저장한다 (localStorage). 비밀번호는 우리가 다루지 않는다.
  function member() { return read(MEMBER); }
  function saveMember(m) { write(MEMBER, m); window.dispatchEvent(new Event("sik-member")); }
  function kakaoLogin(backTo) {
    try { sessionStorage.setItem("sik:login-back", backTo || "home"); } catch (e) {}
    location.href = C.supabaseUrl + "/auth/v1/authorize?provider=kakao&redirect_to=" + encodeURIComponent(location.origin + location.pathname);
  }
  function logout() { try { localStorage.removeItem(MEMBER); } catch (e) {} window.dispatchEvent(new Event("sik-member")); }
  // 카카오에서 돌아왔으면 세션을 꺼내 저장하고, 로그인 전에 보던 화면 이름을 돌려준다
  function takeLoginReturn() {
    if (!/access_token=/.test(location.hash)) return null;
    var q = new URLSearchParams(location.hash.slice(1));
    history.replaceState(history.state, "", location.pathname + location.search);
    var m = { token: q.get("access_token"), refresh: q.get("refresh_token"), kakaoToken: q.get("provider_token"),
              until: Date.now() + (Number(q.get("expires_in") || 3600) - 60) * 1000 };
    saveMember(m);
    call("/auth/v1/user", { headers: headers(m.token) }).then(function (u) {
      var md = (u && u.user_metadata) || {};
      saveMember(Object.assign({}, member(), { id: u.id, nickname: md.name || md.full_name || md.nickname || "", email: u.email || "" }));
    }).catch(function () {});
    var back = "home"; try { back = sessionStorage.getItem("sik:login-back") || "home"; } catch (e) {}
    return back;
  }
  function memberToken() {
    var m = member();
    if (!m) return Promise.resolve(null);
    if (Date.now() < m.until) return Promise.resolve(m.token);
    return call("/auth/v1/token?grant_type=refresh_token", { method: "POST", headers: headers(), body: JSON.stringify({ refresh_token: m.refresh }) })
      .then(function (n) { saveMember(Object.assign({}, m, { token: n.access_token, refresh: n.refresh_token, until: Date.now() + (n.expires_in - 60) * 1000 })); return n.access_token; })
      .catch(function () { logout(); return null; });
  }
  // 카카오에 등록된 이름·전화번호·기본 배송지 (손님이 동의한 것만 온다)
  function kakaoProfile() {
    var m = member();
    if (!m || !m.kakaoToken) return Promise.resolve(null);
    return call("/functions/v1/portone", { method: "POST", headers: headers(), body: JSON.stringify({ action: "kakao-profile", provider_token: m.kakaoToken }) })
      .then(function (r) { return r && r.ok ? r : null; }).catch(function () { return null; });
  }
  function myOrders() { return memberToken().then(function (t) { return t ? rpc("my_orders", {}, t) : []; }); }

  // ── 관리자가 바꾼 가격·재고·배송비를 화면에 반영 ──
  // 가격과 품절 여부는 DB(관리자 화면)가 정본이다. data.js 값은 DB 를 못 읽었을 때만 쓰인다.
  function loadLive() {
    if (!C.supabaseKey) return;
    rpc("shipping_rules", {}).then(function (r) { if (r) Object.assign(SHIP, r); }).catch(function () {});
    call("/rest/v1/products?select=id,option,price,stock,active", { headers: headers() }).then(function (rows) {
      var by = {};
      rows.forEach(function (r) { (by[r.id] = by[r.id] || []).push(r); });
      window.SIK_DATA.products.forEach(function (p) {
        var rs = by[p.id];
        if (!rs) return;
        p.price = rs[0].price;
        p.soldOut = rs.every(function (r) { return !r.active || r.stock <= 0; });
      });
      window.dispatchEvent(new Event("sik-prices"));
    }).catch(function () {});
  }

  // 관리자: 상품 한 줄(옵션) 고치기 / 설정 읽기·고치기
  function adminProducts() {
    return adminToken().then(function (t) { return call("/rest/v1/products?select=*&order=sort", { headers: headers(t) }); });
  }
  function adminSaveProduct(id, option, patch) {
    return adminToken().then(function (t) {
      var h = headers(t); h.Prefer = "return=representation";
      return call("/rest/v1/products?id=eq." + encodeURIComponent(id) + "&option=eq." + encodeURIComponent(option), { method: "PATCH", headers: h, body: JSON.stringify(patch) });
    }).then(function (r) { if (!r || !r.length) throw new Error("저장하지 못했습니다 (권한)"); loadLive(); return r[0]; });
  }
  function adminSettings() {
    return adminToken().then(function (t) { return call("/rest/v1/settings?id=eq.1&select=*", { headers: headers(t) }); }).then(function (r) { return r[0]; });
  }
  function adminSaveSettings(patch) {
    return adminToken().then(function (t) {
      var h = headers(t); h.Prefer = "return=representation";
      return call("/rest/v1/settings?id=eq.1", { method: "PATCH", headers: h, body: JSON.stringify(patch) });
    }).then(function (r) { if (!r || !r.length) throw new Error("저장하지 못했습니다 (권한)"); loadLive(); return r[0]; });
  }

  // ── 상품 문의(Q&A) · 구매 후기 ──
  function qnaList(pid) { return rpc("qna_list", { p_product_id: pid }); }
  function qnaAsk(pid, f) { return rpc("qna_ask", { p_product_id: pid, p_author: f.author, p_password: f.password, p_question: f.question, p_private: !!f.isPrivate }); }
  function qnaView(id, pw) { return rpc("qna_view", { p_id: id, p_password: pw }); }
  function reviewList(pid) { return rpc("review_list", { p_product_id: pid }); }
  function reviewTargets(orderNo, phone) { return memberToken().then(function (t) { return rpc("review_targets", { p_order_no: orderNo, p_phone: phone }, t); }); }
  // 후기 사진: 브라우저에서 긴 변 1200px WebP 로 줄여서 올린다 (원본 그대로 올리면 느리고 저장소가 금방 찬다)
  function uploadReviewPhoto(file) {
    return new Promise(function (ok, fail) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var k = Math.min(1, 1200 / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? ok(b) : fail(new Error("사진을 읽지 못했습니다.")); }, "image/webp", 0.85);
      };
      img.onerror = function () { fail(new Error("사진을 읽지 못했습니다.")); };
      img.src = url;
    }).then(function (blob) {
      var path = "reviews/" + Date.now() + "-" + Math.random().toString(36).slice(2, 10) + ".webp";
      return fetch(C.supabaseUrl + "/storage/v1/object/review-photos/" + path, { method: "POST", headers: { apikey: C.supabaseKey, "Content-Type": "image/webp" }, body: blob })
        .then(function (r) { if (!r.ok) throw new Error("사진을 올리지 못했습니다."); return C.supabaseUrl + "/storage/v1/object/public/review-photos/" + path; });
    });
  }
  function reviewCreate(f) {
    return memberToken().then(function (t) {
      return rpc("review_create", { p_order_no: f.orderNo, p_phone: f.phone, p_product_id: f.productId, p_option: f.option || "",
        p_author: f.author, p_rating: f.rating, p_body: f.body, p_photos: f.photos || [] }, t);
    });
  }
  // 관리자: 문의·후기 목록, 답변·숨기기, 카톡 알림
  function adminQna() { return adminToken().then(function (t) { return call("/rest/v1/qna?select=id,product_id,author,is_private,question,answer,hidden,created_at&order=created_at.desc&limit=200", { headers: headers(t) }); }); }
  function adminQnaSave(id, answer, hidden) { return adminToken().then(function (t) { return rpc("qna_admin", { p_id: id, p_answer: answer, p_hidden: hidden }, t); }); }
  function adminReviews() { return adminToken().then(function (t) { return call("/rest/v1/reviews?select=id,product_id,option,author,rating,body,photos,hidden,created_at&order=created_at.desc&limit=200", { headers: headers(t) }); }); }
  function adminReviewHide(id, hidden) { return adminToken().then(function (t) { return rpc("review_admin", { p_id: id, p_hidden: hidden }, t); }); }
  function notifyStatus() { return adminToken().then(function (t) { return rpc("notify_status", {}, t); }); }
  function notifyAction(action, extra) {
    return adminToken().then(function (t) { return call("/functions/v1/notify", { method: "POST", headers: headers(t), body: JSON.stringify(Object.assign({ action: action }, extra || {})) }); });
  }

  function createOrder(items, buyer, payMethod) {
    return memberToken().then(function (t) { return rpc("create_order", {
      p_items: items.map(function (it) { return { id: it.id, option: it.option || "", qty: it.qty }; }),
      p_buyer: buyer, p_pay_method: payMethod,
    }, t); }).then(function (o) { write(LAST, o, sessionStorage); return o; });   // 로그인했으면 주문이 계정에 붙는다
  }
  function lastOrder() { return read(LAST, sessionStorage); }
  function lookup(orderNo, phone) { return rpc("lookup_order", { p_order_no: orderNo, p_phone: phone }); }

  // 서버 오류 'SIK:코드:내용' → 손님이 읽을 문장
  function errorText(e) {
    var m = String((e && e.message) || ""), parts = m.split(":");
    if (parts[0] !== "SIK") return "주문을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
    var code = parts[1], what = parts.slice(2).join(":");
    var buyer = { name: "받는 분 이름을 확인해 주세요.", phone: "휴대폰 번호를 확인해 주세요. (예: 010-1234-5678)", zipcode: "주소 검색으로 우편번호를 넣어 주세요.",
      address1: "주소를 입력해 주세요.", depositor: "입금자명을 입력해 주세요.", long: "상세주소나 요청사항이 너무 깁니다." };
    return ({
      SOLD_OUT: what + " 재고가 부족합니다. 수량을 줄이거나 다른 옵션을 골라 주세요.",
      NO_PRODUCT: "판매하지 않는 상품이 들어 있습니다. 장바구니를 확인해 주세요.",
      PRIVACY: "개인정보 수집·이용에 동의해 주세요.",
      EMPTY_CART: "주문할 상품이 없습니다.",
      QTY: "수량은 1~10개까지 주문할 수 있습니다.",
      BUYER: buyer[what] || "주문자 정보를 확인해 주세요.",
      FORBIDDEN: "관리자 로그인이 필요합니다.",
      BAD_STATUS: "지금 상태에서는 할 수 없는 처리입니다.",
      TRACKING: "택배사와 송장번호를 입력해 주세요.",
      NEEDS_REFUND: "카드·간편결제 주문은 결제 취소(환불)를 먼저 해야 합니다.",
      QNA: ({ author: "이름을 적어 주세요.", password: "비밀번호는 4자리 이상으로 정해 주세요.", question: "문의 내용을 적어 주세요.", slow: "잠시 후 다시 등록해 주세요." })[what] || "문의를 등록하지 못했습니다.",
      REVIEW: ({ rating: "별점을 골라 주세요.", body: "후기를 5자 이상 적어 주세요.", photos: "사진은 4장까지 올릴 수 있습니다.", dup: "이 상품은 이미 후기를 쓰셨습니다." })[what] || "후기를 등록하지 못했습니다.",
      NO_ORDER: "주문을 찾지 못했습니다. 주문번호와 휴대폰 번호를 확인해 주세요.",
      NOT_SHIPPED: "상품이 발송된 뒤에 후기를 쓸 수 있습니다.",
    })[code] || "처리하지 못했습니다. (" + code + ")";
  }

  // ── 관리자 로그인 (Supabase Auth) — 탭을 닫으면 로그아웃 ──
  function adminSession() { return read(ADMIN, sessionStorage); }
  function saveSession(s) { write(ADMIN, { token: s.access_token, refresh: s.refresh_token, email: s.user && s.user.email, until: Date.now() + (s.expires_in - 60) * 1000 }, sessionStorage); }
  function adminLogin(email, password) {
    return call("/auth/v1/token?grant_type=password", { method: "POST", headers: headers(), body: JSON.stringify({ email: email, password: password }) })
      .then(saveSession);
  }
  function adminLogout() { try { sessionStorage.removeItem(ADMIN); } catch (e) {} }
  function adminToken() {
    var s = adminSession();
    if (!s) return Promise.reject(Object.assign(new Error("SIK:FORBIDDEN:"), { status: 401 }));
    if (Date.now() < s.until) return Promise.resolve(s.token);
    return call("/auth/v1/token?grant_type=refresh_token", { method: "POST", headers: headers(), body: JSON.stringify({ refresh_token: s.refresh }) })
      .then(function (n) { saveSession(n); return n.access_token; });
  }
  function adminOrders() {
    return adminToken().then(function (t) {
      return call("/rest/v1/orders?select=*,order_items(*)&order=created_at.desc&limit=200", { headers: headers(t) });
    });
  }
  function adminUpdate(orderNo, action, extra) {
    extra = extra || {};
    return adminToken().then(function (t) {
      return rpc("admin_update_order", { p_order_no: orderNo, p_action: action, p_courier: extra.courier || "", p_tracking: extra.tracking || "", p_note: extra.note || "" }, t);
    });
  }

  // 결제수단 — 포트원 채널 키가 들어오기 전까지 간편결제는 '준비 중'
  var PAY = [
    { key: "bank", label: "무통장입금", ready: true },
    { key: "kakaopay", label: "카카오페이", ready: !!(C.portoneStoreId && C.portoneChannels && C.portoneChannels.kakaopay) },
    { key: "naverpay", label: "네이버페이", ready: !!(C.portoneStoreId && C.portoneChannels && C.portoneChannels.naverpay) },
    { key: "card", label: "신용·체크카드", ready: !!(C.portoneStoreId && C.portoneChannels && C.portoneChannels.card) },
  ];

  // ── 간편결제·카드 (포트원 V2) ──
  // 결제 id 는 주문번호 그대로 쓴다. 결제가 끝나면 서버 함수(supabase/functions/portone)가 포트원에 금액을 다시 물어 확정한다.
  function loadPortOne() {
    if (window.PortOne) return Promise.resolve(window.PortOne);
    return new Promise(function (ok, fail) {
      var s = document.createElement("script");
      s.src = "https://cdn.portone.io/v2/browser-sdk.js";
      s.onload = function () { ok(window.PortOne); };
      s.onerror = function () { fail(new Error("결제 모듈을 불러오지 못했습니다.")); };
      document.head.appendChild(s);
    });
  }
  function confirmPayment(paymentId, abort) {
    return call("/functions/v1/portone", { method: "POST", headers: headers(), body: JSON.stringify({ paymentId: paymentId, abort: !!abort }) });
  }
  // 결제창을 띄운다. 휴대폰은 결제사 페이지로 넘어갔다가 ?pay=return 으로 돌아온다 (index.html 이 받아서 완료 화면으로)
  function pay(order, items, buyer, method) {
    var first = line(items[0]);
    var orderName = first.name + (items.length > 1 ? " 외 " + (items.length - 1) + "건" : "");
    var req = {
      storeId: C.portoneStoreId,
      channelKey: method === "kakaopay" ? C.portoneChannels.kakaopay : method === "naverpay" ? C.portoneChannels.naverpay : C.portoneChannels.card,
      paymentId: order.order_no,
      orderName: orderName,
      totalAmount: order.amount,
      currency: "CURRENCY_KRW",
      payMethod: method === "card" ? "CARD" : "EASY_PAY",
      customer: { fullName: buyer.name, phoneNumber: buyer.phone.replace(/\D/g, "") },
      redirectUrl: location.origin + location.pathname + "?pay=return",
    };
    return loadPortOne()
      .then(function (P) { return P.requestPayment(req); })
      .then(function (res) {
        if (res && res.code !== undefined) {
          // 손님이 창을 닫았거나 실패 — 주문을 바로 취소해서 재고를 돌려놓는다
          return confirmPayment(order.order_no, true).catch(function () {}).then(function () {
            var e = new Error(res.message || "결제가 취소되었습니다."); e.payCancelled = true; throw e;
          });
        }
        return finishPayment(order.order_no);
      });
  }
  function finishPayment(paymentId) {
    return confirmPayment(paymentId, false).then(function (r) {
      if (!r || !r.ok) throw new Error(r && r.code === "MISMATCH" ? "결제 금액이 주문과 달라 자동 취소했습니다." : "결제를 확인하지 못했습니다. (" + (r && r.code) + ")");
      var o = lastOrder();
      if (o && o.order_no === paymentId) { o.status = "paid"; write(LAST, o, sessionStorage); }
      return o;
    });
  }
  function adminRefund(orderNo) {
    return adminToken().then(function (t) {
      return call("/functions/v1/portone", { method: "POST", headers: headers(t), body: JSON.stringify({ action: "refund", order_no: orderNo }) });
    });
  }

  var STATUS = {
    pending: "결제 대기", awaiting_deposit: "입금 대기", paid: "결제 완료", shipped: "배송중",
    delivered: "배송 완료", cancelled: "주문 취소", refunded: "환불 완료",
  };
  var COURIERS = ["CJ대한통운", "우체국택배", "한진택배", "롯데택배", "로젠택배", "CU 편의점택배", "GS Postbox 택배"];
  // 택배사별 조회 주소를 따로 관리하지 않고 네이버 배송조회 검색으로 보낸다 (택배사 사이트 주소가 자주 바뀐다)
  function trackUrl(courier, no) { return "https://search.naver.com/search.naver?query=" + encodeURIComponent(courier + " " + no); }

  var won = function (n) { return Number(n || 0).toLocaleString("ko-KR") + "원"; };

  window.SIK_SHOP = {
    on: ON, config: C, SHIP: SHIP, PAY: PAY, STATUS: STATUS, COURIERS: COURIERS,
    product: product, options: options, line: line,
    cart: cart, addToCart: addToCart, setQty: setQty, cartCount: cartCount, saveCart: saveCart,
    startCheckout: startCheckout, checkoutItems: checkoutItems, shippingFee: shippingFee,
    stock: stock, createOrder: createOrder, lastOrder: lastOrder, lookup: lookup, errorText: errorText,
    adminSession: adminSession, adminLogin: adminLogin, adminLogout: adminLogout, adminOrders: adminOrders, adminUpdate: adminUpdate,
    pay: pay, finishPayment: finishPayment, adminRefund: adminRefund,
    qnaList: qnaList, qnaAsk: qnaAsk, qnaView: qnaView, reviewList: reviewList, reviewTargets: reviewTargets, reviewCreate: reviewCreate, uploadReviewPhoto: uploadReviewPhoto,
    adminQna: adminQna, adminQnaSave: adminQnaSave, adminReviews: adminReviews, adminReviewHide: adminReviewHide, notifyStatus: notifyStatus, notifyAction: notifyAction,
    loadLive: loadLive, adminProducts: adminProducts, adminSaveProduct: adminSaveProduct, adminSettings: adminSettings, adminSaveSettings: adminSaveSettings,
    member: member, kakaoLogin: kakaoLogin, logout: logout, takeLoginReturn: takeLoginReturn, kakaoProfile: kakaoProfile, myOrders: myOrders,
    trackUrl: trackUrl, won: won,
  };
  loadLive();
})();
