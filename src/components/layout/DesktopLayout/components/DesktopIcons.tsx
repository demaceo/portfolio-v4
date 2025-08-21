"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faToolbox,
  faLaptopCode,
  faFilm,
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
    { name: "Docuseries", icon: faFilm, path: "/documentary" },
    { name: "Contact", icon: faEnvelope, path: "/contact", isToggle: true },
  ];

  return (
    <div className="desktop">
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
              <FontAwesomeIcon icon={app.icon} />
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
