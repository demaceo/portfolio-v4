"use client";

import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
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
  MobileSearchButton,
} from "./components";
import {
  useModalState,
  useAppActions,
  // useDesktopInitialization,
} from "@/hooks";
import { preloadModules } from "@/lib/utils/preload";
import { PaletteContext } from "@/components/features/command/PaletteContext";

// Code-split: the palette only downloads on first ⌘K / Projects click (or on
// MenuBar hover/focus via preloadModules.palette).
const CommandPalette = dynamic(
  () => import("@/components/features/command/CommandPalette"),
  { ssr: false }
);

const LandingPage = () => {
  // Initialize hooks
  const { modalState, actions: modalActions } = useModalState();
  const { handleAppClick, maybePreloadByPath } = useAppActions({
    modalActions,
  });

  const [showPalette, setShowPalette] = useState(false);
  // Incremented per palette project pick (see AppViews' projectRequestKey).
  const [projectRequestKey, setProjectRequestKey] = useState(0);
  const openPalette = useCallback(() => setShowPalette(true), []);
  const closePalette = useCallback(() => setShowPalette(false), []);

  // ⌘K (macOS) / Ctrl+K (elsewhere) toggles the palette from anywhere.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // Holding the keys auto-repeats keydown; toggling on each repeat would
        // flicker the palette open/closed.
        if (e.repeat) return;
        setShowPalette((open) => !open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const { setSelectedProjectId } = modalActions;
  const paletteOpenProject = useCallback(
    (id: number) => {
      setShowPalette(false);
      setSelectedProjectId(id);
      setProjectRequestKey((k) => k + 1);
      handleAppClick("/projects");
    },
    [setSelectedProjectId, handleAppClick]
  );
  const paletteOpenContact = useCallback(() => {
    setShowPalette(false);
    // handleAppClick("/contact") toggles (and clears the badge) — only fire it
    // when Contact isn't already open, so this always means "open".
    if (!modalState.showContactForm) handleAppClick("/contact");
  }, [modalState.showContactForm, handleAppClick]);
  const paletteOpenResume = useCallback(() => {
    setShowPalette(false);
    handleAppClick("/resume");
  }, [handleAppClick]);

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
    <PaletteContext.Provider value={openPalette}>
      <div className="macintosh-container">
        <FlyingBirds />

        <div
          className={`mac-screen${
            isAppViewOpen ? " mac-screen--app-view-open" : ""
          }`}
        >
          <MenuBar
            setShowAboutMe={modalActions.setShowAboutMe}
            setShowSkillset={modalActions.setShowSkillset}
            setSelectedServiceId={modalActions.setSelectedServiceId}
            onOpenPalette={openPalette}
            isPaletteOpen={showPalette}
            preload={preloadModules}
            TimeDisplay={TimeDisplay}
            isAppViewOpen={isAppViewOpen}
            activeAppTitle={activeAppTitle}
            onBack={modalActions.closeAllModals}
          />

          {!isAppViewOpen && (
            <MobileSearchButton
              onOpen={openPalette}
              onPreload={preloadModules.palette}
              isOpen={showPalette}
            />
          )}

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
            projectRequestKey={projectRequestKey}
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

        {/* Rendered here, not inside MenuBar: .menu-bar's backdrop-filter would
            become the containing block for the palette's position:fixed overlay. */}
        <AnimatePresence>
          {showPalette && (
            <CommandPalette
              key="command-palette"
              onClose={closePalette}
              onOpenProject={paletteOpenProject}
              onOpenContact={paletteOpenContact}
              onOpenResume={paletteOpenResume}
            />
          )}
        </AnimatePresence>
      </div>
    </PaletteContext.Provider>
  );
};

export default LandingPage;
