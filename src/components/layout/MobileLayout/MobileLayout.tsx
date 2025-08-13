"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  faUser,
  faLaptopCode,
  faCog,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";
import { EXTERNAL_LINKS } from "@/lib/constants/paths";
import "./MobileLayout.css";
import {
  StatusBar,
  MobileWelcomeWindow,
  HomeApps,
  PageIndicators,
  MobileDock,
  MobileModals,
} from "./components";

const MobileLayout = () => {
  const router = useRouter();
  const [currentTime] = useState(new Date());
  const [showContactForm, setShowContactForm] = useState(false);
  const [showWelcomeWindow, setShowWelcomeWindow] = useState(true);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showSkillset, setShowSkillset] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showDocumentary, setShowDocumentary] = useState(false);
  const [showContactNotification, setShowContactNotification] = useState(true);

  // App click handler
  const handleAppClick = (path: string, isToggle?: boolean): void => {
    if (path === "/contact" || isToggle) {
      setShowContactForm(!showContactForm);
      setShowContactNotification(false);
    } else if (path === "/mindset") {
      setShowAboutMe(true);
    } else if (path === "/skillset") {
      setShowSkillset(true);
    } else if (path === "/projects") {
      setShowProjects(true);
    } else if (path === "/documentary") {
      setShowDocumentary(true);
    } else if (path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      router.push(path);
    }
  };

  // Preload handlers for performance
  const preloadHandlers = {
    about: () => import("@/features/about/AboutMeModal/AboutMeModal"),
    skillset: () => import("@/features/skills/SkillsetModal/SkillsetModal"),
    projects: () => import("@/features/portfolio/ProjectsModal/ProjectsModal"),
    documentary: () =>
      import("@/features/media").then((m) => m.DocumentaryPlayer),
  };

  const handleContactPreload = () =>
    import("@/features/contact/ContactForm/ContactForm");

  // Mobile apps data
  const mobileApps = [
    { name: "Mindset", icon: faUser, path: "/mindset" },
    { name: "Skillset", icon: faCog, path: "/skillset" },
    { name: "Projects", icon: faLaptopCode, path: "/projects" },
    { name: "Docuseries", icon: faFilm, path: "/documentary" },
  ];

  return (
    <div className="iphone-container">
      <div className="iphone-screen">
        <StatusBar currentTime={currentTime} />
        <div className="mobile-app-container">
          <MobileWelcomeWindow
            showWelcomeWindow={showWelcomeWindow}
            handleWelcomeWindowClose={() => setShowWelcomeWindow(false)}
          />
          <HomeApps
            apps={mobileApps}
            handleAppClick={handleAppClick}
            preloadHandlers={preloadHandlers}
          />
          <MobileModals
            showContactForm={showContactForm}
            setShowContactForm={setShowContactForm}
            showAboutMe={showAboutMe}
            setShowAboutMe={setShowAboutMe}
            showSkillset={showSkillset}
            setShowSkillset={setShowSkillset}
            showProjects={showProjects}
            setShowProjects={setShowProjects}
            showDocumentary={showDocumentary}
            setShowDocumentary={setShowDocumentary}
          />
        </div>
        <PageIndicators />
        <MobileDock
          handleAppClick={handleAppClick}
          showContactNotification={showContactNotification}
          linkedinUrl={EXTERNAL_LINKS.LINKEDIN}
          calendlyUrl={EXTERNAL_LINKS.CALENDLY}
          onContactPreload={handleContactPreload}
        />
      </div>
    </div>
  );
};

export default MobileLayout;
