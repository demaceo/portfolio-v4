"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AppView } from "@/components/features/shell";
import {
  scrapbookItems,
  CATEGORY_META,
  type ScrapbookItem,
} from "@/data/scrapbook";
import {
  computePositions,
  buildConnectors,
  computeCanvasSize,
  END_PAD,
} from "./flowLayout";
import styles from "./ScrapbookAppView.module.css";

interface ScrapbookAppViewProps {
  onClose: () => void;
}

// Layout is a pure function of the content, computed once at module load since
// `scrapbookItems` is static (see flowLayout.ts). Cards march along a gentle
// serpentine; connectors and canvas width are derived to match.
const POSITIONS = computePositions(scrapbookItems.length);
const CONNECTORS = buildConnectors(POSITIONS);
const CANVAS = computeCanvasSize(scrapbookItems.length);
// A decorative junction dot sits on the line midway between each pair of cards.
const DOT_POSITIONS = POSITIONS.slice(0, -1).map((p, i) => ({
  x: (p.x + POSITIONS[i + 1].x) / 2,
  y: (p.y + POSITIONS[i + 1].y) / 2,
}));

/** A category-tinted gradient standing in for a photo while it loads, if it
 *  fails, or when an item has no image — so a card never renders as an empty
 *  black rectangle. */
function fallbackGradient(color: string) {
  return `linear-gradient(135deg, ${color}, rgba(45, 52, 54, 0.9))`;
}

function cardAriaLabel(item: ScrapbookItem) {
  const meta = CATEGORY_META[item.category];
  return `${meta.label}: ${item.title}. ${item.blurb}${
    item.date ? ` (${item.date})` : ""
  }`;
}

/**
 * Scrapbook — a horizontal, scroll-driven flow map of personal moments, ported
 * and adapted from codepenz's "Horizontal Flow Map" pen. Vertical scroll is
 * pinned and translated into horizontal panning across a wide light-neumorphic
 * canvas; SVG connectors draw themselves in and cards pop in as they enter. The
 * pen's scroll is self-contained (its own internal `scroller`), so it coexists
 * cleanly with AppView's window-level body-scroll lock and focus trap.
 */
export default function ScrapbookAppView({ onClose }: ScrapbookAppViewProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const instructionRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const scrollAreaEl = scrollAreaRef.current;
    const scrollWrapperEl = scrollWrapperRef.current;
    const canvasEl = canvasRef.current;
    const instructionEl = instructionRef.current;
    if (!scrollAreaEl || !scrollWrapperEl || !canvasEl || !instructionEl) return;
    const scrollArea = scrollAreaEl;
    const scrollWrapper = scrollWrapperEl;
    const canvas = canvasEl;
    const instruction = instructionEl;

    // Debounce handle for the "actively scrolling" class (see onUpdate below).
    let scrollIdleTimer = 0;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduced(prefersReduced);

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const paths = canvas.querySelectorAll<SVGPathElement>("[data-line-path]");
      const revealElements =
        canvas.querySelectorAll<HTMLElement>("[data-reveal]");

      // Reduced-motion: skip the pin/scrub choreography entirely. The whole
      // diagram is shown at rest and the internal area scrolls natively (a
      // horizontal scrollbar is enabled via the `reduced` class), so every
      // node stays reachable without any motion driven by scroll position.
      if (prefersReduced) {
        paths.forEach((path) => gsap.set(path, { strokeDashoffset: 0 }));
        revealElements.forEach((el) =>
          gsap.set(el, { scale: 1, opacity: 1, rotation: 0 })
        );
        gsap.set(instruction, { opacity: 1, y: 0 });
        return;
      }

      // The stage renders in a bounded box, not the browser window, so the
      // horizontal scroll distance is computed from the scroll container's own
      // width. Read it as a function (with invalidateOnRefresh) so the pan
      // target and pin length re-measure on resize: the ResizeObserver below
      // refreshes ScrollTrigger, which re-evaluates both against the new size.
      const getScrollMax = () =>
        canvas.scrollWidth - scrollArea.clientWidth + END_PAD;

      // Only re-fire the hint fade when it actually crosses the threshold, not
      // on every scroll frame (which spawned a fresh tween per frame — a real
      // source of scroll jank).
      let hintHidden = false;

      const horizontalTween = gsap.to(canvas, {
        x: () => -getScrollMax(),
        ease: "none",
        scrollTrigger: {
          trigger: scrollWrapper,
          scroller: scrollArea,
          pin: true,
          // Tighter than scrub:1, which trailed the scroll by a full second
          // and read as "laggy".
          scrub: 0.5,
          invalidateOnRefresh: true,
          end: () => "+=" + getScrollMax(),
          onUpdate: (self) => {
            // Fade the hint once, on threshold-cross (not every frame).
            const shouldHide = self.progress > 0.03;
            if (shouldHide !== hintHidden) {
              hintHidden = shouldHide;
              gsap.to(instruction, {
                opacity: shouldHide ? 0 : 1,
                y: shouldHide ? 20 : 0,
                duration: 0.4,
                overwrite: "auto",
              });
            }
            // While actively panning, disable card pointer-events so cards
            // don't fire their hover-lift (transform + shadow repaint) as they
            // slide under a stationary cursor — the main scroll "glitch". A
            // short idle debounce restores hover once scrolling stops.
            scrollArea.classList.add(styles.scrolling);
            clearTimeout(scrollIdleTimer);
            scrollIdleTimer = window.setTimeout(
              () => scrollArea.classList.remove(styles.scrolling),
              120
            );
          },
        },
      });

      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        // Draw each line in once when it enters, rather than scrubbing the
        // stroke-dashoffset to scroll — a scrubbed dash re-rasterizes the SVG
        // every frame while panning. One-shot keeps the reveal, then leaves the
        // line static (no per-frame SVG cost).
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: path,
            containerAnimation: horizontalTween,
            start: "left right-=150",
            toggleActions: "play none none none",
          },
        });
      });

      revealElements.forEach((el) => {
        // `immediateRender: false` is deliberate: with a plain gsap.from(), the
        // scale:0 start state is applied to every card up front, but the
        // containerAnimation reveals only fire on the first scroll tick — so
        // the opening screen would be blank. fromTo + immediateRender:false
        // leaves already-on-screen cards at their natural state on load and
        // still pops in each card as it scrolls into view.
        gsap.fromTo(
          el,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            immediateRender: false,
            duration: 0.8,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: el,
              containerAnimation: horizontalTween,
              start: "left right-=150",
              // Play the pop-in once and leave it. Reversing on every
              // back-scroll made cards flicker in and out (the "glitch").
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, scrollArea);

    // AppView enters with a framer-motion spring (translateY + opacity) and
    // sets will-change:transform on an ancestor, which can make ScrollTrigger
    // mis-measure the pin. Refresh on the next frame and again once the spring
    // has settled, and on any later size change of the scroll area.
    let rafId = 0;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let resizeObserver: ResizeObserver | undefined;
    if (!prefersReduced) {
      rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
      settleTimer = setTimeout(() => ScrollTrigger.refresh(), 400);
      resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
      resizeObserver.observe(scrollArea);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (settleTimer) clearTimeout(settleTimer);
      clearTimeout(scrollIdleTimer);
      scrollArea.classList.remove(styles.scrolling);
      resizeObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <AppView onClose={onClose} title="Scrapbook" titleId="scrapbook-title">
      <div className={styles.root}>
        <div className={styles.stage}>
          <div
            ref={instructionRef}
            className={styles.scrollInstruction}
            aria-hidden="true"
          >
            {reduced
              ? "→ Scroll sideways to trace my story →"
              : "↓ Scroll down to trace my story ↓"}
          </div>

          <div
            ref={scrollAreaRef}
            className={`${styles.scrollArea} ${
              reduced ? styles.scrollAreaReduced : ""
            }`}
          >
            <div ref={scrollWrapperRef} className={styles.scrollWrapper}>
              <div
                ref={canvasRef}
                className={styles.canvas}
                style={{ width: CANVAS.width, height: CANVAS.height }}
                role="group"
                aria-label={`A scrapbook flow map of ${scrapbookItems.length} personal moments — photos, accomplishments, interests, hobbies, books, and memories. Scroll to trace the path.`}
              >
                <svg
                  className={styles.linesLayer}
                  viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
                  aria-hidden="true"
                >
                  {CONNECTORS.map((d, i) => (
                    <path
                      key={i}
                      data-line-path
                      className={styles.linePath}
                      d={d}
                    />
                  ))}
                </svg>

                {DOT_POSITIONS.map((dot, i) => (
                  <div
                    key={`dot-${i}`}
                    aria-hidden="true"
                    className={`${styles.clayElement} ${styles.connectorDot}`}
                    style={{ left: dot.x, top: dot.y }}
                  />
                ))}

                {scrapbookItems.map((item, i) => {
                  const meta = CATEGORY_META[item.category];
                  const pos = POSITIONS[i];
                  return (
                    <div
                      key={item.id}
                      data-reveal
                      className={`${styles.clayElement} ${styles.card}`}
                      style={{ left: pos.x, top: pos.y }}
                      tabIndex={0}
                      role="group"
                      aria-label={cardAriaLabel(item)}
                    >
                      <div
                        className={styles.cardMedia}
                        style={{ background: fallbackGradient(meta.color) }}
                      >
                        {item.image && (
                          /* eslint-disable-next-line @next/next/no-img-element -- flow-map node thumbnail on a GSAP-transformed canvas; next/image's sizing wrapper fights the absolute positioning */
                          <img
                            className={styles.thumbnail}
                            src={item.image}
                            alt=""
                            loading="lazy"
                            onError={(e) => {
                              // Reveal the category-tinted fallback gradient
                              // rather than a black box.
                              e.currentTarget.style.opacity = "0";
                            }}
                          />
                        )}
                        <div className={styles.overlay} />
                        <div className={styles.headerBadges}>
                          <span
                            className={styles.chip}
                            style={{ background: meta.color }}
                            aria-hidden="true"
                          >
                            <span className={styles.chipIcon}>{meta.icon}</span>
                            {meta.label}
                          </span>
                          {item.date && (
                            <span className={styles.dateBadge} aria-hidden="true">
                              {item.date}
                            </span>
                          )}
                        </div>
                        <div className={styles.title}>{item.title}</div>
                      </div>
                      <div className={styles.cardBlurb}>{item.blurb}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.mobileNotice} aria-hidden="true">
            The Scrapbook is best viewed on a larger screen.
          </div>
        </div>
      </div>
    </AppView>
  );
}
