import './index.js';

const params = new URLSearchParams(location.search);
const name = (params.get('name') || '').trim();
const price = Number(params.get('price') || 0);
const img = params.get('img') || '';

const imgEl = document.getElementById('detailImg');
const nameEl = document.getElementById('detailName');
const priceEl = document.getElementById('detailPrice');
const totalPriceText = document.getElementById('totalPriceText');

const colorWrap = document.getElementById('colorOptions');
const sizeWrap = document.getElementById('sizeOptions');

const selectedHint = document.getElementById('selectedHint');
const optionLinesEl = document.getElementById('optionLines');

const addBtn = document.getElementById('detailAddBtn');
const buyNowBtn = document.getElementById('buyNowBtn');

const COLORS = ['블랙', '차콜', '오프화이트'];
const SIZES = ['S', 'M', 'L'];

let selected = { color: null, size: null };
let lines = []; // [{ color, size, qty }]

function formatWon(v){ return `${Number(v || 0).toLocaleString('ko-KR')}원`; }

function getCart() {
  try { return JSON.parse(localStorage.getItem('cartItems')) || []; }
  catch { return []; }
}
function setCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}
function addLineToCart(line) {
  const cart = getCart();
  const found = cart.find(x =>
    x.name === name &&
    x.img === img &&
    x.color === line.color &&
    x.size === line.size
  );
  if (found) found.qty += line.qty;
  else cart.push({ name, price, img, color: line.color, size: line.size, qty: line.qty });
  setCart(cart);
}

function renderOptions(wrap, items, key){
  wrap.innerHTML = '';
  items.forEach((val) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chipbtn';
    btn.textContent = val;
    btn.addEventListener('click', () => {
      selected[key] = val;
      wrap.querySelectorAll('.chipbtn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      maybeAddLine();
    });
    wrap.appendChild(btn);
  });
}

function maybeAddLine(){
  if (!(selected.color && selected.size)) {
    renderSelectedHint();
    return;
  }
  const key = `${selected.color}__${selected.size}`;
  const found = lines.find(l => `${l.color}__${l.size}` === key);
  if (found) found.qty += 1;
  else lines.push({ color: selected.color, size: selected.size, qty: 1 });

  renderSelectedHint();
  renderLines();
  updateTotal();
}

function renderSelectedHint(){
  if (!selectedHint) return;
  selectedHint.style.display = lines.length ? 'none' : 'block';
}

function renderLines(){
  if (!optionLinesEl) return;
  optionLinesEl.innerHTML = '';

  lines.forEach((l, idx) => {
    const row = document.createElement('div');
    row.className = 'line';

    const left = document.createElement('div');
    left.innerHTML = `
      <div class="l-name">${escapeHtml(name || '상품')}</div>
      <div class="l-opt">${escapeHtml(l.color)} / ${escapeHtml(l.size)}</div>
    `;

    const qty = document.createElement('input');
    qty.className = 'qty';
    qty.type = 'number';
    qty.min = '1';
    qty.value = String(l.qty);
    qty.addEventListener('change', () => {
      const v = Math.max(1, Number(qty.value || 1));
      lines[idx].qty = v;
      qty.value = String(v);
      updateTotal();
      renderLines(); // 금액 갱신
    });

    const x = document.createElement('button');
    x.type = 'button';
    x.className = 'xbtn';
    x.textContent = '×';
    x.addEventListener('click', () => {
      lines.splice(idx, 1);
      renderSelectedHint();
      renderLines();
      updateTotal();
    });

    const p = document.createElement('div');
    p.className = 'l-price';
    p.textContent = formatWon(price * l.qty);

    row.append(left, qty, x, p);
    optionLinesEl.appendChild(row);
  });
}

function updateTotal(){
  const total = lines.reduce((sum, l) => sum + (price * l.qty), 0);
  if (totalPriceText) totalPriceText.textContent = formatWon(total);
}

function requireLines(){
  if (!lines.length) {
    alert('옵션을 선택해주세요.');
    return false;
  }
  return true;
}

function escapeHtml(str){
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// 초기 렌더
if (imgEl) imgEl.src = img;
if (nameEl) nameEl.textContent = name || '상품 정보 없음';
if (priceEl) priceEl.textContent = price ? formatWon(price) : '';
updateTotal();

renderOptions(colorWrap, COLORS, 'color');
renderOptions(sizeWrap, SIZES, 'size');
renderSelectedHint();

// 장바구니: 라인 전체를 카트에 반영
if (addBtn) {
  addBtn.addEventListener('click', () => {
    if (!name || !img) return;
    if (!requireLines()) return;
    lines.forEach(addLineToCart);
    alert('장바구니에 담겼습니다.');
  });
}

// 바로구매(데모): 라인 담고 cart로 이동
if (buyNowBtn) {
  buyNowBtn.addEventListener('click', () => {
    if (!name || !img) return;
    if (!requireLines()) return;
    lines.forEach(addLineToCart);
    location.href = './cart.html';
  });
}
