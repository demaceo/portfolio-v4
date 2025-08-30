"use client";

import React from "react";
import "./DesktopLayout.css";
import "./DesktopLayout.menu.css";
import {
  MenuBar,
  DesktopIcons,
  WelcomeWindow,
  Taskbar,
  Modals,
  TimeDisplay,
} from "./components";
import {
  useModalState,
  useDropdownState,
  useAppActions,
  // useDesktopInitialization,
} from "@/hooks";
import { preloadModules } from "@/lib/utils/preload";

const HomeScreen = () => {
  // Initialize hooks
  const { modalState, actions: modalActions } = useModalState();
  const { dropdownState, actions: dropdownActions } = useDropdownState();
  const { handleAppClick, handleWelcomeWindowClose, maybePreloadByPath } =
    useAppActions({ modalActions });

  // Initialize desktop with preloading
  // useDesktopInitialization();

  return (
    <div className="macintosh-container">
      <div className="mac-screen">
        <MenuBar
          openDropdown={dropdownState.openDropdown}
          setOpenDropdown={dropdownActions.setOpenDropdown}
          hoveredTechCategory={dropdownState.hoveredTechCategory}
          setHoveredTechCategory={dropdownActions.setHoveredTechCategory}
          setShowAboutMe={modalActions.setShowAboutMe}
          setSelectedService={dropdownActions.setSelectedService}
          setSelectedProject={dropdownActions.setSelectedProject}
          setShowSkillset={modalActions.setShowSkillset}
          setShowContactForm={modalActions.setShowContactForm}
          preload={preloadModules}
          TimeDisplay={TimeDisplay}
        />

        <DesktopIcons
          showContactNotification={modalState.showContactNotification}
          handleAppClick={handleAppClick}
          maybePreloadByPath={maybePreloadByPath}
        />

        <WelcomeWindow
          showWelcomeWindow={modalState.showWelcomeWindow}
          handleWelcomeWindowClose={handleWelcomeWindowClose}
          handleAppClick={handleAppClick}
          preload={preloadModules}
        />

        <Taskbar />
      </div>

      <Modals
        showContactForm={modalState.showContactForm}
        setShowContactForm={modalActions.setShowContactForm}
        selectedProject={dropdownState.selectedProject}
        setSelectedProject={dropdownActions.setSelectedProject}
        selectedService={dropdownState.selectedService}
        setSelectedService={dropdownActions.setSelectedService}
        showAboutMe={modalState.showAboutMe}
        setShowAboutMe={modalActions.setShowAboutMe}
        showResume={modalState.showResume}
        setShowResume={modalActions.setShowResume}
        showSkillset={modalState.showSkillset}
        setShowSkillset={modalActions.setShowSkillset}
        showProjects={modalState.showProjects}
        setShowProjects={modalActions.setShowProjects}
        // showDocumentary={modalState.showDocumentary}
        // setShowDocumentary={modalActions.setShowDocumentary}
      />
    </div>
  );
};

export default HomeScreen;
