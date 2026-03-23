"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface MobileApp {
  name: string;
  icon: IconDefinition;
  path: string;
  isToggle?: boolean;
  description?: string;
  meta?: string;
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

const getAppVariantClass = (path: string): string => {
  switch (path) {
    case "/mindset":
      return "app-variant-mindset";
    case "/skillset":
      return "app-variant-skillset";
    case "/projects":
      return "app-variant-projects";
    case "/documentary":
      return "app-variant-documentary";
    default:
      return "app-variant-default";
  }
};

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
          className={`mobile-app-icon ${getAppVariantClass(app.path)}`}
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
          <span className="app-card-main">
            <span className="icon">
              <FontAwesomeIcon icon={app.icon} />
            </span>
            <span className="app-copy">
              <span className="app-name">{app.name}</span>
              <span className="app-description">
                {app.description ?? "Open section"}
              </span>
            </span>
          </span>
          <span className="app-card-meta">
            <span className="app-meta-chip">{app.meta ?? "Open"}</span>
            <span className="app-open-indicator" aria-hidden="true">
              Open
            </span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default HomeApps;
