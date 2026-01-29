const params = new URLSearchParams(location.search); // [web:302]
const q = (params.get('q') || '').trim();

const input = document.getElementById('q');
const msg = document.getElementById('msg');
const result = document.getElementById('result');

async function loadProducts() {
  const res = await fetch('./products.json');
  return await res.json();
}

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

function render(list) {
  if (!result) return;

  if (list.length === 0) {
    result.innerHTML = '';
    return;
  }

  result.innerHTML = list.map((p) => `
    <a class="card" href="#"
       data-name="${p.name}"
       data-price="${p.price}"
       data-img="${p.img}">
      <div class="thumb sq"><img src="${p.img}" alt=""></div>
      <p>
        ${p.name}<br />
        <span>${Number(p.price).toLocaleString('ko-KR')}원</span>
        <button class="addCartBtn" type="button">담기</button>
      </p>
    </a>
  `).join('');
}

(async function init() {
  if (input) input.value = q;

  if (!q) {
    if (msg) msg.textContent = '검색어를 입력하고 검색을 눌러보세요.';
    render([]);
    return;
  }

  if (msg) msg.textContent = `"${q}" 검색 결과`;

  const products = await loadProducts();
  const filtered = products.filter((p) =>
    String(p.name).toLowerCase().includes(q.toLowerCase())
  );

  render(filtered);

  if (filtered.length === 0 && result) {
    result.innerHTML = '<p>검색 결과가 없습니다.</p>';
  }
})();

// 결과 영역 클릭 처리
document.addEventListener('click', (e) => {
  // (A) 담기 버튼 클릭 => 장바구니에만 담기
  const addBtn = e.target.closest('#result .addCartBtn');
  if (addBtn) {
    const productEl = addBtn.closest('#result .card');
    if (!productEl) return;

    e.preventDefault();

    const name = productEl.dataset.name;
    const price = Number(productEl.dataset.price || 0);
    const img = productEl.dataset.img;
    if (!name || !img) return;

    addToCart({ name, price, img });
    alert('장바구니에 담겼습니다.');
    return;
  }

  // (B) 카드 클릭 => 상세페이지로 이동
  const card = e.target.closest('#result .card');
  if (!card) return;

  e.preventDefault();

  const name = card.dataset.name || '';
  const price = card.dataset.price || '';
  const img = card.dataset.img || '';
  if (!name || !img) return;

  location.href =
    './detail.html?name=' + encodeURIComponent(name) + // [web:349]
    '&price=' + encodeURIComponent(price) +
    '&img=' + encodeURIComponent(img);
});
