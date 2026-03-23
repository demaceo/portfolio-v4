import { Project } from "@/lib/types";

const projectData: Project[] = [
  {
    id: 0,
    slug: "pinpoint",
    name: "Pinpoint",
    yearRange: "2025-2026",
    description:
      "Civic engagement platform helping people find officials, analyze policy alignment, and communicate through AI-assisted workflows.",
    link: "https://pinpoint-flax.vercel.app/",
    deepDiveKey: "pinpoint",
    stackPreview: ["React Native", "Expo SDK 54", "Express", "PostgreSQL"],
    highlights: [
      "Full-stack iOS, Android, and web deployment with zero-downtime delivery.",
      "JWKS-based Firebase token verification without Firebase Admin SDK.",
      "Gemini SSE chat and ElevenLabs voice responses for AI official simulations.",
    ],
    icon: "/icons/projects/pinpoint.png",
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3BqcHJydDE0OWlyaXBzbzIweTV4bjh2bzNidW1oenprMHdpaTRxbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/e9zB7dPkmU7FUBNh8A/giphy.gif",
  },
  {
    id: 1,
    slug: "payback",
    name: "Payback",
    yearRange: "2025-2026",
    description:
      "Privacy-first consumer intelligence platform that processes personal data on-device and generates secure behavioral analytics.",
    link: "https://github.com/demaceo",
    deepDiveKey: "payback",
    stackPreview: ["React Native", "Node.js", "PostgreSQL", "Gemini 2.5 Pro"],
    highlights: [
      "100% on-device extraction from Google and Meta export archives.",
      "Checkpointed background processing for interruption-safe long tasks.",
      "135-category analytics model with GDPR/CCPA-ready compliance workflows.",
    ],
    icon: "/icons/projects/payback.png",
  },
  {
    id: 2,
    slug: "rentharbor",
    name: "RentHarbor",
    yearRange: "2025-2026",
    description:
      "Multi-role property management SaaS with real-time workflows, database-level tenancy isolation, and interactive 3D property previews.",
    link: "https://github.com/demaceo",
    deepDiveKey: "rentharbor",
    stackPreview: ["React Native", "Supabase", "PostgreSQL", "Three.js"],
    highlights: [
      "Role-scoped RLS policies for landlord, tenant, and admin boundaries.",
      "Realtime subscriptions for maintenance, payments, and messaging.",
      "Server-side Gemini proxy via Supabase Edge Functions.",
    ],
    icon: "/icons/projects/rentharbor.png",
  },
  {
    id: 3,
    slug: "feng-shui",
    name: "Feng Shui",
    yearRange: "2025-2026",
    description:
      "Spatial AI room analysis app that transforms freehand floor plans into 3D scenes and optimized furniture layouts.",
    link: "https://github.com/demaceo",
    deepDiveKey: "feng-shui",
    stackPreview: ["React Native", "Skia", "Three.js", "Firebase"],
    highlights: [
      "Freehand-to-3D pipeline with geometric simplification and corner snapping.",
      "Gemini-powered Bagua and layout analysis through Cloud Functions.",
      "Animated AI rearrangement previews with score comparisons before apply.",
    ],
    icon: "/icons/projects/fengshui.png",
  },
  {
    id: 4,
    slug: "yap-united",
    name: "Yap United",
    yearRange: "2025-2026",
    description:
      "Real-time translation app combining Gemini Live speech translation, multilingual TTS, and location-based social conversation zones.",
    link: "https://github.com/demaceo",
    deepDiveKey: "yap-united",
    stackPreview: [
      "React Native",
      "Gemini Live API",
      "ElevenLabs",
      "Firebase",
    ],
    highlights: [
      "Hands-free live mode with reconnect and backoff resilience.",
      "Bidirectional STT translation and multilingual TTS for 15 languages.",
      "Geo-zoned chat with moderation controls and per-user voice profiles.",
    ],
    icon: "/icons/projects/yap.png",
  },
  {
    id: 8,
    name: "Tech For Us",
    image:
      "https://image.pbs.org/video-assets/5Q3iQAC-asset-mezzanine-16x9-luFIYQ7.jpg?crop=1440x810&format=auto",
    description:
      "Featured in documentary exploring technology, innovation, and career development through public interest technology stories.",
    link: "https://www.pbs.org/video/breaking-barriers-tech-for-us-kaq5cy/",
    icon: "fas fa-film icon",
    type: "documentary",
    duration: "25:33",
    network: "PBS",
    archived: true,
  },
  {
    id: 9,
    name: "Engineer My Career",
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHE3ajE3bnBweG83enpxczRlcmVvandvdjN2NTJzbWZmcDl1Z3FveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BY1lBaFvNMFE5gYNP9/giphy.gif",
    description:
      "Career development platform for developers with personalized roadmaps, skill assessments, and job-search tooling.",
    link: "https://engineermycareer.com",
    icon: "fas fa-briefcase icon",
    gif: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHE3ajE3bnBweG83enpxczRlcmVvandvdjN2NTJzbWZmcDl1Z3FveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BY1lBaFvNMFE5gYNP9/giphy.gif",
    archived: true,
  },
  {
    id: 10,
    name: "Unmasked Coaching",
    description:
      "Personalized career guidance and strategic professional development platform.",
    link: "https://unmasked-coaching.com",
    icon: "/icons/projects/unmasked-logo.png",
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXRhZ3h4aTM5eWgyMjdscWY3bXJwaGQybHRiMnM0YjVhYW5vcHU0OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sizoIiglMpC57qXlaq/giphy.gif",
    archived: true,
  },
  {
    id: 11,
    name: "Adopt Don't Shop",
    image: "",
    description:
      "Pet adoption platform connecting users with rescue shelters across the US through Petfinder API listings.",
    link: "https://github.com/demaceo/adoptdontshop",
    icon: "fa fa-paw icon",
    archived: true,
  },
  {
    id: 12,
    name: "Moody Tunes",
    image:
      "https://user-images.githubusercontent.com/66697338/104397652-796aac00-550a-11eb-8f64-4b7f7e0c07cc.gif",
    description:
      "Music recommendation engine driven by user mood with Spotify playback and favorites support.",
    link: "https://demaceo.github.io/moodytoonz/",
    icon: "fas fa-theater-masks icon",
    archived: true,
  },
  {
    id: 13,
    name: "Cappua",
    image: "https://media.giphy.com/media/VTLAVXMEcDEMuGWDV5/giphy.gif",
    description:
      "Monthly hip-hop competition app where users submit verses and vote for hall-of-fame placement.",
    link: "https://github.com/Cappua/cappua-fe",
    icon: "fas fa-music icon",
    archived: true,
  },
  {
    id: 14,
    name: "What's Cookin",
    image: "https://media.giphy.com/media/yHlPATYrKHmIBcgHpM/giphy.gif",
    description:
      "Recipe platform to search, share, and save recipes with authenticated workflows.",
    link: "https://github.com/demaceo/whats-cookin",
    icon: "fas fa-cookie-bite icon",
    archived: true,
  },
  {
    id: 15,
    name: "Rancid Tomatillos",
    image: "https://media.giphy.com/media/0aJoS84OErWv5MlCmw/giphy.gif",
    description:
      "Movie browsing application with ratings-based sorting and filtering experiences.",
    link: "https://github.com/demaceo/rantom",
    icon: "fas fa-film icon",
    archived: true,
  },
];

export default projectData;
export { projectData };
export { projectData as projectsData };
