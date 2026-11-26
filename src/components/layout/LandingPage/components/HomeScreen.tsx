"use client";

import React, { useMemo, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faPlay } from "@fortawesome/free-solid-svg-icons";
import ProjectMedia from "@/components/features/portfolio/shared/ProjectMedia";
import { useProjects } from "@/hooks";
import { APP_PATHS } from "@/lib/constants/appRoutes";
import { HOME_SCREEN_PROJECT_SLUGS } from "@/data/homeScreenProjects";
import { FEATURED_LINKS } from "@/data/featuredLinks";
import "./HomeScreen.css";

export interface HomeScreenProps {
  onOpenProject: (id: number) => void;
  handleAppClick: (path: string, isToggle?: boolean) => void;
  maybePreloadByPath: (path: string) => void;
}

const MAX_TILT_DEG = 14;

/**
 * Cursor-following 3D tilt, written straight to CSS custom properties on the
 * tile so a pointer move never re-renders React. Mouse/pen only: on touch the
 * tile gets a press-down instead (see HomeScreen.css), and reduced motion
 * turns the transform off entirely in CSS.
 */
function handleTilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty("--ry", `${(x * MAX_TILT_DEG * 2).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${(-y * MAX_TILT_DEG * 2).toFixed(2)}deg`);
  el.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
  el.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
}

function resetTilt(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  el.style.removeProperty("--rx");
  el.style.removeProperty("--ry");
}

interface TileProps {
  label: string;
  /** Full accessible name, when the visible label alone is too terse. */
  ariaLabel?: string;
  accent?: string;
  badge?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  /** Renders a real link (new tab) instead of a button. */
  href?: string;
  onPreload?: () => void;
}

const Tile: React.FC<TileProps> = ({ label, ariaLabel, accent, badge, children, onClick, href, onPreload }) => {
  const shared = {
    className: "home-tile",
    "aria-label": ariaLabel,
    style: accent ? ({ "--tile-accent": accent } as CSSProperties) : undefined,
    onPointerMove: handleTilt,
    onPointerLeave: resetTilt,
    onPointerEnter: onPreload,
    onFocus: onPreload,
  };
  const body = (
    <>
      <span className="home-tile-icon">
        <span className="icon-glass">
          <span className="icon-glass-base" />
          <span className="icon-glass-border" />
          <span className="icon-glass-content">{children}</span>
          <span className="home-tile-glare" />
        </span>
        {badge && (
          <span className="home-tile-badge" aria-hidden="true">
            {badge}
          </span>
        )}
      </span>
      <span className="home-tile-label">{label}</span>
    </>
  );

  return href ? (
    <a {...shared} href={href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <button {...shared} type="button" onClick={onClick}>
      {body}
    </button>
  );
};

/**
 * The desktop/phone home screen: a grid of glass app icons for a hand-picked
 * set of projects (HOME_SCREEN_PROJECT_SLUGS), plus a Featured row of media
 * links (FEATURED_LINKS). Project icons open that project's detail in the
 * Projects app; Featured tiles open the documentary player or a new tab.
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenProject, handleAppClick, maybePreloadByPath }) => {
  const { activeProjects } = useProjects();
  const projects = useMemo(() => {
    const bySlug = new Map(activeProjects.map((p) => [p.slug, p]));
    return HOME_SCREEN_PROJECT_SLUGS.flatMap((slug) => {
      const project = bySlug.get(slug);
      return project ? [project] : [];
    });
  }, [activeProjects]);

  const preloadProjects = () => maybePreloadByPath(APP_PATHS.projects);

  return (
    <div className="home-screen">
      <nav aria-labelledby="home-projects-heading" className="home-section">
        <h2 id="home-projects-heading" className="home-section-title">
          Projects
        </h2>
        <ul className="home-grid">
          {projects.map((project) => (
            <li key={project.id}>
              <Tile
                label={project.name}
                ariaLabel={`${project.name}, project details`}
                onClick={() => onOpenProject(project.id)}
                onPreload={preloadProjects}
              >
                <ProjectMedia
                  project={project}
                  decorative
                  applyIconScale
                  preferIcon
                  sizes="96px"
                  iconImageClassName="home-tile-img"
                  heroImageClassName="home-tile-cover"
                  faIconClassName="home-tile-glyph"
                />
              </Tile>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-labelledby="home-featured-heading" className="home-section">
        <h2 id="home-featured-heading" className="home-section-title">
          Featured
        </h2>
        <ul className="home-grid">
          {FEATURED_LINKS.map((link) => {
            const external = link.path.startsWith("http");
            return (
              <li key={link.key}>
                <Tile
                  label={link.label}
                  ariaLabel={external ? `${link.title} (opens in a new tab)` : link.title}
                  accent={link.color}
                  badge={<FontAwesomeIcon icon={external ? faArrowUpRightFromSquare : faPlay} />}
                  href={external ? link.path : undefined}
                  onClick={external ? undefined : () => handleAppClick(link.path)}
                >
                  <FontAwesomeIcon icon={link.icon} className="home-tile-fa" aria-hidden="true" />
                </Tile>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default HomeScreen;
