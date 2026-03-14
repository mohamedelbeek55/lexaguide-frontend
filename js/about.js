function toggleMenu() {
            const menu = document.getElementById('navbarMenu');
            const toggle = document.getElementById('navbarToggle');
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        }

        document.addEventListener('click', function (event) {
            const navbar = document.querySelector('.navbar');
            const menu = document.getElementById('navbarMenu');
            const toggle = document.getElementById('navbarToggle');
            if (!navbar.contains(event.target) && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        });

        document.querySelectorAll('.navbar-links a').forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    const menu = document.getElementById('navbarMenu');
                    const toggle = document.getElementById('navbarToggle');
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                }
            });
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                const menu = document.getElementById('navbarMenu');
                const toggle = document.getElementById('navbarToggle');
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
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
                aboutTitle: 'About Us',
                aboutIntro: 'We combine decades of legal expertise with innovative AI-driven tools to deliver precise, reliable, and accessible legal guidance across the Middle East. Our team blends seasoned attorneys, technologists, and client success specialists who share a single mission: empower individuals and organizations with the knowledge and resources they need to make confident legal decisions.',
                aboutMissionTitle: 'Our Mission',
                aboutMissionDesc: 'To provide exceptional legal counsel and representation, ensuring justice and protecting the rights of our clients with integrity, professionalism, and dedication.',
                aboutVisionTitle: 'Our Vision',
                aboutVisionDesc: 'To be the leading legal platform recognized for excellence, innovation, and unwavering commitment to achieving the best outcomes for our clients.',
                aboutValuesTitle: 'Our Values',
                aboutValuesDesc: 'Integrity, transparency, excellence, and client-centered service guide everything we do. We uphold the highest ethical standards in all our legal practices.'
            },
            ar: {
                home: 'الرئيسية',
                services: 'الخدمات',
                about: 'من نحن',
                faq: 'الأسئلة الشائعة',
                login: 'تسجيل الدخول',
                signup: 'إنشاء حساب',
                aboutTitle: 'من نحن',
                aboutIntro: 'نجمع بين عقود من الخبرة القانونية وأدوات الذكاء الاصطناعي المبتكرة لتقديم إرشاد قانوني دقيق وموثوق وسهل الوصول في جميع أنحاء الشرق الأوسط. يجمع فريقنا بين المحامين ذوي الخبرة والتقنيين وأخصائي نجاح العملاء الذين يتشاركون مهمة واحدة: تمكين الأفراد والمنظمات بالمعرفة والموارد التي يحتاجونها لاتخاذ قرارات قانونية واثقة.',
                aboutMissionTitle: 'مهمتنا',
                aboutMissionDesc: 'تقديم استشارة قانونية وتمثيل استثنائيين، وضمان العدالة وحماية حقوق عملائنا بالنزاهة والاحترافية والتفاني.',
                aboutVisionTitle: 'رؤيتنا',
                aboutVisionDesc: 'أن نكون المنصة القانونية الرائدة المعترف بها للتميز والابتكار والالتزام الثابت بتحقيق أفضل النتائج لعملائنا.',
                aboutValuesTitle: 'قيمنا',
                aboutValuesDesc: 'النزاهة والشفافية والتميز والخدمة المتمحورة حول العميل توجه كل ما نقوم به. نحافظ على أعلى المعايير الأخلاقية في جميع ممارساتنا القانونية.'
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
            const langText = document.getElementById('langText');
            langText.textContent = lang === 'ar' ? 'العربية' : 'English';
            document.getElementById('langDropdown').classList.remove('active');
        }

        document.addEventListener('DOMContentLoaded', function () {
            changeLanguage(currentLang);
        });

        document.addEventListener('click', function (event) {
            const langSelector = document.querySelector('.language-selector');
            if (langSelector && !langSelector.contains(event.target)) {
                document.getElementById('langDropdown').classList.remove('active');
            }
        });