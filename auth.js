// auth.js (데모용: 브라우저 저장소 기반)

function loadUsers() {
  try { return JSON.parse(localStorage.getItem('users')) || []; }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// 데모용 해시(서버 없는 상태에서 "평문 저장"만 피하기 위함)
async function hashPw(pw) {
  const data = new TextEncoder().encode(pw);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// 세션(탭 닫으면 로그아웃)
export function setSession(email) {
  sessionStorage.setItem('sessionUser', email);
}
export function getSession() {
  return sessionStorage.getItem('sessionUser');
}
export function clearSession() {
  sessionStorage.removeItem('sessionUser');
  sessionStorage.removeItem('role');
}

// 관리자 이메일(여기에 너 이메일 넣으면 관리자 됨)
const ADMIN_EMAILS = ['123@naver.com'];

function setRoleByEmail(email) {
  const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';
  sessionStorage.setItem('role', role);
  return role;
}

export function getRole() {
  return sessionStorage.getItem('role') || 'user';
}

export async function registerUser({ email, password }) {
  if (!email || !password) throw new Error('이메일/비밀번호를 입력하세요.');

  const users = loadUsers();
  if (users.some(u => u.email === email)) throw new Error('이미 가입된 이메일입니다.');

  const passwordHash = await hashPw(password);
  users.push({ email, passwordHash, createdAt: Date.now() });
  saveUsers(users);

  // 가입 후 바로 로그인 처리 + role 세팅
  setSession(email);
  setRoleByEmail(email);

  return { email };
}

export async function loginUser({ email, password }) {
  if (!email || !password) throw new Error('이메일/비밀번호를 입력하세요.');

  const users = loadUsers();
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('가입된 계정이 없습니다.');

  const passwordHash = await hashPw(password);
  if (user.passwordHash !== passwordHash) throw new Error('비밀번호가 틀렸습니다.');

  setSession(user.email);
  setRoleByEmail(user.email);

  return { email: user.email, role: getRole() };
}

// 보호 페이지에서 사용
export function requireLogin(redirect = './login.html') {
  if (!getSession()) location.href = redirect;
}
