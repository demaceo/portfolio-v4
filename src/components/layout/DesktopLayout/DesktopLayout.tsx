"use client";

import React, { useRef, useEffect } from "react";
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
  const { handleAppClick, maybePreloadByPath } = useAppActions({
    modalActions,
  });
  
  // Cursor tracking state and refs
  const desktopRef = useRef<HTMLDivElement>(null);

  // Initialize desktop with preloading
  // useDesktopInitialization();

  // Handle cursor movement over desktop
  useEffect(() => {
    const desktopElement = desktopRef.current;
    if (!desktopElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = desktopElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update the position of the cursor effect
      desktopElement.style.setProperty('--cursor-x', `${x}px`);
      desktopElement.style.setProperty('--cursor-y', `${y}px`);
    };

    const handleMouseEnter = () => {
      desktopElement.classList.add('cursor-active');
    };

    const handleMouseLeave = () => {
      desktopElement.classList.remove('cursor-active');
    };

    desktopElement.addEventListener('mousemove', handleMouseMove);
    desktopElement.addEventListener('mouseenter', handleMouseEnter);
    desktopElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      desktopElement.removeEventListener('mousemove', handleMouseMove);
      desktopElement.removeEventListener('mouseenter', handleMouseEnter);
      desktopElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="macintosh-container">
      <div className="mac-screen">
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
          desktopRef={desktopRef}
        />

        <WelcomeWindow
          showWelcomeWindow={modalState.showWelcomeWindow}
          handleAppClick={handleAppClick}
          preload={preloadModules}
        />

        <Taskbar />
      </div>

      <Modals
        showContactForm={modalState.showContactForm}
        setShowContactForm={modalActions.setShowContactForm}
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
