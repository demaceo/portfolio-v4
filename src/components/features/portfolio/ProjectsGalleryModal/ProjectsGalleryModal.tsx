"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ModalProps, Project } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";
import { Grid, FilterBar } from "@/components/ui";
import { useProjects } from "@/hooks";
import ProjectTile from "./ProjectTile";
import ProjectDetailModal from "../ProjectDetailModal/ProjectDetailModal";
import ResumeHighlightsModal from "../ResumeHighlightsModal/ResumeHighlightsModal";
import styles from "./ProjectsGalleryModal.module.css";

const MAX_FACETS = 6;

function useStackFacets(projects: Project[]): string[] {
  return useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.stackPreview?.forEach((tech) => {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_FACETS)
      .map(([tech]) => tech);
  }, [projects]);
}

const ProjectsGalleryModal: React.FC<ModalProps> = ({ onClose }) => {
  const { activeProjects, archivedProjects, getProjectById } = useProjects();
  const [activeTab, setActiveTab] = useState<"current" | "archived">("current");
  const [activeFacet, setActiveFacet] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showResumeHighlights, setShowResumeHighlights] = useState(false);
  const [resumeHighlightsProjectKey, setResumeHighlightsProjectKey] = useState<
    string | undefined
  >(undefined);

  const facets = useStackFacets(activeProjects);

  const baseProjects = activeTab === "current" ? activeProjects : archivedProjects;
  const visibleProjects = useMemo(() => {
    if (activeTab !== "current" || !activeFacet) return baseProjects;
    return baseProjects.filter((p) => p.stackPreview?.includes(activeFacet));
  }, [baseProjects, activeTab, activeFacet]);

  const selectedProject = selectedProjectId != null ? getProjectById(selectedProjectId) : undefined;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "current" | "archived");
    setActiveFacet(null);
  };

  const handleFacetToggle = (facet: string) => {
    setActiveFacet((prev) => (prev === facet ? null : facet));
  };

  const handleOpenDeepDive = (deepDiveKey?: string) => {
    setResumeHighlightsProjectKey(deepDiveKey);
    setShowResumeHighlights(true);
  };

  return (
    <>
      <ModalFrame
        onClose={onClose}
        title="Projects"
        size="lg"
        variant="light"
        titleId="projects-title"
        closeAriaLabel="Close projects modal"
      >
        <div className={styles.gallery}>
          <div className={styles.topbar}>
            <FilterBar
              tabs={[
                { key: "current", label: "Recent", count: activeProjects.length },
                { key: "archived", label: "Archived", count: archivedProjects.length },
              ]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              facets={activeTab === "current" ? facets : undefined}
              activeFacets={activeFacet ? new Set([activeFacet]) : new Set()}
              onFacetToggle={handleFacetToggle}
              tabListLabel="Project categories"
              facetListLabel="Filter by technology"
            />
          </div>

          <div className={styles.stage}>
            {visibleProjects.length > 0 ? (
              <Grid minItemWidth="200px" gap="md" className={styles.grid}>
                {visibleProjects.map((project) => (
                  <ProjectTile
                    key={project.id}
                    project={project}
                    onOpen={setSelectedProjectId}
                  />
                ))}
              </Grid>
            ) : (
              <p className={styles.empty}>No projects match this filter.</p>
            )}
          </div>
        </div>
      </ModalFrame>

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

export default ProjectsGalleryModal;
