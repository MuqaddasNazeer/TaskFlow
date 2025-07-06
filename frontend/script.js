const BASE_URL = 'http://localhost:3000/api';

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginTab = document.getElementById('show-login');
const signupTab = document.getElementById('show-signup');
const message = document.getElementById('message');

// Toggle login/signup tabs
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

// Common fetch utility for POST requests
async function postData(endpoint, payload) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error) {
    console.error(`Error in ${endpoint}:`, error);
    return { error: 'Network error. Please try again.' };
  }
}

// Handle signup
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!strongPassword.test(password)) {
    return showMessage('Password must be at least 8 characters with letters and numbers.', true);
  }

  const data = await postData('/auth/signup', { name, email, password });

  if (data.error) {
    showMessage(data.error, true);
  } else {
    showMessage('Signup successful! Please login now.');
    signupForm.reset();
    loginTab.click();
  }
});

// Handle login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const data = await postData('/auth/login', { email, password });

  if (data.error) {
    showMessage(data.error, true);
  } else {
    showMessage(`Welcome, ${data.name}!`);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('name', data.name);
   window.location.href = 'dashboard/dashboard.html';

  }
});

// Display message
function showMessage(msg, isError = false) {
  message.innerText = msg;
  message.style.color = isError ? 'red' : 'green';
}
