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
                ldgContractLease: 'Contract (Lease)',
                ldgContractGeneral: 'Contract (General)',
                ldgComplaint: 'Complaint (Service Dispute)',
                ldgGenerateBtn: 'Generate Document',
                ldgOutputTitle: 'Generated Document',
                ldgCopyBtn: 'Copy Document',
                ldgTabLegal: 'Final Legal Document',
                ldgTabExplanation: 'Plain English Explanation',
                // Contract Lease Fields
                ldgPartyA: 'Lessor Name (Party A)',
                ldgPartyB: 'Lessee Name (Party B)',
                ldgPropertyAddress: 'Property Address',
                ldgMonthlyRent: 'Monthly Rent Amount',
                ldgLeaseStart: 'Lease Start Date',
                ldgLeaseEnd: 'Lease End Date',
                ldgPaymentDate: 'Rent Payment Date (Day of Month)',
                ldgSecurityDeposit: 'Security Deposit Amount',
                ldgAdditionalTerms: 'Additional Terms (Optional)',
                // Contract General Fields
                ldgParty1: 'Party 1 Name',
                ldgParty2: 'Party 2 Name',
                ldgAgreementSubject: 'Agreement Subject',
                ldgAgreementDetails: 'Agreement Details',
                ldgAgreementDuration: 'Agreement Duration',
                ldgPaymentTerms: 'Payment Terms',
                // Complaint Fields
                ldgComplainantName: 'Your Name (Complainant)',
                ldgRespondentName: 'Respondent Name (Company/Person)',
                ldgServiceDate: 'Date of Service Failure',
                ldgServiceDescription: 'Description of Service Issue',
                ldgDesiredResolution: 'Desired Resolution',
                footerDescription: 'Providing exceptional legal counsel and representation with integrity, professionalism, and dedication to achieving the best outcomes for our clients.',
                footerQuickLinksTitle: 'Quick Links',
                footerLinkHome: 'Home',
                footerLinkAbout: 'About Us',
                footerLinkServices: 'Services',
                footerLinkContact: 'Contact',
                footerLinkLogin: 'Login',
                footerServicesTitle: 'Services',
                footerService1: 'Legal Consultation',
                footerService2: 'Document Generation',
                footerService3: 'Document Review',
                footerService4: 'Legal Advice',
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
                footerCopyright: '© 2024 Untitled. All rights reserved.',
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
                ldgContractLease: 'عقد (إيجار)',
                ldgContractGeneral: 'عقد (عام)',
                ldgComplaint: 'شكوى (نزاع خدمة)',
                ldgGenerateBtn: 'إنشاء المستند',
                ldgOutputTitle: 'المستند المُنشأ',
                ldgCopyBtn: 'نسخ المستند',
                ldgTabLegal: 'المستند القانوني النهائي',
                ldgTabExplanation: 'شرح باللغة البسيطة',
                // Contract Lease Fields
                ldgPartyA: 'اسم المؤجر (الطرف الأول)',
                ldgPartyB: 'اسم المستأجر (الطرف الثاني)',
                ldgPropertyAddress: 'عنوان العقار',
                ldgMonthlyRent: 'مبلغ الإيجار الشهري',
                ldgLeaseStart: 'تاريخ بداية الإيجار',
                ldgLeaseEnd: 'تاريخ نهاية الإيجار',
                ldgPaymentDate: 'تاريخ دفع الإيجار (يوم الشهر)',
                ldgSecurityDeposit: 'مبلغ الضمان',
                ldgAdditionalTerms: 'شروط إضافية (اختياري)',
                // Contract General Fields
                ldgParty1: 'اسم الطرف الأول',
                ldgParty2: 'اسم الطرف الثاني',
                ldgAgreementSubject: 'موضوع الاتفاقية',
                ldgAgreementDetails: 'تفاصيل الاتفاقية',
                ldgAgreementDuration: 'مدة الاتفاقية',
                ldgPaymentTerms: 'شروط الدفع',
                // Complaint Fields
                ldgComplainantName: 'اسمك (الشاكي)',
                ldgRespondentName: 'اسم المدعى عليه (الشركة/الشخص)',
                ldgServiceDate: 'تاريخ فشل الخدمة',
                ldgServiceDescription: 'وصف مشكلة الخدمة',
                ldgDesiredResolution: 'الحل المطلوب',
                footerDescription: 'تقديم استشارة قانونية وتمثيل استثنائيين بالنزاهة والاحترافية والتفاني لتحقيق أفضل النتائج لعملائنا.',
                footerQuickLinksTitle: 'روابط سريعة',
                footerLinkHome: 'الرئيسية',
                footerLinkAbout: 'من نحن',
                footerLinkServices: 'الخدمات',
                footerLinkContact: 'اتصل بنا',
                footerLinkLogin: 'تسجيل الدخول',
                footerServicesTitle: 'الخدمات',
                footerService1: 'استشارة قانونية',
                footerService2: 'إنشاء المستندات',
                footerService3: 'مراجعة المستندات',
                footerService4: 'نصيحة قانونية',
                footerService5: 'إدارة القضايا',
                footerContactTitle: 'معلومات الاتصال',
                footerAddress: '123 شارع القانون، المدينة، الولاية 12345',
                footerPhone: '+1 (555) 123-4567',
                footerEmail: 'info@counsel.com',
                footerHours: 'الإثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً',
                footerAppsTitle: 'حمّل تطبيقنا',
                footerAppStoreLabel: 'حمّل من',
                footerAppStoreName: 'App Store',
                footerGooglePlayLabel: 'احصل عليه من',
                footerGooglePlayName: 'Google Play',
                footerCopyright: '© 2024 Untitled. جميع الحقوق محفوظة.',
                footerPrivacy: 'سياسة الخصوصية',
                footerTerms: 'شروط الخدمة',
                footerCookies: 'سياسة ملفات تعريف الارتباط'
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
            
            // Update form labels dynamically
            updateFormFields();
        }

        // Legal Templates
        const templates = {
            'contract-lease': `LEASE AGREEMENT

This Lease Agreement ("Agreement") is entered into on {DATE} between {PARTY_A}, hereinafter referred to as "Lessor," and {PARTY_B}, hereinafter referred to as "Lessee."

1. PROPERTY
The Lessor agrees to lease to the Lessee the property located at {PROPERTY_ADDRESS} (the "Property").

2. TERM
This lease shall commence on {LEASE_START} and shall terminate on {LEASE_END}.

3. RENT
The Lessee agrees to pay the Lessor a monthly rent of {MONTHLY_RENT} on or before the {PAYMENT_DATE} day of each month.

4. SECURITY DEPOSIT
The Lessee has deposited with the Lessor the sum of {SECURITY_DEPOSIT} as security for the faithful performance of the terms of this Agreement.

5. ADDITIONAL TERMS
{ADDITIONAL_TERMS}

6. GOVERNING LAW
This Agreement shall be governed by the laws of the jurisdiction in which the Property is located.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

Lessor: {PARTY_A}
_________________________

Lessee: {PARTY_B}
_________________________`,

            'contract-general': `GENERAL CONTRACT AGREEMENT

This Agreement ("Agreement") is entered into on {DATE} between {PARTY_1}, hereinafter referred to as "Party 1," and {PARTY_2}, hereinafter referred to as "Party 2."

1. SUBJECT MATTER
This Agreement pertains to: {AGREEMENT_SUBJECT}

2. TERMS AND CONDITIONS
{AGREEMENT_DETAILS}

3. DURATION
This Agreement shall remain in effect for: {AGREEMENT_DURATION}

4. PAYMENT TERMS
{PAYMENT_TERMS}

5. GOVERNING LAW
This Agreement shall be governed by applicable laws and regulations.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

Party 1: {PARTY_1}
_________________________

Party 2: {PARTY_2}
_________________________`,

            'complaint': `FORMAL COMPLAINT

To Whom It May Concern,

I, {COMPLAINANT_NAME}, hereby file this formal complaint against {RESPONDENT_NAME} regarding a service dispute.

DATE OF INCIDENT: {SERVICE_DATE}

DESCRIPTION OF ISSUE:
{SERVICE_DESCRIPTION}

DESIRED RESOLUTION:
{DESIRED_RESOLUTION}

I request that this matter be investigated and resolved in accordance with applicable consumer protection laws and regulations.

Respectfully submitted,

{COMPLAINANT_NAME}
Date: {DATE}`
        };

        // Form field configurations
        const formFields = {
            'contract-lease': [
                { name: 'partyA', label: 'ldgPartyA', type: 'text', required: true },
                { name: 'partyB', label: 'ldgPartyB', type: 'text', required: true },
                { name: 'propertyAddress', label: 'ldgPropertyAddress', type: 'text', required: true },
                { name: 'monthlyRent', label: 'ldgMonthlyRent', type: 'text', required: true },
                { name: 'leaseStart', label: 'ldgLeaseStart', type: 'date', required: true },
                { name: 'leaseEnd', label: 'ldgLeaseEnd', type: 'date', required: true },
                { name: 'paymentDate', label: 'ldgPaymentDate', type: 'number', required: true, min: 1, max: 31 },
                { name: 'securityDeposit', label: 'ldgSecurityDeposit', type: 'text', required: true },
                { name: 'additionalTerms', label: 'ldgAdditionalTerms', type: 'textarea', required: false }
            ],
            'contract-general': [
                { name: 'party1', label: 'ldgParty1', type: 'text', required: true },
                { name: 'party2', label: 'ldgParty2', type: 'text', required: true },
                { name: 'agreementSubject', label: 'ldgAgreementSubject', type: 'text', required: true },
                { name: 'agreementDetails', label: 'ldgAgreementDetails', type: 'textarea', required: true },
                { name: 'agreementDuration', label: 'ldgAgreementDuration', type: 'text', required: true },
                { name: 'paymentTerms', label: 'ldgPaymentTerms', type: 'textarea', required: true }
            ],
            'complaint': [
                { name: 'complainantName', label: 'ldgComplainantName', type: 'text', required: true },
                { name: 'respondentName', label: 'ldgRespondentName', type: 'text', required: true },
                { name: 'serviceDate', label: 'ldgServiceDate', type: 'date', required: true },
                { name: 'serviceDescription', label: 'ldgServiceDescription', type: 'textarea', required: true },
                { name: 'desiredResolution', label: 'ldgDesiredResolution', type: 'textarea', required: true }
            ]
        };

        // Update form fields based on document type
        function updateFormFields() {
            const docType = document.querySelector('input[name="docType"]:checked').value;
            const container = document.getElementById('dynamicFields');
            const fields = formFields[docType];
            
            container.innerHTML = '';
            
            fields.forEach(field => {
                const group = document.createElement('div');
                group.className = 'ldg-form-group';
                
                const label = document.createElement('label');
                label.className = 'ldg-label';
                label.setAttribute('data-i18n', field.label);
                label.textContent = translations[currentLang][field.label] || field.label;
                
                group.appendChild(label);
                
                let input;
                if (field.type === 'textarea') {
                    input = document.createElement('textarea');
                    input.className = 'ldg-textarea';
                    input.rows = 4;
                } else {
                    input = document.createElement('input');
                    input.className = 'ldg-input';
                    input.type = field.type;
                    if (field.min !== undefined) input.min = field.min;
                    if (field.max !== undefined) input.max = field.max;
                }
                
                input.name = field.name;
                input.id = field.name;
                input.required = field.required;
                
                group.appendChild(input);
                container.appendChild(group);
            });
        }

        // Generate document using LLM simulation
        async function generateDocument(formData) {
            const docType = formData.get('docType');
            const template = templates[docType];
            
            // Replace placeholders with form data
            let documentText = template;
            const date = new Date().toLocaleDateString();
            documentText = documentText.replace(/{DATE}/g, date);
            
            // Map form data to template placeholders
            const fieldMapping = {
                'contract-lease': {
                    'PARTY_A': formData.get('partyA'),
                    'PARTY_B': formData.get('partyB'),
                    'PROPERTY_ADDRESS': formData.get('propertyAddress'),
                    'MONTHLY_RENT': formData.get('monthlyRent'),
                    'LEASE_START': formData.get('leaseStart'),
                    'LEASE_END': formData.get('leaseEnd'),
                    'PAYMENT_DATE': formData.get('paymentDate'),
                    'SECURITY_DEPOSIT': formData.get('securityDeposit'),
                    'ADDITIONAL_TERMS': formData.get('additionalTerms') || 'None specified.'
                },
                'contract-general': {
                    'PARTY_1': formData.get('party1'),
                    'PARTY_2': formData.get('party2'),
                    'AGREEMENT_SUBJECT': formData.get('agreementSubject'),
                    'AGREEMENT_DETAILS': formData.get('agreementDetails'),
                    'AGREEMENT_DURATION': formData.get('agreementDuration'),
                    'PAYMENT_TERMS': formData.get('paymentTerms')
                },
                'complaint': {
                    'COMPLAINANT_NAME': formData.get('complainantName'),
                    'RESPONDENT_NAME': formData.get('respondentName'),
                    'SERVICE_DATE': formData.get('serviceDate'),
                    'SERVICE_DESCRIPTION': formData.get('serviceDescription'),
                    'DESIRED_RESOLUTION': formData.get('desiredResolution')
                }
            };
            
            const mapping = fieldMapping[docType];
            for (const [key, value] of Object.entries(mapping)) {
                documentText = documentText.replace(new RegExp(`{${key}}`, 'g'), value || 'N/A');
            }
            
            // Simulate LLM processing (in production, this would call an actual LLM API)
            // For demo purposes, we'll enhance the document slightly
            documentText = enhanceDocument(documentText, docType);
            
            return documentText;
        }

        // Simulate LLM enhancement
        function enhanceDocument(text, docType) {
            // In production, this would be an actual LLM call
            // For now, we'll return the formatted template
            return text;
        }

        // Generate plain English explanation
        async function generateExplanation(legalDocument, docType) {
            // Simulate LLM explanation generation
            let explanation = '<ul class="ldg-explanation-list">';
            
            if (docType === 'contract-lease') {
                explanation += '<li><strong>Property:</strong> This agreement covers the rental property at the specified address.</li>';
                explanation += '<li><strong>Rent Payment:</strong> You must pay the monthly rent amount on or before the specified day each month.</li>';
                explanation += '<li><strong>Security Deposit:</strong> The security deposit is held to cover any damages or unpaid rent.</li>';
                explanation += '<li><strong>Lease Term:</strong> The agreement is valid from the start date to the end date specified.</li>';
            } else if (docType === 'contract-general') {
                explanation += '<li><strong>Agreement Purpose:</strong> This contract defines the relationship and obligations between the two parties.</li>';
                explanation += '<li><strong>Duration:</strong> The agreement remains in effect for the specified period.</li>';
                explanation += '<li><strong>Payment Terms:</strong> The payment conditions are as specified in the agreement.</li>';
            } else if (docType === 'complaint') {
                explanation += '<li><strong>Complaint Filed:</strong> This is a formal complaint against the respondent regarding the service issue.</li>';
                explanation += '<li><strong>Issue Description:</strong> The complaint details the specific problem with the service provided.</li>';
                explanation += '<li><strong>Resolution Request:</strong> The complainant requests a specific resolution to the dispute.</li>';
            }
            
            explanation += '</ul>';
            return explanation;
        }

        // Tab switching
        function switchTab(tab) {
            document.querySelectorAll('.ldg-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.ldg-tab-pane').forEach(p => p.classList.remove('active'));
            
            if (tab === 'legal') {
                document.querySelector('.ldg-tab:first-child').classList.add('active');
                document.getElementById('legalTab').classList.add('active');
            } else {
                document.querySelector('.ldg-tab:last-child').classList.add('active');
                document.getElementById('explanationTab').classList.add('active');
            }
        }

        // Copy document to clipboard
        function copyDocument() {
            const text = document.getElementById('legalDocument').textContent;
            navigator.clipboard.writeText(text).then(() => {
                const btn = document.getElementById('copyBtn');
                const originalText = btn.textContent;
                btn.textContent = currentLang === 'ar' ? 'تم النسخ!' : 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        }

        // Form submission
        document.getElementById('documentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const submitBtn = e.target.querySelector('.ldg-submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = currentLang === 'ar' ? 'جارٍ الإنشاء...' : 'Generating...';
            
            try {
                // Generate legal document
                const legalDoc = await generateDocument(formData);
                document.getElementById('legalDocument').textContent = legalDoc;
                
                // Generate explanation
                const explanation = await generateExplanation(legalDoc, formData.get('docType'));
                document.getElementById('plainExplanation').innerHTML = explanation;
                
                // Show output container
                document.getElementById('outputContainer').style.display = 'block';
                document.getElementById('outputContainer').scrollIntoView({ behavior: 'smooth' });
                
                // Reset to legal tab
                switchTab('legal');
            } catch (error) {
                console.error('Error generating document:', error);
                alert(currentLang === 'ar' ? 'حدث خطأ أثناء إنشاء المستند' : 'An error occurred while generating the document');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = translations[currentLang]['ldgGenerateBtn'];
            }
        });

        // Copy button event
        document.getElementById('copyBtn').addEventListener('click', copyDocument);

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            changeLanguage(currentLang);
            updateFormFields();
        });

        // Close language dropdown when clicking outside
        document.addEventListener('click', (event) => {
            const langSelector = document.querySelector('.language-selector');
            if (langSelector && !langSelector.contains(event.target)) {
                document.getElementById('langDropdown').classList.remove('active');
            }
        });