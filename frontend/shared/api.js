// frontend/shared/api.js

export const API_BASE = "https://lexaguide-backend.vercel.app/api"; // غيرها لو local

function getAccessToken() {
  return localStorage.getItem("accessToken") || "";
}

function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

export function logoutLocal() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
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

/* =========================
   AUTH
========================= */
export async function register(fullName, email, password) {
  const data = await request("/auth/register", {
    method: "POST",
    body: { fullName, email, password }
  });
  setTokens(data);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

export async function login(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { email, password }
  });
  setTokens(data);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

export async function me() {
  return request("/auth/me", { auth: true });
}

/* =========================
   ADMIN
========================= */
export async function adminStats() {
  return request("/admin/stats", { auth: true });
}

export async function adminUsers({ page = 1, limit = 20, q = "" } = {}) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit), q });
  return request(`/admin/users?${qs.toString()}`, { auth: true });
}

export async function adminToggleUser(id) {
  return request(`/admin/users/${id}/toggle-active`, { method: "PATCH", auth: true });
}

export async function adminConsultations({ page = 1, limit = 20 } = {}) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  return request(`/admin/consultations?${qs.toString()}`, { auth: true });
}

/* =========================
   TEMPLATES
========================= */
export async function listComplaintTemplates({ page = 1, limit = 20, q = "" } = {}) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit), q });
  return request(`/templates/complaints?${qs.toString()}`);
}

export async function getComplaintTemplate(id) {
  return request(`/templates/complaints/${id}`);
}

export async function listContractTemplates({ page = 1, limit = 20, q = "" } = {}) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit), q });
  return request(`/templates/contracts?${qs.toString()}`);
}

export async function getContractTemplate(id) {
  return request(`/templates/contracts/${id}`);
}

/* =========================
   GENERATED
========================= */
export async function createGenerated({ templateKind = "complaint", templateId, userInputs = {} }) {
  return request("/generated", {
    method: "POST",
    auth: true,
    body: { templateKind, templateId, userInputs }
  });
}

export async function myGenerated({ page = 1, limit = 20 } = {}) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  return request(`/generated/my?${qs.toString()}`, { auth: true });
}

export async function finalizeGenerated(id) {
  return request(`/generated/${id}/finalize`, { method: "PATCH", auth: true });
}

/* =========================
   PROFILE
========================= */
export async function getProfile() {
  return request("/profile", { auth: true });
}

export async function updateProfile(payload) {
  return request("/profile", { method: "PATCH", auth: true, body: payload });
}

export async function uploadAvatar(file) {
  const form = new FormData();
  form.append("avatar", file);
  return request("/profile/avatar", { method: "POST", auth: true, body: form, isForm: true });
}