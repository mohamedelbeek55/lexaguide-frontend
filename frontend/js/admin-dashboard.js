(function () {
  'use strict';

  if (API.requireAdmin) {
    try { API.requireAdmin(); } catch (e) { return; }
  }

  const tableBody = document.getElementById('lawyersTableBody');
  const searchInput = document.getElementById('searchLawyers');

  let lawyers = [];

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  function getStatusBadgeClass(status) {
    return (status === 'online_now' || status === 'available_in_30_mins') ? 'badge-status-active' : 'badge-status-inactive';
  }

  function renderLawyers(list) {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    if (!list || list.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;">No lawyers found.</td></tr>';
      return;
    }
    list.forEach(function (l) {
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + escapeHtml(l.fullName) + '</td>' +
        '<td>' + escapeHtml(l.email || '') + '</td>' +
        '<td>' + escapeHtml((l.specialties && l.specialties[0]) || '') + '</td>' +
        '<td><span class="badge badge-role-lawyer">Lawyer</span></td>' +
        '<td><span class="badge ' + getStatusBadgeClass(l.status || '') + '">' + escapeHtml(l.status || 'unavailable') + '</span></td>' +
        '<td class="actions-cell"></td>';
      tableBody.appendChild(tr);
    });
  }

  function filterLawyers() {
    const q = (searchInput && searchInput.value || '').trim().toLowerCase();
    if (!q) { renderLawyers(lawyers); return; }
    renderLawyers(lawyers.filter(function (l) {
      return (l.fullName || '').toLowerCase().indexOf(q) !== -1 ||
             ((l.specialties && l.specialties[0]) || '').toLowerCase().indexOf(q) !== -1;
    }));
  }

  async function loadStats() {
    try {
      const resp = await API.Admin.stats();
      const s = resp.stats || resp;
      const el = (id) => document.getElementById(id);
      if (el('statUsers')) el('statUsers').textContent = s.users;
      if (el('statLawyers')) el('statLawyers').textContent = s.lawyers;
      if (el('statProcedures')) el('statProcedures').textContent = s.procedures;
      if (el('statDocs')) el('statDocs').textContent = s.docs;
      if (el('statConsultations')) el('statConsultations').textContent = s.consultations;
    } catch (e) { /* ignore */ }
  }

  async function loadLawyers() {
    try {
      const resp = await API.Lawyer.getAll();
      lawyers = (resp && resp.data) ? resp.data.map(function (x) {
        return {
          fullName: x.full_name || x.fullName || '',
          email: x.email || '',
          specialties: [x.specialty || ''],
          status: x.availability_status || 'unavailable'
        };
      }) : [];
      renderLawyers(lawyers);
    } catch (e) {
      renderLawyers([]);
    }
  }

  if (searchInput) searchInput.addEventListener('input', filterLawyers);
  loadStats();
  loadLawyers();
})();
