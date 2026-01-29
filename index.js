// ======================
// 1) 메뉴 토글
// ======================
const btn = document.getElementById('menuBtn');
const menu = document.getElementById('mobileMenu');

if (btn && menu) {
  btn.addEventListener('click', () => {
    const opened = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });
} // ← 이 중괄호가 빠져있어서 전체가 멈춥니다. [file:10]


// ======================
// 2) 아이콘 이동: 검색/장바구니
// ======================
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    location.href = './search.html';
  });
}

const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    location.href = './cart.html';
  });
}

// ======================
// 3) 회원 아이콘: 로그인 여부에 따라 이동
// ======================
const userBtn = document.getElementById('userBtn');
if (userBtn) {
  userBtn.addEventListener('click', () => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    location.href = loggedIn ? './mypage.html' : './login.html';
  });
}

// ======================
// 4) 로그아웃 버튼(마이페이지에 있으면 작동) + 접근 제어
// ======================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.setItem('loggedIn', 'false');
    location.href = './login.html';
  });
}

const isMyPage =
  location.pathname.endsWith('/mypage.html') || location.pathname.endsWith('mypage.html');
const loggedIn = localStorage.getItem('loggedIn') === 'true';
if (isMyPage && !loggedIn) {
  location.href = './login.html';
}

// ======================
// 5) prev/next 버튼: 끝이면 처음으로(루프)
// ======================
document.querySelectorAll('.banner, .row-wrap').forEach((wrap) => {
  const prev = wrap.querySelector('.nav.prev');
  const next = wrap.querySelector('.nav.next');
  const track = wrap.querySelector('.carousel, .row, .grid');

  if (!prev || !next || !track) return;

  const EPS = 2;
  const maxLeft = () => track.scrollWidth - track.clientWidth;
  const step = () => track.clientWidth;

  next.addEventListener('click', () => {
    const atEnd = track.scrollLeft >= maxLeft() - EPS;
    if (atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
    else track.scrollBy({ left: step(), behavior: 'smooth' });
  });

  prev.addEventListener('click', () => {
    const atStart = track.scrollLeft <= EPS;
    if (atStart) track.scrollTo({ left: maxLeft(), behavior: 'smooth' });
    else track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
});

// 모바일 메뉴 링크 클릭 시 메뉴 닫기
if (btn && menu) {
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ======================
// 6) 베스트: 처음 5개만 보이기 + 더보기
// ======================
const bestMoreBtn = document.getElementById('bestMoreBtn');
const bestGrid = document.querySelector('#best + .row-wrap .grid');

if (bestGrid && bestMoreBtn) {
  const cards = bestGrid.querySelectorAll('.card');

  cards.forEach((card, i) => {
    if (i >= 5) card.hidden = true;
  });

  bestMoreBtn.addEventListener('click', () => {
    cards.forEach((card) => (card.hidden = false));
    bestMoreBtn.hidden = true;

    if (cards[5]) cards[5].scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ======================
// 7) 상세 이동 + 장바구니 담기(버튼)
// ======================
function getCart() {
  try { return JSON.parse(localStorage.getItem('cartItems')) || []; }
  catch (e) { return []; }
}
function setCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}
function addToCart(item) {
  const cart = getCart();
  const found = cart.find((x) => x.name === item.name);
  if (found) found.qty += 1;
  else cart.push({ ...item, qty: 1 });
  setCart(cart);
}

document.addEventListener('click', (e) => {
  // (A) 담기 버튼 클릭 => 장바구니에만 담기
  const addBtn = e.target.closest('.addCartBtn'); // [web:263]
  if (addBtn) {
    const productEl = addBtn.closest('.card, .mini, .slide');
    if (!productEl) return;

    const name = productEl.dataset.name;
    const price = Number(productEl.dataset.price || 0);
    const img = productEl.dataset.img;
    if (!name || !img) return;

    addToCart({ name, price, img });
    alert('장바구니에 담겼습니다.');
    return;
  }

  // (B) 상품 클릭 => 상세페이지로 이동
  const productEl = e.target.closest('.card, .mini, .slide'); // [web:263]
  if (!productEl) return;

  e.preventDefault();

  const name = productEl.dataset.name || '';
  const price = productEl.dataset.price || '';
  const img = productEl.dataset.img || '';
  if (!name || !img) return;

  location.href =
    './detail.html?name=' + encodeURIComponent(name) + // [web:349]
    '&price=' + encodeURIComponent(price) +
    '&img=' + encodeURIComponent(img);
});
// ======================
// (추가) products.json 내보내기(다운로드)
// 로컬 + 관리자(admin)일 때만 버튼 보이기
// ======================
const exportBtn = document.getElementById('exportProductsBtn');

function isLocalEnv() {
  const host = location.hostname;
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  );
}

function exportProductsJson() {
  const els = document.querySelectorAll(
    '.card[data-name][data-img], .mini[data-name][data-img], .slide[data-name][data-img]'
  );

  const items = Array.from(els)
    .map((el) => ({
      name: (el.dataset.name || '').trim(),
      price: Number(el.dataset.price || 0),
      img: el.dataset.img || '',
    }))
    .filter((p) => p.name && p.img);

  const seen = new Set();
  const uniq = [];
  for (const p of items) {
    const key = `${p.name}__${p.img}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(p);
  }

  const json = JSON.stringify(uniq, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.json';
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

if (exportBtn) {
  const isLocal = isLocalEnv();
  const isAdmin = sessionStorage.getItem('role') === 'admin'; // [web:732]

  exportBtn.hidden = !(isLocal && isAdmin);

  exportBtn.addEventListener('click', (e) => {
    if (!(isLocal && isAdmin)) {
      e.preventDefault();
      alert('관리자(로컬)만 사용할 수 있어요.');
      return;
    }
    exportProductsJson();
  });
}
