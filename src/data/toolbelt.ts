import {
    faAndroid,
    faApple,
    faAws,
    faCss3Alt,
    faDocker,
    faFigma,
    faGitAlt,
    faGithub,
    faGoogle,
    faHtml5,
    faJira,
    faJs,
    faLinux,
    faMarkdown,
    faNodeJs,
    faNpm,
    faPython,
    faReact,
    faSlack,
    faVuejs,
    faWebflow,
    faWordpress,
} from "@fortawesome/free-brands-svg-icons";
import {
    faBolt,
    faBoltLightning,
    faBrain,
    faCaretUp,
    faCircleNodes,
    faCode,
    faCodeBranch,
    faCube,
    faDatabase,
    faFire,
    faLayerGroup,
    faMicrophone,
    faMobileScreen,
    faPenNib,
    faRocket,
    faServer,
    faWandMagicSparkles,
    faWaveSquare,
    faWind,
} from "@fortawesome/free-solid-svg-icons";
import type { ToolbeltToolDatum } from "@/lib/utils/toolbeltTree";

/**
 * The Skillset > Toolbelt tools, in display order: categories appear in the
 * order their first tool does. `signature` marks the core stack (copper in the
 * graph). `aliases` are the other spellings used in project `stackPreview`
 * lists and service tags, so "Shipped in" / "Used in" still find them.
 */
const tools: ToolbeltToolDatum[] = [
    // Mobile
    { icon: faReact, tooltip: "React Native", category: "Mobile", signature: true },
    { icon: faMobileScreen, tooltip: "Expo", category: "Mobile", signature: true, aliases: ["Expo SDK 54"] },
    { icon: faApple, tooltip: "iOS", category: "Mobile", aliases: ["iOS Guidelines"] },
    { icon: faAndroid, tooltip: "Android", category: "Mobile" },
    { icon: faPenNib, tooltip: "Skia", category: "Mobile" },

    // Frontend
    { icon: faReact, tooltip: "React", category: "Frontend", signature: true },
    { icon: faCode, tooltip: "TypeScript", category: "Frontend", signature: true },
    { icon: faRocket, tooltip: "Next.js", category: "Frontend" },
    { icon: faJs, tooltip: "JavaScript", category: "Frontend" },
    { icon: faWind, tooltip: "Tailwind CSS", category: "Frontend" },
    { icon: faBoltLightning, tooltip: "Vite", category: "Frontend" },
    { icon: faCube, tooltip: "Three.js", category: "Frontend" },
    { icon: faWaveSquare, tooltip: "Framer Motion", category: "Frontend" },
    { icon: faHtml5, tooltip: "HTML5", category: "Frontend" },
    { icon: faCss3Alt, tooltip: "CSS3", category: "Frontend" },
    { icon: faVuejs, tooltip: "Vue.js", category: "Frontend" },

    // Backend
    { icon: faNodeJs, tooltip: "Node.js", category: "Backend", signature: true },
    { icon: faServer, tooltip: "Express", category: "Backend", aliases: ["Express.js"] },
    { icon: faDatabase, tooltip: "PostgreSQL", category: "Backend" },
    { icon: faLayerGroup, tooltip: "Prisma", category: "Backend" },
    { icon: faCircleNodes, tooltip: "Neon", category: "Backend" },
    { icon: faPython, tooltip: "Python", category: "Backend" },

    // Cloud & data
    { icon: faFire, tooltip: "Firebase", category: "Cloud & Data", signature: true },
    { icon: faBolt, tooltip: "Supabase", category: "Cloud & Data", signature: true },
    { icon: faGoogle, tooltip: "Google Cloud", category: "Cloud & Data" },
    { icon: faAws, tooltip: "AWS", category: "Cloud & Data" },
    { icon: faCaretUp, tooltip: "Vercel", category: "Cloud & Data" },

    // AI
    {
        icon: faWandMagicSparkles,
        tooltip: "Gemini API",
        category: "AI",
        signature: true,
        aliases: ["Gemini 2.5 Pro", "Gemini Live API"],
    },
    { icon: faMicrophone, tooltip: "ElevenLabs", category: "AI" },
    { icon: faBrain, tooltip: "Claude API", category: "AI" },

    // DevOps
    { icon: faGitAlt, tooltip: "Git", category: "DevOps" },
    { icon: faGithub, tooltip: "GitHub", category: "DevOps" },
    { icon: faCodeBranch, tooltip: "GitHub Actions", category: "DevOps", aliases: ["CI/CD"] },
    { icon: faDocker, tooltip: "Docker", category: "DevOps" },
    { icon: faLinux, tooltip: "Linux", category: "DevOps" },
    { icon: faNpm, tooltip: "npm", category: "DevOps" },

    // Design
    { icon: faFigma, tooltip: "Figma", category: "Design" },
    { icon: faWebflow, tooltip: "Webflow", category: "Design" },
    { icon: faWordpress, tooltip: "WordPress", category: "Design" },

    // Workflow
    { icon: faJira, tooltip: "Jira", category: "Workflow" },
    { icon: faSlack, tooltip: "Slack", category: "Workflow" },
    { icon: faMarkdown, tooltip: "Markdown", category: "Workflow" },
];

export default tools;
