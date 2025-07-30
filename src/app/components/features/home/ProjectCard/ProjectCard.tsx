import React, { useState, useRef } from "react";
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

const CARD_WIDTH = 420; // match your CSS max-width
const CARD_HEIGHT = 380; // estimate or measure your card height

interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  image?: string;
  link: string;
  onClose: () => void;
  initialIndex?: number;
  gif?: string;
  icon?: string;
  archived?: boolean;
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

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Center the card on mount
  React.useEffect(() => {
    const centerX = window.innerWidth / 2 - CARD_WIDTH / 2;
    const centerY = window.innerHeight / 2 - CARD_HEIGHT / 2;
    setPosition({ x: Math.max(centerX, 0), y: Math.max(centerY, 0) });
    // eslint-disable-next-line
  }, []);

  // Mouse events for drag
  const handleDragStart = (e: React.MouseEvent) => {
    setDragging(true);
    const card = e.currentTarget.closest(".project-card") as HTMLElement;
    const rect = card.getBoundingClientRect();
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
    const card = e.currentTarget.closest(".project-card") as HTMLElement;
    const rect = card.getBoundingClientRect();
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

  // Determine which icon to use
  const iconToShow =
    project.icon && iconMap[project.icon]
      ? iconMap[project.icon]
      : faLaptopCode;

  let projectVisual: React.ReactNode = null;
  if (project.image) {
    projectVisual = (
      <Image
        src={project.gif || ""}
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
    <div
      className="project-card-overlay"
      onClick={onClose}
      style={{ cursor: dragging ? "grabbing" : undefined }}
    >
      <div
        className="project-card"
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
      >
        <div
          className="project-card-title-bar"
          style={{ cursor: "grab" }}
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchStart}
        >
          <div className="project-card-window-controls">
            <button
              className="project-card-close-btn"
              onClick={onClose}
              aria-label="Close Project Card"
            />
          </div>
          {/* <div className="project-card-window-title">
            <span className="project-card-url-bar" title={project.link}>
            <a
              className="project-card-url-bar"
              title={project.link}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.link}
            </a>
            </span>
          </div> */}
        </div>
        <div className="project-card-inner">
          <div className="project-card-window-title">
            {/* <span className="project-card-url-bar" title={project.link}> */}
              <div className="project-card-top-arrows">
                <button
                  className="project-card-arrow project-card-arrow-top project-card-arrow-left"
                  onClick={handlePrev}
                  aria-label="Previous Project"
                  tabIndex={0}
                  type="button"
                >
                  &#8592;
                </button>
                <button
                  className="project-card-arrow project-card-arrow-top project-card-arrow-right"
                  onClick={handleNext}
                  aria-label="Next Project"
                  tabIndex={0}
                  type="button"
                >
                  &#8594;
                </button>
              </div>
              <a
                className="project-card-url-bar"
                title={project.link}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.link}
              </a>
            {/* </span> */}
          </div>
          {projectVisual}
          {/* <h3 className="project-card-title">{project.name}</h3> */}
          <p className="project-card-description">{project.description}</p>
          {/* <div className="project-card-top-arrows">
            <button
              className="project-card-arrow project-card-arrow-top project-card-arrow-left"
              onClick={handlePrev}
              aria-label="Previous Project"
              tabIndex={0}
              type="button"
            >
              &#8592;
            </button>
            <button
              className="project-card-arrow project-card-arrow-top project-card-arrow-right"
              onClick={handleNext}
              aria-label="Next Project"
              tabIndex={0}
              type="button"
            >
              &#8594;
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
