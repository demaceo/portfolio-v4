"use client";

import React from "react";
import { motion } from "framer-motion";
import { Project } from "@/lib/types";
import { Card } from "@/components/ui";
import ProjectMedia from "../shared/ProjectMedia";
import styles from "./ProjectTile.module.css";

interface ProjectTileProps {
  project: Project;
  onOpen: (id: number) => void;
}

const ProjectTile: React.FC<ProjectTileProps> = ({ project, onOpen }) => {
  return (
    <Card as="button" className={styles.tile} onClick={() => onOpen(project.id)}>
      <motion.div layoutId={`project-media-${project.id}`} className={styles.media}>
        <ProjectMedia
          project={project}
          iconImageClassName={styles.iconImg}
          heroImageClassName={styles.heroImg}
          faIconClassName={styles.faIcon}
          sizes="(max-width: 640px) 45vw, 220px"
        />
        <div className={styles.scrim} aria-hidden="true" />
      </motion.div>

      <div className={styles.info}>
        <h3 className={styles.name}>{project.name}</h3>
        {project.yearRange && <p className={styles.year}>{project.yearRange}</p>}
        {project.stackPreview && project.stackPreview.length > 0 && (
          <div className={styles.stack} aria-hidden="true">
            {project.stackPreview.slice(0, 3).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectTile;
