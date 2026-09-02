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
let isMessagesLoading = false;
let isListLoading = false;

function formatTime(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── List Logic ──────────────────────────────────────────────────────────────
async function load() {
  if (typeof API === "undefined" || isListLoading) return;
  isListLoading = true;

  const user = API.getUser();
  if (user && welcomeText) {
    welcomeText.textContent = `Welcome, ${user.fullName || "User"}`;
  }

  try {
    const resp = await API.Consult.getMine();
    // Support both new {consultations, data} and old formats
    const items = Array.isArray(resp) ? resp : (resp.consultations || resp.data || []);
    render(items);
  } catch (err) {
    console.error("Load failed:", err);
    API.UI.toast("Failed to load consultations", "error");
  } finally {
    isListLoading = false;
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

  const isAr = localStorage.getItem('language') === 'ar';
  
  items.forEach(c => {
    const card = document.createElement("div");
    card.className = "consultation-card dynamic-card";

    const isAccepted = c.status === "accepted" || c.status === "active" || c.status === "confirmed";
    const isCompleted = c.status === "completed";
    const statusLabel = c.status.toUpperCase();

    let btnLabel = isAr ? 'دردشة' : 'Chat';
    if (isCompleted) btnLabel = isAr ? 'مراجعة المحادثة' : 'Review Chat';

    card.innerHTML = `
      <div class="card-header">
        <div class="lawyer-info">
          <div class="lawyer-avatar">${c.lawyer_name ? c.lawyer_name[0].toUpperCase() : 'L'}</div>
          <div>
            <h3 class="lawyer-name">${c.lawyer_name}</h3>
            <p class="lawyer-specialty">${c.legal_area || (isAr ? 'خبير قانوني' : 'Legal Expert')}</p>
          </div>
        </div>
        <span class="status-badge ${c.status}">${statusLabel}</span>
      </div>
      <div class="case-notes">
        <strong>${isAr ? 'ملاحظات:' : 'Notes:'}</strong> ${c.description || (isAr ? "لا توجد ملاحظات." : "No notes provided.")}
      </div>
      <div class="card-footer" style="display: flex; flex-direction: column; gap: 10px;">
        <div style="font-size: 11px; color: #8b949e;">
          ${isAr ? 'تاريخ الحجز:' : 'Booked:'} ${new Date(c.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
        </div>
        ${(isAccepted || isCompleted) ? `
          <button class="btn-chat" style="width: 100%; background: var(--gold); color: #0d1117; font-weight: bold; border-radius: 8px; padding: 12px;" onclick="openChat('${c.id}', '${c.lawyer_name}')">
            <i class="fas fa-comments"></i> ${btnLabel}
          </button>
        ` : `
          <button class="btn-chat" disabled style="width: 100%; background: #30363d; color: #8b949e; border-radius: 8px; padding: 12px;">
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
  
  // Reset chat UI
  chatMessages.innerHTML = '';
  if (chatLawyerName) chatLawyerName.textContent = lawyerName;
  if (chatLawyerAvatar) chatLawyerAvatar.textContent = lawyerName[0].toUpperCase();
  
  const grid = document.querySelector(".grid");
  if (grid) grid.classList.add("chat-active");
  
  chatSection.classList.remove("hidden");
  
  // Initial messages load
  lastMessageCount = 0;
  await loadMessages();
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (pollingInterval) clearInterval(pollingInterval);
  lastMessageCount = 0;
  await loadMessages();
  pollingInterval = setInterval(loadMessages, 5000); // Increased interval to 5s
}

function closeChat() {
  currentConsultationId = null;
  const grid = document.querySelector(".grid");
  if (grid) grid.classList.remove("chat-active");

  chatSection.classList.add("hidden");
  if (pollingInterval) clearInterval(pollingInterval);
}

async function loadMessages() {
  if (!currentConsultationId || document.visibilityState === 'hidden' || isMessagesLoading) return;
  isMessagesLoading = true;
  try {
    const resp = await API.Consult.getMessages(currentConsultationId);
    const messages = resp.messages || resp.data || [];
    
    if (messages.length > lastMessageCount) {
      // New messages arrived
      if (lastMessageCount > 0) {
        const lastMsg = messages[messages.length - 1];
        const currentUser = API.getUser();
        // Notify only if someone else sent the message
        if (lastMsg.senderId !== currentUser.id && lastMsg.senderRole !== 'user') {
          API.UI.toast(localStorage.getItem('language') === 'ar' ? 'رسالة جديدة من المحامي' : 'New message from lawyer', 'info');
          // Optional: Play notification sound
          try { new Audio('../assets/notification.mp3').play(); } catch(e) {}
        }
      }
      renderMessages(messages);
    }
  } catch (err) {
    console.error("Failed to load messages:", err);
  } finally {
    isMessagesLoading = false;
  }
}

function renderMessages(messages) {
  if (messages.length === lastMessageCount && lastMessageCount > 0) return;
  
  const currentUser = API.getUser();
  chatMessages.innerHTML = '';
  
  messages.forEach(msg => {
    // Determine if I am the sender
    const isMe = msg.senderId === currentUser.id || msg.senderRole === 'user';
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isMe ? 'user' : 'lawyer'}`;
    
    const time = new Date(msg.createdAt || msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    bubble.innerHTML = `
      <div class="msg-content">${msg.message || msg.content}</div>
      <span class="msg-time">${time}</span>
    `;
    chatMessages.appendChild(bubble);
  });
  
  chatMessages.scrollTop = chatMessages.scrollHeight;
  lastMessageCount = messages.length;
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
