import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faPaw,
  faTheaterMasks,
  faRobot,
  faMusic,
  faCookieBite,
  faFilm,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { projectsData } from "@/data/projects";
import "./ProjectsModal.css";
import { ModalProps } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";

const iconMap: Record<string, typeof faBriefcase> = {
  "fas fa-briefcase icon": faBriefcase,
  "fa fa-paw icon": faPaw,
  "fas fa-theater-masks icon": faTheaterMasks,
  "fas fa-robot icon": faRobot,
  "fas fa-music icon": faMusic,
  "fas fa-cookie-bite icon": faCookieBite,
  "fas fa-film icon": faFilm,
};

const ProjectsModal: React.FC<ModalProps> = ({ onClose }) => {
  // Drag state
  const [activeTab, setActiveTab] = useState<"current" | "archived">("current");

  // Separate projects by active/archived status
  const activeProjects = projectsData.filter((p) => !p.archived);
  const archivedProjects = projectsData.filter((p) => p.archived);


  const handleProjectClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <ModalFrame
      onClose={onClose}
      title="Projects"
      size="md"
      titleId="projects-title"
      closeAriaLabel="Close projects modal"
    >
      <div className="projects-modal-content">
        <div className="projects-modal-tabs" role="tablist">
          <button
            className={`projects-tab ${
              activeTab === "current" ? "active" : ""
            }`}
            onClick={() => setActiveTab("current")}
            role="tab"
            id="current-tab"
            aria-controls="current-panel"
            aria-selected={activeTab === "current"}
          >
            Recent ({activeProjects.length})
          </button>
          {archivedProjects.length > 0 && (
            <button
              className={`projects-tab ${
                activeTab === "archived" ? "active" : ""
              }`}
              onClick={() => setActiveTab("archived")}
              role="tab"
              id="archived-tab"
              aria-controls="archived-panel"
              aria-selected={activeTab === "archived"}
            >
              Archived ({archivedProjects.length})
            </button>
          )}
        </div>

        <div className="projects-modal-body">
          <AnimatePresence mode="wait">
            {activeTab === "current" && (
              <motion.div
                key="current"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="projects-section"
                role="tabpanel"
                id="current-panel"
                aria-labelledby="current-tab"
              >
                <h2>Recent Projects</h2>
                <div
                  className="projects-grid"
                  role="group"
                  aria-label="Current projects"
                >
                  {activeProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="projects-modal-card"
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${project.name} project - ${project.description}`}
                      aria-describedby={`project-desc-${project.id}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + index * 0.05,
                        ease: "easeOut",
                      }}
                      onClick={() => handleProjectClick(project.link)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProjectClick(project.link);
                        }
                      }}
                    >
                      {/* Documentary Tag */}
                      {project.type === "documentary" && (
                        <div className="projects-modal-documentary-tag">
                          <FontAwesomeIcon icon={faFilm} className="documentary-icon" />
                          <span>Documentary</span>
                        </div>
                      )}
                      
                      <div className="projects-modal-card-content">
                        <div className="project-media">
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt={`Screenshot of ${project.name} project`}
                              width={300}
                              height={180}
                              className="project-image"
                              loading="lazy"
                              unoptimized={
                                typeof project.image === "string" &&
                                project.image.includes(".gif")
                              }
                            />
                          ) : project.icon ? (
                            <div
                              className="project-icon-container"
                              aria-hidden="true"
                            >
                              <FontAwesomeIcon
                                icon={iconMap[project.icon] || faBriefcase}
                                className="project-icon"
                                aria-hidden="true"
                              />
                            </div>
                          ) : (
                            <div
                              className="project-icon-container"
                              aria-hidden="true"
                            >
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="project-icon"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                          <div className="project-overlay" aria-hidden="true">
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              className="external-link-icon"
                              aria-hidden="true"
                            />
                            <span>View Project</span>
                          </div>
                        </div>
                        <div className="project-info">
                          <h3 id={`project-title-${project.id}`}>
                            {project.name}
                          </h3>
                          <p id={`project-desc-${project.id}`}>
                            {project.description}
                          </p>
                        
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "archived" && archivedProjects.length > 0 && (
              <motion.div
                key="archived"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="projects-section"
                role="tabpanel"
                id="archived-panel"
                aria-labelledby="archived-tab"
              >
                <h2>Archived Projects</h2>
                <div className="projects-grid">
                  {archivedProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="projects-modal-card archived"
                      role="button"
                      tabIndex={0}
                      aria-label={`Open archived ${project.name} project - ${project.description}`}
                      aria-describedby={`archived-project-desc-${project.id}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + index * 0.05,
                        ease: "easeOut",
                      }}
                      onClick={() => handleProjectClick(project.link)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProjectClick(project.link);
                        }
                      }}
                    >
                      {/* Documentary Tag */}
                      {project.type === "documentary" && (
                        <div className="projects-modal-documentary-tag">
                          <FontAwesomeIcon icon={faFilm} className="documentary-icon" />
                          <span>Documentary</span>
                        </div>
                      )}
                      
                      <div className="projects-modal-card-content">
                        <div className="project-media">
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt={project.name}
                              width={300}
                              height={180}
                              className="project-image"
                              loading="lazy"
                              unoptimized={
                                typeof project.image === "string" &&
                                project.image.includes(".gif")
                              }
                            />
                          ) : project.icon ? (
                            <div className="project-icon-container">
                              <FontAwesomeIcon
                                icon={iconMap[project.icon] || faBriefcase}
                                className="project-icon"
                              />
                            </div>
                          ) : (
                            <div className="project-icon-container">
                              <FontAwesomeIcon
                                icon={faBriefcase}
                                className="project-icon"
                              />
                            </div>
                          )}
                          <div className="project-overlay">
                            <FontAwesomeIcon
                              icon={faExternalLinkAlt}
                              className="external-link-icon"
                            />
                            <span>View Project</span>
                          </div>
                        </div>
                        <div className="project-info">
                          <h3>{project.name}</h3>
                          <p>{project.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ModalFrame>
  );
};

export default ProjectsModal;
