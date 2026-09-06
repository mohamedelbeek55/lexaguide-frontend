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

// ─── If already logged in, redirect away ─────────────────────────────────────
if (API.isLoggedIn()) {
    const user = API.getUser();
    if (user && (user.role === 'admin' || user.role === 'Admin')) {
        window.location.href = 'admin-dashboard.html';
    } else if (user && (user.role === 'lawyer' || user.role === 'Lawyer')) {
        window.location.href = 'lawyer.html';
    } else {
        window.location.href = '../index.html';
    }
}

// ─── Show success message from signup redirect ────────────────────────────────
(function () {
    const msg = sessionStorage.getItem('signupSuccess');
    if (msg) {
        sessionStorage.removeItem('signupSuccess');
        API.UI.toast(msg, 'success');
    }
})();

// ─── Helper: show / clear error banner ───────────────────────────────────────
function showError(message) {
    let banner = document.getElementById('loginErrorBanner');
    if (!banner) {
        banner = document.createElement('p');
        banner.id = 'loginErrorBanner';
        banner.style.cssText =
            'color:#c0392b;background:#fdecea;border:1px solid #f5c6cb;padding:10px 14px;' +
            'border-radius:6px;margin:0 0 12px;font-size:14px;text-align:center;';
        const form = document.getElementById('loginForm');
        form.insertBefore(banner, form.firstChild);
    }
    banner.textContent = message;
    banner.style.display = 'block';
}

function clearError() {
    const banner = document.getElementById('loginErrorBanner');
    if (banner) banner.style.display = 'none';
}

// ─── Login Form Submission ────────────────────────────────────────────────────
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    clearError();

    const emailEl = document.getElementById('email') || document.querySelector('[type="email"]');
    const passwordEl = document.getElementById('password') || document.querySelector('[type="password"]');
    const submitBtn = this.querySelector('[type="submit"]') || this.querySelector('button');

    const email = (emailEl ? emailEl.value : '').trim();
    const password = passwordEl ? passwordEl.value : '';

    if (!email || !password) {
        showError('Please enter your email and password.');
        return;
    }

    const restore = API.UI.setLoading(submitBtn, 'Signing in…');

    try {
        const data = await API.Auth.login(email, password);
        // Token + user stored by api.js. Redirect based on role/email.

        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');
        if (redirect) {
            window.location.href = redirect;
            return;
        }

        const user = data.user || API.getUser();
        if (user && (user.role === 'admin' || user.role === 'Admin')) {
            window.location.href = 'admin-dashboard.html';
        } else if (user && (user.role === 'lawyer' || user.role === 'Lawyer')) {
            window.location.href = 'lawyer.html';
        } else {
            window.location.href = '../index.html';
        }
    } catch (err) {
        restore();
        showError(err.message || 'Login failed. Please try again.');
    }
});

// Prefill from query string and auto submit if both present
(function () {
    try {
        const params = new URLSearchParams(window.location.search);
        const emailQS = params.get('email') || '';
        const passwordQS = params.get('password') || '';
        if (emailQS) (document.getElementById('email') || document.querySelector('[type=\"email\"]')).value = emailQS;
        if (passwordQS) (document.getElementById('password') || document.querySelector('[type=\"password\"]')).value = passwordQS;
        if (emailQS && passwordQS) {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
    } catch { }
})();
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
        loginTitle: 'Welcome Back',
        loginSubtitle: 'Sign in to your account to continue',
        emailLabel: 'E-mail Address',
        passwordLabel: 'Password',
        forgotPassword: 'Forgot password?',
        loginButton: 'LOGIN',
        noAccount: "Don't have an account?",
        createAccount: 'Create account',
        orContinueWith: 'or continue with',
        signInWithGoogle: 'Sign in with Google'
    },
    ar: {
        home: 'الرئيسية',
        services: 'الخدمات',
        about: 'من نحن',
        faq: 'الأسئلة الشائعة',
        login: 'تسجيل الدخول',
        signup: 'إنشاء حساب',
        loginTitle: 'مرحباً بعودتك',
        loginSubtitle: 'قم بتسجيل الدخول إلى حسابك للمتابعة',
        emailLabel: 'عنوان البريد الإلكتروني',
        passwordLabel: 'كلمة المرور',
        forgotPassword: 'نسيت كلمة المرور؟',
        loginButton: 'تسجيل الدخول',
        noAccount: 'ليس لديك حساب؟',
        createAccount: 'إنشاء حساب',
        orContinueWith: 'أو تابع باستخدام',
        signInWithGoogle: 'تسجيل الدخول بـ Google'
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

// ─── Google Sign-In (GSI) ─────────────────────────────────────────────────────
//
// Uses google.accounts.oauth2.initTokenClient — opens a real popup every time.
// GOOGLE_CLIENT_ID comes from shared/api.js (exposed on window).

function showGoogleError(message) {
    const banner = document.getElementById('googleErrorBanner');
    if (banner) { banner.textContent = message; banner.style.display = 'block'; }
}

function clearGoogleError() {
    const banner = document.getElementById('googleErrorBanner');
    if (banner) banner.style.display = 'none';
}

function setGoogleLoading(isLoading) {
    const btn = document.getElementById('googleBtn');
    const text = btn && btn.querySelector('.google-btn-text');
    const spinner = document.getElementById('googleSpinner');
    if (!btn) return;
    btn.disabled = isLoading;
    if (text) text.style.opacity = isLoading ? '0.5' : '1';
    if (spinner) spinner.style.display = isLoading ? 'flex' : 'none';
}

function redirectAfterLogin(data) {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) { window.location.href = redirect; return; }
    const user = data.user || API.getUser();
    if (user && (user.role === 'admin' || user.role === 'Admin')) {
        window.location.href = 'admin-dashboard.html';
    } else if (user && (user.role === 'lawyer' || user.role === 'Lawyer')) {
        window.location.href = 'lawyer.html';
    } else {
        window.location.href = '../index.html';
    }
}

function initGoogleSignIn() {
    // Guard: need both the GSI library and the client ID
    if (!window.google || !window.google.accounts || !window.GOOGLE_CLIENT_ID) return;

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: window.GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: async function (tokenResponse) {
            if (tokenResponse.error) {
                setGoogleLoading(false);
                showGoogleError('Google sign-in was cancelled. Please try again.');
                return;
            }
            try {
                // Send access token to backend — backend fetches userinfo from Google
                const data = await API.Auth.googleAuth(tokenResponse.access_token);
                redirectAfterLogin(data);
            } catch (err) {
                setGoogleLoading(false);
                const msg = err.message || '';
                if (msg.toLowerCase().includes('local') || msg.toLowerCase().includes('password')) {
                    showGoogleError('This email is already registered. Please log in with your password instead.');
                } else {
                    showGoogleError(msg || 'Google sign-in failed. Please try again.');
                }
            }
        }
    });

    const btn = document.getElementById('googleBtn');
    if (btn) {
        btn.addEventListener('click', function () {
            clearGoogleError();
            clearError();
            setGoogleLoading(true);
            tokenClient.requestAccessToken({ prompt: 'select_account' });
        });
        btn.disabled = false; // enable now that GSI is ready
    }
}

// Called by GSI library when it finishes loading (set before the script tag)
window.onGoogleLibraryLoad = initGoogleSignIn;

// Fallback: if GSI already loaded before this script ran, init immediately
if (window.google && window.google.accounts) {
    initGoogleSignIn();
}
