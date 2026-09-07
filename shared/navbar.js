/**
 * shared/navbar.js
 *
 * Reusable navbar logic for ALL pages that use the standard .navbar structure.
 *
 * Provides:
 *   - toggleMenu()          — hamburger open/close + overlay
 *   - toggleLangMenu()      — language dropdown toggle
 *   - changeLanguage(lang)  — i18n language switcher (basic, pages override if needed)
 *   - Navbar auth state     — replaces .navbar-cta based on API.isLoggedIn()
 *   - Overlay click-to-close
 *   - Close on outside click
 *   - Close on link click (mobile)
 *   - Close on resize > 768px
 *   - Scroll shrink effect
 *
 * Load order in HTML:
 *   <script src="../shared/i18n.js"></script>
 *   <script src="../shared/api.js"></script>
 *   <script src="../shared/navbar.js"></script>   ← before page JS
 *   <script src="../js/page.js"></script>
 *
 * Pages that already define their own toggleMenu() (home.js, login.js, etc.)
 * will override this one — that is safe because this file is loaded first.
 */

(function () {
  'use strict';

  // ── Overlay element (created once, appended to body) ──────────────────────
  function getOrCreateOverlay() {
    let overlay = document.getElementById('navbarOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'navbarOverlay';
      overlay.className = 'navbar-overlay';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', closeMenu);
    }
    return overlay;
  }

  // ── Core open / close ─────────────────────────────────────────────────────
  function openMenu() {
    const menu   = document.getElementById('navbarMenu');
    const toggle = document.getElementById('navbarToggle');
    const overlay = getOrCreateOverlay();
    if (menu)   menu.classList.add('active');
    if (toggle) toggle.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMenu() {
    const menu   = document.getElementById('navbarMenu');
    const toggle = document.getElementById('navbarToggle');
    const overlay = document.getElementById('navbarOverlay');
    if (menu)   menu.classList.remove('active');
    if (toggle) toggle.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Exposed globally so HTML onclick="toggleMenu()" still works
  window.toggleMenu = function () {
    const menu = document.getElementById('navbarMenu');
    if (!menu) return;
    const isOpen = menu.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  };

  // ── Language dropdown ──────────────────────────────────────────────────────
  window.toggleLangMenu = window.toggleLangMenu || function () {
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) dropdown.classList.toggle('active');
  };

  // Basic changeLanguage — pages that need full i18n override this in their own JS
  window.changeLanguage = window.changeLanguage || function (lang) {
    localStorage.setItem('language', lang);
    const html = document.getElementById('htmlLang');
    if (html) {
      html.setAttribute('lang', lang);
      html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }
    const langText = document.getElementById('langText');
    if (langText) langText.textContent = lang === 'ar' ? 'العربية' : 'English';
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) dropdown.classList.remove('active');
    // Re-render auth buttons in new language
    renderNavbarAuth();
  };

  // ── Navbar auth state ──────────────────────────────────────────────────────
  function renderNavbarAuth() {
    if (typeof API === 'undefined') return;

    const lang      = localStorage.getItem('language') || 'en';
    const isAr      = lang === 'ar';
    const labels    = {
      myAccount : isAr ? 'حسابي'           : 'My Account',
      logout    : isAr ? 'خروج'            : 'Logout',
      login     : isAr ? 'تسجيل الدخول'   : 'Login',
      signup    : isAr ? 'إنشاء حساب'      : 'Sign Up',
    };

    const ctas = Array.from(document.querySelectorAll('.navbar-cta'));
    const legacyCta = document.getElementById('navbarCta');
    if (legacyCta && !ctas.includes(legacyCta)) ctas.push(legacyCta);
    if (!ctas.length) return;

    if (!API.isLoggedIn()) {
      // Unauthenticated — update text only (keep existing links intact)
      ctas.forEach(cta => {
        const loginLink  = cta.querySelector('.btn-login');
        const signupLink = cta.querySelector('.btn-signup');
        if (loginLink)  loginLink.textContent  = labels.login;
        if (signupLink) signupLink.textContent = labels.signup;
      });
      return;
    }

    // Authenticated — replace CTA with My Account + Logout
    const user = API.getUser();
    const role = (user && user.role) ? String(user.role).toLowerCase() : '';
    let dashHref = '/html/profile.html';
    if (role === 'admin')  dashHref = '/html/admin-dashboard.html';
    if (role === 'lawyer') dashHref = '/html/lawyer.html';

    ctas.forEach(cta => {
      cta.innerHTML = `
        <a href="${dashHref}" class="btn-login">${labels.myAccount}</a>
        <button type="button" class="btn-signup navbar-logout-btn"
                style="cursor:pointer;border:none;">${labels.logout}</button>
      `;
      const logoutBtn = cta.querySelector('.navbar-logout-btn');
      if (logoutBtn) logoutBtn.addEventListener('click', () => API.logout());
    });
  }

  // ── Event wiring (runs after DOM is ready) ─────────────────────────────────
  function init() {
    getOrCreateOverlay();

    // Close menu when a nav link is clicked on mobile
    document.querySelectorAll('.navbar-links a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeMenu();
      });
    });

    // Close menu when clicking outside the navbar (but not on overlay — overlay has its own handler)
    document.addEventListener('click', e => {
      const navbar = document.querySelector('.navbar');
      const menu   = document.getElementById('navbarMenu');
      if (navbar && menu && menu.classList.contains('active') && !navbar.contains(e.target)) {
        closeMenu();
      }
    });

    // Close language dropdown when clicking outside
    document.addEventListener('click', e => {
      const langSelector = document.querySelector('.language-selector');
      const dropdown     = document.getElementById('langDropdown');
      if (langSelector && dropdown && !langSelector.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Close menu on resize above mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });

    // Scroll-shrink effect
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;
      navbar.classList.toggle('navbar-scrolled', window.scrollY > 10);
    });

    // Render auth state on load and on language change
    renderNavbarAuth();
    window.addEventListener('languageChanged', renderNavbarAuth);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
