"use client";

import React, { useRef } from "react";
import DemaceoResume from "@/data/DemaceoResume";
import tools from "@/data/toolbelt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./InteractiveResume.css";
import { ModalProps } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";
import {
  LETTER_PT,
  measureBreakCandidates,
  planPageSlices,
} from "@/lib/utils/pdfPagination";

// PDF export tuning. Capture at 2x for crisp text; 0.5in page margins.
const PDF_CAPTURE_SCALE = 2;
const PDF_MARGIN_PT = 36;
// Safe places to start a new page: the top of a section heading, a job, an
// education entry or a skill row. Breaking at a heading's top keeps it with
// the content beneath it.
const PDF_BREAK_SELECTOR =
  ".xp-section > h2, .experience-card, .education-item, .tool-item";

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
    // html2canvas + jsPDF are ~530 kB of JS between them and are only ever
    // needed once the user actually clicks "Download PDF". Importing them
    // here rather than at module scope keeps them out of the resume modal's
    // chunk, so opening (or merely hover-preloading) the resume no longer
    // pays for a PDF exporter most visitors never invoke.
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    // The modal follows the viewer's light/dark scheme, but the PDF is a white
    // page: tag the clone so InteractiveResume.css forces the light palette.
    // Break points are measured on that same clone (not the live node) so
    // they match the layout html2canvas actually rasterises.
    let breakCandidates: number[] = [];
    const canvas = await html2canvas(element, {
      scale: PDF_CAPTURE_SCALE,
      backgroundColor: "#ffffff",
      onclone: (_doc, clonedElement) => {
        clonedElement.setAttribute("data-pdf-export", "");
        breakCandidates = measureBreakCandidates(clonedElement, PDF_BREAK_SELECTOR);
      },
    });

    // Letter pages with 0.5in margins. The capture is scaled to the content
    // width, and each page holds as much as fits, breaking at the top of a
    // heading / job / education / skill row rather than mid-line.
    const contentWidthPt = LETTER_PT.width - PDF_MARGIN_PT * 2;
    const contentHeightPt = LETTER_PT.height - PDF_MARGIN_PT * 2;
    const pxPerPt = canvas.width / contentWidthPt;
    const slices = planPageSlices(
      canvas.height,
      Math.floor(contentHeightPt * pxPerPt),
      breakCandidates.map((y) => y * PDF_CAPTURE_SCALE)
    );

    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
    const pageCanvas = document.createElement("canvas");
    const ctx = pageCanvas.getContext("2d");
    if (!ctx) return;
    pageCanvas.width = canvas.width;

    slices.forEach(({ start, end }, index) => {
      const height = end - start;
      pageCanvas.height = height;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, height);
      ctx.drawImage(canvas, 0, start, canvas.width, height, 0, 0, canvas.width, height);
      if (index > 0) pdf.addPage("letter", "portrait");
      pdf.addImage(
        pageCanvas.toDataURL("image/png"),
        "PNG",
        PDF_MARGIN_PT,
        PDF_MARGIN_PT,
        contentWidthPt,
        height / pxPerPt
      );
    });
    pdf.save("Demaceo_Howard_Resume.pdf");
  };

  return (
    <ModalFrame
      onClose={onClose}
      title="Professional Work Experience"
      size="xl"
      titleId="resume-title"
      closeAriaLabel="Close resume window"
      headerActions={
        <button
          className="resume-download-btn"
          onClick={handleDownloadPdf}
          aria-label="Download resume as PDF"
          title="Download PDF"
        >
          <span className="download-icon">⬇</span>
          Download PDF
        </button>
      }
    >
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
    </ModalFrame>
  );
}
