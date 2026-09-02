// Navbar menu toggle
function toggleMenu() {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.getElementById('navbarToggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Language management
let currentLang = localStorage.getItem('language') || 'en';

const translations = {
    en: {
        home: 'Home',
        services: 'Services',
        about: 'About',
        faq: 'FAQ',
        login: 'Login',
        signup: 'Sign Up',
        ldgTitle: 'LegalDoc AI: Smart Contract & Complaint Generation',
        ldgSubtitle: 'Turn your inputs into legally binding contracts or formal complaints instantly.',
        ldgFormTitle: 'Document Information',
        ldgDocType: 'Document Type',
        ldgContractLease: 'Contracts',
        ldgContractGeneral: 'Complaints',
        ldgComplaint: 'Other',
        ldgTemplateSelect: 'Select Template',
        ldgGenerateBtn: 'Generate Document',
        ldgOutputTitle: 'Generated Document',
        ldgCopyBtn: 'Copy',
        ldgDownloadBtn: 'Download PDF',
        ldgTabLegal: 'Final Legal Document',
        ldgTabExplanation: 'Plain English Explanation',
        generating: 'Generating...',
        errorLoadingTemplates: 'Error loading templates. Please try again.',
        errorGenerating: 'Error generating document. Please try again.',
        copySuccess: 'Document copied to clipboard!',
        noInputsNeeded: 'No additional information needed for this template.',
        footerDescription: 'Providing exceptional legal counsel and representation with integrity, professionalism, and dedication to achieving the best outcomes for our clients.',
        footerQuickLinksTitle: 'Quick Links',
        footerLinkHome: 'Home',
        footerLinkAbout: 'About Us',
        footerLinkServices: 'Services',
        footerLinkContact: 'Contact',
        footerServicesTitle: 'Services',
        footerService1: 'Contract Analysis',
        footerService2: 'Document Generation',
        footerService3: 'ChatBot',
        footerService4: 'Law Experts',
        footerService5: 'Case Management',
        footerContactTitle: 'Contact Info',
        footerPhone: '+1 (555) 123-4567',
        footerEmail: 'info@counsel.com',
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
        ldgTitle: 'LegalDoc AI: إنشاء العقود والشكاوى الذكية',
        ldgSubtitle: 'حوّل مدخلاتك إلى عقود ملزمة قانونياً أو شكاوى رسمية في لحظات.',
        ldgFormTitle: 'معلومات المستند',
        ldgDocType: 'نوع المستند',
        ldgContractLease: 'عقود',
        ldgContractGeneral: 'شكاوى',
        ldgComplaint: 'أخرى',
        ldgTemplateSelect: 'اختر النموذج',
        ldgGenerateBtn: 'إنشاء المستند',
        ldgOutputTitle: 'المستند المُنشأ',
        ldgCopyBtn: 'نسخ',
        ldgDownloadBtn: 'تحميل PDF',
        ldgTabLegal: 'المستند القانوني النهائي',
        ldgTabExplanation: 'شرح مبسط (باللغة العربية)',
        generating: 'جاري الإنشاء...',
        errorLoadingTemplates: 'خطأ في تحميل النماذج. يرجى المحاولة مرة أخرى.',
        errorGenerating: 'خطأ في إنشاء المستند. يرجى المحاولة مرة أخرى.',
        copySuccess: 'تم نسخ المستند!',
        noInputsNeeded: 'لا توجد بيانات إضافية مطلوبة لهذا النموذج.',
        footerDescription: 'تقديم المشورة القانونية الاستثنائية والتمثيل بالنزاهة والاحتراف والتفاني لتحقيق أفضل النتائج لعملائنا.',
        footerQuickLinksTitle: 'روابط سريعة',
        footerLinkHome: 'الرئيسية',
        footerLinkAbout: 'من نحن',
        footerLinkServices: 'خدماتنا',
        footerLinkContact: 'الأسئلة الشائعة',
        footerServicesTitle: 'الخدمات',
        footerService1: 'تحليل العقود',
        footerService2: 'إنشاء المستندات',
        footerService3: 'المساعد الذكي',
        footerService4: 'خبراء القانون',
        footerService5: 'إدارة القضايا',
        footerContactTitle: 'معلومات الاتصال',
        footerPhone: '+1 (555) 123-4567',
        footerEmail: 'info@counsel.com',
        footerAppsTitle: 'حمل تطبيقنا',
        footerAppStoreLabel: 'حمله من',
        footerAppStoreName: 'متجر التطبيقات',
        footerGooglePlayLabel: 'حمله من',
        footerGooglePlayName: 'متجر جوجل',
        footerCopyright: '© 2026 Counsel. جميع الحقوق محفوظة.',
        footerPrivacy: 'سياسة الخصوصية',
        footerTerms: 'شروط الخدمة',
        footerCookies: 'سياسة ملفات الارتباط'
    }
};

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    applyTranslations();
    onCategoryChange(); // Refresh templates list for the current language
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT' && el.type === 'placeholder') {
                el.placeholder = translations[currentLang][key];
            } else {
                el.textContent = translations[currentLang][key];
            }
        }
    });
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('langText').textContent = currentLang === 'en' ? 'English' : 'العربية';
}

// State management
let currentTemplates = [];
let currentTemplateData = null;

// On Page Load
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    onCategoryChange();
    updateNavbarAuth(); // Add this line

    // Handle form submission
    document.getElementById('documentForm').addEventListener('submit', handleFormSubmit);

    // Handle copy button
    document.getElementById('copyBtn').addEventListener('click', handleCopy);

    // Handle download button
    document.getElementById('downloadBtn').addEventListener('click', handleDownload);
});

function updateNavbarAuth() {
    const navbarCta = document.querySelector('.navbar-right .navbar-cta');
    if (!navbarCta) return;

    if (API.isLoggedIn()) {
        const user = API.getUser();
        const isAdmin = user && (user.role === 'admin' || user.role === 'Admin');
        const isLawyer = user && (user.role === 'lawyer' || user.role === 'Lawyer');
        
        let dashboardUrl = '../index.html';
        if (isAdmin) dashboardUrl = './admin-dashboard.html';
        else if (isLawyer) dashboardUrl = './lawyer.html';
        else dashboardUrl = './profile.html';

        navbarCta.innerHTML = `
            <a href="${dashboardUrl}" class="btn-login" style="margin-left: 10px;">${currentLang === 'ar' ? 'حسابي' : 'My Account'}</a>
            <button onclick="API.logout()" class="btn-signup" style="cursor:pointer; border:none; padding: 10px 20px;">${currentLang === 'ar' ? 'خروج' : 'Logout'}</button>
        `;
    }
}

async function onCategoryChange() {
    const category = document.querySelector('input[name="docCategory"]:checked').value;
    const templateSelect = document.getElementById('templateSelect');
    const dynamicFields = document.getElementById('dynamicFields');
    const generateBtn = document.getElementById('generateBtn');

    // Reset and show Loading state
    const loadingText = currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...';
    templateSelect.innerHTML = `<option value="">-- ${loadingText} --</option>`;
    dynamicFields.innerHTML = '';
    generateBtn.disabled = true;

    try {
        // ✅ Switch to use the dynamic CSV-based Documents API
        const data = await API.Documents.listTemplates();
        
        // Filter by category
        currentTemplates = data.filter(t => {
            if (category === 'complaint') {
                return t.category === 'complaints';
            }
            if (category === 'contract-lease' || category === 'contract-general') {
                return t.category === 'contracts';
            }
            return false;
        });

        const placeholderText = translations[currentLang].ldgTemplateSelect;
        templateSelect.innerHTML = `<option value="">-- ${placeholderText} --</option>`;

        if (currentTemplates.length === 0) {
            const noTemplatesText = currentLang === 'ar' ? 'لا توجد نماذج متاحة' : 'No templates available';
            templateSelect.innerHTML = `<option value="">-- ${noTemplatesText} --</option>`;
            return;
        }

        currentTemplates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id; // Using filename from CSV system
            option.textContent = template.title;
            templateSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading templates:', error);
        const errorText = translations[currentLang].errorLoadingTemplates;
        templateSelect.innerHTML = `<option value="">-- ${errorText} --</option>`;
        alert(errorText);
    }
}

async function onTemplateChange() {
    const templateId = document.getElementById('templateSelect').value;
    const dynamicFields = document.getElementById('dynamicFields');
    const generateBtn = document.getElementById('generateBtn');
    
    // Determine category
    const categoryVal = document.querySelector('input[name="docCategory"]:checked').value;
    let fetchType = 'contracts';
    if (categoryVal === 'complaint') fetchType = 'complaints';

    if (!templateId) {
        dynamicFields.innerHTML = '';
        generateBtn.disabled = true;
        return;
    }

    try {
        // ✅ Fetch dynamic CSV template details
        // Find the template in currentTemplates to get correct category if needed
        const templateInfo = currentTemplates.find(t => t.id === templateId);
        const effectiveType = templateInfo ? templateInfo.category : fetchType;
        
        const res = await API.Documents.getTemplate(effectiveType, templateId);
        currentTemplateData = res;
        
        // Extract unique inputs from all clauses
        const allInputs = [];
        if (res.clauses) {
            res.clauses.forEach(clause => {
                if (clause.requiredInputs) {
                    clause.requiredInputs.forEach(inputName => {
                        if (!allInputs.find(i => i.name === inputName)) {
                            allInputs.push({
                                name: inputName,
                                explanation: clause.simpleExplanation || ""
                            });
                        }
                    });
                }
            });
        }

        renderDynamicFields(allInputs);
        generateBtn.disabled = false;
    } catch (error) {
        console.error('Error fetching template details:', error);
        dynamicFields.innerHTML = '<p style="color:red">Error loading template details</p>';
    }
}

function renderDynamicFields(inputs) {
    const dynamicFields = document.getElementById('dynamicFields');
    dynamicFields.innerHTML = '';

    if (!inputs || inputs.length === 0) {
        const noInputsText = translations[currentLang].noInputsNeeded;
        dynamicFields.innerHTML = `<p class="ldg-no-inputs">${noInputsText}</p>`;
        return;
    }

    inputs.forEach((inputObj, index) => {
        const inputName = inputObj.name;
        const explanation = inputObj.explanation || "";

        const group = document.createElement('div');
        group.className = 'ldg-form-group';
        group.style.direction = 'rtl';
        group.style.textAlign = 'right';

        // Label with Info Icon
        const labelContainer = document.createElement('div');
        labelContainer.style.display = 'flex';
        labelContainer.style.alignItems = 'center';
        labelContainer.style.gap = '8px';
        labelContainer.style.marginBottom = '8px';

        const label = document.createElement('label');
        label.className = 'ldg-label';
        label.textContent = inputName;
        label.style.marginBottom = '0'; // reset for flex

        labelContainer.appendChild(label);

        // Add Info Icon if explanation is long
        if (explanation && explanation.length > 50) {
            const infoIcon = document.createElement('span');
            infoIcon.className = 'ldg-info-icon';
            infoIcon.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span class="ldg-tooltip">${explanation}</span>
            `;
            labelContainer.appendChild(infoIcon);
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'ldg-input';
        input.name = inputName; // Use actual input name from CSV
        input.required = true;
        input.style.width = '100%';
        input.style.padding = '12px 16px';
        input.style.borderRadius = '12px';
        input.style.border = '1px solid rgba(197, 149, 74, 0.3)';
        input.style.background = 'rgba(255, 255, 255, 0.05)';
        input.style.color = 'white';
        input.style.textAlign = 'right';

        // Placeholder Improvement: Use Simple_Explanation if short
        if (explanation && explanation.length <= 50) {
            input.placeholder = explanation;
        } else {
            input.placeholder = `أدخل ${inputName}...`;
        }

        group.appendChild(labelContainer);
        group.appendChild(input);

        // Helper Text Underneath
        if (explanation) {
            const helperText = document.createElement('p');
            helperText.className = 'ldg-helper-text';
            helperText.textContent = explanation;
            group.appendChild(helperText);
        }

        dynamicFields.appendChild(group);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const generateBtn = document.getElementById('generateBtn');
    const outputContainer = document.getElementById('outputContainer');
    const legalDocument = document.getElementById('legalDocument');
    const explanationTab = document.getElementById('explanationTab');

    if (!currentTemplateData) return;

    const formData = new FormData(e.target);
    const userValues = {}; // Backend now expects an object

    // Collect all field values
    formData.forEach((value, key) => {
        userValues[key] = value;
    });

    generateBtn.disabled = true;
    generateBtn.textContent = translations[currentLang].generating;

    try {
        const categoryVal = document.querySelector('input[name="docCategory"]:checked').value;
        const category = categoryVal === 'complaint' ? 'complaints' : 'contracts';

        // ✅ Call backend to generate document from CSV
        const res = await API.Documents.generate({
            templateId: currentTemplateData.templateName || document.getElementById('templateSelect').value,
            category: category,
            userValues: userValues
        });

        const renderedHtml = (res.fullText || "");
        const explanationHtml = (res.explanationText || "");

        // Use professional paper-style container for preview
        legalDocument.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
                
                .paper-preview { 
                    direction: rtl; 
                    text-align: right; 
                    background: #fff; 
                    color: #1a1a1a; 
                    padding: 60px 50px; 
                    box-shadow: 0 0 30px rgba(0,0,0,0.2); 
                    border-radius: 2px; 
                    font-family: 'Amiri', serif; 
                    max-width: 800px;
                    margin: 20px auto;
                    position: relative;
                    border: 1px solid #ddd;
                    line-height: 1.6;
                }
                
                /* Decorative Frame */
                .paper-preview::before {
                    content: '';
                    position: absolute;
                    top: 15px; left: 15px; right: 15px; bottom: 15px;
                    border: 2px double #C5954A;
                    pointer-events: none;
                }

                .paper-header { 
                    text-align: center; 
                    margin-bottom: 40px; 
                    border-bottom: 3px double #C5954A;
                    padding-bottom: 25px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                
                .doc-main-title {
                    font-size: 2.4rem;
                    color: #000;
                    margin: 0;
                    font-weight: 700;
                    line-height: 1.2;
                }

                .doc-subtitle {
                    font-size: 1.2rem;
                    color: #C5954A;
                    letter-spacing: 1px;
                    margin: 0;
                }

                .paper-content {
                    padding: 0 10px;
                }

                .clause-item { margin-bottom: 35px; text-align: justify; position: relative; }
                
                .clause-title { 
                    color: #000; 
                    display: block; 
                    font-size: 1.5rem; 
                    margin-bottom: 15px; 
                    font-weight: bold; 
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                }
                
                .clause-body { 
                    line-height: 2.1; 
                    font-size: 1.3rem; 
                    color: #1a1a1a; 
                    margin: 0; 
                    text-justify: inter-word;
                }

                /* Signature Section */
                .signature-section {
                    margin-top: 60px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    padding: 20px 0;
                }

                .signature-box {
                    text-align: center;
                }

                .sig-line {
                    margin-top: 50px;
                    border-top: 1px solid #000;
                    width: 80%;
                    margin-left: auto;
                    margin-right: auto;
                }

                .sig-label {
                    font-weight: bold;
                    font-size: 1.1rem;
                    margin-bottom: 5px;
                    display: block;
                }

                .paper-footer { 
                    margin-top: 60px; 
                    border-top: 1px solid #eee; 
                    padding-top: 20px; 
                    font-size: 0.9rem; 
                    color: #777; 
                    text-align: center;
                    font-family: 'Cairo', sans-serif;
                }

                .watermark {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 8rem;
                    color: rgba(197, 149, 74, 0.03);
                    white-space: nowrap;
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                }

                @media print {
                    body * { visibility: hidden; }
                    .paper-preview, .paper-preview * { visibility: visible; }
                    .paper-preview { position: absolute; left: 0; top: 0; box-shadow: none; border: none; padding: 0; }
                    .paper-preview::before { border: 2px solid #000; }
                }
            </style>
            <div class="paper-preview">
                <div class="watermark">LEXAGUIDE</div>
                
                <div class="paper-header">
                    <h1 class="doc-main-title">عقد رسمي</h1>
                    <p class="doc-subtitle">وثيقة قانونية محررة آلياً</p>
                </div>

                <div class="paper-content">
                    ${renderedHtml}
                </div>

                <div class="signature-section">
                    <div class="signature-box">
                        <span class="sig-label">الطرف الأول</span>
                        <div class="sig-line"></div>
                        <span style="font-size: 0.8rem; color: #888;">التوقيع / الختم</span>
                    </div>
                    <div class="signature-box">
                        <span class="sig-label">الطرف الثاني</span>
                        <div class="sig-line"></div>
                        <span style="font-size: 0.8rem; color: #888;">التوقيع / الختم</span>
                    </div>
                </div>

                <div class="paper-footer">
                    هذا المستند تم توليده عبر منصة LexaGuide للخدمات القانونية الذكية بتاريخ ${new Date().toLocaleDateString('ar-EG')}<br>
                    الرقم المرجعي للمستند: LG-${Math.random().toString(36).substr(2, 9).toUpperCase()}
                </div>
            </div>
        `;

        explanationTab.innerHTML = `
            <div class="explanation-content" style="direction: rtl; text-align: right; padding: 20px; line-height: 1.7; color: #ddd;">
                ${explanationHtml || (currentLang === 'ar' ? "لا يتوفر شرح مبسط لهذا النموذج." : "No simple explanation available for this template.")}
            </div>
        `;

        outputContainer.style.display = 'block';
        outputContainer.scrollIntoView({ behavior: 'smooth' });

        // Switch to legal tab by default
        switchTab('legal');

    } catch (error) {
        console.error('Error generating document:', error);
        alert(translations[currentLang].errorGenerating);
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = translations[currentLang].ldgGenerateBtn;
    }
}

function switchTab(tab) {
    const tabs = document.querySelectorAll('.ldg-tab');
    const panes = document.querySelectorAll('.ldg-tab-pane');

    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));

    if (tab === 'legal') {
        document.querySelector('[onclick="switchTab(\'legal\')"]').classList.add('active');
        document.getElementById('legalTab').classList.add('active');
    } else {
        document.querySelector('[onclick="switchTab(\'explanation\')"]').classList.add('active');
        document.getElementById('explanationTab').classList.add('active');
    }
}

async function handleCopy() {
    const text = document.getElementById('legalDocument').innerText;
    try {
        await navigator.clipboard.writeText(text);
        alert(translations[currentLang].copySuccess);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

function handleDownload() {
    const element = document.getElementById('legalDocument');
    const templateName = document.getElementById('templateSelect').value;

    const opt = {
        margin: 1,
        filename: `${templateName || 'LegalDocument'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

function toggleLangMenu() {
    document.getElementById('langDropdown').classList.toggle('show');
}

// Close dropdown when clicking outside
window.onclick = function (event) {
    if (!event.target.closest('.language-selector')) {
        const dropdowns = document.getElementsByClassName("lang-dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
