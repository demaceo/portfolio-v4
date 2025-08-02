"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLaptopCode,
  faEnvelope,
  faBriefcase,
  faPaw,
  // faTheaterMasks,
  // faRobot,
  // faMusic,
  // faCookieBite,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import ContactForm from "@/components/features/contact/ContactForm/ContactForm";
import { ASSET_PATHS } from "@/lib/constants/paths";
import { projectsData } from "@/data/projects";
import Image from "next/image";
import "./MobileLayout.css";

const MobileLayout = () => {
  const router = useRouter();
  const [currentTime] = useState(new Date());
  const [showContactForm, setShowContactForm] = useState(false);
  const [showWelcomeWindow, setShowWelcomeWindow] = useState(true);

  interface FormatTimeOptions {
    hour: "2-digit";
    minute: "2-digit";
    hour12: boolean;
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    } as FormatTimeOptions);
  };

  interface HandleAppClickProps {
    path: string;
  }

  const handleAppClick = (path: HandleAppClickProps["path"]): void => {
    if (path === "/contact") {
      setShowContactForm(true);
    } else if (path.startsWith("http")) {
      // External URL - open in new tab
      window.open(path, "_blank");
    } else {
      // Internal navigation
      router.push(path);
    }
  };

  const handleWelcomeWindowClose = (): void => {
    setShowWelcomeWindow(false);
  };

  const mobileApps = projectsData
    .filter((project) => !project.archived)
    .slice(0, 6)
    .map((project) => {
      // Map project icons to FontAwesome icons
      let icon: IconDefinition | undefined;
      let image = project.image || "";
      if (project.icon === "fas fa-briefcase icon") {
        icon = faBriefcase;
      } else if (project.icon === "fa fa-paw icon") {
        icon = faPaw;
      } else if (project.id === 1 || project.id === 0) {
        image = project.image ?? "";
        // } else if (project.icon === "fas fa-robot icon") {
        //   icon = faRobot;
        // } else if (project.icon === "fas fa-music icon") {
        //   icon = faMusic;
        // } else if (project.icon === "fas fa-cookie-bite icon") {
        //   icon = faCookieBite;
        // } else if (project.icon === "fas fa-film icon") {
        //   icon = faFilm;
      } else {
        // Default icon for projects without specific icons
        icon = faLaptopCode;
      }

      return {
        name: project.name,
        icon: icon,
        image,
        path: project.link.startsWith("http")
          ? project.link
          : `/project/${project.id}`,
      };
    });

  return (
    <div className="iphone-container">
      <div className="iphone-screen">
        <div className="status-bar">
          <Image
            className="carrier"
            alt="portfolio-logo"
            src={`${ASSET_PATHS.LOGOS}/PORTFOLIO_LOGO.png`}
            width={20}
            height={20}
          />
          <span className="time">{formatTime(currentTime)}</span>
        </div>

        <div className="wallpaper">
          {showWelcomeWindow && (
            <div className="mobile-welcome-window">
              <div className="mobile-window-title-bar">
                <div className="mobile-window-controls">
                  <button
                    className="mobile-close-btn"
                    onClick={handleWelcomeWindowClose}
                    aria-label="Close welcome window"
                  ></button>
                </div>
                <span className="mobile-window-title">Welcome</span>
              </div>
              <div className="mobile-window-content">
                {/* <h2>Demaceo Vincent</h2> */}
                <p>Explore my work & get in touch.</p>
              </div>
            </div>
          )}

          <div className="home-apps">
            {mobileApps.map((app) => (
              <button
                key={app.name}
                className="app-icon"
                type="button"
                onClick={() => handleAppClick(app.path)}
                tabIndex={0}
                aria-label={app.name}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleAppClick(app.path);
                  }
                }}
              >
                <span className="icon">
                  {app.icon && <FontAwesomeIcon icon={app.icon} />}
                  {app.image && (
                    <Image
                      className="app-image"
                      src={app.image}
                      alt={app.name}
                      width={32}
                      height={32}
                    />
                  )}
                </span>
                <span className="app-name">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="page-indicators">
          <div className="page-dot active"></div>
          <div className="page-dot"></div>
        </div>

        <div className="dock-mobile">
          <button
            className="dock-app"
            type="button"
            onClick={() => handleAppClick("/mindset")}
            tabIndex={0}
            aria-label="About Me"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAppClick("/mindset");
              }
            }}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button
            className="dock-app"
            type="button"
            onClick={() => handleAppClick("/projects")}
            tabIndex={0}
            aria-label="Projects"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAppClick("/projects");
              }
            }}
          >
            <FontAwesomeIcon icon={faLaptopCode} />
          </button>
          <button
            className="dock-app"
            type="button"
            onClick={() => handleAppClick("/contact")}
            tabIndex={0}
            aria-label="Contact"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAppClick("/contact");
              }
            }}
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </button>
        </div>
      </div>
      {showContactForm && (
        <div
          className="contact-modal-overlay"
          onClick={() => setShowContactForm(false)}
        >
          <div
            className="contact-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <ContactForm onClose={() => setShowContactForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLayout;
