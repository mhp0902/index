const cartList = document.getElementById('cartList');
const cartTotalEl = document.getElementById('cartTotal');
const payBtn = document.getElementById('payBtn');

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  } catch (e) {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart)); // [web:216][web:219]
}

function formatWon(num) {
  return Number(num || 0).toLocaleString('ko-KR') + '원';
}

function calcTotal(cart) {
  return cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty || 1)), 0);
}

function renderCart() {
  const cart = getCart();
  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = '<p>장바구니가 비어있어요.</p>';
    if (cartTotalEl) cartTotalEl.textContent = '0원';
    if (payBtn) payBtn.disabled = true;
    return;
  }

  cartList.innerHTML = cart.map((item, idx) => `
    <article class="card">
      <div class="thumb sq">
        <img src="${item.img}" alt="">
      </div>
      <p>${item.name}<br><span>${formatWon(item.price)} · ${item.qty}개</span></p>
      <button class="icon2" type="button" data-remove-index="${idx}">삭제</button>
    </article>
  `).join('');

  const total = calcTotal(cart);
  if (cartTotalEl) cartTotalEl.textContent = formatWon(total);
  if (payBtn) payBtn.disabled = false;
}

// 삭제
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove-index]');
  if (!btn) return;

  const idx = Number(btn.dataset.removeIndex);
  const cart = getCart();
  cart.splice(idx, 1);

  setCart(cart);
  renderCart();
});

// 결제하기(데모)
if (payBtn) {
  payBtn.addEventListener('click', () => {
    const cart = getCart();
    const total = calcTotal(cart);

    const ok = confirm(`총 ${formatWon(total)} 결제하시겠습니까?`);
    if (!ok) return;

    alert('결제가 완료되었습니다(데모).');

    setCart([]); // 결제 후 장바구니 비우기
    renderCart();
  });
}

renderCart();
