"use client";

import { motion } from "framer-motion";
import { projectsData } from "@/data/projects";
import Image, { StaticImageData } from "next/image";
import "./ProjectGallery.css";

export default function ProjectGallery() {
  // ── separate live vs. archived work ──────────────────────────────
  const activeProjects = projectsData.filter((p: Project) => !p.archived);
  const archivedProjects = projectsData.filter((p: Project) => p.archived);

  type Project = {
    id: number;
    image?: string | StaticImageData;
    name: string;
    description: string;
    link: string;
    icon?: string;
    archived?: boolean;
  };

  // ── helper that returns an animated card ─────────────────────────
  const card = (
    { id, image, name, description, link, icon }: Project,
    index: number,
    extra: string
  ) => (
    <motion.article
      key={id}
      className={`project-gallery-card ${extra}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.15,
      }}
      viewport={{ once: true }}
    >
      <a
        className="project-gallery-image-link"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {image ? (
          <Image
            className="project-gallery-image"
            src={image}
            alt={name}
            width={400}
            height={250}
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
            }}
          />
        ) : (
          <i className={`${icon} project-gallery-icon`} aria-hidden="true"></i>
        )}
      </a>

      <div className="project-gallery-info">
        <h2 className="project-gallery-title">{name}</h2>
        <p className="project-gallery-description">{description}</p>
      </div>
    </motion.article>
  );

  return (
    <section className="projects-container">
      {/* ── current projects ── */}
      <h2 className="project-gallery-section-title shadowed-text">Current</h2>
      {activeProjects.map((p, i) =>
        card(p, i, "project-gallery-icon-container")
      )}
      {/* ── archived projects ── */}
      {archivedProjects.length > 0 && (
        <>
          <h2 className="project-gallery-section-title shadowed-text">
            Archived
          </h2>
          {archivedProjects.map((p, i) => card(p, i, "archived"))}
        </>
      )}
    </section>
  );
}
