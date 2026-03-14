// Navbar menu reuse
function toggleMenu() {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.getElementById('navbarToggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Language reuse (same pattern as contract-analysis)
let currentLang = localStorage.getItem('language') || 'en';

const translations = {
    en: {
        cbHeroTitle: 'Your 24/7 Smart Legal Advisor: Instant Answers, Lower Cost.',
        cbHeroSubtitle: 'Ask your legal questions, upload documents for analysis, and receive preliminary legal advice in seconds. No appointments, no waiting.',
        cbHeroBtn1: 'Start Chatting Now',
        cbHeroBtn2: 'Try the Chatbot for Free',
        cbHeroBubble1: '"Can you quickly check this contract?"',
        cbHeroBubble2: '"Sure. Upload it and I\'ll highlight key clauses and risks."',
        cbHeroNote: 'A quick preview of how your AI legal chatbot responds.',
        cbChatTitle: 'AI Legal Chatbot',
        cbChatSubtitle: 'Get instant, low-cost preliminary legal answers and quick document checks.',
        cbChatBadge: 'Always On · 24/7',
        cbChatWelcome: 'Hello! I can help with quick legal questions and basic document analysis. Ask something like: "What should I check before signing an employment contract?"',
        cbChatPlaceholder: 'Type your question here...',
        cbChatSend: 'Send',
        cbChatHelper: 'This is a front-end demo only. In production, this chat would call your real AI/backend API.',
        cbHowTitle: 'How It Works',
        cbHow1Label: 'Step 1 · Ask Your Question',
        cbHow1Desc: 'Type your legal question in the chat box or upload a document for a quick review.',
        cbHow2Label: 'Step 2 · Analysis & Response',
        cbHow2Desc: 'The chatbot processes your input and provides a preliminary answer in seconds.',
        cbHow3Label: 'Step 3 · Next Steps',
        cbHow3Desc: 'Use the answer as a starting point, or upgrade to speak with a human lawyer if your case is complex.',
        cbDisclaimerTitle: 'Important Disclaimer',
        cbDisclaimerText: 'The Chatbot provides preliminary and general information and advice, and it does not replace a human lawyer. We recommend using it for initial analysis and simple queries. For complex cases, please contact a licensed attorney.'
    },
    ar: {
        cbHeroTitle: 'مستشارك القانوني الذكي على مدار الساعة: إجابات فورية بتكلفة أقل',
        cbHeroSubtitle: 'اكتب سؤالك القانوني أو ارفع مستندك لتحصل على تحليل أولي خلال ثوانٍ، بدون مواعيد أو انتظار.',
        cbHeroBtn1: 'ابدأ المحادثة الآن',
        cbHeroBtn2: 'جرّب الشات بوت مجاناً',
        cbHeroBubble1: '"هل يمكنك مراجعة هذا العقد بسرعة؟"',
        cbHeroBubble2: '"بالتأكيد. ارفعه وسأبرز البنود الرئيسية والمخاطر."',
        cbHeroNote: 'معاينة سريعة لكيفية استجابة شات بوتك القانوني بالذكاء الاصطناعي.',
        cbChatTitle: 'الشات بوت القانوني بالذكاء الاصطناعي',
        cbChatSubtitle: 'احصل على ردود قانونية أولية منخفضة التكلفة وتحليل بسيط للعقود والوثائق.',
        cbChatBadge: 'متوفر دائماً · 24/7',
        cbChatWelcome: 'مرحباً! يمكنني مساعدتك في الأسئلة القانونية السريعة والتحليل المبدئي للمستندات. جرّب سؤالاً مثل: "ما الذي يجب مراجعته قبل توقيع عقد عمل؟"',
        cbChatPlaceholder: 'اكتب سؤالك هنا...',
        cbChatSend: 'إرسال',
        cbChatHelper: 'هذا مثال تجريبي يعمل في المتصفح فقط. في النسخة الفعلية سيتم الاتصال بشكل آمن بنظام الذكاء الاصطناعي الخاص بـ Untitled.',
        cbHowTitle: 'كيف يعمل',
        cbHow1Label: 'الخطوة 1 · اطرح سؤالك',
        cbHow1Desc: 'اكتب سؤالك القانوني في صندوق المحادثة أو ارفع مستنداً لمراجعة سريعة.',
        cbHow2Label: 'الخطوة 2 · التحليل والرد',
        cbHow2Desc: 'يقوم الشات بوت بمعالجة مدخلاتك ويقدم إجابة أولية خلال ثوانٍ.',
        cbHow3Label: 'الخطوة 3 · الخطوة التالية',
        cbHow3Desc: 'استخدم الإجابة كنقطة بداية، أو انتقل للتحدث مع محامٍ بشري إذا كانت قضيتك معقدة.',
        cbDisclaimerTitle: 'تنبيه هام',
        cbDisclaimerText: 'الشات بوت يوفر معلومات ونصائح أولية عامة ولا يغني عن استشارة محامٍ بشري. استخدمه للأسئلة البسيطة والتحليل المبدئي فقط، وفي القضايا المعقدة عليك دائماً استشارة محامٍ مرخّص.'
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

    // Handle placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (trans[key]) {
            element.setAttribute('placeholder', trans[key]);
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

// Simple front-end chatbot demo
const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');

function appendMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add('chat-message', type);
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ─── Real AI Chatbot Integration ─────────────────────────────────────────
async function realBotReply(userText) {
    // Add a "Thinking…" bubble
    const thinkingMsg = document.createElement('div');
    thinkingMsg.classList.add('chat-message', 'bot', 'thinking-bubble');
    thinkingMsg.textContent = '⏳ Thinking…';
    chatWindow.appendChild(thinkingMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        // Check if user is logged in
        if (!API.isLoggedIn()) {
            thinkingMsg.classList.remove('thinking-bubble');
            thinkingMsg.textContent = '🔒 Please log in to use the AI chatbot. The AI requires authentication.';
            chatWindow.scrollTop = chatWindow.scrollHeight;
            return;
        }

        const aiResponse = await API.AI.analyze({ question: userText });

        // Extract the answer — handle different response shapes from the AI service
        const answer = (aiResponse && aiResponse.data && (
            aiResponse.data.answer ||
            aiResponse.data.result ||
            aiResponse.data.response ||
            aiResponse.data.text ||
            JSON.stringify(aiResponse.data)
        )) || (aiResponse && aiResponse.answer) || 'I received a response but could not extract the text.';

        // Replace the thinking bubble with the real answer
        thinkingMsg.classList.remove('thinking-bubble');
        thinkingMsg.textContent = answer;
    } catch (err) {
        thinkingMsg.classList.remove('thinking-bubble');
        var errMsg = err && err.message ? err.message : String(err);
        if (errMsg.indexOf('offline') !== -1 || errMsg.indexOf('Cannot connect') !== -1 || errMsg.indexOf('503') !== -1) {
            thinkingMsg.textContent = '⚠️ The AI service is currently offline. Please start the backend server and try again.';
        } else {
            thinkingMsg.textContent = '⚠️ Sorry, an error occurred: ' + errMsg;
        }
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage(text, "user");
    chatInput.value = "";
    realBotReply(text);
}

chatSendBtn.addEventListener("click", handleSend);
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
    }
});