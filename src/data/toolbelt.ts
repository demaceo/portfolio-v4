import {
    faFigma,
    faWebflow,
    faGit,
    faReact,
    faJs,
    faCss3,
    faHtml5,
    faGithub,
    faNode,
    faNpm,
    faPython,
    faAws,
    faDocker,
    faLinux,
    faSlack,
    faJira,
    faMarkdown,
    faVuejs,
    faBootstrap,
    faWordpress,
    faGitlab,
    faGoogle,
    faApple,
    faYarn,
    faTrello,
    faConfluence,
    faDiscord,
    faMicrosoft,
    faAngular,
    faStripe,
    faShopify,
    faGolang,
} from "@fortawesome/free-brands-svg-icons";
import {
    faDatabase,
    faServer,
    faTerminal,
    faMobile,
    faChartLine,
    faBug,
    faFire,
    faCubes,
    faCode,
    faCloud,
    faShoppingCart,
    faBolt,
    faLayerGroup,
    faSearch,
    faRobot,
    faShield,
    faCog,
    faCodeBranch,
    faFileAlt,
    faGlobe,
} from "@fortawesome/free-solid-svg-icons";

const tools = [
    // Design & Prototyping
    { icon: faFigma, tooltip: "Figma", category: "Design" },
    { icon: faWebflow, tooltip: "Webflow", category: "Design" },
    { icon: faCode, tooltip: "Adobe Creative Suite", category: "Design" },
    { icon: faShoppingCart, tooltip: "E-commerce Design", category: "Design" },

    // Frontend Development
    { icon: faReact, tooltip: "React", category: "Frontend" },
    { icon: faVuejs, tooltip: "Vue.js", category: "Frontend" },
    { icon: faAngular, tooltip: "Angular", category: "Frontend" },
    { icon: faJs, tooltip: "JavaScript", category: "Frontend" },
    { icon: faCode, tooltip: "TypeScript", category: "Frontend" },
    { icon: faCss3, tooltip: "CSS3", category: "Frontend" },
    { icon: faHtml5, tooltip: "HTML5", category: "Frontend" },
    { icon: faCubes, tooltip: "Tailwind CSS", category: "Frontend" },
    { icon: faBootstrap, tooltip: "Bootstrap", category: "Frontend" },
    { icon: faLayerGroup, tooltip: "Next.js", category: "Frontend" },
    { icon: faBolt, tooltip: "Vite", category: "Frontend" },

    // Backend Development
    { icon: faNode, tooltip: "Node.js", category: "Backend" },
    { icon: faPython, tooltip: "Python", category: "Backend" },
    { icon: faGolang, tooltip: "Go", category: "Backend" },
    { icon: faServer, tooltip: "Express.js", category: "Backend" },
    { icon: faDatabase, tooltip: "PostgreSQL", category: "Backend" },
    { icon: faLayerGroup, tooltip: "Prisma", category: "Backend" },
    { icon: faCloud, tooltip: "Supabase", category: "Backend" },
    { icon: faCodeBranch, tooltip: "GraphQL", category: "Backend" },

    // Cloud & Infrastructure
    { icon: faAws, tooltip: "AWS", category: "Cloud" },
    { icon: faGoogle, tooltip: "Google Cloud", category: "Cloud" },
    { icon: faMicrosoft, tooltip: "Azure", category: "Cloud" },
    { icon: faFire, tooltip: "Firebase", category: "Cloud" },
    { icon: faGlobe, tooltip: "Vercel", category: "Cloud" },
    { icon: faCloud, tooltip: "Netlify", category: "Cloud" },

    // DevOps & Version Control
    { icon: faGit, tooltip: "Git", category: "DevOps" },
    { icon: faGithub, tooltip: "GitHub", category: "DevOps" },
    { icon: faGitlab, tooltip: "GitLab", category: "DevOps" },
    { icon: faDocker, tooltip: "Docker", category: "DevOps" },
    { icon: faLinux, tooltip: "Linux", category: "DevOps" },
    { icon: faCog, tooltip: "GitHub Actions", category: "DevOps" },

    // Package Management & Tools
    { icon: faNpm, tooltip: "NPM", category: "Tools" },
    { icon: faYarn, tooltip: "Yarn", category: "Tools" },
    { icon: faTerminal, tooltip: "CLI Tools", category: "Tools" },
    { icon: faApple, tooltip: "macOS", category: "Tools" },
    { icon: faCode, tooltip: "VS Code", category: "Tools" },

    // CMS & E-commerce
    { icon: faWordpress, tooltip: "WordPress", category: "CMS" },
    { icon: faShopify, tooltip: "Shopify", category: "CMS" },
    { icon: faStripe, tooltip: "Stripe", category: "CMS" },
    { icon: faLayerGroup, tooltip: "Contentful", category: "CMS" },

    // Collaboration & Communication
    { icon: faSlack, tooltip: "Slack", category: "Collaboration" },
    { icon: faDiscord, tooltip: "Discord", category: "Collaboration" },
    { icon: faJira, tooltip: "Jira", category: "Collaboration" },
    { icon: faTrello, tooltip: "Trello", category: "Collaboration" },
    { icon: faConfluence, tooltip: "Confluence", category: "Collaboration" },

    // Testing & Analytics
    { icon: faBug, tooltip: "Testing & QA", category: "Testing" },
    { icon: faMobile, tooltip: "Mobile Testing", category: "Testing" },
    { icon: faChartLine, tooltip: "Google Analytics", category: "Testing" },
    { icon: faSearch, tooltip: "Lighthouse", category: "Testing" },

    // AI & Emerging Tech
    { icon: faRobot, tooltip: "AI Tools", category: "AI" },
    { icon: faShield, tooltip: "Copilot", category: "AI" },
    { icon: faCode, tooltip: "OpenAI API", category: "AI" },

    // Documentation
    { icon: faMarkdown, tooltip: "Markdown", category: "Documentation" },
    { icon: faFileAlt, tooltip: "Notion", category: "Documentation" },
    { icon: faGlobe, tooltip: "Storybook", category: "Documentation" },
];

export default tools;