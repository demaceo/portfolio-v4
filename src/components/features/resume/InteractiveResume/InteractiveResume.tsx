"use client";

import React from "react";
import DemaceoResume from "@/data/DemaceoResume";
import "./InteractiveResume.css";
import { ModalProps } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";

type Experience = (typeof DemaceoResume.experiences)[number];

function ExperienceCard({ exp }: { readonly exp: Experience }) {
  return (
    <article
      className="experience-card"
      aria-label={`${exp.role} at ${exp.organization}`}
      tabIndex={0}
    >
      <h3>
        {exp.role} <span className="resume-dot">·</span> {exp.organization}
      </h3>
      <p className="resume-meta">
        {exp.dates} · {exp.context}
      </p>
      <p>{exp.summary}</p>
    </article>
  );
}

function ChipList({ items, label }: { readonly items: string[]; readonly label: string }) {
  return (
    <ul className="resume-chips" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function InteractiveResume({ onClose }: ModalProps) {
  const {
    name,
    title,
    location,
    availability,
    links,
    summaryLead,
    summary,
    selectedWork,
    experiences,
    teaching,
    speaking,
    coreStack,
    aiTools,
    education,
    pdf,
  } = DemaceoResume;

  return (
    <ModalFrame
      onClose={onClose}
      title="Résumé"
      size="xl"
      titleId="resume-title"
      closeAriaLabel="Close résumé"
      headerActions={
        // The owner's preferred, hand-designed PDF (phone number redacted),
        // served as a static file from public/resume.
        <a
          className="resume-download-btn"
          href={pdf.href}
          download={pdf.filename}
          aria-label="Download résumé as PDF"
        >
          <span className="download-icon" aria-hidden="true">
            ⬇
          </span>
          Download PDF
        </a>
      }
    >
      <div className="resume-content-wrapper">
        <div className="workxp-container">
          <header className="workxp-header">
            <h1 className="shadowed-text">{name}</h1>
            <p className="resume-title-line">{title}</p>
            <ul className="resume-contact" aria-label="Contact and links">
              <li>
                {location} · {availability}
              </li>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </header>

          <div className="resume-body">
            <p className="resume-summary">
              <strong>{summaryLead}</strong>
              {summary}
            </p>

            <section className="xp-section" aria-labelledby="work-heading">
              <h2 id="work-heading" className="shadowed-text">
                Selected work
              </h2>
              {selectedWork.map((work) => (
                <article key={work.name} className="resume-work">
                  <h3>
                    {work.name} <span className="resume-dot">·</span>{" "}
                    <span className="resume-tagline">{work.tagline}</span>
                  </h3>
                  <p>{work.summary}</p>
                </article>
              ))}
            </section>

            <section className="xp-section" aria-labelledby="experience-heading">
              <h2 id="experience-heading" className="shadowed-text">
                Experience
              </h2>
              {experiences.map((exp) => (
                <ExperienceCard key={`${exp.organization}-${exp.dates}`} exp={exp} />
              ))}
            </section>

            <section className="xp-section" aria-labelledby="teaching-heading">
              <h2 id="teaching-heading" className="shadowed-text">
                Teaching &amp; mentorship
              </h2>
              <p>{teaching}</p>
            </section>

            <div className="resume-columns">
              <section className="xp-section" aria-labelledby="speaking-heading">
                <h2 id="speaking-heading" className="shadowed-text">
                  Speaking &amp; press
                </h2>
                {speaking.map((item) => (
                  <div key={item.title} className="resume-speaking">
                    <p className="resume-speaking-title">{item.title}</p>
                    <p className="resume-meta">{item.detail}</p>
                  </div>
                ))}
              </section>

              <section className="xp-section" aria-labelledby="education-heading">
                <h2 id="education-heading" className="shadowed-text">
                  Education
                </h2>
                {education.map((edu) => (
                  <div key={edu.institution} className="education-item">
                    <p className="program">{edu.program}</p>
                    <p className="institution">{edu.institution}</p>
                  </div>
                ))}
              </section>
            </div>

            <section className="xp-section" aria-labelledby="stack-heading">
              <h2 id="stack-heading" className="shadowed-text">
                Core stack
              </h2>
              <ChipList items={coreStack} label="Core stack" />
            </section>

            <section className="xp-section" aria-labelledby="ai-heading">
              <h2 id="ai-heading" className="shadowed-text">
                AI-assisted development
              </h2>
              <ChipList items={aiTools} label="AI-assisted development tools" />
            </section>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
}
