"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faToolbox,
  faLaptopCode,
  // faFilm,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

interface DesktopIconsProps {
  showContactNotification: boolean;
  handleAppClick: (path: string, isToggle?: boolean) => void;
  maybePreloadByPath: (path: string) => void;
}

const DesktopIcons: React.FC<DesktopIconsProps> = ({
  showContactNotification,
  handleAppClick,
  maybePreloadByPath,
}) => {
  const desktopApps = [
    { name: "Mindset", icon: faBrain, path: "/mindset" },
    { name: "Skillset", icon: faToolbox, path: "/skillset" },
    { name: "Projects", icon: faLaptopCode, path: "/projects" },
    // { name: "Docuseries", icon: faFilm, path: "/documentary" },
    { name: "Contact", icon: faEnvelope, path: "/contact", isToggle: true },
  ];

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

      <div className="desktop-items">
        {desktopApps.map((app) => (
          <button
            key={app.name}
            className="desktop-icon"
            type="button"
            onClick={() => handleAppClick(app.path, app.isToggle)}
            onMouseEnter={() => maybePreloadByPath(app.path)}
            onTouchStart={() => maybePreloadByPath(app.path)}
            tabIndex={0}
            aria-label={app.name}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAppClick(app.path, app.isToggle);
              }
            }}
          >
            <div className="icon-image">
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
            <span className="icon-label">{app.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DesktopIcons;
