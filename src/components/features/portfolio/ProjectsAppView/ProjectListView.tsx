"use client";

import type { CSSProperties } from "react";
import { Project } from "@/lib/types";
import ProjectMedia from "../shared/ProjectMedia";
import { cornerColorFor, DOC_CORNER_COLOR } from "../shared/cornerColor";
import styles from "./ProjectListView.module.css";

interface ProjectListViewProps {
  projects: Project[];
  onOpen: (id: number) => void;
}

/**
 * Mobile (≤480px) stand-in for the two 3D carousels: a plain scrollable
 * list of rows, since a drag/hover-oriented carousel doesn't translate well
 * to a small touchscreen. Shares the same projects/onOpen contract as
 * ProjectSpinningCarousel and ProjectCoverflow, so it opens the same
 * ProjectDetailModal via the same id-based callback.
 */
const ProjectListView: React.FC<ProjectListViewProps> = ({ projects, onOpen }) => {
  if (projects.length === 0) return null;

  return (
    <ul className={styles.list}>
      {projects.map((project, i) => {
        const cornerColor =
          project.type === "documentary" ? DOC_CORNER_COLOR : cornerColorFor(i, projects.length);

        return (
          <li key={project.id} className={styles.row}>
            <button
              type="button"
              className={styles.rowButton}
              onClick={() => onOpen(project.id)}
              style={{ "--corner-color": cornerColor } as CSSProperties}
            >
              <span className={styles.thumb}>
                <ProjectMedia
                  project={project}
                  iconImageClassName={styles.iconImg}
                  heroImageClassName={styles.heroImg}
                  faIconClassName={styles.faIcon}
                  sizes="56px"
                />
              </span>
              <span className={styles.meta}>
                <span className={styles.nameRow}>
                  <span className={styles.name}>{project.name}</span>
                  {project.yearRange && <span className={styles.year}>{project.yearRange}</span>}
                </span>
                <span className={styles.description}>{project.description}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ProjectListView;
