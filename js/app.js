// College Notes Platform - Main Application
// Simple demo mode with localStorage

// Valid register numbers
const VALID_REGS = {
  'CSE-CS': Array.from({length:61}, (_,i) => `25A21A46${String(i+1).padStart(2,'0')}`),
  'CSE-BS': Array.from({length:49}, (_,i) => `25A21A65${String(i+1).padStart(2,'0')}`)
};

const ADMIN_USER = { id: 'admin1', pass: '0000' };
const GOD_USER = { id: 'code over write', pass: '10000' };

const SUBJECTS = [
  {id:'phy',code:'PHY',name:'Physics'},
  {id:'che',code:'CHE',name:'Chemistry'},
  {id:'mat',code:'MAT',name:'Mathematics'},
  {id:'eng',code:'ENG',name:'English'},
  {id:'ip',code:'IP',name:'IP'},
  {id:'apt',code:'APT',name:'APT'},
  {id:'bcme',code:'BCME',name:'BCME'}
];

class Auth {
  static login(division, regNum, password) {
    if (VALID_REGS[division]?.includes(regNum)) {
      const user = { id: regNum, division, role: 'student', time: Date.now() };
      localStorage.setItem('user', JSON.stringify(user));
      return { ok: true, role: 'student' };
    }
    if (regNum === ADMIN_USER.id && password === ADMIN_USER.pass) {
      const user = { id: regNum, role: 'admin', time: Date.now() };
      localStorage.setItem('user', JSON.stringify(user));
      return { ok: true, role: 'admin' };
    }
    if (regNum === GOD_USER.id && password === GOD_USER.pass) {
      const user = { id: regNum, role: 'god', time: Date.now() };
      localStorage.setItem('user', JSON.stringify(user));
      return { ok: true, role: 'god' };
    }
    return { ok: false, error: 'Invalid credentials' };
  }
  
  static getUser() { return JSON.parse(localStorage.getItem('user') || 'null'); }
  static logout() { localStorage.removeItem('user'); window.location = 'index.html'; }
  static isLoggedIn() { return !!this.getUser(); }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop() || 'index.html';
  const user = Auth.getUser();
  
  // Redirect auth
  if (!user && !['index.html', 'login.html', ''].includes(page)) {
    window.location = 'login.html';
  }
  
  // Setup logout
  document.querySelectorAll('#logoutBtn').forEach(btn => {
    btn.onclick = (e) => { e.preventDefault(); Auth.logout(); };
  });
  
  // Show admin links
  if (user && (user.role === 'admin' || user.role === 'god')) {
    const link = document.getElementById('adminLink');
    if (link) link.style.display = 'block';
  }
  if (user && user.role === 'god') {
    const link = document.getElementById('godLink');
    if (link) link.style.display = 'block';
  }
  
  // Dashboard page
  if (page === 'dashboard.html' || page === 'dashboard') {
    setupDashboard(user);
  }
  
  // Login page
  if (page === 'login.html' || page === 'login') {
    setupLogin();
  }
});

function setupLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  
  const regInput = document.getElementById('regNumber');
  const passGroup = document.getElementById('passwordGroup');
  const errDiv = document.getElementById('loginError');
  
  regInput?.addEventListener('change', function() {
    if (this.value === ADMIN_USER.id || this.value === GOD_USER.id) {
      passGroup.style.display = 'block';
    } else {
      passGroup.style.display = 'none';
    }
  });
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const div = document.getElementById('division').value;
    const reg = regInput.value.trim();
    const pass = document.getElementById('password')?.value || '';
    
    if (!div) {
      errDiv.textContent = 'Select division';
      errDiv.style.display = 'block';
      return;
    }
    
    const result = Auth.login(div, reg, pass);
    if (result.ok) {
      window.location = 'dashboard.html';
    } else {
      errDiv.textContent = result.error || 'Login failed';
      errDiv.style.display = 'block';
    }
  });
}

function setupDashboard(user) {
  if (user) {
    const display = document.getElementById('userDisplay');
    const roleDisp = document.getElementById('roleDisplay');
    const regDisp = document.getElementById('regDisplay');
    
    if (display) display.textContent = user.id;
    if (roleDisp) roleDisp.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    if (regDisp) regDisp.textContent = user.id;
  }
  
  // Load subjects
  const subList = document.getElementById('subjectsList');
  if (subList) {
    subList.innerHTML = SUBJECTS.map(s => 
      `<div style="padding:10px;background:#f0f0f0;border-radius:6px;margin-bottom:8px;cursor:pointer;">
        <strong>${s.code}</strong> - ${s.name}
      </div>`
    ).join('');
  }
  
  // Load notifications
  const notifList = document.getElementById('notificationsList');
  if (notifList) {
    notifList.innerHTML = `<div style="padding:10px;background:#fff3cd;border-radius:6px;margin-bottom:8px;">
      Welcome to College Notes Platform!<br/><small>2025-01-15</small>
    </div>`;
  }
  
  // Stats
  const cnt = document.getElementById('subjectCount');
  if (cnt) cnt.textContent = SUBJECTS.length;
}
