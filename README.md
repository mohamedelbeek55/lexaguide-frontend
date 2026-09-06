# ⚖️ LexaGuide — Frontend

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-1572B6?logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)
![i18n](https://img.shields.io/badge/i18n-EN%20%2F%20AR-green)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

> Web frontend for **LexaGuide** — Egypt's legal assistance platform, built with Vanilla JavaScript, HTML, and a Glassmorphism CSS design system. No bundler. No framework. Zero dependencies.

---

## ✨ Features

- 🔐 **Authentication** — Unified login/register for Users, Lawyers, and Admins
- 🔑 **Google Sign-In** — One-click sign-in / sign-up via Google Identity Services (GSI)
- ✉️ **Email Verification** — 6-digit OTP flow after registration with resend cooldown
- 🔒 **Forgot Password** — 3-step OTP-based password reset (email → OTP → new password)
- 👨‍⚖️ **Lawyer Directory** — Search and filter verified lawyers
- 💬 **Consultation Chat** — Real-time-like chat via smart polling with toast notifications
- 📄 **Legal Templates** — Browse and search contracts and complaint templates
- 🖨️ **Document Generation** — Fill and download legal documents from templates
- 🏛️ **Government Procedures** — Reference database for legal/administrative processes
- 🤖 **Legal Chatbot** — AI-powered legal assistant interface
- 📎 **Document Upload** — Upload and manage legal files via Cloudinary
- 🌐 **Bilingual (EN/AR)** — Full localization with RTL support
- 🛡️ **Admin Dashboard** — Platform management: users, lawyers, consultations

---

## 🚀 Getting Started (Local Development)

No build step required.

### Method 1: VS Code Live Server (Recommended)
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension
2. Open `index.html` → right-click → **Open with Live Server**
3. Make sure the backend is running on port `3000`

The frontend auto-detects `localhost` and points API calls to `http://localhost:3000/api`.

### Method 2: Any Static File Server
```bash
# Python
python -m http.server 5500

# Node.js (npx)
npx serve . -p 5500
```

> **Important**: The backend's `FRONTEND_ORIGINS` must include your local origin (e.g. `http://localhost:5500`) to avoid CORS errors.

---

## 📁 Project Structure

```
lexaguide-frontend/
├── index.html              # Landing page (entry point)
├── html/                   # All inner HTML pages
├── js/                     # Page-level JS controllers (one per page)
├── css/                    # Per-page stylesheets
├── shared/
│   ├── api.js              # ⭐ Central API client — ALL backend calls
│   ├── i18n.js             # EN/AR localization engine
│   └── home.css            # Shared landing styles
├── assets/                 # Images, logos, icons
└── vercel.json             # Vercel deployment configuration
```

---

## ⭐ The API Layer (`shared/api.js`)

Every backend call goes through the centralized `API` object — **never use `fetch()` directly**.

```js
// Authentication
API.Auth.register(data)
API.Auth.login(email, password)
API.Auth.me()
API.Auth.googleAuth(idToken)           // Google Sign-In (ID-token flow)
API.Auth.sendVerificationOTP()         // Resend email OTP (Bearer)
API.Auth.verifyEmail({ email, otp })
API.Auth.forgotPassword({ email })
API.Auth.verifyResetOTP({ email, otp }) // → { resetToken }
API.Auth.resetPassword({ resetToken, newPassword })

// Profile
API.Profile.get()
API.Profile.update(data)
API.Profile.uploadAvatar(formData)

// Lawyers
API.Lawyer.getAll(params)
API.Lawyer.getById(id)
API.Lawyer.getPending()
API.Lawyer.verify(id)

// Consultations
API.Consult.create(data)
API.Consult.my()
API.Consult.get(id)
API.Consult.listMessages(id)
API.Consult.sendMessage(id, text)
API.Consult.updateStatus(id, status)

// Templates & Docs
API.Templates.Complaints.list(params)
API.Templates.Contracts.list(params)
API.Generated.create(data)
API.Docs.upload(formData)

// Admin
API.Admin.stats()
API.Admin.getAllUsers(params)
API.Admin.toggleUserActive(id)

// Contact
API.Contact.submit(data)
```

---

## 🎨 Design System — Glassmorphism

The UI uses a consistent Glassmorphism design language across all pages:

| Token | Usage |
|---|---|
| Background | Dark navy gradients |
| Cards | `backdrop-filter: blur()` + translucent backgrounds |
| Accents | Vibrant gold/blue gradients |
| Text | White with opacity variants |
| Border | `rgba(255,255,255,0.1)` subtle borders |

All styles are in the `/css` folder. Each page has its own CSS file.

---

## 🌐 Localization (EN / AR)

- Managed by `shared/i18n.js`
- Language stored in `localStorage.language`
- Toggle handled inside the navbar
- All RTL layout adapts automatically via `direction: rtl`

---

## 📄 Pages

| Page | Description |
|---|---|
| Landing (`index.html`) | Hero, features, call to action |
| Login / Signup | Auth forms — email/password + Google Sign-In button |
| Verify Email | 6-digit OTP entry after registration |
| Forgot Password | Enter email to receive reset OTP |
| Reset Password | Enter OTP → verify → set new password |
| Profile | Edit info, upload avatar |
| Lawyer Dashboard | Manage consultations (lawyer side) |
| Customer Area | Create & track consultations (user side) |
| Admin Dashboard | Stats, user & lawyer management |
| Legal Contracts | Browse contract templates |
| Document Generator | Fill and download legal documents |
| Government Procedures | Reference for legal/admin processes |
| Contract Analysis | Upload contract for AI analysis |
| Legal Chatbot | Chat with the AI legal assistant |
| About / Contact / Privacy / Terms | Informational pages |

---

## 🌍 Deployment (Vercel)

The project is pre-configured for Vercel static deployment via `vercel.json`.

```bash
vercel --prod
```

> **Google Sign-In setup**: Add your production domain to **Authorized JavaScript origins** in Google Cloud Console → APIs & Services → Credentials → your OAuth Client. Also add `http://localhost:5500` (or your local dev port) for local development. Without this, the Google button will not render.

---

## 🔗 Related Repositories

| Repo | Stack | Description |
|---|---|---|
| `Graduation-Backend2` | Node.js / Express / MongoDB | REST API backend |
| `egail-lawyer-recommendation` | Python / FastAPI | AI lawyer matching microservice |
