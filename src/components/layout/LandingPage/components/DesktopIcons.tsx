"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faToolbox,
  faLaptopCode,
  // faFilm,
  faEnvelope,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import DesktopRain from "./DesktopRain";

interface DesktopIconsProps {
  showContactNotification: boolean;
  handleAppClick: (path: string, isToggle?: boolean) => void;
  maybePreloadByPath: (path: string) => void;
}

interface DesktopApp {
  name: string;
  icon: IconDefinition;
  path: string;
  isToggle?: boolean;
  color: string;
}

const DESKTOP_APPS: DesktopApp[] = [
  { name: "Mindset", icon: faBrain, path: "/mindset", color: "#8b7dfb" },
  { name: "Skillset", icon: faToolbox, path: "/skillset", color: "#f0ab1b" },
  { name: "Projects", icon: faLaptopCode, path: "/projects", color: "#2f9be0" },
  // { name: "Docuseries", icon: faFilm, path: "/documentary", color: "#3ecf8e" },
  { name: "Contact", icon: faEnvelope, path: "/contact", isToggle: true, color: "#ef4a5f" },
];

const DEFAULT_ACTIVE = 1; // Skillset — keeps every row on-screen at rest
const ROW_HEIGHT = 120; // px between rows, so icons read as spaced out
const CURVE_RANGE = 3; // rows over which the curve/scale/fade fully resolve
const CURVE_AMPLITUDE = 56; // px a row swings left as it recedes from center
const ACTIVE_ICON_SIZE = 84; // px
const BASE_ICON_SIZE = 64; // px, before the recede scale is applied

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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const dragStart = useRef({ pointerY: 0, dragY: 0 });
  const pointerActive = useRef(false);
  const dragMoved = useRef(false);
  const tapIndex = useRef<number | null>(null);
  const lastWheelAt = useRef(0);
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
  // pointerdown time. onClick still fires for keyboard activation and
  // assistive-tech synthesized clicks, which never go through capture.
  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerActive.current = true;
    dragMoved.current = false;
    const rowEl = (event.target as HTMLElement).closest<HTMLElement>("[data-row-index]");
    tapIndex.current = rowEl ? Number(rowEl.dataset.rowIndex) : null;
    setIsDragging(true);
    dragStart.current = { pointerY: event.clientY, dragY };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointerActive.current) return;
    const delta = event.clientY - dragStart.current.pointerY;
    if (Math.abs(delta) > 4) dragMoved.current = true;
    setDragY(clamp(dragStart.current.dragY + delta, bounds.min, bounds.max));
  }

  function endDrag() {
    if (!pointerActive.current) return;
    pointerActive.current = false;
    setIsDragging(false);
    if (dragMoved.current) {
      const rowsMoved = Math.round(dragY / ROW_HEIGHT);
      setActive((current) => clamp(current - rowsMoved, 0, DESKTOP_APPS.length - 1));
    } else if (tapIndex.current !== null) {
      pickApp(tapIndex.current);
    }
    setDragY(0);
  }

  // React attaches "wheel" as a passive listener by default, so preventDefault
  // inside a JSX onWheel prop throws a console warning and is silently
  // ignored. Attaching natively with { passive: false } lets scrolling over
  // the rail change rows instead of moving the page.
  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const now = Date.now();
      if (now - lastWheelAt.current < 220) return;
      lastWheelAt.current = now;
      setActive((current) => clamp(current + (event.deltaY > 0 ? 1 : -1), 0, DESKTOP_APPS.length - 1));
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
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
        className="desktop-items"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
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
            <button
              key={app.name}
              type="button"
              data-row-index={index}
              className="desktop-wheel-row"
              style={{
                transform: `translateY(-50%) translate(${-curveX}px, ${translateY}px)`,
                opacity,
                transition:
                  isDragging || prefersReducedMotion
                    ? "none"
                    : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
              }}
              aria-pressed={isActive}
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
                <div
                  className="icon-glass"
                  style={
                    isActive
                      ? { boxShadow: `inset 0 0 0 2px ${app.color}99, 0 0 24px ${app.color}66` }
                      : undefined
                  }
                >
                  <div className="icon-glass-distortion" />
                  <div className="icon-glass-base" />
                  <div className="icon-glass-border" />
                  <span
                    className="icon-glass-content"
                    style={isActive ? { color: app.color } : undefined}
                  >
                    <FontAwesomeIcon icon={app.icon} />
                  </span>
                </div>
                {app.name === "Contact" && showContactNotification && (
                  <div className="notification-badge">!</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DesktopIcons;
