"use client";

import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ASSET_PATHS } from "@/lib/constants/paths";
import services from "@/data/services";
import { useProjects } from "@/hooks";
import {
  PROJECT_ICON_MAP,
  PROJECT_ICON_FALLBACK,
  isImageIcon,
} from "@/lib/constants/projectIcons";
import Image from "next/image";

interface MenuBarProps {
  setShowAboutMe: (show: boolean) => void;
  setShowProjects: (show: boolean) => void;
  setShowSkillset: (show: boolean) => void;
  setSelectedServiceId: (id: string | null) => void;
  setSelectedProjectId: (id: number | null) => void;
  preload: {
    about: () => void;
    contact: () => void;
    projects: () => void;
    skillset: () => void;
  };
  TimeDisplay: React.ComponentType;
}

const MENU_ITEMS = [
  { label: "About", key: "about" },
  { label: "Services", key: "services" },
  { label: "Projects", key: "projects" },
] as const;

const ABOUT_BIO =
  "Product-minded software engineer who bridges strategy, design, and implementation — calm execution, high ownership, and a focus on human-centered systems with measurable outcomes.";

const getServicePreview = (description: string) => {
  const normalizedDescription = description.replace(/\s+/g, " ").trim();
  const firstSentence =
    normalizedDescription.match(/[^.!?]+[.!?]/)?.[0] ?? normalizedDescription;
  if (firstSentence.length <= 110) return firstSentence;
  return `${firstSentence.slice(0, 107).trimEnd()}...`;
};

const MenuBar: React.FC<MenuBarProps> = ({
  setShowAboutMe,
  setShowProjects,
  setShowSkillset,
  setSelectedServiceId,
  setSelectedProjectId,
  preload,
  TimeDisplay,
}) => {
  const menuBarRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { activeProjects } = useProjects();

  const toggleDropdown = (key: string) =>
    setOpenDropdown(openDropdown === key ? null : key);

  const preloadFor = (key: string) => {
    if (key === "about") preload.about();
    else if (key === "projects") preload.projects();
    else if (key === "services") preload.skillset();
  };

  // Close dropdown on outside click (listener only attached while open)
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

  // Close dropdown on Escape from anywhere within the bar
  useEffect(() => {
    if (!openDropdown) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [openDropdown]);

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
        {MENU_ITEMS.map((item) => {
          const isOpen = openDropdown === item.key;
          return (
            <div
              key={item.key}
              className={`menu-item-wrapper${
                isOpen ? " menu-item-wrapper-active" : ""
              }`}
            >
              <button
                type="button"
                className={`menu-item${isOpen ? " menu-item-active" : ""}`}
                onMouseEnter={() => preloadFor(item.key)}
                onFocus={() => preloadFor(item.key)}
                onClick={() => toggleDropdown(item.key)}
                aria-haspopup="menu"
                aria-expanded={isOpen}
              >
                {item.label}
              </button>
              {isOpen && (
                <div
                  className="menu-dropdown"
                  role="menu"
                  aria-label={item.label}
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.key === "about" && (
                    <div className="menu-dropdown-about">
                      <p className="menu-dropdown-about-bio">{ABOUT_BIO}</p>
                      <button
                        type="button"
                        role="menuitem"
                        className="menu-dropdown-about-link"
                        onClick={() => {
                          setShowAboutMe(true);
                          setOpenDropdown(null);
                        }}
                      >
                        Learn more →
                      </button>
                    </div>
                  )}

                  {item.key === "services" && (
                    <ul className="menu-dropdown-services">
                      {services.map((service) => {
                        const openService = () => {
                          setSelectedServiceId(service.id);
                          setShowSkillset(true);
                          setOpenDropdown(null);
                        };
                        return (
                          <li
                            key={service.id}
                            className="menu-dropdown-service-item menu-dropdown-row"
                            role="menuitem"
                            tabIndex={0}
                            onClick={openService}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openService();
                              }
                            }}
                          >
                            {service.icon && (
                              <span className="menu-dropdown-service-icon">
                                <Image
                                  src={service.icon}
                                  alt=""
                                  width={26}
                                  height={26}
                                />
                              </span>
                            )}
                            <div className="menu-dropdown-service-info">
                              <div className="menu-dropdown-service-title">
                                {service.title}
                              </div>
                              <div
                                className="menu-dropdown-service-desc"
                                title={service.description}
                              >
                                {getServicePreview(service.description)}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {item.key === "projects" && (
                    <ul className="menu-dropdown-projects">
                      {activeProjects.map((proj) => {
                        const openProject = () => {
                          setSelectedProjectId(proj.id);
                          setShowProjects(true);
                          setOpenDropdown(null);
                        };
                        let projectVisual: React.ReactNode = null;
                        if (isImageIcon(proj.icon)) {
                          projectVisual = (
                            <span className="menu-dropdown-project-img menu-dropdown-project-img-icon">
                              <Image
                                src={proj.icon as string}
                                alt=""
                                className="menu-dropdown-project-img-media"
                                width={34}
                                height={34}
                              />
                            </span>
                          );
                        } else if (proj.icon) {
                          projectVisual = (
                            <span className="menu-dropdown-project-img menu-dropdown-project-icon">
                              <FontAwesomeIcon
                                icon={
                                  PROJECT_ICON_MAP[proj.icon as string] ||
                                  PROJECT_ICON_FALLBACK
                                }
                              />
                            </span>
                          );
                        } else if (proj.image) {
                          projectVisual = (
                            <Image
                              src={proj.image}
                              alt=""
                              className="menu-dropdown-project-img"
                              width={52}
                              height={52}
                            />
                          );
                        }
                        return (
                          <li
                            key={proj.id}
                            className="menu-dropdown-project-item menu-dropdown-row"
                            role="menuitem"
                            tabIndex={0}
                            onClick={openProject}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openProject();
                              }
                            }}
                          >
                            {projectVisual}
                            <div className="menu-dropdown-project-info">
                              <div className="menu-dropdown-project-title">
                                {proj.name}
                              </div>
                              <div className="menu-dropdown-project-desc">
                                {proj.description}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="menu-right">
        <TimeDisplay />
      </div>
    </div>
  );
};

export default MenuBar;
