// ─── Navbar toggle ───────────────────────────────────────────────────────────
function toggleMenu() {
  const menu   = document.getElementById('navbarMenu');
  const toggle = document.getElementById('navbarToggle');
  menu.classList.toggle('active');
  toggle.classList.toggle('active');
}

document.addEventListener('click', function (e) {
  const navbar = document.querySelector('.navbar');
  const menu   = document.getElementById('navbarMenu');
  const toggle = document.getElementById('navbarToggle');
  if (!navbar.contains(e.target) && menu.classList.contains('active')) {
    menu.classList.remove('active');
    toggle.classList.remove('active');
  }
});

// ─── State ────────────────────────────────────────────────────────────────────
// Email is passed from signup.js via sessionStorage key "pendingVerifyEmail"
const pendingEmail = sessionStorage.getItem('pendingVerifyEmail') || '';

// If no pending email, the user navigated here directly — redirect to signup
if (!pendingEmail) {
  window.location.href = 'signup.html';
}

// Display the email in the subtitle
const emailDisplay = document.getElementById('emailDisplay');
if (emailDisplay) emailDisplay.textContent = pendingEmail;

// ─── OTP input wiring (auto-advance, backspace, paste) ───────────────────────
const otpInputs = Array.from(document.querySelectorAll('.otp-input'));

otpInputs.forEach((input, idx) => {
  // Accept only digits
  input.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 1);
    this.classList.toggle('filled', this.value.length === 1);
    clearErrors();
    // Auto-advance to next box
    if (this.value && idx < otpInputs.length - 1) {
      otpInputs[idx + 1].focus();
    }
  });

  // Backspace: clear current and move back
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace') {
      if (!this.value && idx > 0) {
        otpInputs[idx - 1].value = '';
        otpInputs[idx - 1].classList.remove('filled');
        otpInputs[idx - 1].focus();
      }
    }
  });
});

// Paste handler — distribute pasted 6-digit code across boxes
document.getElementById('otpGroup').addEventListener('paste', function (e) {
  e.preventDefault();
  const pasted = (e.clipboardData || window.clipboardData)
    .getData('text')
    .replace(/\D/g, '')
    .slice(0, 6);
  pasted.split('').forEach((char, i) => {
    if (otpInputs[i]) {
      otpInputs[i].value = char;
      otpInputs[i].classList.add('filled');
    }
  });
  // Focus the next empty box or the last one
  const nextEmpty = otpInputs.find(inp => !inp.value);
  (nextEmpty || otpInputs[otpInputs.length - 1]).focus();
});

// ─── Error helpers ────────────────────────────────────────────────────────────
function showError(msg) {
  const banner = document.getElementById('verifyErrorBanner');
  banner.textContent = msg;
  banner.style.display = 'block';
  otpInputs.forEach(inp => inp.classList.add('error'));
}

function clearErrors() {
  const banner = document.getElementById('verifyErrorBanner');
  banner.style.display = 'none';
  otpInputs.forEach(inp => inp.classList.remove('error'));
}

// ─── Form submit ─────────────────────────────────────────────────────────────
document.getElementById('verifyForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  clearErrors();

  const otp = otpInputs.map(inp => inp.value).join('');
  if (otp.length < 6) {
    showError('Please enter all 6 digits of the verification code.');
    return;
  }

  const btn     = document.getElementById('verifyBtn');
  const restore = API.UI.setLoading(btn, 'Verifying…');

  try {
    await API.Auth.verifyEmail({ email: pendingEmail, otp });

    // Clean up session state
    sessionStorage.removeItem('pendingVerifyEmail');

    // Show success and redirect to login
    sessionStorage.setItem('signupSuccess', 'Email verified! You can now sign in.');
    window.location.href = 'login.html';
  } catch (err) {
    restore();
    showError(err.message || 'Verification failed. Please check the code and try again.');
  }
});

// ─── Resend OTP ───────────────────────────────────────────────────────────────
const RESEND_COOLDOWN = 60; // seconds — mirrors backend OTP_RESEND_COOLDOWN_MS
let countdownTimer = null;

function startCountdown() {
  const resendBtn     = document.getElementById('resendBtn');
  const countdownText = document.getElementById('countdownText');
  let remaining       = RESEND_COOLDOWN;

  resendBtn.disabled = true;
  countdownText.textContent = `Resend available in ${remaining}s`;

  countdownTimer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(countdownTimer);
      countdownTimer  = null;
      resendBtn.disabled = false;
      countdownText.textContent = '';
    } else {
      countdownText.textContent = `Resend available in ${remaining}s`;
    }
  }, 1000);
}

// Start countdown immediately on page load (OTP was sent at signup)
startCountdown();

document.getElementById('resendBtn').addEventListener('click', async function () {
  const restore = API.UI.setLoading(this, 'Sending…');

  try {
    await API.Auth.sendVerificationOTP();
    restore();
    // Clear inputs for the new code
    otpInputs.forEach(inp => { inp.value = ''; inp.classList.remove('filled', 'error'); });
    otpInputs[0].focus();
    clearErrors();
    startCountdown();
  } catch (err) {
    restore();
    showError(err.message || 'Failed to resend code. Please try again.');
  }
});

// ─── Language selector ────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('language') || 'en';
const translations = {
  en: {
    home: 'Home', services: 'Services', about: 'About', faq: 'FAQ',
    login: 'Login', signup: 'Sign Up',
    verifyTitle:  'Check Your Email',
    verifyButton: 'Verify Email',
    noCode:       "Didn't receive the code?",
    resendCode:   'Resend Code',
    backToLogin:  '← Back to Login'
  },
  ar: {
    home: 'الرئيسية', services: 'الخدمات', about: 'من نحن', faq: 'الأسئلة الشائعة',
    login: 'تسجيل الدخول', signup: 'إنشاء حساب',
    verifyTitle:  'تحقق من بريدك الإلكتروني',
    verifyButton: 'تحقق من البريد',
    noCode:       'لم تستلم الرمز؟',
    resendCode:   'إعادة الإرسال',
    backToLogin:  '→ العودة لتسجيل الدخول'
  }
};

function toggleLangMenu() {
  document.getElementById('langDropdown').classList.toggle('active');
}

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  const html = document.getElementById('htmlLang');
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang]?.[key]) el.textContent = translations[lang][key];
  });
  document.getElementById('langText').textContent = lang === 'ar' ? 'العربية' : 'English';
  document.getElementById('langDropdown').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => changeLanguage(currentLang));

document.addEventListener('click', function (e) {
  const sel = document.querySelector('.language-selector');
  if (sel && !sel.contains(e.target)) {
    document.getElementById('langDropdown').classList.remove('active');
  }
});
