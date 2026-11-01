/* SIK Storefront — 개인정보처리방침 · 이용약관 (자체 주문을 받으려면 필수)
   사업자 정보는 data.js 의 window.SIK_BIZ 에서 읽는다. 대표자 성명이 비어 있으면 그 줄을 '확인 중'으로 둔다.
   ⚠ 변호사 검토 전 초안이다. 수집 항목·위탁 업체가 바뀌면 여기와 시행일을 같이 고친다. */

const LEGAL_EFFECTIVE = "2026년 11월 1일";

const LEGAL_CSS = `
.lg-wrap{max-width:760px;margin:0 auto;padding:clamp(32px,5vw,64px) var(--sk-pad) clamp(64px,8vw,120px);font-family:var(--font-sans);color:var(--charcoal);font-size:14px;line-height:1.85;word-break:keep-all}
.lg-wrap h1{font-size:22px;font-weight:700;color:var(--ink);margin:0 0 6px}
.lg-wrap .lg-sub{font-size:13px;color:var(--mute);margin:0 0 28px}
.lg-wrap h2{font-size:15px;font-weight:700;color:var(--ink);margin:32px 0 10px;padding-top:20px;border-top:1px solid var(--warm-line)}
.lg-wrap p{margin:0 0 10px}
.lg-wrap ul,.lg-wrap ol{margin:0 0 10px;padding-left:20px}
.lg-wrap li{margin:2px 0}
.lg-wrap table{width:100%;border-collapse:collapse;font-size:13px;margin:6px 0 12px}
.lg-wrap th,.lg-wrap td{border:1px solid var(--warm-line);padding:8px 10px;text-align:left;vertical-align:top}
.lg-wrap th{background:var(--soft-cloud);font-weight:600;color:var(--ink)}
.lg-tbl{overflow-x:auto}
.lg-tabs{display:flex;gap:6px;margin:0 0 24px}
.lg-tabs button{height:36px;padding:0 14px;border:1px solid var(--hairline);background:var(--paper);font:inherit;font-size:13px;cursor:pointer;color:var(--ink)}
.lg-tabs button[aria-pressed="true"]{background:var(--ink);color:var(--on-ink);border-color:var(--ink)}
`;

function LegalShell({ nav, which, children }) {
  const { SikHeader, SikFooter } = window;
  return (
    <div style={{ background: "var(--paper)" }}>
      <style>{LEGAL_CSS}</style>
      <SikHeader nav={nav} active={null} />
      <div className="lg-wrap">
        <div className="lg-tabs" role="group" aria-label="약관 종류">
          <button aria-pressed={which === "terms"} onClick={() => nav("terms")}>이용약관</button>
          <button aria-pressed={which === "privacy"} onClick={() => nav("privacy")}>개인정보처리방침</button>
        </div>
        {children}
      </div>
      <SikFooter nav={nav} />
    </div>
  );
}

function PrivacyPage({ nav }) {
  const B = window.SIK_BIZ;
  const owner = B.owner || "(확인 중)";
  return (
    <LegalShell nav={nav} which="privacy">
      <h1>개인정보처리방침</h1>
      <p className="lg-sub">시행일 {LEGAL_EFFECTIVE}</p>
      <p>{B.company}(이하 "회사", 브랜드 SIK)는 「개인정보 보호법」에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하게 처리하기 위해 다음과 같이 개인정보처리방침을 둡니다.</p>

      <h2>1. 처리하는 개인정보 항목과 목적</h2>
      <p>회사는 회원가입 없이 주문을 받으며, 주문에 꼭 필요한 정보만 수집합니다.</p>
      <div className="lg-tbl"><table>
        <thead><tr><th>구분</th><th>항목</th><th>목적</th></tr></thead>
        <tbody>
          <tr><td>주문·배송 (필수)</td><td>받는 분 이름, 휴대폰 번호, 배송지 주소</td><td>주문 처리, 상품 배송, 주문·배송 안내, 주문 조회 본인 확인</td></tr>
          <tr><td>주문·배송 (선택)</td><td>배송 요청사항</td><td>배송 요청 반영</td></tr>
          <tr><td>무통장입금 시 (필수)</td><td>입금자명</td><td>입금 확인</td></tr>
          <tr><td>카드·간편결제 시</td><td>결제 승인 정보 (카드사명, 결제 일시·금액 등. 카드번호는 회사가 받지 않습니다)</td><td>결제 처리, 취소·환불</td></tr>
          <tr><td>고객 상담 시</td><td>상담 내용, 연락처</td><td>문의 응대, 교환·반품 처리</td></tr>
          <tr><td>자동 수집</td><td>접속 IP, 접속 일시, 브라우저 정보</td><td>보안·부정 이용 방지 (호스팅 업체가 처리)</td></tr>
        </tbody>
      </table></div>

      <h2>2. 보유 기간과 파기</h2>
      <p>개인정보는 목적이 달성되면 지체 없이 파기합니다. 다만 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 아래 기간 동안 보관합니다.</p>
      <ul>
        <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
        <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
        <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
        <li>접속 기록(「통신비밀보호법」): 3개월</li>
      </ul>
      <p>보관 기간이 끝난 정보는 데이터베이스에서 복구할 수 없도록 삭제하고, 종이 문서(송장 등)는 분쇄하여 파기합니다.</p>

      <h2>3. 제3자 제공</h2>
      <p>회사는 이용자의 개인정보를 제1항의 목적 범위를 넘어 제3자에게 제공하지 않습니다. 법령에 특별한 규정이 있는 경우는 예외로 합니다.</p>

      <h2>4. 처리 위탁</h2>
      <p>회사는 원활한 주문 처리를 위해 다음 업체에 개인정보 처리를 맡기고 있습니다.</p>
      <div className="lg-tbl"><table>
        <thead><tr><th>수탁 업체</th><th>맡기는 업무</th></tr></thead>
        <tbody>
          <tr><td>택배사 (CJ대한통운, 우체국택배 등 발송 시 이용하는 업체)</td><td>상품 배송</td></tr>
          <tr><td>Supabase, Inc. (데이터 보관 위치: 대한민국 서울)</td><td>주문 정보 저장·관리</td></tr>
          <tr><td>코리아포트원(주)</td><td>결제 연동</td></tr>
          <tr><td>(주)카카오페이, 토스페이먼츠(주)</td><td>결제 처리</td></tr>
          <tr><td>Cloudflare, Inc.</td><td>웹사이트 호스팅, 보안</td></tr>
        </tbody>
      </table></div>

      <h2>5. 이용자의 권리</h2>
      <p>이용자는 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리 정지를 요구할 수 있습니다. 아래 연락처로 요청하시면 지체 없이 처리합니다. 다만 법령에 따라 보관해야 하는 정보는 그 기간 동안 삭제할 수 없습니다.</p>

      <h2>6. 안전성 확보 조치</h2>
      <ul>
        <li>주문 정보는 접근 권한을 관리자 계정으로 제한하고, 외부에서 직접 열람할 수 없도록 잠금 처리합니다.</li>
        <li>모든 통신은 암호화(HTTPS)됩니다.</li>
        <li>카드번호 등 결제 정보는 회사가 저장하지 않고 결제대행사가 처리합니다.</li>
      </ul>

      <h2>7. 쿠키 등 자동 수집 장치</h2>
      <p>회사는 광고·추적용 쿠키를 사용하지 않습니다. 장바구니 내용은 이용자의 브라우저에만 저장되며, 브라우저 설정에서 언제든 지울 수 있습니다.</p>

      <h2>8. 개인정보 보호책임자</h2>
      <ul>
        <li>성명: {owner} (대표)</li>
        <li>연락처: {B.tel}</li>
        <li>주소: {B.address}</li>
      </ul>

      <h2>9. 권익 침해 구제</h2>
      <p>개인정보 침해에 대한 상담·신고는 아래 기관에 할 수 있습니다.</p>
      <ul>
        <li>개인정보분쟁조정위원회 1833-6972 (kopico.go.kr)</li>
        <li>개인정보침해신고센터 118 (privacy.kisa.or.kr)</li>
        <li>대검찰청 1301 · 경찰청 182</li>
      </ul>

      <h2>10. 변경</h2>
      <p>이 방침이 바뀌면 시행 7일 전부터 사이트에 알립니다.</p>
    </LegalShell>
  );
}

function TermsPage({ nav }) {
  const B = window.SIK_BIZ;
  const S = window.SIK_SHOP;
  const won = (n) => Number(n).toLocaleString("ko-KR") + "원";
  const ship = S ? S.SHIP : { fee: 3000, freeOver: 30000, jeju: 2000 };
  return (
    <LegalShell nav={nav} which="terms">
      <h1>이용약관</h1>
      <p className="lg-sub">시행일 {LEGAL_EFFECTIVE}</p>

      <h2>제1조 (목적)</h2>
      <p>이 약관은 {B.company}(이하 "회사")가 운영하는 SIK 온라인 스토어(이하 "몰")에서 제공하는 상품 판매 서비스를 이용할 때 회사와 이용자의 권리·의무 및 책임 사항을 정합니다.</p>

      <h2>제2조 (사업자 정보)</h2>
      <p>상호 {B.company} · 사업자등록번호 {B.bizNo}{B.owner ? ` · 대표 ${B.owner}` : ""}<br />
        주소 {B.address} · 고객센터 {B.tel}<br />
        통신판매업신고 {B.mailOrderNo || B.mailOrderExempt}</p>

      <h2>제3조 (약관의 게시와 변경)</h2>
      <p>회사는 이 약관을 몰 화면에 게시합니다. 약관을 바꿀 때는 시행 7일 전부터(이용자에게 불리한 변경은 30일 전부터) 공지하며, 바뀐 약관은 그 이후 주문부터 적용합니다.</p>

      <h2>제4조 (구매 신청)</h2>
      <p>이용자는 회원가입 없이 다음 순서로 구매를 신청합니다.</p>
      <ol>
        <li>상품과 옵션(사이즈·색상), 수량 선택</li>
        <li>받는 분 이름, 휴대폰 번호, 배송지 입력</li>
        <li>결제 수단 선택 (무통장입금, 카카오페이, 신용·체크카드 등)</li>
        <li>개인정보 수집·이용 동의와 주문 내용 확인 후 주문</li>
      </ol>

      <h2>제5조 (계약의 성립)</h2>
      <p>회사가 주문을 접수하면 계약이 성립합니다. 다만 다음의 경우 주문을 승낙하지 않거나 취소할 수 있으며, 이미 결제한 금액은 즉시 환불합니다.</p>
      <ul>
        <li>입력 내용에 허위·누락·오기가 있는 경우</li>
        <li>재고 부족 등으로 상품을 공급할 수 없는 경우</li>
        <li>무통장입금 주문이 입금 기한(주문 후 3일) 안에 입금되지 않은 경우</li>
      </ul>

      <h2>제6조 (결제)</h2>
      <p>결제는 무통장입금, 카카오페이, 신용·체크카드 등 몰이 제공하는 방법으로 합니다. 카드번호 등 결제 정보는 결제대행사가 처리하며 회사는 저장하지 않습니다.</p>

      <h2>제7조 (배송)</h2>
      <ul>
        <li>결제(입금) 확인 후 영업일 기준 2–3일 안에 출고합니다. 예약·입고 대기 상품은 상품 화면에 따로 안내합니다.</li>
        <li>배송비는 {won(ship.fee)}이며, {won(ship.freeOver)} 이상 구매 시 무료입니다. 제주 지역은 {won(ship.jeju)}이 추가됩니다.</li>
        <li>출고 후 송장번호는 주문 조회 화면에서 확인할 수 있습니다.</li>
      </ul>

      <h2>제8조 (청약철회 · 교환 · 반품)</h2>
      <ul>
        <li><b>단순 변심:</b> 상품을 받은 날부터 7일 이내 청약철회(반품)할 수 있습니다. 반품 배송비는 왕복 기준으로 이용자가 부담합니다(무료배송 주문은 최초 배송비 포함).</li>
        <li><b>상품 불량·오배송:</b> 상품을 받은 날부터 3개월 이내, 그 사실을 안 날부터 30일 이내 교환·반품할 수 있으며, 배송비는 회사가 부담합니다.</li>
        <li>다음의 경우에는 청약철회가 제한될 수 있습니다: 이용자의 책임으로 상품이 멸실·훼손된 경우(내용 확인을 위한 포장 훼손은 제외), 사용 또는 일부 소비로 가치가 현저히 줄어든 경우, 시간이 지나 재판매가 곤란할 정도로 가치가 줄어든 경우.</li>
        <li>신청은 고객센터({B.tel}) 또는 인스타그램 {window.SIK_HANDLE} 메시지로 받습니다.</li>
      </ul>

      <h2>제9조 (환급)</h2>
      <p>반품 상품을 돌려받은 날부터 3영업일 안에 결제 금액을 환급합니다. 카드·간편결제는 결제 취소로, 무통장입금은 이용자가 알려준 계좌로 환급합니다. 환급이 늦어지면 「전자상거래법」에 따른 지연이자를 지급합니다.</p>

      <h2>제10조 (개인정보 보호)</h2>
      <p>회사는 주문에 필요한 최소한의 개인정보만 수집하며, 자세한 내용은 <a href="#" onClick={(e) => { e.preventDefault(); nav("privacy"); }}>개인정보처리방침</a>에 따릅니다.</p>

      <h2>제11조 (회사의 의무)</h2>
      <p>회사는 법령과 이 약관이 금지하는 행위를 하지 않으며, 안정적으로 상품을 공급하기 위해 노력합니다. 상품 정보는 실제와 다르지 않게 표시합니다.</p>

      <h2>제12조 (분쟁 해결)</h2>
      <p>이용자의 불만은 고객센터에서 우선 처리하며, 해결되지 않으면 한국소비자원 등 분쟁조정기관에 조정을 신청할 수 있습니다. 회사와 이용자 사이의 소송은 민사소송법상 관할 법원에 제기합니다.</p>
    </LegalShell>
  );
}

Object.assign(window, { PrivacyPage, TermsPage });
