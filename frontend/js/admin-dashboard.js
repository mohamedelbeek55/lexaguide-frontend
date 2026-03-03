(function () {
  'use strict';

  // Mock data: 6 sample lawyers
  let lawyers = [
    { id: 1, fullName: 'Sarah Mitchell', email: 'sarah.mitchell@lawfirm.com', phone: '+1 555-0101', specialization: 'Corporate Law', yearsExperience: 12, role: 'Admin', status: 'Active' },
    { id: 2, fullName: 'James Chen', email: 'james.chen@lawfirm.com', phone: '+1 555-0102', specialization: 'Criminal Defense', yearsExperience: 8, role: 'Lawyer', status: 'Active' },
    { id: 3, fullName: 'Emily Rodriguez', email: 'emily.rodriguez@lawfirm.com', phone: '+1 555-0103', specialization: 'Family Law', yearsExperience: 6, role: 'Lawyer', status: 'Active' },
    { id: 4, fullName: 'David Thompson', email: 'david.thompson@lawfirm.com', phone: '+1 555-0104', specialization: 'Immigration', yearsExperience: 15, role: 'Lawyer', status: 'Inactive' },
    { id: 5, fullName: 'Rachel Kim', email: 'rachel.kim@lawfirm.com', phone: '+1 555-0105', specialization: 'Intellectual Property', yearsExperience: 10, role: 'Lawyer', status: 'Active' },
    { id: 6, fullName: 'Michael Foster', email: 'michael.foster@lawfirm.com', phone: '+1 555-0106', specialization: 'Real Estate', yearsExperience: 7, role: 'Admin', status: 'Inactive' }
  ];

  let nextId = 7;

  const tableBody = document.getElementById('lawyersTableBody');
  const searchInput = document.getElementById('searchLawyers');
  const modal = document.getElementById('lawyerModal');
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('lawyerForm');
  const lawyerIdInput = document.getElementById('lawyerId');
  const addLawyerBtn = document.getElementById('addLawyerBtn');
  const closeModalBtn = document.getElementById('closeModal');
  const cancelModalBtn = document.getElementById('cancelModal');

  const requiredFields = [
    'fullName', 'email', 'phone', 'specialization', 'yearsExperience', 'role', 'status'
  ];

  function getRoleBadgeClass(role) {
    return role === 'Admin' ? 'badge-role-admin' : 'badge-role-lawyer';
  }

  function getStatusBadgeClass(status) {
    return status === 'Active' ? 'badge-status-active' : 'badge-status-inactive';
  }

  function renderLawyers(data) {
    tableBody.innerHTML = '';
    if (data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;">No lawyers match your search.</td></tr>';
      return;
    }
    data.forEach(function (lawyer) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', lawyer.id);
      tr.innerHTML =
        '<td>' + escapeHtml(lawyer.fullName) + '</td>' +
        '<td>' + escapeHtml(lawyer.email) + '</td>' +
        '<td>' + escapeHtml(lawyer.specialization) + '</td>' +
        '<td><span class="badge ' + getRoleBadgeClass(lawyer.role) + '">' + escapeHtml(lawyer.role) + '</span></td>' +
        '<td><span class="badge ' + getStatusBadgeClass(lawyer.status) + '">' + escapeHtml(lawyer.status) + '</span></td>' +
        '<td class="actions-cell">' +
        '<button type="button" class="btn btn-edit" data-action="edit" data-id="' + lawyer.id + '">Edit</button>' +
        '<button type="button" class="btn btn-delete" data-action="delete" data-id="' + lawyer.id + '">Delete</button>' +
        '</td>';
      tableBody.appendChild(tr);
    });
    bindRowActions();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function bindRowActions() {
    tableBody.querySelectorAll('[data-action="edit"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModalForEdit(parseInt(btn.getAttribute('data-id'), 10));
      });
    });
    tableBody.querySelectorAll('[data-action="delete"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        deleteLawyer(parseInt(btn.getAttribute('data-id'), 10));
      });
    });
  }

  function filterLawyers() {
    const query = (searchInput.value || '').trim().toLowerCase();
    if (!query) {
      renderLawyers(lawyers);
      return;
    }
    const filtered = lawyers.filter(function (l) {
      return l.fullName.toLowerCase().indexOf(query) !== -1 ||
             l.specialization.toLowerCase().indexOf(query) !== -1;
    });
    renderLawyers(filtered);
  }

  function openModal(isEdit, lawyer) {
    modal.setAttribute('aria-hidden', 'false');
    modalTitle.textContent = isEdit ? 'Edit Lawyer' : 'Add Lawyer';
    lawyerIdInput.value = isEdit ? lawyer.id : '';
    document.getElementById('fullName').value = isEdit ? lawyer.fullName : '';
    document.getElementById('email').value = isEdit ? lawyer.email : '';
    document.getElementById('phone').value = isEdit ? lawyer.phone : '';
    document.getElementById('specialization').value = isEdit ? lawyer.specialization : '';
    document.getElementById('yearsExperience').value = isEdit ? lawyer.yearsExperience : '';
    document.getElementById('role').value = isEdit ? lawyer.role : 'Lawyer';
    document.getElementById('status').value = isEdit ? lawyer.status : 'Active';
    clearValidationErrors();
  }

  function closeModalFn() {
    modal.setAttribute('aria-hidden', 'true');
    form.reset();
    lawyerIdInput.value = '';
    clearValidationErrors();
  }

  function clearValidationErrors() {
    requiredFields.forEach(function (name) {
      const el = document.getElementById(name);
      const err = document.getElementById(name + 'Error');
      if (el) el.classList.remove('invalid');
      if (err) err.textContent = '';
    });
  }

  function showFieldError(fieldName, message) {
    const el = document.getElementById(fieldName);
    const err = document.getElementById(fieldName + 'Error');
    if (el) el.classList.add('invalid');
    if (err) err.textContent = message;
  }

  function validateForm() {
    var valid = true;
    clearValidationErrors();
    var fullName = (document.getElementById('fullName').value || '').trim();
    var email = (document.getElementById('email').value || '').trim();
    var phone = (document.getElementById('phone').value || '').trim();
    var specialization = (document.getElementById('specialization').value || '').trim();
    var yearsExperience = document.getElementById('yearsExperience').value;
    var role = document.getElementById('role').value;
    var status = document.getElementById('status').value;

    if (!fullName) { showFieldError('fullName', 'Full name is required.'); valid = false; }
    if (!email) { showFieldError('email', 'Email is required.'); valid = false; }
    if (!phone) { showFieldError('phone', 'Phone is required.'); valid = false; }
    if (!specialization) { showFieldError('specialization', 'Specialization is required.'); valid = false; }
    if (yearsExperience === '' || yearsExperience === null) { showFieldError('yearsExperience', 'Years of experience is required.'); valid = false; }
    if (!role) { showFieldError('role', 'Role is required.'); valid = false; }
    if (!status) { showFieldError('status', 'Status is required.'); valid = false; }

    return valid;
  }

  function openModalForAdd() {
    openModal(false, null);
  }

  function openModalForEdit(id) {
    var lawyer = lawyers.find(function (l) { return l.id === id; });
    if (lawyer) openModal(true, lawyer);
  }

  function saveLawyer(formData) {
    var id = lawyerIdInput.value ? parseInt(lawyerIdInput.value, 10) : null;
    var payload = {
      fullName: (formData.fullName || '').trim(),
      email: (formData.email || '').trim(),
      phone: (formData.phone || '').trim(),
      specialization: (formData.specialization || '').trim(),
      yearsExperience: parseInt(formData.yearsExperience, 10),
      role: formData.role,
      status: formData.status
    };

    if (id) {
      var index = lawyers.findIndex(function (l) { return l.id === id; });
      if (index !== -1) {
        lawyers[index] = Object.assign({ id: id }, payload);
      }
    } else {
      payload.id = nextId++;
      lawyers.push(payload);
    }
    filterLawyers();
    closeModalFn();
  }

  function deleteLawyer(id) {
    var lawyer = lawyers.find(function (l) { return l.id === id; });
    var name = lawyer ? lawyer.fullName : 'this lawyer';
    if (!window.confirm('Are you sure you want to delete ' + name + '? This cannot be undone.')) {
      return;
    }
    lawyers = lawyers.filter(function (l) { return l.id !== id; });
    filterLawyers();
  }

  addLawyerBtn.addEventListener('click', openModalForAdd);
  closeModalBtn.addEventListener('click', closeModalFn);
  cancelModalBtn.addEventListener('click', closeModalFn);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModalFn();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModalFn();
    }
  });

  searchInput.addEventListener('input', filterLawyers);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;
    var fd = new FormData(form);
    saveLawyer({
      fullName: fd.get('fullName'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      specialization: fd.get('specialization'),
      yearsExperience: fd.get('yearsExperience'),
      role: fd.get('role'),
      status: fd.get('status')
    });
  });

  // Initial render
  renderLawyers(lawyers);
})();
