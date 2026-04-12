(function () {
  'use strict';

  if (API.requireAdmin) {
    API.requireAdmin();
  } else {
    API.requireAuth();
  }

  var lawyers = [];
  var tbody = document.getElementById('tbody');
  var searchEl = document.getElementById('search');
  var filterStatus = document.getElementById('filterStatus');
  var modal = document.getElementById('modal');
  var modalTitle = document.getElementById('modalTitle');
  var form = document.getElementById('form');
  var editId = document.getElementById('editId');
  var modalModeEl = document.getElementById('modalMode');
  var addBtn = document.getElementById('addBtn');
  var closeBtn = document.getElementById('closeModal');
  var cancelBtn = document.getElementById('cancelBtn');

  function getInitials(fullName) {
    var parts = (fullName || '').trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (fullName || '?').charAt(0).toUpperCase();
  }

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function getFiltered() {
    var q = (searchEl.value || '').trim().toLowerCase();
    var statusVal = (filterStatus.value || '').trim();
    return lawyers.filter(function (l) {
      var lStatus = l.availability_status || l.status || '';
      var lName = (l.full_name || l.fullName || '').toLowerCase();
      var lSpec = (l.specialty || l.specialization || '').toLowerCase();
      if (statusVal && lStatus !== statusVal) return false;
      if (q && lName.indexOf(q) === -1 && lSpec.indexOf(q) === -1) return false;
      return true;
    });
  }

  var legalAreas = [];

  function setAddMode() {
    modalModeEl.value = 'add';
    modalTitle.textContent = 'Add Lawyer';
    editId.value = '';
    document.getElementById('fullName').value = '';
    var emailEl = document.getElementById('email');
    if (emailEl) emailEl.value = '';
    var passEl = document.getElementById('password');
    if (passEl) passEl.value = '';
    var specEl = document.getElementById('specialty');
    if (specEl && specEl.options.length) specEl.selectedIndex = 0;
    document.getElementById('country').value = '';
    document.getElementById('availabilityStatus').value = 'unavailable';
    document.getElementById('pricePerSession').value = '';
    document.getElementById('sessionDurationMins').value = '';
    document.getElementById('communicationMethods').value = 'both';
    document.getElementById('bio').value = '';
    document.getElementById('fgFullName').style.display = '';
    document.getElementById('fgEmail').style.display = '';
    document.getElementById('fgPassword').style.display = '';
    document.getElementById('fgSpecialty').style.display = '';
    document.getElementById('fgCountry').style.display = '';
    document.getElementById('fgAvailability').style.display = '';
    document.getElementById('fgPrice').style.display = '';
    document.getElementById('fgSessionDuration').style.display = '';
    document.getElementById('fgCommunication').style.display = '';
    document.getElementById('fgBio').style.display = '';
  }

  function setEditMode() {
    modalModeEl.value = 'edit';
    document.getElementById('fgFullName').style.display = '';
    document.getElementById('fgEmail').style.display = 'none'; // Cannot change email
    document.getElementById('fgPassword').style.display = 'none'; // Pass change separate
    document.getElementById('fgSpecialty').style.display = '';
    document.getElementById('fgCountry').style.display = '';
    document.getElementById('fgAvailability').style.display = '';
    document.getElementById('fgPrice').style.display = '';
    document.getElementById('fgSessionDuration').style.display = '';
    document.getElementById('fgCommunication').style.display = '';
    document.getElementById('fgBio').style.display = '';
  }

  function render() {
    var list = getFiltered();
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-msg">No lawyers found.</td></tr>';
      return;
    }
    list.forEach(function (l) {
      var name = l.full_name || l.fullName || '—';
      var spec = l.specialty || (l.specialties && l.specialties[0]) || l.specialization || '—';
      var country = l.country || l.governorate || '—';
      var status = l.availability_status || l.availabilityStatus || l.status || 'unavailable';
      var id = l.id || l._id;
      var isVerified = l.isVerified || false;
      var isActive = l.isActive !== false;

      var statusClass = (status === 'online_now' || status === 'available_in_30_mins')
        ? 'badge-status-active' : 'badge-status-inactive';

      var tr = document.createElement('tr');
      tr.setAttribute('data-id', id);
      tr.innerHTML =
        '<td><span class="avatar">' + escapeHtml(getInitials(name)) + '</span></td>' +
        '<td>' + escapeHtml(name) + '</td>' +
        '<td>' + escapeHtml(spec) + '</td>' +
        '<td>' + escapeHtml(country) + '</td>' +
        '<td><span class="badge ' + statusClass + '">' + escapeHtml(status) + '</span></td>' +
        '<td class="actions-cell">' +
        '<button type="button" class="btn btn-edit" data-action="edit" data-id="' + id + '">Edit</button> ' +
        (isVerified ? '' : '<button type="button" class="btn btn-secondary" data-action="verify" data-id="' + id + '">Verify</button> ') +
        '<button type="button" class="btn ' + (isActive ? 'btn-danger' : 'btn-success') + '" data-action="toggle-active" data-id="' + id + '" data-active="' + isActive + '">' + (isActive ? 'Disable' : 'Enable') + '</button> ' +
        '<button type="button" class="btn btn-danger" data-action="delete" data-id="' + id + '">Delete</button>' +
        '</td>';
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('[data-action="edit"]').forEach(function (btn) {
      btn.addEventListener('click', function () { openModalEdit(btn.getAttribute('data-id')); });
    });
    tbody.querySelectorAll('[data-action="verify"]').forEach(function (btn) {
      btn.addEventListener('click', function () { verifyLawyer(btn.getAttribute('data-id')); });
    });
    tbody.querySelectorAll('[data-action="toggle-active"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var currentActive = btn.getAttribute('data-active') === 'true';
        enableLawyer(id, !currentActive);
      });
    });
    tbody.querySelectorAll('[data-action="delete"]').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteLawyer(btn.getAttribute('data-id')); });
    });
  }

  function openModalAdd() {
    setAddMode();
    clearErrors();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function openModalEdit(id) {
    var l = lawyers.find(function (x) { return (x.id === id || x._id === id); });
    if (!l) return;
    editId.value = l.id || l._id;
    modalTitle.textContent = 'Edit Lawyer — ' + (l.full_name || l.fullName || '');
    document.getElementById('fullName').value = l.full_name || l.fullName || '';
    var emailEl = document.getElementById('email');
    if (emailEl) emailEl.value = l.email || '';
    var specEl = document.getElementById('specialty');
    if (specEl) {
      var specVal = l.specialty || (l.specialties && l.specialties[0]) || l.specialization || '';
      for (var i = 0; i < specEl.options.length; i++) {
        if (specEl.options[i].value === specVal) { specEl.selectedIndex = i; break; }
      }
    }
    document.getElementById('country').value = l.country || l.governorate || '';
    document.getElementById('availabilityStatus').value = l.availability_status || l.availabilityStatus || l.status || 'unavailable';
    document.getElementById('pricePerSession').value = (l.price_per_session != null ? l.price_per_session : l.pricePerSession) || '';
    document.getElementById('sessionDurationMins').value = (l.session_duration_mins != null ? l.session_duration_mins : l.sessionDurationMins) || '';
    document.getElementById('communicationMethods').value = l.communication_methods || l.communicationMethods || 'both';
    document.getElementById('bio').value = l.bio || '';
    setEditMode();
    clearErrors();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    form.reset();
    editId.value = '';
    clearErrors();
  }

  function clearErrors() {
    form.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });
    form.querySelectorAll('.error-msg').forEach(function (el) { el.textContent = ''; });
  }

  async function verifyLawyer(id) {
    try {
      await API.Lawyer.verify(id);
      API.UI.toast('Lawyer verified successfully.', 'success');
      loadLawyers();
    } catch (err) {
      API.UI.toast(err.message || 'Failed to verify lawyer.', 'error');
    }
  }

  async function enableLawyer(id, status) {
    try {
      await API.Lawyer.setActive(id, status);
      API.UI.toast('Lawyer status updated.', 'success');
      loadLawyers();
    } catch (err) {
      API.UI.toast(err.message || 'Failed to update lawyer status.', 'error');
    }
  }

  async function deleteLawyer(id) {
    if (!confirm('Delete this lawyer? This cannot be undone.')) return;
    try {
      await API.Lawyer.delete(id);
      lawyers = lawyers.filter(function (x) { return x.id !== id; });
      render();
      API.UI.toast('Lawyer deleted.', 'success');
    } catch (err) {
      API.UI.toast(err.message || 'Failed to delete lawyer.', 'error');
    }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var mode = modalModeEl.value || 'edit';
    var saveBtn = form.querySelector('[type="submit"]');
    var restore = API.UI.setLoading(saveBtn, 'Saving…');

    var fullName = (document.getElementById('fullName').value || '').trim();
    var email = (document.getElementById('email') && document.getElementById('email').value || '').trim();
    var password = (document.getElementById('password') && document.getElementById('password').value || '').trim();
    var specEl = document.getElementById('specialty');
    var specialty = specEl ? (specEl.value || '').trim() : '';
    var country = (document.getElementById('country').value || '').trim();
    var availabilityStatus = (document.getElementById('availabilityStatus').value || 'unavailable').trim();
    var pricePerSession = document.getElementById('pricePerSession').value;
    var sessionDurationMins = document.getElementById('sessionDurationMins').value;
    var communicationMethods = (document.getElementById('communicationMethods').value || 'both').trim();
    var bio = (document.getElementById('bio').value || '').trim();

    try {
      if (mode === 'add') {
        if (!fullName || !email || !specialty || !password) {
          restore();
          API.UI.toast('Full name, email, specialty and password are required.', 'error');
          return;
        }
        await API.Lawyer.create({
          fullName: fullName,
          email: email,
          password: password,
          specialties: [specialty],
          governorate: country || undefined,
          availabilityStatus: availabilityStatus,
          pricePerSession: pricePerSession ? parseFloat(pricePerSession) : 0,
          sessionDurationMins: sessionDurationMins ? parseInt(sessionDurationMins, 10) : 30,
          communicationMethods: communicationMethods,
          bio: bio || undefined
        });
        closeModal();
        API.UI.toast('Lawyer added successfully.', 'success');
        loadLawyers();
      } else {
        var id = editId.value;
        if (!id) { restore(); return; }
        await API.Lawyer.update(id, {
          fullName: fullName,
          specialties: [specialty],
          governorate: country || undefined,
          availabilityStatus: availabilityStatus,
          pricePerSession: pricePerSession ? parseFloat(pricePerSession) : 0,
          sessionDurationMins: sessionDurationMins ? parseInt(sessionDurationMins, 10) : 30,
          communicationMethods: communicationMethods,
          bio: bio || undefined
        });
        closeModal();
        API.UI.toast('Lawyer updated successfully.', 'success');
        loadLawyers();
      }
    } catch (err) {
      restore();
      API.UI.toast(err.message || 'Failed to save.', 'error');
    }
  });

  if (addBtn) addBtn.addEventListener('click', openModalAdd);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
  searchEl.addEventListener('input', render);
  filterStatus.addEventListener('change', render);

  async function loadLawyers() {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:#888;">Loading lawyers…</td></tr>';
    try {
      var allResp = await API.Lawyer.getAll();
      var pendResp = await API.Lawyer.getPending().catch(function () { return { data: [] }; });
      var response = { data: [].concat((allResp && allResp.data) || [], (pendResp && pendResp.data) || []) };
      lawyers = (response && response.data) ? response.data : (Array.isArray(response) ? response : []);
      render();
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-msg" style="color:#c0392b;">Failed to load lawyers: ' + escapeHtml(err.message) + '</td></tr>';
    }
  }

  async function loadLegalAreas() {
    var defaults = [
      'Family Law',
      'Real Estate',
      'Commercial Disputes',
      'Labor Law',
      'Intellectual Property',
      'Corporate Law',
      'Criminal Law',
      'Civil Law',
      'Immigration',
      'Tax',
      'Banking & Finance'
    ];
    try {
      var list = defaults;
      var specEl = document.getElementById('specialty');
      if (!specEl) return;
      var firstOpt = specEl.options[0];
      specEl.innerHTML = '';
      if (firstOpt) specEl.appendChild(firstOpt);
      list.forEach(function (name) {
        if (!name) return;
        var opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        specEl.appendChild(opt);
      });
    } catch (e) { /* keep placeholder */ }
  }

  loadLawyers();
  loadLegalAreas();

})();
