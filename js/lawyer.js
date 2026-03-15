const LS_KEY = "legal_consultations_bookings"
const listEl = document.getElementById("bookingList")
const pendingCountEl = document.getElementById("pendingCount")
const totalCountEl = document.getElementById("totalCount")
const revenueEl = document.getElementById("revenue")

// Chat Elements
const chatSection = document.getElementById("chat-section")
const chatMessages = document.getElementById("chat-messages")
const chatInput = document.getElementById("chat-input")
const chatSend = document.getElementById("chat-send")

let currentConsultationId = null;

// ─── Chat Logic ──────────────────────────────────────────────────────────────
async function openChat(consultationId) {
    currentConsultationId = consultationId;
    chatSection.classList.remove("hidden");
    chatSection.scrollIntoView({ behavior: 'smooth' });
    
    // Initial load
    loadMessages();
}

async function loadMessages() {
    if (!currentConsultationId || typeof API === 'undefined') return;
    try {
        const resp = await API.Consult.getMessages(currentConsultationId);
        const messages = resp.messages || [];
        renderMessages(messages);
    } catch (err) {
        console.error("Failed to load messages:", err);
    }
}

function renderMessages(messages) {
    chatMessages.innerHTML = messages.map(m => `
        <div class="chat-bubble ${m.senderType === 'lawyer' ? 'lawyer' : 'user'}">
            ${m.message}
        </div>
    `).join('');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text || !currentConsultationId) return;

    try {
        await API.Consult.sendMessage(currentConsultationId, text);
        chatInput.value = "";
        loadMessages();
    } catch (err) {
        alert("Failed to send message: " + err.message);
    }
}

chatSend.addEventListener("click", sendChatMessage);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendChatMessage();
});

// Auto-refresh chat every 3 seconds if open
setInterval(() => {
    if (currentConsultationId) loadMessages();
}, 3000);

// ─── List Logic ──────────────────────────────────────────────────────────────
function render(bookings) {
  listEl.innerHTML = ""
  bookings.forEach((b, i) => {
    const card = document.createElement("div")
    card.className = "card enter"
    card.style.animationDelay = (i * .1) + "s"
    
    const isAccepted = b.status === "accepted" || b.status === "confirmed"
    const chatBtn = isAccepted ? `<button class="btn" style="background:var(--gold); color:#0d1117;" onclick="openChat('${b.id}')">Chat</button>` : ""

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
      
      const pending = bookings.filter(b => b.status === "pending").length
      pendingCountEl.textContent = pending
      totalCountEl.textContent = bookings.length
      revenueEl.textContent = "$" + (bookings.filter(b => b.status === "accepted").length * 400)
    } catch (err) {
      console.error(err)
    }
    return
  }
}

window.openChat = openChat;
load()
