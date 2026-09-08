const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168.");
const API_BASE = isLocal ? "http://localhost:3000/api" : "https://graduation-backend2.vercel.app/api";

// ── Google OAuth Client ID ────────────────────────────────────────────────────
// Must match GOOGLE_CLIENT_ID in the backend .env.
// Also add your dev origin (e.g. http://localhost:5500) to "Authorized JavaScript
// origins" in Google Cloud Console → APIs & Services → Credentials → your OAuth client.
const GOOGLE_CLIENT_ID = "234729508376-016l8vi99f38m071fi012b3ttjinbdqm.apps.googleusercontent.com";
// Expose on window so login.js / signup.js can access it regardless of load order
window.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;

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

function getLang() {
  return localStorage.getItem("language") || "en";
}

function getAuthLabels() {
  const lang = getLang();
  if (lang === "ar") {
    return {
      myAccount: "حسابي",
      logout: "خروج",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب"
    };
  }
  return {
    myAccount: "My Account",
    logout: "Logout",
    login: "Login",
    signup: "Sign Up"
  };
}

function getDashboardHref(user) {
  const role = (user && user.role) ? String(user.role).toLowerCase() : "";
  if (role === "admin") return "/html/admin-dashboard.html";
  if (role === "lawyer") return "/html/lawyer.html";
  return "/html/profile.html";
}

function updateNavbarAuthUI() {
  const labels = getAuthLabels();
  const isLoggedIn = !!getAccessToken();
  const user = API.getUser ? API.getUser() : {};

  const ctas = Array.from(document.querySelectorAll(".navbar-cta"));
  const legacyCta = document.getElementById("navbarCta");
  if (legacyCta) ctas.push(legacyCta);

  ctas.forEach((cta) => {
    if (!cta) return;
    if (!isLoggedIn) {
      const loginLink = cta.querySelector('a[href*="login"]') || cta.querySelector(".btn-login");
      const signupLink = cta.querySelector('a[href*="signup"]') || cta.querySelector(".btn-signup");
      if (loginLink) loginLink.textContent = labels.login;
      if (signupLink) signupLink.textContent = labels.signup;
      return;
    }

    const href = getDashboardHref(user);
    cta.innerHTML = `
      <a href="${href}" class="btn-login">${labels.myAccount}</a>
      <button type="button" class="btn-signup" style="cursor:pointer; border:none;">${labels.logout}</button>
    `;

    const logoutBtn = cta.querySelector("button.btn-signup");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => API.logout());
    }
  });
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
    if (path.includes("/login")) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Invalid credentials");
    }
    logoutLocal();
    if (!window.location.pathname.includes("login.html")) {
      const intended = window.location.pathname + window.location.search;
      window.location.href = '/html/login.html?redirect=' + encodeURIComponent(intended);
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
    // Redirect to login, preserving current page as the post-login destination
    const current = window.location.pathname + window.location.search;
    const isLoginPage = current.includes('login.html');
    if (isLoginPage) {
      window.location.href = '/html/login.html';
    } else {
      window.location.href = '/html/login.html?redirect=' + encodeURIComponent(current);
    }
  },
  isLoggedIn() {
    return !!getAccessToken();
  },
  getUser() {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "{}");
    } catch (e) {
      return {};
    }
  },
  isAdmin() {
    const user = this.getUser();
    return user && user.role === "admin";
  },
  requireAdmin() {
    if (!this.isAdmin()) {
      alert("Admin access required");
      window.location.href = "/index.html";
      throw new Error("Unauthorized");
    }
  },
  /**
   * Hard guard — call at the top of protected pages.
   * Stores the intended URL and redirects to login if not authenticated.
   * On login success, login.js reads ?redirect= and sends the user back.
   */
  requireAuth() {
    if (!this.isLoggedIn()) {
      const intended = window.location.pathname + window.location.search;
      window.location.href = '/html/login.html?redirect=' + encodeURIComponent(intended);
      throw new Error("Login required");
    }
  },
  /**
   * Soft gate — use on CTA buttons that need auth but are on a public page.
   * If logged in, runs callback(). If not, stores intended URL and goes to login.
   *
   * @param {string}   redirectUrl  - The protected page to go to after login
   * @param {Function} [callback]   - Optional: run this instead of redirecting when logged in
   */
  authGate(redirectUrl, callback) {
    if (this.isLoggedIn()) {
      if (typeof callback === 'function') {
        callback();
      } else {
        window.location.href = redirectUrl;
      }
    } else {
      window.location.href = '/html/login.html?redirect=' + encodeURIComponent(redirectUrl);
    }
  },
  Auth: {
    async register({ fullName, email, password }) {
      const data = await request("/auth/register", {
        method: "POST",
        body: { fullName, email, password }
      });
      setTokens(data);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      try { updateNavbarAuthUI(); } catch { }
      return data;
    },
    async login(email, password) {
      const data = await request("/auth/login", {
        method: "POST",
        body: { email, password }
      });
      setTokens(data);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      try { updateNavbarAuthUI(); } catch { }
      return data;
    },
    async me() {
      return request("/auth/me", { auth: true });
    },

    // ── Email Verification (OTP) ────────────────────────────────────────────
    async sendVerificationOTP() {
      // Requires Bearer token (user just registered). No body needed.
      return request("/auth/send-verification-otp", { method: "POST", auth: true, body: {} });
    },
    async verifyEmail({ email, otp }) {
      return request("/auth/verify-email", { method: "POST", body: { email, otp } });
    },

    // ── Forgot / Reset Password (OTP) ────────────────────────────────────────
    async forgotPassword({ email }) {
      return request("/auth/forgot-password", { method: "POST", body: { email } });
    },
    async verifyResetOTP({ email, otp }) {
      // Returns { ok: true, resetToken } on success
      return request("/auth/verify-reset-otp", { method: "POST", body: { email, otp } });
    },
    async resetPassword({ resetToken, newPassword }) {
      return request("/auth/reset-password", { method: "POST", body: { resetToken, newPassword } });
    },

    // ── Google OAuth ─────────────────────────────────────────────────────────
    // idToken comes from Google Identity Services (GSI) callback response.credential.
    // On success, backend returns the same shape as login: { user, accessToken, refreshToken }
    async googleAuth(idToken) {
      const data = await request("/auth/google", {
        method: "POST",
        body: { idToken }
      });
      setTokens(data);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      try { updateNavbarAuthUI(); } catch { }
      return data;
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
    async deleteUser(id) {
      return request(`/admin/users/${id}`, { method: "DELETE", auth: true });
    },
    async updateUser(id, payload) {
      return request(`/admin/users/${id}`, { method: "PATCH", auth: true, body: payload });
    },
    async createUser(payload) {
      return request(`/admin/users`, { method: "POST", auth: true, body: payload });
    },
    consultations({ page = 1, limit = 20 } = {}) {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      return request(`/admin/consultations?${qs.toString()}`, { auth: true });
    },
    async getConsultations() {
      const resp = await this.consultations({ page: 1, limit: 100 });
      return {
        data: (resp.items || []).map((x) => ({
          id: x._id,
          client_name: (x.userId && x.userId.fullName) || "",
          lawyer_name: (x.lawyerId && x.lawyerId.fullName) || "",
          legal_area: (x.lawyerId && x.lawyerId.specialties && x.lawyerId.specialties[0]) || "",
          communication_method: x.type,
          status: x.status,
          description: x.notes || "",
          created_at: x.createdAt
        }))
      };
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
        price_per_session: l.pricePerSession,
        bio: l.bio || "",
        rating: l.ratingAvg || 0,
        total_consultations: l.ratingCount || 0,
        isVerified: l.isVerified,
        isActive: l.isActive
      };
    },
    async getAll() {
      const resp = await request("/lawyers?all=true", { method: "GET" });
      return {
        data: (resp.lawyers || []).map(l => ({
          id: l._id,
          fullName: l.fullName,
          specialties: l.specialties,
          governorate: l.governorate,
          pricePerSession: l.pricePerSession,
          isVerified: l.isVerified,
          isActive: l.isActive
        }))
      };
    },
    async getPending() {
      const resp = await request("/lawyers/pending", { auth: true });
      return {
        data: (resp.lawyers || []).map(l => ({
          id: l._id,
          fullName: l.fullName,
          specialties: l.specialties,
          governorate: l.governorate,
          pricePerSession: l.pricePerSession,
          isVerified: l.isVerified,
          isActive: l.isActive
        }))
      };
    },
    async verify(id) {
      return request(`/lawyers/${id}/verify`, { method: "PATCH", auth: true });
    },
    async setActive(id, isActive) {
      return request(`/lawyers/${id}/active`, { method: "PATCH", auth: true, body: { isActive } });
    },
    async update(id, payload) {
      return request(`/lawyers/${id}`, { method: "PATCH", auth: true, body: payload });
    },
    async create(payload) {
      return request(`/lawyers`, { method: "POST", auth: true, body: payload });
    },
    async delete(id) {
      return request(`/lawyers/${id}`, { method: "DELETE", auth: true });
    }
  },
  Consult: {
    async book({ lawyerId, notes, type }) {
      return request("/bookings", { method: "POST", auth: true, body: { lawyerId, notes, type } });
    },
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
    async getMine() {
      return request("/consultations/my", { auth: true });
    },
    async getLawyerConsultations() {
      return request("/consultations/lawyer/me", { auth: true });
    },
    async updateStatus(id, status) {
      return request(`/bookings/${id}`, { method: "PUT", auth: true, body: { status } });
    },
    async sendMessage(consultationId, message) {
      return request(`/consultations/${consultationId}/messages`, { method: "POST", auth: true, body: { message } });
    },
    async getMessages(consultationId) {
      return request(`/consultations/${consultationId}/messages`, { auth: true });
    }
  },
  Documents: {
    async listTemplates() {
      return request("/documents/templates");
    },
    async getTemplate(type, name) {
      return request(`/documents/templates/${type}?name=${name}`);
    },
    async generate(payload) {
      return request("/documents/generate", { method: "POST", body: payload });
    },
    async upload(file) {
      const fd = new FormData();
      fd.append("file", file);
      // Backend route is /api/docs/upload, but API map uses Documents
      return request("/docs/upload", { method: "POST", auth: true, body: fd, isForm: true });
    }
  },
  // Alias for scripts expecting Document or Docs
  Docs: {
    upload(file) { return API.Documents.upload(file); }
  },
  Document: {
    upload(file) { return API.Documents.upload(file); }
  },
  Procedures: {
    async search(query) {
      return request(`/procedures/search?query=${encodeURIComponent(query)}`);
    },
    async list({ q, category } = {}) {
      const qs = new URLSearchParams();
      if (q) qs.set('q', q);
      if (category) qs.set('category', category);
      return request(`/procedures?${qs.toString()}`);
    }
  },
  Chatbot: {
    async createSession(title) {
      return request("/chatbot/sessions", { method: "POST", auth: true, body: { title } });
    },
    async getSessions() {
      return request("/chatbot/sessions", { auth: true });
    },
    async sendMessage(sessionId, content) {
      return request(`/chatbot/sessions/${sessionId}/messages`, { method: "POST", auth: true, body: { content } });
    }
  },
  Profile: {
    get() {
      return request("/profile", { auth: true });
    },
    update(payload) {
      return request("/profile", { method: "PATCH", auth: true, body: payload });
    },
    async uploadAvatar(file) {
      const fd = new FormData();
      fd.append("avatar", file);
      return request("/profile/avatar", { method: "POST", auth: true, body: fd, isForm: true });
    },
    async getNotifications() {
      return request("/profile/notifications", { auth: true });
    },
    async markNotificationsRead() {
      return request("/profile/notifications/read", { method: "PATCH", auth: true });
    }
  },
  Match: {
    async recommend(payload) {
      return request("/lawyers/recommend", { method: "POST", body: payload });
    },
    async match(payload) {
      return this.recommend(payload);
    }
  },
  Contact: {
    async submit(payload) {
      return request("/contact", { method: "POST", body: payload });
    },
    async list() {
      return request("/contact", { auth: true });
    }
  },
  UI: {
    toast(msg, type = "info") {
      alert(`${type.toUpperCase()}: ${msg}`);
    },
    setLoading(btn, text) {
      const old = btn.textContent;
      btn.textContent = text;
      btn.disabled = true;
      return () => {
        btn.textContent = old;
        btn.disabled = false;
      };
    }
  }
};

try {
  document.addEventListener("DOMContentLoaded", () => {
    updateNavbarAuthUI();
    window.addEventListener("storage", updateNavbarAuthUI);
    window.addEventListener("languageChanged", updateNavbarAuthUI);
  });
} catch (e) { console.error("DOMContentLoaded error in api.js:", e); }

try { updateNavbarAuthUI(); } catch (e) { console.error("Immediate updateNavbarAuthUI error:", e); }
