// ─── Navbar ──────────────────────────────────────────────────────────────────
function toggleMenu() {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.getElementById('navbarToggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

document.addEventListener('click', function (event) {
    const navbar = document.querySelector('.navbar');
    const menu = document.getElementById('navbarMenu');
    const toggle = document.getElementById('navbarToggle');
    if (!navbar.contains(event.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
    }
});

document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
            const menu = document.getElementById('navbarMenu');
            const toggle = document.getElementById('navbarToggle');
            menu.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
});

window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        const menu = document.getElementById('navbarMenu');
        const toggle = document.getElementById('navbarToggle');
        menu.classList.remove('active');
        toggle.classList.remove('active');
    }
});

// ─── If already logged in, redirect away (unless force) or logout via query ─
(function () {
    try {
        const params = new URLSearchParams(window.location.search);
        const shouldLogout = params.get('logout') === '1';
        const force = params.get('force') === '1';
        if (shouldLogout && API.logout) {
            API.logout();
        }
        if (API.isLoggedIn() && !force) {
            window.location.href = 'middle-east-law.html';
        }
    } catch { }
})();

// ─── Helper: show / clear error banner ───────────────────────────────────────
function showError(message) {
    let banner = document.getElementById('signupErrorBanner');
    if (!banner) {
        banner = document.createElement('p');
        banner.id = 'signupErrorBanner';
        banner.style.cssText =
            'color:#c0392b;background:#fdecea;border:1px solid #f5c6cb;padding:10px 14px;' +
            'border-radius:6px;margin:0 0 12px;font-size:14px;text-align:center;';
        const form = document.getElementById('signupForm');
        form.insertBefore(banner, form.firstChild);
    }
    banner.textContent = message;
    banner.style.display = 'block';
}

function clearError() {
    const banner = document.getElementById('signupErrorBanner');
    if (banner) banner.style.display = 'none';
}

// ─── Signup Form Submission ───────────────────────────────────────────────────
document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    clearError();

    // Collect fields — IDs match signup.html exactly
    const full_name = (document.getElementById('fullname') || {}).value || '';
    const email = (document.getElementById('email') || {}).value || '';
    const password = (document.getElementById('password') || {}).value || '';
    const confirmPw = (document.getElementById('confirm-password') || {}).value || '';
    const phone = (document.getElementById('phone') || {}).value || '';
    const national_id = (document.getElementById('nationalId') || {}).value || '';

    // Client-side validation
    if (!full_name) { showError('Full name is required.'); return; }
    if (!email) { showError('Email address is required.'); return; }
    if (!password) { showError('Password is required.'); return; }
    if (password.length < 6) { showError('Password must be at least 6 characters.'); return; }
    if (confirmPw && confirmPw !== password) {
        showError('Passwords do not match.');
        return;
    }

    const submitBtn = this.querySelector('[type="submit"]') || this.querySelector('button');
    const restore = API.UI.setLoading(submitBtn, 'Creating account…');

    try {
        const payload = { fullName: full_name, email, password };
        if (phone) payload.phone = phone;
        if (national_id) payload.national_id = national_id;

        await API.Auth.register(payload);

        // Pass success message to login page via sessionStorage
        sessionStorage.setItem('signupSuccess', 'Account created! Please sign in.');
        window.location.href = 'login.html';
    } catch (err) {
        restore();
        showError(err.message || 'Registration failed. Please try again.');
    }
});

// ─── Language Selector ────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('language') || 'en';
const translations = {
    en: {
        home: 'Home',
        services: 'Services',
        about: 'About',
        faq: 'FAQ',
        login: 'Login',
        signup: 'Sign Up',
        signupTitle: 'Create Account',
        signupSubtitle: 'Already have an account?',
        loginLink: 'Login',
        fullNameLabel: 'Full Name',
        nationalIdLabel: 'National ID number',
        phoneLabel: 'Phone Number',
        emailLabel: 'E-mail Address',
        passwordLabel: 'Password',
        confirmPasswordLabel: 'Confirm Password',
        signupButton: 'CREATE ACCOUNT',
        termsText: 'By signing up, you agree to our <a href="#" data-i18n="termsLink">Terms of Service</a> and <a href="#" data-i18n="privacyLink">Privacy Policy</a>',
        termsLink: 'Terms of Service',
        privacyLink: 'Privacy Policy',
        alreadyHaveAccount: 'Already have an account?',
        goToLogin: 'Go to Login'
    },
    ar: {
        home: 'الرئيسية',
        services: 'الخدمات',
        about: 'من نحن',
        faq: 'الأسئلة الشائعة',
        login: 'تسجيل الدخول',
        signup: 'إنشاء حساب',
        signupTitle: 'إنشاء حساب',
        signupSubtitle: 'لديك حساب بالفعل؟',
        loginLink: 'تسجيل الدخول',
        alreadyHaveAccount: 'لديك حساب بالفعل؟',
        goToLogin: 'انتقل إلى تسجيل الدخول',
        fullNameLabel: 'الاسم الكامل',
        nationalIdLabel: 'رقم الهوية الوطنية',
        phoneLabel: 'رقم الهاتف',
        emailLabel: 'عنوان البريد الإلكتروني',
        passwordLabel: 'كلمة المرور',
        confirmPasswordLabel: 'تأكيد كلمة المرور',
        signupButton: 'إنشاء حساب',
        termsText: 'بإنشاء حساب، أنت توافق على <a href="#" data-i18n="termsLink">شروط الخدمة</a> و <a href="#" data-i18n="privacyLink">سياسة الخصوصية</a>',
        termsLink: 'شروط الخدمة',
        privacyLink: 'سياسة الخصوصية'
    }
};

function toggleLangMenu() {
    const dropdown = document.getElementById('langDropdown');
    dropdown.classList.toggle('active');
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    const html = document.getElementById('htmlLang');
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    const termsDiv = document.querySelector('.terms span');
    if (termsDiv && translations[lang].termsText) {
        termsDiv.innerHTML = translations[lang].termsText;
    }
    const langText = document.getElementById('langText');
    langText.textContent = lang === 'ar' ? 'العربية' : 'English';
    document.getElementById('langDropdown').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function () {
    changeLanguage(currentLang);
});

document.addEventListener('click', function (event) {
    const langSelector = document.querySelector('.language-selector');
    if (langSelector && !langSelector.contains(event.target)) {
        document.getElementById('langDropdown').classList.remove('active');
    }
});

// Prefill from query string and auto submit if all required present
(function () {
    try {
        const params = new URLSearchParams(window.location.search);
        const fullnameQS = params.get('fullname') || '';
        const emailQS = params.get('email') || '';
        const passwordQS = params.get('password') || '';
        const confirmQS = params.get('confirm-password') || '';
        const phoneQS = params.get('phone') || '';
        const nationalQS = params.get('nationalId') || '';
        if (fullnameQS) document.getElementById('fullname').value = fullnameQS;
        if (emailQS) document.getElementById('email').value = emailQS;
        if (passwordQS) document.getElementById('password').value = passwordQS;
        if (confirmQS) document.getElementById('confirm-password').value = confirmQS;
        if (phoneQS) document.getElementById('phone').value = phoneQS;
        if (nationalQS) document.getElementById('nationalId').value = nationalQS;
        if (fullnameQS && emailQS && passwordQS && confirmQS && passwordQS === confirmQS) {
            document.getElementById('signupForm').dispatchEvent(new Event('submit'));
        }
    } catch {}
})();
