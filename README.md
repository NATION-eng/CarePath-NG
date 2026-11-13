# CarePath NG — Nigerian Healthcare Continuity Platform

A family-centred maternal, child, and chronic healthcare continuity platform for Nigeria, fully ready for production hosting on **Vercel** as an installable Progressive Web App (PWA).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNATION-eng%2FCarePath-NG)

---

## ⚡ Hosting on Vercel (Quick Start)

### Option A: 1-Click Web Deployment
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and import `https://github.com/NATION-eng/CarePath-NG`.
3. Keep the default settings (**Framework Preset**: Next.js, **Root Directory**: `./`).
4. (Optional) Set environment variables under **Environment Variables** (see `.env.example`).
5. Click **Deploy**. Vercel will build and assign you a live HTTPS domain (e.g., `https://carepath-ng.vercel.app`).

### Option B: Deploy via Vercel CLI
```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy to preview
vercel

# 4. Deploy directly to production
vercel --prod
```

---

## 📱 Progressive Web App (PWA) Capabilities
- **Installable**: Works on Android, iOS, Windows, macOS, and ChromeOS as a standalone app.
- **Offline Shell**: Service Worker precaches the UI shell, assets, and icons for instant offline launch.
- **Real-Time Continuity**: Network-first strategy for live clinical data, with dignified offline messaging when out of cell range.
- **Install Banner**: Built-in PWA installation prompt component with custom instructions for iOS and Android.

---

## 🏗 Architecture & Backend
- **Framework**: Next.js 14 App Router (React 18, TypeScript, Tailwind CSS).
- **Backend API Routes**:
  - `GET /api/patients`, `POST /api/patients`, `DELETE /api/patients` (Atomic CRUD with NDPA 2023 cascading deletion).
  - `GET /api/appointments`, `POST /api/appointments`, `PATCH /api/appointments`, `DELETE /api/appointments`.
  - `GET /api/audit` (Immutable clinical audit log).
  - `GET /api/health` (Uptime and health check for Vercel monitoring).
  - `POST /api/telephony/send-sms`, `POST /api/telephony/webhook`, `GET /api/telephony/feed`.
- **Database Engine**:
  - Serverless-resilient atomic engine (`lib/serverDb.ts`).
  - Auto-detects Vercel Serverless environment (`/tmp` atomic fallback) to prevent read-only filesystem errors.
  - Zero placeholder records: starts clean awaiting real clinical intake.

---

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` for local development or configure in your Vercel Project Settings:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://carepath-ng.vercel.app

NEXT_PUBLIC_DEFAULT_FACILITY_NAME="Garki Primary Healthcare Centre"
NEXT_PUBLIC_DEFAULT_FACILITY_CODE="FCT-AMAC-PHC-004"
NEXT_PUBLIC_DEFAULT_STATE="FCT Abuja"
NEXT_PUBLIC_DEFAULT_LGA="Abuja Municipal (AMAC)"

# Telephony: 'simulation' | 'termii' | 'twilio'
SMS_PROVIDER=simulation
TERMII_API_KEY=your_key_here
TERMII_SENDER_ID=CarePath
```

---

## 🛠 Local Development & Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run ESLint validation
npm run lint

# TypeScript verification
npx tsc --noEmit

# Production build test
npm run build

# Run automated feature test suite
node scripts/test-features.mjs
```

---

## 🎨 Clinical Design System
- **Deep Teal (`#174C45`)**: Authority, calm clinical guidance.
- **Soft Sage (`#4C9A83`)**: Reassurance and active milestones.
- **Warm Cream (`#F1E8DA`)**: High-contrast, legible alert cards.
- **Off-White Canvas (`#F7F8F6`)**: Low battery consumption on mobile screens.
- **Typography**: High-legibility, bold, accessible hierarchy tailored for outdoor PHC conditions.