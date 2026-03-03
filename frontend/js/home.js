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
    
    if (!navbar.contains(event.target) && menu.classList.contains('active')) {
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
            menu.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const menu = document.getElementById('navbarMenu');
        const toggle = document.getElementById('navbarToggle');
        menu.classList.remove('active');
        toggle.classList.remove('active');
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
        heroKicker: 'AI-Powered Legal Excellence',
        heroTitle: 'We blend tradition with intelligent legal technology',
        heroTagline: 'Your journey to excellence starts here',
        heroStatPracticeAreas: 'Services',
        heroStatSupport: 'Guided Support',
        heroStatSatisfaction: 'Client Satisfaction',
        whyChooseTitle: 'Why Choose Counsel?',
        whyCard1Title: 'Expert Legal Team',
        whyCard1Text: 'Our experienced attorneys bring years of expertise and a proven track record of success in various areas of law.',
        whyCard2Title: 'Personalized Service',
        whyCard2Text: 'We understand that every case is unique. We provide tailored solutions that meet your specific needs and goals.',
        whyCard3Title: 'Proven Results',
        whyCard3Text: 'With a history of successful outcomes, we have built a reputation for achieving favorable results for our clients.',
        whyCard4Title: 'Clear Communication',
        whyCard4Text: 'We keep you informed every step of the way, ensuring you understand your options and the progress of your case.',
        aiBadge: 'AI-Powered Legal Assistance',
        howHelpTitle1: 'How',
        howHelpTitle2: 'helps you',
        howHelpDescription: 'Experience legal expertise that outperforms 90% of lawyers across the Middle East. Our AI delivers exceptional legal guidance and document services with precision that surpasses most prestigious law firms in the region.',
        helpCard1Title: 'Legal Contracts & Document Procedures',
        helpCard1Text: 'Get legal advice in clear, simple language that anyone can understand.',
        helpCard2Title: 'Document Generation',
        helpCard2Text: 'Create legal documents like contracts and agreement .',
        helpCard3Title: 'Contract Analysis',
        helpCard3Text: 'Have your contracts checked to make sure they\'re fair and protect your rights.',
        helpCard4Title: 'Chat Bot',
        helpCard4Text: 'Ask any questions and get simple, helpful answers .',
        helpCard5Title: 'Middle East Law Expert',
        helpCard5Text: 'Connecting users with lawyers (via chat or video) with a filtering/recommendation system to suggest the most suitable legal professionals.',
        helpCard6Title: 'Case Management & Legal Assistant Tools',
        helpCard6Text: 'Organize cases, perform advanced legal research, and generate winning strategies with our powerful suite of tools.',
        faqTitle1: 'Common',
        faqTitle2: 'Questions',
        faqSubtitle: 'Here are answers to questions people often ask about LexaGuide',
        faqCta1: 'Have another question?',
        faqCta2: 'Contact our friendly team',
        faqQ1: 'What is LexaGuide?',
        faqA1: 'LexaGuide is an AI-powered legal assistance platform that provides expert legal guidance and document services. Our system delivers exceptional legal expertise that outperforms 90% of lawyers across the Middle East.',
        faqQ2: 'How does LexaGuide work?',
        faqA2: 'LexaGuide uses advanced AI technology to understand your legal questions and provide clear, simple answers. You can ask questions in everyday language, create legal documents, check contracts, and get advice specific to Middle East laws.',
        faqQ3: 'Is LexaGuide\'s advice reliable?',
        faqA3: 'Yes, our AI system is trained on extensive legal data and delivers advice with precision that surpasses most prestigious law firms in the region. However, for complex legal matters, we recommend consulting with a qualified attorney.',
        faqQ4: 'Can I cancel my subscription anytime?',
        faqA4: 'Absolutely! You can cancel your subscription at any time without any penalties. Your access will continue until the end of your current billing period.',
        faqQ5: 'Is my information kept private?',
        faqA5: 'Yes, we take your privacy seriously. All your information is encrypted and kept confidential. We follow strict data protection protocols to ensure your legal information remains secure and private.',
        faqQ6: 'Do I need to know legal terms to use LexaGuide?',
        faqA6: 'Not at all! LexaGuide is designed to be user-friendly. You can ask questions in everyday language, and we\'ll provide answers in clear, simple terms that anyone can understand. No legal knowledge required.',
        footerDescription: 'Providing exceptional legal counsel and representation with integrity, professionalism, and dedication to achieving the best outcomes for our clients.',
        footerQuickLinksTitle: 'Quick Links',
        footerLinkHome: 'Home',
        footerLinkAbout: 'About',
        footerLinkServices: 'Services',
        footerLinkContact: 'FAQ',
        footerLinkLogin: 'Login',
        footerServicesTitle: 'Services',
        footerService1: 'Contract Analysis',
        footerService2: 'Document Generation',
        footerService3: 'Chat Bot',
        footerService4: 'Law Experts',
        footerService5: 'Case Management',
        footerContactTitle: 'Contact Info',
        footerAddress: '123 Legal Street, City, State 12345',
        footerPhone: '+1 (555) 123-4567',
        footerEmail: 'info@counsel.com',
        footerHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
        footerAppsTitle: 'Download Our App',
        footerAppStoreLabel: 'Download on the',
        footerAppStoreName: 'App Store',
        footerGooglePlayLabel: 'Get it on',
        footerGooglePlayName: 'Google Play',
        footerCopyright: '© 2026 Counsel. All rights reserved.',
        footerPrivacy: 'Privacy Policy',
        footerTerms: 'Terms of Service',
        footerCookies: 'Cookie Policy'
    },
    ar: {
        home: 'الرئيسية',
        services: 'الخدمات',
        about: 'من نحن',
        faq: 'الأسئلة الشائعة',
        login: 'تسجيل الدخول',
        signup: 'إنشاء حساب',
        heroKicker: 'تميز قانوني مدعوم بالذكاء الاصطناعي',
        heroTitle: 'نمــزج بين الخبرة القانونية والتقنيات الذكية',
        heroTagline: 'رحلتك نحو التميز تبدأ من هنا',
        heroStatPracticeAreas: 'خدمات',
        heroStatSupport: 'دعم إرشادي على مدار الساعة',
        heroStatSatisfaction: 'رضا العملاء',
        whyChooseTitle: 'لماذا تختارنا؟',
        whyCard1Title: 'فريق قانوني خبير',
        whyCard1Text: 'يضم فريقنا محامين ذوي خبرة طويلة وسجل حافل بالنجاحات في مختلف المجالات القانونية.',
        whyCard2Title: 'خدمة مخصصة لك',
        whyCard2Text: 'ندرك أن كل قضية مختلفة. نقدم حلولاً قانونية مصممة لتناسب احتياجاتك وأهدافك.',
        whyCard3Title: 'نتائج مثبتة',
        whyCard3Text: 'بفضل تاريخ طويل من النجاحات، بنينا سمعة قائمة على تحقيق أفضل النتائج لعملائنا.',
        whyCard4Title: 'تواصل واضح وشفاف',
        whyCard4Text: 'نبقيك على اطلاع في كل خطوة، ونوضح لك خياراتك وتقدم قضيتك بلغة بسيطة.',
        aiBadge: 'مساعدة قانونية مدعومة بالذكاء الاصطناعي',
        howHelpTitle1: 'كيف',
        howHelpTitle2: 'يساعدك',
        howHelpDescription: 'استمتع بخبرة قانونية تفوق 90% من المحامين في جميع أنحاء الشرق الأوسط. يقدم ذكاؤنا الاصطناعي إرشادات قانونية استثنائية وخدمات وثائق بدقة تفوق معظم مكاتب المحاماة المرموقة في المنطقة.',
        helpCard1Title: 'استشارات قانونية مبسطة',
        helpCard1Text: 'احصل على استشارات قانونية بلغة واضحة وبسيطة يمكن لأي شخص فهمها.',
        helpCard2Title: 'مساعد المستندات',
        helpCard2Text: 'أنشئ عقوداً واتفاقيات قانونية بدون تعقيد أو مصطلحات صعبة.',
        helpCard3Title: 'مراجعة العقود',
        helpCard3Text: 'تحقق من عقودك للتأكد من عدالتها وحماية حقوقك بالكامل.',
        helpCard4Title: 'محادثة ودية',
        helpCard4Text: 'اطرح أسئلتك بلغة الحياة اليومية واحصل على إجابات واضحة ومفيدة.',
        helpCard5Title: 'خبير في قوانين الشرق الأوسط',
        helpCard5Text: 'احصل على نصائح متوافقة مع القوانين المحلية في دول الشرق الأوسط المختلفة.',
        helpCard6Title: 'إدارة القضايا وأدوات المساعدة القانونية',
        helpCard6Text: 'نظم القضايا، وأنجز أبحاثاً قانونية متقدمة، وضع استراتيجيات رابحة عبر مجموعة أدوات قوية.',
        faqTitle1: 'الأسئلة',
        faqTitle2: 'الشائعة',
        faqSubtitle: 'إليك إجابات على الأسئلة التي يطرحها الناس غالبًا حول Untitled',
        faqCta1: 'هل لديك سؤال آخر؟',
        faqCta2: 'تواصل مع فريقنا الودود',
        faqQ1: 'ما هو Untitled؟',
        faqA1: 'Untitled هو منصة مساعدة قانونية مدعومة بالذكاء الاصطناعي توفر إرشادات قانونية احترافية وخدمات إعداد المستندات بدقة تفوق 90% من المحامين في الشرق الأوسط.',
        faqQ2: 'كيف يعمل Untitled؟',
        faqA2: 'يستخدم Untitled تقنيات ذكاء اصطناعي متقدمة لفهم أسئلتك القانونية وتقديم إجابات واضحة وبسيطة. يمكنك طرح الأسئلة بلغة الحياة اليومية، وإنشاء مستندات قانونية، ومراجعة العقود، والحصول على نصائح متوافقة مع قوانين الشرق الأوسط.',
        faqQ3: 'هل نصائح Untitled موثوقة؟',
        faqA3: 'نعم، يعتمد نظامنا على بيانات قانونية واسعة ويقدم إجابات دقيقة تتفوق على أداء معظم مكاتب المحاماة المرموقة في المنطقة. ومع ذلك، ننصح بالاستعانة بمحامٍ مختص في القضايا المعقدة.',
        faqQ4: 'هل يمكنني إلغاء الاشتراك في أي وقت؟',
        faqA4: 'بالتأكيد! يمكنك إلغاء الاشتراك في أي وقت دون أي غرامات، وسيستمر وصولك للخدمة حتى نهاية الفترة المدفوعة.',
        faqQ5: 'هل يتم الحفاظ على سرية معلوماتي؟',
        faqA5: 'نعم، نولي خصوصيتك أهمية قصوى. يتم تشفير جميع بياناتك وحمايتها وفق أعلى معايير الأمان لضمان سرية معلوماتك القانونية.',
        faqQ6: 'هل أحتاج إلى معرفة المصطلحات القانونية لاستخدام Untitled؟',
        faqA6: 'أبدًا! تم تصميم Untitled ليكون سهل الاستخدام للجميع. يمكنك طرح أسئلتك بلغة بسيطة، وسنقدم لك الإجابات بلغة واضحة بعيدة عن التعقيد القانوني.',
        footerDescription: 'نقدم استشارات قانونية وتمثيلاً مهنياً بأعلى درجات النزاهة والاحترافية لتحقيق أفضل النتائج لعملائنا.',
        footerQuickLinksTitle: 'روابط سريعة',
        footerLinkHome: 'الرئيسية',
        footerLinkAbout: 'من نحن',
        footerLinkServices: 'الخدمات',
        footerLinkContact: 'اتصل بنا',
        footerLinkLogin: 'تسجيل الدخول',
        footerServicesTitle: 'الخدمات',
        footerService1: 'استشارات قانونية',
        footerService2: 'التمثيل أمام المحاكم',
        footerService3: 'مراجعة المستندات',
        footerService4: 'نصائح قانونية',
        footerService5: 'إدارة القضايا',
        footerContactTitle: 'معلومات التواصل',
        footerAddress: '١٢٣ شارع القانون، المدينة، الدولة ١٢٣٤٥',
        footerPhone: '+٩٦٦ ٥٥٥ ١٢٣ ٤٥٦',
        footerEmail: 'info@counsel.com',
        footerHours: 'من الإثنين إلى الجمعة: ٩:٠٠ ص - ٦:٠٠ م',
        footerAppsTitle: 'حمّل تطبيقنا',
        footerAppStoreLabel: 'متوفر على',
        footerAppStoreName: 'App Store',
        footerGooglePlayLabel: 'متوفر على',
        footerGooglePlayName: 'Google Play',
        footerCopyright: '© ٢٠٢٤ Counsel. جميع الحقوق محفوظة.',
        footerPrivacy: 'سياسة الخصوصية',
        footerTerms: 'شروط الاستخدام',
        footerCookies: 'سياسة ملفات الارتباط'
    }
};

function toggleLangMenu() {
    const dropdown = document.getElementById('langDropdown');
    dropdown.classList.toggle('active');
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML lang attribute and dir
    const html = document.getElementById('htmlLang');
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update language button
    const langText = document.getElementById('langText');
    const langFlag = document.getElementById('langFlag');
    if (lang === 'ar') {
        langText.textContent = 'العربية';
        if (langFlag) langFlag.textContent = '🇸🇦';
    } else {
        langText.textContent = 'English';
        if (langFlag) langFlag.textContent = '🇬🇧';
    }
    
    // Close dropdown
    document.getElementById('langDropdown').classList.remove('active');
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    changeLanguage(currentLang);
});

// Close language dropdown when clicking outside
document.addEventListener('click', function(event) {
    const langSelector = document.querySelector('.language-selector');
    if (langSelector && !langSelector.contains(event.target)) {
        document.getElementById('langDropdown').classList.remove('active');
    }
});
