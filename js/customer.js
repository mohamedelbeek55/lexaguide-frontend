const LS_KEY = "legal_consultations_bookings"
const params = new URLSearchParams(window.location.search || "")
const lawyerParam = params.get("lawyer")
const consultationIdParam = params.get("consultationId")

// Elements
const nameEl = document.querySelector(".name")
const specialtyEl = document.querySelector(".specialty")
const locationEl = document.querySelector(".location")
const starsEl = document.querySelector(".stars")
const countEl = document.querySelector(".count")
const priceEl = document.querySelector(".price")
const badgeEl = document.querySelector(".badge")
const formPanel = document.querySelector(".panel.form")
const chatSection = document.getElementById("chat-section")
const chatMessages = document.getElementById("chat-messages")
const chatInput = document.getElementById("chat-input")
const chatSend = document.getElementById("chat-send")

// State
let currentConsultationId = consultationIdParam;
let lastMessageCount = 0;

// ─── Chat Logic ──────────────────────────────────────────────────────────────
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
  chatMessages.innerHTML = messages.map(m => `
        <div class="chat-bubble ${m.senderType === 'user' ? 'user' : 'lawyer'}">
            ${m.message}
        </div>
    `).join('');
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
            <div class="chat-bubble user">
                ${text}
            </div>
        `;
    scrollToBottom();
    chatInput.value = "";

    await API.Consult.sendMessage(currentConsultationId, text);
    loadMessages();
  } catch (err) {
    alert("Failed to send message: " + err.message);
  }
}

async function initChat() {
  if (!currentConsultationId) return;

  // Show chat, hide booking form
  formPanel.classList.add("hidden");
  chatSection.classList.remove("hidden");

  // Initial load
  await loadMessages();

  // Poll for new messages every 3 seconds
  setInterval(loadMessages, 3000);

  chatSend.addEventListener("click", sendChatMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendChatMessage();
  });
}

if (currentConsultationId) {
  initChat();
}

// ─── Lawyer Info Logic ───────────────────────────────────────────────────────
let lawyer = { name: "Loading...", specialty: "", location: "", rating: 0, consultations: 0, pricePer60: 0, online: false }

async function loadLawyerInfo() {
  if (!lawyerParam && !currentConsultationId) {
    updateLawyerUI();
    return;
  }

  try {
    let data;
    if (currentConsultationId) {
      const consult = await API.Consult.get(currentConsultationId);
      data = {
        name: consult.lawyer_name,
        specialty: consult.lawyer_specialty,
        location: consult.lawyer_location,
        rating: consult.lawyer_rating,
        consultations: consult.lawyer_consultations,
        pricePer60: consult.lawyer_price,
        online: true
      };
    } else {
      const l = await API.Lawyer.get(lawyerParam);
      data = {
        name: l.full_name,
        specialty: l.specialty,
        location: l.country,
        rating: l.rating,
        consultations: l.total_consultations,
        pricePer60: l.price_per_session,
        online: l.availability_status === 'online_now'
      };
    }

    lawyer = data;
    updateLawyerUI();
  } catch (err) {
    console.error("Failed to load lawyer info:", err);
  }
}

function updateLawyerUI() {
  if (nameEl) nameEl.textContent = lawyer.name
  if (specialtyEl) specialtyEl.textContent = lawyer.specialty
  if (locationEl) locationEl.textContent = lawyer.location
  if (priceEl) priceEl.textContent = "$" + lawyer.pricePer60
  if (countEl) countEl.textContent = (lawyer.consultations || 0) + " sessions"

  const solid = "★★★★★"
  const hollow = "☆☆☆☆☆"
  const rounded = Math.round(lawyer.rating || 0)
  if (starsEl) starsEl.textContent = solid.slice(0, rounded) + hollow.slice(0, 5 - rounded)

  if (badgeEl) {
    badgeEl.textContent = lawyer.online ? "Online" : "Unavailable"
    badgeEl.style.background = lawyer.online ? "rgba(15,190,120,.18)" : "rgba(200,80,60,.18)"
    badgeEl.style.borderColor = lawyer.online ? "rgba(15,190,120,.35)" : "rgba(200,80,60,.35)"
  }

  const avatar = document.querySelector(".avatar");
  if (avatar && lawyer.name) avatar.textContent = lawyer.name[0];
}

loadLawyerInfo();

const commToggle = document.getElementById("commToggle")
const commInput = document.getElementById("communication")
const issueEl = document.getElementById("issue")
const confirmation = document.getElementById("confirmation")
const bookingIdEl = document.getElementById("bookingId")
const newBookingBtn = document.getElementById("newBooking")
const form = document.getElementById("booking-form")

const read = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]") } catch { return [] } }
const write = arr => localStorage.setItem(LS_KEY, JSON.stringify(arr))
const generateId = () => "LC-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase()

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const mode = commInput.value === "video" ? "video_call" : "chat"
    const notes = (issueEl && issueEl.value || "").trim()

    if (lawyerParam && typeof window.API !== "undefined") {
      if (!API.isLoggedIn()) {
        window.location.href = "./login.html"
        return
      }
      try {
        const resp = await API.Consult.book({ lawyer_id: lawyerParam, communication_method: mode, description: notes })
        const cid = resp && (resp.consultation && resp.consultation._id || resp.id || resp.consultationId)

        if (mode === "chat") {
          window.location.href = `customer.html?consultationId=${cid}`;
          return;
        }

        bookingIdEl.textContent = cid ? String(cid) : "—"
        confirmation.classList.remove("hidden")
        form.reset()
      } catch (err) {
        alert(err.message || "Failed to book consultation.")
      }
      return
    }

    // Local storage fallback
    const all = read()
    const id = generateId()
    all.push({
      id,
      clientName: (document.getElementById("clientName").value || "Client"),
      date: (document.getElementById("date").value || ""),
      startTime: (document.getElementById("time").value || ""),
      durationMinutes: parseInt((document.getElementById("duration").value || "60"), 10),
      issue: notes,
      communication: mode,
      status: "pending",
      createdAt: new Date().toISOString()
    })
    write(all)
    if (bookingIdEl) bookingIdEl.textContent = String(id)
    if (confirmation) confirmation.classList.remove("hidden")
  })
}

if (newBookingBtn) {
  newBookingBtn.addEventListener("click", () => {
    confirmation.classList.add("hidden")
    form.reset()
  })
}

if (commToggle) {
  commToggle.addEventListener("click", e => {
    const btn = e.target.closest(".toggle-btn");
    if (!btn) return;
    for (const b of commToggle.querySelectorAll(".toggle-btn")) b.classList.remove("active");
    btn.classList.add("active");
    commInput.value = btn.dataset.mode
  })
}

const dateEl = document.getElementById("date")
const timeEl = document.getElementById("time")
if (dateEl && timeEl) {
  const today = new Date()
  const pad = n => String(n).padStart(2, "0")
  dateEl.value = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate())
  timeEl.value = pad(Math.max(9, today.getHours())) + ":" + pad(0)
}
