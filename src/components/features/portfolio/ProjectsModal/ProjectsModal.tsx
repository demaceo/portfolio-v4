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
import ResumeHighlightsModal from "../ResumeHighlightsModal/ResumeHighlightsModal";

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
  const [showResumeHighlights, setShowResumeHighlights] = useState(false);
  const [resumeHighlightsProjectKey, setResumeHighlightsProjectKey] = useState<
    string | undefined
  >(undefined);

  // Separate projects by active/archived status
  const activeProjects = projectsData.filter((p) => !p.archived);
  const archivedProjects = projectsData.filter((p) => p.archived);


  const handleProjectClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleOpenResumeHighlights = (projectKey?: string) => {
    setResumeHighlightsProjectKey(projectKey);
    setShowResumeHighlights(true);
  };

  return (
    <>
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

        <div className="projects-resume-entry">
          <button
            type="button"
            className="projects-resume-entry-btn"
            onClick={() => handleOpenResumeHighlights()}
          >
            Open Full Resume Highlights
          </button>
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
                      role="article"
                      aria-label={`${project.name} project summary`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + index * 0.05,
                        ease: "easeOut",
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
                        </div>
                        <div className="project-info">
                          <h3 id={`project-title-${project.id}`}>
                            {project.name}
                          </h3>
                          {project.yearRange && (
                            <p className="project-year-range">{project.yearRange}</p>
                          )}
                          <p id={`project-desc-${project.id}`}>
                            {project.description}
                          </p>

                          {project.stackPreview && project.stackPreview.length > 0 && (
                            <div className="project-stack-preview">
                              {project.stackPreview.map((stackItem) => (
                                <span key={`${project.id}-${stackItem}`}>
                                  {stackItem}
                                </span>
                              ))}
                            </div>
                          )}

                          {project.highlights && project.highlights.length > 0 && (
                            <ul className="project-highlights">
                              {project.highlights.map((highlight) => (
                                <li key={`${project.id}-${highlight}`}>{highlight}</li>
                              ))}
                            </ul>
                          )}

                          {project.deepDiveKey && (
                            <div className="project-actions">
                              <button
                                type="button"
                                className="project-open-btn"
                                onClick={() => handleProjectClick(project.link)}
                              >
                                <FontAwesomeIcon
                                  icon={faExternalLinkAlt}
                                  className="external-link-icon"
                                  aria-hidden="true"
                                />
                                <span>Open Project</span>
                              </button>
                              <button
                                type="button"
                                className="project-deep-dive-btn"
                                onClick={() =>
                                  handleOpenResumeHighlights(project.deepDiveKey)
                                }
                              >
                                View Resume Deep Dive
                              </button>
                            </div>
                          )}

                          {!project.deepDiveKey && (
                            <div className="project-actions">
                              <button
                                type="button"
                                className="project-open-btn"
                                onClick={() => handleProjectClick(project.link)}
                              >
                                <FontAwesomeIcon
                                  icon={faExternalLinkAlt}
                                  className="external-link-icon"
                                  aria-hidden="true"
                                />
                                <span>Open Project</span>
                              </button>
                            </div>
                          )}
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
                      role="article"
                      aria-label={`Archived project: ${project.name}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + index * 0.05,
                        ease: "easeOut",
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
                        </div>
                        <div className="project-info">
                          <h3>{project.name}</h3>
                          <p>{project.description}</p>
                          <div className="project-actions">
                            <button
                              type="button"
                              className="project-open-btn"
                              onClick={() => handleProjectClick(project.link)}
                            >
                              <FontAwesomeIcon
                                icon={faExternalLinkAlt}
                                className="external-link-icon"
                                aria-hidden="true"
                              />
                              <span>Open Project</span>
                            </button>
                          </div>
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

      {showResumeHighlights && (
        <ResumeHighlightsModal
          onClose={() => {
            setShowResumeHighlights(false);
            setResumeHighlightsProjectKey(undefined);
          }}
          initialProjectKey={resumeHighlightsProjectKey}
        />
      )}
    </>
  );
};

export default ProjectsModal;
