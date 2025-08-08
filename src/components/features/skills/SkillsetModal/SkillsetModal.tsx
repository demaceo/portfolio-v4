import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import services from "@/data/services";
import principlesData from "@/data/principles";
import "./SkillsetModal.css";
import tools from "@/data/toolbelt";

interface SkillsetModalProps {
  onClose: () => void;
}

const SkillsetModal: React.FC<SkillsetModalProps> = ({ onClose }) => {
  // Drag state
  const [activeTab, setActiveTab] = useState<
    "services" | "tools" | "principles"
  >("services");

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

  // Group tools by category
  const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  return (
    <div
      className="skillset-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="skillset-title"
    >
      <div
        className="skillset-modal"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="document"
      >
        <div className="skillset-modal-title-bar" style={{ cursor: "grab" }}>
          <div className="skillset-modal-window-controls">
            <button
              className="skillset-modal-close-btn"
              onClick={onClose}
              aria-label="Close Skillset Modal"
            />
          </div>
          <span className="skillset-modal-window-title" id="skillset-title">
            Skillset
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
