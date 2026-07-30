"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faFilm } from "@fortawesome/free-solid-svg-icons";
import { Project } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";
import ProjectMedia from "../shared/ProjectMedia";
import styles from "./ProjectDetailModal.module.css";

// Minimum horizontal drag (px) to advance to the next/previous project.
const SWIPE_DISTANCE = 40;

interface ProjectDetailModalProps {
  project: Project;
  onBack: () => void;
  onOpenDeepDive: (deepDiveKey?: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onBack,
  onOpenDeepDive,
  onNext,
  onPrev,
}) => {
  const detailRef = useRef<HTMLDivElement>(null);
  // Guards taps/clicks (Open Project, Resume Deep Dive) from also firing
  // right as a swipe releases over them — same idiom as the coverflow
  // carousel's card click guard.
  const lastDragEndAt = useRef(0);

  useGesture(
    {
      onDrag: ({ swipe: [swipeX], movement: [mx, my], last }) => {
        if (!last) return;
        if (Math.abs(mx) > 8 || Math.abs(my) > 8) lastDragEndAt.current = performance.now();
        // @use-gesture's own `swipe` is velocity-gated (a "flick"), so a
        // deliberate drag-past-the-threshold-then-pause-before-lifting
        // reads as swipe [0, 0] even though it moved plenty. Fall back to a
        // plain distance check so that release still navigates.
        if (swipeX === -1 || (swipeX === 0 && mx <= -SWIPE_DISTANCE)) onNext();
        else if (swipeX === 1 || (swipeX === 0 && mx >= SWIPE_DISTANCE)) onPrev();
      },
    },
    {
      target: detailRef,
      eventOptions: { passive: true },
      drag: { axis: "x", filterTaps: true, swipe: { distance: SWIPE_DISTANCE, velocity: 0.3 } },
    }
  );

  const guardedOpenProject = () => {
    if (performance.now() - lastDragEndAt.current < 80) return;
    window.open(project.link, "_blank", "noopener,noreferrer");
  };

  const guardedOpenDeepDive = () => {
    if (performance.now() - lastDragEndAt.current < 80) return;
    onOpenDeepDive(project.deepDiveKey);
  };

  return (
    <ModalFrame
      onClose={onBack}
      title={project.name}
      size="lg"
      variant="light"
      titleId="project-detail-title"
      closeAriaLabel="Back to projects"
    >
      <div className={styles.detail} ref={detailRef}>
        <motion.div
          layoutId={`project-media-${project.id}`}
          className={styles.media}
          aria-hidden="true"
        >
          <ProjectMedia
            project={project}
            iconImageClassName={styles.iconImg}
            heroImageClassName={styles.heroImg}
            faIconClassName={styles.faIcon}
            sizes="(max-width: 640px) 100vw, 42vw"
          />
          <div className={styles.vignette} aria-hidden="true" />
        </motion.div>

        <div className={styles.info}>
          {project.type === "documentary" && (
            <div className={styles.docTag} aria-label="Documentary">
              <FontAwesomeIcon icon={faFilm} aria-hidden="true" />
              <span>Documentary</span>
            </div>
          )}

          <h2 className={styles.name}>{project.name}</h2>

          {project.yearRange && (
            <p className={styles.year} aria-label={`Year range: ${project.yearRange}`}>
              {project.yearRange}
            </p>
          )}

          <p className={styles.description}>{project.description}</p>

          {project.stackPreview && project.stackPreview.length > 0 && (
            <div className={styles.stack} aria-label="Technology stack">
              {project.stackPreview.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <ul className={styles.highlights} aria-label="Project highlights">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.openBtn} onClick={guardedOpenProject}>
              <FontAwesomeIcon icon={faExternalLinkAlt} aria-hidden="true" />
              <span>Open Project</span>
            </button>

            {project.deepDiveKey && (
              <button type="button" className={styles.diveBtn} onClick={guardedOpenDeepDive}>
                Resume Deep Dive
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalFrame>
  );
};

export default ProjectDetailModal;
