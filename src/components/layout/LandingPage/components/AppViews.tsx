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

interface AppViewsProps {
  showAboutMe: boolean;
  setShowAboutMe: (show: boolean) => void;
  onOpenDocumentary: () => void;
}

// Mount point for full-screen, non-modal "app" content — the de-modaled
// counterpart to Modals.tsx. Rendered *inside* .mac-screen (not as a sibling
// of it like Modals.tsx) so AppView takeovers stay within the monitor bezel
// instead of covering the real browser viewport.
const AppViews: React.FC<AppViewsProps> = ({ showAboutMe, setShowAboutMe, onOpenDocumentary }) => {
  return (
    <AnimatePresence>
      {showAboutMe && (
        <AboutAppView
          key="about"
          onClose={() => setShowAboutMe(false)}
          onOpenDocumentary={onOpenDocumentary}
        />
      )}
    </AnimatePresence>
  );
};

export default AppViews;
