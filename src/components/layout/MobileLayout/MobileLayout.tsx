"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faBriefcase,
  faPaw,
  faUser,
  faCog,
  faLaptopCode,
  faEnvelope,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import ContactForm from "@/components/features/contact/ContactForm/ContactForm";
import InteractiveResume from "@/components/features/resume/InteractiveResume/InteractiveResume";
import AboutMeModal from "@/components/features/about/AboutMeModal/AboutMeModal";
import SkillsetModal from "@/components/features/skills/SkillsetModal/SkillsetModal";
import ProjectsModal from "@/components/features/home/ProjectsModal/ProjectsModal";
import { ASSET_PATHS } from "@/lib/constants/paths";
import { projectsData } from "@/data/projects";
import Image from "next/image";
import "./MobileLayout.css";

const MobileLayout = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showWelcomeWindow, setShowWelcomeWindow] = useState(true);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showSkillset, setShowSkillset] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  useEffect(() => {
    // Set mounted flag and initial time on client
    setIsMounted(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
    } else if (path === "/mindset") {
      setShowAboutMe(true);
    } else if (path === "/skillset") {
      setShowSkillset(true);
    } else if (path === "/projects") {
      setShowProjects(true);
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
      if (project.icon === "fa fa-paw icon") {
        icon = faPaw;
      } else if (project.id === 1 || project.id === 0) {
        image = project.image ?? "";
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

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted || !currentTime) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

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
          <span className="mobile-time">{formatTime(currentTime)}</span>
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
                <span className="mobile-window-title">
                  Welcome to My Portfolio
                </span>
              </div>
              <div className="mobile-window-content">
                <h2>Hello, I&apos;m Demaceo Vincent</h2>
                <p>
                  Tap around to explore my work, learn about me, what services I
                  offer, and how to best reach out!
                </p>
                <div className="mobile-quick-links">
                  <button
                    className="mobile-quick-link-btn"
                    onClick={() => handleAppClick("/mindset")}
                  >
                    About Me
                  </button>
                  <button
                    className="mobile-quick-link-btn"
                    onClick={() => handleAppClick("/skillset")}
                  >
                    Service Spectrum
                  </button>
                  <button
                    className="mobile-quick-link-btn"
                    onClick={() => handleAppClick("/contact")}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          )}{" "}
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
                      width={64}
                      height={64}
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
            onClick={() => handleAppClick("/skillset")}
            tabIndex={0}
            aria-label="Skillset"
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
            onClick={() => setShowContactForm(!showContactForm)}
            tabIndex={0}
            aria-label="Contact"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setShowContactForm(!showContactForm);
              }
            }}
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </button>
        </div>
      </div>
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}

      {/* AboutMe Modal */}
      {showAboutMe && (
        <AboutMeModal
          onClose={() => setShowAboutMe(false)}
          onOpenContact={() => {
            setShowAboutMe(false);
            setShowContactForm(true);
          }}
          onOpenResume={() => {
            setShowAboutMe(false);
            setShowResume(true);
          }}
        />
      )}

      {/* Resume Modal */}
      {showResume && (
        <div className="modal-overlay" onClick={() => setShowResume(false)}>
          <div
            className="modal-content resume-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setShowResume(false)}
              aria-label="Close Resume"
            >
              ×
            </button>
            <InteractiveResume onClose={() => setShowResume(false)} />
          </div>
        </div>
      )}

      {/* Skillset Modal */}
      {showSkillset && <SkillsetModal onClose={() => setShowSkillset(false)} />}

      {/* Projects Modal */}
      {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} />}
    </div>
  );
};

export default MobileLayout;
