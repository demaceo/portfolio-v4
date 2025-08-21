"use client";

import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { aboutMePills } from "@/data/aboutMePills";
import { ASSET_PATHS } from "@/lib/constants/paths";
import { projectsData } from "@/data/projects";
import services from "@/data/services";
// import tools from "@/data/toolbelt";
import Image from "next/image";

interface SelectedProject {
  id: number;
  name: string;
  description: string;
  image?: string;
  link: string;
}

interface SelectedService {
  icon: string;
  title: string;
  description: string;
}

interface MenuBarProps {
  openDropdown: string | null;
  setOpenDropdown: (dropdown: string | null) => void;
  hoveredTechCategory: string | null;
  setHoveredTechCategory: (category: string | null) => void;
  setShowAboutMe: (show: boolean) => void;
  setSelectedService: (service: SelectedService | null) => void;
  setSelectedProject: (project: SelectedProject | null) => void;
  setShowSkillset: (show: boolean) => void;
  setShowContactForm: (show: boolean) => void;
  preload: {
    about: () => void;
    contact: () => void;
    projects: () => void;
    skillset: () => void;
  };
  TimeDisplay: React.ComponentType;
}

const MenuBar: React.FC<MenuBarProps> = ({
  openDropdown,
  setOpenDropdown,
  // hoveredTechCategory,
  // setHoveredTechCategory,
  setShowAboutMe,
  setSelectedService,
  setSelectedProject,
  // setShowSkillset,
  setShowContactForm,
  preload,
  TimeDisplay,
}) => {
  const menuBarRef = useRef<HTMLDivElement>(null);

  const iconMap = {
    "fa fa-paw icon": faLaptopCode,
    "fas fa-theater-masks icon": faLaptopCode,
    "fas fa-robot icon": faLaptopCode,
    "fas fa-music icon": faLaptopCode,
    "fas fa-cookie-bite icon": faLaptopCode,
    "fas fa-film icon": faLaptopCode,
  };

  // Define category order and display names for tech stack
  // const techStackCategories = [
  //   { key: "Frontend", name: "Frontend Development" },
  //   { key: "Backend", name: "Backend Development" },
  //   { key: "DevOps", name: "DevOps & Version Control" },
  //   { key: "Cloud", name: "Cloud & Infrastructure" },
  //   { key: "Design", name: "Design Tools" },
  //   { key: "Package Management", name: "Package Management" },
  //   { key: "Collaboration", name: "Collaboration" },
  //   { key: "Project Management", name: "Project Management" },
  //   { key: "Documentation", name: "Documentation & Testing" },
  // ];

  // Memoized grouping of tools by category
  // const groupedTools = React.useMemo(() => {
  //   return tools.reduce((acc, tool) => {
  //     if (!acc[tool.category]) acc[tool.category] = [];
  //     acc[tool.category].push(tool);
  //     return acc;
  //   }, {} as Record<string, typeof tools>);
  // }, []);

  // Helper function to render category item
  // const renderCategoryItem = (category: { key: string; name: string }) => {
  //   const categoryTools = groupedTools[category.key] || [];

  //   if (categoryTools.length === 0) return null;

  //   return (
  //     <div
  //       key={category.key}
  //       className="tech-category-item"
  //       onMouseEnter={() => setHoveredTechCategory(category.key)}
  //       onMouseLeave={() => setHoveredTechCategory(null)}
  //     >
  //       <div className="tech-category-main">
  //         <span className="tech-category-name">{category.name}</span>
  //         <span className="tech-category-count">({categoryTools.length})</span>
  //       </div>

  //       {hoveredTechCategory === category.key && (
  //         <div className="tech-tools-submenu">
  //           <div className="tech-tools-grid">
  //             {categoryTools.map((tool, index) => (
  //               <div
  //                 key={`${category.key}-${index}`}
  //                 className="tech-tool-item"
  //                 title={tool.tooltip}
  //               >
  //                 <FontAwesomeIcon
  //                   icon={tool.icon}
  //                   className="tech-tool-icon"
  //                 />
  //                 <span className="tech-tool-name">{tool.tooltip}</span>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

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
  }, [openDropdown, setOpenDropdown]);

  return (
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
          { label: "Services", key: "services" },
          // { label: "Tech Stack", key: "tech" },
          { label: "Projects", key: "projects" },
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
              onMouseEnter={() => {
                if (item.key === "about") preload.about();
                if (item.key === "projects") preload.projects();
                if (item.key === "contact") preload.contact();
                if (item.key === "tech" || item.key === "services")
                  preload.skillset();
              }}
              onClick={() =>
                setOpenDropdown(openDropdown === item.key ? null : item.key)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setOpenDropdown(openDropdown === item.key ? null : item.key);
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
                  openDropdown === item.key ? " menu-dropdown-mac-active" : ""
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
                                setOpenDropdown(null);
                              } else if (pill.link) {
                                window.open(pill.link, "_blank");
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                if (pill.label === "& more...") {
                                  setShowAboutMe(true);
                                  setOpenDropdown(null);
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
                              if (tooltip) tooltip.removeAttribute("data-show");
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
                              if (tooltip) tooltip.removeAttribute("data-show");
                            }}
                          >
                            <span className="pill-tag-label">{pill.label}</span>
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
                                      icon={iconMap[proj.icon as keyof typeof iconMap] || faLaptopCode}
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
                              {/* <a
                                href={proj.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="menu-dropdown-project-link"
                              >
                                Visit
                              </a> */}
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                {/* {item.key === "tech" && (
                  <div>
                    <div className="menu-dropdown-tech-categories">
                      {techStackCategories.map((category) =>
                        renderCategoryItem(category)
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
                )} */}
                {item.key === "contact" && (
                  <div className="menu-dropdown-contact-info">
                    <div className="contact-info-text">
                      <p>Ready to connect? Let&apos;s start a conversation!</p>
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
        <TimeDisplay />
      </div>
    </div>
  );
};

export default MenuBar;
