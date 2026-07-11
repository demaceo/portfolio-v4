import React, { useEffect, useMemo, useState } from "react";
import { ModalFrame } from "@/components/features/modal";
import { ModalProps } from "@/lib/types";
import {
  crossCuttingPatterns,
  resumeProjectBreakdownByKey,
  resumeProjectBreakdowns,
  resumeRoleBullets,
  type ResumeProjectKey,
} from "@/data/resumeProjectHighlights";
import styles from "./ResumeHighlightsModal.module.css";

interface ResumeHighlightsModalProps extends ModalProps {
  initialProjectKey?: string;
}

type ResumeHighlightsTab =
  | "role-bullets"
  | "project-breakdown"
  | "cross-cutting-patterns";

const TABS: { key: ResumeHighlightsTab; label: string }[] = [
  { key: "role-bullets", label: "Role Bullets" },
  { key: "project-breakdown", label: "Project Breakdown" },
  { key: "cross-cutting-patterns", label: "Cross-Cutting Patterns" },
];

// Single, stable id for the project-breakdown detail panel — every project tab
// points its aria-controls here (the panel's content swaps in place).
const PROJECT_PANEL_ID = "resume-project-panel";

const resolveProjectKey = (initialProjectKey?: string): ResumeProjectKey => {
  const fallback = resumeProjectBreakdowns[0]?.key ?? "pinpoint";

  if (initialProjectKey && initialProjectKey in resumeProjectBreakdownByKey) {
    return initialProjectKey as ResumeProjectKey;
  }

  return fallback;
};

const toDomId = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// WAI-ARIA tabs keyboard pattern, shared by both tablists in this modal.
function handleTablistKeydown(
  event: React.KeyboardEvent<HTMLDivElement>,
  count: number,
  currentIndex: number,
  onIndex: (index: number) => void
) {
  let next: number | null = null;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (currentIndex + 1) % count;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
    next = (currentIndex - 1 + count) % count;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = count - 1;
  if (next === null) return;
  event.preventDefault();
  onIndex(next);
  event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
}

const ResumeHighlightsModal: React.FC<ResumeHighlightsModalProps> = ({
  onClose,
  initialProjectKey,
}) => {
  const [activeTab, setActiveTab] = useState<ResumeHighlightsTab>("role-bullets");
  // Start collapsed so every role reads as a scannable one-line summary;
  // expanding a role reveals its full bullet list.
  const [expandedRole, setExpandedRole] = useState<string>("");
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

  const activeTabIndex = TABS.findIndex((t) => t.key === activeTab);
  const selectedProjectIndex = resumeProjectBreakdowns.findIndex(
    (p) => p.key === selectedProjectKey
  );

  return (
    <ModalFrame
      onClose={onClose}
      title="Resume Highlights (2025-2026)"
      size="xl"
      variant="light"
      titleId="resume-highlights-title"
      closeAriaLabel="Close resume highlights"
    >
      <div className={styles.resumeHighlightsContent}>
        <div className={styles.resumeHighlightsTopbar}>
          <div
            className={styles.resumeHighlightsTabs}
            role="tablist"
            aria-label="Resume highlights sections"
            onKeyDown={(e) =>
              handleTablistKeydown(e, TABS.length, activeTabIndex, (i) =>
                setActiveTab(TABS[i].key)
              )
            }
          >
            {TABS.map((tab) => {
              const selected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`${styles.resumeHighlightsTab} ${selected ? styles.active : ""}`}
                  role="tab"
                  id={`resume-${tab.key}-tab`}
                  aria-selected={selected}
                  aria-controls={`resume-${tab.key}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <span className={styles.resumeHighlightsByline}>Interview + Resume Pack</span>
        </div>

        {/* All three panels stay mounted (inactive ones hidden) so every tab's
            aria-controls resolves and focus never drops when a panel unmounts. */}
        <div className={styles.resumeHighlightsBody}>
          <section
            className={styles.resumeHighlightsPanel}
            role="tabpanel"
            id="resume-role-bullets-panel"
            aria-labelledby="resume-role-bullets-tab"
            hidden={activeTab !== "role-bullets"}
          >
            <p className={styles.resumeHighlightsPanelIntro}>
              Copy-ready bullets optimized for resume, recruiter screening, and
              interview loops.
            </p>

            <div className={styles.resumeRoleGroups}>
              {resumeRoleBullets.map((group) => {
                const isExpanded = expandedRole === group.role;
                const panelId = `role-panel-${toDomId(group.role)}`;
                return (
                  <article key={group.role} className={styles.resumeRoleGroup}>
                    <button
                      type="button"
                      className={styles.resumeRoleGroupTrigger}
                      onClick={() =>
                        setExpandedRole((current) =>
                          current === group.role ? "" : group.role
                        )
                      }
                      aria-expanded={isExpanded}
                      aria-controls={isExpanded ? panelId : undefined}
                    >
                      <span className={styles.resumeRoleHeading}>
                        <h3>{group.role}</h3>
                        {!isExpanded && (
                          <span className={styles.resumeRoleSummary}>
                            {group.summary}
                          </span>
                        )}
                      </span>
                      <span className={styles.resumeRoleMeta}>
                        <span
                          className={styles.resumeRoleCount}
                          aria-label={`${group.bullets.length} bullets`}
                        >
                          {group.bullets.length}
                        </span>
                        <span className={styles.resumeRoleChevron} aria-hidden="true" />
                      </span>
                    </button>
                    {isExpanded && (
                      <ul id={panelId}>
                        {group.bullets.map((bullet, index) => (
                          <li key={`${group.role}-${index}`}>
                            {bullet.project && (
                              <span className={styles.resumeBulletProject}>
                                {bullet.project}
                              </span>
                            )}
                            <span>{bullet.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section
            className={styles.resumeHighlightsPanel}
            role="tabpanel"
            id="resume-project-breakdown-panel"
            aria-labelledby="resume-project-breakdown-tab"
            hidden={activeTab !== "project-breakdown"}
          >
            <p className={styles.resumeHighlightsPanelIntro}>
              Deep technical breakdown by project: stack, architecture or
              pipeline, and feature-level delivery details.
            </p>

            <div
              className={styles.resumeProjectPicker}
              role="tablist"
              aria-label="Select project breakdown"
              onKeyDown={(e) =>
                handleTablistKeydown(
                  e,
                  resumeProjectBreakdowns.length,
                  selectedProjectIndex,
                  (i) => setSelectedProjectKey(resumeProjectBreakdowns[i].key)
                )
              }
            >
              {resumeProjectBreakdowns.map((project) => {
                const selected = selectedProjectKey === project.key;
                return (
                  <button
                    key={project.key}
                    type="button"
                    className={`${styles.resumeProjectPickerBtn} ${selected ? styles.active : ""}`}
                    role="tab"
                    id={`project-tab-${project.key}`}
                    aria-selected={selected}
                    aria-controls={PROJECT_PANEL_ID}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setSelectedProjectKey(project.key)}
                  >
                    {project.name}
                  </button>
                );
              })}
            </div>

            <article
              className={styles.resumeProjectDetail}
              role="tabpanel"
              id={PROJECT_PANEL_ID}
              aria-labelledby={`project-tab-${selectedProject.key}`}
            >
              <header className={styles.resumeProjectDetailHeader}>
                <h3>{selectedProject.name}</h3>
                <p>{selectedProject.subtitle}</p>
              </header>

              <section className={styles.resumeProjectSection}>
                <h4>Stack</h4>
                <div className={styles.resumeChipGrid}>
                  {selectedProject.stack.map((item) => (
                    <span key={item} className={styles.resumeChip}>
                      {item}
                    </span>
                  ))}
                </div>
              </section>

              <section className={styles.resumeProjectSection}>
                <h4>{selectedProject.flowTitle}</h4>
                <pre role="img" aria-label={`${selectedProject.flowTitle} diagram`}>{selectedProject.flowDiagram}</pre>
              </section>

              <section className={styles.resumeProjectSection}>
                <h4>Key Features</h4>
                <ul>
                  {selectedProject.keyFeatures.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </section>

              {selectedProject.databaseModels &&
                selectedProject.databaseModels.length > 0 && (
                  <section className={styles.resumeProjectSection}>
                    <h4>Database Models</h4>
                    <div className={styles.resumeChipGrid}>
                      {selectedProject.databaseModels.map((model) => (
                        <span key={model} className={styles.resumeChip}>
                          {model}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

              {selectedProject.supportedLanguages &&
                selectedProject.supportedLanguages.length > 0 && (
                  <section className={styles.resumeProjectSection}>
                    <h4>Supported Languages</h4>
                    <div className={styles.resumeChipGrid}>
                      {selectedProject.supportedLanguages.map((language) => (
                        <span key={language} className={styles.resumeChip}>
                          {language}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
            </article>
          </section>

          <section
            className={styles.resumeHighlightsPanel}
            role="tabpanel"
            id="resume-cross-cutting-patterns-panel"
            aria-labelledby="resume-cross-cutting-patterns-tab"
            hidden={activeTab !== "cross-cutting-patterns"}
          >
            <p className={styles.resumeHighlightsPanelIntro}>
              Shared technical patterns across the 2025-2026 flagship projects.
            </p>

            <div className={styles.resumePatternsTableWrap}>
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
          </section>
        </div>
      </div>
    </ModalFrame>
  );
};

export default ResumeHighlightsModal;
