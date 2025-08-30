"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface MobileApp {
  name: string;
  icon: IconDefinition;
  path: string;
  isToggle?: boolean;
}

interface HomeAppsProps {
  apps: MobileApp[];
  handleAppClick: (path: string, isToggle?: boolean) => void;
  preloadHandlers: {
    about: () => void;
    skillset: () => void;
    projects: () => void;
    documentary: () => void;
  };
}

const HomeApps: React.FC<HomeAppsProps> = ({
  apps,
  handleAppClick,
  preloadHandlers,
}) => {
  const handlePreload = (path: string) => {
    if (path === "/mindset") preloadHandlers.about();
    if (path === "/skillset") preloadHandlers.skillset();
    if (path === "/projects") preloadHandlers.projects();
    if (path === "/documentary") preloadHandlers.documentary();
  };

  return (
    <div className="home-apps">
      {apps.map((app) => (
        <button
          key={app.name}
          className="mobile-app-icon"
          type="button"
          onClick={() => handleAppClick(app.path, app.isToggle)}
          onMouseEnter={() => handlePreload(app.path)}
          onTouchStart={() => handlePreload(app.path)}
          tabIndex={0}
          aria-label={app.name}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleAppClick(app.path, app.isToggle);
            }
          }}
        >
          <span className="icon">
            <FontAwesomeIcon icon={app.icon} />
          </span>
          <span className="app-name">{app.name}</span>
        </button>
      ))}
    </div>
  );
};

export default HomeApps;
