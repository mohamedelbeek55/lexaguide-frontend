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

  // Form Modal Elements
  var formModal = document.getElementById('formModal');
  var formModalTitle = document.getElementById('formModalTitle');
  var closeFormModal = document.getElementById('closeFormModal');
  var userForm = document.getElementById('form');
  var addUserBtn = document.getElementById('addUserBtn');
  var editIdInput = document.getElementById('editId');
  var cancelBtn = document.getElementById('cancelBtn');

  // Settings Modal Elements
  var settingsModal = document.getElementById('settingsModal');
  var openSettingsBtn = document.getElementById('openSettingsBtn');
  var closeSettingsModal = document.getElementById('closeSettingsModal');
  var saveSettingsBtn = document.getElementById('saveSettingsBtn');
  var sidebarSettingsLink = document.querySelector('a[href="admin-dashboard.html#settings"]');

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
      var role = u.role || 'User';
      var isActive = u.isActive !== false;
      var reg = formatDate(u.created_at || u.regDate);
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><span class="avatar">' + escapeHtml(getInitials(name)) + '</span></td>' +
        '<td>' + escapeHtml(name) + '</td>' +
        '<td>' + escapeHtml(email) + '</td>' +
        '<td>' + escapeHtml(phone) + '</td>' +
        '<td>' + (isActive ? '<span class="badge badge-active">Active</span>' : '<span class="badge badge-closed">Banned</span>') + '</td>' +
        '<td>' + escapeHtml(reg) + '</td>' +
        '<td class="actions-cell">' +
        '<button type="button" class="btn btn-view" data-action="view" data-id="' + u.id + '">View</button>' +
        '<button type="button" class="btn btn-edit" data-action="edit" data-id="' + u.id + '" style="margin-left:5px;">Edit</button>' +
        '<button type="button" class="btn btn-danger" data-action="delete" data-id="' + u.id + '" style="margin-left:5px;">Delete</button>' +
        '</td>';
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('[data-action="view"]').forEach(function (btn) {
      btn.addEventListener('click', function () { openView(btn.getAttribute('data-id')); });
    });
    tbody.querySelectorAll('[data-action="edit"]').forEach(function (btn) {
      btn.addEventListener('click', function () { openForm(btn.getAttribute('data-id')); });
    });
    tbody.querySelectorAll('[data-action="delete"]').forEach(function (btn) {
      btn.addEventListener('click', function () { handleDelete(btn.getAttribute('data-id')); });
    });
    updateStats();
  }

  async function toggleUserStatus(id) {
    try {
      await API.Admin.toggleUser(id);
      API.UI.toast('User status updated');
      loadUsers();
      closeViewModalFn();
    } catch (err) {
      API.UI.toast(err.message, 'error');
    }
  }

  function openForm(id) {
    userForm.reset();
    editIdInput.value = id || '';
    document.getElementById('lawyerFields').style.display = 'none'; // Reset lawyer fields visibility
    
    if (id) {
      formModalTitle.textContent = 'Edit User';
      var u = users.find(function (x) { return x.id === id; });
      if (u) {
        document.getElementById('fullName').value = u.full_name || '';
        document.getElementById('email').value = u.email || '';
        document.getElementById('phone').value = u.phone || '';
        const role = u.role.toLowerCase();
        document.getElementById('role').value = role;
        toggleLawyerFields(role); // Show fields if lawyer

        document.getElementById('status').value = u.isActive ? 'Active' : 'Banned';
        document.getElementById('password').required = false;

        // If it's a lawyer, we might want to populate lawyer fields
        // but since listUsers doesn't return lawyer-specific fields yet, 
        // they will be empty. 
      }
    } else {
      formModalTitle.textContent = 'Add User';
      document.getElementById('password').required = true;
    }
    
    formModal.classList.add('open');
    formModal.setAttribute('aria-hidden', 'false');
  }

  window.toggleLawyerFields = function(role) {
    const lawyerFields = document.getElementById('lawyerFields');
    if (role.toLowerCase() === 'lawyer') {
      lawyerFields.style.display = 'block';
    } else {
      lawyerFields.style.display = 'none';
    }
  };

  function closeFormModalFn() {
    formModal.classList.remove('open');
    formModal.setAttribute('aria-hidden', 'true');
    userForm.reset();
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await API.Admin.deleteUser(id);
      API.UI.toast('User deleted successfully');
      loadUsers();
    } catch (err) {
      API.UI.toast(err.message, 'error');
    }
  }

  userForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var id = editIdInput.value;
    const role = document.getElementById('role').value.toLowerCase();
    
    var payload = {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      role: role,
      isActive: document.getElementById('status').value === 'Active'
    };

    if (role === 'lawyer') {
      payload.governorate = document.getElementById('governorate').value;
      payload.specialties = document.getElementById('specialties').value;
      payload.pricePerSession = document.getElementById('pricePerSession').value;
      payload.bio = document.getElementById('bio').value;
      payload.successRate = document.getElementById('successRate').value;
    }
    
    var password = document.getElementById('password').value;
    if (password) payload.password = password;

    try {
      if (id) {
        await API.Admin.updateUser(id, payload);
        API.UI.toast('User updated successfully');
      } else {
        if (!password) {
          API.UI.toast('Password is required for new users', 'error');
          return;
        }
        await API.Admin.createUser(payload);
        API.UI.toast('User created successfully');
      }
      closeFormModalFn();
      loadUsers();
    } catch (err) {
      API.UI.toast(err.message, 'error');
    }
  });

  addUserBtn.addEventListener('click', function () { openForm(); });
  closeFormModal.addEventListener('click', closeFormModalFn);
  cancelBtn.addEventListener('click', closeFormModalFn);

  function openView(id) {
    var u = users.find(function (x) { return x.id === id; });
    if (!u) return;
    var name = u.full_name || u.fullName || '—';
    var isActive = u.isActive !== false;
    
    viewModalBody.innerHTML =
      '<div class="detail-avatar-wrap"><span class="avatar">' + escapeHtml(getInitials(name)) + '</span></div>' +
      '<div class="detail-row"><span class="k">Name</span><span>' + escapeHtml(name) + '</span></div>' +
      '<div class="detail-row"><span class="k">Email</span><span>' + escapeHtml(u.email || '—') + '</span></div>' +
      '<div class="detail-row"><span class="k">Phone</span><span>' + escapeHtml(u.phone || '—') + '</span></div>' +
      '<div class="detail-row"><span class="k">Role</span><span style="text-transform:capitalize;">' + escapeHtml(u.role || 'User') + '</span></div>' +
      '<div class="detail-row"><span class="k">Status</span><span>' + (isActive ? 'Active' : 'Banned') + '</span></div>' +
      '<div class="detail-row"><span class="k">Registered</span><span>' + escapeHtml(formatDate(u.created_at)) + '</span></div>' +
      '<div style="margin-top:20px; display:flex; gap:10px;">' +
      '<button class="btn ' + (isActive ? 'btn-danger' : 'btn-success') + '" onclick="window._lexaToggleStatus(\'' + u.id + '\')">' + 
      (isActive ? 'Ban User' : 'Unban User') + '</button>' +
      '</div>';
    
    window._lexaToggleStatus = toggleUserStatus;
    
    viewModal.classList.add('open');
    viewModal.setAttribute('aria-hidden', 'false');
  }

  function closeViewModalFn() {
    viewModal.classList.remove('open');
    viewModal.setAttribute('aria-hidden', 'true');
  }

  closeViewModal.addEventListener('click', closeViewModalFn);
  
  // Settings Modal Functions
  function openSettings() {
    settingsModal.classList.add('open');
    settingsModal.setAttribute('aria-hidden', 'false');
  }

  function closeSettings() {
    settingsModal.classList.remove('open');
    settingsModal.setAttribute('aria-hidden', 'true');
  }

  if (openSettingsBtn) openSettingsBtn.addEventListener('click', openSettings);
  if (closeSettingsModal) closeSettingsModal.addEventListener('click', closeSettings);
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', function() {
      API.UI.toast('Settings saved successfully');
      closeSettings();
    });
  }

  // Handle Sidebar Settings Link
  if (sidebarSettingsLink) {
    sidebarSettingsLink.addEventListener('click', function(e) {
      e.preventDefault();
      openSettings();
    });
  }

  viewModal.addEventListener('click', function (e) { if (e.target === viewModal) closeViewModalFn(); });
  settingsModal.addEventListener('click', function (e) { if (e.target === settingsModal) closeSettings(); });
  formModal.addEventListener('click', function (e) { if (e.target === formModal) closeFormModalFn(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeViewModalFn();
      closeSettings();
      closeFormModalFn();
    }
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
          role: u.role || 'User',
          isActive: u.isActive !== false,
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
