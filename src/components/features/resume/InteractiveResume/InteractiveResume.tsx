"use client";

import React, { useRef } from "react";
import DemaceoResume from "@/data/DemaceoResume";
import tools from "@/data/toolbelt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./InteractiveResume.css";
import { ModalProps } from "@/lib/types";

function ExperienceCard({
  exp,
}: {
  readonly exp: (typeof DemaceoResume.experiences)[0];
}) {
  return (
    <article
      className="experience-card"
      aria-label={`${exp.role} position at ${exp.organization}`}
      tabIndex={0}
    >
      <h3>
        <span className="role-organization">
          {exp.role} @ {exp.organization}
        </span>{" "}
        <span
          className="experience-date"
          aria-label={`Duration: ${exp.startDate} to ${
            exp.endDate || "present"
          }`}
        >
          {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : "— Present"}
        </span>
      </h3>

      <p>{exp.summary}</p>
    </article>
  );
}


export default function InteractiveResume({ onClose }: ModalProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus management
  React.useEffect(() => {
    const modalContainer = document.querySelector(".resume-modal-container");
    if (modalContainer) {
      (modalContainer as HTMLElement).focus();
    }
  }, []);
  const {
    name,
    title,
    // location,
    // email,
    website,
    linkedin,
    experiences,
    education,
  } = DemaceoResume;

  const handleDownloadPdf = async () => {
    if (!resumeRef.current) return;
    const element = resumeRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("Demaceo_Howard_Resume.pdf");
  };

  return (
    <div
      className="resume-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div
        className="resume-modal-container"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="document"
      >
        <div className="resume-modal-title-bar">
          <div className="resume-modal-window-controls">
            <button
              className="resume-close-btn"
              onClick={onClose}
              aria-label="Close Resume Window"
              title="Close"
            />
          </div>
          <span className="resume-window-title" id="resume-title">
            Professional Work Experience
          </span>
          <div className="resume-modal-actions">
            <button
              className="resume-download-btn"
              onClick={handleDownloadPdf}
              aria-label="Download resume as PDF"
              title="Download PDF"
            >
              <span className="download-icon">⬇</span>
              Download PDF
            </button>
          </div>
        </div>
        <div className="resume-content-wrapper">
          <div className="workxp-container" ref={resumeRef}>
            <header className="workxp-header">
              <h1 className="shadowed-text">{name}</h1>
              <p>{title}</p>
              <nav aria-label="Contact links">
                <a
                  href={website}
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit portfolio website"
                >
                  Portfolio
                </a>{" "}
                |{" "}
                <a
                  href={linkedin}
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit LinkedIn profile"
                >
                  LinkedIn
                </a>
              </nav>
            
            </header>

            <main role="main" aria-label="Resume content">
              <section
                className="xp-section"
                aria-labelledby="experience-heading"
              >
                <h2 id="experience-heading" className="shadowed-text">
                  Experience
                </h2>
                {experiences.map((exp) => (
                  <ExperienceCard
                    key={`${exp.role}-${exp.organization}-${exp.startDate}`}
                    exp={exp}
                  />
                ))}
              </section>

              <section
                className="xp-section"
                aria-labelledby="education-heading"
              >
                <h2 id="education-heading" className="shadowed-text">
                  Education
                </h2>
                <div className="edu-container">
                  {education.map((edu) => (
                    <div
                      key={`${edu.institution}-${edu.program}`}
                      className="education-item"
                      role="article"
                      aria-label={`Education at ${edu.institution}`}
                    >
                      <p className="institution">{edu.institution}</p>
                      <p className="program">{edu.program}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="xp-section" aria-labelledby="skills-heading">
                <h2 id="skills-heading" className="shadowed-text">
                  Technical Skills
                </h2>
                <div
                  className="tools-container"
                  role="list"
                  aria-label="Technical tools and skills"
                >
                  {tools.map((tool, index) => (
                    <div
                      key={index}
                      className="tool-item"
                      role="listitem"
                      tabIndex={0}
                      title={tool.tooltip}
                    >
                      <FontAwesomeIcon icon={tool.icon} className="tool-icon" />
                      <span className="tool-name">{tool.tooltip}</span>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
