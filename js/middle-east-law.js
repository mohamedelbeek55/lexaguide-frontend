// Simple navbar toggle
function toggleMenu() {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.getElementById('navbarToggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Language & translations
let currentLang = localStorage.getItem('language') || 'en';

const translations = {
    en: {
        home: 'Home',
        services: 'Services',
        about: 'About',
        faq: 'FAQ',
        login: 'Login',
        signup: 'Sign Up',
        meHeroTitle: 'Your Instant Legal Consultation: Connect with a Specialized Lawyer Now',
        meHeroSubtitle: 'Fast, reliable legal solutions. Consult via secure chat or HD video with licensed Middle East lawyers, matched to your exact needs on a simple pay‑per‑use model.',
        meHeroBadge1: 'Licensed Lawyers Only',
        meHeroBadge2: 'Specialized by Jurisdiction & Practice Area',
        meHeroBadge3: 'Pay Per Use · No Long-Term Contracts',
        meHeroCtaPrimary: 'Find Your Lawyer Now',
        meHeroCtaSecondary: 'How it Works',
        meHeroSecurity: 'Secure payment · End‑to‑end privacy · No data shared without your consent',
        meHeroPanelTitle: 'Trusted Middle East Legal Network',
        meHeroPanelText: 'Get matched with vetted attorneys in family law, commercial disputes, real estate, labor, IP, and more.',
        meHeroStat1: 'Licensed Lawyers',
        meHeroStat2: 'Completed Consultations',
        meHeroStat3: 'Average Rating',
        meMatchTitle: 'Smart Matching in 3 Steps',
        meMatchSubtitle: 'Tell us what you need, and we’ll recommend the most suitable licensed lawyers for your case.',
        meMatchLabelArea: '1. Specify your legal area',
        meMatchLabelNeed: '2. Briefly describe your need',
        meMatchLabelComm: '3. Preferred communication method',
        meAreaFamily: 'Family Law',
        meAreaRealEstate: 'Real Estate',
        meAreaCommercial: 'Commercial Disputes',
        meAreaLabor: 'Labor Law',
        meAreaIP: 'Intellectual Property',
        meAreaStartup: 'Startups & Company Law',
        meNeedPlaceholder: 'Example: I need a review of a commercial lease agreement.',
        meMatchChatLabel: 'Written Chat (faster & lower cost)',
        meMatchVideoLabel: 'Video Call (more interactive)',
        meMatchButton: 'Show Recommended Lawyers',
        meHowTitle: 'How It Works',
        meHowStep1Label: 'Step 1 · Define Your Need',
        meHowStep1Title: 'Tell us what you need help with',
        meHowStep1Text: 'Use the smart filter to pick your legal area and briefly describe your situation in your own words.',
        meHowStep2Label: 'Step 2 · Choose Your Lawyer',
        meHowStep2Title: 'Review recommended profiles',
        meHowStep2Text: 'Compare specialties, ratings, prices, and availability to select the lawyer that best fits your case.',
        meHowStep3Label: 'Step 3 · Pay & Start',
        meHowStep3Title: 'Secure pay‑per‑use',
        meHowStep3Text: 'Pay only for the consultation slot you choose (chat or video). All payments are processed securely.',
        meHowStep4Label: 'Step 4 · Get Your Solution',
        meHowStep4Title: 'Receive clear, documented advice',
        meHowStep4Text: 'Get practical, written guidance and (optionally) a saved transcript of your session for your records.',
        meTestimonialsTitle: 'What Clients Say',
        meTest1Text: '“I connected with a commercial lawyer in less than 10 minutes and had my contract reviewed the same day.”',
        meTest1Author: 'Omar · Small business owner, UAE',
        meTest2Text: '“The pay‑per‑use model is perfect. I only paid for the exact time I needed instead of committing to a retainer.”',
        meTest2Author: 'Sara · Freelancer, KSA',
        meTest3Text: '“I needed a specialist in IP law for my startup. The recommendation system picked exactly the right person.”',
        meTest3Author: 'Ali · Startup founder, Egypt',
        meFaqTitle: 'Frequently Asked Questions',
        meFaqSubtitle: 'Answers about pricing, privacy, and lawyer qualifications.',
        meFaqQ1: 'How much does a consultation cost?',
        meFaqA1: 'Prices are set by each lawyer and shown clearly on their profile (e.g. 15 or 30 minute slots). You only pay for the time you book.',
        meFaqQ2: 'Are all lawyers licensed?',
        meFaqA2: 'Yes. Every lawyer on the platform is a licensed attorney in at least one Middle Eastern jurisdiction, verified through our onboarding process.',
        meFaqQ3: 'How is my information kept private?',
        meFaqA3: 'All sessions are encrypted, and your case details are visible only to you and the lawyer you choose. We never sell or share your data with third parties.',
        meFaqQ4: 'Can I download a transcript of my consultation?',
        meFaqA4: 'Yes. For chat sessions, you can export a transcript after the consultation. For video calls, lawyers can optionally upload written follow‑up notes.'
    },
    ar: {
        home: 'الرئيسية',
        services: 'الخدمات',
        about: 'من نحن',
        faq: 'الأسئلة الشائعة',
        login: 'تسجيل الدخول',
        signup: 'إنشاء حساب',
        meHeroTitle: 'استشارة قانونية فورية: تواصل مع محامٍ متخصص الآن',
        meHeroSubtitle: 'حلول قانونية سريعة وموثوقة. استشر محامين معتمدين في الشرق الأوسط عبر محادثة آمنة أو مكالمة فيديو، مع مطابقة دقيقة لاحتياجك بنظام دفع مقابل كل استخدام.',
        meHeroBadge1: 'محامون مرخصون فقط',
        meHeroBadge2: 'متخصصون حسب الدولة ونوع القضايا',
        meHeroBadge3: 'دفع عند الاستخدام · بدون التزام طويل الأمد',
        meHeroCtaPrimary: 'ابحث عن محاميك الآن',
        meHeroCtaSecondary: 'كيف تعمل المنصّة',
        meHeroSecurity: 'دفع آمن · خصوصية كاملة · لا يتم مشاركة بياناتك بدون موافقتك',
        meHeroPanelTitle: 'شبكة قانونية موثوقة في الشرق الأوسط',
        meHeroPanelText: 'يمكنك الوصول إلى محامين مختصين في قضايا الأسرة، المنازعات التجارية، العقارات، العمل، الملكية الفكرية والمزيد.',
        meHeroStat1: 'محامين مرخصين',
        meHeroStat2: 'استشارة مكتملة',
        meHeroStat3: 'متوسط التقييم',
        meMatchTitle: 'مطابقة ذكية في 3 خطوات',
        meMatchSubtitle: 'اخبرنا بما تحتاجه، وسنقترح عليك المحامين الأنسب لحالتك.',
        meMatchLabelArea: '1. حدد المجال القانوني',
        meMatchLabelNeed: '2. صف احتياجك باختصار',
        meMatchLabelComm: '3. اختر طريقة التواصل المفضلة',
        meAreaFamily: 'الأحوال الشخصية',
        meAreaRealEstate: 'العقارات',
        meAreaCommercial: 'المنازعات التجارية',
        meAreaLabor: 'قانون العمل',
        meAreaIP: 'الملكية الفكرية',
        meAreaStartup: 'الشركات الناشئة والقانون التجاري',
        meNeedPlaceholder: 'مثال: أحتاج إلى مراجعة عقد إيجار تجاري.',
        meMatchChatLabel: 'محادثة كتابية (أسرع وأقل تكلفة)',
        meMatchVideoLabel: 'مكالمة فيديو (تفاعل أكبر)',
        meMatchButton: 'عرض المحامين المقترحين',
        meHowTitle: 'كيف تعمل المنصّة',
        meHowStep1Label: 'الخطوة 1 · تحديد احتياجك',
        meHowStep1Title: 'أخبرنا بما تحتاجه',
        meHowStep1Text: 'استخدم أداة التصفية الذكية لتحديد نوع القضية، ثم صف موقفك بكلماتك الخاصة.',
        meHowStep2Label: 'الخطوة 2 · اختيار المحامي',
        meHowStep2Title: 'راجع الملفات المقترحة',
        meHowStep2Text: 'قارن بين التخصصات والتقييمات والأسعار وتوفر المحامين لاختيار الأنسب لك.',
        meHowStep3Label: 'الخطوة 3 · الدفع والبدء',
        meHowStep3Title: 'دفع آمن عند الاستخدام',
        meHowStep3Text: 'ادفع فقط مقابل المدة التي تختارها (محادثة أو فيديو)، مع معالجة دفع آمنة بالكامل.',
        meHowStep4Label: 'الخطوة 4 · استلام الحل',
        meHowStep4Title: 'استشارة واضحة وموثقة',
        meHowStep4Text: 'احصل على نصائح عملية مكتوبة، مع إمكانية حفظ ملخص أو سجل الجلسة للرجوع إليه لاحقاً.',
        meTestimonialsTitle: 'آراء العملاء',
        meTest1Text: '“تواصلت مع محامٍ تجاري في أقل من 10 دقائق وتمت مراجعة عقدي في نفس اليوم.”',
        meTest1Author: 'عمر · صاحب مشروع صغير، الإمارات',
        meTest2Text: '“نظام الدفع عند الاستخدام مناسب جداً، دفعت فقط مقابل الوقت الذي احتجته بدون أي التزام طويل.”',
        meTest2Author: 'سارة · مستقلة، السعودية',
        meTest3Text: '“كنت بحاجة إلى محامٍ مختص في الملكية الفكرية لشركتي الناشئة، ونظام التوصية اختار الشخص المناسب تماماً.”',
        meTest3Author: 'علي · مؤسس شركة ناشئة، مصر',
        meFaqTitle: 'الأسئلة الشائعة',
        meFaqSubtitle: 'إجابات حول الأسعار والخصوصية ومؤهلات المحامين.',
        meFaqQ1: 'كم تكلفة الاستشارة؟',
        meFaqA1: 'يحدد كل محامٍ أتعابه، وتظهر بوضوح في ملفه (مثل 15 أو 30 دقيقة). تدفع فقط مقابل الوقت الذي تحجزه.',
        meFaqQ2: 'هل جميع المحامين مرخصون؟',
        meFaqA2: 'نعم، جميع المحامين على المنصّة حاصلون على ترخيص في إحدى دول الشرق الأوسط، ويتم التحقق من بياناتهم قبل الانضمام.',
        meFaqQ3: 'كيف يتم الحفاظ على خصوصية معلوماتي؟',
        meFaqA3: 'جميع الجلسات مشفرة، وتفاصيل حالتك لا يراها سوى أنت والمحامي الذي تختاره، ولا نبيع بياناتك أو نشاركها مع أطراف أخرى.',
        meFaqQ4: 'هل يمكنني تحميل نسخة من محادثة الاستشارة؟',
        meFaqA4: 'نعم، في جلسات المحادثة الكتابية يمكنك حفظ نسخة من المحادثة بعد انتهاء الجلسة، وفي مكالمات الفيديو يمكن للمحامي إضافة ملاحظات مكتوبة عند الحاجة.'
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

    const need = document.getElementById('me-need');
    if (need && translations[lang].meNeedPlaceholder) {
        need.placeholder = translations[lang].meNeedPlaceholder;
    }

    // Update language button text
    const langText = document.getElementById('langText');
    if (lang === 'ar') {
        langText.textContent = 'العربية';
    } else {
        langText.textContent = 'English';
    }

    document.getElementById('langDropdown').classList.remove('active');
}


document.addEventListener('click', function (event) {
    const langSelector = document.querySelector('.language-selector');
    if (langSelector && !langSelector.contains(event.target)) {
        document.getElementById('langDropdown').classList.remove('active');
    }
});

// FAQ toggle reuse
function toggleFaq(element) {
    if (!element || !element.parentElement) return;
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const chevron = element.querySelector('.faq-chevron');
    if (!answer) return;
    const isActive = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const otherAnswer = item.querySelector('.faq-answer');
            const otherChevron = item.querySelector('.faq-chevron');
            if (otherAnswer) otherAnswer.style.maxHeight = '';
            if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
        }
    });

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

// ─── Load legal areas to populate the dropdown ───────────────────
async function loadLegalAreas() {
    var areaSelect = document.getElementById('me-legal-area');
    if (!areaSelect) return;

    var defaults = [
        'Family Law',
        'Real Estate',
        'Commercial Disputes',
        'Labor Law',
        'Intellectual Property',
        'Corporate Law',
        'Criminal Law',
        'Civil Law',
        'Immigration',
        'Tax',
        'Banking & Finance'
    ];

    try {
        // Keep placeholder option
        var firstOpt = areaSelect.options[0];
        areaSelect.innerHTML = '';
        if (firstOpt && firstOpt.value === '') areaSelect.appendChild(firstOpt);

        defaults.forEach(function (name) {
            var opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            areaSelect.appendChild(opt);
        });
    } catch (e) {
        // Fallback — keep placeholder only
    }
}

// ─── Show matched lawyers from real API ───────────────────────────────────
async function simulateMatch() {
    var areaEl = document.getElementById('me-legal-area');
    var cityEl = document.getElementById('me-city');
    var budgetEl = document.getElementById('me-budget');
    var needEl = document.getElementById('me-need');
    var commEl = document.querySelector('[name="me-comm"]:checked') ||
        document.querySelector('.me-radio-input:checked');
    var matchBtn = document.querySelector('[onclick="simulateMatch()"]') ||
        document.querySelector('[data-action="match"]');

    var legalAreaId = areaEl ? areaEl.value : '';
    var city = cityEl ? cityEl.value : '';
    var budget = budgetEl ? budgetEl.value : '';
    var description = needEl ? needEl.value : '';
    var commMethod = commEl ? commEl.value : 'chat';

    if (!legalAreaId) {
        API.UI.toast('Please select a legal area first.', 'error');
        return;
    }

    var restore = matchBtn ? API.UI.setLoading(matchBtn, 'Matching…') : function () { };

    try {
        var response = await API.Match.match({
            legal_area_id: legalAreaId,
            city: city,
            budget: budget,
            communication_method: commMethod === 'video' ? 'video_call' : 'chat',
            description: description || undefined
        });

        var lawyers = (response && response.data) ? response.data : (Array.isArray(response) ? response : []);
        renderMatchedLawyers(lawyers);
        restore();

        // Scroll to results
        var resultsEl = document.getElementById('me-lawyers-grid') ||
            document.getElementById('me-lawyer-list') ||
            document.querySelector('.me-lawyers-grid');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
        restore();
        // Fallback: highlight cards by opacity as before (static fallback)
        var cards = document.querySelectorAll('.me-lawyer-card');
        cards.forEach(function (card) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        API.UI.toast(err.message || 'Could not connect to matching service.', 'error');
    }
}

// ─── Render matched lawyer cards (same layout as static cards) ──────────────
function escapeHtml(str) {
    if (str == null) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}
function renderMatchedLawyers(lawyers) {
    var grid = document.getElementById('me-lawyers-grid') ||
        document.getElementById('me-lawyer-list') ||
        document.querySelector('.me-lawyers-grid');
    if (!grid) return;

    if (!lawyers || lawyers.length === 0) {
        API.UI.toast('No lawyers found for your criteria. Try broadening your search.', 'info');
        grid.innerHTML = '<p class="me-no-lawyers" id="me-lawyers-empty-state">No lawyers match this legal area yet. Add lawyers from the Lawyers management page (admin).</p>';
        return;
    }

    grid.innerHTML = lawyers.map(function (l) {
        var name = l.full_name || l.name || 'Lawyer';
        var specialty = l.specialty || l.legal_area || l.specialization || '';
        var country = l.country || l.region || '';
        var specialtyLine = specialty + (country ? ' · ' + country : '');
        var rating = l.rating != null ? parseFloat(l.rating) : 0;
        var ratingStr = rating >= 4.5 ? '★★★★★' : rating >= 4 ? '★★★★☆' : rating >= 3.5 ? '★★★☆☆' : '★★☆☆☆';
        var consultations = l.total_consultations != null ? l.total_consultations : 0;
        var price = l.price_per_session != null ? parseFloat(l.price_per_session) : 0;
        var mins = l.session_duration_mins != null ? l.session_duration_mins : 30;
        var avail = l.availability_status || '';
        var availLabel = avail === 'online_now' ? 'Online now' :
            avail === 'available_in_30_mins' ? 'Available in 30 mins' : 'Unavailable';
        var availClass = 'me-availability';
        if (avail === 'available_in_30_mins') availClass += ' soon';
        else if (avail !== 'online_now') availClass += ' offline';
        var bio = (l.bio || '').trim() || 'Specialised legal support for your needs.';
        var initials = (l.initials || '').trim();
        if (!initials && name) {
            var parts = name.trim().split(/\s+/);
            initials = parts.map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
        }
        if (!initials) initials = '??';

        return '<article class="me-lawyer-card" data-id="' + l.id + '">' +
            '<div class="me-lawyer-head">' +
            '  <div class="me-lawyer-avatar">' + escapeHtml(initials) + '</div>' +
            '  <div>' +
            '    <div class="me-lawyer-name">' + escapeHtml(name) + '</div>' +
            '    <div class="me-lawyer-specialty">' + escapeHtml(specialtyLine) + '</div>' +
            '  </div>' +
            '</div>' +
            '<div class="me-lawyer-meta">' +
            '  <span class="me-rating">' + escapeHtml(ratingStr) + ' (' + rating.toFixed(1) + ')</span>' +
            '  <span>' + (consultations > 0 ? consultations + '+ consultations' : 'New') + '</span>' +
            '  <span class="me-price">From $' + Math.round(price) + ' / ' + mins + ' mins</span>' +
            '  <span class="' + availClass + '">' + escapeHtml(availLabel) + '</span>' +
            '</div>' +
            '<p class="me-lawyer-specialty">' + escapeHtml(bio) + '</p>' +
            '<div class="me-lawyer-actions">' +
            '  <button type="button" class="chat" onclick="bookLawyer(' + l.id + ', \'chat\')">Chat</button>' +
            '  <button type="button" class="video" onclick="bookLawyer(' + l.id + ', \'video_call\')">Video Call</button>' +
            '</div>' +
            '</article>';
    }).join('');
}

// ─── Book a consultation with a matched lawyer ─────────────────────────────
async function bookLawyer(lawyerId, communicationMethod) {
    var commMethod = communicationMethod === 'video_call' ? 'video_call' : 'chat';
    if (commMethod === 'chat') {
        window.location.href = 'customer.html?lawyer=' + encodeURIComponent(String(lawyerId || ''));
        return;
    }
    if (!API.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    var areaEl = document.getElementById('me-legal-area');
    var legalAreaId = areaEl ? parseInt(areaEl.value, 10) : 1;

    try {
        var resp = await API.Consult.book({
            lawyer_id: lawyerId,
            legal_area_id: legalAreaId,
            communication_method: commMethod
        });

        var consultationId = resp && resp.data && resp.data.id;

        API.UI.toast('Consultation booked successfully!', 'success');
    } catch (err) {
        API.UI.toast(err.message || 'Failed to book consultation.', 'error');
    }
}

// ─── Init: load legal areas on page load ────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    changeLanguage(currentLang);
    if (typeof API !== 'undefined') loadLegalAreas();
});
