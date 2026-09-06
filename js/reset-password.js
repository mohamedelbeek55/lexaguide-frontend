// ─── Navbar ───────────────────────────────────────────────────────────────────
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
// Email stored by forgot-password.js; resetToken stored after OTP verified
const resetEmail = sessionStorage.getItem('resetEmail') || '';
let   resetToken = '';

// Guard: if no email, send back to forgot-password
if (!resetEmail) {
  window.location.href = 'forgot-password.html';
}

// Display email in subtitle
const emailDisplay = document.getElementById('emailDisplay');
if (emailDisplay) emailDisplay.textContent = resetEmail;

// ─── OTP input wiring ────────────────────────────────────────────────────────
const otpInputs = Array.from(document.querySelectorAll('.otp-input'));

otpInputs.forEach((input, idx) => {
  input.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 1);
    this.classList.toggle('filled', !!this.value);
    clearOTPError();
    if (this.value && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace' && !this.value && idx > 0) {
      otpInputs[idx - 1].value = '';
      otpInputs[idx - 1].classList.remove('filled');
      otpInputs[idx - 1].focus();
    }
  });
});

document.getElementById('otpGroup').addEventListener('paste', function (e) {
  e.preventDefault();
  const pasted = (e.clipboardData || window.clipboardData)
    .getData('text').replace(/\D/g, '').slice(0, 6);
  pasted.split('').forEach((ch, i) => {
    if (otpInputs[i]) { otpInputs[i].value = ch; otpInputs[i].classList.add('filled'); }
  });
  const next = otpInputs.find(i => !i.value);
  (next || otpInputs[otpInputs.length - 1]).focus();
});

// ─── OTP error helpers ────────────────────────────────────────────────────────
function showOTPError(msg) {
  const b = document.getElementById('otpErrorBanner');
  b.textContent = msg; b.style.display = 'block';
  otpInputs.forEach(i => i.classList.add('error'));
}
function clearOTPError() {
  document.getElementById('otpErrorBanner').style.display = 'none';
  otpInputs.forEach(i => i.classList.remove('error'));
}

// ─── New password error helpers ───────────────────────────────────────────────
function showPwError(msg) {
  const b = document.getElementById('newPwErrorBanner');
  b.textContent = msg; b.style.display = 'block';
}
function clearPwError() {
  document.getElementById('newPwErrorBanner').style.display = 'none';
}

// ─── Password strength meter ──────────────────────────────────────────────────
document.getElementById('newPassword').addEventListener('input', function () {
  const pw  = this.value;
  const bar = document.getElementById('strengthBar');
  const lbl = document.getElementById('strengthLabel');

  let score = 0;
  if (pw.length >= 8)              score++;
  if (/[A-Z]/.test(pw))            score++;
  if (/[0-9]/.test(pw))            score++;
  if (/[^A-Za-z0-9]/.test(pw))    score++;

  const levels = [
    { pct: '0%',   bg: 'transparent', label: '' },
    { pct: '25%',  bg: '#e74c3c',     label: 'Weak' },
    { pct: '50%',  bg: '#e67e22',     label: 'Fair' },
    { pct: '75%',  bg: '#f1c40f',     label: 'Good' },
    { pct: '100%', bg: '#27ae60',     label: 'Strong' }
  ];

  const lvl = pw.length === 0 ? levels[0] : levels[score] || levels[1];
  bar.style.width      = lvl.pct;
  bar.style.background = lvl.bg;
  lbl.textContent      = lvl.label;
});

// ─── Step 2: Verify OTP ───────────────────────────────────────────────────────
document.getElementById('otpForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  clearOTPError();

  const otp = otpInputs.map(i => i.value).join('');
  if (otp.length < 6) {
    showOTPError('Please enter all 6 digits of the reset code.');
    return;
  }

  const btn     = document.getElementById('verifyOTPBtn');
  const restore = API.UI.setLoading(btn, 'Verifying…');

  try {
    const data = await API.Auth.verifyResetOTP({ email: resetEmail, otp });
    resetToken = data.resetToken;

    // Advance step indicator: 2 → done, line 2 → done, 3 → active
    document.getElementById('sd2').className = 'step-dot done';
    document.getElementById('sd2').textContent = '✓';
    document.getElementById('sl2').className = 'step-line done';
    document.getElementById('sd3').className = 'step-dot active';

    // Show Step 3, hide Step 2
    document.getElementById('stepOTP').style.display   = 'none';
    document.getElementById('stepNewPw').style.display = 'block';
    document.getElementById('newPassword').focus();
  } catch (err) {
    restore();
    showOTPError(err.message || 'Invalid or expired reset code. Please try again.');
  }
});

// ─── Resend OTP ───────────────────────────────────────────────────────────────
const RESEND_COOLDOWN = 60;
let countdownTimer = null;

function startCountdown() {
  const btn  = document.getElementById('resendBtn');
  const text = document.getElementById('countdownText');
  let rem    = RESEND_COOLDOWN;

  btn.disabled = true;
  text.textContent = `Resend available in ${rem}s`;

  countdownTimer = setInterval(() => {
    rem--;
    if (rem <= 0) {
      clearInterval(countdownTimer);
      btn.disabled = false;
      text.textContent = '';
    } else {
      text.textContent = `Resend available in ${rem}s`;
    }
  }, 1000);
}

startCountdown(); // OTP was already sent by forgot-password page

document.getElementById('resendBtn').addEventListener('click', async function () {
  const restore = API.UI.setLoading(this, 'Sending…');
  try {
    await API.Auth.forgotPassword({ email: resetEmail });
    restore();
    otpInputs.forEach(i => { i.value = ''; i.classList.remove('filled', 'error'); });
    otpInputs[0].focus();
    clearOTPError();
    startCountdown();
  } catch {
    restore();
    // Silently start countdown anyway — backend already sent / rate-limited
    startCountdown();
  }
});

// ─── Step 3: Set new password ─────────────────────────────────────────────────
document.getElementById('newPwForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  clearPwError();

  const newPassword     = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!newPassword || newPassword.length < 6) {
    showPwError('Password must be at least 6 characters.');
    return;
  }
  if (newPassword !== confirmPassword) {
    showPwError('Passwords do not match.');
    return;
  }
  if (!resetToken) {
    showPwError('Something went wrong. Please start over.');
    return;
  }

  const btn     = document.getElementById('resetBtn');
  const restore = API.UI.setLoading(btn, 'Updating…');

  try {
    await API.Auth.resetPassword({ resetToken, newPassword });

    // Clean up stored email
    sessionStorage.removeItem('resetEmail');

    sessionStorage.setItem('signupSuccess', 'Password updated! Please sign in with your new password.');
    window.location.href = 'login.html';
  } catch (err) {
    restore();
    showPwError(err.message || 'Failed to reset password. Please try again.');
  }
});

// ─── Language selector ────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('language') || 'en';
const translations = {
  en: {
    home: 'Home', services: 'Services', about: 'About', faq: 'FAQ',
    login: 'Login', signup: 'Sign Up',
    enterOTPTitle:  'Enter Reset Code',
    verifyCodeBtn:  'Verify Code',
    noCode:         "Didn't receive the code?",
    resendCode:     'Resend Code',
    newPwTitle:     'Set New Password',
    newPwSubtitle:  "Choose a strong password you haven't used before.",
    newPwLabel:     'New Password',
    confirmPwLabel: 'Confirm Password',
    resetPwBtn:     'Reset Password',
    backToLogin:    '← Back to Login'
  },
  ar: {
    home: 'الرئيسية', services: 'الخدمات', about: 'من نحن', faq: 'الأسئلة الشائعة',
    login: 'تسجيل الدخول', signup: 'إنشاء حساب',
    enterOTPTitle:  'أدخل رمز الاسترداد',
    verifyCodeBtn:  'تحقق من الرمز',
    noCode:         'لم تستلم الرمز؟',
    resendCode:     'إعادة الإرسال',
    newPwTitle:     'تعيين كلمة مرور جديدة',
    newPwSubtitle:  'اختر كلمة مرور قوية لم تستخدمها من قبل.',
    newPwLabel:     'كلمة المرور الجديدة',
    confirmPwLabel: 'تأكيد كلمة المرور',
    resetPwBtn:     'إعادة تعيين كلمة المرور',
    backToLogin:    '→ العودة لتسجيل الدخول'
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
