"use client";

import React, { useEffect, useRef, useState, type CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DESKTOP_APPS } from "@/lib/constants/desktopApps";
import { DISPLACEMENT_MAP } from "@/lib/constants/displacementMap";
import "./AppSwitcher.css";

interface AppSwitcherProps {
  showContactNotification: boolean;
  /** Path of whichever app is genuinely open right now (drives the active
   *  tab), or null when the user is at the home/welcome screen. */
  activeAppPath: string | null;
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

// Desktop-only apps (e.g. Scrapbook) are intentionally excluded from the mobile
// switcher — they live solely on the desktop wheel, which is hidden ≤480px.
const MOBILE_APPS = DESKTOP_APPS.filter((app) => !app.desktopOnly);

/**
 * Mobile-only (≤480px) app launcher pill, adapted from codepenz's
 * "Apple Liquid Glass Switcher" — a 3-way theme toggle there, generalized
 * here to the 4 desktop apps. Replaces DesktopIcons' curved wheel picker at
 * that breakpoint; both always mount, CSS decides which is visible (see
 * AppSwitcher.css / LandingPage.css), matching the MenuBar-hide precedent.
 */
const AppSwitcher: React.FC<AppSwitcherProps> = ({
  showContactNotification,
  activeAppPath,
  handleAppClick,
  maybePreloadByPath,
}) => {
  // Derived from the real app state (not local tap-tracking) so the
  // highlighted tab never goes stale: it reflects "nothing is open" on
  // first load and again whenever the user closes back out to the home
  // screen, instead of freezing on whichever tab was tapped last.
  const activeIndex = MOBILE_APPS.findIndex((app) => app.path === activeAppPath);
  const hasActiveTab = activeIndex !== -1;

  // The capsule's own position/slide-direction bookkeeping — kept pinned to
  // the last real index while idle (no active tab) so it fades out in place
  // instead of sliding to a default position first.
  const [previousIndex, setPreviousIndex] = useState(0);
  const [capsuleIndex, setCapsuleIndex] = useState(Math.max(activeIndex, 0));
  const lastActiveIndex = useRef(activeIndex);

  useEffect(() => {
    if (activeIndex !== -1 && activeIndex !== lastActiveIndex.current) {
      setPreviousIndex(capsuleIndex);
      setCapsuleIndex(activeIndex);
    }
    if (activeIndex !== -1) lastActiveIndex.current = activeIndex;
    // capsuleIndex intentionally excluded: it's the value being set here,
    // re-running on its own change would fight this effect's own update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const handleTap = (index: number) => {
    const app = MOBILE_APPS[index];
    handleAppClick(app.path, app.isToggle);
  };

  const pillOrigin = capsuleIndex > previousIndex ? "left" : "right";

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
        data-idle={hasActiveTab ? undefined : ""}
        style={
          {
            "--n-options": MOBILE_APPS.length,
            "--active-index": capsuleIndex,
            "--pill-origin": pillOrigin,
            backdropFilter: `blur(8px) url(#${PILL_FILTER_ID}) saturate(150%)`,
            WebkitBackdropFilter: `blur(8px) saturate(150%)`,
          } as CSSProperties
        }
      >
        <legend className="app-switcher-legend">Launch an app</legend>
        {MOBILE_APPS.map((app, index) => {
          const isActive = index === activeIndex;
          const hasNotification = app.name === "Contact" && showContactNotification;
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
                // onChange is a required no-op for the controlled `checked`
                // prop; the real action lives only in onClick, since native
                // radios don't emit onChange for a re-tap of the already-
                // checked option, and Contact (isToggle) needs that re-tap
                // to close it.
                onChange={() => {}}
                onClick={() => handleTap(index)}
              />
              <span className="app-switcher-sr-only">
                {hasNotification ? `${app.name}, new notification` : app.name}
              </span>
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
                {hasNotification && (
                  <span className="notification-badge" aria-hidden="true">
                    !
                  </span>
                )}
              </span>
              <span className="app-switcher-label" aria-hidden="true">
                {app.name}
              </span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
};

export default AppSwitcher;
