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

interface AppViewsProps {
  showAboutMe: boolean;
  setShowAboutMe: (show: boolean) => void;
  showSkillset: boolean;
  setShowSkillset: (show: boolean) => void;
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
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
          <SkillsetAppView key="skillset" onClose={() => setShowSkillset(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showProjects && (
          <ProjectsAppView key="projects" onClose={() => setShowProjects(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default AppViews;
