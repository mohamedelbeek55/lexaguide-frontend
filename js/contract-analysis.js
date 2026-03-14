function toggleMenu() {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.getElementById('navbarToggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

let currentLang = localStorage.getItem('language') || 'en';

const translations = {
    en: {
        caHeroTitle: 'Contracts Made Simple: Comprehensive Legal Analysis in Minutes',
        caHeroSubtitle: 'Upload your contract (image or PDF) and let our AI analyze and explain it to you, highlighting risks, opportunities, and improvement recommendations.',
        caHeroBtn1: 'Start Analyzing Your First Contract',
        caHeroBtn2: 'Try the Service Now',
        caHowItWorks: 'How It Works',
        caStep1Title: 'Document Upload & Conversion',
        caStep1Subtitle: 'From Image to Analyzable Text in Seconds',
        caStep1Desc: 'Upload your contract (scanned image or PDF). Our smart OCR system accurately extracts the text, converting images into readable data for analysis.',
        caStep2Title: 'Comprehensive AI Analysis',
        caStep2Subtitle: 'Intelligent Legal Processing',
        caStep2Desc: 'The AI breaks down clauses, identifies key legal terminology, and analyzes the contract structure to provide comprehensive insights.',
        caStep3Title: 'Results Report Generation',
        caStep3Subtitle: 'Easy-to-Read Analysis',
        caStep3Desc: 'Receive a detailed analysis report presented in an easy-to-read format, with clear explanations and actionable recommendations.',
        caUploadTitle: 'Upload Your Contract',
        caUploadIntro: 'Drag and drop your contract file or click to browse',
        caUploadText: 'Upload Contract File',
        caUploadHint: 'Supports PDF, JPG, PNG, DOC (Max size 10MB)',
        caAnalyzeBtn: 'Analyze Contract',
        caSampleBtn: 'View Sample Report',
        caOutputsTitle: 'What You Get in Your Report',
        caOutput1Title: 'Concise Summary',
        caOutput1Desc: 'A quick rundown of the contract\'s most important points and main objectives.',
        caOutput2Title: 'Simplified Explanation',
        caOutput2Desc: 'A clarification of complex legal clauses in clear, non-technical language.',
        caOutput3Title: 'Pros and Cons Identification',
        caOutput3Desc: 'Highlighting potential risks (detrimental clauses) and advantages (benefits).',
        caOutput4Title: 'Suggested Improvements',
        caOutput4Desc: 'Concrete recommendations for rephrasing weak clauses to enhance legal protection.',
        caPricingTitle: 'Pricing',
        caPrice1Title: 'Pay-Per-Contract',
        caPrice1Unit: '/contract',
        caPrice1Desc: 'Perfect for occasional use',
        caPrice1Feature1: '✓ One-time analysis',
        caPrice1Feature2: '✓ Full report included',
        caPrice1Feature3: '✓ Downloadable PDF',
        caPrice2Title: 'Monthly Subscription',
        caPrice2Unit: '/month',
        caPrice2Desc: 'Up to 10 contracts per month',
        caPrice2Feature1: '✓ 10 contract analyses',
        caPrice2Feature2: '✓ Priority processing',
        caPrice2Feature3: '✓ Full reports + downloads',
        caPrice2Feature4: '✓ Email support',
        caPrice3Title: 'Enterprise',
        caPrice3Price: 'Custom',
        caPrice3Desc: 'For high-volume needs',
        caPrice3Feature1: '✓ Unlimited analyses',
        caPrice3Feature2: '✓ API access',
        caPrice3Feature3: '✓ Dedicated support',
        caPrice3Feature4: '✓ Custom integrations',
        caPopular: 'Popular',
        caChoosePlan: 'Choose Plan',
        caContactSales: 'Contact Sales'
    },
    ar: {
        caHeroTitle: 'العقود مبسطة: تحليل قانوني شامل في دقائق',
        caHeroSubtitle: 'ارفع عقدك (صورة أو PDF) ودع ذكاءنا الاصطناعي يحلله ويشرحه لك، مع إبراز المخاطر والفرص وتوصيات التحسين.',
        caHeroBtn1: 'ابدأ تحليل عقدك الأول',
        caHeroBtn2: 'جرّب الخدمة الآن',
        caHowItWorks: 'كيف يعمل',
        caStep1Title: 'رفع المستند والتحويل',
        caStep1Subtitle: 'من الصورة إلى نص قابل للتحليل في ثوانٍ',
        caStep1Desc: 'ارفع عقدك (صورة ممسوحة أو PDF). نظام OCR الذكي يستخرج النص بدقة، محولاً الصور إلى بيانات قابلة للقراءة للتحليل.',
        caStep2Title: 'تحليل شامل بالذكاء الاصطناعي',
        caStep2Subtitle: 'معالجة قانونية ذكية',
        caStep2Desc: 'يقوم الذكاء الاصطناعي بتفكيك البنود، وتحديد المصطلحات القانونية الرئيسية، وتحليل هيكل العقد لتقديم رؤى شاملة.',
        caStep3Title: 'إنشاء تقرير النتائج',
        caStep3Subtitle: 'تحليل سهل القراءة',
        caStep3Desc: 'احصل على تقرير تحليل مفصل معروض بتنسيق سهل القراءة، مع شرح واضح وتوصيات قابلة للتنفيذ.',
        caUploadTitle: 'ارفع عقدك',
        caUploadIntro: 'اسحب وأفلت ملف العقد أو انقر للتصفح',
        caUploadText: 'رفع ملف العقد',
        caUploadHint: 'يدعم PDF, JPG, PNG, DOC (الحد الأقصى 10 ميجابايت)',
        caAnalyzeBtn: 'تحليل العقد',
        caSampleBtn: 'عرض تقرير نموذجي',
        caOutputsTitle: 'ما الذي ستحصل عليه في تقريرك',
        caOutput1Title: 'ملخص موجز',
        caOutput1Desc: 'نظرة سريعة على أهم نقاط العقد وأهدافه الرئيسية.',
        caOutput2Title: 'شرح مبسط',
        caOutput2Desc: 'توضيح للبنود القانونية المعقدة بلغة واضحة وغير تقنية.',
        caOutput3Title: 'تحديد الإيجابيات والسلبيات',
        caOutput3Desc: 'إبراز المخاطر المحتملة (البنود الضارة) والمزايا (الفوائد).',
        caOutput4Title: 'تحسينات مقترحة',
        caOutput4Desc: 'توصيات ملموسة لإعادة صياغة البنود الضعيفة لتعزيز الحماية القانونية.',
        caPricingTitle: 'الأسعار',
        caPrice1Title: 'الدفع لكل عقد',
        caPrice1Unit: '/عقد',
        caPrice1Desc: 'مثالي للاستخدام العرضي',
        caPrice1Feature1: '✓ تحليل لمرة واحدة',
        caPrice1Feature2: '✓ تقرير كامل متضمن',
        caPrice1Feature3: '✓ PDF قابل للتحميل',
        caPrice2Title: 'اشتراك شهري',
        caPrice2Unit: '/شهر',
        caPrice2Desc: 'حتى 10 عقود شهرياً',
        caPrice2Feature1: '✓ 10 تحليلات للعقود',
        caPrice2Feature2: '✓ معالجة أولوية',
        caPrice2Feature3: '✓ تقارير كاملة + تحميلات',
        caPrice2Feature4: '✓ دعم عبر البريد الإلكتروني',
        caPrice3Title: 'المؤسسات',
        caPrice3Price: 'مخصص',
        caPrice3Desc: 'للاحتياجات عالية الحجم',
        caPrice3Feature1: '✓ تحليلات غير محدودة',
        caPrice3Feature2: '✓ وصول API',
        caPrice3Feature3: '✓ دعم مخصص',
        caPrice3Feature4: '✓ تكاملات مخصصة',
        caPopular: 'شائع',
        caChoosePlan: 'اختر الخطة',
        caContactSales: 'اتصل بالمبيعات'
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

    // Use local translations first, fallback to window.translations if available
    const trans = translations[lang] || (window.translations && window.translations[lang]) || {};

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (trans[key]) {
            element.textContent = trans[key];
        }
    });

    const langText = document.getElementById('langText');
    if (lang === 'ar') {
        langText.textContent = 'العربية';
    } else {
        langText.textContent = 'English';
    }

    document.getElementById('langDropdown').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function () {
    changeLanguage(currentLang);
});

document.addEventListener('click', function (event) {
    const langSelector = document.querySelector('.language-selector');
    if (langSelector && !langSelector.contains(event.target)) {
        const dropdown = document.getElementById('langDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
});

// ─── Contract Analysis: Real Upload + AI Integration ─────────────────────
var selectedFile = null;

// Track selected file and update UI label
document.getElementById('fileInput') && document.getElementById('fileInput').addEventListener('change', function (e) {
    selectedFile = e.target.files[0] || null;
    var label = document.getElementById('uploadLabel') || document.querySelector('.ca-upload-text') || document.querySelector('[data-i18n="caUploadText"]');
    if (label && selectedFile) {
        label.textContent = '📄 ' + selectedFile.name;
    }
});

// Inject an analysis result panel below the upload area (idempotent)
function getOrCreateResultPanel() {
    var existing = document.getElementById('contractAnalysisResult');
    if (existing) return existing;
    var panel = document.createElement('div');
    panel.id = 'contractAnalysisResult';
    panel.style.cssText = [
        'margin: 2rem auto', 'max-width: 800px', 'padding: 1.5rem 2rem',
        'background: #1a1a2e', 'border: 1px solid #16213e', 'border-radius: 12px',
        'color: #e0e0e0', 'font-family: inherit', 'font-size: 15px', 'line-height: 1.7',
        'white-space: pre-wrap', 'word-break: break-word'
    ].join(';');
    // Try to insert after the analyze button's parent section
    var analyzeBtn = document.getElementById('analyzeBtn') || document.querySelector('.ca-analyze-btn') || document.querySelector('[data-i18n="caAnalyzeBtn"]');
    var insertAfter = analyzeBtn ? (analyzeBtn.closest('section') || analyzeBtn.parentElement) : null;
    if (insertAfter && insertAfter.parentElement) {
        insertAfter.parentElement.insertBefore(panel, insertAfter.nextSibling);
    } else {
        document.body.appendChild(panel);
    }
    return panel;
}

// Wire the "Analyze Contract" button
document.addEventListener('DOMContentLoaded', function () {
    var analyzeBtn = document.getElementById('analyzeBtn') || document.querySelector('.ca-analyze-btn') || document.querySelector('button[data-i18n="caAnalyzeBtn"]');
    if (!analyzeBtn) {
        // Fallback: find any button containing "Analyze"
        document.querySelectorAll('button').forEach(function (btn) {
            if (btn.textContent.toLowerCase().indexOf('analyz') !== -1) analyzeBtn = btn;
        });
    }
    if (!analyzeBtn) return;

    analyzeBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        // Auth guard
        if (!API.isLoggedIn()) {
            API.UI.toast('Please log in to analyze contracts.', 'error');
            setTimeout(function () { window.location.href = 'login.html'; }, 1500);
            return;
        }

        if (!selectedFile) {
            API.UI.toast('Please select a file first.', 'error');
            return;
        }

        var restore = API.UI.setLoading(analyzeBtn, currentLang === 'ar' ? 'جارٍ التحميل…' : 'Uploading…');
        var panel = getOrCreateResultPanel();
        panel.textContent = currentLang === 'ar' ? '⏳ جارٍ رفع الملف وتحليله…' : '⏳ Uploading and analyzing your contract…';
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

        try {
            // Step 1: Upload the file
            analyzeBtn.textContent = currentLang === 'ar' ? 'جارٍ التحميل…' : 'Uploading…';
            var uploadResp = await API.Document.upload(selectedFile);
            var docData = uploadResp && uploadResp.data;
            if (!docData) throw new Error('Upload failed — no document data returned.');

            // Step 2: Analyze with AI
            analyzeBtn.textContent = currentLang === 'ar' ? 'جارٍ التحليل…' : 'Analyzing…';
            var question = currentLang === 'ar'
                ? 'قم بتحليل هذا العقد. اذكر الملخص، والبنود الرئيسية، والمخاطر المحتملة، وأي توصيات للتحسين.'
                : 'Analyze this contract. Provide a summary, key clauses, potential risks, and improvement recommendations.';
            var aiResp = await API.AI.analyze({
                question: question,
                documentId: docData.id
            });

            var analysisText = (aiResp && aiResp.data && (
                aiResp.data.answer || aiResp.data.result || aiResp.data.response || aiResp.data.text || JSON.stringify(aiResp.data, null, 2)
            )) || (aiResp && aiResp.answer) || 'Analysis complete — but no text was returned from the AI service.';

            panel.innerHTML =
                '<h3 style="margin:0 0 1rem;color:#c4a44b;font-size:1rem;letter-spacing:.5px;">📋 ' +
                (currentLang === 'ar' ? 'نتيجة تحليل العقد' : 'Contract Analysis Result') +
                '</h3>' +
                '<div style="white-space:pre-wrap">' + analysisText + '</div>' +
                '<p style="margin:1rem 0 0;font-size:12px;color:#888;">' +
                (currentLang === 'ar' ? '📎 الملف: ' : '📎 File: ') + (docData.original_name || docData.filename || selectedFile.name) +
                '</p>';
            API.UI.toast(currentLang === 'ar' ? 'اكتمل التحليل!' : 'Analysis complete!', 'success');

        } catch (err) {
            var msg = err && err.message ? err.message : String(err);
            if (msg.indexOf('offline') !== -1 || msg.indexOf('Cannot connect') !== -1 || msg.indexOf('503') !== -1) {
                panel.textContent = '⚠️ ' + (currentLang === 'ar'
                    ? 'خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى تشغيل الخادم والمحاولة مرة أخرى.'
                    : 'The AI service is currently offline. Please start the backend server and try again.');
            } else {
                panel.textContent = '⚠️ Error: ' + msg;
            }
            API.UI.toast(currentLang === 'ar' ? 'فشل التحليل' : 'Analysis failed', 'error');
        } finally {
            restore();
        }
    });
});
