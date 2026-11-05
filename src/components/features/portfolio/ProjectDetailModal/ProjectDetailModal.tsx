"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faFilm,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { faAppStoreIos } from "@fortawesome/free-brands-svg-icons";
import { Project } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";
import ProjectMedia from "../shared/ProjectMedia";
import styles from "./ProjectDetailModal.module.css";

// Minimum horizontal drag (px) to advance to the next/previous project.
const SWIPE_DISTANCE = 40;

// Primary action copy/icon + status chip per project.linkType. Falls back to
// the generic "Open Project" for projects with no explicit linkType.
const LINK_TYPE_META = {
  appstore: { cta: "View on App Store", icon: faAppStoreIos, status: "Live on the App Store" },
  website: { cta: "Visit website", icon: faArrowUpRightFromSquare, status: "Live website" },
  watch: { cta: "Watch now", icon: faPlay, status: "Watch online" },
} as const;

const DEFAULT_META = { cta: "Open project", icon: faArrowUpRightFromSquare, status: null };

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
  // Guards taps/clicks (primary CTA, Deep Dive) from also firing right as a
  // swipe releases over them — same idiom as the coverflow card click guard.
  const lastDragEndAt = useRef(0);

  useGesture(
    {
      onDrag: ({ swipe: [swipeX], movement: [mx, my], last }) => {
        if (!last) return;
        if (Math.abs(mx) > 8 || Math.abs(my) > 8) lastDragEndAt.current = performance.now();
        // @use-gesture's own `swipe` is velocity-gated (a "flick"), so a
        // deliberate drag-past-the-threshold-then-pause reads as swipe [0, 0]
        // even though it moved plenty. Fall back to a plain distance check.
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

  const swipeGuard = (fn: () => void) => () => {
    if (performance.now() - lastDragEndAt.current < 80) return;
    fn();
  };

  const meta = project.linkType ? LINK_TYPE_META[project.linkType] : DEFAULT_META;

  const navButtons = (
    <>
      <button type="button" className={styles.navBtn} onClick={onPrev} aria-label="Previous project">
        <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
      </button>
      <button type="button" className={styles.navBtn} onClick={onNext} aria-label="Next project">
        <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
      </button>
    </>
  );

  return (
    <ModalFrame
      onClose={onBack}
      title={project.name}
      size="lg"
      variant="glass"
      presentation="sheet"
      eyebrow={<>Projects&nbsp;&nbsp;›&nbsp;&nbsp;{project.name}</>}
      headerActions={navButtons}
      titleId="project-detail-title"
      closeAriaLabel="Back to projects"
    >
      <div className={styles.detail} ref={detailRef}>
        <div className={styles.body}>
          <motion.div
            layoutId={`project-media-${project.id}`}
            className={styles.hero}
            aria-hidden="true"
          >
            <ProjectMedia
              project={project}
              iconImageClassName={styles.iconImg}
              heroImageClassName={styles.heroImg}
              faIconClassName={styles.faIcon}
              sizes="(max-width: 768px) 100vw, 430px"
            />
          </motion.div>

          <div className={styles.info}>
            <div className={styles.chips}>
              {project.type === "documentary" && (
                <span className={`${styles.chip} ${styles.chipAccent}`}>
                  <FontAwesomeIcon icon={faFilm} aria-hidden="true" />
                  Documentary
                </span>
              )}
              {meta.status && (
                <span className={`${styles.chip} ${styles.chipAccent}`}>
                  <span className={styles.dot} aria-hidden="true" />
                  {meta.status}
                </span>
              )}
              {project.yearRange && (
                <span className={styles.chip}>{project.yearRange.replace("-", " – ")}</span>
              )}
            </div>

            <div>
              <h2 className={styles.name}>{project.name}</h2>
              <p className={styles.description}>{project.description}</p>
            </div>

            {project.highlights && project.highlights.length > 0 && (
              <section aria-labelledby="project-highlights-heading">
                <h3 id="project-highlights-heading" className={styles.sectionLabel}>
                  What&apos;s inside
                </h3>
                <ul className={styles.highlights}>
                  {project.highlights.map((h) => (
                    <li key={h}>
                      <span className={styles.check} aria-hidden="true">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          {project.stackPreview && project.stackPreview.length > 0 && (
            <ul className={styles.stack} aria-label="Technology stack">
              {project.stackPreview.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          )}
          <div className={styles.actions}>
            {project.deepDiveKey && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={swipeGuard(() => onOpenDeepDive(project.deepDiveKey))}
              >
                Read case study
              </button>
            )}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryBtn}
              onClick={(e) => {
                if (performance.now() - lastDragEndAt.current < 80) e.preventDefault();
              }}
            >
              <FontAwesomeIcon icon={meta.icon} aria-hidden="true" />
              <span>{meta.cta}</span>
            </a>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
};

export default ProjectDetailModal;
