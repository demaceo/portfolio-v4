"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DesktopRain from "./DesktopRain";
import { DESKTOP_APPS } from "@/lib/constants/desktopApps";

interface DesktopIconsProps {
  showContactNotification: boolean;
  handleAppClick: (path: string, isToggle?: boolean) => void;
  maybePreloadByPath: (path: string) => void;
}

const DEFAULT_ACTIVE = 1; // Skillset — keeps every row on-screen at rest
const ROW_HEIGHT = 120; // px between rows, so icons read as spaced out
const CURVE_RANGE = 3; // rows over which the curve/scale/fade fully resolve
const CURVE_AMPLITUDE = 56; // px a row swings left as it recedes from center
const ACTIVE_ICON_SIZE = 84; // px
const BASE_ICON_SIZE = 64; // px, before the recede scale is applied
const WHEEL_SETTLE_MS = 140; // pause in wheel events before snapping to a row
const FLING_PROJECTION_MS = 120; // how far a fast drag release "carries" past the drop point

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// sin(t*pi/2) has a nonzero slope at t=0, which (mirrored via abs()) draws a
// sharp cusp at the vertex instead of a round one. This eases in from a flat,
// zero-slope start instead, so the curve is round at its center and sweeps
// out more toward the edges.
function easeRound(t: number) {
  return 1 - Math.cos((t * Math.PI) / 2);
}

// Sampled points (0-100 box) for the decorative rail, drawn in the same
// full-height wheel box the rows live in: it touches the right edge at the
// top and bottom corners (y=0/100) and bows inward (left) at the vertical
// middle — sharing that box's own 50% mark is what keeps the rows reading
// as if they're strung along this exact line, since the active row (t=0)
// pops inward at that same middle point.
const RAIL_PATH = Array.from({ length: 21 }, (_, i) => {
  const y = (i / 20) * 100;
  const t = clamp(Math.abs(y - 50) / 50, 0, 1);
  const x = 8 + 87 * easeRound(t);
  return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
}).join(" ");

/**
 * A tailored take on the "Curved Activity Picker" codepen: the desktop
 * shortcuts are strung along a vertical rail spanning the full desktop
 * height, with the centered row popping inward (left) while receding rows
 * settle back toward the edge. Drag, scroll, or tap a row to bring it to
 * center; tapping the row that's already centered launches that app.
 */
const DesktopIcons: React.FC<DesktopIconsProps> = ({
  showContactNotification,
  handleAppClick,
  maybePreloadByPath,
}) => {
  const [active, setActive] = useState(DEFAULT_ACTIVE);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isWheeling, setIsWheeling] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const dragStart = useRef({ pointerY: 0, dragY: 0 });
  const pointerActive = useRef(false);
  const dragMoved = useRef(false);
  const tapIndex = useRef<number | null>(null);
  const lastMove = useRef({ time: 0, pointerY: 0, velocity: 0 });
  const wheelSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const bounds = useMemo(
    () => ({
      min: -active * ROW_HEIGHT,
      max: (DESKTOP_APPS.length - 1 - active) * ROW_HEIGHT,
    }),
    [active],
  );

  // The native wheel listener is attached once (see the effect below); reading
  // the current bounds through a ref keeps that listener from tearing down and
  // re-subscribing on every row change.
  const boundsRef = useRef(bounds);
  boundsRef.current = bounds;

  // Picking a row is two-step: the first tap (on any row other than the
  // centered one) just brings it to center as a preview; tapping the row
  // that's already centered launches it. This mirrors the codepen's
  // browse-then-commit feel and keeps a stray drag from accidentally
  // opening a modal.
  function pickApp(index: number) {
    if (index === active) {
      const app = DESKTOP_APPS[index];
      handleAppClick(app.path, app.isToggle);
    } else {
      setActive(index);
    }
  }

  // Pointer capture (needed so dragging keeps tracking once the pointer
  // leaves a row) retargets the resulting click event to the capturing
  // element, so the per-row onClick below never fires for mouse/touch —
  // tap-to-pick is instead resolved from the row under the pointer at
  // pointerdown time. onClick still fires for assistive-tech synthesized
  // clicks on an option (which never go through capture); keyboard
  // activation is handled separately in handleKeyDown.
  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerActive.current = true;
    dragMoved.current = false;
    const rowEl = (event.target as HTMLElement).closest<HTMLElement>("[data-row-index]");
    tapIndex.current = rowEl ? Number(rowEl.dataset.rowIndex) : null;
    setIsDragging(true);
    dragStart.current = { pointerY: event.clientY, dragY };
    lastMove.current = { time: performance.now(), pointerY: event.clientY, velocity: 0 };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointerActive.current) return;
    const delta = event.clientY - dragStart.current.pointerY;
    if (Math.abs(delta) > 4) dragMoved.current = true;
    setDragY(clamp(dragStart.current.dragY + delta, bounds.min, bounds.max));

    // Track recent speed (px/ms) so a fast flick can carry past the exact
    // drop point on release, instead of stopping dead where the pointer did.
    const now = performance.now();
    const dt = now - lastMove.current.time;
    if (dt > 0) {
      const velocity = (event.clientY - lastMove.current.pointerY) / dt;
      lastMove.current = { time: now, pointerY: event.clientY, velocity };
    }
  }

  function endDrag() {
    if (!pointerActive.current) return;
    pointerActive.current = false;
    setIsDragging(false);
    if (dragMoved.current) {
      // A quick release "carries" the scroll a little further in the
      // direction it was already moving, like a native momentum scroll,
      // rather than snapping to wherever the pointer happened to let go.
      const projected = clamp(
        dragY + lastMove.current.velocity * FLING_PROJECTION_MS,
        bounds.min,
        bounds.max,
      );
      const rowsMoved = Math.round(projected / ROW_HEIGHT);
      setActive((current) => clamp(current - rowsMoved, 0, DESKTOP_APPS.length - 1));
    } else if (tapIndex.current !== null) {
      pickApp(tapIndex.current);
    }
    setDragY(0);
  }

  // Keyboard control follows the ARIA listbox pattern: focus stays on the
  // wheel container while aria-activedescendant tracks the centered option.
  // Arrow keys move the selection (and preload its route like pointer hover
  // does); Enter/Space launches the selected app.
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pickApp(active);
      return;
    }
    let next: number;
    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft":
        next = clamp(active - 1, 0, DESKTOP_APPS.length - 1);
        break;
      case "ArrowDown":
      case "ArrowRight":
        next = clamp(active + 1, 0, DESKTOP_APPS.length - 1);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = DESKTOP_APPS.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (next === active) return;
    setActive(next);
    maybePreloadByPath(DESKTOP_APPS[next].path);
  }

  // React attaches "wheel" as a passive listener by default, so preventDefault
  // inside a JSX onWheel prop throws a console warning and is silently
  // ignored. Attaching natively with { passive: false } lets scrolling over
  // the rail change rows instead of moving the page.
  //
  // Rather than jumping a whole row per throttled tick, each wheel event
  // nudges the same offset a drag would (so a trackpad swipe tracks the
  // gesture continuously, transition-free); once the events pause for a
  // beat, it settles to the nearest row with the normal eased transition.
  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;

    // The wheel gesture accumulates its offset locally so settling can snap to
    // the nearest row without nesting one state setter inside another's
    // updater (which double-applies under StrictMode / concurrent re-renders).
    let offset = 0;

    function settle() {
      setIsWheeling(false);
      const rowsMoved = Math.round(offset / ROW_HEIGHT);
      offset = 0;
      setDragY(0);
      if (rowsMoved !== 0) {
        setActive((prevActive) => clamp(prevActive - rowsMoved, 0, DESKTOP_APPS.length - 1));
      }
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      if (pointerActive.current) return;
      setIsWheeling(true);
      offset = clamp(offset - event.deltaY, boundsRef.current.min, boundsRef.current.max);
      setDragY(offset);
      if (wheelSettleTimer.current) clearTimeout(wheelSettleTimer.current);
      wheelSettleTimer.current = setTimeout(settle, WHEEL_SETTLE_MS);
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelSettleTimer.current) clearTimeout(wheelSettleTimer.current);
    };
  }, []);

  return (
    <div className="desktop">
      {/* Shared displacement filter (ported from the "Liquid Glass Button"
          codepen) that gives the icon surfaces their liquid refraction. */}
      <svg className="desktop-glass-filter" aria-hidden="true">
        <filter
          id="desktop-icon-glass-distortion"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.03"
            numOctaves="2"
            seed="92"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="25"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <DesktopRain />

      <div
        ref={wheelRef}
        className={`desktop-items${isDragging || isWheeling ? " is-animating" : ""}`}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        role="listbox"
        aria-label="Desktop apps"
        aria-orientation="vertical"
        aria-activedescendant={`desktop-app-${active}`}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={handleKeyDown}
      >
        <svg
          className="desktop-wheel-rail"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={RAIL_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {DESKTOP_APPS.map((app, index) => {
          const raw = index - active;
          const continuous = raw + dragY / ROW_HEIGHT;
          const translateY = continuous * ROW_HEIGHT;
          const abs = clamp(Math.abs(continuous), 0, CURVE_RANGE);
          const t = abs / CURVE_RANGE;
          // Inverted from a plain easeRound(t): full inward swing at t=0
          // (active), settling back to the edge baseline as t nears 1.
          const curveX = CURVE_AMPLITUDE * (1 - easeRound(t));
          const scale = 1 - 0.4 * t;
          const opacity = clamp(1 - 0.65 * t, 0.35, 1);
          const isActive = index === active;
          const iconSize = isActive ? ACTIVE_ICON_SIZE : Math.round(BASE_ICON_SIZE * scale);

          return (
            <div
              key={app.name}
              id={`desktop-app-${index}`}
              data-row-index={index}
              role="option"
              aria-selected={isActive}
              className="desktop-wheel-row"
              style={{
                transform: `translateY(-50%) translate(${-curveX}px, ${translateY}px)`,
                opacity,
                transition:
                  isDragging || isWheeling || prefersReducedMotion
                    ? "none"
                    : "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease",
              }}
              onClick={() => pickApp(index)}
              onMouseEnter={() => maybePreloadByPath(app.path)}
              onTouchStart={() => maybePreloadByPath(app.path)}
            >
              {isActive ? (
                <span className="desktop-wheel-label-active">{app.name}</span>
              ) : (
                <span
                  className="desktop-wheel-label"
                  style={{ fontSize: `${16 + 6 * (1 - t)}px` }}
                >
                  {app.name}
                </span>
              )}

              <div className="icon-image" style={{ width: iconSize, height: iconSize }}>
                <div className="icon-glass">
                  <div className="icon-glass-distortion" />
                  <div className="icon-glass-base" />
                  <div className="icon-glass-border" />
                  <span className="icon-glass-content">
                    <FontAwesomeIcon icon={app.icon} />
                  </span>
                </div>
                {app.name === "Contact" && showContactNotification && (
                  <div className="notification-badge">!</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopIcons;
