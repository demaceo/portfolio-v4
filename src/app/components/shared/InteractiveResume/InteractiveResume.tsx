"use client";

import React, { useRef } from "react";
import DemaceoResume from "@/data/DemaceoResume";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./InteractiveResume.css";

function ExperienceCard({
  exp,
}: {
  readonly exp: (typeof DemaceoResume.experiences)[0];
}) {
  return (
    <div className="experience-card">
      <h3>
        {exp.role} @ {exp.organization}{" "}
        <span className="experience-date">
          {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : ""}
        </span>
      </h3>

      <p>{exp.summary}</p>
    </div>
  );
}

export default function InteractiveResume() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const {
    name,
    title,
    // location,
    // email,
    website,
    linkedin,
    skills,
    interests,
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
    pdf.save("DemaceoResume.pdf");
  };

  return (
    <div className="workxp-container" ref={resumeRef}>
      <header className="workxp-header">
        <h1 className="shadowed-text">{name}</h1>
        <p>{title}</p>
        <div>
          <a href={website} className="underline">
            Portfolio
          </a>{" "}
          |{" "}
          <a href={linkedin} className="underline">
            LinkedIn
          </a>
        </div>
        <div className="workxp-buttons">
          <button onClick={handleDownloadPdf} className="download-button">
            Download PDF
          </button>
        </div>
      </header>

      <main>
        <section className="xp-section">
          <h2 className="shadowed-text">Experience</h2>
          {experiences.map((exp) => (
            <ExperienceCard
              key={`${exp.role}-${exp.organization}-${exp.startDate}`}
              exp={exp}
            />
          ))}
        </section>

        <section className="xp-section">
          <h2 className="shadowed-text">Education</h2>
          <div className="edu-container">
            {education.map((edu) => (
              <div
                key={`${edu.institution}-${edu.program}`}
                className="education-item"
              >
                <p className="institution">{edu.institution}</p>
                <p className="program">{edu.program}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="xp-section">
          <h2 className="shadowed-text">Skills & Interests</h2>
          <div className="skills-container">
            {skills.map((skill) => (
              <span key={skill} className="skill-item">
                {skill}
              </span>
            ))}
          </div>
          <div className="interests-container">
            {interests.map((i) => (
              <span key={i} className="interest-item">
                {i}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
