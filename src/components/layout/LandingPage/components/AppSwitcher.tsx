"use client";

import React, { useState, type CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DESKTOP_APPS } from "@/lib/constants/desktopApps";
import { DISPLACEMENT_MAP } from "@/lib/constants/displacementMap";
import "./AppSwitcher.css";

interface AppSwitcherProps {
  showContactNotification: boolean;
  handleAppClick: (path: string, isToggle?: boolean) => void;
  maybePreloadByPath: (path: string) => void;
}

// Two distinct glass techniques, each kept in its own role:
// - ICON_FILTER_ID: the same feTurbulence-based distortion DesktopIcons uses
//   per-icon (visual continuity with the wheel across the breakpoint).
// - PILL_FILTER_ID: the apple-liquid-glass-switcher pen's feImage-driven
//   lens refraction, applied via backdrop-filter to the whole pill so it
//   genuinely refracts the wallpaper/rain behind it (new to this codebase).
const ICON_FILTER_ID = "app-switcher-icon-glass-distortion";
const PILL_FILTER_ID = "app-switcher-pill-glass-refraction";

/**
 * Mobile-only (≤480px) app launcher pill, adapted from codepenz's
 * "Apple Liquid Glass Switcher" — a 3-way theme toggle there, generalized
 * here to the 4 desktop apps. Replaces DesktopIcons' curved wheel picker at
 * that breakpoint; both always mount, CSS decides which is visible (see
 * AppSwitcher.css / LandingPage.css), matching the MenuBar-hide precedent.
 */
const AppSwitcher: React.FC<AppSwitcherProps> = ({
  showContactNotification,
  handleAppClick,
  maybePreloadByPath,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);

  const setVisualIndex = (index: number) => {
    if (index === activeIndex) return;
    setPreviousIndex(activeIndex);
    setActiveIndex(index);
  };

  // Fires on every tap, including a re-tap of the already-active option —
  // native radios don't emit onChange for that case, and Contact (isToggle)
  // needs a re-tap to close it, so the real app action lives only here, not
  // in onChange (which would otherwise double-fire alongside this).
  const handleTap = (index: number) => {
    setVisualIndex(index);
    const app = DESKTOP_APPS[index];
    handleAppClick(app.path, app.isToggle);
  };

  const pillOrigin = activeIndex > previousIndex ? "left" : "right";

  return (
    <div className="app-switcher-dock">
      <svg className="app-switcher-svg-defs" aria-hidden="true">
        <filter id={ICON_FILTER_ID} x="-20%" y="-20%" width="140%" height="140%">
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
        <filter id={PILL_FILTER_ID} primitiveUnits="objectBoundingBox">
          <feImage result="map" width="100%" height="100%" x="0" y="0" href={DISPLACEMENT_MAP} />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.04" result="blur" />
          <feDisplacementMap in="blur" in2="map" scale="0.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <fieldset
        className="app-switcher"
        style={
          {
            "--n-options": DESKTOP_APPS.length,
            "--active-index": activeIndex,
            "--pill-origin": pillOrigin,
            backdropFilter: `blur(8px) url(#${PILL_FILTER_ID}) saturate(150%)`,
            WebkitBackdropFilter: `blur(8px) saturate(150%)`,
          } as CSSProperties
        }
      >
        <legend className="app-switcher-legend">Launch an app</legend>
        {DESKTOP_APPS.map((app, index) => {
          const isActive = index === activeIndex;
          return (
            <label
              key={app.name}
              className="app-switcher-option"
              style={{ "--app-accent": app.color } as CSSProperties}
              onMouseEnter={() => maybePreloadByPath(app.path)}
              onTouchStart={() => maybePreloadByPath(app.path)}
            >
              <input
                type="radio"
                name="app-switcher"
                className="app-switcher-input"
                checked={isActive}
                onChange={() => setVisualIndex(index)}
                onClick={() => handleTap(index)}
              />
              <span className="app-switcher-sr-only">{app.name}</span>
              <span className="icon-image app-switcher-icon-image">
                <span className="icon-glass">
                  <span
                    className="icon-glass-distortion"
                    style={{ filter: `url(#${ICON_FILTER_ID})` }}
                  />
                  <span className="icon-glass-base" />
                  <span className="icon-glass-border" />
                  <span className="icon-glass-content">
                    <FontAwesomeIcon icon={app.icon} />
                  </span>
                </span>
                {app.name === "Contact" && showContactNotification && (
                  <span className="notification-badge">!</span>
                )}
              </span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
};

export default AppSwitcher;
