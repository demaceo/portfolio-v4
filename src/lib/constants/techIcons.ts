import {
  faReact,
  faVuejs,
  faJs,
  faHtml5,
  faCss3,
  faDocker,
  faLinux,
  faAws,
  faGoogle,
  faFigma,
  faNode,
  faPython,
  faGithub,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import {
  type IconDefinition,
  faRocket,
  faFileCode,
  faCubes,
  faChartLine,
  faCloud,
  faVectorSquare,
  faCompassDrafting,
  faShapes,
  faSwatchbook,
  faUserCheck,
  faWandMagicSparkles,
  faUniversalAccess,
  faServer,
  faRoute,
  faDiagramProject,
  faDatabase,
  faBolt,
  faKey,
  faPlug,
  faBoxesStacked,
  faLayerGroup,
  faArrowsRotate,
  faGaugeHigh,
  faSitemap,
  faBoxArchive,
  faCode,
  faClockRotateLeft,
  faTerminal,
  faSpider,
  faCalendarCheck,
  faNetworkWired,
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";

// Resolves a "Tech & tools" chip label (see services.ts) to a representative
// icon. Keyed by the exact tag string so services.ts can stay a flat
// string[] — add a new tag there, add its lookup entry here.
export const TECH_ICON_MAP: Record<string, IconDefinition> = {
  // sb1 — Web Apps & Corporate Sites
  React: faReact,
  "Next.js": faRocket,
  TypeScript: faFileCode,
  JavaScript: faJs,
  HTML5: faHtml5,
  CSS3: faCss3,
  "Tailwind CSS": faCubes,
  Figma: faFigma,
  Vercel: faCloud,
  Analytics: faChartLine,

  // sb2 — Mobile App Design
  Framer: faVectorSquare,
  Prototyping: faCompassDrafting,
  Wireframing: faShapes,
  "Design Systems": faSwatchbook,
  "User Testing": faUserCheck,
  "iOS Guidelines": faApple,
  "Material Design": faGoogle,
  "Motion Design": faWandMagicSparkles,
  Accessibility: faUniversalAccess,

  // sb3 — Front End Development (React/Next.js/TypeScript/JavaScript/
  // HTML5/CSS3/Tailwind CSS/Accessibility already covered above)
  "Vue.js": faVuejs,
  "Framer Motion": faWandMagicSparkles,

  // sb4 — API & Microservices
  "Node.js": faNode,
  Express: faServer,
  REST: faRoute,
  GraphQL: faDiagramProject,
  PostgreSQL: faDatabase,
  Redis: faBolt,
  Docker: faDocker,
  "JWT Auth": faKey,
  Swagger: faFileCode,
  Webhooks: faPlug,

  // sb5 — Cloud & DevOps (Docker above)
  AWS: faAws,
  "Google Cloud": faGoogle,
  Kubernetes: faBoxesStacked,
  "GitHub Actions": faGithub,
  Terraform: faLayerGroup,
  "CI/CD": faArrowsRotate,
  Linux: faLinux,
  Nginx: faServer,
  Monitoring: faGaugeHigh,

  // sb6 — Data & Database Design (PostgreSQL/Redis above)
  MongoDB: faLayerGroup,
  SQL: faFileCode,
  Prisma: faDiagramProject,
  Neon: faDatabase,
  "Data Modeling": faSitemap,
  "Query Optimization": faGaugeHigh,
  Migrations: faArrowsRotate,
  Backups: faBoxArchive,

  // sb7 — Automation & Scripting (Node.js/GitHub Actions above)
  Python: faPython,
  Bash: faCode,
  Cron: faClockRotateLeft,
  "CLI Tools": faTerminal,
  "Shell Scripting": faFileCode,
  "Web Scraping": faSpider,
  "Task Scheduling": faCalendarCheck,
  APIs: faNetworkWired,
};

// Defensive fallback for any tag string not in the map above (e.g. a new
// tag added to services.ts without a matching entry). Mirrors
// PROJECT_ICON_FALLBACK in projectIcons.ts for a consistent "unknown" glyph.
export const TECH_ICON_FALLBACK: IconDefinition = faLaptopCode;
