(function () {
  'use strict';

  if (API.requireAdmin) {
    API.requireAdmin();
  } else {
    API.requireAuth();
  }

  var users = [];
  var tbody = document.getElementById('tbody');
  var searchEl = document.getElementById('search');
  var viewModal = document.getElementById('viewModal');
  var viewModalBody = document.getElementById('viewModalBody');
  var closeViewModal = document.getElementById('closeViewModal');

  function getInitials(name) {
    var parts = (name || '').trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (name || '?').charAt(0).toUpperCase();
  }

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str == null ? '' : str;
    return d.innerHTML;
  }

  function formatDate(createdAt) {
    if (!createdAt) return '—';
    try {
      var d = new Date(createdAt);
      return isNaN(d.getTime()) ? createdAt : d.toISOString().slice(0, 10);
    } catch (e) {
      return createdAt;
    }
  }

  function updateStats() {
    document.getElementById('statTotal').textContent = users.length;
  }

  function getFiltered() {
    var q = (searchEl.value || '').trim().toLowerCase();
    if (!q) return users;
    return users.filter(function (u) {
      var name = (u.full_name || u.fullName || '').toLowerCase();
      var email = (u.email || '').toLowerCase();
      return name.indexOf(q) !== -1 || email.indexOf(q) !== -1;
    });
  }

  function render() {
    var list = getFiltered();
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-msg">No users found.</td></tr>';
      updateStats();
      return;
    }
    list.forEach(function (u) {
      var name = u.full_name || u.fullName || '—';
      var email = u.email || '—';
      var phone = u.phone || '—';
      var country = u.country || '—';
      var reg = formatDate(u.created_at || u.regDate);
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><span class="avatar">' + escapeHtml(getInitials(name)) + '</span></td>' +
        '<td>' + escapeHtml(name) + '</td>' +
        '<td>' + escapeHtml(email) + '</td>' +
        '<td>' + escapeHtml(phone) + '</td>' +
        '<td>' + escapeHtml(country) + '</td>' +
        '<td>' + escapeHtml(reg) + '</td>' +
        '<td class="actions-cell">' +
        '<button type="button" class="btn btn-view" data-action="view" data-id="' + u.id + '">View</button>' +
        '</td>';
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('[data-action="view"]').forEach(function (btn) {
      btn.addEventListener('click', function () { openView(parseInt(btn.getAttribute('data-id'), 10)); });
    });
    updateStats();
  }

  function openView(id) {
    var u = users.find(function (x) { return x.id === id; });
    if (!u) return;
    var name = u.full_name || u.fullName || '—';
    viewModalBody.innerHTML =
      '<div class="detail-avatar-wrap"><span class="avatar">' + escapeHtml(getInitials(name)) + '</span></div>' +
      '<div class="detail-row"><span class="k">Name</span><span>' + escapeHtml(name) + '</span></div>' +
      '<div class="detail-row"><span class="k">Email</span><span>' + escapeHtml(u.email || '—') + '</span></div>' +
      '<div class="detail-row"><span class="k">Phone</span><span>' + escapeHtml(u.phone || '—') + '</span></div>' +
      '<div class="detail-row"><span class="k">Country</span><span>' + escapeHtml(u.country || '—') + '</span></div>' +
      '<div class="detail-row"><span class="k">Registered</span><span>' + escapeHtml(formatDate(u.created_at)) + '</span></div>';
    viewModal.classList.add('open');
    viewModal.setAttribute('aria-hidden', 'false');
  }

  function closeViewModalFn() {
    viewModal.classList.remove('open');
    viewModal.setAttribute('aria-hidden', 'true');
  }

  closeViewModal.addEventListener('click', closeViewModalFn);
  viewModal.addEventListener('click', function (e) { if (e.target === viewModal) closeViewModalFn(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && viewModal.classList.contains('open')) closeViewModalFn();
  });
  searchEl.addEventListener('input', render);

  async function loadUsers() {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#888;">Loading users…</td></tr>';
    try {
      if (!API.Admin || (typeof API.Admin.users !== 'function' && typeof API.Admin.getAllUsers !== 'function')) {
        throw new Error('Admin API not available.');
      }
      var response = (typeof API.Admin.getAllUsers === 'function')
        ? await API.Admin.getAllUsers()
        : await API.Admin.users({ page: 1, limit: 100 });
      var raw = (response && (response.data || response.items)) ? (response.data || response.items) : [];
      users = raw.map(function (u) {
        return {
          id: u._id || u.id,
          full_name: u.fullName || u.full_name || '',
          email: u.email || '',
          phone: u.phone || '',
          country: u.country || '',
          created_at: u.createdAt || u.created_at || ''
        };
      });
      render();
    } catch (err) {
      var msg = err.message || 'Unknown error';
      if (msg.indexOf('403') !== -1 || msg.toLowerCase().indexOf('forbidden') !== -1) {
        msg = 'Admin access required. Log in with an admin account and set ADMIN_EMAIL in the server .env.';
      } else if (msg.indexOf('401') !== -1 || msg.toLowerCase().indexOf('unauthorized') !== -1) {
        msg = 'Please log in again.';
      }
      tbody.innerHTML = '<tr><td colspan="7" class="empty-msg" style="color:#c0392b;">Failed to load users: ' + escapeHtml(msg) + '</td></tr>';
    }
  }

  loadUsers();

})();
