"use client";

import React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

const LoadingView = () => {
  return <></>;
};

const AboutAppView = dynamic(
  () => import("@/components/features/about/AboutAppView/AboutAppView"),
  {
    loading: () => <LoadingView />,
  }
);

const SkillsetAppView = dynamic(
  () => import("@/components/features/skills/SkillsetAppView/SkillsetAppView"),
  {
    loading: () => <LoadingView />,
  }
);

const ProjectsAppView = dynamic(
  () => import("@/components/features/portfolio/ProjectsAppView/ProjectsAppView"),
  {
    loading: () => <LoadingView />,
  }
);

const ScrapbookAppView = dynamic(
  () => import("@/components/features/scrapbook/ScrapbookAppView/ScrapbookAppView"),
  {
    loading: () => <LoadingView />,
  }
);

interface AppViewsProps {
  showAboutMe: boolean;
  setShowAboutMe: (show: boolean) => void;
  showSkillset: boolean;
  setShowSkillset: (show: boolean) => void;
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  showScrapbook: boolean;
  setShowScrapbook: (show: boolean) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  selectedProjectId: number | null;
  setSelectedProjectId: (id: number | null) => void;
  onOpenDocumentary: () => void;
}

// Mount point for full-screen, non-modal "app" content — the de-modaled
// counterpart to Modals.tsx. Rendered *inside* .mac-screen (not as a sibling
// of it like Modals.tsx) so AppView takeovers stay within the monitor bezel
// instead of covering the real browser viewport.
const AppViews: React.FC<AppViewsProps> = ({
  showAboutMe,
  setShowAboutMe,
  showSkillset,
  setShowSkillset,
  showProjects,
  setShowProjects,
  showScrapbook,
  setShowScrapbook,
  selectedServiceId,
  setSelectedServiceId,
  selectedProjectId,
  setSelectedProjectId,
  onOpenDocumentary,
}) => {
  return (
    <>
      <AnimatePresence>
        {showAboutMe && (
          <AboutAppView
            key="about"
            onClose={() => setShowAboutMe(false)}
            onOpenDocumentary={onOpenDocumentary}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSkillset && (
          <SkillsetAppView
            key="skillset"
            onClose={() => {
              setShowSkillset(false);
              setSelectedServiceId(null);
            }}
            initialServiceId={selectedServiceId ?? undefined}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showProjects && (
          <ProjectsAppView
            key="projects"
            onClose={() => {
              setShowProjects(false);
              setSelectedProjectId(null);
            }}
            initialProjectId={selectedProjectId ?? undefined}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showScrapbook && (
          <ScrapbookAppView
            key="scrapbook"
            onClose={() => setShowScrapbook(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AppViews;
