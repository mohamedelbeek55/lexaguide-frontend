(function () {
  'use strict';

  // ─── Auth Guard (Admin only) ────────────────────────────────────────────────
  if (API.requireAdmin) {
    API.requireAdmin();
  } else {
    API.requireAuth();
  }

  // ─── State ──────────────────────────────────────────────────────────────────
  var consultations = [];

  // ─── DOM References ─────────────────────────────────────────────────────────
  var tbody = document.getElementById('tbody');
  var searchEl = document.getElementById('search');
  var filterStatus = document.getElementById('filterStatus');
  var filterArea = document.getElementById('filterArea');
  var filterType = document.getElementById('filterType');
  var dateFrom = document.getElementById('dateFrom');
  var dateTo = document.getElementById('dateTo');

  var formModal = document.getElementById('formModal');
  var viewModal = document.getElementById('viewModal');
  var formModalTitle = document.getElementById('formModalTitle');
  var viewModalBody = document.getElementById('viewModalBody');
  var form = document.getElementById('form');
  var editId = document.getElementById('editId');
  var addBtn = document.getElementById('addBtn');
  var closeFormModal = document.getElementById('closeFormModal');
  var closeViewModal = document.getElementById('closeViewModal');
  var cancelBtn = document.getElementById('cancelBtn');
  var activityFeed = document.getElementById('activityFeed');

  var activity = [];

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function badgeStatusClass(s) {
    if (!s) return '';
    var lower = s.toLowerCase();
    if (lower === 'pending') return 'badge-status-pending';
    if (lower === 'active') return 'badge-status-active';
    if (lower === 'completed' || lower === 'closed') return 'badge-status-closed';
    if (lower === 'cancelled') return 'badge-status-cancelled';
    return '';
  }

  function badgeTypeClass(t) {
    if (!t) return '';
    if (t === 'chat' || t === 'Online') return 'badge-type-online';
    if (t === 'video_call' || t === 'In-Person') return 'badge-type-inperson';
    return '';
  }

  // ─── Map backend consultation object to display fields ───────────────────────
  function mapConsultation(c) {
    // Backend returns: id, client_name/user_name, lawyer_name, legal_area, communication_method,
    //                  status, description, scheduled_at, created_at
    var date = '';
    var time = '';
    if (c.scheduled_at) {
      var d = new Date(c.scheduled_at);
      date = d.toISOString().slice(0, 10);
      time = d.toTimeString().slice(0, 5);
    } else if (c.created_at) {
      var d2 = new Date(c.created_at);
      date = d2.toISOString().slice(0, 10);
      time = d2.toTimeString().slice(0, 5);
    }
    return {
      id: c.id,
      clientName: c.client_name || c.user_name || c.clientName || '—',
      lawyerName: c.lawyer_name || c.lawyerName || '—',
      legalArea: c.legal_area_name || c.legal_area || c.legalArea || '—',
      date: date,
      time: time,
      type: c.communication_method || c.type || '—',
      status: c.status || 'pending',
      notes: c.description || c.notes || '',
      documents: c.documents || [],
      _raw: c
    };
  }

  // ─── Stats ───────────────────────────────────────────────────────────────────
  function updateStats() {
    var total = consultations.length;
    var pending = consultations.filter(function (c) { return (c.status || '').toLowerCase() === 'pending'; }).length;
    var active = consultations.filter(function (c) { return (c.status || '').toLowerCase() === 'active'; }).length;
    var closed = consultations.filter(function (c) {
      var s = (c.status || '').toLowerCase();
      return s === 'closed' || s === 'completed';
    }).length;
    var cancelled = consultations.filter(function (c) { return (c.status || '').toLowerCase() === 'cancelled'; }).length;
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statActive').textContent = active;
    document.getElementById('statClosed').textContent = closed;
    document.getElementById('statCancelled').textContent = cancelled;
  }

  // ─── Filter ──────────────────────────────────────────────────────────────────
  function getFiltered() {
    var q = (searchEl.value || '').trim().toLowerCase();
    var statusVal = (filterStatus.value || '').trim();
    var areaVal = (filterArea.value || '').trim();
    var typeVal = (filterType.value || '').trim();
    var fromVal = dateFrom.value;
    var toVal = dateTo.value;

    return consultations.filter(function (c) {
      if (statusVal && (c.status || '').toLowerCase() !== statusVal.toLowerCase()) return false;
      if (areaVal && c.legalArea !== areaVal) return false;
      if (typeVal && c.type !== typeVal) return false;
      if (q && c.clientName.toLowerCase().indexOf(q) === -1 &&
        c.lawyerName.toLowerCase().indexOf(q) === -1) return false;
      if (fromVal && c.date && c.date < fromVal) return false;
      if (toVal && c.date && c.date > toVal) return false;
      return true;
    });
  }

  // ─── Render table ────────────────────────────────────────────────────────────
  function renderTable() {
    var list = getFiltered();
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-msg">No consultations match your search or filters.</td></tr>';
      updateStats();
      return;
    }
    list.forEach(function (c) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>#' + c.id + '</td>' +
        '<td>' + escapeHtml(c.clientName) + '</td>' +
        '<td>' + escapeHtml(c.lawyerName) + '</td>' +
        '<td>' + escapeHtml(c.legalArea) + '</td>' +
        '<td>' + escapeHtml(c.date) + '</td>' +
        '<td>' + escapeHtml(c.time) + '</td>' +
        '<td><span class="badge ' + badgeTypeClass(c.type) + '">' + escapeHtml(c.type) + '</span></td>' +
        '<td><span class="badge ' + badgeStatusClass(c.status) + '">' + escapeHtml(c.status) + '</span></td>' +
        '<td class="actions-cell">' +
        '<button type="button" class="btn btn-view" data-action="view" data-id="' + c.id + '">View</button>' +
        '<button type="button" class="btn btn-edit" data-action="edit" data-id="' + c.id + '">Edit Status</button>' +
        '</td>';
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('[data-action="view"]').forEach(function (btn) {
      btn.addEventListener('click', function () { openView(parseInt(btn.getAttribute('data-id'), 10)); });
    });
    tbody.querySelectorAll('[data-action="edit"]').forEach(function (btn) {
      btn.addEventListener('click', function () { openEdit(parseInt(btn.getAttribute('data-id'), 10)); });
    });

    updateStats();
  }

  // ─── Activity Feed ───────────────────────────────────────────────────────────
  function renderActivity() {
    if (!activityFeed) return;
    if (activity.length === 0) {
      activityFeed.innerHTML = '<div style="color:#888;font-size:13px;padding:8px 0;">No recent activity.</div>';
      return;
    }
    activityFeed.innerHTML = activity.slice(0, 10).map(function (a) {
      return '<div class="activity-item">' +
        '<span class="activity-dot"></span>' +
        '<div><div class="activity-text">' + escapeHtml(a.text) + '</div>' +
        '<div class="activity-time">' + escapeHtml(a.time) + '</div></div>' +
        '</div>';
    }).join('');
  }

  function pushActivity(text) {
    activity.unshift({ text: text, time: 'Just now' });
    if (activity.length > 20) activity.pop();
    renderActivity();
  }

  // ─── View Modal ──────────────────────────────────────────────────────────────
  function openView(id) {
    var c = consultations.find(function (x) { return x.id === id; });
    if (!c) return;
    viewModalBody.innerHTML =
      '<div class="detail-row"><span class="k">ID</span><span>#' + c.id + '</span></div>' +
      '<div class="detail-row"><span class="k">Client</span><span>' + escapeHtml(c.clientName) + '</span></div>' +
      '<div class="detail-row"><span class="k">Lawyer</span><span>' + escapeHtml(c.lawyerName) + '</span></div>' +
      '<div class="detail-row"><span class="k">Legal Area</span><span>' + escapeHtml(c.legalArea) + '</span></div>' +
      '<div class="detail-row"><span class="k">Date</span><span>' + escapeHtml(c.date) + '</span></div>' +
      '<div class="detail-row"><span class="k">Time</span><span>' + escapeHtml(c.time) + '</span></div>' +
      '<div class="detail-row"><span class="k">Type</span><span class="badge ' + badgeTypeClass(c.type) + '">' + escapeHtml(c.type) + '</span></div>' +
      '<div class="detail-row"><span class="k">Status</span><span class="badge ' + badgeStatusClass(c.status) + '">' + escapeHtml(c.status) + '</span></div>' +
      '<div class="detail-notes"><div class="detail-notes-title">Notes</div><div>' + escapeHtml(c.notes) + '</div></div>';
    viewModal.classList.add('open');
    viewModal.setAttribute('aria-hidden', 'false');
  }

  // ─── Edit Status Modal ───────────────────────────────────────────────────────
  function openEdit(id) {
    var c = consultations.find(function (x) { return x.id === id; });
    if (!c) return;
    editId.value = c.id;
    formModalTitle.textContent = 'Update Status — Consultation #' + c.id;

    // Fill all form fields (some are readonly in edit mode)
    var setVal = function (fieldId, val) {
      var el = document.getElementById(fieldId);
      if (el) el.value = val || '';
    };
    setVal('clientName', c.clientName);
    setVal('lawyerName', c.lawyerName);
    setVal('legalArea', c.legalArea);
    setVal('date', c.date);
    setVal('time', c.time);
    setVal('type', c.type === 'chat' ? 'Online' : (c.type === 'video_call' ? 'In-Person' : c.type));
    setVal('status', c.status);
    setVal('notes', c.notes);

    clearErrors();
    formModal.classList.add('open');
    formModal.setAttribute('aria-hidden', 'false');
  }

  // ─── Close modals ────────────────────────────────────────────────────────────
  function closeFormModalFn() {
    formModal.classList.remove('open');
    formModal.setAttribute('aria-hidden', 'true');
    form.reset();
    editId.value = '';
    clearErrors();
  }

  function closeViewModalFn() {
    viewModal.classList.remove('open');
    viewModal.setAttribute('aria-hidden', 'true');
  }

  function clearErrors() {
    form.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });
    form.querySelectorAll('.error-msg').forEach(function (el) { el.textContent = ''; });
  }

  // ─── Form Submit → API PATCH status ──────────────────────────────────────────
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var id = editId.value ? parseInt(editId.value, 10) : null;
    if (!id) { closeFormModalFn(); return; }

    var statusEl = document.getElementById('status');
    var newStatus = statusEl ? statusEl.value.toLowerCase() : 'pending';

    var saveBtn = form.querySelector('[type="submit"]');
    var restore = API.UI.setLoading(saveBtn, 'Saving…');

    try {
      await API.Consult.updateStatus(id, newStatus);
      // Update local state
      var idx = consultations.findIndex(function (x) { return x.id === id; });
      if (idx !== -1) consultations[idx].status = newStatus;
      pushActivity('Consultation #' + id + ' status changed to ' + newStatus + '.');
      renderTable();
      closeFormModalFn();
      API.UI.toast('Status updated successfully.', 'success');
    } catch (err) {
      restore();
      API.UI.toast(err.message || 'Failed to update status.', 'error');
    }
  });

  // ─── Event Listeners ─────────────────────────────────────────────────────────
  if (addBtn) addBtn.addEventListener('click', function () {
    API.UI.toast('Use the main platform to book a new consultation.', 'info');
  });
  closeFormModal.addEventListener('click', closeFormModalFn);
  closeViewModal.addEventListener('click', closeViewModalFn);
  cancelBtn.addEventListener('click', closeFormModalFn);
  formModal.addEventListener('click', function (e) { if (e.target === formModal) closeFormModalFn(); });
  viewModal.addEventListener('click', function (e) { if (e.target === viewModal) closeViewModalFn(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (formModal.classList.contains('open')) closeFormModalFn();
      if (viewModal.classList.contains('open')) closeViewModalFn();
    }
  });
  searchEl.addEventListener('input', renderTable);
  filterStatus.addEventListener('change', renderTable);
  filterArea.addEventListener('change', renderTable);
  filterType.addEventListener('change', renderTable);
  dateFrom.addEventListener('change', renderTable);
  dateTo.addEventListener('change', renderTable);

  // ─── Load from API (admin: all consultations) ───────────────────────────────────
  async function loadConsultations() {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:2rem;color:#888;">Loading consultations…</td></tr>';
    try {
      var raw = [];
      if (API.Admin && API.Admin.getConsultations) {
        var adminResp = await API.Admin.getConsultations();
        raw = (adminResp && adminResp.data) ? adminResp.data : [];
      }
      if (raw.length === 0 && API.Consult && API.Consult.getMine) {
        var mineResp = await API.Consult.getMine();
        raw = (mineResp && mineResp.data) ? mineResp.data : (Array.isArray(mineResp) ? mineResp : []);
      }
      consultations = raw.map(mapConsultation);
      renderTable();
      renderActivity();
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-msg" style="color:#c0392b;">Failed to load consultations: ' + escapeHtml(err.message) + '</td></tr>';
    }
  }

  loadConsultations();

})();
