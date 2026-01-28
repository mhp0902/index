const params = new URLSearchParams(location.search);
const q = params.get('q'); // 없으면 null [web:250]

const input = document.getElementById('q');
const msg = document.getElementById('msg');

if (q) {
  input.value = q;
  msg.textContent = `"${q}" 검색 결과(데모)`;
} else {
  msg.textContent = '검색어를 입력하고 검색을 눌러보세요.';
}
