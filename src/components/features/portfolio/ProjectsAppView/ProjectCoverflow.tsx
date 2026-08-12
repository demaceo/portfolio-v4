"use client";

import React, { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Project } from "@/lib/types";
import ProjectMedia from "../shared/ProjectMedia";
import { cornerColorFor, DOC_CORNER_COLOR } from "../shared/cornerColor";
import styles from "./ProjectCoverflow.module.css";

// Minimum horizontal drag (px) to advance the carousel on release.
const SWIPE_DISTANCE = 40;

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

function clampNum(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface Tier {
  minWidth: number;
  dMax: number;
  rotMax: number;
  cardHMin: number;
  cardHMax: number;
  /** Fraction of the measured stage height a card is allowed to claim before
   *  hitting cardHMax — higher on mobile so cards lean into more of the
   *  available vertical budget than on desktop. */
  heightRatio: number;
  perspective: number;
}

/**
 * "Shallow Dock" layout: depth reads mainly through size and opacity
 * (Apple Dock-style falloff) rather than rotation, so far more cards stay
 * legible on stage at once than a literal page-turn coverflow allows.
 * Tiers are keyed by measured stage width (not viewport width), since the
 * stage itself is bounded inside the app's mac-screen bezel.
 */
const TIERS: Tier[] = [
  { minWidth: 900, dMax: 5, rotMax: 12, cardHMin: 300, cardHMax: 460, heightRatio: 0.68, perspective: 1700 },
  { minWidth: 600, dMax: 3, rotMax: 10, cardHMin: 260, cardHMax: 400, heightRatio: 0.7, perspective: 1500 },
  { minWidth: 0, dMax: 2, rotMax: 7, cardHMin: 200, cardHMax: 420, heightRatio: 0.74, perspective: 1000 },
];

function pickTier(stageWidth: number): Tier {
  return TIERS.find((t) => stageWidth >= t.minWidth) ?? TIERS[TIERS.length - 1];
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
  const viewportRef = useRef<HTMLDivElement>(null);
  // Sane defaults so first paint isn't degenerate before the observer fires.
  const [stageSize, setStageSize] = useState({ width: 1200, height: 320 });

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setStageSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Swipe-to-navigate: refs + the useGesture hook must stay above the
  // `projects.length === 0` early return below (projects.length can toggle
  // between 0 and non-zero across renders, e.g. an emptied filter tab, and
  // hooks can't be called conditionally). goTo only needs projects.length /
  // setActiveIndex / cardRefs, all available here, so it's relocated
  // alongside them rather than left further down.
  const movedRef = useRef(false);
  const lastDragEndAt = useRef(0);

  const goTo = (index: number, focus = false) => {
    const next = wrapIndex(index, projects.length);
    setActiveIndex(next);
    if (focus) cardRefs.current[next]?.focus();
  };

  useGesture(
    {
      onDrag: ({ swipe: [swipeX], movement: [mx, my], last, first }) => {
        if (first) movedRef.current = false;
        if (Math.abs(mx) > 8 || Math.abs(my) > 8) movedRef.current = true;
        if (!last) return;
        if (movedRef.current) lastDragEndAt.current = performance.now();
        // @use-gesture's own `swipe` detection is velocity-gated (a "flick"),
        // so a deliberate drag-past-the-threshold-then-pause-before-lifting
        // reads as swipe [0, 0] even though it moved plenty. Fall back to a
        // plain distance check (same threshold as `drag.swipe.distance`
        // below) so that release still commits to the next/prev card.
        if (swipeX === -1 || (swipeX === 0 && mx <= -SWIPE_DISTANCE)) goTo(activeIndex + 1);
        else if (swipeX === 1 || (swipeX === 0 && mx >= SWIPE_DISTANCE)) goTo(activeIndex - 1);
      },
    },
    {
      target: viewportRef,
      eventOptions: { passive: true },
      drag: { axis: "x", filterTaps: true, swipe: { distance: SWIPE_DISTANCE, velocity: 0.3 } },
    }
  );

  if (projects.length === 0) return null;

  const tier = pickTier(stageSize.width);
  const dMax = Math.min(tier.dMax, Math.floor(projects.length / 2));
  const cardH = clampNum(tier.cardHMin, stageSize.height * tier.heightRatio, tier.cardHMax);
  const cardW = cardH * 0.66;
  const step = clampNum(
    cardW * 0.34,
    (stageSize.width * 0.92 - cardW) / (2 * Math.max(dMax, 1)),
    cardW * 0.95
  );
  const cornerSize = clampNum(16, cardW * 0.14, 44);

  const selectOrOpen = (index: number, project: Project) => {
    // Swallow the click that a mouse/trackpad drag-release would otherwise
    // also fire on the card underneath (touch already suppresses this
    // natively, but click has no such native guard for pointer/mouse drags).
    if (performance.now() - lastDragEndAt.current < 80) return;
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
      <div
        ref={viewportRef}
        className={styles.viewport}
        style={{ "--stage-perspective": `${tier.perspective}px` } as CSSProperties}
      >
        {projects.map((project, i) => (
          <CoverflowSlide
            key={project.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            project={project}
            delta={wrappedDelta(i, activeIndex, projects.length)}
            dMax={dMax}
            rotMax={tier.rotMax}
            cardW={cardW}
            cardH={cardH}
            step={step}
            stageWidth={stageSize.width}
            cornerSize={cornerSize}
            cornerColor={
              project.type === "documentary" ? DOC_CORNER_COLOR : cornerColorFor(i, projects.length)
            }
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
  );
};

interface CoverflowSlideProps {
  project: Project;
  /** Shortest-path signed offset from the active slide (0 = active, ±1 = neighbor, ...). */
  delta: number;
  /** Furthest |delta| that stays in the legible "in-play" ring for this stage size/item count. */
  dMax: number;
  rotMax: number;
  cardW: number;
  cardH: number;
  step: number;
  stageWidth: number;
  cornerSize: number;
  cornerColor: string;
  reduceMotion: boolean;
  onSelectOrOpen: () => void;
}

/**
 * All slides share ONE `perspective` (set on .viewport) instead of each
 * owning its own — that's what sells "one deck" rather than N independent
 * 3D boxes. Depth is read mainly through `scale`/`opacity` falloff with only
 * a modest `rotateY` hint (see TIERS), so cards well past the immediate
 * neighbors stay legible instead of vanishing behind the old 90-degree
 * backface-visibility cutoff — that's what lets most/all of a project list
 * stay on stage at once instead of just 3.
 */
const CoverflowSlide = React.forwardRef<HTMLButtonElement, CoverflowSlideProps>(
  (
    { project, delta, dMax, rotMax, cardW, cardH, step, stageWidth, cornerSize, cornerColor, reduceMotion, onSelectOrOpen },
    ref
  ) => {
    const ad = Math.abs(delta);
    const sign = Math.sign(delta);
    const isActive = delta === 0;
    const isVisible = ad <= dMax;

    const x = isVisible ? delta * step : sign * (stageWidth * 0.46 + cardW);
    const rotateY = reduceMotion ? 0 : -sign * Math.min(ad * (rotMax / 3), rotMax);
    const scale = 0.5 + 0.5 * Math.pow(0.78, ad);
    const opacity = isActive ? 1 : Math.max(0, 1 - ad / (dMax + 1));
    const blurPx = reduceMotion || ad < 2 ? 0 : Math.min(ad * 1.1, 4);

    return (
      <motion.button
        ref={ref}
        type="button"
        className={[
          styles.card,
          isActive ? styles.cardActive : ad === 1 ? styles.cardNear : "",
          !isVisible && styles.cardHidden,
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          {
            "--card-w": `${cardW}px`,
            "--card-h": `${cardH}px`,
            "--corner-size": `${cornerSize}px`,
            "--corner-color": cornerColor,
            zIndex: 100 - ad,
            willChange: isVisible ? "transform, opacity" : undefined,
          } as CSSProperties
        }
        animate={{ x, rotateY, scale, opacity, filter: `blur(${blurPx}px)` }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                x: { type: "spring", bounce: 0.2, duration: 0.7 },
                rotateY: { type: "spring", bounce: 0.15, duration: 0.8 },
                scale: { type: "spring", bounce: 0.15, duration: 0.8 },
                opacity: { duration: 0.3 },
                filter: { duration: 0.3 },
              }
        }
        onClick={onSelectOrOpen}
        aria-current={isActive || undefined}
        aria-hidden={!isVisible || undefined}
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
              sizes="(max-width: 640px) 55vw, 260px"
              applyIconScale
            />
          </motion.div>
          <div className={styles.content}>
            <div className={styles.desc}>
              <h3 className={styles.name}>{project.name}</h3>
              <p className={styles.description}>{project.description}</p>
            </div>
          </div>
        </div>
      </motion.button>
    );
  }
);

CoverflowSlide.displayName = "CoverflowSlide";

export default ProjectCoverflow;
