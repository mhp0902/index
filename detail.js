const params = new URLSearchParams(location.search); // [web:302]
const name = (params.get('name') || '').trim();
const price = Number(params.get('price') || 0);
const img = params.get('img') || '';

const imgEl = document.getElementById('detailImg');
const nameEl = document.getElementById('detailName');
const priceEl = document.getElementById('detailPrice');
const addBtn = document.getElementById('detailAddBtn');

function getCart() {
  try { return JSON.parse(localStorage.getItem('cartItems')) || []; }
  catch (e) { return []; }
}
function setCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}
function addToCart(item) {
  const cart = getCart();
  const found = cart.find(x => x.name === item.name);
  if (found) found.qty += 1;
  else cart.push({ ...item, qty: 1 });
  setCart(cart);
}

if (imgEl) imgEl.src = img;
if (nameEl) nameEl.textContent = name || '상품 정보 없음';
if (priceEl) priceEl.textContent = price ? `${price.toLocaleString('ko-KR')}원` : '';

if (addBtn) {
  addBtn.addEventListener('click', () => {
    if (!name || !img) return;
    addToCart({ name, price, img });
    alert('장바구니에 담겼습니다.');
  });
}
