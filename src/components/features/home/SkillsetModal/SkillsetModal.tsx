import React, { useState, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import services from "@/data/services";
import principlesData from "@/data/principles";
import "./SkillsetModal.css";

interface SkillsetModalProps {
  onClose: () => void;
}

const SkillsetModal: React.FC<SkillsetModalProps> = ({ onClose }) => {
  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "services" | "tools" | "principles"
  >("services");
  const dragOffset = useRef({ x: 0, y: 0 });

  // Center the modal on mount
  React.useEffect(() => {
    const centerX = window.innerWidth / 2 - 500; // modal width / 2
    const centerY = window.innerHeight / 2 - 350; // modal height / 2
    setPosition({ x: Math.max(centerX, 0), y: Math.max(centerY, 0) });
  }, []);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Tools/Technologies data
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

  // Group tools by category
  const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  // Mouse events for drag
  const handleDragStart = (e: React.MouseEvent) => {
    setDragging(true);
    const modal = e.currentTarget.closest(".skillset-modal") as HTMLElement;
    const rect = modal.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.body.style.userSelect = "none";
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleDragEnd = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  // Touch events for drag (mobile support)
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    const modal = e.currentTarget.closest(".skillset-modal") as HTMLElement;
    const rect = modal.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    document.body.style.userSelect = "none";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragOffset.current.x,
      y: touch.clientY - dragOffset.current.y,
    });
  };

  const handleTouchEnd = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  return (
    <div
      className="skillset-modal-overlay"
      onClick={onClose}
      style={{ cursor: dragging ? "grabbing" : undefined }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="skillset-title"
    >
      <div
        className="skillset-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          zIndex: 3000,
          cursor: dragging ? "grabbing" : "default",
          transition: dragging ? "none" : "box-shadow 0.2s",
        }}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={-1}
        role="document"
      >
        <div
          className="skillset-modal-title-bar"
          style={{ cursor: "grab" }}
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchStart}
        >
          <div className="skillset-modal-window-controls">
            <button
              className="skillset-modal-close-btn"
              onClick={onClose}
              aria-label="Close Skillset Modal"
            />
            <div className="skillset-minimize-btn" aria-hidden="true" />
            <div className="skillset-maximize-btn" aria-hidden="true" />
          </div>
          <span className="skillset-modal-window-title" id="skillset-title">
            Skills & Expertise
          </span>
          <div className="skillset-modal-spacer" />
        </div>

        <div className="skillset-modal-content">
          <div className="skillset-modal-tabs" role="tablist">
            <button
              className={`skillset-tab ${
                activeTab === "services" ? "active" : ""
              }`}
              onClick={() => setActiveTab("services")}
              role="tab"
              id="services-tab"
              aria-controls="services-panel"
              aria-selected={activeTab === "services"}
            >
              Services
            </button>
            <button
              className={`skillset-tab ${
                activeTab === "tools" ? "active" : ""
              }`}
              onClick={() => setActiveTab("tools")}
              role="tab"
              id="tools-tab"
              aria-controls="tools-panel"
              aria-selected={activeTab === "tools"}
            >
              Toolbelt
            </button>
            <button
              className={`skillset-tab ${
                activeTab === "principles" ? "active" : ""
              }`}
              onClick={() => setActiveTab("principles")}
              role="tab"
              id="principles-tab"
              aria-controls="principles-panel"
              aria-selected={activeTab === "principles"}
            >
              Principles
            </button>
          </div>

          <div className="skillset-modal-body">
            <AnimatePresence mode="wait">
              {activeTab === "services" && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="skillset-section"
                  role="tabpanel"
                  id="services-panel"
                  aria-labelledby="services-tab"
                >
                  <h2>Service Spectrum</h2>
                  <div className="services-grid">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="service-card"
                        role="article"
                        tabIndex={0}
                      >
                        <div className="service-card-content">
                          <div className="service-icon">
                            <Image
                              src={service.icon}
                              alt={service.title}
                              width={40}
                              height={40}
                            />
                          </div>
                          <h3>{service.title}</h3>
                          <p>{service.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "tools" && (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="skillset-section"
                  role="tabpanel"
                  id="tools-panel"
                  aria-labelledby="tools-tab"
                >
                  <h2>Technical Toolbelt</h2>
                  <div className="tools-categories">
                    {Object.entries(toolsByCategory).map(
                      ([category, categoryTools]) => (
                        <div key={category} className="tool-category">
                          <h3>{category}</h3>
                          <div className="tools-grid">
                            {categoryTools.map((tool, index) => (
                              <div
                                key={`${category}-${index}`}
                                className="tool-item"
                                title={tool.tooltip}
                              >
                                <FontAwesomeIcon icon={tool.icon} />
                                <span>{tool.tooltip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "principles" && (
                <motion.div
                  key="principles"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="skillset-section"
                  role="tabpanel"
                  id="principles-panel"
                  aria-labelledby="principles-tab"
                >
                  <h2>Principles & Strategies</h2>
                  <div className="principles-list">
                    {principlesData.map((principle) => (
                      <div key={principle.id} className="principle-item">
                        <div className="principle-header">
                          <h3>{principle.title}</h3>
                          <p className="principle-description">
                            {principle.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsetModal;
