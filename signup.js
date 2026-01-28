const form = document.getElementById('signupForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('suEmail').value.trim();
  const pw = document.getElementById('suPw').value;
  const pw2 = document.getElementById('suPw2').value;

  if (pw !== pw2) {
    msg.textContent = '비밀번호가 서로 달라요.';
    return;
  }

  localStorage.setItem('userEmail', email); // [web:290]
  localStorage.setItem('userPw', pw);       // [web:290]
  localStorage.setItem('loggedIn', 'true'); // [web:290]
  location.href = './mypage.html';          // [web:52]
});
const savedEmail = localStorage.getItem('userEmail');
if (savedEmail && savedEmail === email) {
  msg.textContent = '이미 가입된 이메일이에요.';
  return;
}