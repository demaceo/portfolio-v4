import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  // faTerminal,
  // faDatabase,
  // faCode,
  // faRocket,
  // faLeaf,
} from "@fortawesome/free-brands-svg-icons";
import "./Toolbelt.css";

export default function Toolbelt() {
  const icons = [
    { icon: faFigma, tooltip: "Figma" },
    { icon: faWebflow, tooltip: "Webflow" },
    { icon: faGit, tooltip: "Git" },
    { icon: faNode, tooltip: "Node.js" },
    { icon: faReact, tooltip: "React" },
    { icon: faJs, tooltip: "JavaScript" },
    { icon: faCss3, tooltip: "CSS" },
    { icon: faHtml5, tooltip: "HTML5" },
    { icon: faGithub, tooltip: "GitHub" },
    { icon: faNpm, tooltip: "NPM" },
    { icon: faPython, tooltip: "Python" },
    { icon: faAws, tooltip: "AWS" },
    { icon: faDocker, tooltip: "Docker" },
    { icon: faLinux, tooltip: "Linux" },
    { icon: faSlack, tooltip: "Slack" },
    { icon: faJira, tooltip: "Jira" },
    { icon: faMarkdown, tooltip: "Markdown" },
  ];

  return (
    <div className="ticker-container">
      <div className="ticker-track">
        {/* First set of icons */}
        <div className="ticker-content">
          {icons.map((item) => (
            <div
              key={`first-${item.tooltip}`}
              className="icon-wrapper"
              data-tooltip={item.tooltip}
            >
              <FontAwesomeIcon icon={item.icon} />
            </div>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="ticker-content">
          {icons.map((item) => (
            <div
              key={`second-${item.tooltip}`}
              className="icon-wrapper"
              data-tooltip={item.tooltip}
            >
              <FontAwesomeIcon icon={item.icon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
