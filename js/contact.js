(function() {
    'use strict';

    function toggleMenu() {
        const menu = document.getElementById('navbarMenu');
        const toggle = document.getElementById('navbarToggle');
        if (menu && toggle) {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        }
    }
    window.toggleMenu = toggleMenu;

    document.addEventListener('DOMContentLoaded', function() {
        // Contact Form Submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const subject = document.getElementById('subject').value.trim();
                const message = document.getElementById('message').value.trim();

                const isAr = localStorage.getItem('language') === 'ar';

                if (!name || !email || !subject || !message) {
                    API.UI.toast(isAr ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields', 'error');
                    return;
                }

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    API.UI.toast(isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address', 'error');
                    return;
                }

                const btn = contactForm.querySelector('button[type="submit"]');
                const restore = API.UI.setLoading(btn, isAr ? 'جاري الإرسال...' : 'Sending...');

                API.Contact.submit({ name, email, subject, message })
                    .then(() => {
                        API.UI.toast(isAr ? 'شكراً لرسالتك! سنرد عليك قريباً.' : 'Thank you for your message! We will get back to you soon.', 'success');
                        contactForm.reset();
                    })
                    .catch(err => {
                        API.UI.toast(err.message || (isAr ? 'فشل الإرسال' : 'Failed to send message'), 'error');
                    })
                    .finally(() => {
                        restore();
                    });
            });
        }

        // Close menu on click outside
        document.addEventListener('click', function(event) {
            const navbar = document.querySelector('.navbar');
            const menu = document.getElementById('navbarMenu');
            const toggle = document.getElementById('navbarToggle');
            if (navbar && menu && toggle && !navbar.contains(event.target) && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        });

        // Close menu on link click
        document.querySelectorAll('.navbar-links a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    const menu = document.getElementById('navbarMenu');
                    const toggle = document.getElementById('navbarToggle');
                    if (menu && toggle) {
                        menu.classList.remove('active');
                        toggle.classList.remove('active');
                    }
                }
            });
        });
    });
})();
