# LexaGuide - Deployment & Live Demo Guide

> اقرأ هذا لو عايز ترفع المشروع على GitHub + تعمل Live Demo يعمل في الـ CV.

---

## 0️⃣ حالة Git الحالية للبروجكت

لما كنت بشوف الـ git status لقيت:
- انت على فرع `main`
- عندك 3 remotes بالفعل:

| Remote Name | Repo URL | ماذا فيه |
|---|---|---|
| `origin` | `https://github.com/mohamedelbeek55/lexaguide-frontend.git` | نسخة قديمة من الفرونت إند فقط |
| `frontend` | نفسها فوق | نفسها |
| `backend`  | `https://github.com/mohamedelbeek55/Graduation-Backend2.git` | الباك إند في ريبو منفصل قديم |

---

## 1️⃣ أفضل خطة للإصلاح (موصى بها للـ CV)

بص يا باشا، أفضل حاجة عشان تكون احترافية في الـ CV:

### الخيار أ (الأفضل - MONOREPO واحد جديد) 💯
> امسح الـ remotes القديمة وارفع كل المشروع (باك + فرونت + AI) في **ريبو واحد جديد**. الكل هيحب كده في الـ CV و AI/Recruiters سيعرفوا يفهموا الموقع بسرعة.

```bash
cd "C:\Users\loq\Desktop\LexaGuide()_1\LexaGuide"

# (1) احذف الـ remotes القديمة
git remote remove origin
git remote remove frontend
git remote remove backend

# (2) انشئ ريبو جديد فاضي على GitHub باسم مثلاً  LexaGuide
# (3) اربطه
git remote add origin https://github.com/<your-username>/LexaGuide.git

# (4) أنظف الملفات الغلط اللي في الـ .gitignore
#     (ده بيحذف الـ pycache و .env و venv الخ من الـ git tracking)
git rm -r --cached .
git add .

# (5) Commit
git commit -m "chore: full monorepo cleanup + add LLM.md + proper gitignore + deploy docs"

# (6) Push
git branch -M main
git push -u origin main
```

### الخيار ب (إذا حببت تبقى على الـ repos القديمة)
- ارفع التغييرات إلى الـ frontend repo (اللي هو origin الآن)
- وارفع التغييرات اللي في مجلد backend/ إلى Graduation-Backend2

---

## 2️⃣ الـ Database (مهم جداً عشان الـ Live Demo)

MongoDB Local مش هينفع على الإنترنت! لازم نستخدم **MongoDB Atlas** (النسخة المجانية كفاية للـ Demo):

### الخطوة 1: أنشئ Atlas Cluster
1. افتح https://cloud.mongodb.com/ → سجل دخول / انشئ حساب
2. Build a Cluster → اختر **M0 Free Tier** (AWS / Frankfurt أو أي شيء قريب)
3. اسم الكلستر مثلاً: `LexaGuide-Cluster`
4. في **Security → Database Access**: أنشئ User جديد باسم `lexaguide_admin` وباسوورد قوي (احفظه)
5. في **Security → Network Access**: أضف IP `0.0.0.0/0` (أي IP، لانه Vercel IPs متغيرة)
6. في **Database → Connect → Drivers → Node.js**: انسخ الـ Connection String اللي هيبقى شكله:
   ```
   mongodb+srv://lexaguide_admin:<YOUR_PASSWORD>@lexaguide-cluster.xxxxx.mongodb.net/LexaGuide?retryWrites=true&w=majority
   ```

### الخطوة 2: نقل البيانات من Local → Atlas (Migrate)
عندنا عندنا سكريبت جاهز `backend/scripts/migrate-to-atlas.js` بالفعل!

تشغيله:
```bash
cd backend
# عدل الـ MONGODB_URI في .env ليكون Atlas
npm run dev   # تأكد الاتصال تمام
# او شغل السكريبت مباشرة
node scripts/migrate-to-atlas.js
```

### الخطوة 3: Seed بيانات تجريبية (لو مفيش بيانات)
عندك سكريبتات جاهزة كلها في `backend/scripts/`:

```bash
cd backend
node scripts/seed-admin.js        # إنشاء الأدمن الافتراضي: admin@lexaguide.com / Admin12345
node scripts/seed-lawyer.js       # بيانات محامين تجريبية
node scripts/import-procedures.js # إجراءات حكومية
node scripts/import-complaints.js # قوالب بلاغات
node scripts/import-contracts.js  # قوالب عقود
```

💡 **هذه السكريبتات نفسها لازم تعملها بعد ما ترفع على Vercel عشان الـ Demo يكون فيه بيانات!**

---

## 3️⃣ رفع الباك إند على Vercel (مجاني + Serverless)

ملف الـ `backend/vercel.json` موجود بالفعل، والـ `src/server.js` بيدعم الـ Vercel Handler!

### الخطوات:
1. اذهب إلى https://vercel.com → سجل دخول بـ GitHub
2. **Add New → Project** → اختر الـ repo اللي رفعته
3. في شاشة **Configure Project**:
   - **Framework Preset**: `Other` (مش Next.js)
   - **Root Directory**: اضغط **Edit** واختر مجلد `backend/` (أي اجعل Vercel يشوف الـ package.json من جوه مجلد backend)
   - **Build Command**: اتركه فاضي (أو حط `echo no-build`)
   - **Install Command**: `npm install`
   - **Output Directory**: فاضي
4. في **Environment Variables**: ضيف كل المتغيرات من ملف `.env.example`
   - أهم واحد: `MONGODB_URI` = الـ Atlas connection string اللي أنشأته فوق مع تضمين الباسوورد
   - ضيف أيضاً `CLOUDINARY_*` الثلاثة، `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
   - `APP_ENV = production`
   - `FRONTEND_ORIGINS = https://your-frontend.vercel.app` (رابط الفرونت بعد ما ترفعه)
5. اضغط **Deploy** وانتظر دقائق
6. بعد ما يخلص هتحصل على رابط زي:
   ```
   https://lexaguide-backend.vercel.app
   ```
   ✅ جربه: افتح `https://<your-vercel-domain>/api/health` → لازم يرجع `{ ok: true, database: "connected" }`

---

## 4️⃣ رفع الفرونت إند على Vercel (أو Netlify)

الفرونت عندك عبارة عن ملفات HTML/CSS/JS ثابتة (Static Site)، أسرع حاجة Vercel Static:

الخيار (أ): نفس المشروع monorepo على Vercel:
- من نفس الـ project → Settings → Functions: الباك إند هتبقى في backend/
- أما الفرونت فيه خياران:
  1. إما ترفع مجلد الجذر ك Static site (index.html في الـ root) في Project ثاني
  2. أو تستخدم subdomain `lexaguide.vercel.app` للفرونت، والـ api على `lexaguide-backend.vercel.app`

الخيار (ب): سهل:
```bash
# لو معاك npm
npm i -g vercel
cd "C:\Users\loq\Desktop\LexaGuide()_1\LexaGuide"
vercel --prod
```
اختر `Other` كـ framework، و Vercel هيعمل serve للملفات الثابتة تلقائي.

### مهم جداً بعد ما ترجع رابط الفرونت:
عدل في ملف [shared/api.js](file:///C:/Users/loq/Desktop/LexaGuide%28%29_1/LexaGuide/shared/api.js#L1-L2)

```js
const isLocal = window.location.hostname === "localhost" || ...;
const API_BASE = isLocal
  ? "http://localhost:3000/api"
  : "https://YOUR-VERCEL-BACKEND.vercel.app/api"; // ← ضيف الرابط الجديد هنا!
```

---

## 5️⃣ الخاتمة: روابط اللي تحطها في الـ CV 🎓

بعد ما تخلص ده، حط في الـ CV:

| العنصر | الرابط المثالى |
|---|---|
| 🚀 Live Demo (Frontend) | `https://lexaguide-frontend.vercel.app` |
| 🔌 Backend API (health) | `https://lexaguide-backend.vercel.app/api/health` |
| 📚 GitHub Repository | `https://github.com/<your-username>/LexaGuide` |
| 🤖 AI Recommender (اختياري - Railway / Render) | لو عايز ترفع الـ Python FastAPI على Railway.app مجاناً |

### بيانات تجريبية للزوار في الـ Demo:
```
Admin Login:
Email   : admin@lexaguide.com
Password: Admin12345

Test User (اعمل register عادي باداية جديدة):
```

---

**لو حاب أنفذ كل ده معاك خطوة بخطوة (push to GitHub + Vercel Deploy + Atlas Seed) → كلمني وهنبدأ فوراً!**
