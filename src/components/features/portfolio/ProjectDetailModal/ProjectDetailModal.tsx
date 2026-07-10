"use client";

import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faFilm } from "@fortawesome/free-solid-svg-icons";
import { Project } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";
import ProjectMedia from "../shared/ProjectMedia";
import styles from "./ProjectDetailModal.module.css";

interface ProjectDetailModalProps {
  project: Project;
  onBack: () => void;
  onOpenDeepDive: (deepDiveKey?: string) => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onBack,
  onOpenDeepDive,
}) => {
  return (
    <ModalFrame
      onClose={onBack}
      title={project.name}
      size="lg"
      variant="light"
      titleId="project-detail-title"
      closeAriaLabel="Back to projects"
    >
      <div className={styles.detail}>
        <motion.div
          layoutId={`project-media-${project.id}`}
          className={styles.media}
          aria-hidden="true"
        >
          <ProjectMedia
            project={project}
            iconImageClassName={styles.iconImg}
            heroImageClassName={styles.heroImg}
            faIconClassName={styles.faIcon}
            sizes="(max-width: 640px) 100vw, 42vw"
          />
          <div className={styles.vignette} aria-hidden="true" />
        </motion.div>

        <div className={styles.info}>
          {project.type === "documentary" && (
            <div className={styles.docTag} aria-label="Documentary">
              <FontAwesomeIcon icon={faFilm} aria-hidden="true" />
              <span>Documentary</span>
            </div>
          )}

          <h2 className={styles.name}>{project.name}</h2>

          {project.yearRange && (
            <p className={styles.year} aria-label={`Year range: ${project.yearRange}`}>
              {project.yearRange}
            </p>
          )}

          <p className={styles.description}>{project.description}</p>

          {project.stackPreview && project.stackPreview.length > 0 && (
            <div className={styles.stack} aria-label="Technology stack">
              {project.stackPreview.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <ul className={styles.highlights} aria-label="Project highlights">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.openBtn}
              onClick={() => window.open(project.link, "_blank", "noopener,noreferrer")}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} aria-hidden="true" />
              <span>Open Project</span>
            </button>

            {project.deepDiveKey && (
              <button
                type="button"
                className={styles.diveBtn}
                onClick={() => onOpenDeepDive(project.deepDiveKey)}
              >
                Resume Deep Dive
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalFrame>
  );
};

export default ProjectDetailModal;
