const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000/api"
  : "https://graduation-backend2.vercel.app/api";

function getAccessToken() {
  return sessionStorage.getItem("accessToken") || "";
}

function setTokens({ accessToken, refreshToken }) {
  if (accessToken) sessionStorage.setItem("accessToken", accessToken);
  if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
}

function logoutLocal() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
}

async function request(path, { method = "GET", body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined
  });

  if (res.status === 401) {
    // Don't logout or redirect if we are trying to login
    if (path.includes("/login")) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Invalid credentials");
    }

    logoutLocal();
    // Only redirect if we are not already on the login page
    if (!window.location.pathname.includes("login.html")) {
      window.location.href = "/html/login.html";
    }
    throw new Error("Session expired. Please login again.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

const API = {
  logout() {
    logoutLocal();
    window.location.href = "/html/login.html";
  },
  Auth: {
    async register({ fullName, email, password }) {
      const data = await request("/auth/register", {
        method: "POST",
        body: { fullName, email, password }
      });
      setTokens(data);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      return data;
    },
    async login(email, password) {
      try {
        // 1. Try regular user login
        const data = await request("/auth/login", {
          method: "POST",
          body: { email, password }
        });
        setTokens(data);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        return data;
      } catch (err) {
        // 2. If user login fails with 401, try lawyer login
        if (err.message && (err.message.includes("401") || err.message.includes("credentials"))) {
          try {
            const data = await request("/lawyers/login", {
              method: "POST",
              body: { email, password }
            });
            // Normalize lawyer response to match user response for the frontend
            const lawyerData = {
              user: {
                id: data.lawyer.id,
                fullName: data.lawyer.fullName,
                email: data.lawyer.email,
                role: "lawyer"
              },
              accessToken: data.accessToken,
              refreshToken: data.refreshToken || "" // Lawyers might not have refresh tokens in the current API
            };
            setTokens(lawyerData);
            sessionStorage.setItem("user", JSON.stringify(lawyerData.user));
            return lawyerData;
          } catch (lawyerErr) {
            throw lawyerErr; // If lawyer login also fails, throw that error
          }
        }
        throw err; // Re-throw if it wasn't a 401
      }
    },
    async me() {
      return request("/auth/me", { auth: true });
    }
  },
  Admin: {
    stats() {
      return request("/admin/stats", { auth: true });
    },
    users({ page = 1, limit = 20, q = "" } = {}) {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit), q });
      return request(`/admin/users?${qs.toString()}`, { auth: true });
    },
    toggleUser(id) {
      return request(`/admin/users/${id}/toggle-active`, { method: "PATCH", auth: true });
    },
    consultations({ page = 1, limit = 20 } = {}) {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      return request(`/admin/consultations?${qs.toString()}`, { auth: true });
    },
    async getUsers() {
      const resp = await this.users({ page: 1, limit: 100 });
      return { data: resp.items || [] };
    },
    async getAllUsers() {
      let page = 1;
      const limit = 100;
      const all = [];
      while (true) {
        const resp = await this.users({ page, limit });
        const items = resp.items || [];
        all.push(...items);
        if (items.length < limit) break;
        page++;
      }
      return { data: all };
    },
    async getConsultations() {
      const resp = await this.consultations({ page: 1, limit: 100 });
      const items = (resp.items || []).map((x) => ({
        id: x._id,
        client_name: (x.userId && x.userId.fullName) || "",
        lawyer_name: (x.lawyerId && x.lawyerId.fullName) || "",
        legal_area: "",
        communication_method: x.type,
        status: x.status,
        description: x.notes || "",
        created_at: x.createdAt
      }));
      return { data: items };
    }
  },
  Match: {
    async match({ legal_area_id, communication_method, description, city, budget } = {}) {
      const case_type = typeof legal_area_id === "string" ? legal_area_id : "";

      // Use the new AI recommendation endpoint if advanced fields are provided
      if (city || budget) {
        const resp = await request("/lawyers/recommend", {
          method: "POST",
          body: {
            case_type,
            city: city || "",
            budget: Number(budget) || 1000,
            consultation_type: communication_method === "video" ? "video_call" : "chat"
          }
        });

        const items = (resp.lawyers || []).map(l => ({
          id: l.id,
          full_name: l.full_name,
          specialty: l.specialization,
          country: l.city,
          availability_status: "online_now",
          price_per_session: l.price,
          session_duration_mins: 30,
          communication_methods: "chat",
          bio: "AI Recommended Match Score: " + (l.score * 100).toFixed(1) + "%",
          rating: l.avg_rating,
          total_consultations: l.reviews_count,
          success_rate: l.success_rate
        }));
        return { data: items };
      }

      // Basic fallback matching
      const qs = new URLSearchParams();
      if (case_type) qs.set("specialty", case_type);
      const resp = await request(`/lawyers?${qs.toString()}`, { method: "GET" });
      const items = (resp.lawyers || []).map((l, idx) => ({
        id: l._id || idx + 1,
        full_name: l.fullName,
        specialty: (l.specialties && l.specialties[0]) || "",
        country: l.governorate || "",
        availability_status: l.ratingAvg ? "online_now" : "unavailable",
        price_per_session: l.pricePerSession,
        session_duration_mins: 30,
        communication_methods: "chat",
        bio: l.bio || "",
        rating: l.ratingAvg || 0,
        total_consultations: l.ratingCount || 0
      }));
      return { data: items };
    }
  },
  Consult: {
    async getMine() {
      const resp = await request("/consultations/my", { auth: true });
      const items = (resp.consultations || []).map((x) => ({
        id: x._id,
        client_name: (x.userId && x.userId.fullName) || "",
        lawyer_name: (x.lawyerId && x.lawyerId.fullName) || "",
        legal_area: (x.lawyerId && x.lawyerId.specialties && x.lawyerId.specialties[0]) || "",
        communication_method: x.type,
        status: x.status,
        description: x.notes || "",
        created_at: x.createdAt
      }));
      return { data: items };
    },
    async getLawyerConsultations() {
      const resp = await request("/consultations/lawyer/me", { auth: true });
      const items = (resp.consultations || []).map((x) => ({
        id: x._id,
        client_id: (x.userId && x.userId._id) || (x.userId && x.userId.id) || "",
        client_name: (x.userId && x.userId.fullName) || "Client",
        client_email: (x.userId && x.userId.email) || "",
        status: x.status,
        description: x.notes || "",
        created_at: x.createdAt,
        type: x.type
      }));
      return { data: items };
    },
    async mine() { return this.getMine(); },
    async get(id) {
      const resp = await request(`/consultations/${id}`, { auth: true });
      const x = resp.consultation || resp;
      return {
        id: x._id,
        client_name: (x.userId && x.userId.fullName) || "",
        lawyer_id: (x.lawyerId && x.lawyerId._id) || (x.lawyerId && x.lawyerId.id) || "",
        lawyer_name: (x.lawyerId && x.lawyerId.fullName) || "",
        lawyer_specialty: (x.lawyerId && x.lawyerId.specialties && x.lawyerId.specialties[0]) || "",
        lawyer_location: (x.lawyerId && x.lawyerId.governorate) || "",
        lawyer_rating: (x.lawyerId && x.lawyerId.ratingAvg) || 0,
        lawyer_consultations: (x.lawyerId && x.lawyerId.ratingCount) || 0,
        lawyer_price: (x.lawyerId && x.lawyerId.pricePerSession) || 0,
        communication_method: x.type,
        status: x.status,
        description: x.notes || "",
        created_at: x.createdAt
      };
    },
    async updateStatus(id, status) {
      // Use PUT /bookings/:id for acceptance/rejection as requested
      return request(`/bookings/${id}`, {
        method: "PUT",
        auth: true,
        body: { status }
      });
    },
    async book({ lawyer_id, legal_area_id, communication_method, description } = {}) {
      const lawyerId = lawyer_id || "";
      const notes = description || "";
      const type = communication_method || "chat";
      return request("/bookings", {
        method: "POST",
        auth: true,
        body: { lawyerId, notes, type }
      });
    },
    async sendMessage(consultationId, message) {
      return request(`/consultations/${consultationId}/messages`, {
        method: "POST",
        auth: true,
        body: { message }
      });
    },
    async getMessages(consultationId) {
      return request(`/consultations/${consultationId}/messages`, { auth: true });
    }
  },
  Notifications: {
    async get() {
      return request("/notifications", { auth: true });
    },
    async markAllAsRead() {
      return request("/notifications/read-all", { method: "PATCH", auth: true });
    },
    async markAsRead(id) {
      return request(`/notifications/${id}/read`, { method: "PATCH", auth: true });
    }
  },
  Lawyer: {
    async get(id) {
      const resp = await request(`/lawyers/${id}`, { method: "GET" });
      const l = resp.lawyer || resp;
      return {
        id: l._id || l.id,
        full_name: l.fullName,
        specialty: (l.specialties && l.specialties[0]) || "",
        country: l.governorate || "",
        availability_status: l.availability_status || (l.ratingAvg ? "online_now" : "unavailable"),
        price_per_session: l.pricePerSession,
        session_duration_mins: 30,
        communication_methods: "chat",
        bio: l.bio || "",
        rating: l.ratingAvg || 0,
        total_consultations: l.ratingCount || 0,
        isVerified: l.isVerified
      };
    },
    async getAll() {
      const resp = await request("/lawyers", { method: "GET" });
      const items = (resp.lawyers || []).map((l, idx) => ({
        id: l._id || idx + 1,
        full_name: l.fullName,
        specialty: (l.specialties && l.specialties[0]) || "",
        country: l.governorate || "",
        availability_status: l.availability_status || (l.ratingAvg ? "online_now" : "unavailable"),
        price_per_session: l.pricePerSession,
        session_duration_mins: 30,
        communication_methods: "chat",
        bio: l.bio || "",
        isVerified: true
      }));
      return { data: items };
    },
    async getPending() {
      const resp = await request("/lawyers/pending", { auth: true });
      const items = (resp.lawyers || []).map((l, idx) => ({
        id: l._id || idx + 1,
        full_name: l.fullName,
        specialty: (l.specialties && l.specialties[0]) || "",
        country: l.governorate || "",
        availability_status: "unavailable",
        price_per_session: l.pricePerSession,
        session_duration_mins: 30,
        communication_methods: "chat",
        bio: l.bio || "",
        isVerified: false
      }));
      return { data: items };
    },
    async verify(id) {
      return request(`/lawyers/${id}/verify`, { method: "PATCH", auth: true });
    },
    async setActive(id, isActive) {
      return request(`/lawyers/${id}/active`, {
        method: "PATCH",
        auth: true,
        body: { isActive: !!isActive }
      });
    },
    async update(id, payload) {
      const body = {
        fullName: payload.full_name,
        bio: payload.bio,
        governorate: payload.country,
        specialties: payload.specialty ? [payload.specialty] : undefined,
        pricePerSession: payload.price_per_session,
        isVerified: payload.isVerified,
        isActive: payload.availability_status ? payload.availability_status !== "unavailable" : undefined
      };
      return request(`/lawyers/${id}`, { method: "PATCH", auth: true, body });
    },
    async create(payload) {
      const body = {
        fullName: payload.full_name,
        email: payload.email || (`lawyer.${Date.now()}@example.com`),
        phone: payload.phone,
        bio: payload.bio,
        governorate: payload.country,
        specialties: payload.specialty ? [payload.specialty] : [],
        pricePerSession: payload.price_per_session,
        isVerified: true,
        isActive: payload.availability_status ? payload.availability_status !== "unavailable" : true
      };
      return request(`/lawyers`, { method: "POST", auth: true, body });
    },
    async delete(id) {
      return request(`/lawyers/${id}`, { method: "DELETE", auth: true });
    }
  },
  Templates: {
    complaints({ page = 1, limit = 20, q = "" } = {}) {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit), q });
      return request(`/templates/complaints?${qs.toString()}`);
    },
    complaint(id) {
      return request(`/templates/complaints/${id}`);
    },
    contracts({ page = 1, limit = 20, q = "" } = {}) {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit), q });
      return request(`/templates/contracts?${qs.toString()}`);
    },
    contract(id) {
      return request(`/templates/contracts/${id}`);
    }
  },
  Generated: {
    create({ templateKind = "complaint", templateId, userInputs = {} }) {
      return request("/generated", {
        method: "POST",
        auth: true,
        body: { templateKind, templateId, userInputs }
      });
    },
    mine({ page = 1, limit = 20 } = {}) {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      return request(`/generated/my?${qs.toString()}`, { auth: true });
    },
    async finalize(id) {
      return request(`/generated/${id}/finalize`, { method: "PATCH", auth: true });
    }
  },
  Chatbot: {
    async createSession(title) {
      return request("/chatbot/sessions", {
        method: "POST",
        auth: true,
        body: { title }
      });
    },
    async getSessions({ page = 1, limit = 20 } = {}) {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      return request(`/chatbot/sessions?${qs.toString()}`, { auth: true });
    },
    async getSession(id) {
      return request(`/chatbot/sessions/${id}`, { auth: true });
    },
    async sendMessage(sessionId, content) {
      return request(`/chatbot/sessions/${sessionId}/messages`, {
        method: "POST",
        auth: true,
        body: { content }
      });
    }
  },
  Profile: {
    get() {
      return request("/profile", { auth: true });
    },
    update(payload) {
      return request("/profile", { method: "PATCH", auth: true, body: payload });
    },
    uploadAvatar(file) {
      const form = new FormData();
      form.append("avatar", file);
      return request("/profile/avatar", { method: "POST", auth: true, body: form, isForm: true });
    }
  },
  getToken: getAccessToken,
  getUser: () => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "{}");
    } catch {
      return null;
    }
  },
  isLoggedIn: () => !!getAccessToken(),
  isAdmin: () => {
    const u = API.getUser();
    return u && (u.role && u.role.toLowerCase() === "admin");
  },
  requireAuth() {
    if (!API.isLoggedIn()) {
      console.warn("requireAuth: Not logged in, redirecting to login.html");
      const isHtmlFolder = window.location.pathname.includes("/html/");
      window.location.href = isHtmlFolder ? "login.html" : "html/login.html";
      throw new Error("Unauthorized");
    }
  },
  requireAdmin() {
    if (!API.isLoggedIn()) {
      console.warn("requireAdmin: Not logged in, redirecting to login.html");
      const isHtmlFolder = window.location.pathname.includes("/html/");
      window.location.href = isHtmlFolder ? "login.html" : "html/login.html";
      throw new Error("Admin required");
    }
    if (!API.isAdmin()) {
      const user = API.getUser();
      console.warn("requireAdmin: User is not admin (role:", user ? user.role : "none", "), redirecting to middle-east-law.html");
      const isHtmlFolder = window.location.pathname.includes("/html/");
      window.location.href = isHtmlFolder ? "middle-east-law.html" : "html/middle-east-law.html";
      throw new Error("Admin required");
    }
  },
  UI: {
    setLoading(btn, text = "Loading…") {
      if (!btn) return () => { };
      const prev = { text: btn.textContent, disabled: btn.disabled };
      btn.textContent = text;
      btn.disabled = true;
      return function restore() {
        btn.textContent = prev.text;
        btn.disabled = prev.disabled;
      };
    },
    toast(message, type = "info") {
      try {
        const existing = document.getElementById("lexa-toast-container");
        if (existing) existing.remove();

        const container = document.createElement("div");
        container.id = "lexa-toast-container";
        container.style.cssText = `
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          pointer-events: none;
        `;
        document.body.appendChild(container);

        const el = document.createElement("div");
        el.style.cssText = `
          min-width: 300px;
          padding: 16px 20px;
          border-radius: 12px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
          border-left: 5px solid rgba(0,0,0,0.1);
          pointer-events: auto;
        `;

        const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
        el.innerHTML = `<span style="font-size: 20px;">${icon}</span> <span>${message}</span>`;

        container.appendChild(el);

        // Trigger animation
        requestAnimationFrame(() => {
          el.style.transform = "translateX(0)";
        });

        setTimeout(() => {
          el.style.transform = "translateX(120%)";
          setTimeout(() => el.remove(), 500);
        }, 4000);
      } catch {
        alert(message);
      }
    },
    applyNavbar() {
      // Disable automatic navbar injection on admin/management pages
      const path = window.location.pathname;
      if (path.includes("admin-dashboard") || path.includes("-management") || path.includes("profile.html")) {
        console.log("applyNavbar: Skipping for admin/management page");
        return;
      }

      const logged = API.isLoggedIn();
      const navRight = document.querySelector(".navbar-right");
      const navMenu = document.querySelector(".navbar-menu");
      const navContainer = document.querySelector(".navbar-container");
      const topbar = document.querySelector(".topbar");
      const navLinks = document.querySelector(".nav-links");

      let container = navRight || navMenu || navContainer || topbar || navLinks || document.querySelector(".navbar");
      if (!container) return;

      const cta = (navRight && navRight.querySelector(".navbar-cta")) || document.querySelector(".navbar-cta");
      const btnLogin = document.querySelector(".btn-login");
      const btnSignup = document.querySelector(".btn-signup");
      const existing = container.querySelector(".nav-user");

      if (logged) {
        if (cta) cta.style.display = "none";
        if (btnLogin) btnLogin.style.display = "none";
        if (btnSignup) btnSignup.style.display = "none";

        // 1. Add notification bell before user dropdown
        if (!container.querySelector(".nav-notif-wrap")) {
          const notifWrap = document.createElement("div");
          notifWrap.className = "nav-notif-wrap";
          notifWrap.innerHTML = `
            <div class="notif-trigger" id="notif-trigger">
              <i class="fas fa-bell"></i>
              <span class="notif-badge hidden" id="notif-badge"></span>
            </div>
            <div class="notif-dropdown hidden" id="notif-dropdown">
              <div class="notif-header">
                <span>Notifications</span>
                <button id="mark-all-read">Mark all as read</button>
              </div>
              <div class="notif-list" id="notif-list">
                <div class="notif-empty">No notifications</div>
              </div>
            </div>
          `;
          container.insertBefore(notifWrap, container.firstChild);

          // --- Notification Logic ---
          const trigger = notifWrap.querySelector("#notif-trigger");
          const notifDropdown = notifWrap.querySelector("#notif-dropdown");
          const badge = notifWrap.querySelector("#notif-badge");
          const list = notifWrap.querySelector("#notif-list");
          const markAll = notifWrap.querySelector("#mark-all-read");

          async function updateNotifications() {
            try {
              const resp = await API.Notifications.get();
              const notifications = resp.notifications || [];
              const unreadCount = resp.unreadCount || 0;

              if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.classList.remove("hidden");
              } else {
                badge.classList.add("hidden");
              }

              if (notifications.length > 0) {
                list.innerHTML = notifications.map(n => `
                  <div class="notif-item ${n.isRead ? '' : 'unread'}" data-id="${n._id}">
                    <p>${n.message}</p>
                    <small>${new Date(n.createdAt).toLocaleString()}</small>
                  </div>
                `).join('');

                list.querySelectorAll(".notif-item").forEach(item => {
                  item.addEventListener("click", async () => {
                    const id = item.dataset.id;
                    await API.Notifications.markAsRead(id);
                    updateNotifications();
                    const notif = notifications.find(x => x._id === id);
                    if (notif && notif.link) window.location.href = notif.link;
                  });
                });
              } else {
                list.innerHTML = `<div class="notif-empty">No notifications</div>`;
              }
            } catch (e) { console.error("Notif update fail", e); }
          }

          if (trigger) {
            trigger.addEventListener("click", (e) => {
              e.stopPropagation();
              notifDropdown.classList.toggle("hidden");
              if (!notifDropdown.classList.contains("hidden")) updateNotifications();
            });
            document.addEventListener("click", () => notifDropdown.classList.add("hidden"));
            notifDropdown.addEventListener("click", (e) => e.stopPropagation());
          }

          if (markAll) {
            markAll.addEventListener("click", async (e) => {
              e.stopPropagation();
              await API.Notifications.markAllAsRead();
              updateNotifications();
            });
          }

          // Auto update notifications every minute
          setInterval(updateNotifications, 60000);
          updateNotifications();
        }

        const user = API.getUser() || {};

        // Hide Lawyer Dashboard link in existing nav if user is not a lawyer
        const dashLinks = document.querySelectorAll('a[href*="lawyer.html"]');
        dashLinks.forEach(link => {
          if (user.role !== 'lawyer') {
            link.style.display = "none";
          }
        });

        if (!existing) {
          const user = API.getUser() || {};
          const name = user.full_name || user.name || user.email || "User";
          const initials = (() => {
            const parts = (name || "").trim().split(/\s+/);
            return parts.length >= 2
              ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
              : (name || "U").slice(0, 2).toUpperCase();
          })();
          const wrap = document.createElement("div");
          wrap.className = "nav-user";
          wrap.style.display = "flex";
          wrap.style.alignItems = "center";
          wrap.style.gap = "10px";
          wrap.style.cursor = "pointer";
          wrap.style.position = "relative";
          const avatar = document.createElement("div");
          avatar.textContent = initials;
          avatar.style.width = "32px";
          avatar.style.height = "32px";
          avatar.style.borderRadius = "50%";
          avatar.style.display = "flex";
          avatar.style.alignItems = "center";
          avatar.style.justifyContent = "center";
          avatar.style.background = "linear-gradient(135deg,#c5954a,#d4a55a)";
          avatar.style.color = "#0d1524";
          avatar.style.fontWeight = "700";
          const label = document.createElement("span");
          label.textContent = name;
          label.style.color = "rgba(255,255,255,0.9)";
          label.style.fontSize = "14px";
          const dropdown = document.createElement("div");
          dropdown.className = "nav-user-dd";
          dropdown.style.position = "absolute";
          dropdown.style.top = "100%";
          dropdown.style.right = "0";
          dropdown.style.marginTop = "8px";
          dropdown.style.minWidth = "180px";
          dropdown.style.background = "rgba(13,21,36,0.98)";
          dropdown.style.border = "1px solid rgba(197,149,74,0.25)";
          dropdown.style.borderRadius = "10px";
          dropdown.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
          dropdown.style.display = "none";

          // 1. Profile link
          const linkProf = document.createElement("a");
          linkProf.href = "/html/profile.html";
          linkProf.textContent = "Profile";
          linkProf.style.display = "block";
          linkProf.style.padding = "10px 14px";
          linkProf.style.color = "rgba(255,255,255,0.9)";
          linkProf.style.textDecoration = "none";
          dropdown.appendChild(linkProf);

          // 2. My Consultations link
          const linkMy = document.createElement("a");
          linkMy.href = "/html/user-consultations.html";
          linkMy.textContent = "My Consultations";
          linkMy.style.display = "block";
          linkMy.style.padding = "10px 14px";
          linkMy.style.color = "rgba(255,255,255,0.9)";
          linkMy.style.textDecoration = "none";
          dropdown.appendChild(linkMy);

          // 3. Notifications (Toggle the notif dropdown)
          const linkNotify = document.createElement("a");
          linkNotify.href = "#";
          linkNotify.textContent = "Notifications";
          linkNotify.style.display = "block";
          linkNotify.style.padding = "10px 14px";
          linkNotify.style.color = "rgba(255,255,255,0.9)";
          linkNotify.style.textDecoration = "none";
          linkNotify.addEventListener("click", (e) => {
            e.preventDefault();
            const actualTrigger = document.getElementById("notif-trigger");
            if (actualTrigger) actualTrigger.click();
            dropdown.style.display = "none";
          });
          dropdown.appendChild(linkNotify);

          // 4. Logout button
          const linkLogout = document.createElement("button");
          linkLogout.textContent = "Logout";
          linkLogout.style.display = "block";
          linkLogout.style.width = "100%";
          linkLogout.style.padding = "10px 14px";
          linkLogout.style.background = "transparent";
          linkLogout.style.color = "rgba(255,255,255,0.9)";
          linkLogout.style.border = "none";
          linkLogout.style.textAlign = "left";
          linkLogout.style.cursor = "pointer";
          linkLogout.addEventListener("click", (e) => {
            e.preventDefault();
            API.logout();
          });
          dropdown.appendChild(linkLogout);
          wrap.appendChild(avatar);
          wrap.appendChild(label);
          wrap.appendChild(dropdown);
          wrap.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.style.display =
              dropdown.style.display === "none" ? "block" : "none";
          });
          document.addEventListener("click", () => {
            dropdown.style.display = "none";
          });
          // If menu is hidden (mobile), attach to navbar-container instead
          try {
            const isMenuHidden = navMenu && getComputedStyle(navMenu).display === "none";
            (isMenuHidden && navContainer ? navContainer : container).appendChild(wrap);
          } catch {
            container.appendChild(wrap);
          }
        }
      } else {
        if (cta) cta.style.display = "";
        if (btnLogin) btnLogin.style.display = "";
        if (btnSignup) btnSignup.style.display = "";
        if (existing) existing.remove();
      }
    }
  }
};

window.API = API;
document.addEventListener("DOMContentLoaded", () => {
  try {
    API.UI.applyNavbar();
  } catch { }
});
window.addEventListener("load", () => {
  try {
    API.UI.applyNavbar();
  } catch { }
});
window.addEventListener("resize", () => {
  try {
    API.UI.applyNavbar();
  } catch { }
});
