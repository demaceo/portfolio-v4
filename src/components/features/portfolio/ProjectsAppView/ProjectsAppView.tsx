"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ModalProps } from "@/lib/types";
import { AppView } from "@/components/features/shell";
import { FilterBar } from "@/components/ui";
import { useProjects } from "@/hooks";
import ProjectCoverflow from "./ProjectCoverflow";
import ProjectDetailModal from "../ProjectDetailModal/ProjectDetailModal";
import ResumeHighlightsModal from "../ResumeHighlightsModal/ResumeHighlightsModal";
import styles from "./ProjectsAppView.module.css";

interface ProjectsAppViewProps extends ModalProps {
  initialProjectId?: number;
}

const ProjectsAppView: React.FC<ProjectsAppViewProps> = ({
  onClose,
  initialProjectId,
}) => {
  const { activeProjects, archivedProjects, getProjectById } = useProjects();
  const [activeTab, setActiveTab] = useState<"current" | "archived">("current");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    initialProjectId ?? null
  );
  const [showResumeHighlights, setShowResumeHighlights] = useState(false);
  const [resumeHighlightsProjectKey, setResumeHighlightsProjectKey] = useState<
    string | undefined
  >(undefined);

  const visibleProjects = activeTab === "current" ? activeProjects : archivedProjects;

  const selectedProject = selectedProjectId != null ? getProjectById(selectedProjectId) : undefined;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "current" | "archived");
  };

  const handleOpenDeepDive = (deepDiveKey?: string) => {
    setResumeHighlightsProjectKey(deepDiveKey);
    setShowResumeHighlights(true);
  };

  return (
    <>
      <AppView onClose={onClose} title="Projects" titleId="projects-title">
        <div className={styles.gallery}>
          <div className={styles.topbar}>
            <FilterBar
              tabs={[
                { key: "current", label: "Recent", count: activeProjects.length },
                { key: "archived", label: "Archived", count: archivedProjects.length },
              ]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tabListLabel="Project categories"
              panelId="projects-panel"
            />
          </div>

          <div
            className={styles.stage}
            role="tabpanel"
            id="projects-panel"
            aria-labelledby={`projects-panel-tab-${activeTab}`}
          >
            {visibleProjects.length > 0 ? (
              <ProjectCoverflow
                key={activeTab}
                projects={visibleProjects}
                onOpen={setSelectedProjectId}
                initialProjectId={initialProjectId}
              />
            ) : (
              <p className={styles.empty}>No projects match this filter.</p>
            )}
          </div>
        </div>
      </AppView>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            key="project-detail"
            project={selectedProject}
            onBack={() => setSelectedProjectId(null)}
            onOpenDeepDive={handleOpenDeepDive}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResumeHighlights && (
          <ResumeHighlightsModal
            key="resume-highlights"
            onClose={() => {
              setShowResumeHighlights(false);
              setResumeHighlightsProjectKey(undefined);
            }}
            initialProjectKey={resumeHighlightsProjectKey}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsAppView;
