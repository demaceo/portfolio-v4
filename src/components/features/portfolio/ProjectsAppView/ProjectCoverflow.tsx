"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Project } from "@/lib/types";
import ProjectMedia from "../shared/ProjectMedia";
import styles from "./ProjectCoverflow.module.css";

interface ProjectCoverflowProps {
  projects: Project[];
  onOpen: (id: number) => void;
  initialProjectId?: number;
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

// Shortest signed distance from `index` to `activeIndex` around the loop, so
// e.g. the last slide sits at delta -1 (just left of center) when index 0 is
// active, instead of trailing off at the far right.
function wrappedDelta(index: number, activeIndex: number, length: number) {
  let delta = index - activeIndex;
  const half = length / 2;
  if (delta > half) delta -= length;
  if (delta < -half) delta += length;
  return delta;
}

const ProjectCoverflow: React.FC<ProjectCoverflowProps> = ({
  projects,
  onOpen,
  initialProjectId,
}) => {
  const [activeIndex, setActiveIndex] = useState(() => {
    const found = projects.findIndex((p) => p.id === initialProjectId);
    return found >= 0 ? found : 0;
  });
  const reduceMotion = !!useReducedMotion();
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (projects.length === 0) return null;

  const goTo = (index: number, focus = false) => {
    const next = wrapIndex(index, projects.length);
    setActiveIndex(next);
    if (focus) cardRefs.current[next]?.focus();
  };

  const selectOrOpen = (index: number, project: Project) => {
    if (index === activeIndex) {
      onOpen(project.id);
    } else {
      goTo(index);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1, true);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(projects.length - 1, true);
    }
  };

  return (
    <div
      className={styles.coverflow}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.inner}>
        <div className={styles.viewport}>
          {projects.map((project, i) => (
            <CoverflowSlide
              key={project.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              project={project}
              index={i}
              delta={wrappedDelta(i, activeIndex, projects.length)}
              reduceMotion={reduceMotion}
              onSelectOrOpen={() => selectOrOpen(i, project)}
            />
          ))}
        </div>

        <div className={styles.navBar}>
          <button
            type="button"
            className={styles.navArrow}
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous project"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div className={styles.dots}>
            {projects.map((project, i) => (
              <button
                key={project.id}
                type="button"
                className={i === activeIndex ? styles.dotActive : styles.dot}
                onClick={() => goTo(i)}
                aria-label={`Go to ${project.name}`}
                aria-current={i === activeIndex || undefined}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.navArrow}
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next project"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface CoverflowSlideProps {
  project: Project;
  index: number;
  /** Shortest-path signed offset from the active slide (0 = active, ±1 = neighbor, ...). */
  delta: number;
  reduceMotion: boolean;
  onSelectOrOpen: () => void;
}

/* Every slide shares the same base position (its own perspective-wrapped
   box, absolutely stacked in .viewport) and is moved into its slot purely
   via `x`/`rotateY`/`scale` on `delta`. Positioning by wrapped delta (rather
   than a shared strip translated by activeIndex) is what makes the loop
   continuous: wrapping from the last slide back to the first only ever
   moves neighboring slides by one step, never jump-cuts across the whole
   strip. */
const CoverflowSlide = React.forwardRef<HTMLButtonElement, CoverflowSlideProps>(
  ({ project, index, delta, reduceMotion, onSelectOrOpen }, ref) => {
    const isActive = delta === 0;
    const isDoc = project.type === "documentary";

    return (
      <div className={styles.perspectiveWrap} style={{ zIndex: 100 - Math.abs(delta) }}>
        <motion.button
          ref={ref}
          type="button"
          className={[styles.card, isDoc && styles.cardDoc, isActive && styles.cardActive]
            .filter(Boolean)
            .join(" ")}
          animate={
            reduceMotion
              ? { x: `${delta * 100}%`, rotateY: 0, scale: isActive ? 1 : 0.94 }
              : { x: `${delta * 100}%`, rotateY: -delta * 60, scale: isActive ? 1 : 0.85 }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  x: { type: "spring", bounce: 0.2, duration: 0.8 },
                  rotateY: { type: "spring", bounce: 0.1, duration: 1 },
                  scale: { type: "spring", bounce: 0.1, duration: 1 },
                }
          }
          onClick={onSelectOrOpen}
          aria-current={isActive || undefined}
          aria-label={`${project.name}${project.yearRange ? `, ${project.yearRange}` : ""}${
            isActive ? "" : " — select to view"
          }`}
          tabIndex={isActive ? 0 : -1}
        >
          <div className={styles.cardInner}>
            <motion.div
              layoutId={`project-media-${project.id}`}
              className={styles.preview}
              aria-hidden="true"
            >
              <ProjectMedia
                project={project}
                iconImageClassName={styles.iconImg}
                heroImageClassName={styles.heroImg}
                faIconClassName={styles.faIcon}
                sizes="(max-width: 640px) 55vw, 200px"
              />
            </motion.div>
            <div className={styles.content}>
              <span className={styles.number}>
                {project.yearRange ?? String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.desc}>
                <h3 className={styles.name}>{project.name}</h3>
                {project.stackPreview && project.stackPreview.length > 0 && (
                  <p className={styles.stack}>{project.stackPreview.slice(0, 3).join(" · ")}</p>
                )}
                {isActive && <span className={styles.viewHint}>View project →</span>}
              </div>
            </div>
          </div>
        </motion.button>
      </div>
    );
  }
);

CoverflowSlide.displayName = "CoverflowSlide";

export default ProjectCoverflow;
