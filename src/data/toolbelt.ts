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
} from "@fortawesome/free-brands-svg-icons";
import {
    faDatabase,
    faServer,
    faTerminal,
    faMobile,
    faFileCode,
    faChartLine,
    faBug,
    faRocket,
    faFire,
    faCubes,
} from "@fortawesome/free-solid-svg-icons";

const tools = [
    // Design Tools (5 tools)
    { icon: faFigma, tooltip: "Figma", category: "Design" },
    { icon: faWebflow, tooltip: "Webflow", category: "Design" },
    { icon: faWordpress, tooltip: "WordPress", category: "Design" },
    { icon: faFileCode, tooltip: "Creative Tools", category: "Design" },

    // Frontend Development (9 tools)
    { icon: faReact, tooltip: "React", category: "Frontend" },
    { icon: faVuejs, tooltip: "Vue.js", category: "Frontend" },
    { icon: faAngular, tooltip: "Angular", category: "Frontend" },
    { icon: faJs, tooltip: "JavaScript", category: "Frontend" },
    { icon: faCss3, tooltip: "CSS3", category: "Frontend" },
    { icon: faHtml5, tooltip: "HTML5", category: "Frontend" },
    { icon: faBootstrap, tooltip: "Bootstrap", category: "Frontend" },
    { icon: faCubes, tooltip: "Tailwind CSS", category: "Frontend" },
    { icon: faRocket, tooltip: "Next.js", category: "Frontend" },

    // Backend Development (5 tools)
    { icon: faNode, tooltip: "Node.js", category: "Backend" },
    { icon: faPython, tooltip: "Python", category: "Backend" },
    { icon: faDatabase, tooltip: "PostgreSQL", category: "Backend" },
    { icon: faServer, tooltip: "Express.js", category: "Backend" },
    { icon: faDatabase, tooltip: "Neon Console", category: "Backend" },

    // DevOps & Version Control (5 tools)
    { icon: faGit, tooltip: "Git", category: "DevOps" },
    { icon: faGithub, tooltip: "GitHub", category: "DevOps" },
    { icon: faGitlab, tooltip: "GitLab", category: "DevOps" },
    { icon: faDocker, tooltip: "Docker", category: "DevOps" },
    { icon: faLinux, tooltip: "Linux", category: "DevOps" },

    // Cloud & Infrastructure (5 tools)
    { icon: faAws, tooltip: "AWS", category: "Cloud" },
    { icon: faGoogle, tooltip: "Google Cloud", category: "Cloud" },
    { icon: faMicrosoft, tooltip: "Azure", category: "Cloud" },
    { icon: faFire, tooltip: "Firebase", category: "Cloud" },

    // Package Management (3 tools)
    { icon: faNpm, tooltip: "NPM", category: "Package Management" },
    { icon: faYarn, tooltip: "Yarn", category: "Package Management" },
    { icon: faTerminal, tooltip: "CLI Tools", category: "Package Management" },

    // Collaboration (4 tools)
    { icon: faSlack, tooltip: "Slack", category: "Collaboration" },
    { icon: faDiscord, tooltip: "Discord", category: "Collaboration" },
    { icon: faApple, tooltip: "macOS", category: "Collaboration" },
    { icon: faMobile, tooltip: "Mobile Testing", category: "Collaboration" },

    // Project Management (4 tools)
    { icon: faJira, tooltip: "Jira", category: "Project Management" },
    { icon: faTrello, tooltip: "Trello", category: "Project Management" },
    { icon: faChartLine, tooltip: "Analytics", category: "Project Management" },
    { icon: faBug, tooltip: "Bug Tracking", category: "Project Management" },

    // Documentation & Testing (4 tools)
    { icon: faMarkdown, tooltip: "Markdown", category: "Documentation" },
    { icon: faConfluence, tooltip: "Confluence", category: "Documentation" },
    {
        icon: faTerminal,
        tooltip: "API Documentation",
        category: "Documentation",
    },
    { icon: faBug, tooltip: "Testing & QA", category: "Documentation" },
];

export default tools;