# 🧠 MissIQ — AI-Powered Conversation Intelligence
> *"Never Miss What Matters."*

[![Visual Identity](https://img.shields.io/badge/Theme-Midnight%20Intelligence-9B7CFF.svg)](#1-visual-identity--design-philosophy)
[![Local-First](https://img.shields.io/badge/Privacy-100%25%20Local--First-77E6B0.svg)](#5-privacy--grounding-architecture)
[![Architecture](https://img.shields.io/badge/Routing-Role--Aware%20Architecture-6DEBFF.svg)](#2-role-aware-architecture--routes)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20v2.0-blue.svg)](https://fastapi.tiangolo.com/)

---

## 🌟 1. Visual Identity: "Midnight Intelligence"

Designed with the precision of **Linear**, dark elegance of **Raycast**, visual storytelling of **Stripe**, and typography of **Vercel**.

- **Atmospheric Canvas**: Almost-black midnight (`#08090D`) with layered surfaces (`#0E1017` & `#141722`).
- **Accent System**: Electric Violet (`#9B7CFF`), Ice Cyan (`#6DEBFF`), and Soft Mint (`#77E6B0`).
- **Priority Signaling**: Coral Red (`#FF5C77`) for High, Warm Amber (`#FFB347`) for Medium, Muted Neutral for Low.
- **Glass & Depth**: Translucent hairline borders (`rgba(255, 255, 255, 0.07)`), subtle radial hero lighting, and restrained glow effects.
- **Micro-Interactions**: Animated AI pipeline progress, interactive checklist with confetti celebrations, and collapsible briefs.

---

## 🏛️ 2. Role-Aware Architecture & Routes

MissIQ features **three completely separate layouts and user experiences**:

```
                       ┌────────────────────────────────────────────────────────┐
                       │                   MissIQ Platform                      │
                       └──────────────────────────┬─────────────────────────────┘
                                                  │
          ┌───────────────────────────────────────┼───────────────────────────────────────┐
          ▼                                       ▼                                       ▼
┌───────────────────────────┐   ┌───────────────────────────────────┐   ┌───────────────────────────┐
│       PublicLayout        │   │           UserAppLayout           │   │        AdminLayout        │
│          Route: /         │   │            Route: /app            │   │       Route: /admin       │
├───────────────────────────┤   ├───────────────────────────────────┤   ├───────────────────────────┤
│ • Minimal Wordmark Nav    │   │ • Compact Productivity Sidebar    │   │ • Passcode Gate (admin123)│
│ • "Thousands of messages. │   │ • Overview (/app)                 │   │ • Live System Uptime      │
│    Only a few matter."    │   │ • New Analysis (/app/analyze)     │   │ • Aggregate Telemetry     │
│ • Floating AI Panel Mock  │   │ • My Action Items (/app/actions)  │   │ • AI Provider Routing     │
│ • Features & How It Works │   │ • Saved Summaries (/app/saved)    │   │ • Error Diagnostics Log   │
│ • No dashboard sidebar    │   │ • Settings (/app/settings)        │   │ • Strict Privacy Audit    │
│ • Guest mode by default   │   │ • 4-Stage AI Pipeline Animation   │   │   (Zero user chat logs)   │
└───────────────────────────┘   └───────────────────────────────────┘   └───────────────────────────┘
```

---

## 🚀 3. Quick Start Guide

### Step 1: Frontend (Already Live on Port 5173!)
```bash
npm install
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

- **Public Marketing Website**: `http://localhost:5173/`
- **User Application Workspace**: `http://localhost:5173/app`
- **Admin Operations Console**: `http://localhost:5173/admin` *(Passcode: `admin123`)*

---

### Step 2: (Optional) Python FastAPI Backend
```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base: `http://localhost:8000`
- Interactive API Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/health`
- Admin Telemetry: `http://localhost:8000/api/admin/metrics`

*(The React client automatically detects FastAPI and falls back seamlessly to the client-side NLP engine if offline!)*

---

## 🧪 4. Testing & Reliability

Run unit tests for the 10-step conversation analysis pipeline:
```bash
pytest backend/test_analyzer.py -v
```

---

## 🔒 5. Privacy & Grounding Architecture

1. **Zero Silent Uploads**: Chat transcripts are never sent to external servers by default.
2. **Volatile Session Memory**: Clicking **"Clear Session"** instantly wipes memory buffers.
3. **Private IndexedDB**: Local history is preserved exclusively in the browser's origin-isolated storage.
4. **Strict Grounding**: Missing owners and deadlines are strictly marked `"Not specified"`. Every extracted item links directly to its source quote via **"View source"**.
