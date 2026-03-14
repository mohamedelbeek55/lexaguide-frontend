(function () {
  'use strict';

  // Navbar mobile menu (stub if not defined globally)
  function toggleMenu() {
    var menu = document.getElementById('navbarMenu');
    if (menu) menu.classList.toggle('active');
  }
  function toggleLangMenu() {
    var dd = document.getElementById('langDropdown');
    if (dd) dd.classList.toggle('open');
  }
  function changeLanguage(lang) {
    localStorage.setItem('language', lang || 'en');
    var text = document.getElementById('langText');
    if (text) text.textContent = lang === 'ar' ? 'العربية' : 'English';
    var dd = document.getElementById('langDropdown');
    if (dd) dd.classList.remove('open');
  }
  window.toggleMenu = toggleMenu;
  window.toggleLangMenu = toggleLangMenu;
  window.changeLanguage = changeLanguage;

  // Require login; redirect to login page if not authenticated
  if (!API.getToken() || !API.getUser()) {
    window.location.href = 'login.html';
    return;
  }

  var user = API.getUser();
  var name = user.full_name || user.name || user.email || 'User';

  function getInitials(n) {
    if (!n || typeof n !== 'string') return '?';
    var parts = n.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return n.slice(0, 2).toUpperCase();
  }

  function escapeHtml(str) {
    if (str == null) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  var avatarEl = document.getElementById('profileAvatarLg');
  var detailsEl = document.getElementById('profileDetails');
  if (avatarEl) avatarEl.textContent = getInitials(name);
  if (detailsEl) {
    detailsEl.innerHTML =
      '<div class="profile-detail-row"><span class="k">Name</span><span class="v">' + escapeHtml(name) + '</span></div>' +
      '<div class="profile-detail-row"><span class="k">Email</span><span class="v">' + escapeHtml(user.email || '—') + '</span></div>' +
      '<div class="profile-detail-row"><span class="k">Phone</span><span class="v">' + escapeHtml(user.phone || '—') + '</span></div>' +
      '<div class="profile-detail-row"><span class="k">Country</span><span class="v">' + escapeHtml(user.country || '—') + '</span></div>';
  }

  // Settings: language
  var settingsLang = document.getElementById('settingsLang');
  if (settingsLang) {
    var saved = localStorage.getItem('language') || 'en';
    settingsLang.value = saved === 'ar' ? 'ar' : 'en';
    settingsLang.addEventListener('change', function () {
      var lang = settingsLang.value;
      localStorage.setItem('language', lang);
      if (typeof changeLanguage === 'function') changeLanguage(lang);
      else document.getElementById('langText').textContent = lang === 'ar' ? 'العربية' : 'English';
    });
  }
})();
