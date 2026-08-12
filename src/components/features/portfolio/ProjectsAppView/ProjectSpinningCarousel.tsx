"use client";

import type { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Project } from "@/lib/types";
import { PROJECT_ICON_MAP, PROJECT_ICON_FALLBACK } from "@/lib/constants/projectIcons";
import { resolveProjectMedia } from "../shared/resolveProjectMedia";
import { cornerColorFor, DOC_CORNER_COLOR } from "../shared/cornerColor";
import styles from "./ProjectSpinningCarousel.module.css";

interface ProjectSpinningCarouselProps {
  projects: Project[];
  onOpen: (id: number) => void;
}

/**
 * Adapted from the codepenz "Spinning Photo Carousel": the ring is still one
 * keyframe rotating the whole set, with a reversed half-speed outer layer
 * that the direction radios compose into a spin-direction flip — pure CSS,
 * no script beyond the click handler that opens a project's detail view.
 * Faces show each project's real artwork (screenshot/gif or icon-on-plate)
 * in place of the source pen's photos, and gain a name caption + corner
 * accent that reveal on the same hover/focus that lifts and colors the item.
 */
const ProjectSpinningCarousel: React.FC<ProjectSpinningCarouselProps> = ({ projects, onOpen }) => {
  if (projects.length === 0) return null;

  return (
    <div className={styles.stage}>
      <div className={styles.carousel}>
        <div className={`${styles.controlButton} ${styles.left}`}>
          <input type="radio" name="spinning-carousel-direction" aria-label="Spin counter-clockwise" />
        </div>
        <div className={`${styles.controlButton} ${styles.right}`}>
          <input type="radio" name="spinning-carousel-direction" defaultChecked aria-label="Spin clockwise" />
        </div>

        <div className={styles.rotationDirection}>
          <ul className={styles.itemWrapper} style={{ "--_num-elements": projects.length } as CSSProperties}>
            {projects.map((project, i) => {
              const { src, fit } = resolveProjectMedia(project);
              const cornerColor =
                project.type === "documentary" ? DOC_CORNER_COLOR : cornerColorFor(i, projects.length);

              return (
                <li
                  key={project.id}
                  className={styles.item}
                  style={
                    {
                      "--_index": i + 1,
                      "--_image-url": src ? `url('${src}')` : "none",
                      "--_bg-size": fit,
                      "--corner-color": cornerColor,
                    } as CSSProperties
                  }
                >
                  <button
                    type="button"
                    className={styles.face}
                    onClick={() => onOpen(project.id)}
                    aria-label={`${project.name}${project.yearRange ? `, ${project.yearRange}` : ""} — view project`}
                  >
                    {!src && (
                      <FontAwesomeIcon
                        icon={PROJECT_ICON_MAP[project.icon as string] || PROJECT_ICON_FALLBACK}
                        className={styles.faIcon}
                        aria-hidden="true"
                      />
                    )}
                    <span className={styles.caption}>
                      {project.yearRange && (
                        <span className={styles.captionYear}>{project.yearRange}</span>
                      )}
                      <span className={styles.captionName}>{project.name}</span>
                    </span>
                  </button>
                </li>
              );
            })}

            <li className={styles.ground} aria-hidden="true" />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectSpinningCarousel;
