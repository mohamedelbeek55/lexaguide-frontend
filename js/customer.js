const LS_KEY = "legal_consultations_bookings"
const lawyer = {name:"Layla Hassan",specialty:"Corporate & Contracts",location:"Dubai, UAE",rating:4.8,consultations:274,pricePer60:400,online:true}
const nameEl = document.querySelector(".name")
const specialtyEl = document.querySelector(".specialty")
const locationEl = document.querySelector(".location")
const starsEl = document.querySelector(".stars")
const countEl = document.querySelector(".count")
const priceEl = document.querySelector(".price")
const badgeEl = document.querySelector(".badge")
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
