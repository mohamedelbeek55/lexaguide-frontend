document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const resultsList = document.getElementById("results-list");
  const procedureDetails = document.getElementById("procedure-details");
  const spinner = document.getElementById("loading-spinner");

  // State Management
  let currentResults = [];
  let selectedProcedure = null;
  let selectedType = null; // 'online' or 'offline'
  let debounceTimeout;

  // Initialize from URL query param if present
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');
  if (initialQuery) {
    searchInput.value = initialQuery;
    // Trigger the search manually
    setTimeout(() => {
      searchInput.dispatchEvent(new Event('input'));
    }, 100);
  }
  
  // 1. Debounce Logic to prevent excessive API calls
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    
    clearTimeout(debounceTimeout);
    
    if (query.length === 0) {
      currentResults = [];
      renderResults();
      clearDetails();
      return;
    }

    spinner.style.display = "block";
    
    debounceTimeout = setTimeout(async () => {
      try {
        const response = await API.Procedures.search(query);
        currentResults = response.procedures || [];
        renderResults();
      } catch (err) {
        console.error("Search failed:", err);
        resultsList.innerHTML = `<div style="color:red; text-align:center">حدث خطأ أثناء البحث، يرجى المحاولة لاحقاً.</div>`;
      } finally {
        spinner.style.display = "none";
      }
    }, 400); // 400ms delay
  });

  // 2. Render Results List
  function renderResults() {
    if (currentResults.length === 0) {
      resultsList.innerHTML = `<div style="color:#666; text-align:center; margin-top:20px;">لا توجد إجراءات مطابقة لبحثك</div>`;
      return;
    }

    resultsList.innerHTML = "";
    
    currentResults.forEach(proc => {
      const card = document.createElement("div");
      card.className = "procedure-card";
      if (selectedProcedure && selectedProcedure.id === proc.id) {
        card.classList.add("active");
      }
      
      const badgeClass = proc.type === "both" ? "both" : proc.type;
      const typeLabel = proc.type === "online" ? "إلكتروني" : (proc.type === "offline" ? "حضوري" : "إلكتروني / حضوري");
      
      card.innerHTML = `
        <h4>${proc.name}</h4>
        <div class="desc">${proc.description.substring(0, 80)}${proc.description.length > 80 ? '...' : ''}</div>
        <span class="badge ${badgeClass}">${typeLabel}</span>
      `;

      card.addEventListener("click", () => {
        // Remove active class from all
        document.querySelectorAll(".procedure-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        
        selectedProcedure = proc;
        selectedType = proc.type === "both" ? "online" : proc.type;
        renderDetails();
      });

      resultsList.appendChild(card);
    });
  }

  // 3. Render Procedure Details (Conditional based on type)
  function renderDetails() {
    if (!selectedProcedure) {
      clearDetails();
      return;
    }

    const p = selectedProcedure;
    let html = `<h2>${p.name}</h2>`;
    html += `<p style="color: #bbb; line-height: 1.6; margin-bottom: 20px;">${p.description}</p>`;

    // If both, show type selector
    if (p.type === "both") {
      html += `
        <div class="type-selector">
          <button class="type-btn ${selectedType === 'online' ? 'active' : ''}" data-type="online"><i class="fas fa-laptop"></i> الخدمة الإلكترونية</button>
          <button class="type-btn ${selectedType === 'offline' ? 'active' : ''}" data-type="offline"><i class="fas fa-building"></i> الخدمة الحضورية (ورقي)</button>
        </div>
      `;
    }

    // Render components based on selectedType
    html += `<div id="details-content">`;
    html += buildDetailsContent(p, selectedType);
    html += `</div>`;

    procedureDetails.innerHTML = html;

    // Attach listeners for type selector
    if (p.type === "both") {
      const btns = procedureDetails.querySelectorAll(".type-btn");
      btns.forEach(btn => {
        btn.addEventListener("click", (e) => {
          btns.forEach(b => b.classList.remove("active"));
          e.target.classList.add("active");
          selectedType = e.target.getAttribute("data-type");
          document.getElementById("details-content").innerHTML = buildDetailsContent(p, selectedType);
        });
      });
    }
  }

  function buildDetailsContent(proc, type) {
    let content = "";

    // Required Documents (Common usually, but can be displayed regardless)
    if (proc.required_documents && proc.required_documents.length > 0) {
      content += `
        <div class="info-section">
          <h3><i class="fas fa-file-invoice"></i> الأوراق المطلوبة</h3>
          <ul class="info-list">
            ${proc.required_documents.map(doc => `<li><strong>${doc.name}:</strong> ${doc.notes || ''}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Steps
    if (proc.steps && proc.steps.length > 0) {
      content += `
        <div class="info-section">
          <h3><i class="fas fa-list-ol"></i> الخطوات</h3>
          <ul class="info-list" style="list-style-type: decimal;">
            ${proc.steps.sort((a,b)=>a.order - b.order).map(step => `<li><strong>${step.title}</strong><br><small style="color:#aaa">${step.details || ''}</small></li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Fees & Duration
    content += `<div style="display:flex; gap:20px; flex-wrap:wrap; margin-bottom:20px;">`;
    if (proc.fees) {
      content += `
        <div class="info-section" style="flex:1; margin-bottom:0;">
          <h3><i class="fas fa-money-bill-wave"></i> الرسوم المتوقعة</h3>
          <p>${proc.fees.amountEgp || 0} ج.م</p>
          <small style="color:#aaa">${proc.fees.notes || ''}</small>
        </div>
      `;
    }
    if (proc.duration) {
      const unitMap = { hours: "ساعات", days: "أيام", weeks: "أسابيع" };
      content += `
        <div class="info-section" style="flex:1; margin-bottom:0;">
          <h3><i class="fas fa-clock"></i> المدة التقريبية</h3>
          <p>${proc.duration.value || 0} ${unitMap[proc.duration.unit] || proc.duration.unit}</p>
          <small style="color:#aaa">${proc.duration.notes || ''}</small>
        </div>
      `;
    }
    content += `</div>`;

    // Type-specific data
    if (type === "online" && proc.link && proc.link.length > 0) {
      const mainLink = proc.link[0];
      content += `
        <div style="text-align:center; padding: 20px 0;">
          <a href="${mainLink.url}" target="_blank" class="btn-link"><i class="fas fa-external-link-alt"></i> ${mainLink.title || 'تنفيذ الإجراء عبر الإنترنت'}</a>
        </div>
      `;
    }

    if (type === "offline" && proc.location && proc.location.length > 0) {
      content += `
        <div class="info-section">
          <h3><i class="fas fa-map-marker-alt"></i> أماكن تقديم الخدمة</h3>
          <ul class="info-list" style="list-style-type: none; padding-right:0;">
            ${proc.location.map(loc => `
              <li style="padding:10px; background:rgba(255,255,255,0.05); border-radius:6px; margin-bottom:10px;">
                <strong>${loc.governorate || 'جهة غير محددة'}:</strong> ${loc.address || ''}
                <div style="color:#aaa; font-size:13px; margin-top:5px;">${loc.notes || ''}</div>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    return content;
  }

  function clearDetails() {
    selectedProcedure = null;
    procedureDetails.innerHTML = `
      <div class="details-empty">
        <i class="fas fa-file-alt fa-3x" style="color: rgba(197, 149, 74, 0.5); margin-bottom: 15px;"></i>
        <p>اختر إجراء لعرض تفاصيله الكاملة</p>
      </div>
    `;
  }
});
