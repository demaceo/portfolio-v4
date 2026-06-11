import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModalFrame } from "@/components/features/modal";
import { ModalProps } from "@/lib/types";
import {
  crossCuttingPatterns,
  resumeProjectBreakdownByKey,
  resumeProjectBreakdowns,
  resumeRoleBullets,
  type ResumeProjectKey,
} from "@/data/resumeProjectHighlights";
import "./ResumeHighlightsModal.css";

interface ResumeHighlightsModalProps extends ModalProps {
  initialProjectKey?: string;
}

type ResumeHighlightsTab =
  | "role-bullets"
  | "project-breakdown"
  | "cross-cutting-patterns";

const resolveProjectKey = (initialProjectKey?: string): ResumeProjectKey => {
  const fallback = resumeProjectBreakdowns[0]?.key ?? "pinpoint";

  if (initialProjectKey && initialProjectKey in resumeProjectBreakdownByKey) {
    return initialProjectKey as ResumeProjectKey;
  }

  return fallback;
};

const toDomId = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const ResumeHighlightsModal: React.FC<ResumeHighlightsModalProps> = ({
  onClose,
  initialProjectKey,
}) => {
  const [activeTab, setActiveTab] =
    useState<ResumeHighlightsTab>("role-bullets");
  const [expandedRole, setExpandedRole] = useState<string>(
    resumeRoleBullets[0]?.role ?? "Senior Software Engineer"
  );
  const [selectedProjectKey, setSelectedProjectKey] =
    useState<ResumeProjectKey>(() => resolveProjectKey(initialProjectKey));

  useEffect(() => {
    setSelectedProjectKey(resolveProjectKey(initialProjectKey));
    if (initialProjectKey) {
      setActiveTab("project-breakdown");
    }
  }, [initialProjectKey]);

  const selectedProject = useMemo(
    () => resumeProjectBreakdownByKey[selectedProjectKey],
    [selectedProjectKey]
  );

  return (
    <ModalFrame
      onClose={onClose}
      title="Resume Highlights (2025-2026)"
      size="xl"
      titleId="resume-highlights-title"
      closeAriaLabel="Close resume highlights"
    >
      <div className="resume-highlights-content">
        <div className="resume-highlights-topbar">
          <div className="resume-highlights-tabs" role="tablist" aria-label="Resume highlights sections">
            <button
              type="button"
              className={`resume-highlights-tab ${activeTab === "role-bullets" ? "active" : ""}`}
              role="tab"
              id="resume-role-bullets-tab"
              aria-selected={activeTab === "role-bullets"}
              aria-controls="resume-role-bullets-panel"
              onClick={() => setActiveTab("role-bullets")}
            >
              Role Bullets
            </button>
            <button
              type="button"
              className={`resume-highlights-tab ${activeTab === "project-breakdown" ? "active" : ""}`}
              role="tab"
              id="resume-project-breakdown-tab"
              aria-selected={activeTab === "project-breakdown"}
              aria-controls="resume-project-breakdown-panel"
              onClick={() => setActiveTab("project-breakdown")}
            >
              Project Breakdown
            </button>
            <button
              type="button"
              className={`resume-highlights-tab ${activeTab === "cross-cutting-patterns" ? "active" : ""}`}
              role="tab"
              id="resume-cross-cutting-patterns-tab"
              aria-selected={activeTab === "cross-cutting-patterns"}
              aria-controls="resume-cross-cutting-patterns-panel"
              onClick={() => setActiveTab("cross-cutting-patterns")}
            >
              Cross-Cutting Patterns
            </button>
          </div>

          <span className="resume-highlights-byline">Interview + Resume Pack</span>
        </div>

        <div className="resume-highlights-body">
          <AnimatePresence mode="wait">
          {activeTab === "role-bullets" && (
            <motion.section
              key="role-bullets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="resume-highlights-panel"
              role="tabpanel"
              id="resume-role-bullets-panel"
              aria-labelledby="resume-role-bullets-tab"
            >
              <p className="resume-highlights-panel-intro">
                Copy-ready bullets optimized for resume, recruiter screening, and
                interview loops.
              </p>

              <div className="resume-role-groups">
                {resumeRoleBullets.map((group) => (
                  <article key={group.role} className="resume-role-group">
                    <button
                      type="button"
                      className="resume-role-group-trigger"
                      onClick={() =>
                        setExpandedRole((current) =>
                          current === group.role ? "" : group.role
                        )
                      }
                      aria-expanded={expandedRole === group.role}
                      aria-controls={`role-panel-${toDomId(group.role)}`}
                    >
                      <h3>{group.role}</h3>
                      <span className="resume-role-count">
                        {group.bullets.length}
                      </span>
                    </button>
                    {expandedRole === group.role && (
                      <ul id={`role-panel-${toDomId(group.role)}`}>
                        {group.bullets.map((bullet, index) => (
                          <li key={`${group.role}-${index}`}>
                            {bullet.project && (
                              <span className="resume-bullet-project">
                                {bullet.project}
                              </span>
                            )}
                            <span>{bullet.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === "project-breakdown" && (
            <motion.section
              key="project-breakdown"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="resume-highlights-panel"
              role="tabpanel"
              id="resume-project-breakdown-panel"
              aria-labelledby="resume-project-breakdown-tab"
            >
              <p className="resume-highlights-panel-intro">
                Deep technical breakdown by project: stack, architecture or
                pipeline, and feature-level delivery details.
              </p>

              <div
                className="resume-project-picker"
                role="tablist"
                aria-label="Select project breakdown"
              >
                {resumeProjectBreakdowns.map((project) => (
                  <button
                    key={project.key}
                    type="button"
                    className={`resume-project-picker-btn ${
                      selectedProjectKey === project.key ? "active" : ""
                    }`}
                    role="tab"
                    id={`project-tab-${project.key}`}
                    aria-selected={selectedProjectKey === project.key}
                    aria-controls={`project-panel-${project.key}`}
                    onClick={() => setSelectedProjectKey(project.key)}
                  >
                    {project.name}
                  </button>
                ))}
              </div>

              <article
                className="resume-project-detail"
                role="tabpanel"
                id={`project-panel-${selectedProject.key}`}
                aria-labelledby={`project-tab-${selectedProject.key}`}
              >
                <header className="resume-project-detail-header">
                  <h3>{selectedProject.name}</h3>
                  <p>{selectedProject.subtitle}</p>
                </header>

                <section className="resume-project-section">
                  <h4>Stack</h4>
                  <div className="resume-chip-grid">
                    {selectedProject.stack.map((item) => (
                      <span key={item} className="resume-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="resume-project-section">
                  <h4>{selectedProject.flowTitle}</h4>
                  <pre>{selectedProject.flowDiagram}</pre>
                </section>

                <section className="resume-project-section">
                  <h4>Key Features</h4>
                  <ul>
                    {selectedProject.keyFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </section>

                {selectedProject.databaseModels &&
                  selectedProject.databaseModels.length > 0 && (
                    <section className="resume-project-section">
                      <h4>Database Models</h4>
                      <div className="resume-chip-grid">
                        {selectedProject.databaseModels.map((model) => (
                          <span key={model} className="resume-chip">
                            {model}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                {selectedProject.supportedLanguages &&
                  selectedProject.supportedLanguages.length > 0 && (
                    <section className="resume-project-section">
                      <h4>Supported Languages</h4>
                      <div className="resume-chip-grid">
                        {selectedProject.supportedLanguages.map((language) => (
                          <span key={language} className="resume-chip">
                            {language}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
              </article>
            </motion.section>
          )}

          {activeTab === "cross-cutting-patterns" && (
            <motion.section
              key="cross-cutting-patterns"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="resume-highlights-panel"
              role="tabpanel"
              id="resume-cross-cutting-patterns-panel"
              aria-labelledby="resume-cross-cutting-patterns-tab"
            >
              <p className="resume-highlights-panel-intro">
                Shared technical patterns across the 2025-2026 flagship
                projects.
              </p>

              <div className="resume-patterns-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Pattern</th>
                      <th scope="col">Projects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crossCuttingPatterns.map((row) => (
                      <tr key={row.pattern}>
                        <td>{row.pattern}</td>
                        <td>{row.projects}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>
          )}
          </AnimatePresence>
        </div>
      </div>
    </ModalFrame>
  );
};

export default ResumeHighlightsModal;
