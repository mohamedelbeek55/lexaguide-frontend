# LexaGuide - Full Project Documentation (LLM Context)

## 📝 Project Overview

**LexaGuide** is a comprehensive legal assistance platform designed for Egypt. It connects clients with lawyers, provides instant legal consultations via chat, analyzes contracts using AI, and generates legal documents automatically.

### Core Features
- User/Lawyer/Admin role-based authentication system
- Lawyer search with AI-powered recommendation engine
- Real-time consultation chat system (Polling-based)
- Legal contract & complaint templates library
- Document generation engine (auto-fill user inputs)
- Government procedures database
- Legal chatbot
- Contract analysis & document upload (Cloudinary)
- Contact form system
- Admin dashboard with full user/lawyer management

---

## 🏗️ Project Architecture

### High-Level Structure

```
LexaGuide/
├── backend/                          # Node.js + Express REST API
├── frontend files at root level:
│   ├── index.html                    # Landing page
│   ├── html/                         # All page HTML files
│   ├── css/                          # Glassmorphism CSS styles
│   ├── js/                           # Vanilla JS page controllers
│   ├── shared/                       # Shared utilities (api.js, i18n.js)
│   └── assets/                       # Images, logos, icons
├── ai rec/
│   └── egail-lawyer-recommendation-mongo/  # Python FastAPI AI service
├── LEXAGUIDE_STATUS.md               # Project status & handover (Arabic)
├── code_audit_report.md              # Code issues & architecture report (English)
└── LLM.md                            # THIS FILE - Full project context
```

---

## 1️⃣ Backend (Node.js + Express + MongoDB)

### Location: `/LexaGuide/backend/`

### Tech Stack
- **Runtime**: Node.js (ES Modules enabled via `"type": "module"`)
- **Framework**: Express.js v5.x
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT (Access Token 15min + Refresh Token 30days with rotation)
- **Storage**: Cloudinary (file uploads: avatars, documents)
- **Validation**: Zod schema validation
- **Security**: Helmet, CORS, Express Rate Limit, bcryptjs password hashing
- **Logging**: Morgan (dev)
- **File Upload**: Multer + multer-storage-cloudinary
- **Deployment**: Vercel (serverless handler in `server.js`)

### Package Scripts
```bash
npm run dev     # Development with nodemon (port 3000)
npm start       # Production mode
```

### ⚙️ Environment Variables (`.env`)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/Lexa          # Local MongoDB (or Atlas URI)
JWT_ACCESS_SECRET=<your-secret>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=<your-secret>
JWT_REFRESH_EXPIRES=30d
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
SEED_ADMIN_EMAIL=admin@lexaguide.com
SEED_ADMIN_PASSWORD=Admin12345
FRONTEND_ORIGINS=http://localhost:5500,...
APP_ENV=development
```

### 📂 Backend Module Structure

```
backend/src/
├── config/
│   ├── db.js           # MongoDB connection (connectDB)
│   └── cloudinary.js   # Cloudinary SDK init
├── middlewares/
│   ├── auth.middleware.js       # JWT verification (Bearer token) → sets req.user
│   ├── admin.middleware.js      # requireRole("admin") guard
│   ├── lawyerAuth.middleware.js # Lawyer/Admin role guard
│   ├── error.middleware.js      # Global error handler
│   ├── avatarUpload.middleware.js   # Multer+Cloudinary avatar upload
│   └── upload.middleware.js     # General file upload
├── modules/          # MODULE-BASED ARCHITECTURE (each module = route+controller+model)
│   ├── auth/
│   │   ├── auth.routes.js
│   │   ├── auth.controller.js    # register, login, me, refresh, logout, forgot/reset password, change-password
│   │   ├── auth.tokens.js        # JWT token generation/verification utils
│   │   └── auth.refresh.js       # Refresh token rotation logic
│   ├── users/
│   │   ├── user.model.js         # User schema (role: user|admin, refreshTokens[], passwordReset)
│   │   ├── notification.model.js
│   │   └── notifications.routes.js
│   ├── lawyers/
│   │   ├── lawyer.model.js       # Lawyer schema: specialties, governorate, rating, isVerified, isAvailable
│   │   ├── lawyers.controller.js
│   │   └── lawyers.routes.js     # ⚠️ ORDER: /pending MUST come BEFORE /:id (no route shadowing)
│   ├── profile/
│   │   ├── profile.controller.js # GET/PATCH profile, POST avatar upload
│   │   └── profile.routes.js
│   ├── consultations/
│   │   ├── consultation.model.js # lifecycle: status (pending/accepted/rejected/completed)
│   │   ├── message.model.js      # chat messages inside consultation
│   │   ├── consultations.controller.js
│   │   └── consultations.routes.js  # /my, /lawyer/me, /:id, /:id/messages, /:id/status
│   ├── templates/
│   │   ├── complaintTemplate.model.js
│   │   ├── contractTemplate.model.js
│   │   ├── templates.controller.js
│   │   └── templates.routes.js   # /templates/complaints, /templates/contracts (+pagination +search)
│   ├── generated/
│   │   ├── generated.model.js
│   │   ├── generated.controller.js   # Document engine: fills templates with userInputs
│   │   └── generated.routes.js       # POST /generated, GET /my, PATCH /:id/finalize
│   ├── procedures/
│   │   ├── procedure.model.js
│   │   ├── procedures.controller.js
│   │   └── procedures.routes.js
│   ├── docs/                      # User document uploads
│   │   ├── uploadedDoc.model.js
│   │   ├── docs.controller.js
│   │   └── docs.routes.js         # POST /upload, GET /my, DELETE /:id
│   ├── documents/                 # Alias/extra document routes
│   │   ├── documents.controller.js
│   │   └── documents.routes.js
│   ├── chatbot/
│   │   ├── chatSession.model.js
│   │   ├── chatMessage.model.js
│   │   ├── chatbot.controller.js
│   │   └── chatbot.routes.js      # POST sessions, POST /:id/messages
│   ├── admin/
│   │   ├── admin.controller.js    # stats, getAllUsers, toggle-active, admin consultations
│   │   └── admin.routes.js
│   └── contact/
│       ├── contact.model.js       # Contact form submissions
│       ├── contact.controller.js
│       └── contact.routes.js
├── utils/
│   └── asyncHandler.js        # Wrapper: try/catch for async route handlers
├── app.js                     # Express app setup, middlewares, routes mount, error handler
└── server.js                  # Entry point: connectDB + app.listen (Vercel handler export)
```

### 🔌 API Endpoints Summary (Base: `http://localhost:3000/api`)

| Method | Path | Auth | Description |
|---|---|---|---|
| **Auth** | | | |
| POST | `/auth/register` | No | Register new user (fullName, email, password) |
| POST | `/auth/login` | No | Login → returns accessToken + refreshToken + user |
| GET  | `/auth/me` | Bearer | Current user profile (⚠️ MUST check BOTH User & Lawyer models! see bugs) |
| POST | `/auth/refresh` | No (refreshToken in body/cookie) | Rotate tokens |
| POST | `/auth/logout` | Bearer | Invalidate current refresh token |
| POST | `/auth/logout-all` | Bearer | Invalidate all sessions |
| POST | `/auth/change-password` | Bearer | oldPassword → newPassword |
| POST | `/auth/forgot-password` | No | ⚠️ BUG: currently returns plain resetToken in response! (see code_audit_report.md) |
| POST | `/auth/reset-password` | No | resetToken + newPassword |
| **Profile** | | | |
| GET  | `/profile` | Bearer | Get my profile |
| PATCH| `/profile` | Bearer | Update (fullName, phone, bio) |
| POST | `/profile/avatar` | Bearer | Multipart upload key: avatar → Cloudinary |
| **Lawyers** | | | |
| GET  | `/lawyers` | No | List/search lawyers (specialties, governorate filters) |
| GET  | `/lawyers/pending` | Admin | Pending verification list |
| GET  | `/lawyers/:id` | No | Lawyer by ID |
| PATCH| `/lawyers/:id/verify` | Admin | Approve verification |
| **Consultations** | | | |
| POST | `/consultations` | User/Lawyer | Create consultation (lawyerId, caseType, budget, description) |
| GET  | `/consultations/my` | Bearer | My consultations (user) |
| GET  | `/consultations/lawyer/me` | Lawyer | My consultations (lawyer) |
| GET  | `/consultations/:id` | Bearer | Consultation details (with populate: lawyerId + userId) |
| GET  | `/consultations/:id/messages` | Bearer | Messages list |
| POST | `/consultations/:id/messages` | Bearer | Send message (text) |
| PATCH| `/consultations/:id/status` | Lawyer/User | Update status (accepted/rejected/completed) |
| **Templates** | | | |
| GET  | `/templates/complaints?page=&limit=&q=` | No | Paginated list + search |
| GET  | `/templates/complaints/:id` | No | Full template (fields, clauses) |
| GET  | `/templates/contracts?page=&limit=&q=` | No | Same for contracts |
| GET  | `/templates/contracts/:id` | No | Contract template details |
| **Generated Documents** | | | |
| POST | `/generated` | Bearer | { templateKind, templateId, userInputs:{} } → fills, returns document + missingFields |
| GET  | `/generated/my?page=&limit=` | Bearer | History |
| GET  | `/generated/:id` | Bearer | Single doc |
| PATCH| `/generated/:id/finalize` | Bearer | Mark finalized |
| **Procedures** | | | |
| GET  | `/procedures` | No | Government procedures list |
| GET  | `/procedures/:id` | No | Procedure details |
| **Docs (Uploaded by user)** | | | |
| POST | `/docs/upload` | Bearer | multipart key: file → Cloudinary |
| GET  | `/docs/my` | Bearer | My uploaded docs |
| DELETE| `/docs/:id` | Bearer | Delete uploaded doc |
| **Chatbot** | | | |
| POST | `/chatbot/sessions` | Bearer | New chatbot session |
| GET  | `/chatbot/sessions` | Bearer | Sessions list |
| GET  | `/chatbot/sessions/:id` | Bearer | Session + messages |
| POST | `/chatbot/sessions/:id/messages` | Bearer | Send user message to bot |
| **Contact Form** | | | |
| POST | `/contact` | No | { name, email, message, subject } → stored in DB |
| **Admin** | | | |
| GET  | `/admin/stats` | Admin | { users, lawyers, procedures, docs, consultations } |
| GET  | `/admin/users?page=&limit=&q=` | Admin | Full user list with pagination & search |
| PATCH| `/admin/users/:id/toggle-active` | Admin | Enable/disable user account |
| GET  | `/admin/consultations?page=&limit=` | Admin | All consultations system-wide |

### ⚠️ Known Critical Bugs (code_audit_report.md)
1. **Route Shadowing** in `lawyers.routes.js`: `/:id` is defined BEFORE `/pending` → `/pending` matches `/:id` first. **Fix**: Move `/:id` AFTER all literal GET routes.
2. **Broken `/auth/me` for Lawyers**: It only queries `User.findById()`, not `Lawyer.findById()`. Lawyers get `{user:null}`.
3. **Missing Consultation GET /:id Endpoint**: Frontend calls `GET /api/consultations/:id` but backend has NO handler (only /my, /lawyer/me, /:id/messages, /:id/status).
4. **Critical Security - Exposed Reset Token**: `forgotPassword` returns plain `resetToken` in JSON response (any attacker can reset any user's password). Token should be logged only or emailed.

### Scripts (backend/scripts/)
- `seed-admin.js` - Creates default admin account
- `seed-lawyer.js` - Seeds sample lawyers
- `import-complaints.js` - Bulk import complaint CSV/JSON templates
- `import-contracts.js` - Bulk import contract templates
- `import-procedures.js` - Import procedures
- `migrate-to-atlas.js` - Migrate local DB → Atlas
- `verify-lawyer.js` - Utility to set isVerified=true

---

## 2️⃣ Frontend (Vanilla JS + HTML/CSS Glassmorphism)

### Pages Location: `/LexaGuide/` (root + html/ + css/ + js/ + shared/)

### ⚡ Frontend API Engine: `/shared/api.js`
This is the CENTRAL hub for ALL frontend→backend communication. Every page JS file uses `API.Xxx.yyy()`.

**Key features of api.js**:
- Auto-switches `API_BASE` between `http://localhost:3000/api` (local) & production Vercel URL
- Token storage: `sessionStorage.accessToken`, `sessionStorage.refreshToken`, `sessionStorage.user`
- Global `request(path, {method, body, auth, isForm})` wrapper:
  - Injects `Authorization: Bearer <token>` when `auth:true`
  - Auto-redirects to `/html/login.html` on ANY 401 (except login endpoint itself)
  - Throws Error with server message on non-ok status
  - `credentials: 'include'` for cookie-based refresh
- Namespaces:
  ```js
  API.Auth.register / login / me / changePassword
  API.Profile.get / update / uploadAvatar
  API.Lawyer.getAll / getById / search / getPending / verify
  API.Templates.Complaints.list / get
  API.Templates.Contracts.list / get
  API.Docs.upload / my / delete
  API.Generated.create / my / get / finalize
  API.Consult.create / my / lawyerMe / get / listMessages / sendMessage / updateStatus
  API.Match.match(...)  // AI recommendation or standard search
  API.Admin.stats / getAllUsers / toggleUserActive / getConsultations
  API.Contact.submit(...)
  ```

### 🎨 Design System
- **Theme**: Glassmorphism (blurred translucent cards, bright gradients)
- CSS files organized per-page in `/css/` (about.css, login.css, admin-dashboard.css, chatbot.css, customer.css, lawyer.css, home.css, profile.css, etc.)
- Shared navbar/footer injected via JS? Check individual pages.
- Responsive: CSS media queries in each page's stylesheet.

### 📄 HTML Pages (`/html/`)
| File | Purpose | JS | CSS |
|---|---|---|---|
| index.html | Landing homepage | js/home.js | shared/home.css |
| login.html | User/Admin/Lawyer login | js/login.js | css/login.css |
| signup.html | Register new account | js/signup.js | css/signup.css |
| profile.html | User profile (edit + upload avatar) | js/profile.js | css/profile.css |
| lawyer.html | Lawyer dashboard (their consultations, profile, settings) | js/lawyer.js | css/lawyer.css |
| customer.html | Client area | js/customer.js, customer-consultations.js | css/customer.css |
| user-consultations.html | Client consultation list + chat view | customer-consultations.js | |
| admin-dashboard.html | Admin control panel | js/admin-dashboard.js | css/admin-common.css, users-management.css, lawyers-management.css, consultations-management.css |
| users-management.html | Admin → users list | js/users-management.js | css/users-management.css |
| lawyers-management.html | Admin → lawyers (pending, verify, etc.) | js/lawyers-management.js | css/lawyers-management.css |
| consultations-management.html | Admin → consultations overview | js/consultations-management.js | css/consultations-management.css |
| lawyers.html | Public lawyer directory / search | | |
| legal-contracts.html | Contract templates library | js/legal-contracts.js | css/legal-contracts.css |
| legal-doc-generation.html | Document generator flow | js/generate-document.js, legal-doc-generation.js | css/legal-doc-generation.css |
| generate-document.html | Generate specific document | js/generate-document.js | |
| legal-procedures.html | Government procedures DB | js/legal-procedures.js, procedures.js | css/legal-procedures.css |
| contract-analysis.html | Contract upload + AI analysis | js/contract-analysis.js | css/contract-analysis.css |
| chatbot.html | Legal chatbot interface | js/chatbot.js | css/chatbot.css |
| about.html | About page | js/about.js | css/about.css |
| contact.html | Contact form | js/contact.js | css/contact.css |
| privacy.html, terms.html | Legal pages | | |
| middle-east-law.html | Regional legal info | js/middle-east-law.js | css/middle-east-law.css |

### 💬 Consultation Chat System (Polling-based)
- Frontend polls `GET /api/consultations/:id/messages` every **5 seconds**.
- **Smart Polling** via `document.visibilitychange` event: pauses when tab is hidden.
- **Loading Guard**: Prevents duplicate concurrent requests.
- Notifications: Toast UI + audio on new messages.
- Fullscreen Glassmorphism chat UI.
- Chat review supported after consultation completed.

### 🌐 i18n (Localization)
- `/shared/i18n.js` handles EN/AR switching.
- Language persisted in `localStorage.language`.
- UI labels retrieved dynamically (`getAuthLabels()` etc.).
- Default language check on page load.

---

## 3️⃣ AI Recommendation Service (Python FastAPI + MongoDB)

### Location: `/LexaGuide/ai rec/egail-lawyer-recommendation-mongo/`

Standalone microservice for **AI-powered lawyer matching & ranking**. Called by frontend via `API.Match.match()`.

### Tech Stack
- **Framework**: FastAPI
- **Server**: Uvicorn (ASGI)
- **DB Driver**: Motor (async MongoDB driver)
- **Validation**: Pydantic schemas
- **ENV**: python-dotenv

### Setup
```bash
cd "ai rec/egail-lawyer-recommendation-mongo"
python -m venv .venv
.venv\Scripts\activate     # Windows
pip install -r requirements.txt
cp .env.example .env       # set MONGO_URI, DATABASE_NAME
uvicorn app.main:app --reload --port 8000
```

### Environment Variables
```
MONGO_URI=mongodb://localhost:27017/egail_db_ai     # or shared LexaGuide DB
DATABASE_NAME=egail_db_ai
```

### 📂 Service Structure
```
egail-lawyer-recommendation-mongo/
├── app/
│   ├── main.py                      # FastAPI app, includes recommendation_router
│   ├── database.py                  # Motor client + db reference
│   ├── core/
│   │   └── config.py                # Load MONGO_URI / DATABASE_NAME from .env
│   ├── models/
│   │   └── lawyer_model.py
│   ├── schemas/
│   │   ├── recommendation.py        # RecommendationRequest { case_type, city, budget, consultation_type }
│   │   └── lawyer.py                # LawyerResponse { id, fullName, specialties, score, ... }
│   ├── routes/
│   │   └── recommendation.py        # POST /recommend-lawyers endpoint
│   └── services/
│       └── recommendation_service.py # Core: recommend_lawyers() + calculate_score()
├── seed.py                          # Seed sample lawyers
├── requirements.txt
└── .env.example
```

### 🔌 AI Service Endpoint

**POST** `http://localhost:8000/recommend-lawyers`

Request body:
```json
{
  "case_type": "مدني",
  "city": "القاهرة",
  "budget": 500,
  "consultation_type": "chat"   // "chat" | "video" | "both"
}
```

### 🧠 Scoring Algorithm (Weighted Sum)
The `calculate_score(lawyer, budget)` function ranks lawyers by weighted criteria:

| Weight | Criterion | Formula |
|---|---|---|
| 35% | Average Rating | `ratingAvg / 5` |
| 20% | Review Count | `min(ratingCount/100, 1)` |
| 20% | Success Rate | `successRate / 100` |
| 15% | Price fit | `1` if price ≤ budget, else decays by `diff/budget` |
| 10% | Verified badge | `isVerified ? 1 : 0` |

**Filtering before scoring**: `{ specialties: case_type, isAvailable: true, isActive: true, isVerified: true, governorate: city(optional) }`
→ Returns top 10 (max) results sorted by score descending.

---

## 4️⃣ Data Models (Key Schemas)

### User (MongoDB - Mongoose)
Stored in collection `users`:
- `fullName` (string, required)
- `email` (string, unique, lowercase, required)
- `passwordHash` (string, bcrypt)
- `role` (enum: "user" | "lawyer" | "admin", default: "user")
- `refreshTokens[]` → `{ tokenHash, jti, createdAt, expiresAt, revokedAt, userAgent, ip }`
- `phone`, `bio`, `avatarUrl`, `avatarPublicId`, `isActive` (boolean)
- `passwordResetTokenHash`, `passwordResetExpiresAt`
- Timestamps

### Lawyer (MongoDB - Mongoose)
Stored in collection `lawyers`:
- `fullName`, `email` (unique), `phone`, `passwordHash`
- `role` fixed: "lawyer"
- `bio`, `governorate`, `city`, `address`
- `specialties[]` (array of strings, e.g. ["أحوال شخصية", "مدني"])
- `pricePerSession`, `sessionDurationMins`
- `communicationMethods`: "chat" | "video_call" | "both"
- `ratingAvg` (0-5), `ratingCount`, `successRate` (0-100)
- `isVerified` (admin approval, default false)
- `isActive` (account enabled), `isAvailable` (for matching)
- **Indexes**: compound text index on fullName, specialties, governorate

### Consultation
- `lawyerId` (ObjectId → Lawyer)
- `userId` (ObjectId → User)
- `caseType`, `description`, `budget`
- `status`: "pending" | "accepted" | "rejected" | "completed"
- `startTime`, `endTime`
- Timestamps

### Message (Chat)
- `consultationId` (FK)
- `senderId`, `senderRole` ("user" | "lawyer")
- `text`
- `readAt`
- Timestamps

---

## 5️⃣ Running the Project (Step by Step)

### Prerequisites
- ✅ Node.js v18+ installed
- ✅ Python 3.11+ installed (for AI service)
- ✅ **MongoDB running locally on port 27017** (MANDATORY - default `.env` uses `mongodb://localhost:27017/Lexa`) OR a MongoDB Atlas connection string
- ✅ (Optional) Live Server VS Code extension for frontend (port 5500)

### Step A - Backend (Port 3000)
```bash
cd LexaGuide/backend
npm install                    # if node_modules missing
cp .env.example .env           # edit MONGODB_URI if needed
npm run seed-admin             # (optional) create admin@lexaguide.com / Admin12345
npm run dev
# Verify: GET http://localhost:3000/api/health
```

### Step B - Frontend
Open `LexaGuide/index.html` via Live Server on **port 5500** (must match FRONTEND_ORIGINS in .env).

### Step C - AI Recommendation Service (Optional, Port 8000)
```bash
cd "LexaGuide/ai rec/egail-lawyer-recommendation-mongo"
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
# source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # ensure MONGO_URI points to your DB
uvicorn app.main:app --reload --port 8000
```

---

## 6️⃣ Common Errors & Troubleshooting

### ❌ Error: Backend hangs / "DB connection failed"
**Cause**: MongoDB server not running locally, or wrong port/URI.
**Fix**:
- Start `mongod` service (Windows: services.msc → MongoDB Server → Start)
- Or edit `backend/.env` `MONGODB_URI` to an Atlas URI.

### ❌ Error: `Cannot find module 'express'`
**Cause**: `node_modules` not installed.
**Fix**: `cd backend && npm install`

### ❌ Error: CORS "Not allowed by CORS"
**Cause**: Frontend origin not in FRONTEND_ORIGINS list AND not localhost.
**Fix**: Add your origin to comma-separated `FRONTEND_ORIGINS` in backend/.env (no trailing slashes).

### ❌ Error: Lawyer login works but /auth/me returns user:null
**Known Bug #2**: `auth.controller.js → me()` only searches User model. Fix: search Lawyer model as fallback (code_audit_report.md has patch).

### ❌ Error: `/lawyers/pending` route returns 404
**Known Bug #1**: Route shadowing. Fix ordering in lawyers.routes.js (literal first, param after).

---

## 7️⃣ File Reference Cheat Sheet (Absolute Paths)

| What | Path |
|---|---|
| Project Root | [LexaGuide](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide) |
| Status (Arabic Handover) | [LEXAGUIDE_STATUS.md](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/LEXAGUIDE_STATUS.md) |
| Code Audit + Bugs | [code_audit_report.md](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/code_audit_report.md) |
| Backend README + API | [backend/README.md](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/README.md) |
| Flutter API Guide | [backend/flutter_api_guide.md](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/flutter_api_guide.md) |
| Backend package.json | [package.json](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/package.json) |
| Backend entry (server.js) | [server.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/src/server.js) |
| Express app setup | [app.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/src/app.js) |
| DB Connection | [db.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/src/config/db.js) |
| Backend .env | [.env](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/.env) |
| Auth Controller (ME bug) | [auth.controller.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/src/modules/auth/auth.controller.js) |
| Auth Routes | [auth.routes.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/src/modules/auth/auth.routes.js) |
| User Model | [user.model.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/src/modules/users/user.model.js) |
| Lawyer Model (pending bug) | [lawyer.model.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/src/modules/lawyers/lawyer.model.js) |
| Lawyers Routes | [lawyers.routes.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/src/modules/lawyers/lawyers.routes.js) |
| Consultations Controller | [consultations.controller.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/src/modules/consultations/consultations.controller.js) |
| Consultations Routes (missing GET /:id) | [consultations.routes.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/backend/src/modules/consultations/consultations.routes.js) |
| Frontend API Engine | [api.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/shared/api.js) |
| Frontend i18n | [i18n.js](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/shared/i18n.js) |
| Landing HTML | [index.html](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/index.html) |
| AI Service Main | [main.py](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/ai%20rec/egail-lawyer-recommendation-mongo/app/main.py) |
| AI Scoring Logic | [recommendation_service.py](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/ai%20rec/egail-lawyer-recommendation-mongo/app/services/recommendation_service.py) |
| AI Requirements | [requirements.txt](file:///C:/Users/loq/Desktop/LexaGuide()_1/LexaGuide/ai%20rec/egail-lawyer-recommendation-mongo/requirements.txt) |

---

## 8️⃣ Convention Rules for AI Agents Working on This Project

1. **Backend is Module-Based**: Always add new files inside `/backend/src/modules/<feature>/` (model + controller + routes).
2. **Prefer Repository-like pattern via Mongoose models**: Use existing pattern of `asyncHandler(...)` wrapping every async controller function.
3. **Zod validation in controllers**: Validate ALL incoming payloads at top of controller before any DB ops.
4. **Never hardcode URLs in frontend**: Use only `API.Xxx.yyy()` from `/shared/api.js`. If endpoint missing → add it both in backend routes AND api.js namespace.
5. **Glassmorphism Theme**: Any new CSS MUST match existing translucent/gradient aesthetic (copy patterns from existing css/ files).
6. **Auth middleware**: Protected routes use `requireAuth` (JWT) + role guards (`requireRole("admin")` / `lawyerAuth`).
7. **Route ordering bug prevention**: In Express route files, ALWAYS place literal routes (`/pending`, `/stats`, `/my`) BEFORE parameterized routes (`/:id`).
8. **Error handling**: NEVER `res.status(500)` raw errors; use `errorMiddleware` + thrown errors with descriptive messages.
9. **Dual Model Auth**: When reading "current user", ALWAYS check both User AND Lawyer collections (because JWT sub can be ObjectId from either collection).
10. **Arabic Content**: User-facing content is Arabic. Internal code/docs are English (mixed is OK).

---

## 9️⃣ Roles & Permissions Matrix

| Capability | User (Client) | Lawyer | Admin |
|---|---|---|---|
| Register/Login/Me | ✅ | ✅ | ✅ |
| Browse lawyers/templates/procedures | ✅ | ✅ | ✅ |
| Create consultation (as client) | ✅ | ❌ | ✅ |
| Accept/reject/complete consultation | ❌ | ✅ (theirs) | ✅ |
| Chat in own consultation | ✅ (theirs) | ✅ (theirs) | ✅ |
| Update own profile/avatar | ✅ | ✅ | ✅ |
| Upload documents | ✅ | ✅ | ✅ |
| Generate documents from templates | ✅ | ✅ | ✅ |
| Verify new lawyer accounts | ❌ | ❌ | ✅ |
| Toggle user active/disabled | ❌ | ❌ | ✅ |
| View system stats + all consultations | ❌ | ❌ | ✅ |
| View pending lawyer list | ❌ | ❌ | ✅ |

---

**Last Updated**: 2026-09-01
**Project Stage**: Active Development (Backend+Frontend functional, bugs documented in code_audit_report.md, AI service modular)
