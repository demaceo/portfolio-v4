export type ResumeRoleName =
  | "Senior Software Engineer"
  | "Project Manager"
  | "UI/UX Designer";

export type ResumeProjectKey =
  | "pinpoint"
  | "payback"
  | "rentharbor"
  | "feng-shui"
  | "yap-united";

export interface ResumeRoleBullet {
  text: string;
  project?: string;
}

export interface ResumeRoleBulletGroup {
  role: ResumeRoleName;
  bullets: ResumeRoleBullet[];
}

export interface ResumeProjectBreakdown {
  key: ResumeProjectKey;
  name: string;
  subtitle: string;
  stack: string[];
  flowTitle: "Architecture" | "Pipeline";
  flowDiagram: string;
  keyFeatures: string[];
  databaseModels?: string[];
  supportedLanguages?: string[];
}

export interface CrossCuttingPattern {
  pattern: string;
  projects: string;
}

export const resumeRoleBullets: ResumeRoleBulletGroup[] = [
  {
    role: "Senior Software Engineer",
    bullets: [
      {
        project: "PINPOINT",
        text: "Architected a full-stack civic platform across iOS, Android, and Web using React Native (Expo SDK 54), TypeScript Express, and PostgreSQL via Prisma ORM, deployed on Railway with zero downtime.",
      },
      {
        project: "PINPOINT",
        text: "Implemented JWT authentication without Firebase Admin SDK by verifying Firebase ID tokens directly via Google's JWKS endpoint using jose, eliminating service account exposure.",
      },
      {
        project: "PINPOINT",
        text: "Built a Gemini AI chat system with real-time SSE streaming, multiple personality modes, and an ElevenLabs TTS proxy, enabling end-to-end voice responses from AI simulated officials.",
      },
      {
        project: "PINPOINT",
        text: "Engineered a search proxy with 6-hour in-memory result caching, 30 req/min IP rate limiting, and automated 1-hour upstream backoff on 429 responses.",
      },
      {
        project: "PINPOINT",
        text: "Designed a content moderation pipeline with a durable audit trail (queue + decision ledger), supporting PENDING -> RESOLVED workflows with role-based admin actions.",
      },
      {
        project: "PINPOINT",
        text: "Enforced code quality with a full CI/CD pipeline: GitHub Actions (lint -> typecheck -> test -> secret scan) plus Husky pre-commit hooks across a monorepo.",
      },
      {
        project: "pbv2 (Payback)",
        text: "Built 100% on-device signal extraction from Google Takeout and Meta ZIP exports using AES-256-GCM encrypted SQLite, ensuring raw personal data is never transmitted to a server.",
      },
      {
        project: "pbv2 (Payback)",
        text: "Implemented checkpoint-based background processing using BGTaskScheduler (iOS) and WorkManager (Android) for long-running tasks that survive app suspension and resume from interruption.",
      },
      {
        project: "pbv2 (Payback)",
        text: "Normalized user behavioral data into 135 unified categories across 10 pillars, consistent between Google and Meta data sources.",
      },
      {
        project: "pbv2 (Payback)",
        text: "Engineered a secure backend AI proxy with Google OAuth token verification, 5 req/min per-user limiting, 100 req/15 min global limiting, dual Gemini key failover, and a 2-minute AbortController timeout.",
      },
      {
        project: "pbv2 (Payback)",
        text: "Built a multi-tenant PostgreSQL analytics system with materialized views and SHA-256 anonymized category match tracking for GDPR/CCPA compliance.",
      },
      {
        project: "pbv2 (Payback)",
        text: "Prevented AI token truncation by batching 135+ behavioral categories into groups of 50 for Gemini 2.5 Pro calls.",
      },
      {
        project: "RentHarbor",
        text: "Delivered a multi-role property management SaaS (landlord, tenant, admin) with Row Level Security policies in Supabase PostgreSQL so users only access their own scoped data.",
      },
      {
        project: "RentHarbor",
        text: "Deployed a Supabase Edge Function (property-gemini) to keep Gemini API keys server-side, preventing mobile app reverse-engineering exploits.",
      },
      {
        project: "RentHarbor",
        text: "Integrated real-time Supabase subscriptions for live messaging, maintenance notifications, and payment status updates.",
      },
      {
        project: "RentHarbor",
        text: "Built an interactive 3D property visualization engine using Three.js, @react-three/fiber, and expo-gl natively in React Native.",
      },
      {
        project: "RentHarbor",
        text: "Shipped a PWA-capable web build with a Workbox service worker for offline support and asset precaching.",
      },
      {
        project: "Feng Shui",
        text: "Built a full freehand drawing to 3D rendering pipeline: Skia canvas -> simplify-js polygon simplification -> corner-snap UI -> Three.js scene with orbit and zoom controls.",
      },
      {
        project: "Feng Shui",
        text: "Integrated Gemini 2.0 Flash via Firebase Cloud Functions to return structured analysis across Bagua zone mapping, element balance, chi flow, command position, and ranked recommendations.",
      },
      {
        project: "Feng Shui",
        text: "Engineered an AI layout optimization feature that generates 2-3 furniture rearrangement alternatives, animated on the floor plan with predicted score comparisons before commit.",
      },
      {
        project: "Feng Shui",
        text: "Built a 69-item furniture catalog across 11 categories and a complete wall, ceiling, and floor annotation system reflected directly in the 3D scene.",
      },
      {
        project: "Yap United",
        text: "Integrated the Gemini Live API for hands-free bi-directional Live Mode where audio is transcribed, translated, and routed to the correct earbud channel per speaker with automatic reconnect and exponential backoff.",
      },
      {
        project: "Yap United",
        text: "Built a full speech pipeline: expo-audio recording -> Gemini 2.5 Flash STT + language detection + translation -> ElevenLabs multilingual TTS, supporting 15 languages end-to-end.",
      },
      {
        project: "Yap United",
        text: "Delivered a location-based community chat system with 5-level geographic zone resolution, Firestore persistence, and social moderation features.",
      },
      {
        project: "Yap United",
        text: "Implemented per-user voice assignment persisted in AsyncStorage, plus a 100 message/day rate limit enforced at the Firestore rules layer.",
      },
    ],
  },
  {
    role: "Project Manager",
    bullets: [
      {
        text: "Served as sole product owner and developer across 5 concurrent production apps in civic tech, consumer intelligence, PropTech, spatial AI, and real-time communication, all shipped within a 12-month period.",
      },
      {
        project: "PINPOINT",
        text: "Defined and shipped a content moderation workflow with a persistent audit trail, admin dashboard, and role-based decision controls from product spec to deployment.",
      },
      {
        project: "RentHarbor",
        text: "Designed a 3-sided marketplace architecture with role-based access flows for landlords, tenants, and admins, including an admin approval gate for onboarding.",
      },
      {
        project: "pbv2 (Payback)",
        text: "Maintained full compliance documentation including PRIVACY_POLICY.md, SECURITY.md, TERMS_OF_SERVICE.md, and DATA_DELETION.md for GDPR/CCPA readiness at launch.",
      },
      {
        project: "Feng Shui",
        text: "Managed a complex multi-phase UX lifecycle (10-step draw -> analyze -> optimize pipeline) with implementation-plans docs covering each release phase.",
      },
      {
        text: "Maintained structured API documentation with Postman collections and full endpoint references across all backend-integrated projects.",
      },
      {
        text: "Wrote end-to-end deployment runbooks (DEPLOYMENT_GUIDE.md and eas-expo-workflow.md) for EAS build, OTA updates, Cloud Functions deploys, and Firestore rules deployment.",
      },
    ],
  },
  {
    role: "UI/UX Designer",
    bullets: [
      {
        project: "PINPOINT",
        text: "Designed a custom multi-theme design system: 5 color palettes across light and dark modes (10 visual modes) with Montserrat and Raleway typography, spacing tokens, and material definitions.",
      },
      {
        project: "PINPOINT",
        text: "Built a 3-page swipe-based civic dashboard with persistent scroll position and smooth pager transitions tuned for daily re-engagement.",
      },
      {
        project: "PINPOINT",
        text: "Implemented deep linking (pinpointapp://) across officials, bills, and chat sessions to support shareable direct-entry flows.",
      },
      {
        project: "pbv2 (Payback)",
        text: "Designed a data vault trust metaphor that framed privacy-first architecture as product identity, paired with high-fidelity visualizations using Skia and Victory Native.",
      },
      {
        project: "RentHarbor",
        text: "Built a 3D interactive property visualization layer that gave landlords a spatial preview capability absent from most competing tools.",
      },
      {
        project: "Feng Shui",
        text: "Designed a 10-step procedural creation flow (draw -> refine -> name -> annotate -> furnish -> preview -> analyze -> optimize -> compare -> apply) with clear spatial context at each step.",
      },
      {
        project: "Feng Shui",
        text: "Created animated furniture rearrangement previews with React Native Reanimated so users can evaluate AI suggestions in motion before committing.",
      },
      {
        project: "Yap United",
        text: "Designed a shared-device turn indicator as a critical affordance to prevent crosstalk during two-person conversations on one phone.",
      },
      {
        project: "Yap United",
        text: "Designed an earbud left/right assignment screen for Live Mode, a new interaction pattern without an established design precedent.",
      },
      {
        project: "Yap United",
        text: "Built a non-Latin script preview modal with view, edit, retry, and send-original actions to support thoughtful internationalization UX.",
      },
    ],
  },
];

export const resumeProjectBreakdowns: ResumeProjectBreakdown[] = [
  {
    key: "pinpoint",
    name: "PINPOINT",
    subtitle: "Civic Engagement Platform",
    stack: [
      "React Native 0.81.5",
      "Expo SDK 54",
      "React 19",
      "TypeScript 5.9 (strict)",
      "Express",
      "Prisma ORM",
      "PostgreSQL",
      "Railway",
      "Firebase Auth",
      "Gemini AI",
      "ElevenLabs",
      "OpenStates v3",
      "Google Civic API",
      "Brave Search",
      "Zustand 5",
      "TanStack Query 5",
      "MSW 2",
      "Jest 29",
    ],
    flowTitle: "Architecture",
    flowDiagram: `Pinpoint Mobile App (Expo / React Native)
  | REST API + Firebase ID Token (Bearer)
  v
Pinpoint Backend (Express / TypeScript)
  |- jose (JWKS): verifies Firebase ID tokens via Google public keys
  |- Prisma + PostgreSQL (Railway)
  |- Gemini chat + TTS proxy
  |- Google Custom Search proxy (6hr cache, rate-limited)
  '- OpenStates v3 proxy`,
    keyFeatures: [
      "Browse US elected officials and legislation by state, party, and role with interactive maps.",
      "AI chat with officials using SSE streaming, personality modes, and ElevenLabs TTS.",
      "Political alignment surveys (PAI, Sparkle, Philosophy, Readiness) with persistent scoring.",
      "Three-page swipe dashboard for civic readiness, local reps and voting records, and survey onboarding.",
      "Location-based community zones plus favorites and voting for bills and officials.",
      "Deep linking (pinpointapp://) across core content types.",
      "Web admin dashboard for user management, moderation, and analytics.",
      "CI/CD with GitHub Actions plus Husky and lint-staged.",
      "React Compiler (experimental) and New Architecture enabled.",
    ],
    databaseModels: [
      "User",
      "Vote",
      "Favorite",
      "PaiSurvey",
      "SparkleSurvey",
      "PhilosophySurvey",
      "ReadinessSurvey",
      "ReadinessSurveyHistory",
      "CommunityMember",
      "ModerationItem",
      "ModerationAction",
      "Review",
    ],
  },
  {
    key: "payback",
    name: "pbv2 (Payback)",
    subtitle: "Privacy-First Consumer Intelligence Platform",
    stack: [
      "React Native 0.81",
      "Expo SDK 54",
      "TypeScript 5.9",
      "Node.js backend",
      "PostgreSQL (Railway)",
      "Gemini 2.5 Pro",
      "Skia",
      "Victory Native",
      "expo-sqlite",
      "expo-task-manager",
      "expo-background-fetch",
      "AES-256-GCM",
      "piexifjs",
      "fflate",
      "Vitest",
    ],
    flowTitle: "Architecture",
    flowDiagram: `Mobile App (Expo)
  |- On-device ZIP extractor (fflate)
  |- Signal extractors (Google Takeout + Meta)
  |- EXIF/media agent (piexifjs + expo-image-manipulator)
  |- Checkpoint manager (resumable background tasks)
  |- AES-256-GCM encrypted SQLite vault
  '- Secure backend proxy -> Gemini 2.5 Pro
       |- Google OAuth token verification
       |- Rate limiting (5/min per user, 100/15min global)
       |- Dual API key failover
       |- Exponential backoff + jitter (3 retries)
       '- AbortController (2-minute timeout)

Backend -> PostgreSQL (Railway)
  |- 135 categories per user (10 pillars)
  |- Materialized views (aggregate dashboards)
  '- SHA-256 anonymized category match tracking`,
    keyFeatures: [
      "Analyzes Google Takeout and Meta exports across posts, activity, media, and behavior sources.",
      "Maps behavioral signals into 135 categories across 10 normalized pillars.",
      "Supports 30-60 second quick analysis plus deeper on-device instant analysis.",
      "Background processing survives app suspension via BGTaskScheduler and WorkManager.",
      "GDPR/CCPA workflow support for export, deletion, and consent management.",
      "Includes compliance docs: PRIVACY_POLICY, SECURITY, TERMS_OF_SERVICE, DATA_DELETION.",
    ],
  },
  {
    key: "rentharbor",
    name: "RentHarbor",
    subtitle: "Property Management Platform",
    stack: [
      "React Native",
      "Expo SDK 53",
      "TypeScript",
      "Supabase (PostgreSQL + Auth + RLS + Edge Functions + Realtime)",
      "Three.js",
      "@react-three/fiber",
      "expo-gl",
      "Workbox (PWA)",
    ],
    flowTitle: "Architecture",
    flowDiagram: `Client Apps (React Native + PWA)
  |- Landlord workflows
  |- Tenant workflows
  '- Admin workflows
      |
      v
Supabase Platform
  |- PostgreSQL with Row Level Security policies
  |- Realtime subscriptions for messaging + notifications + payment updates
  |- Auth + role enforcement
  '- Edge Function (property-gemini) for server-side Gemini access

3D Layer
  '- Three.js + React Three Fiber + expo-gl for property previews`,
    keyFeatures: [
      "Landlord flows for property, tenant, and maintenance management.",
      "Tenant flows for rent payment, maintenance requests, and landlord messaging.",
      "Admin flow for approvals and platform oversight.",
      "Realtime updates for messaging, maintenance status, and payments.",
      "Role-scoped data isolation enforced with database-level RLS.",
      "Interactive 3D property visualization in React Native.",
      "PWA-capable web build with Workbox offline support.",
      "Supabase Edge Function keeps Gemini keys server-side.",
      "Smart lease and document comparison using difflib.",
    ],
  },
  {
    key: "feng-shui",
    name: "Feng Shui",
    subtitle: "AI-Powered Room Analysis App",
    stack: [
      "React Native 0.81",
      "Expo SDK 54",
      "React 19",
      "TypeScript",
      "Skia",
      "Three.js",
      "expo-three",
      "expo-gl",
      "Gemini 2.0 Flash",
      "Firebase (Auth + Firestore + Cloud Functions)",
      "React Native Reanimated v4",
      "simplify-js",
      "Lottie",
    ],
    flowTitle: "Pipeline",
    flowDiagram: `Freehand Skia canvas draw
  -> Douglas-Peucker simplification (simplify-js)
  -> Corner detection + snap handles
  -> Room naming + type + usage notes
  -> Wall annotations (doors, windows, outlets, vents, switches)
  -> Ceiling/floor annotations (lights, fans, vents)
  -> Furniture placement (69 items, 11 categories)
  -> Wall decor (mirrors, art, shelves)
  -> 3D furnished preview (Three.js element-coded boxes)
  -> Gemini 2.0 Flash analysis via Firebase Cloud Function
       -> Bagua zones, element balance, chi flow, command position, recommendations
  -> AI layout optimization (2-3 alternatives, animated previews, score comparison)
  -> Apply preferred arrangement`,
    keyFeatures: [
      "Smart corner detection and drag-to-refine handles.",
      "Complete wall annotation taxonomy with structural and fixture metadata.",
      "Ceiling and floor annotation support for lights, fans, and vents.",
      "69 furniture items across 11 categories with search and filtering.",
      "Wall decor mounting mode for mirrors, art, and shelves.",
      "Animated furniture rearrangement previews before committing.",
      "Firestore sync with offline support.",
      "Lottie animations, dark mode, and a vintage Japanese visual aesthetic.",
    ],
  },
  {
    key: "yap-united",
    name: "Yap United",
    subtitle: "Real-Time Translation App",
    stack: [
      "React Native 0.81",
      "Expo SDK 54",
      "React 19",
      "TypeScript 5.9 (strict)",
      "Expo Router 6",
      "Gemini 2.5 Flash (STT + translation)",
      "Gemini Live API",
      "ElevenLabs (TTS)",
      "Firebase (Auth + Firestore)",
      "expo-audio",
      "react-native-audio-api",
    ],
    flowTitle: "Pipeline",
    flowDiagram: `Speaker A records/types
  -> Gemini 2.5 Flash: language detection + transcription + translation
  -> ElevenLabs: TTS in target language (assigned voice)
  -> Display to Speaker B with original + translation

Live Mode
  -> Gemini Live API real-time session
  -> Audio routed to left/right earbud channel per speaker
  -> Automatic reconnect with exponential backoff`,
    keyFeatures: [
      "Turn-based conversation mode with an explicit turn indicator affordance.",
      "Hands-free Live Mode for real-time translation via Gemini Live API.",
      "Per-user ElevenLabs voice assignment for community members.",
      "Community zones at five geographic levels from neighborhood to state.",
      "Non-Latin script preview, edit, retry workflow before sending.",
      "Social moderation controls: block, report, mute, and message limits.",
      "Multi-auth support: email, Google Sign-In, Apple Sign-In.",
      "Settings-driven localization where target language drives UI copy.",
    ],
    supportedLanguages: [
      "English",
      "Spanish",
      "French",
      "German",
      "Italian",
      "Portuguese",
      "Chinese",
      "Japanese",
      "Korean",
      "Arabic",
      "Hindi",
      "Russian",
      "Turkish",
      "Dutch",
      "Polish",
    ],
  },
];

export const resumeProjectBreakdownByKey = resumeProjectBreakdowns.reduce(
  (acc, project) => {
    acc[project.key] = project;
    return acc;
  },
  {} as Record<ResumeProjectKey, ResumeProjectBreakdown>
);

export const crossCuttingPatterns: CrossCuttingPattern[] = [
  {
    pattern: "Firebase Auth (token verification)",
    projects: "PINPOINT, Payback, Feng Shui, Yap United",
  },
  {
    pattern: "Supabase (auth + DB + RLS)",
    projects: "RentHarbor",
  },
  {
    pattern: "Gemini AI integration",
    projects: "PINPOINT, Payback, Feng Shui, Yap United, RentHarbor",
  },
  {
    pattern: "ElevenLabs TTS",
    projects: "PINPOINT, Yap United",
  },
  {
    pattern: "Expo Router (file-based navigation)",
    projects: "PINPOINT, RentHarbor, Feng Shui, Yap United",
  },
  {
    pattern: "React Native Reanimated v4",
    projects: "PINPOINT, RentHarbor, Feng Shui, Yap United",
  },
  {
    pattern: "pnpm + TypeScript strict mode",
    projects: "All 5 projects",
  },
  {
    pattern: "EAS Build + EAS Update (OTA)",
    projects: "All 5 projects",
  },
  {
    pattern: "Husky + lint-staged pre-commit",
    projects: "PINPOINT, Payback, Yap United",
  },
  {
    pattern: "GitHub Actions CI/CD",
    projects: "PINPOINT, Payback",
  },
  {
    pattern: "Three.js (3D)",
    projects: "RentHarbor, Feng Shui",
  },
  {
    pattern: "Skia (canvas rendering)",
    projects: "Payback, Feng Shui",
  },
  {
    pattern: "Firestore + security rules",
    projects: "PINPOINT, Feng Shui, Yap United",
  },
  {
    pattern: "Rate limiting (backend)",
    projects: "PINPOINT (30 req/min), Payback (5/user/min, 100/15min global)",
  },
  {
    pattern: "Jest + React Testing Library + MSW",
    projects: "PINPOINT, Payback",
  },
];
