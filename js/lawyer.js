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

  // Separate Pending from Accepted (Appointments)
  const pending = bookings.filter(b => b.status === "pending");
  const appointments = bookings.filter(b => b.status === "accepted" || b.status === "active" || b.status === "confirmed");

  // Render Requests
  if (pending.length === 0) {
    listEl.innerHTML = `<div class="loading-state">No new requests.</div>`;
  } else {
    pending.forEach(b => listEl.appendChild(createBookingCard(b, true)));
  }

  // Render Appointments
  if (appointmentsListEl) {
    if (appointments.length === 0) {
      appointmentsListEl.innerHTML = `<div class="loading-state">No confirmed appointments.</div>`;
    } else {
      appointments.forEach(b => appointmentsListEl.appendChild(createBookingCard(b, false)));
    }
  }
}

function showPanel(panel) {
  const requestsSection = document.querySelector(".consultations-panel:not(#appointmentsPanel)");
  const appointmentsSection = document.getElementById("appointmentsPanel");
  const navItems = document.querySelectorAll(".nav-item");

  // Remove active from all
  navItems.forEach(item => item.classList.remove("active"));

  if (panel === 'dashboard') {
    requestsSection.classList.remove("hidden");
    appointmentsSection.classList.add("hidden");
    // Find the dashboard link and make it active
    const dashLink = Array.from(navItems).find(i => i.textContent.includes('Dashboard'));
    if (dashLink) dashLink.classList.add('active');
  } else if (panel === 'appointments') {
    requestsSection.classList.add("hidden");
    appointmentsSection.classList.remove("hidden");
    // Find the appointments link and make it active
    const apptLink = Array.from(navItems).find(i => i.textContent.includes('Appointments'));
    if (apptLink) apptLink.classList.add('active');
  }
}

window.showPanel = showPanel;

function createBookingCard(b, isPending) {
  const card = document.createElement("div")
  card.className = "booking-card"
  const isAccepted = b.status === "accepted" || b.status === "active" || b.status === "confirmed";
  const statusLabel = b.status.toUpperCase();

  card.innerHTML = `
    <div class="card-header">
      <div class="client-info">
        <div class="avatar-small">${b.client_name ? b.client_name[0].toUpperCase() : 'C'}</div>
        <div>
          <div class="client-name">${b.client_name}</div>
          <div class="booking-time">${new Date(b.created_at).toLocaleDateString()}</div>
        </div>
      </div>
      <span class="badge ${b.status}">${statusLabel}</span>
    </div>
    <div class="case-desc">${b.description || "No notes provided."}</div>
    <div class="card-actions">
      ${isPending ? `
        <button class="btn btn-primary" onclick="updateStatus('${b.id}', 'accepted')">
          <i class="fas fa-check"></i> Accept
        </button>
        <button class="btn btn-secondary" onclick="updateStatus('${b.id}', 'declined')">
          <i class="fas fa-times"></i> Decline
        </button>
      ` : isAccepted ? `
        <button class="btn btn-chat" onclick="openChat('${b.id}', '${b.client_name}')">
          <i class="fas fa-comments"></i> Open Chat
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
  if (typeof API === "undefined") return;

  const user = API.getUser();
  if (user && lawyerNameEl) {
    lawyerNameEl.textContent = user.fullName || "Lawyer";
  }

  try {
    const resp = await API.Consult.getLawyerConsultations()
    const bookings = resp.data || []
    render(bookings)

    if (pendingCountEl) pendingCountEl.textContent = bookings.filter(b => b.status === "pending").length
    if (acceptedCountEl) acceptedCountEl.textContent = bookings.filter(b => b.status === "accepted" || b.status === "active" || b.status === "confirmed").length
    if (completedCountEl) completedCountEl.textContent = bookings.filter(b => b.status === "completed").length

    // Update availability toggle based on user data if exists
    const availToggle = document.getElementById('availabilityToggle');
    if (user && availToggle) {
      // We might need an endpoint to get full lawyer profile details including isAvailable
      const profile = await API.Profile.get();
      availToggle.checked = profile.isAvailable !== false;
    }
  } catch (err) {
    console.error("Load failed:", err)
  }
}

// ─── Chat Logic ──────────────────────────────────────────────────────────────
async function openChat(consultationId, clientName) {
  currentConsultationId = consultationId;
  chatSection.classList.remove("hidden");

  if (chatClientName) chatClientName.textContent = clientName;
  if (chatClientAvatar) chatClientAvatar.textContent = clientName[0].toUpperCase();

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
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  } catch (err) {
    console.error("Messages load failed:", err);
  }
}

function renderMessages(messages) {
  chatMessages.innerHTML = messages.map(m => {
    const isLawyer = m.senderType === 'lawyer';
    const initialBadge = m.isInitial ? `<span class="initial-msg-badge">Booking Note</span>` : '';
    return `
      <div class="chat-bubble ${isLawyer ? 'lawyer' : 'user'} ${m.isInitial ? 'initial' : ''}">
        ${initialBadge}
        <div class="msg-content">${m.message}</div>
        <div class="msg-time">${formatTime(m.createdAt)}</div>
      </div>
    `;
  }).join('');

  // Auto-scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function completeConsultation() {
  if (!currentConsultationId) return;
  if (!confirm("Mark this session as completed?")) return;
  try {
    await API.Consult.updateStatus(currentConsultationId, 'completed');
    closeChat();
    load();
    API.UI.toast("Consultation completed", "success");
  } catch (err) {
    API.UI.toast("Action failed", "error");
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
