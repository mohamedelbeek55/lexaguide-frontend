const LS_KEY="legal_consultations_bookings"
const listEl=document.getElementById("bookingList")
const pendingEl=document.getElementById("pendingCount")
const acceptedEl=document.getElementById("acceptedCount")
const declinedEl=document.getElementById("declinedCount")
let lastIds=new Set()
const read=()=>{try{return JSON.parse(localStorage.getItem(LS_KEY)||"[]")}catch{return[]}}
const write=arr=>localStorage.setItem(LS_KEY,JSON.stringify(arr))
const setTitle=n=>{document.title=n>0?`Lawyer Dashboard (${n})`:"Lawyer Dashboard"}
const short=s=>{if(!s)return"";return s.length>120?s.slice(0,117)+"...":s}
const timeLabel=b=>`${b.date} ${b.startTime} • ${b.durationMinutes}m`
const makeCard=b=>{const d=document.createElement("div");d.className="card";d.innerHTML=`<div class="row"><h3 class="title">${b.clientName||"Client"}</h3><span class="badge ${b.status}">${b.status[0].toUpperCase()+b.status.slice(1)}</span></div><div class="row"><div class="muted">${short(b.issue)}</div></div><div class="row"><div class="muted">${b.communication==="video"?"Video Call":"Written Chat"}</div><div class="muted">${timeLabel(b)}</div></div><div class="actions"><button class="btn accept">Accept</button><button class="btn decline">Decline</button></div>`;d.querySelector(".accept").addEventListener("click",()=>updateStatus(b.id,"accepted"));d.querySelector(".decline").addEventListener("click",()=>updateStatus(b.id,"declined"));return d}
const updateStatus=(id,status)=>{const all=read();const idx=all.findIndex(x=>x.id===id);if(idx>-1){all[idx].status=status;write(all);render()}}
const render=()=>{const all=read().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));const pending=all.filter(x=>x.status==="pending").length;const accepted=all.filter(x=>x.status==="accepted").length;const declined=all.filter(x=>x.status==="declined").length;pendingEl.textContent=String(pending);acceptedEl.textContent=String(accepted);declinedEl.textContent=String(declined);setTitle(pending);const ids=new Set(all.map(x=>x.id));const isNew=a=>!lastIds.has(a.id);listEl.innerHTML="";for(const b of all){const card=makeCard(b);listEl.appendChild(card);if(isNew(b))requestAnimationFrame(()=>card.classList.add("enter"))}lastIds=ids}
render()
setInterval(render,3000)
window.addEventListener("storage",e=>{if(e.key===LS_KEY)render()})
