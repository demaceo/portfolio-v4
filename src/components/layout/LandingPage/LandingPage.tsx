"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import "./LandingPage.css";
import "./LandingPage.menu.css";
import {
  MenuBar,
  DesktopIcons,
  AppSwitcher,
  WelcomeWindow,
  Taskbar,
  Modals,
  AppViews,
  TimeDisplay,
  FlyingBirds,
} from "./components";
import {
  useModalState,
  useAppActions,
  // useDesktopInitialization,
} from "@/hooks";
import { preloadModules } from "@/lib/utils/preload";

const LandingPage = () => {
  // Initialize hooks
  const { modalState, actions: modalActions } = useModalState();
  const { handleAppClick, maybePreloadByPath } = useAppActions({
    modalActions,
  });

  // Initialize desktop with preloading
  // useDesktopInitialization();

  // Whichever app is genuinely open right now, matched against DESKTOP_APPS'
  // own path strings — the single source of truth AppSwitcher's active tab
  // is derived from, instead of tracking taps locally and going stale once
  // the user navigates back to the home screen by some other means.
  const activeAppPath = modalState.showAboutMe
    ? "/mindset"
    : modalState.showSkillset
    ? "/skillset"
    : modalState.showProjects
    ? "/projects"
    : modalState.showContactForm
    ? "/contact"
    : null;

  // A full-screen AppView (not a floating Modal) is open — the same condition
  // that hides the desktop chrome. Drives the MenuBar's in-app back button.
  const isAppViewOpen =
    modalState.showAboutMe ||
    modalState.showSkillset ||
    modalState.showProjects ||
    modalState.showScrapbook;

  // Title of the open AppView (matches each AppView's own `title` prop), shown
  // centered in the MenuBar while that app is open.
  const activeAppTitle = modalState.showAboutMe
    ? "About"
    : modalState.showSkillset
    ? "Skillset"
    : modalState.showProjects
    ? "Projects"
    : modalState.showScrapbook
    ? "Scrapbook"
    : null;

  return (
    <div className="macintosh-container">
      <FlyingBirds />

      <div
        className={`mac-screen${
          isAppViewOpen ? " mac-screen--app-view-open" : ""
        }`}
      >
        <MenuBar
          setShowAboutMe={modalActions.setShowAboutMe}
          setShowProjects={modalActions.setShowProjects}
          setShowSkillset={modalActions.setShowSkillset}
          setSelectedServiceId={modalActions.setSelectedServiceId}
          setSelectedProjectId={modalActions.setSelectedProjectId}
          preload={preloadModules}
          TimeDisplay={TimeDisplay}
          isAppViewOpen={isAppViewOpen}
          activeAppTitle={activeAppTitle}
          onBack={modalActions.closeAllModals}
        />

        <DesktopIcons
          showContactNotification={modalState.showContactNotification}
          handleAppClick={handleAppClick}
          maybePreloadByPath={maybePreloadByPath}
        />

        <AppSwitcher
          showContactNotification={modalState.showContactNotification}
          activeAppPath={activeAppPath}
          handleAppClick={handleAppClick}
          maybePreloadByPath={maybePreloadByPath}
        />

        <AnimatePresence>
          {modalState.showWelcomeWindow && (
            <WelcomeWindow
              key="welcome-window"
              onClose={() => modalActions.setShowWelcomeWindow(false)}
              handleAppClick={handleAppClick}
              preload={preloadModules}
            />
          )}
        </AnimatePresence>

        <Taskbar
          showWelcomeWindow={modalState.showWelcomeWindow}
          onTogglePortfolio={modalActions.toggleWelcomeWindow}
        />

        <AppViews
          showAboutMe={modalState.showAboutMe}
          setShowAboutMe={modalActions.setShowAboutMe}
          showSkillset={modalState.showSkillset}
          setShowSkillset={modalActions.setShowSkillset}
          showProjects={modalState.showProjects}
          setShowProjects={modalActions.setShowProjects}
          showScrapbook={modalState.showScrapbook}
          setShowScrapbook={modalActions.setShowScrapbook}
          selectedServiceId={modalState.selectedServiceId}
          setSelectedServiceId={modalActions.setSelectedServiceId}
          selectedProjectId={modalState.selectedProjectId}
          setSelectedProjectId={modalActions.setSelectedProjectId}
          onOpenDocumentary={() => modalActions.setShowDocumentary(true)}
        />
      </div>

      <Modals
        showContactForm={modalState.showContactForm}
        setShowContactForm={modalActions.setShowContactForm}
        showResume={modalState.showResume}
        setShowResume={modalActions.setShowResume}
        showDocumentary={modalState.showDocumentary}
        setShowDocumentary={modalActions.setShowDocumentary}
      />
    </div>
  );
};

export default LandingPage;
