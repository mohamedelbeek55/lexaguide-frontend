// Elements
const gridEl = document.getElementById("consultationsGrid");
const chatSection = document.getElementById("chatSection");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatLawyerAvatar = document.getElementById("chatLawyerAvatar");
const chatLawyerName = document.getElementById("chatLawyerName");
const welcomeText = document.getElementById("welcomeText");

// State
let currentConsultationId = null;
let lastMessageCount = 0;
let pollingInterval = null;

function formatTime(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── List Logic ──────────────────────────────────────────────────────────────
async function load() {
  if (typeof API === "undefined") return;

  const user = API.getUser();
  if (user && welcomeText) {
    welcomeText.textContent = `Welcome, ${user.fullName || "User"}`;
  }

  try {
    const resp = await API.Consult.getMine();
    const items = resp.data || [];
    render(items);
  } catch (err) {
    console.error("Load failed:", err);
    API.UI.toast("Failed to load consultations", "error");
  }
}

function render(items) {
  if (!gridEl) return;
  gridEl.innerHTML = "";

  // Remove any remaining static cards from the container (if any survived HTML cleanup)
  const staticCards = gridEl.querySelectorAll('.consultation-card:not(.dynamic-card)');
  staticCards.forEach(card => card.remove());

  if (!items || items.length === 0) {
    gridEl.innerHTML = `
      <div class="no-appointments-message" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <i class="fas fa-folder-open" style="font-size: 48px; color: #30363d; margin-bottom: 20px; display: block;"></i>
        <h3 style="color: white; margin-bottom: 10px;">No appointments yet</h3>
        <p style="color: #8b949e; margin-bottom: 24px;">You haven't booked any legal consultations yet.</p>
        <a href="../index.html" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 8px;">
          <i class="fas fa-home"></i> Back to Home
        </a>
      </div>
    `;
    return;
  }

  items.forEach(c => {
    const card = document.createElement("div");
    card.className = "consultation-card dynamic-card";

    const isAccepted = c.status === "accepted" || c.status === "active" || c.status === "confirmed";
    const statusLabel = c.status.toUpperCase();

    card.innerHTML = `
      <div class="card-header">
        <div class="lawyer-info">
          <div class="lawyer-avatar">${c.lawyer_name ? c.lawyer_name[0].toUpperCase() : 'L'}</div>
          <div>
            <h3 class="lawyer-name">${c.lawyer_name}</h3>
            <p class="lawyer-specialty">${c.legal_area || 'Legal Expert'}</p>
          </div>
        </div>
        <span class="status-badge ${c.status}">${statusLabel}</span>
      </div>
      <div class="case-notes">
        <strong>Notes:</strong> ${c.description || "No notes provided."}
      </div>
      <div class="card-footer">
        <div style="font-size: 11px; color: #8b949e;">
          Booked: ${new Date(c.created_at).toLocaleDateString()}
        </div>
        ${isAccepted ? `
          <button class="btn-chat" onclick="openChat('${c.id}', '${c.lawyer_name}')">
            <i class="fas fa-comments"></i> Chat
          </button>
        ` : `
          <button class="btn-chat" disabled style="background: #30363d; color: #8b949e;">
            <i class="fas fa-clock"></i> ${statusLabel}
          </button>
        `}
      </div>
    `;
    gridEl.appendChild(card);
  });
}

// ─── Chat Logic ──────────────────────────────────────────────────────────────
async function openChat(consultationId, lawyerName) {
  currentConsultationId = consultationId;
  chatSection.classList.remove("hidden");

  if (chatLawyerName) chatLawyerName.textContent = lawyerName;
  if (chatLawyerAvatar) chatLawyerAvatar.textContent = lawyerName[0].toUpperCase();

  if (pollingInterval) clearInterval(pollingInterval);
  lastMessageCount = 0;
  loadMessages();
  pollingInterval = setInterval(loadMessages, 3000);
}

function closeChat() {
  chatSection.classList.add("hidden");
  currentConsultationId = null;
  if (pollingInterval) clearInterval(pollingInterval);
}

async function loadMessages() {
  if (!currentConsultationId) return;
  try {
    const resp = await API.Consult.getMessages(currentConsultationId);
    const messages = resp.messages || [];

    if (messages.length !== lastMessageCount) {
      renderMessages(messages);
      lastMessageCount = messages.length;
    }
  } catch (err) {
    console.error("Messages load failed:", err);
  }
}

function renderMessages(messages) {
  chatMessages.innerHTML = messages.map(m => {
    const isUser = m.senderType === 'user';
    const initialBadge = m.isInitial ? `<span class="initial-msg-badge">Your Initial Request</span>` : '';
    return `
      <div class="chat-bubble ${isUser ? 'user' : 'lawyer'} ${m.isInitial ? 'initial' : ''}">
        ${initialBadge}
        <div class="msg-content">${m.message}</div>
        <div class="msg-time">${formatTime(m.createdAt)}</div>
      </div>
    `;
  }).join('');

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

if (chatForm) {
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (!msg || !currentConsultationId) return;

    try {
      chatInput.value = "";
      // Local Echo
      chatMessages.innerHTML += `
        <div class="chat-bubble user">
          <div class="msg-content">${msg}</div>
          <div class="msg-time">${formatTime(new Date())}</div>
        </div>
      `;
      chatMessages.scrollTop = chatMessages.scrollHeight;

      await API.Consult.sendMessage(currentConsultationId, msg);
      loadMessages();
    } catch (err) {
      API.UI.toast("Failed to send message", "error");
    }
  });
}

// Expose
window.openChat = openChat;
window.closeChat = closeChat;

// Init
document.addEventListener("DOMContentLoaded", load);
setInterval(load, 15000); // Slower background refresh for list
