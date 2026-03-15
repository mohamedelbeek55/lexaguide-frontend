const LS_KEY = "legal_consultations_bookings"
const listEl = document.getElementById("bookingList")
const pendingCountEl = document.getElementById("pendingCount")
const acceptedCountEl = document.getElementById("acceptedCount")
const declinedCountEl = document.getElementById("declinedCount")

// Chat Elements
const chatSection = document.getElementById("chat-section")
const chatMessages = document.getElementById("chat-messages")
const chatInput = document.getElementById("chat-input")
const chatSend = document.getElementById("chat-send")
const closeChatBtn = document.getElementById("close-chat")
const endSessionBtn = document.getElementById("end-session")

// Language Support
const currentLang = localStorage.getItem('language') || 'en';
const chatTranslations = {
  en: {
    welcome: "You are now connected with the client.",
    inputPlaceholder: "Type your response...",
    send: "Send",
    online: "Online",
    offline: "Offline",
    endSession: "End Session",
    confirmEnd: "Are you sure you want to end this consultation session?",
    error: "Failed to send message"
  },
  ar: {
    welcome: "أنت الآن متصل بالعميل.",
    inputPlaceholder: "اكتب ردك هنا...",
    send: "إرسال",
    online: "متصل",
    offline: "غير متصل",
    endSession: "إنهاء الجلسة",
    confirmEnd: "هل أنت متأكد أنك تريد إنهاء جلسة الاستشارة هذه؟",
    error: "فشل في إرسال الرسالة"
  }
};

function t(key) {
  return chatTranslations[currentLang] ? chatTranslations[currentLang][key] : chatTranslations['en'][key];
}

function applyTranslations() {
  if (currentLang === 'ar') {
    document.body.dir = "rtl";
    document.body.classList.add('rtl');
  }
  if (chatInput) chatInput.placeholder = t('inputPlaceholder');
  if (endSessionBtn) endSessionBtn.textContent = t('endSession');
  const statusText = document.getElementById('chat-client-status');
  if (statusText) statusText.innerHTML = `<span class="status-dot"></span> ${t('online')}`;
}

let currentConsultationId = null;
let lastMessageCount = 0;

// ─── Chat Logic ──────────────────────────────────────────────────────────────
async function openChat(consultationId, clientName) {
  currentConsultationId = consultationId;
  chatSection.classList.remove("hidden");
  chatSection.scrollIntoView({ behavior: 'smooth' });

  if (clientName) {
    document.getElementById("chat-client-name").textContent = clientName;
    document.getElementById("chat-client-avatar").textContent = clientName[0].toUpperCase();
  }

  applyTranslations();

  // Initial load
  lastMessageCount = 0;
  loadMessages();
}

async function loadMessages() {
  if (!currentConsultationId || typeof API === 'undefined') return;
  try {
    const resp = await API.Consult.getMessages(currentConsultationId);
    const messages = resp.messages || [];

    if (messages.length !== lastMessageCount) {
      renderMessages(messages);
      lastMessageCount = messages.length;
      scrollToBottom();
    }
  } catch (err) {
    console.error("Failed to load messages:", err);
  }
}

function renderMessages(messages) {
  chatMessages.innerHTML = messages.map(m => {
    const time = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return `
            <div class="chat-bubble ${m.senderType === 'lawyer' ? 'lawyer' : 'user'}">
                <div class="bubble-text">${m.message}</div>
                ${time ? `<span class="bubble-time">${time}</span>` : ''}
            </div>
        `;
  }).join('');
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage() {
  const text = chatInput.value.trim();
  if (!text || !currentConsultationId) return;

  try {
    // Show local bubble immediately
    chatMessages.innerHTML += `
            <div class="chat-bubble lawyer">
                <div class="bubble-text">${text}</div>
                <span class="bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;
    scrollToBottom();
    chatInput.value = "";

    await API.Consult.sendMessage(currentConsultationId, text);
    loadMessages();
  } catch (err) {
    alert(t('error') + ": " + err.message);
  }
}

if (chatSend) {
  chatSend.addEventListener("click", sendChatMessage);
}
if (chatInput) {
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendChatMessage();
  });
}

if (closeChatBtn) {
  closeChatBtn.addEventListener("click", () => {
    chatSection.classList.add("hidden");
    currentConsultationId = null;
  });
}

if (endSessionBtn) {
  endSessionBtn.addEventListener("click", async () => {
    if (!currentConsultationId) return;
    if (confirm(t('confirmEnd'))) {
      try {
        await API.Consult.updateStatus(currentConsultationId, 'completed');
        chatSection.classList.add("hidden");
        currentConsultationId = null;
        load(); // Reload list
      } catch (err) {
        alert("Failed to end session: " + err.message);
      }
    }
  });
}

// Auto-refresh chat every 3 seconds if open
setInterval(() => {
  if (currentConsultationId) loadMessages();
}, 3000);

// ─── List Logic ──────────────────────────────────────────────────────────────
function render(bookings) {
  if (!listEl) return;
  listEl.innerHTML = ""
  bookings.forEach((b, i) => {
    const card = document.createElement("div")
    card.className = "card enter"
    card.style.animationDelay = (i * .1) + "s"

    const isAccepted = b.status === "accepted" || b.status === "confirmed" || b.status === "active"
    const clientName = b.user_name || "Client";
    const chatBtn = isAccepted ? `<button class="btn" style="background:var(--gold); color:#0d1117;" onclick="openChat('${b.id}', '${clientName}')">Chat</button>` : ""

    card.innerHTML = `
      <div class="row">
        <h3 class="title">${b.legal_area}</h3>
        <span class="badge ${b.status}">${b.status.toUpperCase()}</span>
      </div>
      <div class="muted" style="font-size:14px; margin-bottom:8px;">${b.description || "No description provided."}</div>
      <div class="row">
        <span class="muted">${new Date(b.created_at).toLocaleDateString()}</span>
        <div class="actions">
          ${chatBtn}
          ${b.status === "pending" ? `
            <button class="btn accept" onclick="updateStatus('${b.id}', 'accepted')">Accept</button>
            <button class="btn decline" onclick="updateStatus('${b.id}', 'declined')">Decline</button>
          ` : ""}
        </div>
      </div>
    `
    listEl.appendChild(card)
  })
}

async function updateStatus(id, status) {
  if (typeof API !== "undefined") {
    try {
      await API.Consult.updateStatus(id, status)
      load()
    } catch (err) {
      alert(err.message)
    }
    return
  }
}

async function load() {
  if (typeof API !== "undefined") {
    try {
      const resp = await API.Consult.mine()
      const bookings = resp.data || []
      render(bookings)

      if (pendingCountEl) pendingCountEl.textContent = bookings.filter(b => b.status === "pending").length
      if (acceptedCountEl) acceptedCountEl.textContent = bookings.filter(b => b.status === "accepted" || b.status === "confirmed" || b.status === "active").length
      if (declinedCountEl) declinedCountEl.textContent = bookings.filter(b => b.status === "declined").length
    } catch (err) {
      console.error(err)
    }
    return
  }
}

window.openChat = openChat;
window.updateStatus = updateStatus;
load()
