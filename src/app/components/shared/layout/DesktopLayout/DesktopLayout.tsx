"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCog,
  faLaptopCode,
  faEnvelope,
  faBriefcase,
  faPaw,
  // faTheaterMasks,
  // faRobot,
  // faMusic,
  // faCookieBite,
  // faFilm,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import ContactForm from "@/components/features/contact/ContactForm/ContactForm";
import { ASSET_PATHS } from "@/lib/constants/paths";
import { projectsData } from "@/data/projects";
import services from "@/data/services";
import {
  faFigma,
  faWebflow,
  faGit,
  faReact,
  faJs,
  faCss3,
  faHtml5,
  faGithub,
  faNode,
  faNpm,
  faPython,
  faAws,
  faDocker,
  faLinux,
  faSlack,
  faJira,
  faMarkdown,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { aboutMePills } from "@/components/shared/AboutMe/aboutMePills";
import "./DesktopLayout.css";

const DesktopLayout = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showWelcomeWindow, setShowWelcomeWindow] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuBarRef.current &&
        !menuBarRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", checkMobile);
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

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
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

  const desktopApps = [
    { name: "Mindset", icon: faUser, path: "/mindset" },
    { name: "Skillset", icon: faCog, path: "/skillset" },
    { name: "Projects", icon: faLaptopCode, path: "/projects" },
    // { name: "Resume", icon: faFileAlt, path: "/resume" },
    { name: "Contact", icon: faEnvelope, path: "/contact" },
  ];

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

  if (isMobile) {
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
                    {app.icon && typeof app.icon !== "number" && (
                      <FontAwesomeIcon icon={app.icon} />
                    )}
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
  }

  return (
    <div className="macintosh-container">
      <div className="mac-screen">
        <div className="menu-bar" ref={menuBarRef}>
          <div className="menu-left">
            <Image
              className="my-logo"
              alt="portfolio-logo"
              src={`${ASSET_PATHS.LOGOS}/PORTFOLIO_LOGO.png`}
              width={24}
              height={24}
            />
            {[
              { label: "About", key: "about" },
              { label: "Projects", key: "projects" },
              { label: "Tech Stack", key: "tech" },
              { label: "Services", key: "services" },
              { label: "Contact", key: "contact" },
            ].map((item, idx, arr) => (
              <div
                key={item.key}
                className={`menu-item-wrapper${
                  openDropdown === item.key ? " menu-item-wrapper-active" : ""
                }`}
                data-menu-index={idx}
                style={{
                  zIndex: openDropdown === item.key ? 1010 : 1,
                  marginRight: idx < arr.length - 1 ? 16 : 0,
                }}
              >
                <span
                  className={`menu-item${
                    openDropdown === item.key ? " menu-item-active" : ""
                  }`}
                  tabIndex={0}
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.key ? null : item.key)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setOpenDropdown(
                        openDropdown === item.key ? null : item.key
                      );
                    if (e.key === "Escape") setOpenDropdown(null);
                  }}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === item.key}
                >
                  {item.label}
                </span>
                {openDropdown === item.key && (
                  <div
                    className={`menu-dropdown menu-dropdown-mac${
                      openDropdown === item.key
                        ? " menu-dropdown-mac-active"
                        : ""
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.key === "about" && (
                      <div>
                        <strong className="menu-dropdown-title">
                          About Me
                        </strong>
                        <ul className="menu-dropdown-pills">
                          {aboutMePills.map((pill) => (
                            <li
                              key={pill.label}
                              className="menu-dropdown-pill-item"
                            >
                              <span
                                className="pill-tag-mac"
                                tabIndex={0}
                                onMouseEnter={(e) => {
                                  const tooltip =
                                    e.currentTarget.querySelector(
                                      ".pill-tooltip-mac"
                                    );
                                  if (tooltip)
                                    tooltip.setAttribute("data-show", "true");
                                }}
                                onMouseLeave={(e) => {
                                  const tooltip =
                                    e.currentTarget.querySelector(
                                      ".pill-tooltip-mac"
                                    );
                                  if (tooltip)
                                    tooltip.removeAttribute("data-show");
                                }}
                                onFocus={(e) => {
                                  const tooltip =
                                    e.currentTarget.querySelector(
                                      ".pill-tooltip-mac"
                                    );
                                  if (tooltip)
                                    tooltip.setAttribute("data-show", "true");
                                }}
                                onBlur={(e) => {
                                  const tooltip =
                                    e.currentTarget.querySelector(
                                      ".pill-tooltip-mac"
                                    );
                                  if (tooltip)
                                    tooltip.removeAttribute("data-show");
                                }}
                              >
                                <span className="pill-tag-label">
                                  {pill.label}
                                </span>
                                <span className="pill-tag-arrow">&gt;</span>
                                <span className="pill-tooltip-mac">
                                  {pill.tooltip}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.key === "projects" && (
                      <div>
                        <strong className="menu-dropdown-title">
                          Projects
                        </strong>
                        <ul className="menu-dropdown-projects">
                          {projectsData
                            .filter((p) => !p.archived)
                            .map((proj) => (
                              <li
                                key={proj.id}
                                className="menu-dropdown-project-item"
                              >
                                {proj.image && (
                                  <Image
                                    src={proj.image}
                                    alt={proj.name}
                                    className="menu-dropdown-project-img"
                                    width={38}
                                    height={38}
                                  />
                                )}
                                <div className="menu-dropdown-project-info">
                                  <div className="menu-dropdown-project-title">
                                    {proj.name}
                                  </div>
                                  <div className="menu-dropdown-project-desc">
                                    {proj.description}
                                  </div>
                                  <a
                                    href={proj.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="menu-dropdown-project-link"
                                  >
                                    Visit
                                  </a>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    {item.key === "tech" && (
                      <div>
                        <strong className="menu-dropdown-title">
                          Tech Stack
                        </strong>
                        <div className="menu-dropdown-tech-icons">
                          {[
                            { icon: faFigma, tooltip: "Figma" },
                            { icon: faWebflow, tooltip: "Webflow" },
                            { icon: faGit, tooltip: "Git" },
                            { icon: faNode, tooltip: "Node.js" },
                            { icon: faReact, tooltip: "React" },
                            { icon: faJs, tooltip: "JavaScript" },
                            { icon: faCss3, tooltip: "CSS" },
                            { icon: faHtml5, tooltip: "HTML5" },
                            { icon: faGithub, tooltip: "GitHub" },
                            { icon: faNpm, tooltip: "NPM" },
                            { icon: faPython, tooltip: "Python" },
                            { icon: faAws, tooltip: "AWS" },
                            { icon: faDocker, tooltip: "Docker" },
                            { icon: faLinux, tooltip: "Linux" },
                            { icon: faSlack, tooltip: "Slack" },
                            { icon: faJira, tooltip: "Jira" },
                            { icon: faMarkdown, tooltip: "Markdown" },
                          ].map((item) => (
                            <span
                              key={item.tooltip}
                              className="menu-dropdown-tech-icon"
                              title={item.tooltip}
                            >
                              <FontAwesomeIcon icon={item.icon} />
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.key === "services" && (
                      <div>
                        <strong className="menu-dropdown-title">
                          Services
                        </strong>
                        <ul className="menu-dropdown-services">
                          {services.map((service) => (
                            <li
                              key={service.id}
                              className="menu-dropdown-service-item"
                            >
                              {service.icon && (
                                <Image
                                  src={service.icon}
                                  alt={service.title}
                                  className="menu-dropdown-service-icon"
                                  width={38}
                                  height={38}
                                />
                              )}
                              <div className="menu-dropdown-service-info">
                                <div className="menu-dropdown-service-title">
                                  {service.title}
                                </div>
                                <div className="menu-dropdown-service-desc">
                                  {service.description}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.key === "contact" && (
                      <div className="menu-dropdown-contactform">
                        <ContactForm
                          onClose={() => setShowContactForm(false)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="menu-right">
            <span className="time">{formatTime(currentTime)}</span>
            <span className="date">{formatDate(currentTime)}</span>
          </div>
        </div>
        <div className="desktop">
          <div className="desktop-items">
            {desktopApps.map((app) => (
              <button
                key={app.name}
                className="desktop-icon"
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
                <div className="icon-image">
                  <FontAwesomeIcon icon={app.icon} />
                </div>
                <span className="icon-label">{app.name}</span>
              </button>
            ))}
          </div>

          {showWelcomeWindow && (
            <div className="welcome-window">
              <div className="window-title-bar">
                <div className="window-controls">
                  <button
                    className="close-btn"
                    onClick={handleWelcomeWindowClose}
                    aria-label="Close welcome window"
                  ></button>
                </div>
                <span className="window-title">Welcome to My Portfolio</span>
              </div>
              <div className="window-content">
                <h2>Hello, I&#39;m Demaceo Vincent</h2>
                <p>
                  Click on the icons to explore my work, learn about me, and how
                  best to reach out.
                </p>
                <div className="quick-links">
                  <button onClick={() => handleAppClick("/mindset")}>
                    About Me
                  </button>
                  <button onClick={() => handleAppClick("/projects")}>
                    View Projects
                  </button>
                  <button onClick={() => handleAppClick("/contact")}>
                    Contact
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="taskbar">
          <div className="start-menu">Machina Ex Demaceo</div>
          <div className="running-apps">
            <div className="app-tab active">Finder</div>
            <div className="app-tab">Portfolio</div>
          </div>
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

export default DesktopLayout;
