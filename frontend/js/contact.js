function toggleMenu() {
            const menu = document.getElementById('navbarMenu');
            const toggle = document.getElementById('navbarToggle');
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        }

        document.addEventListener('click', function(event) {
            const navbar = document.querySelector('.navbar');
            const menu = document.getElementById('navbarMenu');
            const toggle = document.getElementById('navbarToggle');
            if (!navbar.contains(event.target) && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        });

        document.querySelectorAll('.navbar-links a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    const menu = document.getElementById('navbarMenu');
                    const toggle = document.getElementById('navbarToggle');
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                const menu = document.getElementById('navbarMenu');
                const toggle = document.getElementById('navbarToggle');
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        });

        // Contact Form Submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });

        // Language Selector
        let currentLang = localStorage.getItem('language') || 'en';
        const translations = {
            en: {
                home: 'Home',
                services: 'Services',
                about: 'About',
                faq: 'FAQ',
                login: 'Login',
                signup: 'Sign Up',
                contactTitle: 'Contact Our Friendly Team',
                contactIntro: 'We\'re here to help! Get in touch with our team for any questions, support, or inquiries. We\'ll get back to you as soon as possible.',
                contactNameLabel: 'Your Name',
                contactNamePlaceholder: 'Enter your full name',
                contactEmailLabel: 'Email Address',
                contactEmailPlaceholder: 'Enter your email address',
                contactSubjectLabel: 'Subject',
                contactSubjectPlaceholder: 'What is this regarding?',
                contactMessageLabel: 'Message',
                contactMessagePlaceholder: 'Tell us how we can help you...',
                contactSubmitBtn: 'Send Message',
                contactInfoTitle: 'Get in Touch',
                contactInfoDesc: 'Our team is ready to assist you with any questions or concerns. Reach out through any of the following channels.',
                contactPhoneLabel: 'Phone',
                contactEmailLabel2: 'Email',
                contactLocationLabel: 'Location',
                contactHoursLabel: 'Business Hours',
                contactHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
                contactFollowUs: 'Follow Us'
            },
            ar: {
                home: 'الرئيسية',
                services: 'الخدمات',
                about: 'من نحن',
                faq: 'الأسئلة الشائعة',
                login: 'تسجيل الدخول',
                signup: 'إنشاء حساب',
                contactTitle: 'اتصل بفريقنا الودود',
                contactIntro: 'نحن هنا للمساعدة! تواصل مع فريقنا لأي أسئلة أو دعم أو استفسارات. سنعود إليك في أقرب وقت ممكن.',
                contactNameLabel: 'اسمك',
                contactNamePlaceholder: 'أدخل اسمك الكامل',
                contactEmailLabel: 'عنوان البريد الإلكتروني',
                contactEmailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
                contactSubjectLabel: 'الموضوع',
                contactSubjectPlaceholder: 'بم يتعلق هذا؟',
                contactMessageLabel: 'الرسالة',
                contactMessagePlaceholder: 'أخبرنا كيف يمكننا مساعدتك...',
                contactSubmitBtn: 'إرسال الرسالة',
                contactInfoTitle: 'تواصل معنا',
                contactInfoDesc: 'فريقنا جاهز لمساعدتك في أي أسئلة أو مخاوف. تواصل من خلال أي من القنوات التالية.',
                contactPhoneLabel: 'الهاتف',
                contactEmailLabel2: 'البريد الإلكتروني',
                contactLocationLabel: 'الموقع',
                contactHoursLabel: 'ساعات العمل',
                contactHours: 'الاثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً',
                contactFollowUs: 'تابعنا'
            }
        };

        function toggleLangMenu() {
            const dropdown = document.getElementById('langDropdown');
            dropdown.classList.toggle('active');
        }

        function changeLanguage(lang) {
            currentLang = lang;
            localStorage.setItem('language', lang);
            const html = document.getElementById('htmlLang');
            html.setAttribute('lang', lang);
            html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    element.textContent = translations[lang][key];
                }
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (translations[lang] && translations[lang][key]) {
                    element.placeholder = translations[lang][key];
                }
            });
            const langText = document.getElementById('langText');
            langText.textContent = lang === 'ar' ? 'العربية' : 'English';
            document.getElementById('langDropdown').classList.remove('active');
        }

        document.addEventListener('DOMContentLoaded', function() {
            changeLanguage(currentLang);
        });

        document.addEventListener('click', function(event) {
            const langSelector = document.querySelector('.language-selector');
            if (langSelector && !langSelector.contains(event.target)) {
                document.getElementById('langDropdown').classList.remove('active');
            }
        });