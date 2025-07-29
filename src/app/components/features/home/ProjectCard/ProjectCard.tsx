import React, { useState } from "react";
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
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";
import { projectsData } from "@/data/projects";
import "./ProjectCard.css";

// Map icon string to FontAwesome icon
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const iconMap: Record<string, IconDefinition> = {
  "fas fa-briefcase icon": faBriefcase,
  "fa fa-paw icon": faPaw,
  "fas fa-theater-masks icon": faTheaterMasks,
  "fas fa-robot icon": faRobot,
  "fas fa-music icon": faMusic,
  "fas fa-cookie-bite icon": faCookieBite,
  "fas fa-film icon": faFilm,
};

interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  image?: string;
  link: string;
  onClose: () => void;
  initialIndex?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  image,
  link,
  onClose,
  initialIndex,
}) => {
  const findInitialIndex = () => {
    if (typeof initialIndex === "number") return initialIndex;
    const idx = projectsData.findIndex((p) => p.id === id && p.name === name);
    return idx !== -1 ? idx : 0;
  };

  const [currentIndex, setCurrentIndex] = useState(findInitialIndex());

  const filteredProjects = projectsData.filter((p) => !p.archived);
  const project = filteredProjects[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? filteredProjects.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === filteredProjects.length - 1 ? 0 : prev + 1
    );
  };

  // Determine which icon to use
  const iconToShow =
    project.icon && iconMap[project.icon]
      ? iconMap[project.icon]
      : faLaptopCode;

  let projectVisual: React.ReactNode = null;
  if (project.image) {
    projectVisual = (
      <Image
        src={project.image}
        alt={project.name}
        width={56}
        height={56}
        className="project-card-icon"
      />
    );
  } else if (project.icon) {
    projectVisual = (
      <span
        className="project-card-icon"
        style={{
          fontSize: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesomeIcon icon={iconToShow} />
      </span>
    );
  }

  return (
    <div className="project-card-overlay" onClick={onClose}>
      <div className="project-card" onClick={(e) => e.stopPropagation()}>
        <div className="project-card-title-bar">
          <div className="project-card-window-controls">
            <button
              className="project-card-close-btn"
              onClick={onClose}
              aria-label="Close Project Card"
            />
          </div>
          <div className="project-card-window-title">
            <span className="project-card-url-bar" title={project.link}>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.link}
              </a>
            </span>
          </div>
        </div>
        <div className="project-card-inner">
          {projectVisual}
          <h3 className="project-card-title">{project.name}</h3>
          <p className="project-card-description">{project.description}</p>

          <div className="project-card-bottom-arrows">
            <button
              className="project-card-arrow project-card-arrow-bottom project-card-arrow-left"
              onClick={handlePrev}
              aria-label="Previous Project"
              tabIndex={0}
              type="button"
            >
              &#8592;
            </button>
            <button
              className="project-card-arrow project-card-arrow-bottom project-card-arrow-right"
              onClick={handleNext}
              aria-label="Next Project"
              tabIndex={0}
              type="button"
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
