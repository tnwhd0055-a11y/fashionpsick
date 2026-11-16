// SIK 사이트 빌드 — 커밋 전에 한 번 돌린다 (pre-commit 훅이 자동으로 돌림)
//   node tools/build.mjs
// 하는 일
//  1) .jsx 화면들을 미리 컴파일해 app.js 하나로 (브라우저에서 Babel 655KB 를 받아 컴파일하던 걸 없앤다)
//  2) React 운영용 빌드를 vendor/ 에 복사 (unpkg 개발용 빌드 대신)
//  3) 검색엔진용 정적 페이지: / · /products/<id>/ · /shop/<분류>/ · /about/
//     각 페이지에 고유 제목·설명·canonical·OG·구조화 데이터(JSON-LD)와 본문을 미리 넣어둔다.
//     사람이 열면 같은 앱이 떠서 그 화면을 그대로 보여준다.
//  4) sitemap.xml · robots.txt
// 상품 정보의 원본은 data.js 하나다. 상품을 고치면 이 스크립트만 다시 돌리면 된다.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(ROOT, 'tools', 'package.json'));
const Babel = require('@babel/standalone');
const r = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const w = (p, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };

// ── 1) JSX → app.js (브라우저 Babel 과 같은 설정: react + env) ──
const JSX = ['kit-shared.jsx', 'screen-home.jsx', 'screen-collection.jsx', 'screen-product.jsx', 'screen-about.jsx',
  'screen-intro.jsx', 'screen-shop.jsx', 'screen-legal.jsx', 'screen-community.jsx', 'app-shell.jsx'];
const parts = JSX.map((f) => {
  const out = Babel.transform(r(f), { presets: ['react', 'env'], sourceType: 'script', filename: f, compact: true, comments: false }).code;
  return `/* ${f} */\n${out}`;
});
const app = '/* 자동 생성 파일 — 직접 고치지 말고 .jsx 를 고친 뒤 node tools/build.mjs */\n' + parts.join('\n');
w('app.js', app);
const VER = (await import('node:crypto')).createHash('sha1').update(app + r('data.js')).digest('hex').slice(0, 8);

// ── 2) React 운영용 ──
for (const [from, to] of [['react/umd/react.production.min.js', 'vendor/react.production.min.js'], ['react-dom/umd/react-dom.production.min.js', 'vendor/react-dom.production.min.js']]) {
  w(to, fs.readFileSync(path.join(ROOT, 'tools', 'node_modules', from), 'utf8'));
}

// ── 3) data.js 읽기 (브라우저 흉내) ──
const win = {};
vm.runInNewContext(r('data.js'), { window: win, location: { hostname: 'sikseoul.com' } });
const P = win.SIK_DATA.products, SEO = win.SIK_SEO, BIZ = win.SIK_BIZ, SITE = win.SIK_SITE, URL = win.SIK_URL;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => SITE + (p.startsWith('/') ? p : '/' + p);
const won = (n) => n.toLocaleString('ko-KR') + '원';
const clip = (s, n = 155) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

// 이미지 크기 (width/height 를 적어두면 화면이 덜 밀린다)
let sharp;
sharp = require('sharp');
const dims = {};
async function dim(src) {
  if (!sharp) return '';
  if (!(src in dims)) {
    try { const m = await sharp(path.join(ROOT, src)).metadata(); dims[src] = ` width="${m.width}" height="${m.height}"`; } catch { dims[src] = ''; }
  }
  return dims[src];
}
const img = async (src, alt, lazy = true) => `<img src="${esc(src)}" alt="${esc(alt)}"${await dim(src)}${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} />`;

const ORG = {
  '@type': 'Organization', '@id': SITE + '/#org', name: 'SIK', alternateName: ['식', 'sikseoul', BIZ.company], url: SITE + '/',
  logo: abs(win.SIK_LOGO.lockupLight || win.SIK_LOGO.light),
  sameAs: [win.SIK_INSTAGRAM, win.SIK_SMARTSTORE.replace('://m.', '://'), win.SIK_KAKAO_CHAT.replace(/\/chat$/, '')],
  contactPoint: { '@type': 'ContactPoint', telephone: '+82-' + BIZ.tel.replace(/^0/, ''), contactType: 'customer service', areaServed: 'KR', availableLanguage: 'Korean' },
};
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...obj }).replace(/</g, '\\u003c')}</script>`;

function head({ title, desc, url, image, type = 'website', extra = '', noindex = false }) {
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(clip(desc))}" />`,
    `<link rel="canonical" href="${esc(abs(url))}" />`,
    noindex ? '<meta name="robots" content="noindex, follow" />' : '',
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="SIK" />`,
    `<meta property="og:locale" content="ko_KR" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(clip(desc, 110))}" />`,
    `<meta property="og:url" content="${esc(abs(url))}" />`,
    `<meta property="og:image" content="${esc(abs(image))}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="icon" href="/${esc(win.SIK_LOGO.light)}" />`,
    extra,
  ].filter(Boolean).join('\n');
}

const NAV = win.SIK_NAV;
const navHtml = () => `<nav class="pre-nav" aria-label="메뉴"><a href="/"><img src="${esc(win.SIK_LOGO.light)}" alt="SIK" width="66" height="22" /></a>${
  NAV.map((n) => `<a href="${URL({ screen: 'collection', category: n.key })}">${esc(n.label)}</a>`).join('')}<a href="/about/">ABOUT</a></nav>`;
const footHtml = () => `<footer class="pre-foot"><p>상호 ${esc(BIZ.company)} · 대표 ${esc(BIZ.owner)} · 사업자등록번호 ${esc(BIZ.bizNo)}<br />${esc(BIZ.address)} · 고객센터 ${esc(BIZ.tel)}</p>
<p><a href="${esc(win.SIK_INSTAGRAM)}">Instagram @fashionpsick</a> · <a href="${esc(win.SIK_KAKAO_CHAT)}">카카오톡 문의</a> · <a href="/#terms">이용약관</a> · <a href="/#privacy">개인정보처리방침</a></p></footer>`;
const card = async (p) => `<li><a href="${URL({ screen: 'product', productId: p.id })}">${await img(p.image, p.name)}<strong>${esc(p.name)}</strong><br /><span class="pre-price">${won(p.price)}${p.compareAt ? `<s>${won(p.compareAt)}</s>` : ''}</span>${p.soldOut ? ' · 일시 품절' : ''}</a></li>`;

const TPL = r('tools/page.html');
const pages = []; // sitemap
function page(file, url, h, body, { index = true } = {}) {
  w(file, TPL.replace('{{HEAD}}', h).replace('{{BODY}}', `<div class="pre">${navHtml()}${body}${footHtml()}</div>`).replace('{{VER}}', VER));
  if (index) pages.push(url);
}

// 홈
{
  const heroA = P.find((p) => p.id === 'blackpoint-necklace') || P[0];
  const body = `<main><h1>${esc(SEO.home.h1)}</h1><p>${esc(SEO.home.desc)}</p>
<h2>NEW IN</h2><ul class="pre-grid">${(await Promise.all(P.map(card))).join('')}</ul></main>`;
  const extra = [
    `<link rel="preload" as="image" href="${esc(heroA.image)}" fetchpriority="high" />`,
    ld({ '@graph': [ORG, { '@type': 'WebSite', '@id': SITE + '/#site', url: SITE + '/', name: 'SIK', inLanguage: 'ko-KR', publisher: { '@id': SITE + '/#org' } }] }),
  ].join('\n');
  page('index.html', '/', head({ title: SEO.home.title, desc: SEO.home.desc, url: '/', image: heroA.image, extra }), body);
}

// 상품
for (const p of P) {
  const url = URL({ screen: 'product', productId: p.id });
  const s = SEO.product(p);
  const gallery = p.gallery || (p.colors ? p.colors.flatMap((c) => c.gallery) : [p.image]);
  const crumbs = [['홈', '/'], [SEO.cat(p.cat === 'Tops' ? 'Tops' : p.id === 'western-belt' ? 'Belt' : 'Accessories').h1, URL({ screen: 'collection', category: p.cat === 'Tops' ? 'Tops' : p.id === 'western-belt' ? 'Belt' : 'Accessories' })], [p.name, url]];
  const specRows = (p.spec || []).filter(([k]) => k !== '제조국').map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
  const related = P.filter((x) => x.id !== p.id && x.cat === p.cat).concat(P.filter((x) => x.id !== p.id && x.cat !== p.cat)).slice(0, 4);
  const body = `<main>
<p><a href="/">홈</a> › <a href="${crumbs[1][1]}">${esc(crumbs[1][0])}</a></p>
<div class="pre-hero">${await img(gallery[0], p.name, false)}</div>
<h1>${esc(p.name)}</h1>
<p>${esc(p.subtitle || '')}</p>
<p class="pre-price"><strong>${won(p.price)}</strong>${p.compareAt ? `<s>${won(p.compareAt)}</s>` : ''}${p.soldOut ? ' · 일시 품절' : ''}</p>
${p.blurb ? `<p>${esc(p.blurb)}</p>` : ''}
${specRows ? `<h2>상품 정보</h2><table>${specRows}</table>` : ''}
<h2>다른 상품</h2><ul class="pre-grid">${(await Promise.all(related.map(card))).join('')}</ul>
</main>`;
  const product = {
    '@type': 'Product', '@id': abs(url) + '#product', name: p.name, description: s.desc, sku: p.id,
    image: gallery.slice(0, 5).map(abs), brand: { '@type': 'Brand', name: 'SIK' },
    ...(p.swatches && p.swatches.length ? { color: p.swatches.map((x) => x.label).join(' / ') } : {}),
    offers: {
      '@type': 'Offer', url: abs(url), priceCurrency: 'KRW', price: p.price, itemCondition: 'https://schema.org/NewCondition',
      availability: p.soldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock', seller: { '@id': SITE + '/#org' },
    },
  };
  const bc = { '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, u], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(u) })) };
  const extra = `<link rel="preload" as="image" href="${esc(gallery[0])}" fetchpriority="high" />\n` + ld({ '@graph': [product, bc, ORG] });
  page(url.slice(1) + 'index.html', url, head({ title: s.title, desc: s.desc, url, image: p.image, type: 'product', extra }), body);
}

// 분류
for (const n of NAV) {
  const list = win.SIK_FILTER(n.key);
  const url = URL({ screen: 'collection', category: n.key });
  const s = SEO.cat(n.key);
  const body = `<main><p><a href="/">홈</a></p><h1>${esc(s.h1)}</h1>${list.length ? `<ul class="pre-grid">${(await Promise.all(list.map(card))).join('')}</ul>` : '<p>준비 중입니다.</p>'}</main>`;
  const items = { '@type': 'ItemList', itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(URL({ screen: 'product', productId: p.id })), name: p.name })) };
  page(url.slice(1) + 'index.html', url, head({ title: s.title, desc: s.desc, url, image: (list[0] || P[0]).image, noindex: !list.length, extra: list.length ? ld(items) : '' }), body, { index: !!list.length });
}

// 소개
{
  const body = `<main><h1>SIK 브랜드 소개</h1><p>${esc(SEO.about.desc)}</p><p>피식푸드에서 시작된 SIK은 짐웨어와 데일리룩의 경계를 지웁니다. 과한 장식 없이, 절제된 디자인으로 매일 착용할 수 있는 가벼움을 만듭니다.</p></main>`;
  page('about/index.html', '/about/', head({ title: SEO.about.title, desc: SEO.about.desc, url: '/about/', image: win.SIK_PRODUCT_IMG, extra: ld(ORG) }), body);
}

// ── 4) sitemap · robots ──
const today = new Date().toISOString().slice(0, 10);
w('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
  pages.map((u) => `  <url><loc>${abs(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
w('robots.txt', `User-agent: *\nAllow: /\nContent-Signal: search=yes, ai-input=yes, ai-train=no\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`app.js ${(app.length / 1024).toFixed(0)}KB · 페이지 ${pages.length}개 + noindex ${NAV.length + P.length + 2 - pages.length}개 · v=${VER}`);
