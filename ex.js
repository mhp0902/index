// 메뉴 토글
const btn = document.getElementById('menuBtn');
const menu = document.getElementById('mobileMenu');

if (btn && menu) {
  btn.addEventListener('click', () => {
    const opened = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });
}

// 아이콘 이동: 검색/장바구니
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    location.href = './search.html'; // 이동 [web:52]
  });
}

const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    location.href = './cart.html'; // 이동 [web:52]
  });
}

// 회원 아이콘: 로그인 여부에 따라 이동
const userBtn = document.getElementById('userBtn');
if (userBtn) {
  userBtn.addEventListener('click', () => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    location.href = loggedIn ? './mypage.html' : './login.html'; // 이동 [web:52]
  });
}

// 로그아웃 버튼(마이페이지에 있으면 작동)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.setItem('loggedIn', 'false'); // 저장/갱신 [web:290]
    location.href = './login.html'; // 이동 [web:52]
  });
}
const isMyPage = location.pathname.endsWith('/mypage.html') || location.pathname.endsWith('mypage.html'); // [web:319]
const loggedIn = localStorage.getItem('loggedIn') === 'true';
if (isMyPage && !loggedIn) {
  location.href = './login.html'; // [web:52]
}
