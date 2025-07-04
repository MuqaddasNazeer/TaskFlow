const BASE_URL = 'http://localhost:3000/api';

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginTab = document.getElementById('show-login');
const signupTab = document.getElementById('show-signup');
const message = document.getElementById('message');

// Toggle tabs
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  message.innerText = '';
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  message.innerText = '';
});

// Signup
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  // ✅ Password Validation (min 8 chars, 1 letter, 1 number)
  const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!strongPassword.test(password)) {
    return showMessage('Password must be at least 8 characters with letters and numbers.', true);
  }

  fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showMessage(data.error, true);
      } else {
        showMessage('Signup successful! Please login now.');
        signupForm.reset();
        loginTab.click();
      }
    })
    .catch(() => showMessage('Signup failed. Please try again.', true));
});


// Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
  showMessage(data.error, true);
} else {
  showMessage(`Welcome, ${data.name}!`);
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('name', data.name);
  window.location.href = 'dashboard.html';
}

    })
    .catch(() => showMessage('Login failed. Please try again.', true));
});

function showMessage(msg, isError = false) {
  message.innerText = msg;
  message.style.color = isError ? 'red' : 'green';
}
