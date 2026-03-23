# Password-App
# 🛂 PassportSeva — Digital Passport Application Portal

A full-stack web application redesigning the Indian passport application experience to be **simple, guided, and stress-free**.

---

## 🎯 Problem Statement

The existing passport application process suffers from:
- **Confusing long forms** with no guidance or progress feedback
- **Unclear document requirements** — users discover missing docs at the PSK
- **No save/resume** — accidental refresh loses all data
- **Poor appointment UX** — opaque slot availability
- **Anxiety for first-time users** — no onboarding or orientation

---

## ✅ What This Redesign Solves

| Problem | Solution |
|---|---|
| Long confusing form | Split into 4 focused steps with progress indicator |
| No save feature | Auto-save on every change (debounced 1.2s) |
| Unknown docs | Interactive checklist before PSK visit |
| Poor appointment UX | Visual slot picker filtered by office & date |
| New user anxiety | 4-screen onboarding explaining the whole process |
| No confirmation | Full receipt page with downloadable text receipt & shareable ID |

---

## 🖥️ Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| **Frontend** | React 18 + React Router 6 | Component-driven SPA, declarative routing |
| **Styling** | Pure CSS with CSS variables | No framework overhead, full design control |
| **HTTP Client** | Axios | Interceptors for auth token injection |
| **Backend** | Node.js + Express | Lightweight, fast REST API |
| **Auth** | JWT + bcryptjs | Stateless, secure token auth |
| **Data** | In-memory store | Simple for demo — swap with MongoDB/PostgreSQL in production |
| **Fonts** | DM Serif Display + DM Sans | Professional, readable, distinct identity |

---

## 📁 Project Structure

```
/
├── frontend/              # React app
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── context/
│       │   └── AuthContext.js    # Global auth state
│       ├── utils/
│       │   └── api.js            # Axios instance with auth
│       ├── components/
│       │   └── Navbar.js
│       ├── pages/
│       │   ├── HomePage.js       # Landing page
│       │   ├── AuthPages.js      # Login + Signup
│       │   ├── OnboardingPage.js # 4-slide intro for new users
│       │   ├── DashboardPage.js  # Application list + stats
│       │   ├── ApplicationPage.js # Multi-step form with auto-save
│       │   └── ConfirmationPage.js # Submission receipt + export
│       ├── App.js                # Routing
│       ├── index.js
│       └── index.css             # Full design system (CSS variables)
│
├── backend/
│   ├── server.js                 # Express server, all routes
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+
- npm v8+

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd passport-app
```

### 2. Start the Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### 3. Start the Frontend (in a new terminal)
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

### 4. Open the app
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Login

```
Email:    hire-me@anshumat.org
Password: HireMe@2025!
```

This user is automatically seeded when the backend starts.

---

## 📱 Application Flow (Screens)

| # | Screen | Route | Description |
|---|---|---|---|
| 1 | **Landing Page** | `/` | Overview, features, how-it-works, CTA |
| 2 | **Sign Up** | `/signup` | Account creation with validation |
| 3 | **Log In** | `/login` | JWT auth with demo credentials shown |
| 4 | **Onboarding** | `/onboarding` | 4-slide intro for new users |
| 5 | **Dashboard** | `/dashboard` | Application list, stats, start new |
| 6 | **Application Form** | `/apply/:id` | 4-step form with auto-save |
| 7 | **Confirmation** | `/confirmation/:id` | Receipt, download, share |

---

## ⚡ Key UX Features

### 🔄 Auto-Save
Every field change triggers a debounced save (1.2s delay). A status indicator shows `Saving…` → `Saved just now`. Users can safely close the tab and resume anytime.

### 📋 Step-by-Step Form
The application is split into 4 focused steps:
1. **Personal Info** — Name, DOB, Aadhaar, passport type
2. **Address** — Present and permanent address
3. **Documents** — Interactive checklist with visual confirmation
4. **Appointment** — Office selector + real-time slot picker

### 📄 Document Checklist
Instead of a wall of text, documents are shown as checkable cards. Visual progress shows how many are confirmed, reducing PSK visit drop-offs.

### 📅 Appointment Booking
Live slot grid filtered by office. Shows availability across 10 working days, grouped by date.

### ⬇️ Export & Share
- Download application receipt as `.txt` file
- Copy shareable application reference ID
- View all applications in dashboard anytime

### 🔒 Protected Routes
All application pages are auth-gated. Unauthenticated users are redirected to `/login`.

---

## 🎨 Design Decisions

**Color palette:** Deep navy (#0a2540) + saffron (#f4841a) — inspired by the Indian tricolour, professional yet distinct from generic blue-white gov portals.

**Typography:** DM Serif Display (headings) + DM Sans (body) — warm, readable, editorial quality.

**Form UX:** Radio cards instead of dropdowns for passport type selection (more scannable). Checkbox cards for documents (tactile, confirmatory). Inline validation errors.

**Anxiety reduction:** Progress bar always visible. Auto-save indicator. "You can close this page and return later" message. Clear next-steps on confirmation screen.

---

## 🔧 Environment Variables (Optional)

```bash
# backend/.env
PORT=5000
JWT_SECRET=your_secret_key_here
```

---

## 📦 API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Log in, get JWT |
| GET | `/api/applications` | ✅ | List user's apps |
| POST | `/api/applications` | ✅ | Create new application |
| GET | `/api/applications/:id` | ✅ | Get single application |
| PATCH | `/api/applications/:id` | ✅ | Update (auto-save) |
| DELETE | `/api/applications/:id` | ✅ | Delete application |
| GET | `/api/slots` | ✅ | Get available PSK slots |

---

## 🏗️ Production Considerations

To scale beyond demo:
- Replace in-memory store with **MongoDB** or **PostgreSQL**
- Add **email notifications** (nodemailer / SendGrid)
- Add **file upload** for document previews (multer + S3)
- Add **rate limiting** (express-rate-limit)
- Deploy frontend to **Vercel/Netlify**, backend to **Railway/Render**

---

*Built for Anshumat Foundation Web Design Internship Assignment*

