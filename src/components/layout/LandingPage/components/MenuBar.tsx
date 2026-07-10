"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { aboutMePills } from "@/data/aboutMePills";
import { ASSET_PATHS } from "@/lib/constants/paths";
import { projectsData } from "@/data/projects";
import services from "@/data/services";
import {
  PROJECT_ICON_MAP,
  PROJECT_ICON_FALLBACK,
  isImageIcon,
} from "@/lib/constants/projectIcons";
import Image from "next/image";

interface MenuBarProps {
  openDropdown: string | null;
  setOpenDropdown: (dropdown: string | null) => void;
  setShowAboutMe: (show: boolean) => void;
  setShowProjects: (show: boolean) => void;
  setShowSkillset: (show: boolean) => void;
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

const getServicePreview = (description: string) => {
  const normalizedDescription = description.replace(/\s+/g, " ").trim();
  const firstSentence =
    normalizedDescription.match(/[^.!?]+[.!?]/)?.[0] ?? normalizedDescription;
  if (firstSentence.length <= 110) return firstSentence;
  return `${firstSentence.slice(0, 107).trimEnd()}...`;
};

const MenuBar: React.FC<MenuBarProps> = ({
  openDropdown,
  setOpenDropdown,
  setShowAboutMe,
  setShowProjects,
  setShowSkillset,
  preload,
  TimeDisplay,
}) => {
  const menuBarRef = useRef<HTMLDivElement>(null);

  const activeProjects = useMemo(
    () => projectsData.filter((p) => !p.archived),
    []
  );

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
  }, [openDropdown, setOpenDropdown]);

  // Close dropdown on Escape from anywhere within the bar
  useEffect(() => {
    if (!openDropdown) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
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
                  className="menu-dropdown menu-dropdown-mac"
                  role="menu"
                  aria-label={item.label}
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.key === "about" && (
                    <ul className="menu-dropdown-pills">
                      {aboutMePills.map((pill) => {
                        const isAction =
                          pill.label === "& more..." || Boolean(pill.link);
                        const handleAction = () => {
                          if (pill.label === "& more...") {
                            setShowAboutMe(true);
                            setOpenDropdown(null);
                          } else if (pill.link) {
                            window.open(
                              pill.link,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        };
                        return (
                          <li
                            key={pill.label}
                            className="menu-dropdown-pill-item"
                          >
                            <span
                              className={`pill-tag-mac${
                                isAction ? " pill-tag-clickable" : ""
                              }`}
                              title={pill.tooltip}
                              {...(isAction
                                ? {
                                    role: "menuitem",
                                    tabIndex: 0,
                                    onClick: handleAction,
                                    onKeyDown: (
                                      e: React.KeyboardEvent
                                    ) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleAction();
                                      }
                                    },
                                  }
                                : {})}
                            >
                              {pill.icon && (
                                <div className="pill-tag-icon">
                                  <Image
                                    src={pill.icon}
                                    alt=""
                                    width={20}
                                    height={20}
                                  />
                                </div>
                              )}
                              <span className="pill-tag-label">
                                {pill.label}
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {item.key === "services" && (
                    <ul className="menu-dropdown-services">
                      {services.map((service) => {
                        const openSkillset = () => {
                          setShowSkillset(true);
                          setOpenDropdown(null);
                        };
                        return (
                          <li
                            key={service.id}
                            className="menu-dropdown-service-item"
                            role="menuitem"
                            tabIndex={0}
                            onClick={openSkillset}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openSkillset();
                              }
                            }}
                          >
                            {service.icon && (
                              <Image
                                src={service.icon}
                                alt=""
                                className="menu-dropdown-service-icon"
                                width={38}
                                height={38}
                              />
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
                        const openProjects = () => {
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
                                width={50}
                                height={50}
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
                              width={78}
                              height={78}
                            />
                          );
                        }
                        return (
                          <li
                            key={proj.id}
                            className="menu-dropdown-project-item"
                            role="menuitem"
                            tabIndex={0}
                            onClick={openProjects}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openProjects();
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
