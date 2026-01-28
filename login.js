const form = document.getElementById('loginForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const pw = document.getElementById('pw').value;

  const savedEmail = localStorage.getItem('userEmail');
  const savedPw = localStorage.getItem('userPw');

  if (!savedEmail || !savedPw) {
    msg.textContent = '가입된 계정이 없어요. 회원가입부터 해주세요.';
    return;
  }

  if (email !== savedEmail || pw !== savedPw) {
    msg.textContent = '아이디 또는 비밀번호가 틀렸어요.';
    return;
  }

  localStorage.setItem('loggedIn', 'true'); // [web:290]
  location.href = './mypage.html';          // [web:52]
});
