# 📋 MissIQ Requirements Specification & Traceability Matrix (req.md)

## Project: MissIQ — AI-Powered Conversation Intelligence
**Tagline:** "Never Miss What Matters"  
**Design Direction:** Midnight Intelligence (Linear, Raycast, Stripe, Vercel inspired)  
**Core Mission:** Answers the question: *"What did I miss, and what do I need to do next?"*

---

## 1. Traceability Matrix

| Requirement | Implementation in MissIQ | Route / Component | Status |
| :--- | :--- | :--- | :---: |
| **Visual Identity: Midnight Intelligence** | Almost-black midnight (`#08090D`), electric violet (`#9B7CFF`), ice cyan (`#6DEBFF`), soft mint (`#77E6B0`), hairline borders. | `tailwind.config.js` & `index.css` | ✅ Complete |
| **Public Landing Page** | Minimal wordmark nav, "Thousands of messages. Only a few things matter." headline, floating AI analysis product preview, features, how-it-works, trust badge. | `/` (`PublicLayout` + `LandingPage.tsx`) | ✅ Complete |
| **User Application Workspace** | Productivity command center with compact sidebar (Overview, New Analysis, My Action Items, Saved Summaries, Settings), context selector, drag-and-drop TXT upload. | `/app` (`UserAppLayout` + `WorkspacePage.tsx`) | ✅ Complete |
| **AI Processing Experience** | 4-stage animated scanner ("Reading messages...", "Scanning announcements...", "Extracting actions...", "Synthesizing brief..."). | `AnalysisProgress.tsx` | ✅ Complete |
| **Results Dashboard (A-H)** | Summary hero brief with audio narration, 4 metric cards, priority intelligence, interactive action items checklist with confetti, decisions, deadline timeline, mentions, source verification. | `ResultsDashboard.tsx` | ✅ Complete |
| **Admin Operations Console** | Restricted layout with passcode gate (`admin123`), system health, aggregate telemetry, provider configuration, error diagnostics, zero private chat exposure. | `/admin` (`AdminLayout` + `AdminPage.tsx`) | ✅ Complete |
| **Role-Aware Security** | Guest User by default (no sign-up required), optional Registered User profile switch, Admin role with backend authorization header (`X-Admin-Key`). | `auth.ts` + `AuthModal.tsx` + `backend/main.py` | ✅ Complete |
| **Local-First Privacy & Storage** | Ephemeral RAM processing default, browser IndexedDB for private local history, session wipe control. | `db.ts` + `PrivacyModal.tsx` | ✅ Complete |
| **Pluggable Backend** | FastAPI backend with Pydantic models, CORS middleware, unit tests, and seamless on-device client fallback. | `backend/main.py` + `analyzer.py` | ✅ Complete |

---

## 2. Layout Structure & Routes

```
/
 └── PublicLayout (Marketing Landing Page)
      └── LandingPage

/app
 └── UserAppLayout (Productivity Workspace Shell)
      ├── /app (Overview / Active Analysis)
      ├── /app/analyze (Input & File Import)
      ├── /app/actions (My Action Items Checklist)
      ├── /app/saved (IndexedDB Local History)
      └── /app/settings (Processing & Storage Settings)

/admin
 └── AdminLayout (Operations Console)
      └── AdminPage (Passcode Protected: admin123)
```

---

## 3. Strict Grounding Principles

1. **No Fabricated Owners**: If a task does not explicitly state an owner, it is recorded strictly as `"Not specified"`.
2. **No Invented Deadlines**: If a task has no stated due date, it is recorded strictly as `"Not specified"`.
3. **Verifiable Sources**: Every extracted insight retains its `source_id`, `source_sender`, and raw quote accessible via **"View source"**.
