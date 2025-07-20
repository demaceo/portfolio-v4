import { motion } from "framer-motion";
import projectData from "../../utilities/projectData";
import Image, { StaticImageData } from "next/image";

import "./ProjectGallery.css";

export default function ProjectGallery() {
  // ── separate live vs. archived work ──────────────────────────────
  const activeProjects = projectData.filter((p) => !p.archived);
  const archivedProjects = projectData.filter((p) => p.archived);

  // ── helper that returns an animated card ─────────────────────────

  type Project = {
    id: number;
    image?: string | StaticImageData;
    name: string;
    description: string;
    link: string;
    icon?: string;
    archived?: boolean;
  };

  const card = (
    { id, image, name, description, link, icon }: Project,
    index: number,
    extra: string
  ) => (
    <motion.article
      key={id}
      className={`project-card ${extra}`}
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
        className="project-image-link"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {image ? (
          <Image
            className="project-image"
            src={image}
            alt={name}
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
            }}
          />
        ) : (
          <i className={`${icon} project-icon`} aria-hidden="true"></i>
        )}
      </a>

      <div className="project-info">
        <h2 className="project-title">{name}</h2>
        <p className="project-description">{description}</p>
      </div>
    </motion.article>
  );

  return (
    <section className="projects-container">
      {/* ── current projects ── */}
      <h2 className="section-title shadowed-text">Current</h2>
      {activeProjects.map((p, i) => card(p, i, "icon-container"))}
      {/* ── archived projects ── */}
      {archivedProjects.length > 0 && (
        <>
          <h2 className="section-title shadowed-text">Archived</h2>
          {archivedProjects.map((p, i) => card(p, i, "archived"))}
        </>
      )}
    </section>
  );
}
