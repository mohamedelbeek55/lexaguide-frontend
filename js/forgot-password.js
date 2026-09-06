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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function showError(msg) {
  const b = document.getElementById('forgotErrorBanner');
  b.textContent = msg;
  b.style.display = 'block';
  document.getElementById('forgotSuccessBanner').style.display = 'none';
}

function showSuccess(msg) {
  const b = document.getElementById('forgotSuccessBanner');
  b.textContent = msg;
  b.style.display = 'block';
  document.getElementById('forgotErrorBanner').style.display = 'none';
}

function clearBanners() {
  document.getElementById('forgotErrorBanner').style.display  = 'none';
  document.getElementById('forgotSuccessBanner').style.display = 'none';
}

// ─── Form submit ──────────────────────────────────────────────────────────────
document.getElementById('forgotForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  clearBanners();

  const email = document.getElementById('email').value.trim();
  if (!email) {
    showError('Please enter your email address.');
    return;
  }

  const btn     = document.getElementById('forgotBtn');
  const restore = API.UI.setLoading(btn, 'Sending…');

  try {
    await API.Auth.forgotPassword({ email });

    // Always show a generic success — backend never reveals if email exists
    showSuccess('If that email is registered, a reset code has been sent. Check your inbox.');

    // Store email so reset-password page knows who to verify
    sessionStorage.setItem('resetEmail', email);

    // Disable the form to prevent double submit; redirect after short delay
    document.getElementById('email').disabled = true;
    btn.disabled = true;

    setTimeout(() => {
      window.location.href = 'reset-password.html';
    }, 2000);
  } catch (err) {
    restore();
    // Even on network error, show generic message to avoid information leak
    showSuccess('If that email is registered, a reset code has been sent. Check your inbox.');
    sessionStorage.setItem('resetEmail', email);
    setTimeout(() => {
      window.location.href = 'reset-password.html';
    }, 2000);
  }
});

// ─── Language selector ────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('language') || 'en';
const translations = {
  en: {
    home: 'Home', services: 'Services', about: 'About', faq: 'FAQ',
    login: 'Login', signup: 'Sign Up',
    forgotTitle:    'Forgot Password?',
    forgotSubtitle: "Enter your email and we'll send you a reset code.",
    emailLabel:     'E-mail Address',
    sendCodeBtn:    'Send Reset Code',
    backToLogin:    '← Back to Login'
  },
  ar: {
    home: 'الرئيسية', services: 'الخدمات', about: 'من نحن', faq: 'الأسئلة الشائعة',
    login: 'تسجيل الدخول', signup: 'إنشاء حساب',
    forgotTitle:    'نسيت كلمة المرور؟',
    forgotSubtitle: 'أدخل بريدك الإلكتروني وسنرسل لك رمز إعادة التعيين.',
    emailLabel:     'عنوان البريد الإلكتروني',
    sendCodeBtn:    'إرسال رمز الاسترداد',
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
