"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
import ProjectMedia, { getProjectMediaKind } from "../shared/ProjectMedia";
import styles from "./ProjectDetailModal.module.css";

// Minimum horizontal drag (px) to advance to the next/previous project.
const SWIPE_DISTANCE = 40;

// Primary action copy/icon + status chip per project.linkType. Falls back to
// the generic "Open project" for projects with no explicit linkType.
const LINK_TYPE_META = {
  appstore: { cta: "View on App Store", icon: faAppStoreIos, status: "Live on the App Store" },
  website: { cta: "Visit website", icon: faArrowUpRightFromSquare, status: "Live website" },
  watch: { cta: "Watch now", icon: faPlay, status: "Watch online" },
} as const;

const DEFAULT_META = { cta: "Open project", icon: faArrowUpRightFromSquare, status: null };

const pad2 = (n: number) => String(n).padStart(2, "0");

// Hostname shown in the faux browser bar around screenshot-style media.
const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

interface ProjectDetailModalProps {
  project: Project;
  /** The list the project was opened from (drives the counter and dots). */
  projects: Pick<Project, "id" | "name">[];
  onBack: () => void;
  onOpenDeepDive: (deepDiveKey?: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (id: number) => void;
}

/**
 * One project as a "plate", modeled on the Skillset > Services slides: the
 * artwork is oversized and bleeds off the top-right corner, the copy column
 * sits on the left (counter, title, description, highlights, stack), and a
 * bottom bar carries prev/dots/next plus the actions. Screenshot-style media
 * gets a tilted browser frame instead of the bare illustration treatment.
 */
const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  projects,
  onBack,
  onOpenDeepDive,
  onNext,
  onPrev,
  onSelect,
}) => {
  const detailRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // Guards taps/clicks (primary CTA, case study, dots) from also firing right
  // as a swipe releases over them: same idiom as the coverflow card guard.
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

  // ←/→ anywhere inside the modal move between projects, like the Services
  // carousel. Ignored while typing or when a modifier is held.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onPrev();
    }
  };

  const meta = project.linkType ? LINK_TYPE_META[project.linkType] : DEFAULT_META;
  const mediaKind = getProjectMediaKind(project);
  const index = projects.findIndex((p) => p.id === project.id);
  const hasSiblings = projects.length > 1 && index !== -1;
  const enter = reduceMotion ? false : { opacity: 0, y: 10 };

  return (
    <ModalFrame
      onClose={onBack}
      title={project.name}
      size="lg"
      eyebrow={<>Projects&nbsp;&nbsp;›&nbsp;&nbsp;{project.name}</>}
      titleId="project-detail-title"
      closeAriaLabel="Back to projects"
    >
      <div className={styles.detail} ref={detailRef} onKeyDown={onKeyDown}>
        <div className={styles.plate} data-media={mediaKind}>
          {/* framer-motion owns this element's transform (shared layoutId
              with the coverflow card), so it's positioned with offsets only.
              The tilt and drift live on .artInner. Decorative: the title
              names the project. */}
          <motion.div
            layoutId={`project-media-${project.id}`}
            className={styles.art}
            aria-hidden="true"
          >
            <motion.div
              key={project.id}
              className={styles.artInner}
              initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {mediaKind === "image" ? (
                <div className={styles.browser}>
                  <div className={styles.browserBar}>
                    <span className={styles.browserDots}>
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className={styles.browserUrl}>{hostOf(project.link)}</span>
                  </div>
                  <div className={styles.browserView}>
                    <ProjectMedia
                      project={project}
                      heroImageClassName={styles.screenshot}
                      sizes="(max-width: 768px) 90vw, 560px"
                      decorative
                    />
                  </div>
                </div>
              ) : (
                <ProjectMedia
                  project={project}
                  iconImageClassName={styles.illustration}
                  faIconClassName={styles.glyph}
                  applyIconScale
                  decorative
                />
              )}
            </motion.div>
          </motion.div>

          {/* Focusable so keyboard users can scroll a long copy column. */}
          <div
            className={styles.scroll}
            tabIndex={0}
            role="region"
            aria-label={`${project.name} details`}
          >
            <motion.div
              key={project.id}
              className={styles.copy}
              initial={enter}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {hasSiblings && (
                <span
                  className={styles.counter}
                  aria-label={`Project ${index + 1} of ${projects.length}`}
                >
                  <span className={styles.counterCurrent}>{pad2(index + 1)}</span>
                  <span className={styles.counterTotal}> / {pad2(projects.length)}</span>
                </span>
              )}

              <h2 className={styles.name}>{project.name}</h2>

              {(meta.status || project.yearRange || project.type === "documentary") && (
                <div className={styles.meta}>
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
                    <span className={styles.chip}>{project.yearRange.replace("-", "–")}</span>
                  )}
                  {project.network && <span className={styles.chip}>{project.network}</span>}
                  {project.duration && <span className={styles.chip}>{project.duration}</span>}
                </div>
              )}

              <p className={styles.description}>{project.description}</p>

              {project.highlights && project.highlights.length > 0 && (
                <section className={styles.section} aria-labelledby="project-highlights-heading">
                  <h3 id="project-highlights-heading" className={styles.eyebrow}>
                    What&apos;s inside
                  </h3>
                  <ul className={styles.points}>
                    {project.highlights.map((h) => (
                      <li key={h} className={styles.point}>
                        <FontAwesomeIcon icon={faCheck} className={styles.pointIcon} aria-hidden="true" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {project.stackPreview && project.stackPreview.length > 0 && (
                <section className={styles.section} aria-labelledby="project-stack-heading">
                  <h3 id="project-stack-heading" className={styles.eyebrow}>
                    Built with
                  </h3>
                  <ul className={styles.tags}>
                    {project.stackPreview.map((tech) => (
                      <li key={tech} className={styles.tag}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </motion.div>
          </div>
        </div>

        <div className={styles.footer}>
          {hasSiblings && (
            <nav className={styles.nav} aria-label="Project navigation">
              <button type="button" className={styles.arrow} onClick={onPrev} aria-label="Previous project">
                <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
              </button>
              <div className={styles.dots}>
                {projects.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`${styles.navDot} ${i === index ? styles.active : ""}`}
                    aria-current={i === index ? "true" : undefined}
                    aria-label={`Go to ${p.name}`}
                    onClick={swipeGuard(() => onSelect(p.id))}
                  />
                ))}
              </div>
              <button type="button" className={styles.arrow} onClick={onNext} aria-label="Next project">
                <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
              </button>
            </nav>
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
