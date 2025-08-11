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
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import dynamic from "next/dynamic";
import { ASSET_PATHS, EXTERNAL_LINKS } from "@/lib/constants/paths";
import Image from "next/image";
import "./MobileLayout.css";

const LoadingModal = () => {
  return <></>;
};

// Idle and intent-based preloading
type RequestIdleCallback = (cb: () => void) => number | undefined;
const idle: RequestIdleCallback = (cb) => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void) => number;
  };
  if (typeof w.requestIdleCallback === "function")
    return w.requestIdleCallback(cb);
  return window.setTimeout(cb, 1);
};

const preload = {
  contact: () => import("@/features/contact/ContactForm/ContactForm"),
  about: () => import("@/features/about/AboutMeModal/AboutMeModal"),
  skillset: () => import("@/features/skills/SkillsetModal/SkillsetModal"),
  projects: () => import("@/features/portfolio/ProjectsModal/ProjectsModal"),
  documentary: () =>
    import("@/features/media").then((m) => m.DocumentaryPlayer),
};

// On-intent network warmup for PBS iframe origin
const ensurePBSPreconnect = () => {
  if (typeof document === "undefined") return;
  const href = "https://player.pbs.org";
  if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
    const l = document.createElement("link");
    l.rel = "preconnect";
    l.href = href;
    l.crossOrigin = "anonymous";
    document.head.appendChild(l);
  }
  if (!document.querySelector(`link[rel="dns-prefetch"][href="${href}"]`)) {
    const d = document.createElement("link");
    d.rel = "dns-prefetch";
    d.href = href;
    document.head.appendChild(d);
  }
};

const ContactForm = dynamic(
  () => import("@/features/contact/ContactForm/ContactForm"),
  {
    loading: () => <LoadingModal />,
  }
);
const AboutMeModal = dynamic(
  () => import("@/features/about/AboutMeModal/AboutMeModal"),
  {
    loading: () => <LoadingModal />,
  }
);
const SkillsetModal = dynamic(
  () => import("@/features/skills/SkillsetModal/SkillsetModal"),
  {
    loading: () => <LoadingModal />,
  }
);
const ProjectsModal = dynamic(
  () => import("@/features/portfolio/ProjectsModal/ProjectsModal"),
  {
    loading: () => <LoadingModal />,
  }
);
const DocumentaryPlayer = dynamic(
  () => import("@/features/media").then((m) => m.DocumentaryPlayer),
  {
    ssr: false,
    loading: () => <LoadingModal />,
  }
);

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

  // Warm common modals after initial render
  React.useEffect(() => {
    idle(() => preload.about());
    idle(() => preload.contact());
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
      setShowContactNotification(false);
    } else if (path === "/mindset") {
      setShowAboutMe(true);
    } else if (path === "/skillset") {
      setShowSkillset(true);
    } else if (path === "/projects") {
      setShowProjects(true);
    } else if (path === "/documentary") {
      ensurePBSPreconnect();
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
    { name: "Mindset", icon: faUser, path: "/mindset" },
    { name: "Skillset", icon: faCog, path: "/skillset" },
    { name: "Projects", icon: faLaptopCode, path: "/projects" },
    { name: "Docuseries", icon: faFilm, path: "/documentary" },
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
                onMouseEnter={() => {
                  if (app.path === "/mindset") preload.about();
                  if (app.path === "/skillset") preload.skillset();
                  if (app.path === "/projects") preload.projects();
                  if (app.path === "/documentary") {
                    ensurePBSPreconnect();
                    preload.documentary();
                  }
                }}
                onTouchStart={() => {
                  if (app.path === "/mindset") preload.about();
                  if (app.path === "/skillset") preload.skillset();
                  if (app.path === "/projects") preload.projects();
                  if (app.path === "/documentary") {
                    ensurePBSPreconnect();
                    preload.documentary();
                  }
                }}
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
            onClick={() => handleAppClick(EXTERNAL_LINKS.LINKEDIN)}
            tabIndex={0}
            aria-label="LinkedIn"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAppClick(EXTERNAL_LINKS.LINKEDIN);
              }
            }}
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </button>
          <button
            className="dock-app"
            type="button"
            onClick={() => handleAppClick(EXTERNAL_LINKS.CALENDLY)}
            tabIndex={0}
            aria-label="Schedule Meeting"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAppClick(EXTERNAL_LINKS.CALENDLY);
              }
            }}
          >
            <FontAwesomeIcon icon={faCalendarDays} />
          </button>
          <button
            className="dock-app"
            type="button"
            onMouseEnter={() => preload.contact()}
            onTouchStart={() => preload.contact()}
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
