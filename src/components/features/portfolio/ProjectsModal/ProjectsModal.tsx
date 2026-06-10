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
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { projectsData } from "@/data/projects";
import "./ProjectsModal.css";
import { ModalProps, Project } from "@/lib/types";
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

const isImageIcon = (icon?: string) => {
  if (!icon) return false;
  return (
    (icon.startsWith("/") || icon.startsWith("http")) &&
    /\.(png|jpe?g|webp|svg)$/i.test(icon)
  );
};

const isGifSource = (source?: string) => {
  if (!source) return false;
  return /\.gif($|\?)/i.test(source);
};

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 56 : -56,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -56 : 56,
  }),
};

const ProjectsModal: React.FC<ModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"current" | "archived">("current");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showResumeHighlights, setShowResumeHighlights] = useState(false);
  const [resumeHighlightsProjectKey, setResumeHighlightsProjectKey] = useState<
    string | undefined
  >(undefined);

  const activeProjects = projectsData.filter((p) => !p.archived);
  const archivedProjects = projectsData.filter((p) => p.archived);
  const projects = activeTab === "current" ? activeProjects : archivedProjects;
  const project = projects[currentIndex];

  const handleTabChange = (tab: "current" | "archived") => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setCurrentIndex(0);
    setDirection(1);
  };

  const navigate = (dir: 1 | -1) => {
    if (projects.length <= 1) return;
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + projects.length) % projects.length);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleOpenResumeHighlights = (projectKey?: string) => {
    setResumeHighlightsProjectKey(projectKey);
    setShowResumeHighlights(true);
  };

  const renderGalleryMedia = (proj: Project) => {
    const iconIsImage = isImageIcon(proj.icon);
    const imageStr = typeof proj.image === "string" ? proj.image : undefined;

    if (iconIsImage && !imageStr) {
        <Image
          src={proj.icon as string}
          alt={`${proj.name} icon`}
          width={200}
          height={200}
          className="gallery-icon-img"
          loading="lazy"
        />
      );
    }

    if (imageStr) {
      return (
        <Image
          src={imageStr}
          alt={proj.name}
          fill
          className="gallery-hero-img"
          loading="lazy"
          unoptimized={isGifSource(imageStr)}
          sizes="(max-width: 640px) 100vw, 42vw"
        />
      );
    }

    return (
      <div className="gallery-fa-icon" aria-hidden="true">
        <FontAwesomeIcon
          icon={iconMap[proj.icon as string] || faBriefcase}
          aria-hidden="true"
        />
      </div>
    );
  };

  if (!project) return null;

  return (
    <>
      <ModalFrame
        onClose={onClose}
        title="Projects"
        size="lg"
        titleId="projects-title"
        closeAriaLabel="Close projects modal"
      >
        <div className="projects-gallery">
          {/* Top bar: tabs + resume link */}
          <div className="gallery-topbar">
            <div className="gallery-tabs" role="tablist" aria-label="Project categories">
              <button
                className={`gallery-tab ${activeTab === "current" ? "active" : ""}`}
                onClick={() => handleTabChange("current")}
                role="tab"
                aria-selected={activeTab === "current"}
                type="button"
              >
                Recent ({activeProjects.length})
              </button>
              {archivedProjects.length > 0 && (
                <button
                  className={`gallery-tab ${activeTab === "archived" ? "active" : ""}`}
                  onClick={() => handleTabChange("archived")}
                  role="tab"
                  aria-selected={activeTab === "archived"}
                  type="button"
                >
                  Archived ({archivedProjects.length})
                </button>
              )}
            </div>

            <button
              type="button"
              className="gallery-resume-btn"
              onClick={() => handleOpenResumeHighlights()}
            >
              Full Resume Highlights
            </button>
          </div>

          {/* Gallery stage */}
          <div className="gallery-stage" aria-live="polite" aria-atomic="false">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${activeTab}-${currentIndex}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="gallery-card"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.08}
                onDragEnd={(_, { offset, velocity }) => {
                  const power = Math.abs(offset.x) + Math.abs(velocity.x) * 0.25;
                  if (power > 70) navigate(offset.x > 0 ? -1 : 1);
                }}
              >
                {/* Left: visual */}
                <div className="gallery-media" aria-hidden="true">
                  {renderGalleryMedia(project)}
                  <div className="gallery-media-vignette" />
                </div>

                {/* Right: info */}
                <div className="gallery-info">
                  <div className="gallery-counter" aria-label={`Project ${currentIndex + 1} of ${projects.length}`}>
                    <span className="counter-current">{String(currentIndex + 1).padStart(2, "0")}</span>
                    <span className="counter-sep"> / </span>
                    <span className="counter-total">{String(projects.length).padStart(2, "0")}</span>
                  </div>

                  {project.type === "documentary" && (
                    <div className="gallery-doc-tag" aria-label="Documentary">
                      <FontAwesomeIcon icon={faFilm} aria-hidden="true" />
                      <span>Documentary</span>
                    </div>
                  )}

                  <h2 className="gallery-project-name">{project.name}</h2>

                  {project.yearRange && (
                    <p className="gallery-year" aria-label={`Year range: ${project.yearRange}`}>
                      {project.yearRange}
                    </p>
                  )}

                  <p className="gallery-description">{project.description}</p>

                  {project.stackPreview && project.stackPreview.length > 0 && (
                    <div className="gallery-stack" aria-label="Technology stack">
                      {project.stackPreview.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  )}

                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="gallery-highlights" aria-label="Project highlights">
                      {project.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}

                  <div className="gallery-actions">
                    <button
                      type="button"
                      className="gallery-open-btn"
                      onClick={() => window.open(project.link, "_blank", "noopener,noreferrer")}
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} aria-hidden="true" />
                      <span>Open Project</span>
                    </button>

                    {project.deepDiveKey && (
                      <button
                        type="button"
                        className="gallery-dive-btn"
                        onClick={() => handleOpenResumeHighlights(project.deepDiveKey)}
                      >
                        Resume Deep Dive
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav: arrows + dots */}
          <div className="gallery-nav-bar">
            <button
              type="button"
              className="gallery-nav-arrow"
              onClick={() => navigate(-1)}
              disabled={projects.length <= 1}
              aria-label="Previous project"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <div className="gallery-dots" role="tablist" aria-label="Project navigation dots">
              {projects.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`Go to project ${i + 1}: ${projects[i].name}`}
                  className={`gallery-dot ${i === currentIndex ? "active" : ""}`}
                  onClick={() => handleDotClick(i)}
                />
              ))}
            </div>

            <button
              type="button"
              className="gallery-nav-arrow"
              onClick={() => navigate(1)}
              disabled={projects.length <= 1}
              aria-label="Next project"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
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
