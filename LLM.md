# LexaGuide Frontend — LLM Context File

> **Purpose**: This file gives AI coding assistants full context about the frontend codebase.
> Keep this file updated whenever you add pages, JS modules, or change the API integration.

---

## 📝 Project Overview

**LexaGuide** is a legal assistance platform for Egypt. This repository is the **Vanilla JS + HTML/CSS frontend** only.

### What This Frontend Does
- Landing page + public lawyer directory
- User / Lawyer / Admin login & registration flows
- Consultation creation, tracking, and real-time-like chat (polling)
- Legal template browsing (contracts + complaints)
- Document generation flow (fills legal forms dynamically)
- Government procedures reference pages
- Contract analysis via AI upload
- Legal chatbot interface
- User profile management with avatar upload
- Admin dashboard (stats, user/lawyer/consultation management)
- EN/AR localization support

### Related Repos
| Repo | Description |
|---|---|
| `Graduation-Backend2` | Node.js + Express REST API |
| `egail-lawyer-recommendation` | Python FastAPI AI recommendation microservice |

---

## 🏗️ Architecture

### Tech Stack
| Layer | Technology |
|---|---|
| Markup | Vanilla HTML5 |
| Styling | Vanilla CSS (Glassmorphism design system) |
| Logic | Vanilla JavaScript (ES6+, no bundler) |
| API Layer | Centralized `shared/api.js` |
| i18n | `shared/i18n.js` (EN / AR switching) |
| Deployment | Vercel (static hosting via `vercel.json`) |

### Folder Structure

```
lexaguide-frontend/
├── index.html              # Landing page (root entry point)
├── html/                   # All inner pages
│   ├── login.html
│   ├── signup.html
│   ├── profile.html
│   ├── lawyer.html         # Lawyer dashboard
│   ├── customer.html       # Client area
│   ├── user-consultations.html
│   ├── admin-dashboard.html
│   ├── users-management.html
│   ├── lawyers-management.html
│   ├── consultations-management.html
│   ├── lawyers.html        # Public lawyer directory
│   ├── legal-contracts.html
│   ├── legal-doc-generation.html
│   ├── generate-document.html
│   ├── legal-procedures.html
│   ├── contract-analysis.html
│   ├── chatbot.html
│   ├── about.html
│   ├── contact.html
│   ├── middle-east-law.html
│   ├── privacy.html
│   └── terms.html
├── js/                     # Page-level JavaScript controllers
│   ├── home.js
│   ├── login.js
│   ├── signup.js
│   ├── profile.js
│   ├── lawyer.js
│   ├── customer.js
│   ├── customer-consultations.js
│   ├── admin-dashboard.js
│   ├── users-management.js
│   ├── lawyers-management.js
│   ├── consultations-management.js
│   ├── legal-contracts.js
│   ├── generate-document.js
│   ├── legal-doc-generation.js
│   ├── legal-procedures.js
│   ├── procedures.js
│   ├── contract-analysis.js
│   ├── chatbot.js
│   ├── about.js
│   ├── contact.js
│   └── middle-east-law.js
├── css/                    # Per-page stylesheets
│   ├── login.css
│   ├── signup.css
│   ├── profile.css
│   ├── lawyer.css
│   ├── customer.css
│   ├── admin-common.css
│   ├── users-management.css
│   ├── lawyers-management.css
│   ├── consultations-management.css
│   ├── legal-contracts.css
│   ├── legal-doc-generation.css
│   ├── legal-procedures.css
│   ├── contract-analysis.css
│   ├── chatbot.css
│   ├── about.css
│   ├── contact.css
│   └── middle-east-law.css
├── shared/                 # Shared utilities (used by all pages)
│   ├── api.js              # ⭐ Central API client — ALL backend calls go here
│   ├── i18n.js             # EN/AR language switching
│   └── home.css            # Shared landing page styles
└── assets/                 # Images, logos, icons
```

---

## ⭐ The API Engine: `shared/api.js`

This is the **single source of truth** for all frontend → backend communication.
**Every page JS file MUST use `API.Xxx.yyy()` — never use `fetch()` directly.**

### How It Works
- Auto-selects `API_BASE`: `http://localhost:3000/api` (local) or the production Vercel backend URL
- Auth tokens stored in `sessionStorage` (keys: `accessToken`, `refreshToken`, `user`)
- Global `request(path, options)` wrapper:
  - Injects `Authorization: Bearer <token>` when `auth: true`
  - Auto-redirects to `/html/login.html` on any `401` (except on the login endpoint itself)
  - Throws descriptive `Error` on non-2xx responses
  - `credentials: 'include'` for cookie-based refresh support

### API Namespaces
```js
API.Auth.register(data)       // POST /api/auth/register
API.Auth.login(data)          // POST /api/auth/login
API.Auth.me()                 // GET  /api/auth/me
API.Auth.changePassword(data) // POST /api/auth/change-password

API.Profile.get()             // GET  /api/profile
API.Profile.update(data)      // PATCH /api/profile
API.Profile.uploadAvatar(formData) // POST /api/profile/avatar

API.Lawyer.getAll(params)     // GET  /api/lawyers
API.Lawyer.getById(id)        // GET  /api/lawyers/:id
API.Lawyer.search(params)     // GET  /api/lawyers (with filters)
API.Lawyer.getPending()       // GET  /api/lawyers/pending
API.Lawyer.verify(id)         // PATCH /api/lawyers/:id/verify

API.Templates.Complaints.list(params)  // GET /api/templates/complaints
API.Templates.Complaints.get(id)       // GET /api/templates/complaints/:id
API.Templates.Contracts.list(params)   // GET /api/templates/contracts
API.Templates.Contracts.get(id)        // GET /api/templates/contracts/:id

API.Generated.create(data)    // POST /api/generated
API.Generated.my(params)      // GET  /api/generated/my
API.Generated.get(id)         // GET  /api/generated/:id
API.Generated.finalize(id)    // PATCH /api/generated/:id/finalize

API.Docs.upload(formData)     // POST  /api/docs/upload
API.Docs.my()                 // GET   /api/docs/my
API.Docs.delete(id)           // DELETE /api/docs/:id

API.Consult.create(data)           // POST  /api/consultations
API.Consult.my()                   // GET   /api/consultations/my
API.Consult.lawyerMe()             // GET   /api/consultations/lawyer/me
API.Consult.get(id)                // GET   /api/consultations/:id
API.Consult.listMessages(id)       // GET   /api/consultations/:id/messages
API.Consult.sendMessage(id, data)  // POST  /api/consultations/:id/messages
API.Consult.updateStatus(id, data) // PATCH /api/consultations/:id/status

API.Match.match(params)   // POST to AI recommendation service

API.Admin.stats()                     // GET   /api/admin/stats
API.Admin.getAllUsers(params)          // GET   /api/admin/users
API.Admin.toggleUserActive(id)        // PATCH /api/admin/users/:id/toggle-active
API.Admin.getConsultations(params)    // GET   /api/admin/consultations

API.Contact.submit(data)  // POST /api/contact
```

---

## 🎨 Design System — Glassmorphism

All pages follow a unified **Glassmorphism** design language:
- **Colors**: Deep navy/dark backgrounds with vibrant accent gradients
- **Cards**: `backdrop-filter: blur(...)` + semi-transparent backgrounds
- **Typography**: Modern Arabic-friendly fonts
- **Responsive**: CSS media queries in each page's stylesheet

### Rules for New Pages
1. Copy base card/container styles from an existing CSS file (e.g. `css/profile.css`)
2. Use CSS custom properties (`--color-primary`, etc.) for consistency
3. Never use inline styles for colors or layout
4. Maintain RTL support (`direction: rtl`) for Arabic mode

---

## 🌐 i18n (EN / AR Localization)

- `shared/i18n.js` handles language switching
- Language preference stored in `localStorage.language`
- UI labels retrieved via helper functions like `getAuthLabels()`, `getNavLabels()`, etc.
- Default: detects browser language or falls back to Arabic
- **All user-facing text MUST go through i18n** — no hardcoded English/Arabic strings in HTML or JS

---

## 💬 Consultation Chat System

- Frontend polls `GET /api/consultations/:id/messages` every **5 seconds**
- **Smart polling**: pauses via `document.visibilitychange` when tab is hidden
- **Duplicate request guard**: uses a loading flag to prevent concurrent fetches
- Toast notifications + audio alert on new messages
- Full Glassmorphism chat UI with message bubbles
- Chat accessible in read-only mode after consultation is `completed`

---

## 📄 Page Map

| HTML File | JS Controller | Purpose |
|---|---|---|
| `index.html` | `js/home.js` | Landing page |
| `html/login.html` | `js/login.js` | Unified login (User / Lawyer / Admin) |
| `html/signup.html` | `js/signup.js` | User registration |
| `html/profile.html` | `js/profile.js` | Profile editing + avatar upload |
| `html/lawyer.html` | `js/lawyer.js` | Lawyer dashboard |
| `html/customer.html` | `js/customer.js` | Client home area |
| `html/user-consultations.html` | `js/customer-consultations.js` | Consultation list + chat |
| `html/admin-dashboard.html` | `js/admin-dashboard.js` | Admin overview |
| `html/users-management.html` | `js/users-management.js` | Admin: user management |
| `html/lawyers-management.html` | `js/lawyers-management.js` | Admin: lawyer verification |
| `html/consultations-management.html` | `js/consultations-management.js` | Admin: all consultations |
| `html/lawyers.html` | — | Public lawyer directory |
| `html/legal-contracts.html` | `js/legal-contracts.js` | Contract templates |
| `html/legal-doc-generation.html` | `js/legal-doc-generation.js` | Document generation flow |
| `html/generate-document.html` | `js/generate-document.js` | Fill & download document |
| `html/legal-procedures.html` | `js/legal-procedures.js` | Government procedures |
| `html/contract-analysis.html` | `js/contract-analysis.js` | AI contract analysis |
| `html/chatbot.html` | `js/chatbot.js` | Legal chatbot |
| `html/about.html` | `js/about.js` | About page |
| `html/contact.html` | `js/contact.js` | Contact form |
| `html/middle-east-law.html` | `js/middle-east-law.js` | Regional legal information |
| `html/privacy.html` | — | Privacy policy |
| `html/terms.html` | — | Terms of service |

---

## 🧑‍💻 Coding Conventions (Must Follow)

1. **API Calls**: ALWAYS use `API.Xxx.yyy()` from `shared/api.js` — never call `fetch()` directly
2. **New Endpoints**: If backend adds an endpoint, add it BOTH in the backend routes AND in `shared/api.js`
3. **CSS**: New styles MUST match the Glassmorphism aesthetic — use `backdrop-filter`, gradients, and existing variable names
4. **i18n**: All user-visible text goes through `shared/i18n.js` helper functions
5. **Auth Redirect**: Do not manually redirect on 401 — `api.js` handles it automatically
6. **Arabic RTL**: Ensure all new layouts work correctly in RTL mode (test with language=ar)
7. **No Frameworks**: This is a Zero-dependency vanilla JS project — do not introduce npm modules or bundlers

---

**Last Updated**: 2026-09-03
**Scope**: Frontend repo only (`lexaguide-frontend`)
