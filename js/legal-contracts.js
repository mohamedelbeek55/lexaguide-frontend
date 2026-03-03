// Navbar menu toggle
        function toggleMenu() {
            const menu = document.getElementById('navbarMenu');
            const toggle = document.getElementById('navbarToggle');
            if (!menu || !toggle) return;
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        }

        // Match home page navbar scroll behavior
        window.addEventListener('scroll', function () {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;
            if (window.scrollY > 10) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });

        // Language handling
        let currentLang = localStorage.getItem('language') || 'en';

        const translations = {
            en: {
                home: 'Home',
                services: 'Services',
                about: 'About',
                faq: 'FAQ',
                login: 'Login',
                signup: 'Sign Up',
                heroBadge: 'AI-Assisted Procedures • Human-Verified',
                heroSubtitle: 'Legal Contracts & Procedures Hub',
                heroOnline: 'Guided • 24/7',
                heroMetaRegion: 'Middle East Legal Procedures',
                heroTitle: 'Legal Contracts & Document Procedures',
                heroText: 'Quickly find how to issue, authenticate, or renew your legal contracts with clear steps, required documents, official fees, and timelines.',
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
                categoriesChip: 'Curated for individuals & SMEs',
                catRealEstate: 'Real Estate Contracts',
                catRealEstateText: 'Sale, lease, mortgage, and property transfer agreements involving residential or commercial units.',
                catLabor: 'Labor & Employment',
                catLaborText: 'Employment contracts, offer letters, termination documents, and sponsorship-related procedures.',
                catCommercial: 'Commercial & Corporate',
                catCommercialText: 'Partnership agreements, shareholder resolutions, agency contracts, and MoUs.',
                catPersonal: 'Personal & Family',
                catPersonalText: 'Marriage contracts, guardianship, inheritance documentation, and personal status procedures.',
                catBanking: 'Banking & Finance',
                catBankingText: 'Loan agreements, guarantees, credit facilities, and security documentation.',
                catCustom: 'Custom or Cross-Border Contracts',
                catCustomText: 'Complex, multi-jurisdictional, or sector-specific agreements requiring tailored drafting and approvals.',
                catCustomNote: 'Use this for highly specialized procedures. We’ll still outline a generic path you can refine with a lawyer.',
                guideTitle: 'Issuance Guide — Step-by-Step',
                guideSubtitle: 'Follow a guided flow for issuing or authenticating a selected contract. Steps may vary by jurisdiction.',
                modeLabel: 'Mode:',
                step1Title: 'Identify Contract Type & Parties',
                step1Badge: 'Digital / Physical',
                step1Text: 'Confirm the exact contract category, number of parties, governing law, and language (Arabic, English, or bilingual).',
                step2Title: 'Prepare Draft & Validate Terms',
                step2Badge: 'Digital Preferred',
                step2Text: 'Draft or review the contract with clear obligations, duration, renewal terms, and dispute-resolution clause.',
                step3Title: 'Choose Digital or Physical Channel',
                step3Badge: 'Omni-channel',
                step3Text: 'Select whether to finalize via government e-portal, notary, or relevant authority office.',
                step4Title: 'Pay Official Fees & Submit',
                step4Badge: 'Fees + Submission',
                step4Text: 'Pay applicable governmental fees online or at the counter, then submit all required documents for review.',
                step5Title: 'Receive, Register & Store',
                step5Badge: 'Completion',
                step5Text: 'Once approved, download or collect the final document, then ensure it is safely registered and stored.',
                modeCardTitle: 'Digital vs. Physical Issuance',
                modeCardText: 'Many jurisdictions support fully digital procedures, but some contracts still require physical presence.',
                modeDigital: 'Digital',
                modeDigitalText: 'Portals, e-signatures, online payment',
                modePhysical: 'Physical',
                modePhysicalText: 'Notary visits, ministry counters',
                modeTip1: 'Always verify the latest procedure on official government websites before initiating.',
                modeTip2: 'For high-value contracts, involve a qualified lawyer to review and negotiate terms.',
                reqTitle: 'Required Documents & Locations',
                reqSubtitle: 'Key documents, typical government entities, and indicative working hours. Use placeholders to map to your jurisdiction.',
                reqChecklistTitle: 'Document Preparation Checklist',
                reqChecklist1: 'Ensure all IDs and registration documents are valid and unexpired.',
                reqChecklist2: 'Prepare both physical and scanned copies (PDF) of key documents.',
                reqChecklist3: 'Keep Arabic translations where required by local regulations.',
                reqChecklist4: 'Carry original documents for verification, even if applying online.',
                reqChecklistNote: 'For each contract category you select, adapt this checklist to your local authority’s latest published requirements.',
                feesTitle: 'Fees & Timeline Overview',
                feesSubtitle: 'Replace these indicative ranges with your jurisdiction’s official fee schedules and processing times.',
                feeRealEstate: 'Real Estate Contract',
                feeRealEstateText: 'Title transfer, new lease registration, or mortgage registration.',
                feeLabor: 'Labor & Employment',
                feeLaborText: 'New work permit, visa stamping, or contract attestation.',
                feeCommercial: 'Commercial & Corporate',
                feeCommercialText: 'Company formation, license renewal, or shareholder changes.',
                faqTitle: 'Frequently Asked Questions',
                faqSubtitle: 'General guidance only. Always validate with an officially licensed professional or authority.',
                faqQ1: 'Do I always need a lawyer to issue a contract?',
                faqQ2: 'Are digital signatures legally valid?',
                faqQ3: 'What if my documents are in a foreign language?',
                faqQ4: 'How can I track the status of my application?',
                faqNoticeTitle: 'Important Notice',
                faqNoticeText: 'This page is a structured guide intended to help you understand the typical flow of legal contract procedures. It is not a substitute for official regulations or personalized legal advice.',
                faqNotice1: 'Always verify the latest rules on official government portals.',
                faqNotice2: 'Laws and fees can change frequently across Middle Eastern jurisdictions.',
                faqNotice3: 'For critical decisions, consult a licensed lawyer in your country.',
                faqNoticeFootnote: 'Use this as a neutral starting point to brief your legal advisor and prepare your documents efficiently.',
                searchButton: 'Find Procedure',
                searchHintPrefix: 'Example queries:',
                searchHintExamples: '“Real Estate Sale Contract”, “Work Visa Sponsorship”, “Commercial Agency License”',
                searchPlaceholder: 'Search by contract type or procedure (e.g., "lease contract")',
                tagProperty: 'Property',
                tagHR: 'HR',
                tagBusiness: 'Business',
                tagCivil: 'Civil',
                tagFinance: 'Finance',
                tagAdvanced: 'Advanced',
                reqRealEstateTitle: 'Title Transfer / Tenancy Registration',
                reqRealEstateNeed1: 'Original title deed or ownership certificate',
                reqRealEstateNeed2: 'National IDs / Passports of all parties',
                reqRealEstateNeed3: 'Signed sale / lease contract',
                reqRealEstateAuthorityTitle: 'Typical Authority',
                reqRealEstateAuthorityName: 'Land Department / Real Estate Registration Office',
                reqRealEstateHours: 'Sun–Thu, 8:00–14:00',
                reqRealEstateLocationTitle: 'Office / Map Placeholder',
                reqRealEstateLocationBox: 'Embed map / location link here',
                reqLaborTitle: 'New Work Permit / Employment Visa',
                reqLaborNeed1: 'Passport copy, photos, and medical test (where applicable)',
                reqLaborNeed2: 'Company commercial registration / license',
                reqLaborNeed3: 'Signed employment contract with salary details',
                reqLaborAuthorityTitle: 'Typical Authority',
                reqLaborAuthorityName: 'Ministry of Labor / Immigration Authority',
                reqLaborHours: 'Sun–Thu, 8:00–15:00',
                reqLaborLocationTitle: 'Office / Map Placeholder',
                reqLaborLocationBox: 'Embed MOL service center map here',
                reqCommercialTitle: 'Trade License Issuance / Renewal',
                reqCommercialNeed1: 'Memorandum of Association or Articles',
                reqCommercialNeed2: 'Partners’ IDs / Passports',
                reqCommercialNeed3: 'Office lease contract and municipality approval',
                reqCommercialAuthorityTitle: 'Typical Authority',
                reqCommercialAuthorityName: 'Department of Economic Development / Free Zone Authority',
                reqCommercialHours: 'Sun–Thu, 8:00–17:00',
                reqCommercialLocationTitle: 'Office / Map Placeholder',
                reqCommercialLocationBox: 'Link to economic department service center map',
                feeRowLabelFees: 'Official fees (indicative)',
                feeRowLabelTimeline: 'Estimated timeline',
                feeRowLabelUrgent: 'Urgent / VIP channels',
                feeRealEstateFees: '1–4% of contract value + admin fees',
                feeRealEstateTimeline: '1–5 working days',
                feeRealEstateUrgent: 'Available in some jurisdictions',
                feeLaborFees: 'Fixed fee bands by category',
                feeLaborTimeline: '3–10 working days',
                feeLaborTracking: 'Typically via MOL / immigration portal',
                feeRowLabelTracking: 'Online tracking',
                feeCommercialFees: 'Package-based or activity-based',
                feeCommercialTimeline: '3–14 working days',
                feeCommercialDeps: 'Security approvals, name reservation',
                feeRowLabelDeps: 'Dependencies'
            },
            ar: {
                home: 'الرئيسية',
                services: 'الخدمات',
                about: 'من نحن',
                faq: 'الأسئلة الشائعة',
                login: 'تسجيل الدخول',
                signup: 'إنشاء حساب',
                heroBadge: 'إجراءات قانونية مدعومة بالذكاء الاصطناعي',
                heroSubtitle: 'مركز موحد لعقودك وإجراءات المستندات',
                heroOnline: 'إرشاد مستمر ٢٤/٧',
                heroMetaRegion: 'إجراءات قانونية مهيأة للشرق الأوسط',
                heroTitle: 'العقود القانونية وإجراءات المستندات',
                heroText: 'اعرف بسرعة كيفية إصدار أو توثيق أو تجديد عقودك القانونية مع خطوات واضحة، والمستندات المطلوبة، والرسوم الرسمية، والمدة المتوقعة.',
                heroSnapshotTitle: 'لمحة سريعة عن رحلة العقد',
                heroStep1Title: 'اختر نوع العقد',
                heroStep1Text: 'اختر من عقود العقار أو العمل أو التجارة أو غيرها من العقود المتخصصة.',
                heroStep2Title: 'راجع المتطلبات والرسوم',
                heroStep2Text: 'تأكد من المستندات المطلوبة، ومواقع الجهات الحكومية، والرسوم الرسمية.',
                heroStep3Title: 'اتبع الخطوات الإرشادية',
                heroStep3Text: 'استخدم القنوات الرقمية أو الحضور الشخصي مع وضوح في مدة الإنجاز.',
                heroNotice: 'ليست نصيحة قانونية – للاستخدام الإرشادي فقط',
                heroNoticeTag: 'مصمم لقوانين الشرق الأوسط',
                categoriesTitle: 'فئات العقود',
                categoriesSubtitle: 'تصفّح المجموعات الرئيسية للعقود القانونية، ثم اختر عقدك لترى المتطلبات والإجراءات النموذجية.',
                categoriesChip: 'مصمم للأفراد والشركات الصغيرة',
                catRealEstate: 'عقود العقار',
                catRealEstateText: 'عقود البيع والإيجار والرهن ونقل الملكية للوحدات السكنية أو التجارية.',
                catLabor: 'عقود العمل والموارد البشرية',
                catLaborText: 'عقود العمل، وعروض التوظيف، وإنهاء الخدمة، وإجراءات الكفالة.',
                catCommercial: 'العقود التجارية والشركات',
                catCommercialText: 'عقود الشراكة، وقرارات الشركاء، وعقود الوكالات، ومذكرات التفاهم.',
                catPersonal: 'العقود والأحوال الشخصية',
                catPersonalText: 'عقود الزواج، والولاية، والورثة، وإجراءات الأحوال الشخصية.',
                catBanking: 'التمويل والبنوك',
                catBankingText: 'عقود القروض، والضمانات، والتسهيلات الائتمانية، ومستندات الرهن.',
                catCustom: 'عقود خاصة أو عبر الحدود',
                catCustomText: 'عقود معقدة أو متعددة الدول أو مرتبطة بقطاعات متخصصة تحتاج لصياغة مخصصة.',
                catCustomNote: 'استخدم هذه الفئة للعقود المتقدمة جداً، ثم نسّق التفاصيل مع مستشارك القانوني.',
                guideTitle: 'دليل الإصدار – خطوة بخطوة',
                guideSubtitle: 'اتبع التسلسل الإرشادي لإصدار أو توثيق العقد الذي اخترته. قد تختلف التفاصيل حسب الدولة.',
                modeLabel: 'الوضع:',
                step1Title: 'تحديد نوع العقد والأطراف',
                step1Badge: 'رقمي / حضوري',
                step1Text: 'حدد نوع العقد الدقيق، وعدد الأطراف، والقانون المنظّم، ولغة العقد (العربية، الإنجليزية، أو ثنائي اللغة).',
                step2Title: 'إعداد المسودة ومراجعة البنود',
                step2Badge: 'يفضل أن يكون رقمياً',
                step2Text: 'صياغة أو مراجعة العقد مع توضيح الالتزامات والمدة والتجديد وآلية حل النزاعات.',
                step3Title: 'اختيار القناة الرقمية أو الحضور الشخصي',
                step3Badge: 'قنوات متعددة',
                step3Text: 'اختر ما إذا كان الإجراء عبر البوابة الإلكترونية، أو كاتب العدل، أو الجهة الحكومية المختصة.',
                step4Title: 'سداد الرسوم الرسمية وتقديم الطلب',
                step4Badge: 'الرسوم + التقديم',
                step4Text: 'سدّد الرسوم الحكومية إلكترونياً أو في شباك الخدمة، ثم قدّم جميع المستندات للمراجعة.',
                step5Title: 'استلام العقد وتسجيله وحفظه',
                step5Badge: 'إتمام الإجراء',
                step5Text: 'بعد الموافقة، قم بتحميل أو استلام النسخة النهائية، ثم تأكد من تسجيلها وحفظها بشكل آمن.',
                modeCardTitle: 'الإصدار الرقمي مقابل الحضور الشخصي',
                modeCardText: 'العديد من الدول تدعم الإجراءات الرقمية بالكامل، لكن بعض العقود ما زالت تحتاج للحضور والوجود الفعلي.',
                modeDigital: 'رقمي',
                modeDigitalText: 'بوابات إلكترونية، توقيع إلكتروني، ودفع عبر الإنترنت',
                modePhysical: 'حضوري',
                modePhysicalText: 'زيارة كاتب العدل أو مكاتب الجهات الحكومية',
                modeTip1: 'تحقق دائماً من آخر التحديثات عبر المواقع والبوابات الرسمية قبل البدء.',
                modeTip2: 'في العقود ذات القيمة العالية، يفضّل إشراك محامٍ مرخّص لمراجعة البنود والتفاوض.',
                reqTitle: 'المستندات المطلوبة والأماكن',
                reqSubtitle: 'أهم المستندات والجهات الحكومية والمدة التقريبية للعمل. عدّل هذه البيانات بما يناسب بلدك.',
                reqChecklistTitle: 'قائمة تحضير المستندات',
                reqChecklist1: 'تأكد من أن جميع الهويات والسجلات التجارية سارية المفعول.',
                reqChecklist2: 'جهّز نسخاً ورقية ورقمية (PDF) من المستندات المهمة.',
                reqChecklist3: 'وفّر ترجمة عربية للمستندات الأجنبية إذا كانت مطلوبة قانوناً.',
                reqChecklist4: 'احمل الأصول معك للتحقق حتى لو قدّمت الطلب إلكترونياً.',
                reqChecklistNote: 'لكل فئة من العقود، حدّث هذه القائمة بناءً على متطلبات الجهة الرسمية في بلدك.',
                feesTitle: 'الرسوم والمدة الزمنية المتوقعة',
                feesSubtitle: 'استبدل هذه الأرقام الإرشادية بالجداول الرسمية للرسوم ومدة الإنجاز في بلدك.',
                feeRealEstate: 'عقد عقاري',
                feeRealEstateText: 'نقل ملكية، أو تسجيل عقد إيجار جديد، أو تسجيل رهن.',
                feeLabor: 'عقود العمل والموارد البشرية',
                feeLaborText: 'إصدار تصريح عمل جديد، أو ختم الإقامة، أو توثيق عقد العمل.',
                feeCommercial: 'العقود التجارية وتأسيس الشركات',
                feeCommercialText: 'تأسيس شركة، أو تجديد الرخصة التجارية، أو تعديل الشركاء.',
                faqTitle: 'الأسئلة الشائعة',
                faqSubtitle: 'معلومات عامة فقط. تأكد دائماً من التفاصيل مع الجهات الرسمية أو المستشار القانوني.',
                faqQ1: 'هل أحتاج دائماً إلى محامٍ لإصدار العقد؟',
                faqQ2: 'هل التوقيع الإلكتروني معترف به قانونياً؟',
                faqQ3: 'ماذا لو كانت مستنداتي بلغة أجنبية؟',
                faqQ4: 'كيف يمكنني متابعة حالة طلبي؟',
                faqNoticeTitle: 'تنبيه مهم',
                faqNoticeText: 'هذه الصفحة دليل منظم لمساعدتك على فهم التسلسل العام لإجراءات العقود، لكنها لا تغني عن الأنظمة الرسمية أو الاستشارة القانونية المتخصصة.',
                faqNotice1: 'تحقق دائماً من آخر اللوائح عبر البوابات والمصادر الحكومية الرسمية.',
                faqNotice2: 'تتغير القوانين والرسوم بشكل متكرر في دول الشرق الأوسط.',
                faqNotice3: 'في القرارات المصيرية، استعن بمحامٍ مرخّص في بلدك.',
                faqNoticeFootnote: 'استخدم هذا الدليل كنقطة انطلاق لشرح حالتك لمحاميك وتحضير مستنداتك بكفاءة.',
                searchButton: 'ابحث عن الإجراء',
                searchHintPrefix: 'أمثلة للبحث:',
                searchHintExamples: '«عقد بيع عقار»، «إصدار إقامة عمل»، «تسجيل وكالة تجارية»',
                searchPlaceholder: 'ابحث حسب نوع العقد أو الإجراء (مثال: عقد إيجار، عقد عمل)',
                tagProperty: 'عقار',
                tagHR: 'موارد بشرية',
                tagBusiness: 'أعمال',
                tagCivil: 'أحوال شخصية',
                tagFinance: 'تمويل',
                tagAdvanced: 'متقدم',
                reqRealEstateTitle: 'نقل ملكية / تسجيل عقد إيجار',
                reqRealEstateNeed1: 'أصل صك الملكية أو شهادة التملك',
                reqRealEstateNeed2: 'هويات أو جوازات سفر جميع الأطراف',
                reqRealEstateNeed3: 'عقد بيع أو إيجار موقع بين الأطراف',
                reqRealEstateAuthorityTitle: 'الجهة المختصة',
                reqRealEstateAuthorityName: 'دائرة الأراضي / مكتب تسجيل العقارات',
                reqRealEstateHours: 'الأحد – الخميس، ٨:٠٠ صباحاً – ٢:٠٠ ظهراً',
                reqRealEstateLocationTitle: 'المكتب / خريطة الموقع',
                reqRealEstateLocationBox: 'إضافة رابط خريطة أو موقع الفرع هنا',
                reqLaborTitle: 'تصريح عمل جديد / تأشيرة عمل',
                reqLaborNeed1: 'صورة جواز السفر، وصور شخصية، ونتيجة الفحص الطبي (إن وجدت)',
                reqLaborNeed2: 'السجل التجاري / الرخصة التجارية للشركة',
                reqLaborNeed3: 'عقد عمل موقع يوضح الراتب والمزايا',
                reqLaborAuthorityTitle: 'الجهة المختصة',
                reqLaborAuthorityName: 'وزارة العمل / هيئة الهجرة أو تصاريح العمل',
                reqLaborHours: 'الأحد – الخميس، ٨:٠٠ صباحاً – ٣:٠٠ عصراً',
                reqLaborLocationTitle: 'المكتب / خريطة الموقع',
                reqLaborLocationBox: 'إضافة رابط خريطة لمركز خدمات وزارة العمل',
                reqCommercialTitle: 'إصدار / تجديد الرخصة التجارية',
                reqCommercialNeed1: 'عقد التأسيس أو النظام الأساسي للشركة',
                reqCommercialNeed2: 'هويات أو جوازات سفر الشركاء',
                reqCommercialNeed3: 'عقد إيجار المكتب وموافقة البلدية',
                reqCommercialAuthorityTitle: 'الجهة المختصة',
                reqCommercialAuthorityName: 'دائرة التنمية الاقتصادية / هيئة المنطقة الحرة',
                reqCommercialHours: 'الأحد – الخميس، ٨:٠٠ صباحاً – ٥:٠٠ مساءً',
                reqCommercialLocationTitle: 'المكتب / خريطة الموقع',
                reqCommercialLocationBox: 'إضافة رابط خريطة لمركز خدمة دائرة التنمية الاقتصادية',
                feeRowLabelFees: 'الرسوم الرسمية (تقريبي)',
                feeRowLabelTimeline: 'المدة المتوقعة للإنجاز',
                feeRowLabelUrgent: 'الخدمة العاجلة / المسار السريع',
                feeRealEstateFees: '١–٤٪ من قيمة العقد + رسوم إدارية',
                feeRealEstateTimeline: 'من ١ إلى ٥ أيام عمل',
                feeRealEstateUrgent: 'متوفر في بعض الجهات',
                feeLaborFees: 'شرائح رسوم ثابتة حسب فئة العامل أو المنشأة',
                feeLaborTimeline: 'من ٣ إلى ١٠ أيام عمل',
                feeLaborTracking: 'عادة عبر بوابة وزارة العمل أو الهجرة',
                feeRowLabelTracking: 'متابعة الطلب إلكترونياً',
                feeCommercialFees: 'رسوم حزم أو حسب النشاط التجاري',
                feeCommercialTimeline: 'من ٣ إلى ١٤ يوم عمل',
                feeCommercialDeps: 'موافقات أمنية، حجز الاسم التجاري',
                feeRowLabelDeps: 'اعتمادات ومتطلبات إضافية'
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

            document.querySelectorAll('[data-i18n]').forEach((el) => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    el.textContent = translations[lang][key];
                }
            });

            // Update search input placeholder separately
            const searchInput = document.getElementById('procedureSearch');
            if (searchInput && translations[lang] && translations[lang].searchPlaceholder) {
                searchInput.placeholder = translations[lang].searchPlaceholder;
            }

            const langText = document.getElementById('langText');
            langText.textContent = lang === 'ar' ? 'العربية' : 'English';
            document.getElementById('langDropdown').classList.remove('active');
        }

        // Close language dropdown when clicking outside
        document.addEventListener('click', (event) => {
            const langSelector = document.querySelector('.language-selector');
            if (langSelector && !langSelector.contains(event.target)) {
                const dropdown = document.getElementById('langDropdown');
                if (dropdown) dropdown.classList.remove('active');
            }
        });

        // Initialize language on load
        document.addEventListener('DOMContentLoaded', function () {
            changeLanguage(currentLang);
        });

        (function () {
            const input = document.getElementById('procedureSearch');
            const btn = document.getElementById('procedureSearchBtn');
            if (!input || !btn) return;

            btn.addEventListener('click', function () {
                const value = (input.value || '').trim();
                if (!value) {
                    if (currentLang === 'ar') {
                        alert('الرجاء إدخال نوع عقد أو كلمة مفتاحية للإجراء (مثال: إيجار، عمل).');
                    } else {
                        alert('Please enter a contract type or procedure keyword to begin (e.g., "lease", "employment").');
                    }
                    return;
                }
                if (currentLang === 'ar') {
                    alert('هذا عرض توضيحي يقوم فقط بتصفية المحتوى بشكل افتراضي للبحث عن: "' + value + '". اربطه بالواجهة الخلفية أو الذكاء الاصطناعي للحصول على نتائج حقيقية.');
                } else {
                    alert('This demo will conceptually filter content for: "' + value + '". Integrate with your backend or AI for real results.');
                }
            });
        })();

        (function () {
            const cards = document.querySelectorAll('.lc-category-card');
            if (!cards.length) return;

            cards.forEach(function (card) {
                card.addEventListener('click', function () {
                    cards.forEach(function (c) { c.classList.remove('lc-category-active'); });
                    card.classList.add('lc-category-active');
                });
            });
        })();

        (function () {
            const buttons = document.querySelectorAll('.lc-mode-toggle');
            const label = document.getElementById('guideModeLabel');
            const steps = document.querySelectorAll('.guide-step');
            if (!buttons.length || !label) return;

            function setMode(mode) {
                buttons.forEach(function (btn) {
                    const isActive = btn.getAttribute('data-mode') === mode;
                    btn.classList.toggle('lc-mode-active', isActive);
                });

                if (mode === 'digital') {
                    label.textContent = 'Primarily Digital';
                    steps.forEach(function (step) { step.classList.remove('lc-step-muted'); });
                } else if (mode === 'physical') {
                    label.textContent = 'Primarily Physical';
                    steps.forEach(function (step) { step.classList.add('lc-step-muted'); });
                } else {
                    label.textContent = 'Digital + Physical';
                }
            }

            buttons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    const mode = btn.getAttribute('data-mode');
                    setMode(mode);
                });
            });

            setMode('digital');
        })();

        (function () {
            const toggles = document.querySelectorAll('.lc-faq-toggle');
            if (!toggles.length) return;

            toggles.forEach(function (toggle) {
                toggle.addEventListener('click', function () {
                    const panel = toggle.parentElement && toggle.parentElement.querySelector('.lc-faq-panel');
                    const icon = toggle.querySelector('.lc-faq-icon');
                    if (!panel) return;
                    const isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';

                    document.querySelectorAll('.lc-faq-panel').forEach(function (p) {
                        p.style.maxHeight = '';
                    });
                    document.querySelectorAll('.lc-faq-icon').forEach(function (i) {
                        i.textContent = '+';
                        i.classList.remove('lc-faq-icon-open');
                    });

                    if (!isOpen) {
                        panel.style.maxHeight = panel.scrollHeight + 'px';
                        if (icon) {
                            icon.textContent = '−';
                            icon.classList.add('lc-faq-icon-open');
                        }
                    }
                });
            });
        })();