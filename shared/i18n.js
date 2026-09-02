(function () {
    'use strict';

    const translations = {
        en: {
            home: 'Home',
            services: 'Services',
            about: 'About',
            faq: 'FAQ',
            login: 'Login',
            signup: 'Sign Up',
            logout: 'Logout',
            dashboard: 'Dashboard',
            myAccount: 'My Account',
            profile: 'Profile',
            settings: 'Settings',
            
            // Hero
            heroKicker: 'AI-Powered Legal Excellence',
            heroTitle: 'We blend tradition with intelligent legal technology',
            heroTagline: 'LexaGuide delivers precise legal strategies, document automation, and expert guidance so you can move faster with total confidence.',
            heroStatPracticeAreas: 'Services',
            heroStatSupport: 'Guided Support',
            heroStatSatisfaction: 'Client Satisfaction',
            
            // Why Choose
            whyChooseTitle: 'Why Choose LexaGuide?',
            whyCard1Title: 'Expert Legal Team',
            whyCard1Text: 'Our experienced attorneys bring years of expertise and a proven track record of success in various areas of law.',
            whyCard2Title: 'Personalized Service',
            whyCard2Text: 'We understand that every case is unique. We provide tailored solutions that meet your specific needs and goals.',
            whyCard3Title: 'Proven Results',
            whyCard3Text: 'With a history of successful outcomes, we have built a reputation for achieving favorable results for our clients.',
            whyCard4Title: 'Clear Communication',
            whyCard4Text: 'We keep you informed every step of the way, ensuring you understand your options and the progress of your case.',
            
            // Services
            aiBadge: 'AI-Powered Legal Assistance',
            howHelpTitle1: 'How',
            howHelpTitle2: 'helps you',
            howHelpDescription: 'Experience legal expertise that outperforms 90% of lawyers across the Middle East. Our AI delivers exceptional legal guidance and document services with precision that surpasses most prestigious law firms in the region.',
            helpCard1Title: 'Legal Contracts & Document Procedures',
            helpCard1Text: 'Step-by-step guidance on issuing, authenticating, and managing legal contracts and required documents.',
            helpCard2Title: 'Document Generation',
            helpCard2Text: 'Create legal documents like contracts and agreements without the complicated language.',
            helpCard3Title: 'Contract Analysis',
            helpCard3Text: 'Have your contracts checked to make sure they\'re fair and protect your rights.',
            helpCard4Title: 'Chat Bot',
            helpCard4Text: 'Ask any questions and get simple, helpful answers.',
            helpCard5Title: 'Middle East Law Expert',
            helpCard5Text: 'Connecting users with lawyers (via chat or video) with a filtering/recommendation system to suggest the most suitable legal professionals.',
            
            // FAQ
            faqTitle1: 'Common',
            faqTitle2: 'Questions',
            faqSubtitle: 'Here are answers to questions people often ask about LexaGuide',
            faqQ1: 'What is LexaGuide?',
            faqA1: 'LexaGuide is an AI-powered legal assistance platform that provides expert legal guidance and document services.',
            faqQ2: 'How does it work?',
            faqA2: 'LexaGuide uses advanced AI to understand your legal questions and provide clear, simple answers.',
            
            // Auth
            loginTitle: 'Welcome Back',
            loginSubtitle: 'Sign in to your account to continue',
            emailLabel: 'E-mail Address',
            passwordLabel: 'Password',
            forgotPassword: 'Forgot password?',
            loginButton: 'LOGIN',
            signupTitle: 'Create Account',
            signupSubtitle: 'Join LexaGuide for intelligent legal support',
            fullNameLabel: 'Full Name',
            confirmPasswordLabel: 'Confirm Password',
            signupButton: 'SIGN UP',
            alreadyHaveAccount: 'Already have an account?',
            noAccount: 'Don\'t have an account?',
            
            // Profile
            changePhoto: 'Change Photo',
            memberSince: 'Member Since',
            editProfile: 'Edit Profile',
            bio: 'Bio / About Me',
            saveChanges: 'Save Changes',
            notifications: 'Notifications',
            markAllRead: 'Mark all as read',
            noNotifications: 'No new notifications',
            updateSuccess: 'Profile updated successfully!',
            avatarSuccess: 'Avatar updated successfully!',
            
            // Admin/Dashboard
            lawyers: 'Lawyers',
            users: 'Users',
            consultations: 'Consultations',
            documents: 'Documents',
            recentConsultations: 'Recent Consultations',
            recentActivity: 'Recent Activity',
            stats: 'Statistics',
            
            // Contact
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
            contactFollowUs: 'Follow Us',
            
            // Procedures
            proceduresTitle: 'Legal Procedures',
            searchPlaceholder: 'Search for procedures...',
            steps: 'Steps',
            requiredDocs: 'Required Documents',
            cost: 'Estimated Cost',
            time: 'Estimated Time',
            isOnline: 'Available Online',
            
            // Legal Procedures Page
            heroBadge: 'AI-Assisted Procedures • Human-Verified',
            heroText: 'Quickly find how to issue, authenticate, or renew your legal contracts with clear steps, required documents, official fees, and timelines.',
            searchButton: 'Find Procedure',
            searchHintPrefix: 'Example queries:',
            searchHintExamples: '“Real Estate Sale Contract”, “Work Visa Sponsorship”, “Commercial Agency License”',
            heroSnapshotTitle: 'Snapshot: Typical Contract Journey',
            heroStep1Title: 'Select contract category',
            heroStep1Text: 'Choose Real Estate, Labor, Commercial, or other specialized contracts.',
            heroStep2Title: 'Review requirements & fees',
            heroStep2Text: 'Confirm required documents, office locations, and official governmental fees.',
            heroStep3Title: 'Follow guided steps',
            heroStep3Text: 'Use digital or physical channels, with clear processing timelines.',
            heroNotice: 'Not legal advice • For informational use only',
            heroNoticeTag: 'Middle East–optimized',
            categoriesTitle: 'Contract Categories',
            categoriesSubtitle: 'Browse key legal contract families. Select one to focus the guide on typical requirements and procedures.',
            categoriesChip: 'Loading from database...',
            guideTitle: 'Issuance Guide — Step-by-Step',
            guideSubtitle: 'Follow a guided flow for issuing or authenticating a selected contract. Steps may vary by jurisdiction.',
            modeLabel: 'Mode:'
        },
        ar: {
            home: 'الرئيسية',
            services: 'الخدمات',
            about: 'من نحن',
            faq: 'الأسئلة الشائعة',
            login: 'تسجيل الدخول',
            signup: 'إنشاء حساب',
            logout: 'خروج',
            dashboard: 'لوحة التحكم',
            myAccount: 'حسابي',
            profile: 'الملف الشخصي',
            settings: 'الإعدادات',
            
            // Hero
            heroKicker: 'تميز قانوني مدعوم بالذكاء الاصطناعي',
            heroTitle: 'نمــزج بين الخبرة القانونية والتقنيات الذكية',
            heroTagline: 'تقدم لك LexaGuide استراتيجيات قانونية دقيقة، وأتمتة المستندات، وتوجيهات الخبراء حتى تتمكن من التحرك بشكل أسرع بثقة تامة.',
            heroStatPracticeAreas: 'خدمات',
            heroStatSupport: 'دعم موجه',
            heroStatSatisfaction: 'رضا العملاء',
            
            // Why Choose
            whyChooseTitle: 'لماذا تختار LexaGuide؟',
            whyCard1Title: 'فريق قانوني خبير',
            whyCard1Text: 'يجلب محامونا المتمرسون سنوات من الخبرة وسجلاً حافلاً من النجاح في مختلف مجالات القانون.',
            whyCard2Title: 'خدمة شخصية',
            whyCard2Text: 'نحن ندرك أن كل حالة فريدة من نوعها. نحن نقدم حلولاً مخصصة تلبي احتياجاتك وأهدافك المحددة.',
            whyCard3Title: 'نتائج مثبتة',
            whyCard3Text: 'مع تاريخ من النتائج الناجحة، بنينا سمعة طيبة في تحقيق نتائج إيجابية لعملائنا.',
            whyCard4Title: 'تواصل واضح',
            whyCard4Text: 'نطلعك على كل خطوة، ونضمن لك فهم خياراتك وسير قضيتك.',
            
            // Services
            aiBadge: 'مساعدة قانونية مدعومة بالذكاء الاصطناعي',
            howHelpTitle1: 'كيف',
            howHelpTitle2: 'تساعدك LexaGuide',
            howHelpDescription: 'اختبر خبرة قانونية تتفوق على 90% من المحامين في الشرق الأوسط. يقدم نظامنا ذكاءً قانونياً استثنائياً يتجاوز كبرى مكاتب المحاماة.',
            helpCard1Title: 'العقود والإجراءات القانونية',
            helpCard1Text: 'توجيه خطوة بخطوة حول إصدار وتوثيق وإدارة العقود القانونية والمستندات المطلوبة.',
            helpCard2Title: 'توليد المستندات',
            helpCard2Text: 'أنشئ مستندات قانونية مثل العقود والاتفاقيات دون لغة معقدة.',
            helpCard3Title: 'تحليل العقود',
            helpCard3Text: 'افحص عقودك للتأكد من عدالتها وحماية حقوقك.',
            helpCard4Title: 'المساعد الذكي (Chat Bot)',
            helpCard4Text: 'اطرح أي أسئلة واحصل على إجابات بسيطة ومفيدة.',
            helpCard5Title: 'خبير قانون الشرق الأوسط',
            helpCard5Text: 'ربط المستخدمين بالمحامين (عبر الشات أو الفيديو) مع نظام ترشيح لاختيار الأنسب.',
            
            // FAQ
            faqTitle1: 'الأسئلة',
            faqTitle2: 'الشائعة',
            faqSubtitle: 'هنا تجد إجابات على الأسئلة التي يطرحها الناس غالباً حول LexaGuide',
            faqQ1: 'ما هي LexaGuide؟',
            faqA1: 'LexaGuide هي منصة مساعدة قانونية مدعومة بالذكاء الاصطناعي توفر توجيهات قانونية وخدمات مستندات خبيرة.',
            faqQ2: 'كيف تعمل؟',
            faqA2: 'تستخدم LexaGuide ذكاءً اصطناعياً متقدماً لفهم أسئلتك القانونية وتقديم إجابات واضحة وبسيطة.',
            
            // Auth
            loginTitle: 'مرحباً بعودتك',
            loginSubtitle: 'سجل الدخول إلى حسابك للمتابعة',
            emailLabel: 'البريد الإلكتروني',
            passwordLabel: 'كلمة المرور',
            forgotPassword: 'نسيت كلمة المرور؟',
            loginButton: 'دخول',
            signupTitle: 'إنشاء حساب',
            signupSubtitle: 'انضم إلى LexaGuide للحصول على دعم قانوني ذكي',
            fullNameLabel: 'الاسم الكامل',
            confirmPasswordLabel: 'تأكيد كلمة المرور',
            signupButton: 'إنشاء حساب',
            alreadyHaveAccount: 'لديك حساب بالفعل؟',
            noAccount: 'ليس لديك حساب؟',
            
            // Profile
            changePhoto: 'تغيير الصورة',
            memberSince: 'عضو منذ',
            editProfile: 'تعديل الملف الشخصي',
            bio: 'نبذة عني',
            saveChanges: 'حفظ التعديلات',
            notifications: 'التنبيهات',
            markAllRead: 'تحديد الكل كمقروء',
            noNotifications: 'لا توجد تنبيهات جديدة',
            updateSuccess: 'تم تحديث الملف الشخصي بنجاح!',
            avatarSuccess: 'تم تحديث الصورة الشخصية بنجاح!',
            
            // Admin/Dashboard
            lawyers: 'المحامون',
            users: 'المستخدمون',
            consultations: 'الاستشارات',
            documents: 'المستندات',
            recentConsultations: 'آخر الاستشارات',
            recentActivity: 'النشاط الأخير',
            stats: 'الإحصائيات',
            
            // Contact
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
            contactFollowUs: 'تابعنا',
            
            // Procedures
            proceduresTitle: 'الإجراءات القانونية',
            searchPlaceholder: 'ابحث عن الإجراءات...',
            steps: 'الخطوات',
            requiredDocs: 'المستندات المطلوبة',
            cost: 'التكلفة التقديرية',
            time: 'الوقت التقديري',
            isOnline: 'متاح أونلاين',
            
            // Legal Procedures Page
            heroBadge: 'إجراءات مدعومة بالذكاء الاصطناعي • موثقة بشرياً',
            heroText: 'اكتشف بسرعة كيفية إصدار أو توثيق أو تجديد عقودك القانونية بخطوات واضحة، والمستندات المطلوبة، والرسوم الرسمية، والجداول الزمنية.',
            searchButton: 'ابحث عن الإجراء',
            searchHintPrefix: 'أمثلة للبحث:',
            searchHintExamples: '“عقد بيع عقار”، “كفالة تأشيرة عمل”، “ترخيص وكالة تجارية”',
            heroSnapshotTitle: 'لمحة: رحلة العقد المعتادة',
            heroStep1Title: 'اختر فئة العقد',
            heroStep1Text: 'اختر العقارات، العمل، العقود التجارية، أو غيرها من العقود المتخصصة.',
            heroStep2Title: 'راجع المتطلبات والرسوم',
            heroStep2Text: 'تأكد من المستندات المطلوبة، ومواقع المكاتب، والرسوم الحكومية الرسمية.',
            heroStep3Title: 'اتبع الخطوات الموجهة',
            heroStep3Text: 'استخدم القنوات الرقمية أو الفعلية، مع جداول زمنية واضحة للمعالجة.',
            heroNotice: 'ليست استشارة قانونية • للاستخدام المعلوماتي فقط',
            heroNoticeTag: 'محسن للشرق الأوسط',
            categoriesTitle: 'فئات العقود',
            categoriesSubtitle: 'تصفح عائلات العقود القانونية الرئيسية. اختر واحدة لتركيز الدليل على المتطلبات والإجراءات النموذجية.',
            categoriesChip: 'جاري التحميل من قاعدة البيانات...',
            guideTitle: 'دليل الإصدار — خطوة بخطوة',
            guideSubtitle: 'اتبع تدفقاً موجهاً لإصدار أو توثيق عقد مختار. قد تختلف الخطوات حسب الاختصاص القضائي.',
            modeLabel: 'الوضع:'
        }
    };

    function applyTranslations() {
        const lang = localStorage.getItem('language') || 'en';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
        
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        document.body.style.fontFamily = lang === 'ar' ? "'Cairo', sans-serif" : "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        
        const htmlLang = document.getElementById('htmlLang');
        if (htmlLang) {
            htmlLang.dir = lang === 'ar' ? 'rtl' : 'ltr';
            htmlLang.lang = lang;
        }

        const langText = document.getElementById('langText');
        if (langText) {
            langText.textContent = lang === 'en' ? 'English' : 'العربية';
        }
    }

    window.changeLanguage = function(lang) {
        localStorage.setItem('language', lang);
        applyTranslations();
        const dropdown = document.getElementById('langDropdown');
        if (dropdown) dropdown.classList.remove('active');
        
        // Custom event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    };

    window.toggleLangMenu = function() {
        const dropdown = document.getElementById('langDropdown');
        if (dropdown) dropdown.classList.toggle('active');
    };

    // Initial apply
    document.addEventListener('DOMContentLoaded', applyTranslations);
    
    // Export globally
    window.I18N = {
        translations,
        apply: applyTranslations,
        get: (key) => {
            const lang = localStorage.getItem('language') || 'en';
            return translations[lang][key] || key;
        }
    };
})();
