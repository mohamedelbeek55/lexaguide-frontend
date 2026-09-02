(function () {
    'use strict';

    // Auth Guard
    if (!API.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Authentication and Navbar CTA update
    function updateNavbarAuth() {
        const navbarCta = document.getElementById('navbarCta');
        if (!navbarCta) return;

        if (API.isLoggedIn()) {
            const user = API.getUser();
            const isAdmin = user && (user.role === 'admin' || user.role === 'Admin');
            const isLawyer = user && (user.role === 'lawyer' || user.role === 'Lawyer');
            
            let dashboardUrl = '../index.html';
            if (isAdmin) dashboardUrl = './admin-dashboard.html';
            else if (isLawyer) dashboardUrl = './lawyer.html';

            navbarCta.innerHTML = `
                <a href="${dashboardUrl}" class="btn-login">${window.I18N.get('myAccount')}</a>
                <button onclick="API.logout()" class="btn-signup" style="cursor:pointer; border:none; padding: 10px 20px;">${window.I18N.get('logout')}</button>
            `;
        }
    }

    // Dynamic Rendering based on Role
    function renderDynamicContent(data) {
        const statsSection = document.getElementById('statsSection');
        const dynamicLists = document.getElementById('dynamicLists');
        if (!statsSection || !dynamicLists) return;

        const { user, stats, consultations, documents } = data;
        const role = user.role.toLowerCase();
        
        // 1. Render Stats
        let statsHTML = '';
        if (role === 'lawyer') {
            statsHTML = `
                <div class="stat-item">
                    <span class="stat-val">${stats.ratingAvg}/5</span>
                    <span class="stat-lbl">${window.I18N.get('rating')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-val">${stats.successRate}%</span>
                    <span class="stat-lbl">${window.I18N.get('successRate')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-val">${stats.totalConsultations}</span>
                    <span class="stat-lbl">${window.I18N.get('consultations')}</span>
                </div>
            `;
        } else {
            statsHTML = `
                <div class="stat-item">
                    <span class="stat-val">${stats.totalConsultations || 0}</span>
                    <span class="stat-lbl">${window.I18N.get('consultations')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-val">${stats.totalDocuments || 0}</span>
                    <span class="stat-lbl">${window.I18N.get('documents')}</span>
                </div>
            `;
        }
        statsSection.innerHTML = statsHTML;

        // 2. Render Lists
        let listsHTML = '';

        // Consultations List
        if (consultations && consultations.length > 0) {
            const listTitle = role === 'lawyer' ? window.I18N.get('upcomingConsultations') : window.I18N.get('myConsultations');
            listsHTML += `
                <div class="profile-card list-section">
                    <div class="list-header">
                        <h3 class="list-title">${listTitle}</h3>
                        <a href="${role === 'lawyer' ? 'lawyer.html' : 'user-consultations.html'}" style="color: #888; font-size: 0.8rem; text-decoration: none;">${window.I18N.get('viewAll')}</a>
                    </div>
                    <div class="data-list">
                        ${consultations.map(c => {
                            const partnerName = role === 'lawyer' ? (c.userId?.fullName || 'Client') : (c.lawyerId?.fullName || 'Lawyer');
                            const date = c.scheduledAt ? new Date(c.scheduledAt).toLocaleDateString() : new Date(c.createdAt).toLocaleDateString();
                            const dashboardUrl = role === 'lawyer' ? 'lawyer.html' : 'user-consultations.html';
                            return `
                                <div class="data-item" onclick="window.location.href='${dashboardUrl}'" style="cursor: pointer;">
                                    <div class="data-main">
                                        <span class="data-title">${partnerName}</span>
                                        <span class="data-sub">${c.type} • ${date}</span>
                                    </div>
                                    <span class="data-status status-${c.status.toLowerCase()}">${c.status}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        // Documents List (Only for Users/Admins)
        if (role !== 'lawyer' && documents && documents.length > 0) {
            listsHTML += `
                <div class="profile-card list-section">
                    <div class="list-header">
                        <h3 class="list-title">${window.I18N.get('myDocuments')}</h3>
                        <a href="generate-document.html" style="color: #888; font-size: 0.8rem; text-decoration: none;">${window.I18N.get('viewAll')}</a>
                    </div>
                    <div class="data-list">
                        ${documents.map(d => `
                            <div class="data-item">
                                <div class="data-main">
                                    <span class="data-title">${d.templateTitle}</span>
                                    <span class="data-sub">${new Date(d.createdAt).toLocaleDateString()}</span>
                                </div>
                                <button onclick="window.location.href='generate-document.html?id=${d._id}'" class="btn-upload" style="padding: 4px 12px; font-size: 0.75rem;">View</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        dynamicLists.innerHTML = listsHTML;
    }

    // Profile Logic
    async function loadProfile() {
        try {
            const resp = await API.Profile.get();
            const user = resp.user;
            const lang = localStorage.getItem('language') || 'en';
            
            // Display Info
            document.getElementById('displayFullName').textContent = user.fullName;
            document.getElementById('displayEmail').textContent = user.email;
            document.getElementById('displayRole').textContent = user.role;
            document.getElementById('displayDate').textContent = new Date(user.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long' });
            
            // Initials or Avatar
            const initialsEl = document.getElementById('initials');
            const avatarContainer = document.getElementById('profileAvatarLg');
            if (user.avatarUrl) {
                avatarContainer.innerHTML = `<img src="${user.avatarUrl}" alt="Avatar">`;
            } else {
                const names = user.fullName.split(' ');
                const initials = names.length >= 2 ? (names[0][0] + names[names.length-1][0]) : user.fullName.slice(0,2);
                initialsEl.textContent = initials.toUpperCase();
            }

            // Fill Form
            document.getElementById('inputFullName').value = user.fullName;
            document.getElementById('inputPhone').value = user.phone || '';
            document.getElementById('inputBio').value = user.bio || '';

            // Render Dynamic Stats & Lists
            renderDynamicContent(resp);

        } catch (err) {
            console.error("Failed to load profile:", err);
            API.UI.toast("Failed to load profile data", "error");
        }
    }

    async function handleUpdateProfile(e) {
        e.preventDefault();
        const btn = document.getElementById('saveBtn');
        const restore = API.UI.setLoading(btn, window.I18N.get('saveChanges') + '...');

        const payload = {
            fullName: document.getElementById('inputFullName').value,
            phone: document.getElementById('inputPhone').value,
            bio: document.getElementById('inputBio').value
        };

        try {
            await API.Profile.update(payload);
            API.UI.toast(window.I18N.get('updateSuccess'), "success");
            loadProfile(); // Refresh view
        } catch (err) {
            API.UI.toast(err.message, "error");
        } finally {
            restore();
        }
    }

    async function handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            API.UI.toast(window.I18N.get('changePhoto') + '...', "info");
            await API.Profile.uploadAvatar(file);
            API.UI.toast(window.I18N.get('avatarSuccess'), "success");
            loadProfile();
        } catch (err) {
            API.UI.toast(err.message, "error");
        }
    }

    async function loadNotifications() {
        try {
            const resp = await API.Profile.getNotifications();
            const list = document.getElementById('notificationsList');
            const items = resp.notifications || [];

            if (items.length === 0) {
                list.innerHTML = `<p style="color: #666; text-align: center; padding: 2rem;">${window.I18N.get('noNotifications')}</p>`;
                return;
            }

            list.innerHTML = items.map(n => `
                <div class="notification-item ${n.isRead ? '' : 'unread'}">
                    ${n.isRead ? '' : '<div class="notification-dot"></div>'}
                    <div class="notification-content">
                        <div style="color: #fff; font-size: 0.95rem;">${n.message}</div>
                        <div class="notification-time">${new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                </div>
            `).join('');

        } catch (err) {
            console.error("Failed to load notifications:", err);
        }
    }

    window.markAllRead = async function() {
        try {
            await API.Profile.markNotificationsRead();
            loadNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        updateNavbarAuth();
        loadProfile();
        loadNotifications();
        
        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            updateNavbarAuth();
            loadProfile();
            loadNotifications();
        });

        const form = document.getElementById('editProfileForm');
        if (form) form.addEventListener('submit', handleUpdateProfile);
        
        const avatarInput = document.getElementById('avatarInput');
        if (avatarInput) avatarInput.addEventListener('change', handleAvatarUpload);
    });

})();
