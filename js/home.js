function toggleMenu() {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.getElementById('navbarToggle');
    
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navbar = document.querySelector('.navbar');
    const menu = document.getElementById('navbarMenu');
    const toggle = document.getElementById('navbarToggle');
    
    if (navbar && !navbar.contains(event.target) && menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
    }
});

// Close menu when clicking a link (mobile)
document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            const menu = document.getElementById('navbarMenu');
            const toggle = document.getElementById('navbarToggle');
            if (menu) menu.classList.remove('active');
            if (toggle) toggle.classList.remove('active');
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const menu = document.getElementById('navbarMenu');
        const toggle = document.getElementById('navbarToggle');
        if (menu) menu.classList.remove('active');
        if (toggle) toggle.classList.remove('active');
    }
});

// Navbar scroll behavior
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 10) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// FAQ Accordion Functionality
function toggleFaq(element) {
    if (!element || !element.parentElement) return;
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const chevron = element.querySelector('.faq-chevron');
    if (!answer) return;
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const otherAnswer = item.querySelector('.faq-answer');
            const otherChevron = item.querySelector('.faq-chevron');
            if (otherAnswer) otherAnswer.style.maxHeight = '';
            if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
        }
    });

    // Toggle current item
    if (isActive) {
        faqItem.classList.remove('active');
        answer.style.maxHeight = '';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    } else {
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
}

// Smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Authentication and Navbar CTA update
function updateNavbarAuth() {
    const navbarCta = document.querySelector('.navbar-cta');
    if (!navbarCta) return;

    if (API.isLoggedIn()) {
        const user = API.getUser();
        const isAdmin = user && (user.role === 'admin' || user.role === 'Admin');
        const isLawyer = user && (user.role === 'lawyer' || user.role === 'Lawyer');
        
        let dashboardUrl = './index.html';
        if (isAdmin) dashboardUrl = './html/admin-dashboard.html';
        else if (isLawyer) dashboardUrl = './html/lawyer.html';
        else dashboardUrl = './html/profile.html';

        navbarCta.innerHTML = `
            <a href="${dashboardUrl}" class="btn-login">${window.I18N.get('myAccount')}</a>
            <button onclick="API.logout()" class="btn-signup" style="cursor:pointer; border:none; padding: 11px 28px;">${window.I18N.get('logout')}</button>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarAuth();
    
    // Listen for language changes to update auth buttons text
    window.addEventListener('languageChanged', updateNavbarAuth);
});

// Close language dropdown when clicking outside
document.addEventListener('click', (event) => {
    const langSelector = document.querySelector('.language-selector');
    if (langSelector && !langSelector.contains(event.target)) {
        const dropdown = document.getElementById('langDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
});
