// Dynamic API base: prod by default, switches to local on localhost or via ?api=local or localStorage override
(function initApiBase() {
  try {
    var url = new URL(window.location.href);
    var q = url.searchParams.get("api");
    if (q === "local") localStorage.setItem("API_BASE_OVERRIDE", "http://127.0.0.1:3000/api");
    if (q === "prod") localStorage.setItem("API_BASE_OVERRIDE", "https://graduation-backend2.vercel.app/api");
  } catch (e) { /* ignore */ }
})();
const API_BASE = (() => {
  try {
    const override = localStorage.getItem("API_BASE_OVERRIDE");
    if (override) return override;
    const host = (typeof window !== "undefined" && window.location && window.location.hostname) || "";
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://127.0.0.1:3000/api";
    }
  } catch (e) { /* ignore */ }
  return "https://graduation-backend2.vercel.app/api";
})();

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
      const data = await request("/auth/login", {
        method: "POST",
        body: { email, password }
      });
      setTokens(data);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      return data;
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
      return request(`/consultations/${id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status }
      });
    },
    async book({ lawyer_id, legal_area_id, communication_method, description } = {}) {
      const lawyerId = lawyer_id || "";
      const notes = description || "";
      return request("/consultations", {
        method: "POST",
        auth: true,
        body: { lawyerId, notes }
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
        const el = document.createElement("div");
        el.style.position = "fixed";
        el.style.bottom = "16px";
        el.style.right = "16px";
        el.style.zIndex = "9999";
        el.style.padding = "10px 12px";
        el.style.borderRadius = "6px";
        el.style.color = "#fff";
        el.style.background = type === "success" ? "#27ae60" : type === "error" ? "#c0392b" : "#2c3e50";
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
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
      let container = navRight || navMenu || navContainer || document.querySelector(".navbar");
      if (!container) return;

      const cta = (navRight && navRight.querySelector(".navbar-cta")) || document.querySelector(".navbar-cta");
      const btnLogin = document.querySelector(".btn-login");
      const btnSignup = document.querySelector(".btn-signup");
      const existing = container.querySelector(".nav-user");

      if (logged) {
        if (cta) cta.style.display = "none";
        if (btnLogin) btnLogin.style.display = "none";
        if (btnSignup) btnSignup.style.display = "none";
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
          const linkProf = document.createElement("a");
          linkProf.href = "/html/profile.html";
          linkProf.textContent = "Profile";
          linkProf.style.display = "block";
          linkProf.style.padding = "10px 14px";
          linkProf.style.color = "rgba(255,255,255,0.9)";
          linkProf.style.textDecoration = "none";
          const linkLogout = document.createElement("button");
          linkLogout.textContent = "Logout";
          linkLogout.style.display = "block";
          linkLogout.style.width = "100%";
          linkLogout.style.padding = "10px 14px";
          linkLogout.style.background = "transparent";
          linkLogout.style.color = "rgba(255,255,255,0.9)";
          linkLogout.style.border = "none";
          linkLogout.style.textAlign = "left";
          linkLogout.addEventListener("click", () => {
            API.logout();
            window.location.href = "/";
          });
          dropdown.appendChild(linkProf);
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
