"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLaptopCode,
  faEnvelope,
  faCog,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";
import ContactForm from "@/features/contact/ContactForm/ContactForm";
import AboutMeModal from "@/features/about/AboutMeModal/AboutMeModal";
import SkillsetModal from "@/features/skills/SkillsetModal/SkillsetModal";
import ProjectsModal from "@/features/portfolio/ProjectsModal/ProjectsModal";
import { DocumentaryPlayer } from "@/features/media";
import { ASSET_PATHS } from "@/lib/constants/paths";
import Image from "next/image";
import "./MobileLayout.css";

const MobileLayout = () => {
  const router = useRouter();
  const [currentTime] = useState(new Date());
  const [showContactForm, setShowContactForm] = useState(false);
  const [showWelcomeWindow, setShowWelcomeWindow] = useState(true);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showSkillset, setShowSkillset] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showDocumentary, setShowDocumentary] = useState(false);
  const [showContactNotification, setShowContactNotification] = useState(true);

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

  const handleAppClick = (
    path: HandleAppClickProps["path"],
    isToggle?: boolean
  ): void => {
    if (path === "/contact" || isToggle) {
      setShowContactForm(!showContactForm);
      setShowContactNotification(false);
    } else if (path === "/mindset") {
      setShowAboutMe(true);
    } else if (path === "/skillset") {
      setShowSkillset(true);
    } else if (path === "/projects") {
      setShowProjects(true);
    } else if (path === "/documentary") {
      setShowDocumentary(true);
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

  const mobileApps = [
    // { name: "Mindset", icon: faUser, path: "/mindset" },
    // { name: "Skillset", icon: faCog, path: "/skillset" },
    { name: "Projects", icon: faLaptopCode, path: "/projects" },
    { name: "PBS Doc", icon: faFilm, path: "/documentary" },
    // { name: "Contact", icon: faEnvelope, path: "/contact", isToggle: true },
  ];

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
                  <FontAwesomeIcon icon={app.icon} />
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
            onClick={() => handleAppClick("/skillset")}
            tabIndex={0}
            aria-label="Services"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAppClick("/skillset");
              }
            }}
          >
            <FontAwesomeIcon icon={faCog} />
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
            {showContactNotification && (
              <div className="notification-badge">!</div>
            )}
          </button>
        </div>
      </div>

      {/* Modals rendered outside iphone-screen to avoid z-index issues */}
      {showContactForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowContactForm(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="contact-form-inner">
              <ContactForm onClose={() => setShowContactForm(false)} />
            </div>
          </div>
        </div>
      )}

      {showAboutMe && (
        <div className="modal-overlay" onClick={() => setShowAboutMe(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AboutMeModal onClose={() => setShowAboutMe(false)} />
          </div>
        </div>
      )}
      {showSkillset && (
        <div className="modal-overlay" onClick={() => setShowSkillset(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SkillsetModal onClose={() => setShowSkillset(false)} />
          </div>
        </div>
      )}
      {showProjects && (
        <div className="modal-overlay" onClick={() => setShowProjects(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ProjectsModal onClose={() => setShowProjects(false)} />
          </div>
        </div>
      )}
      {showDocumentary && (
        <div
          className="modal-overlay"
          onClick={() => setShowDocumentary(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <DocumentaryPlayer onClose={() => setShowDocumentary(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLayout;
