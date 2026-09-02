// Elements
const listEl = document.getElementById("bookingList")
const appointmentsListEl = document.getElementById("appointmentsList")
const pendingCountEl = document.getElementById("pendingCount")
const acceptedCountEl = document.getElementById("acceptedCount")
const completedCountEl = document.getElementById("completedCount")
const lawyerNameEl = document.getElementById("lawyerName")
const dashboardPanel = document.getElementById("dashboardPanel")
const appointmentsPanel = document.getElementById("appointmentsPanel")
const requestsSection = document.querySelector(".consultations-panel:not(.hidden):not(#appointmentsPanel)")

// Chat Elements
const chatSection = document.getElementById("chatSection")
const chatMessages = document.getElementById("chatMessages")
const chatForm = document.getElementById("chatForm")
const chatInput = document.getElementById("chatInput")
const chatClientAvatar = document.getElementById("chatClientAvatar")
const chatClientName = document.getElementById("chatClientName")

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
function render(bookings) {
  if (!listEl) return;
  listEl.innerHTML = ""
  if (appointmentsListEl) appointmentsListEl.innerHTML = "";

  // Add a section for completed consultations if they exist
  const pending = bookings.filter(b => b.status === "pending");
  const appointments = bookings.filter(b => b.status === "accepted" || b.status === "active" || b.status === "confirmed");
  const completedList = bookings.filter(b => b.status === "completed");

  // Render Requests
  if (pending.length === 0) {
    listEl.innerHTML = `<div class="loading-state">No new requests.</div>`;
  } else {
    pending.forEach(b => listEl.appendChild(createBookingCard(b, true)));
  }

  // Render Appointments
  if (appointmentsListEl) {
    if (appointments.length === 0 && completedList.length === 0) {
      appointmentsListEl.innerHTML = `<div class="loading-state">No confirmed appointments.</div>`;
    } else {
      appointments.forEach(b => appointmentsListEl.appendChild(createBookingCard(b, false)));

      // Render completed consultations in the appointments panel but at the bottom
      if (completedList.length > 0) {
        const divider = document.createElement("div");
        divider.className = "section-divider";
        divider.innerHTML = `<h3 style="margin: 20px 0; color: var(--gold); border-top: 1px solid var(--border); padding-top: 20px;">Completed Consultations</h3>`;
        appointmentsListEl.appendChild(divider);

        completedList.forEach(b => {
          const card = createBookingCard(b, false);
          appointmentsListEl.appendChild(card);
        });
      }
    }
  }
}

function showPanel(panel) {
  const requestsSection = document.querySelector(".consultations-panel:not(#appointmentsPanel)");
  const appointmentsSection = document.getElementById("appointmentsPanel");
  const chatSection = document.getElementById("chatSection");
  const navItems = document.querySelectorAll(".nav-item");

  // Remove active from all
  navItems.forEach(item => item.classList.remove("active"));

  if (panel === 'dashboard') {
    requestsSection.classList.remove("hidden");
    appointmentsSection.classList.add("hidden");
    if (chatSection) chatSection.classList.add("hidden");
    // Find the dashboard link and make it active
    const dashLink = Array.from(navItems).find(i => i.textContent.includes('Dashboard'));
    if (dashLink) dashLink.classList.add('active');
  } else if (panel === 'appointments') {
    requestsSection.classList.add("hidden");
    appointmentsSection.classList.remove("hidden");
    if (chatSection) chatSection.classList.add("hidden");
    // Find the appointments link and make it active
    const apptLink = Array.from(navItems).find(i => i.textContent.includes('Appointments'));
    if (apptLink) apptLink.classList.add('active');
  } else if (panel === 'messages') {
    // For lawyers, "Messages" usually means active consultations where chat is possible
    requestsSection.classList.add("hidden");
    appointmentsSection.classList.remove("hidden"); // Show appointments as they are chat-ready
    if (chatSection) chatSection.classList.add("hidden");
    
    const msgLink = Array.from(navItems).find(i => i.textContent.includes('Messages'));
    if (msgLink) msgLink.classList.add('active');
    
    API.UI.toast("Select an active consultation to start messaging", "info");
  }
}

window.showPanel = showPanel;

function createBookingCard(b, isPending) {
  const card = document.createElement("div")
  card.className = "booking-card"
  
  const id = b._id || b.id;
  const clientName = b.client_name || (b.userId && b.userId.fullName) || "Client";
  const date = b.createdAt || b.created_at || new Date();
  const description = b.notes || b.description || "No notes provided.";
  const status = (b.status || "pending").toLowerCase();
  
  const isAccepted = status === "accepted" || status === "active" || status === "confirmed";
  const isCompleted = status === "completed";
  const statusLabel = status.toUpperCase();

  card.innerHTML = `
    <div class="card-header">
      <div class="client-info">
        <div class="avatar-small">${clientName[0].toUpperCase()}</div>
        <div>
          <div class="client-name">${clientName}</div>
          <div class="booking-time">${new Date(date).toLocaleDateString()}</div>
        </div>
      </div>
      <span class="badge ${status}">${statusLabel}</span>
    </div>
    <div class="case-desc">${description}</div>
    <div class="card-actions">
      ${isPending ? `
        <button class="btn btn-primary" onclick="updateStatus('${id}', 'accepted')">
          <i class="fas fa-check"></i> Accept
        </button>
        <button class="btn btn-secondary" onclick="updateStatus('${id}', 'declined')">
          <i class="fas fa-times"></i> Decline
        </button>
      ` : (isAccepted || isCompleted) ? `
        <button class="btn btn-chat" style="width: 100%; margin-top: 10px; background: var(--gold); color: #0d1117;" onclick="openChat('${id}', '${clientName}')">
          <i class="fas fa-comments"></i> ${isCompleted ? 'Review Chat' : 'Open Chat'}
        </button>
      ` : ""}
    </div>
  `
  return card;
}

async function updateStatus(id, status) {
  try {
    // 1. Optimistic UI update
    const card = listEl.querySelector(`[onclick*="'${id}'"]`)?.closest('.booking-card');
    if (card) {
      if (status === 'declined') {
        card.style.opacity = '0.5';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => card.remove(), 300);
      } else if (status === 'accepted') {
        const badge = card.querySelector('.badge');
        if (badge) {
          badge.textContent = 'ACCEPTED';
          badge.className = 'badge accepted';
        }
        const actions = card.querySelector('.card-actions');
        if (actions) {
          actions.innerHTML = `<button class="btn btn-chat" onclick="openChat('${id}', '${card.querySelector('.client-name').textContent}')">Open Chat</button>`;
        }
      }
    }

    await API.Consult.updateStatus(id, status);

    const message = status === 'accepted' ? 'Consultation Accepted!' : 'Consultation Declined';
    API.UI.toast(message, "success");

    // 2. Full reload to sync stats and list
    await load();
  } catch (err) {
    API.UI.toast(err.message || "Failed to update status", "error");
    load(); // Revert on error
  }
}

async function load() {
  if (typeof API === "undefined" || isListLoading) return;
  isListLoading = true;

  const user = API.getUser();
  if (user && lawyerNameEl) {
    lawyerNameEl.textContent = user.fullName || "Lawyer";
  }

  try {
    const resp = await API.Consult.getLawyerConsultations();
    // Support both direct array and {consultations: []}
    const bookings = Array.isArray(resp) ? resp : (resp.consultations || resp.data || []);
    render(bookings);

    if (pendingCountEl) pendingCountEl.textContent = bookings.filter(b => b.status === "pending").length
    if (acceptedCountEl) acceptedCountEl.textContent = bookings.filter(b => b.status === "accepted" || b.status === "active" || b.status === "confirmed").length
    if (completedCountEl) completedCountEl.textContent = bookings.filter(b => b.status === "completed").length

    // Update availability toggle based on user data if exists
    const availToggle = document.getElementById('availabilityToggle');
    if (user && availToggle && !availToggle.dataset.loaded) {
      const profile = await API.Profile.get();
      availToggle.checked = profile.isAvailable !== false;
      availToggle.dataset.loaded = "true"; // Prevent redundant profile calls
    }
  } catch (err) {
    console.error("Load failed:", err)
  } finally {
    isListLoading = false;
  }
}

// ─── Chat Logic ──────────────────────────────────────────────────────────────
async function openChat(consultationId, clientName) {
  currentConsultationId = consultationId;
  
  // Update UI to show messages panel and chat section
  showPanel('messages');
  chatSection.classList.remove("hidden");

  if (chatClientName) chatClientName.textContent = clientName;
  if (chatClientAvatar) chatClientAvatar.textContent = clientName[0].toUpperCase();

  if (pollingInterval) clearInterval(pollingInterval);
  lastMessageCount = 0;
  await loadMessages();
  pollingInterval = setInterval(loadMessages, 5000); // Increased interval to 5s
}

function closeChat() {
  chatSection.classList.add("hidden");
  currentConsultationId = null;
  if (pollingInterval) clearInterval(pollingInterval);
}

async function loadMessages() {
  if (!currentConsultationId || document.visibilityState === 'hidden' || isMessagesLoading) return;
  isMessagesLoading = true;
  try {
    const resp = await API.Consult.getMessages(currentConsultationId);
    const messages = resp.messages || resp.data || [];

    if (messages.length > lastMessageCount) {
      if (lastMessageCount > 0) {
        const lastMsg = messages[messages.length - 1];
        const currentUser = API.getUser();
        // Notify if the message is from the user
        if (lastMsg.senderId !== currentUser.id && lastMsg.senderRole === 'user') {
          API.UI.toast(localStorage.getItem('language') === 'ar' ? 'رسالة جديدة من العميل' : 'New message from client', 'info');
          try { new Audio('../assets/notification.mp3').play(); } catch(e) {}
        }
      }
      renderMessages(messages);
      lastMessageCount = messages.length;
      chatMessages.scrollTop = chatMessages.scrollHeight;
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
  chatMessages.innerHTML = "";
  
  messages.forEach(msg => {
    const isMe = msg.senderId === currentUser.id || msg.senderRole === "lawyer";
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${isMe ? "lawyer" : "user"}`;
    
    const time = new Date(msg.createdAt || msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
    bubble.innerHTML = `
      <div class="msg-content">${msg.message || msg.content}</div>
      <span class="msg-time">${time}</span>
    `;
    chatMessages.appendChild(bubble);
  });
  
  chatMessages.scrollTop = chatMessages.scrollHeight;
  lastMessageCount = messages.length;
}

async function completeConsultation() {
  if (!currentConsultationId) return;
  
  const isAr = localStorage.getItem('language') === 'ar';
  const confirmMsg = isAr ? 'هل أنت متأكد من إنهاء هذه الاستشارة؟' : 'Are you sure you want to finish this consultation?';
  
  if (!confirm(confirmMsg)) return;

  try {
    await API.Consult.updateStatus(currentConsultationId, 'completed');
    API.UI.toast(isAr ? 'تم إنهاء الاستشارة بنجاح' : 'Consultation completed successfully', "success");
    
    closeChat();
    await load(); // Refresh stats and lists
  } catch (err) {
    API.UI.toast(err.message || "Failed to complete consultation", "error");
  }
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
        <div class="chat-bubble lawyer">
          <div class="msg-content">${msg}</div>
          <div class="msg-time">${formatTime(new Date())}</div>
        </div>
      `;
      chatMessages.scrollTop = chatMessages.scrollHeight;

      await API.Consult.sendMessage(currentConsultationId, msg);
      loadMessages();
      load(); // Update counts
    } catch (err) {
      API.UI.toast("Failed to send", "error");
    }
  });
}

// Expose
window.openChat = openChat;
window.closeChat = closeChat;
window.updateStatus = updateStatus;
window.completeConsultation = completeConsultation;

// Init
document.addEventListener("DOMContentLoaded", load);
setInterval(load, 10000);
