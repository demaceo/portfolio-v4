# Project Highlights — Resume & Interview Reference

**Demaceo Vincent · 2025–2026**
*Roles targeted: Senior Software Engineer · Project Manager · UI/UX Designer*

---

## Resume Bullet Points (Action Verb + Metric Format)

### Senior Software Engineer

**PINPOINT — Civic Engagement Platform (React Native · Expo · Express · PostgreSQL)**

- Architected a full-stack civic platform across iOS, Android, and Web using React Native (Expo SDK 54), TypeScript Express, and PostgreSQL via Prisma ORM, deployed on Railway with zero downtime
- Implemented JWT authentication without Firebase Admin SDK — verified Firebase ID tokens directly via Google's JWKS endpoint using `jose`, eliminating service account exposure
- Built a Gemini AI chat system with real-time SSE streaming, multiple personality modes, and an ElevenLabs TTS proxy — enabling end-to-end voice responses from AI-simulated officials
- Engineered a search proxy with 6-hour in-memory result caching, 30 req/min IP rate limiting, and automated 1-hour upstream backoff on 429 responses
- Designed a content moderation pipeline with a durable audit trail (queue + decision ledger), supporting `PENDING → RESOLVED` workflows with role-based admin actions
- Enforced code quality with a full CI/CD pipeline: GitHub Actions (lint → typecheck → test → secret scan) + Husky pre-commit hooks across a monorepo

**Payback — Privacy-First Consumer Intelligence Platform (React Native · Node.js · PostgreSQL)**

- Built 100% on-device signal extraction from Google Takeout and Meta ZIP exports using AES-256-GCM encrypted SQLite — raw personal data never transmitted to a server
- Implemented a checkpoint-based background processing system using `BGTaskScheduler` (iOS) / `WorkManager` (Android) to handle long-running tasks that survive app suspension and resume from interruption
- Normalized user behavioral data into 135 unified categories across 10 pillars, consistent between Google and Meta data sources
- Engineered a secure backend AI proxy with Google OAuth token verification, 5 req/min per-user rate limiting, global IP rate limiting (100 req/15 min), dual Gemini API key failover, and 2-minute AbortController timeout
- Built a multi-tenant PostgreSQL analytics system with materialized views and SHA-256 anonymized category match tracking for GDPR/CCPA compliance
- Prevented AI token truncation by batching 135+ behavioral categories into groups of 50 for Gemini 2.5 Pro calls

**RentHarbor — Property Management Platform (React Native · Supabase · Three.js)**

- Delivered a multi-role property management SaaS (landlord, tenant, admin) with Row Level Security policies in Supabase PostgreSQL — tenants and landlords access only their own scoped data
- Deployed a Supabase Edge Function (`property-gemini`) to keep Gemini API keys server-side, preventing mobile app reverse-engineering exploits
- Integrated real-time Supabase subscriptions for live messaging, maintenance notifications, and payment status updates
- Built an interactive 3D property visualization engine using Three.js, `@react-three/fiber`, and `expo-gl` natively in React Native
- Shipped a PWA-capable web build with Workbox service worker for offline support and asset precaching

**Feng Shui — AI-Powered Room Analysis App (React Native · Three.js · Skia · Firebase)**

- Built a full freehand drawing → 3D rendering pipeline: Skia canvas → Douglas-Peucker polygon simplification (`simplify-js`) → corner-snap UI → Three.js scene with orbit/zoom controls
- Integrated Gemini 2.0 Flash via Firebase Cloud Functions on the server side — returning structured analysis across Bagua zone mapping, element balance, chi flow, command position, and ranked recommendations
- Engineered an AI layout optimization feature that generates 2–3 furniture rearrangement alternatives, animated on the floor plan, with predicted score comparisons before any change is committed
- Built a 69-item furniture catalog across 11 categories and a full wall/ceiling/floor annotation system (doors, windows, outlets, vents, fixtures) — all reflected in the 3D scene

**Yap United — Real-Time Translation App (React Native · Gemini Live API · ElevenLabs)**

- Integrated the Gemini Live API for hands-free bi-directional Live Mode — audio is transcribed, translated, and routed to the correct earbud (L/R per speaker) in real time, with automatic reconnect and exponential backoff
- Built a full speech pipeline: `expo-audio` recording → Gemini 2.5 Flash STT + language detection + translation → ElevenLabs multilingual TTS — supporting 15 languages end-to-end
- Delivered a location-based community chat system with 5-level geographic zone resolution (neighborhood → district → zip → city → state), Firebase Firestore, and social moderation features (block/report/mute)
- Implemented per-user voice assignment (custom ElevenLabs voice per community member) persisted in AsyncStorage, plus a 100-message/day rate limit enforced at the Firestore rules layer

---

### Project Manager

- Served as sole product owner and developer across 5 concurrent production apps — civic tech, consumer intelligence, PropTech, spatial AI, and real-time communication — shipped within a 12-month period
- Defined and shipped a content moderation workflow (PINPOINT) with a persistent audit trail, admin dashboard, and role-based decision controls — from product spec to deployed feature
- Designed a 3-sided marketplace architecture (RentHarbor) with distinct role-based access flows for landlords, tenants, and admins — including an admin approval gate for user onboarding
- Maintained full compliance documentation for Payback including `PRIVACY_POLICY.md`, `SECURITY.md`, `TERMS_OF_SERVICE.md`, and `DATA_DELETION.md` — GDPR/CCPA-ready at launch
- Managed complex multi-phase UX flows (Feng Shui's 10-step draw → analyze → optimize pipeline) with detailed `implementation-plans/` docs tracking each phase
- Maintained structured API documentation (Postman collections, full endpoint references) across all backend-integrated projects
- Wrote end-to-end deployment runbooks (`DEPLOYMENT_GUIDE.md`, `eas-expo-workflow.md`) covering EAS build, OTA update, Cloud Functions deploy, and Firestore rules deployment

---

### UI/UX Designer

- Designed a custom multi-theme design system for PINPOINT: 5 color palettes × light/dark = 10 visual modes, with Montserrat and Raleway typography, spacing tokens, and material definitions
- Built a 3-page swipe-based civic dashboard with persistent scroll position and smooth pager transitions — designed for daily re-engagement
- Implemented deep linking (`pinpointapp://`) across all core content types (officials, bills, chat sessions) — enabling shareable, direct-entry flows
- Designed a "data vault" trust metaphor for Payback — framing privacy-first architecture as a product identity, not just a technical constraint; delivered high-fidelity data visualizations using Skia and Victory Native
- Built a 3D interactive property visualization in RentHarbor, giving landlords a spatial preview tool absent from competing property management apps
- Designed a 10-step procedural creation flow for Feng Shui (draw → refine → name → annotate → furnish → preview → analyze → optimize → compare → apply) with clear spatial context at each step
- Created animated furniture rearrangement previews (React Native Reanimated) in Feng Shui — users see AI suggestions in motion before committing to a layout change
- Designed a shared-device turn indicator for Yap United — a critical affordance preventing crosstalk on a single phone held between two people
- Designed an earbud L/R assignment screen for Yap United's Live Mode — novel UI pattern for a genuinely new interaction paradigm with no established design conventions
- Built a non-Latin script preview modal (view, edit, retry, send original) in Yap United — thoughtful internationalization UX for users whose language uses a script the other person cannot read

---

## Detailed Project Breakdown

### PINPOINT — Civic Engagement Platform

**Stack:** React Native 0.81.5 · Expo SDK 54 · React 19 · TypeScript 5.9 (strict) · Express · Prisma ORM · PostgreSQL · Railway · Firebase Auth · Gemini AI · ElevenLabs · OpenStates v3 · Google Civic API · Brave Search · Zustand 5 · TanStack Query 5 · MSW 2 · Jest 29

**Architecture:**

```
Pinpoint Mobile App (Expo / React Native)
        │
        │  REST API + Firebase ID Token (Bearer)
        ▼
Pinpoint Backend (Express / TypeScript)
  ├── jose (JWKS)  →  verifies Firebase ID tokens via Google public keys
  ├── Prisma + PostgreSQL (Railway)
  ├── Gemini chat + TTS proxy
  ├── Google Custom Search proxy (6hr cache, rate-limited)
  └── OpenStates v3 proxy
```

**Key Features:**

- Browse U.S. elected officials and legislation by state/party/role with interactive maps
- AI chat with officials — SSE streaming, personality modes, TTS via ElevenLabs
- Political alignment surveys (PAI, Sparkle, Philosophy, Readiness) with persistent scoring
- 3-page swipe dashboard: civic readiness, local reps + voting records + elections, survey intro
- Location-based community zones
- Favorites + voting (upvote/downvote bills and officials)
- Deep linking (`pinpointapp://`)
- Web-based admin dashboard (Vite + React Router): user management, content moderation, analytics
- CI/CD: GitHub Actions + Husky + lint-staged
- React Compiler (experimental) + New Architecture enabled

**Database Models:** User · Vote · Favorite · PaiSurvey · SparkleSurvey · PhilosophySurvey · ReadinessSurvey · ReadinessSurveyHistory · CommunityMember · ModerationItem · ModerationAction · Review

---

### Payback — Privacy-First Consumer Intelligence Platform

**Stack:** React Native 0.81 · Expo SDK 54 · TypeScript 5.9 · Node.js backend · PostgreSQL (Railway) · Google Gemini 2.5 Pro · Skia · Victory Native · expo-sqlite · expo-task-manager · expo-background-fetch · AES-256-GCM · piexifjs · fflate · Vitest

**Architecture:**

```
Mobile App (Expo)
  ├── On-device ZIP extractor (fflate)
  ├── Signal extractors (Google Takeout + Meta)
  ├── EXIF/media agent (piexifjs + expo-image-manipulator)
  ├── Checkpoint manager (resumable background tasks)
  ├── AES-256-GCM encrypted SQLite vault
  └── Secure backend proxy ───► Gemini 2.5 Pro
         ├── Google OAuth token verification
         ├── Rate limiting (5/min per user · 100/15min global)
         ├── Dual API key failover
         ├── Exponential backoff + jitter (3 retries)
         └── AbortController (2-min timeout)

Backend → PostgreSQL (Railway)
  ├── 135 categories per user (10 pillars)
  ├── Materialized views (aggregate dashboards)
  └── SHA-256 anonymized category match tracking
```

**Key Features:**

- Analyzes Google Takeout (YouTube, Search, Chrome, Location, Maps, Play, Gmail, Photos) and Meta exports (Instagram + Facebook posts, activity, media)
- 135 behavioral categories across 10 pillars: identity_lifestyle · interests_hobbies · spending_patterns · tech_adoption · life_stage + 5 more
- 30–60 second Quick Analysis; deeper on-device Instant Analysis
- Background processing that survives app suspension (BGTaskScheduler/WorkManager)
- GDPR/CCPA: data export, deletion, consent management
- Full compliance docs: PRIVACY_POLICY · SECURITY · TERMS_OF_SERVICE · DATA_DELETION

---

### RentHarbor — Property Management Platform

**Stack:** React Native · Expo SDK 53 · TypeScript · Supabase (PostgreSQL + Auth + RLS + Edge Functions + Realtime) · Three.js · `@react-three/fiber` · expo-gl · Workbox (PWA)

**Key Features:**

- Landlord: manage properties, tenants, maintenance requests
- Tenant: pay rent, submit maintenance, communicate with landlord
- Admin: user approvals, platform oversight
- Real-time messaging, maintenance notifications, payment status via Supabase subscriptions
- Row Level Security: role-scoped data access enforced at the database layer
- 3D property visualization (Three.js + React Three Fiber in React Native)
- PWA-capable web build with Workbox service worker
- Supabase Edge Function for server-side Gemini AI integration
- `difflib` for smart lease/document comparison

---

### Feng Shui — AI-Powered Room Analysis App

**Stack:** React Native 0.81 · Expo SDK 54 · React 19 · TypeScript · Skia · Three.js · expo-three · expo-gl · Gemini 2.0 Flash · Firebase (Auth + Firestore + Cloud Functions) · React Native Reanimated v4 · simplify-js · Lottie

**Pipeline:**

```
Freehand Skia canvas draw
  → Douglas-Peucker simplification (simplify-js)
  → Corner detection + snap handles
  → Room naming + type + usage notes
  → Wall annotations (doors, windows, outlets, vents, switches)
  → Ceiling/floor annotations (lights, fans, vents)
  → Furniture placement (69 items · 11 categories)
  → Wall decor (mirrors, art, shelves)
  → 3D furnished preview (Three.js element-coded boxes)
  → Gemini 2.0 Flash analysis (via Firebase Cloud Function)
      └── Bagua zones · element balance · chi flow · command position · recommendations
  → AI layout optimization (2–3 alternatives, animated previews, score comparison)
  → Apply preferred arrangement
```

**Key Features:**

- Smart corner detection and drag-to-refine handles
- Full wall annotation taxonomy: doors (with subtype), windows (compass direction + treatment), outlets, vents, light switches
- Ceil/floor annotations: ceiling lights/fans/vents, floor vents
- 69 furniture items across 11 categories with search + filter
- Wall decor mounting mode
- Animated furniture rearrangement previews before committing
- Firestore sync with offline support
- Lottie animations · dark mode · vintage Japanese aesthetic

---

### Yap United — Real-Time Translation App

**Stack:** React Native 0.81 · Expo SDK 54 · React 19 · TypeScript 5.9 (strict) · Expo Router 6 · Gemini 2.5 Flash (STT + translation) · Gemini Live API (real-time streaming) · ElevenLabs (TTS) · Firebase (Auth + Firestore) · expo-audio · react-native-audio-api

**Pipeline:**

```
Speaker A records/types
  → Gemini 2.5 Flash: language detection + transcription + translation
  → ElevenLabs: TTS in target language (assigned voice)
  → Display to Speaker B with original + translation

Live Mode:
  → Gemini Live API real-time session
  → Audio routed to L/R earbud per speaker
  → Automatic reconnect with backoff on drop
```

**Supported Languages:** English · Spanish · French · German · Italian · Portuguese · Chinese · Japanese · Korean · Arabic · Hindi · Russian · Turkish · Dutch · Polish (15 total)

**Key Features:**

- Turn-based conversation mode with turn indicator affordance
- Live Mode: hands-free real-time translation via Gemini Live API
- Per-user ElevenLabs voice assignment (custom voice per community member)
- Community zones at 5 geographic levels (neighborhood → district → zip → city → state)
- Non-Latin script preview/edit/retry modal before sending
- Social features: block/report/mute, 100 msg/day rate limit (Firestore rules)
- Multi-auth: email · Google Sign-In · Apple Sign-In
- Settings-driven localization: target language drives all UI copy

---

## Cross-Cutting Technical Patterns

| Pattern | Projects |
|---|---|
| Firebase Auth (token verification) | PINPOINT, Payback, Feng Shui, Yap United |
| Supabase (auth + DB + RLS) | RentHarbor |
| Gemini AI integration | PINPOINT, Payback, Feng Shui, Yap United, RentHarbor |
| ElevenLabs TTS | PINPOINT, Yap United |
| Expo Router (file-based navigation) | PINPOINT, RentHarbor, Feng Shui, Yap United |
| React Native Reanimated v4 | PINPOINT, RentHarbor, Feng Shui, Yap United |
| pnpm + TypeScript strict mode | All 5 projects |
| EAS Build + EAS Update (OTA) | All 5 projects |
| Husky + lint-staged pre-commit | PINPOINT, Payback, Yap United |
| GitHub Actions CI/CD | PINPOINT, Payback |
| Three.js (3D) | RentHarbor, Feng Shui |
| Skia (canvas rendering) | Payback, Feng Shui |
| Firestore + security rules | PINPOINT, Feng Shui, Yap United |
| Rate limiting (backend) | PINPOINT (30 req/min), Payback (5/user/min · 100/15min global) |
| Jest + React Testing Library + MSW | PINPOINT, Payback |
