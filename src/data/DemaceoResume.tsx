// Résumé content for the on-screen InteractiveResume. Mirrors the owner's
// preferred PDF (public/resume/Demaceo_Vincent_Howard_Resume.pdf), which is
// what the "Download PDF" button serves — keep the two in sync when either
// changes. The phone number is intentionally omitted here and redacted from
// the published PDF.

interface ResumeLink {
  label: string;
  href: string;
}

interface SelectedWork {
  name: string;
  tagline: string;
  summary: string;
}

interface WorkExperience {
  role: string;
  organization: string;
  dates: string;
  /** One-line description of the company / context. */
  context: string;
  summary: string;
}

interface SpeakingItem {
  title: string;
  detail: string;
}

interface Education {
  program: string;
  institution: string;
}

interface DemaceoProfile {
  name: string;
  title: string;
  location: string;
  availability: string;
  links: ResumeLink[];
  /** Bolded opening words of the summary paragraph. */
  summaryLead: string;
  summary: string;
  selectedWork: SelectedWork[];
  experiences: WorkExperience[];
  teaching: string;
  speaking: SpeakingItem[];
  coreStack: string[];
  aiTools: string[];
  education: Education[];
  pdf: { href: string; filename: string };
}

export const DemaceoResume: DemaceoProfile = {
  name: "Demaceo Vincent Howard",
  title: "Senior Full-Stack & Mobile Engineer · React, TypeScript & Node",
  location: "Denver, CO",
  availability: "Onsite-ready",
  links: [
    { label: "demaceo.com", href: "https://www.demaceo.com" },
    { label: "linkedin.com/in/demaceo", href: "https://www.linkedin.com/in/demaceo" },
    { label: "anappidea.llc", href: "https://anappidea.llc" },
  ],
  summaryLead: "Senior full-stack engineer",
  summary:
    " specializing in React, TypeScript, and Node. Through An App Idea LLC I've shipped more than five production applications end to end, pairing React and React Native front ends with TypeScript-strict Node and PostgreSQL backends, secured APIs, production AI integration, and CI/CD. Before that I built responsive React interfaces at a generative-AI platform and full-stack features across React and Ruby on Rails at a fintech serving small businesses. I move quickly across the stack, lean on AI development tools throughout my workflow, and sweat the details that keep software reliable for real users.",
  selectedWork: [
    {
      name: "Pinpoint",
      tagline: "Full-Stack Web & Mobile Platform",
      summary:
        "React front end on a Node and PostgreSQL backend, with JWT-secured REST APIs, SSE streaming, and AI-powered analysis via the Gemini API.",
    },
    {
      name: "Payback",
      tagline: "Privacy-First Behavioral Analytics",
      summary:
        "On-device insights using AES-256 encryption, anonymized tracking, and GDPR and CCPA data-deletion flows built in React Native and TypeScript.",
    },
    {
      name: "The Yap App",
      tagline: "Real-Time Multilingual Translation",
      summary:
        "Live cross-language conversation over the Gemini Live API, with resilient auto-reconnect and earbud-aware voice assignment across concurrent audio streams.",
    },
  ],
  experiences: [
    {
      role: "Founder & Full-Stack / Mobile Engineer",
      organization: "An App Idea LLC",
      dates: "Jan 2025 – Present",
      context: "independent software studio",
      summary:
        "Solo-built and shipped 5+ production React and React Native apps (Expo SDK 51–54) end to end, owning product, architecture, TypeScript-strict Node and PostgreSQL backends, production AI/LLM integration, CI/CD, and App Store and Google Play releases.",
    },
    {
      role: "Front End Engineer",
      organization: "Hypercard AI",
      dates: "Oct 2023 – Apr 2024",
      context: "generative-AI platform",
      summary:
        "Built responsive React and TypeScript interfaces and a customizable multi-format export system (PPT, PDF, CSV, DOCX, XLSX, JSON).",
    },
    {
      role: "Software Engineer",
      organization: "Human Interest",
      dates: "May 2021 – Feb 2023",
      context: "fintech expanding retirement access for small businesses",
      summary:
        "Full-stack work across React, Ruby on Rails, and data-ingestion pipelines; integrated 95%+ of partner APIs and built CI/CD automation that cut integration time 30%.",
    },
  ],
  teaching:
    "Upright Education (Teaching Assistant) and Turing School (Alumni Mentor): taught full-stack JavaScript to cohorts of 15 to 25 and mentored developers through code reviews, pairing, and mock interviews; mentees placed at technology companies.",
  speaking: [
    {
      title: "SXSW EDU 2025 · Panelist",
      detail: "“Behind the Wheel: Youth Driving Tech & Media”",
    },
    {
      title: "PBS · “Tech For Us”",
      detail: "Featured engineer · nationally televised 2025",
    },
  ],
  coreStack: [
    "React",
    "React Native",
    "TypeScript",
    "JavaScript",
    "Node",
    "Next.js",
    "REST APIs",
    "PostgreSQL",
    "Prisma",
    "Supabase",
    "Firebase",
    "Python",
    "FastAPI",
    "Tailwind",
    "CI/CD",
    "Vercel",
    "Gemini",
    "OpenAI",
    "Git",
  ],
  aiTools: ["Claude Code", "Cursor", "GitHub Copilot", "ChatGPT"],
  education: [
    {
      program: "Front-End Engineering & UI/UX",
      institution: "Turing School of Software & Design",
    },
    { program: "B.S., Biology", institution: "Cornell College" },
  ],
  pdf: {
    href: "/resume/Demaceo_Vincent_Howard_Resume.pdf",
    filename: "Demaceo_Vincent_Howard_Resume.pdf",
  },
};

export default DemaceoResume;
