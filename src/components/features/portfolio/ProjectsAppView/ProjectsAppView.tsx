"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ModalProps } from "@/lib/types";
import { AppView } from "@/components/features/shell";
import { FilterBar } from "@/components/ui";
import { useProjects } from "@/hooks";
import ProjectCoverflow from "./ProjectCoverflow";
import ProjectSpinningCarousel from "./ProjectSpinningCarousel";
import ProjectListView from "./ProjectListView";
import ProjectDetailModal from "../ProjectDetailModal/ProjectDetailModal";
import ResumeHighlightsModal from "../ResumeHighlightsModal/ResumeHighlightsModal";
import styles from "./ProjectsAppView.module.css";

interface ProjectsAppViewProps extends ModalProps {
  initialProjectId?: number;
  /** Changes on every external "open this project" request (⌘K palette). */
  projectRequestKey?: number;
}

const ProjectsAppView: React.FC<ProjectsAppViewProps> = ({
  onClose,
  initialProjectId,
  projectRequestKey,
}) => {
  const { activeProjects, archivedProjects, getProjectById } = useProjects();
  const [activeTab, setActiveTab] = useState<"featured" | "more">("featured");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    initialProjectId ?? null
  );
  // The ⌘K palette can pick a project while this view is already open, which
  // changes initialProjectId (or, for the same project picked again, only
  // projectRequestKey) without remounting. Adopt the request during render
  // (React's "adjust state when a prop changes" pattern — no effect, no extra
  // frame), and jump to the Featured tab since the palette only lists active
  // projects.
  const requestSignature = `${initialProjectId ?? ""}|${projectRequestKey ?? 0}`;
  const [prevRequestSignature, setPrevRequestSignature] = useState(requestSignature);
  if (requestSignature !== prevRequestSignature) {
    setPrevRequestSignature(requestSignature);
    if (initialProjectId != null) {
      setSelectedProjectId(initialProjectId);
      setActiveTab("featured");
    }
  }
  const [showResumeHighlights, setShowResumeHighlights] = useState(false);
  const [resumeHighlightsProjectKey, setResumeHighlightsProjectKey] = useState<
    string | undefined
  >(undefined);

  const visibleProjects = activeTab === "featured" ? activeProjects : archivedProjects;

  const selectedProject = selectedProjectId != null ? getProjectById(selectedProjectId) : undefined;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "featured" | "more");
  };

  const handleOpenDeepDive = (deepDiveKey?: string) => {
    setResumeHighlightsProjectKey(deepDiveKey);
    setShowResumeHighlights(true);
  };

  // Lets the detail view swipe to the next/previous project without closing
  // back out to the gallery first. Scoped to (and wraps within) whichever
  // tab's list the project was opened from, matching the coverflow itself.
  const handleNavigateProject = (direction: 1 | -1) => {
    if (visibleProjects.length === 0) return;
    const currentIndex = visibleProjects.findIndex((p) => p.id === selectedProjectId);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + direction + visibleProjects.length) % visibleProjects.length;
    setSelectedProjectId(visibleProjects[nextIndex].id);
  };

  return (
    <>
      <AppView onClose={onClose} title="Projects" titleId="projects-title">
        <div className={styles.gallery}>
          <div className={styles.topbar}>
            <FilterBar
              tabs={[
                { key: "featured", label: "Featured", count: activeProjects.length },
                { key: "more", label: "More", count: archivedProjects.length },
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
              <>
                <div className={styles.desktopView}>
                  {activeTab === "featured" ? (
                    <ProjectSpinningCarousel projects={visibleProjects} onOpen={setSelectedProjectId} />
                  ) : (
                    <ProjectCoverflow
                      projects={visibleProjects}
                      onOpen={setSelectedProjectId}
                      initialProjectId={initialProjectId}
                    />
                  )}
                </div>
                <div className={styles.mobileView}>
                  <ProjectListView projects={visibleProjects} onOpen={setSelectedProjectId} />
                </div>
              </>
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
            projects={visibleProjects}
            onSelect={setSelectedProjectId}
            onBack={() => setSelectedProjectId(null)}
            onOpenDeepDive={handleOpenDeepDive}
            onNext={() => handleNavigateProject(1)}
            onPrev={() => handleNavigateProject(-1)}
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
