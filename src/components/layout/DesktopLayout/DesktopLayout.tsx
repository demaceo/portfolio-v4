"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faPaw,
  faTheaterMasks,
  faRobot,
  faMusic,
  faCookieBite,
  faFilm,
  faUser,
  faCog,
  faLaptopCode,
  faEnvelope,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { aboutMePills } from "@/data/aboutMePills";
import ContactForm from "@/features/contact/ContactForm/ContactForm";
import InteractiveResume from "@/features/resume/InteractiveResume/InteractiveResume";
import { ASSET_PATHS } from "@/lib/constants/paths";
import { projectsData } from "@/data/projects";
import services from "@/data/services";
import tools from "@/data/toolbelt";
import Image from "next/image";
import "./DesktopLayout.css";
import "./DesktopLayout.menu.css";
import ServiceCard from "@/features/skills/ServiceCard/ServiceCard";
import ProjectCard from "@/features/portfolio/ProjectCard/ProjectCard";
import AboutMeModal from "@/features/about/AboutMeModal/AboutMeModal";
import SkillsetModal from "@/features/skills/SkillsetModal/SkillsetModal";
import ProjectsModal from "@/features/portfolio/ProjectsModal/ProjectsModal";

const HomeScreen = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  // const [isMobile, setIsMobile] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showWelcomeWindow, setShowWelcomeWindow] = useState(true);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showSkillset, setShowSkillset] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
    description: string;
    image?: string;
    link: string;
  } | null>(null);
  const [selectedService, setSelectedService] = useState<{
    icon: string;
    title: string;
    description: string;
  } | null>(null);

  const iconMap: Record<string, IconDefinition> = {
    // "fas fa-briefcase icon": faBriefcase,
    "fa fa-paw icon": faPaw,
    "fas fa-theater-masks icon": faTheaterMasks,
    "fas fa-robot icon": faRobot,
    "fas fa-music icon": faMusic,
    "fas fa-cookie-bite icon": faCookieBite,
    "fas fa-film icon": faFilm,
  };

  const menuBarRef = useRef<HTMLDivElement>(null);

  // Define category order and display names for tech stack
  const techStackCategories = [
    { key: "Frontend", name: "Frontend", limit: 6 },
    { key: "Backend", name: "Backend", limit: 4 },
    { key: "DevOps", name: "DevOps", limit: 4 },
    { key: "Cloud", name: "Cloud", limit: 4 },
    { key: "Design", name: "Design", limit: 3 },
  ];

  // Helper function to group tools by category
  const getGroupedTools = () => {
    return tools.reduce((acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    }, {} as Record<string, typeof tools>);
  };

  // Helper function to render tech category
  const renderTechCategory = (
    category: { key: string; name: string; limit: number },
    groupedTools: Record<string, typeof tools>
  ) => {
    const categoryTools = groupedTools[category.key] || [];
    const displayTools = categoryTools.slice(0, category.limit);

    if (displayTools.length === 0) return null;

    return (
      <div key={category.key} className="tech-category">
        <div className="tech-category-label">{category.name}</div>
        <div className="tech-category-icons">
          {displayTools.map((tool, index) => (
            <span
              key={`${category.key}-${index}`}
              className="menu-dropdown-tech-icon"
              title={tool.tooltip}
            >
              <FontAwesomeIcon icon={tool.icon} />
            </span>
          ))}
          {categoryTools.length > category.limit && (
            <span
              className="tech-more-indicator"
              title={`+${
                categoryTools.length - category.limit
              } more ${category.name.toLowerCase()} tools`}
            >
              +{categoryTools.length - category.limit}
            </span>
          )}
        </div>
      </div>
    );
  };

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

  const desktopApps = [
    { name: "Mindset", icon: faUser, path: "/mindset" },
    { name: "Skillset", icon: faCog, path: "/skillset" },
    { name: "Projects", icon: faLaptopCode, path: "/projects" },
    // { name: "Resume", icon: faFileAlt, path: "/resume" },
    { name: "Contact", icon: faEnvelope, path: "/contact", isToggle: true },
  ];

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
              { label: "Tech Stack", key: "tech" },
              { label: "Projects", key: "projects" },
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
                        <ul className="menu-dropdown-pills">
                          {aboutMePills.map((pill) => (
                            <li
                              key={pill.label}
                              className="menu-dropdown-pill-item"
                            >
                              <span
                                className={`pill-tag-mac ${
                                  pill.label === "& more..."
                                    ? "pill-tag-clickable"
                                    : ""
                                }`}
                                tabIndex={0}
                                onClick={() => {
                                  if (pill.label === "& more...") {
                                    setShowAboutMe(true);
                                    setOpenDropdown(null); // Close the dropdown
                                  } else if (pill.link) {
                                    window.open(pill.link, "_blank");
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    if (pill.label === "& more...") {
                                      setShowAboutMe(true);
                                      setOpenDropdown(null); // Close the dropdown
                                    } else if (pill.link) {
                                      window.open(pill.link, "_blank");
                                    }
                                  }
                                }}
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
                                <span className="pill-tooltip-mac">
                                  {pill.tooltip}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.key === "services" && (
                      <div>
                        <ul className="menu-dropdown-services">
                          {services.map((service) => (
                            <li
                              key={service.id}
                              className="menu-dropdown-service-item"
                              onClick={() =>
                                setSelectedService({
                                  icon: service.icon,
                                  title: service.title,
                                  description: service.description,
                                })
                              }
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
                    {item.key === "projects" && (
                      <div>
                        <ul className="menu-dropdown-projects">
                          {projectsData
                            .filter((p) => !p.archived)
                            .map((proj) => (
                              <li
                                key={proj.id}
                                className="menu-dropdown-project-item"
                                onClick={() =>
                                  setSelectedProject({
                                    id: proj.id,
                                    name: proj.name,
                                    description: proj.description,
                                    image:
                                      typeof proj.image === "string"
                                        ? proj.image
                                        : proj.image?.src,
                                    link: proj.link,
                                  })
                                }
                              >
                                {(() => {
                                  let projectVisual = null;
                                  if (proj.image) {
                                    projectVisual = (
                                      <Image
                                        src={proj.image}
                                        alt={proj.name}
                                        className="menu-dropdown-project-img"
                                        width={38}
                                        height={38}
                                      />
                                    );
                                  } else if (proj.icon) {
                                    projectVisual = (
                                      <span
                                        className="menu-dropdown-project-img"
                                        style={{
                                          fontSize: 28,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <FontAwesomeIcon
                                          icon={
                                            iconMap[proj.icon] || faLaptopCode
                                          }
                                        />
                                      </span>
                                    );
                                  }
                                  return projectVisual;
                                })()}
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
                        <div className="menu-dropdown-tech-categories">
                          {techStackCategories.map((category) =>
                            renderTechCategory(category, getGroupedTools())
                          )}
                          <div className="tech-view-all">
                            <button
                              className="tech-view-all-btn"
                              onClick={() => {
                                setShowSkillset(true);
                                setOpenDropdown(null);
                              }}
                              title="View complete tech stack"
                            >
                              View All Tools & Skills
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {item.key === "contact" && (
                      <div className="menu-dropdown-contact-info">
                        <div className="contact-info-text">
                          <p>
                            Ready to connect? Let&apos;s start a conversation!
                          </p>
                        </div>
                        <button
                          className="contact-trigger-btn"
                          onClick={() => {
                            setShowContactForm(true);
                            setOpenDropdown(null);
                          }}
                        >
                          Open Contact Form
                        </button>
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
                onClick={() => handleAppClick(app.path, app.isToggle)}
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
                  Click around to explore my work, learn about me, what services
                  I offer, and how to best reach out!
                </p>
                <div className="quick-links">
                  <button onClick={() => handleAppClick("/mindset")}>
                    About Me
                  </button>
                  <button onClick={() => handleAppClick("/skillset")}>
                    Service Spectrum
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
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
      {selectedProject && (
        <ProjectCard
          id={selectedProject.id}
          name={selectedProject.name}
          description={selectedProject.description}
          image={selectedProject.image}
          link={selectedProject.link}
          onClose={() => setSelectedProject(null)}
        />
      )}
      {selectedService && (
        <ServiceCard
          icon={selectedService.icon}
          title={selectedService.title}
          description={selectedService.description}
          onClose={() => setSelectedService(null)}
        />
      )}
      {showAboutMe && (
        <AboutMeModal
          onClose={() => setShowAboutMe(false)}
          onOpenContact={() => setShowContactForm(true)}
          onOpenResume={() => setShowResume(true)}
        />
      )}
      {showResume && <InteractiveResume onClose={() => setShowResume(false)} />}
      {showSkillset && <SkillsetModal onClose={() => setShowSkillset(false)} />}
      {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} />}
    </div>
  );
};

export default HomeScreen;
