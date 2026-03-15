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

// ─── Chat Logic ──────────────────────────────────────────────────────────────
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
        <div class="chat-bubble ${m.senderType === 'user' ? 'user' : 'lawyer'}">
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

if (currentConsultationId) {
    // Show chat, hide booking form
    formPanel.classList.add("hidden");
    chatSection.classList.remove("hidden");
    
    // Poll for new messages every 3 seconds
    loadMessages();
    setInterval(loadMessages, 3000);

    chatSend.addEventListener("click", sendChatMessage);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendChatMessage();
    });
}

// ─── Lawyer Info Logic ───────────────────────────────────────────────────────
const lawyer = {name:"Layla Hassan",specialty:"Corporate & Contracts",location:"Dubai, UAE",rating:4.8,consultations:274,pricePer60:400,online:true}
nameEl.textContent = lawyer.name
specialtyEl.textContent = lawyer.specialty
locationEl.textContent = lawyer.location
priceEl.textContent = "$" + lawyer.pricePer60
countEl.textContent = lawyer.consultations + " sessions"
const solid = "★★★★★"
const hollow = "☆☆☆☆☆"
const rounded = Math.round(lawyer.rating)
starsEl.textContent = solid.slice(0,rounded) + hollow.slice(0,5-rounded)
badgeEl.textContent = lawyer.online ? "Online" : "Unavailable"
badgeEl.style.background = lawyer.online ? "rgba(15,190,120,.18)" : "rgba(200,80,60,.18)"
badgeEl.style.borderColor = lawyer.online ? "rgba(15,190,120,.35)" : "rgba(200,80,60,.35)"

const commToggle = document.getElementById("commToggle")
const commInput = document.getElementById("communication")
const issueEl = document.getElementById("issue")
const confirmation = document.getElementById("confirmation")
const bookingIdEl = document.getElementById("bookingId")
const newBookingBtn = document.getElementById("newBooking")
const form = document.getElementById("booking-form")

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
  // ... rest of local storage fallback logic if needed
})
  const all = read()
  const id = Date.now()
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
  bookingIdEl.textContent = String(id)
  confirmation.classList.remove("hidden")
})

newBookingBtn.addEventListener("click", () => {
  confirmation.classList.add("hidden")
  form.reset()
})
commToggle.addEventListener("click",e=>{const btn=e.target.closest(".toggle-btn");if(!btn)return;for(const b of commToggle.querySelectorAll(".toggle-btn"))b.classList.remove("active");btn.classList.add("active");commInput.value = btn.dataset.mode})
const dateEl = document.getElementById("date")
const timeEl = document.getElementById("time")
const today = new Date()
const pad = n=>String(n).padStart(2,"0")
dateEl.value = today.getFullYear()+"-"+pad(today.getMonth()+1)+"-"+pad(today.getDate())
timeEl.value = pad(Math.max(9,today.getHours()))+":"+pad(0)
const form = document.getElementById("booking-form")
const confirmation = document.getElementById("confirmation")
const bookingIdEl = document.getElementById("bookingId")
const newBookingBtn = document.getElementById("newBooking")
const id = ()=>"LC-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,6).toUpperCase()
const read = ()=>{try{return JSON.parse(localStorage.getItem(LS_KEY)||"[]")}catch{return[]}}
const write = arr=>localStorage.setItem(LS_KEY,JSON.stringify(arr))
form.addEventListener("submit",e=>{e.preventDefault();const booking={id:id(),createdAt:new Date().toISOString(),status:"pending",clientName:document.getElementById("clientName").value.trim(),issue:document.getElementById("issue").value.trim(),communication:document.getElementById("communication").value,date:document.getElementById("date").value,startTime:document.getElementById("time").value,durationMinutes:parseInt(document.getElementById("duration").value,10),pricePer60:lawyer.pricePer60,lawyer:{name:lawyer.name,specialty:lawyer.specialty,location:lawyer.location}};const all=read();all.push(booking);write(all);bookingIdEl.textContent=booking.id;confirmation.classList.remove("hidden");history.replaceState(null,"","customer.html")})
newBookingBtn.addEventListener("click",()=>{confirmation.classList.add("hidden");form.reset();dateEl.value = today.getFullYear()+"-"+pad(today.getMonth()+1)+"-"+pad(today.getDate());timeEl.value = pad(9)+":00";commInput.value="chat";for(const b of commToggle.querySelectorAll(".toggle-btn"))b.classList.remove("active");commToggle.querySelector('[data-mode="chat"]').classList.add("active")})
