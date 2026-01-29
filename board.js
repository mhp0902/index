const params = new URLSearchParams(location.search);
const type = params.get('type') || 'notice';

const titleEl = document.getElementById('boardTitle');
const listEl = document.getElementById('boardList');
const backBtn = document.getElementById('backBtn');

const BOARD_META = {
  notice: '공지사항',
  faq: '자주 묻는 질문',
  shipping: '배송안내',
  return: '교환/반품',
  cancel: '배송전취소',
  payment: '입금/기타',
  qna: '상품문의',
};

const DATA = {
  notice: [
    { title: '설 연휴 배송 안내', date: '2026-01-20' },
    { title: '신규회원 혜택 안내', date: '2026-01-05' },
  ],
  faq: [
    { title: '배송은 얼마나 걸리나요?', date: '' },
    { title: '교환/반품은 어떻게 하나요?', date: '' },
  ],
  shipping: [
    { title: '기본 배송비/무료배송 기준', date: '' },
    { title: '출고 및 배송기간 안내', date: '' },
  ],
  return: [
    { title: '교환/반품 가능 기간', date: '' },
    { title: '반품 배송비 안내', date: '' },
  ],
  cancel: [
    { title: '배송 전 취소 방법', date: '' },
  ],
  payment: [
    { title: '무통장 입금 확인 시간', date: '' },
  ],
  qna: [
    { title: '상품 문의는 어디서 하나요?', date: '' },
  ],
};

const boardTitle = BOARD_META[type] || '게시판';
document.title = `${boardTitle} | LIVE EVIL`;
if (titleEl) titleEl.textContent = boardTitle;

if (backBtn) backBtn.addEventListener('click', () => history.back());

function render() {
  const rows = DATA[type] || [];
  listEl.innerHTML = rows.map((r, i) => `
    <a class="item" href="./post.html?type=${encodeURIComponent(type)}&id=${i}">
      <div><strong>${escapeHtml(r.title)}</strong></div>
      <div>${r.date ? `<span>${escapeHtml(r.date)}</span>` : `<span>></span>`}</div>
    </a>
  `).join('');
}

function escapeHtml(str){
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

render();
