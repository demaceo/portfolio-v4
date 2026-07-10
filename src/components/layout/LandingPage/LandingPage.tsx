"use client";

import React from "react";
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
  useDropdownState,
  useAppActions,
  // useDesktopInitialization,
} from "@/hooks";
import { preloadModules } from "@/lib/utils/preload";

const LandingPage = () => {
  // Initialize hooks
  const { modalState, actions: modalActions } = useModalState();
  const { dropdownState, actions: dropdownActions } = useDropdownState();
  const { handleAppClick, maybePreloadByPath } = useAppActions({
    modalActions,
  });

  // Initialize desktop with preloading
  // useDesktopInitialization();

  return (
    <div className="macintosh-container">
      <FlyingBirds />

      <div
        className={`mac-screen${
          modalState.showAboutMe || modalState.showSkillset || modalState.showProjects
            ? " mac-screen--app-view-open"
            : ""
        }`}
      >
        <MenuBar
          openDropdown={dropdownState.openDropdown}
          setOpenDropdown={dropdownActions.setOpenDropdown}
          hoveredTechCategory={dropdownState.hoveredTechCategory}
          setHoveredTechCategory={dropdownActions.setHoveredTechCategory}
          setShowAboutMe={modalActions.setShowAboutMe}
          setShowProjects={modalActions.setShowProjects}
          setShowSkillset={modalActions.setShowSkillset}
          // setShowContactForm={modalActions.setShowContactForm}
          preload={preloadModules}
          TimeDisplay={TimeDisplay}
        />

        <DesktopIcons
          showContactNotification={modalState.showContactNotification}
          handleAppClick={handleAppClick}
          maybePreloadByPath={maybePreloadByPath}
        />

        <AppSwitcher
          showContactNotification={modalState.showContactNotification}
          handleAppClick={handleAppClick}
          maybePreloadByPath={maybePreloadByPath}
        />

        <WelcomeWindow
          showWelcomeWindow={modalState.showWelcomeWindow}
          onClose={() => modalActions.setShowWelcomeWindow(false)}
          handleAppClick={handleAppClick}
          preload={preloadModules}
        />

        <Taskbar />

        <AppViews
          showAboutMe={modalState.showAboutMe}
          setShowAboutMe={modalActions.setShowAboutMe}
          showSkillset={modalState.showSkillset}
          setShowSkillset={modalActions.setShowSkillset}
          showProjects={modalState.showProjects}
          setShowProjects={modalActions.setShowProjects}
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
