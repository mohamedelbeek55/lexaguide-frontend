const LS_KEY = "legal_consultations_bookings"
const params = new URLSearchParams(window.location.search || "")
const lawyerParam = params.get("lawyer")
const consultationIdParam = params.get("consultationId")

// Elements
const nameEl = document.getElementById("lawyerName")
const specialtyEl = document.getElementById("lawyerSpecialty")
const locationEl = document.getElementById("location")
const starsEl = document.getElementById("stars")
const countEl = document.getElementById("count")
const priceEl = document.getElementById("price")
const lawyerAvatarLarge = document.getElementById("lawyerAvatar")

const chatSection = document.getElementById("chat-section")
const chatMessages = document.getElementById("chat-messages")
const chatInput = document.getElementById("chat-input")
const chatSend = document.getElementById("chat-send")
const chatLawyerNameHeader = document.getElementById("chat-lawyer-name-header")
const chatLawyerAvatarSmall = document.getElementById("chat-lawyer-avatar-small")
const statusBadge = document.getElementById("statusBadge")

// State
let currentConsultationId = consultationIdParam;
let lastMessageCount = 0;
let consultationStatus = "pending";
let currentLawyerData = null;

function formatTime(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Chat Logic ──────────────────────────────────────────────────────────────
async function loadMessages() {
  if (!currentConsultationId || typeof API === 'undefined') return;
  try {
    const consult = await API.Consult.get(currentConsultationId);
    consultationStatus = consult.status;

    if (statusBadge) {
      statusBadge.textContent = consultationStatus.toUpperCase();
      statusBadge.className = "badge " + (consultationStatus === 'accepted' || consultationStatus === 'active' ? 'active' : 'pending');
    }

    // Update headers if not already set
    if (!currentLawyerData) {
      currentLawyerData = {
        id: consult.lawyer_id,
        name: consult.lawyer_name,
        specialty: consult.lawyer_specialty,
        location: consult.lawyer_location,
        rating: consult.lawyer_rating,
        consultations: consult.lawyer_consultations,
        price: consult.lawyer_price
      };
      updateLawyerUI(currentLawyerData);
    }

    if (consultationStatus === "accepted" || consultationStatus === "active" || consultationStatus === "confirmed") {
      const resp = await API.Consult.getMessages(currentConsultationId);
      const messages = resp.messages || [];

      if (messages.length !== lastMessageCount) {
        renderMessages(messages);
        lastMessageCount = messages.length;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      chatInput.disabled = false;
      chatInput.placeholder = "Type your message...";
      chatSend.disabled = false;
    } else {
      chatInput.disabled = true;
      chatInput.placeholder = consultationStatus === "pending" ? "Waiting for lawyer to accept..." : `Consultation ${consultationStatus}`;
      chatSend.disabled = true;

      if (chatMessages.children.length === 0 && consultationStatus === "pending") {
        chatMessages.innerHTML = `
            <div class="empty-chat">
                <i class="fas fa-hourglass-half"></i>
                <p>Your request is pending. Once the lawyer accepts, you can start chatting here.</p>
            </div>
          `;
      }
    }
  } catch (err) {
    console.error("Chat load error:", err);
  }
}

function renderMessages(messages) {
  chatMessages.innerHTML = messages.map(m => {
    const isUser = m.senderType === 'user';
    return `
        <div class="chat-bubble ${isUser ? 'user' : 'lawyer'}">
            <div class="msg-content">${m.message}</div>
            <div class="msg-time">${formatTime(m.createdAt)}</div>
        </div>
    `;
  }).join('');
}

async function sendChatMessage() {
  const text = chatInput.value.trim();
  if (!text || !currentConsultationId) return;

  try {
    // Local Echo
    chatMessages.innerHTML += `
        <div class="chat-bubble user">
            <div class="msg-content">${text}</div>
            <div class="msg-time">${formatTime(new Date())}</div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = "";

    await API.Consult.sendMessage(currentConsultationId, text);
    // Remove the placeholder if it exists
    const emptyChat = chatMessages.querySelector(".empty-chat");
    if (emptyChat) emptyChat.remove();

    loadMessages();
  } catch (err) {
    API.UI.toast("Failed to send", "error");
  }
}

async function initChat() {
  if (!currentConsultationId) return;
  chatSection.classList.remove("hidden");

  // Initial load
  await loadMessages();

  // Polling
  const chatInterval = setInterval(loadMessages, 3000);

  chatSend.addEventListener("click", sendChatMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendChatMessage();
  });

  const closeChatBtn = document.getElementById("close-chat");
  if (closeChatBtn) {
    closeChatBtn.addEventListener("click", () => {
      clearInterval(chatInterval);
      chatSection.classList.add("hidden");
      const newUrl = window.location.pathname + (lawyerParam ? `?lawyer=${lawyerParam}` : '');
      window.history.pushState({}, '', newUrl);
      currentConsultationId = null;
    });
  }
}

// ─── Lawyer Info ─────────────────────────────────────────────────────────────
async function loadLawyerInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const lid = urlParams.get("lawyer");
  const cid = urlParams.get("consultationId");

  if (!lid && !cid) {
    API.UI.toast("No lawyer or consultation specified. Redirecting...", "error");
    setTimeout(() => window.location.href = "middle-east-law.html", 2000);
    return;
  }

  try {
    if (cid) {
      if (!API.isLoggedIn()) {
        window.location.href = "login.html?redirect=" + encodeURIComponent(window.location.href);
        return;
      }
      const consult = await API.Consult.get(cid);
      currentLawyerData = {
        name: consult.lawyer_name,
        specialty: consult.lawyer_specialty,
        location: consult.lawyer_location,
        rating: consult.lawyer_rating,
        consultations: consult.lawyer_consultations,
        price: consult.lawyer_price,
        id: consult.lawyer_id
      };
    } else if (lid) {
      const l = await API.Lawyer.get(lid);
      if (!l || !l.full_name) {
        throw new Error("Lawyer not found");
      }
      currentLawyerData = {
        name: l.full_name,
        specialty: l.specialty,
        location: l.country,
        rating: l.rating,
        consultations: l.total_consultations,
        price: l.price_per_session,
        id: l.id
      };
    }

    if (currentLawyerData) {
      updateLawyerUI(currentLawyerData);
    } else {
      throw new Error("Could not load lawyer data");
    }
  } catch (err) {
    console.error("Info load error:", err);
    API.UI.toast("Lawyer details not found. Redirecting...", "error");
    setTimeout(() => window.location.href = "middle-east-law.html", 2000);
  }
}

function updateLawyerUI(data) {
  if (!data) {
    if (nameEl) nameEl.textContent = "Fetching Lawyer Details...";
    if (chatLawyerNameHeader) chatLawyerNameHeader.textContent = "Connecting...";
    return;
  }
  if (nameEl) nameEl.textContent = data.name;
  if (specialtyEl) specialtyEl.textContent = data.specialty;
  if (locationEl) locationEl.textContent = data.location;
  if (priceEl) priceEl.textContent = `$${data.price} / session`;
  if (countEl) countEl.textContent = `${data.consultations} sessions`;
  if (lawyerAvatarLarge) lawyerAvatarLarge.textContent = data.name ? data.name[0].toUpperCase() : "L";

  if (chatLawyerNameHeader) chatLawyerNameHeader.textContent = data.name;
  if (chatLawyerAvatarSmall) chatLawyerAvatarSmall.textContent = data.name ? data.name[0].toUpperCase() : "L";

  const stars = "★★★★★";
  const rounded = Math.round(data.rating || 0);
  if (starsEl) starsEl.textContent = stars.slice(0, rounded) + "☆☆☆☆☆".slice(0, 5 - rounded);
}

// Initial placeholder state
updateLawyerUI(null);

// ─── Booking ─────────────────────────────────────────────────────────────────
const form = document.getElementById("booking-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const notes = document.getElementById("issue").value;
    const mode = document.getElementById("communication").value;

    if (!API.isLoggedIn()) {
      window.location.href = "login.html";
      return;
    }

    try {
      const lawyerIdToBook = lawyerParam || (currentLawyerData ? currentLawyerData.id : '');
      if (!lawyerIdToBook) {
        throw new Error("No lawyer selected for booking.");
      }
      const resp = await API.Consult.book({
        lawyer_id: lawyerIdToBook,
        communication_method: mode,
        description: notes
      });
      const cid = resp.consultation._id || resp.id;

      document.getElementById("bookingId").textContent = cid;
      document.getElementById("confirmation").classList.remove("hidden");
      form.reset();

      // Update current consultation ID and start chat
      currentConsultationId = cid;
      initChat();
    } catch (err) {
      alert(err.message);
    }
  });
}

const commToggle = document.getElementById("commToggle");
if (commToggle) {
  commToggle.addEventListener("click", e => {
    const btn = e.target.closest(".toggle-btn");
    if (!btn) return;
    commToggle.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("communication").value = btn.dataset.mode;
  });
}

// Prefill Name
const user = API.getUser();
if (user && document.getElementById("clientName")) {
  document.getElementById("clientName").value = user.fullName || "";
}

// Dates
const dateInp = document.getElementById("date");
const timeInp = document.getElementById("time");
if (dateInp && timeInp) {
  const now = new Date();
  dateInp.value = now.toISOString().split('T')[0];
  timeInp.value = "09:00";
}

// Run
loadLawyerInfo();
if (currentConsultationId) initChat();
