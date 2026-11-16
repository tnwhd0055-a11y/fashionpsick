/* SIK 앱 뼈대 — 화면 전환·주소·인트로.
   예전엔 index.html 안에 있었다. tools/build.mjs 가 다른 .jsx 와 함께 app.js 로 미리 컴파일한다. */
  /* 화면 전환을 브라우저 히스토리에 남긴다.
     예전엔 screen 을 useState 로만 들고 있어서 뒤로가기가 사이트를 떠났다.
     (스마트스토어에 다녀온 뒤라면 문서가 새로 떠서 인트로 커튼까지 재생됐다.)
     이제는 화면마다 엔트리를 하나씩 쌓고, 떠나기 직전 스크롤 위치를 그 엔트리에
     새겨뒀다가 popstate 에서 되돌린다. 인트로는 탭 세션당 한 번만 뜬다. */

  const HOME_VIEW = { screen: "home", productId: null, category: null };
  const INTRO_SEEN = "sik:intro-seen";

  const readView = () => {
    const s = window.history.state && window.history.state.sik;
    return s ? { screen: s.screen, productId: s.productId, category: s.category } : null;
  };
  // 정적 페이지(/products/<id>/ 등)로 바로 들어왔으면 그 화면부터
  const PATH_VIEW = window.SIK_VIEW_FROM_PATH ? window.SIK_VIEW_FROM_PATH(window.location.pathname) : null;
  const urlOf = (v) => (window.SIK_URL ? window.SIK_URL(v) : "/");
  const entry = (v, scroll) => ({ sik: { screen: v.screen, productId: v.productId, category: v.category, scroll } });

  function App() {
    // 새로고침·복귀 시에도 보던 화면 그대로 (history.state 는 문서가 다시 떠도 남는다)
    // 주소 끝 #admin · #terms · #privacy 로 그 화면을 바로 연다 (인트로 없이)
    const hashScreen = { "#admin": "admin", "#terms": "terms", "#privacy": "privacy", "#mypage": "mypage", "#lookup": "lookup" }[window.location.hash];
    const ADMIN_VIEW = { screen: hashScreen || "admin", productId: null, category: null };
    const wantsAdmin = !!hashScreen;
    // 휴대폰 결제를 마치고 결제사 페이지에서 돌아오면 ?pay=return — 완료 화면이 결제를 확인한다
    const payReturn = /[?&]pay=return/.test(window.location.search);
    // 카카오 로그인에서 돌아오면 주소 #access_token=… — 세션을 저장하고 로그인 전에 보던 화면으로
    const [loginBack] = React.useState(() => (window.SIK_SHOP && window.SIK_SHOP.takeLoginReturn ? window.SIK_SHOP.takeLoginReturn() : null));
    const DONE_VIEW = { screen: "done", productId: null, category: null };
    const [view, setView] = React.useState(() => (wantsAdmin ? ADMIN_VIEW : payReturn ? DONE_VIEW
      : loginBack && loginBack !== "home" ? { screen: loginBack, productId: null, category: null } : readView() || PATH_VIEW || HOME_VIEW));
    // 첫 진입 인트로 커튼. ?nointro=1 이면 건너뛴다 (스크린샷·디자인 확인용).
    const [intro, setIntro] = React.useState(() => {
      if (/[?&]nointro=1/.test(window.location.search) || PATH_VIEW || wantsAdmin || payReturn || loginBack) return false;
      try { return !sessionStorage.getItem(INTRO_SEEN); } catch (e) { return true; }
    });

    // popstate 핸들러는 한 번만 등록하므로, 최신 화면은 ref 로 읽는다
    const viewRef = React.useRef(view);
    viewRef.current = view;

    React.useEffect(() => {
      // 브라우저 자동 복원은 SPA 렌더 타이밍과 어긋난다. 직접 복원한다.
      if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
      // 첫 엔트리에도 도장을 찍어둔다 — 뒤로가기로 여기 돌아올 수 있어야 한다
      if (!readView()) window.history.replaceState(entry(wantsAdmin ? ADMIN_VIEW : payReturn ? DONE_VIEW : PATH_VIEW || HOME_VIEW, 0), "");
    }, []);

    // 되돌릴 스크롤 위치. popstate 에서 바로 스크롤하면 안 된다 —
    // 그 시점엔 React 가 아직 이전 화면(긴 제품 페이지)을 그리고 있어서
    // 스크롤이 한 번에 성공해버리고, 곧이어 홈으로 리렌더되며 문서가 잠깐
    // 짧아지는 사이에 위치가 날아간다. 화면이 갈린 뒤에 복원한다.
    const pendingScroll = React.useRef(null);

    React.useLayoutEffect(() => {
      const y = pendingScroll.current;
      if (y == null) return;
      pendingScroll.current = null;

      let frames = 0, held = 0, done = false;
      const stop = () => {
        done = true;
        window.removeEventListener("wheel", stop);
        window.removeEventListener("touchstart", stop);
        window.removeEventListener("keydown", stop);
      };
      // 사용자가 먼저 스크롤하면 즉시 손을 뗀다
      window.addEventListener("wheel", stop, { passive: true });
      window.addEventListener("touchstart", stop, { passive: true });
      window.addEventListener("keydown", stop);

      const step = () => {
        if (done) return;
        if (Math.abs(window.scrollY - y) > 2) { window.scrollTo(0, y); held = 0; }
        else held++;
        // 이미지가 뜨면서 문서 높이가 계속 변한다. 한 번 맞았다고 끝내지 않고
        // 몇 프레임 연속으로 유지되는지 확인한다.
        if (held < 3 && frames++ < 40) requestAnimationFrame(step);
        else stop();
      };
      step();

      return stop;
    }, [view]);

    React.useEffect(() => {
      const onPop = (e) => {
        const s = e.state && e.state.sik;
        pendingScroll.current = s ? (s.scroll || 0) : 0;
        setView(s ? { screen: s.screen, productId: s.productId, category: s.category } : HOME_VIEW);
        setIntro(false);          // 커튼이 떠 있는 채로 돌아오면 그 안에 갇힌다
      };
      window.addEventListener("popstate", onPop);
      return () => window.removeEventListener("popstate", onPop);
    }, []);

    // 같은 탭에서 주소 끝만 #privacy 등으로 바꿔도 그 화면으로 (문서가 다시 뜨지 않는 경우)
    React.useEffect(() => {
      const onHash = () => {
        const sc = { "#admin": "admin", "#terms": "terms", "#privacy": "privacy", "#mypage": "mypage", "#lookup": "lookup" }[window.location.hash];
        if (sc) { setIntro(false); go({ screen: sc, productId: null, category: null }); }
      };
      window.addEventListener("hashchange", onHash);
      return () => window.removeEventListener("hashchange", onHash);
    }, []);

    // 관리자 화면에서 바꾼 가격·품절이 DB 에서 도착하면 다시 그린다 (shop.js loadLive)
    const [, setTick] = React.useState(0);
    React.useEffect(() => {
      const on = () => setTick((t) => t + 1);
      window.addEventListener("sik-prices", on);
      return () => window.removeEventListener("sik-prices", on);
    }, []);

    const go = (next) => {
      window.history.replaceState(entry(viewRef.current, window.scrollY), "");  // 떠나는 자리 기억
      // 상품·컬렉션·소개는 진짜 주소로 (그 외 화면은 지금 주소 그대로 — 새로고침하면 history.state 로 복원된다)
      const u = urlOf(next);
      const keep = u === "/" && next.screen !== "home";
      window.history.pushState(entry(next, 0), "", keep ? undefined : u);
      setView(next);
      window.scrollTo(0, 0);
    };

    const nav = (link) => {
      if (link === "home" || link === "New") return go(HOME_VIEW);
      if (link === "About") return go({ screen: "about", productId: null, category: null });
      // 자체 주문 화면 (shop.js · screen-shop.jsx)
      if (["cart", "checkout", "done", "lookup", "admin", "privacy", "terms", "mypage"].indexOf(link) >= 0) return go({ screen: link, productId: null, category: null });
      // "All" 또는 카테고리(Tops/Necklaces/Accessories) → 컬렉션 필터
      return go({ screen: "collection", productId: null, category: link });
    };
    const openProduct = (id) => go({ screen: "product", productId: id, category: viewRef.current.category });

    const page =
      view.screen === "collection" ? <window.CollectionPage nav={nav} openProduct={openProduct} category={view.category} /> :
      view.screen === "product"    ? <window.ProductPage nav={nav} openProduct={openProduct} productId={view.productId} /> :
      view.screen === "about"      ? <window.AboutPage nav={nav} /> :
      view.screen === "cart"       ? <window.CartPage nav={nav} /> :
      view.screen === "checkout"   ? <window.CheckoutPage nav={nav} /> :
      view.screen === "done"       ? <window.DonePage nav={nav} /> :
      view.screen === "lookup"     ? <window.LookupPage nav={nav} /> :
      view.screen === "admin"      ? <window.AdminPage nav={nav} /> :
      view.screen === "privacy"    ? <window.PrivacyPage nav={nav} /> :
      view.screen === "mypage"     ? <window.MyPage nav={nav} /> :
      view.screen === "terms"      ? <window.TermsPage nav={nav} /> :
                                     <window.HomePage nav={nav} openProduct={openProduct} />;

    // 탭 제목도 화면에 맞게 (구글은 JS 실행 후 제목도 본다)
    React.useEffect(() => { if (window.SIK_TITLE) document.title = window.SIK_TITLE(view); }, [view]);

    const introDone = () => {
      try { sessionStorage.setItem(INTRO_SEEN, "1"); } catch (e) {}
      setIntro(false);
    };

    return (
      <React.Fragment>
        {page}
        {intro && <window.IntroCurtain onDone={introDone} />}
      </React.Fragment>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
