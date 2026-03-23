"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  faUser,
  faLaptopCode,
  faCog,
  // faFilm,
} from "@fortawesome/free-solid-svg-icons";
import { EXTERNAL_LINKS } from "@/lib/constants/paths";
import "./MobileLayout.css";
import {
  StatusBar,
  MobileWelcomeWindow,
  HomeApps,
  // PageIndicators,
  MobileDock,
  MobileModals,
} from "./components";

const MobileLayout = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const syncTime = () => {
      setCurrentTime(new Date());
    };

    syncTime();
    const intervalId = window.setInterval(syncTime, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);
  const [showContactForm, setShowContactForm] = useState(false);
  const showWelcomeWindow = true;
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showSkillset, setShowSkillset] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showDocumentary, setShowDocumentary] = useState(false);
  const [showContactNotification, setShowContactNotification] = useState(true);
  const isAnyModalOpen =
    showAboutMe ||
    showSkillset ||
    showDocumentary ||
    showContactForm ||
    showProjects;

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
    about: () => import("@/components/features/about/AboutMeModal/AboutMeModal"),
    skillset: () => import("@/components/features/skills/SkillsetModal/SkillsetModal"),
    projects: () => import("@/components/features/portfolio/ProjectsModal/ProjectsModal"),
    documentary: () =>
      import("@/components/features/media").then((m) => m.DocumentaryPlayer),
  };

  const handleContactPreload = () =>
    import("@/features/contact/ContactForm/ContactForm");

  // Mobile apps data
  const mobileApps = [
    {
      name: "Mindset",
      icon: faUser,
      path: "/mindset",
      description: "Approach, leadership style, and professional direction.",
      meta: "Profile",
    },
    {
      name: "Skillset",
      icon: faCog,
      path: "/skillset",
      description: "Core capabilities, service focus, and technical strengths.",
      meta: "Capabilities",
    },
    {
      name: "Projects",
      icon: faLaptopCode,
      path: "/projects",
      description: "Case studies and shipped work across product experiences.",
      meta: "Portfolio",
    },
    // { name: "Docuseries", icon: faFilm, path: "/documentary" },
  ];

  if (!currentTime) {
    // Prevent hydration mismatch by not rendering until client time is set
    return null;
  }

  return (
    <div className="iphone-container command-layout">
      <div className="iphone-screen">
        <StatusBar currentTime={currentTime} />
        <div
          className={`mobile-app-container command-stage${isAnyModalOpen ? " has-open-modal" : ""}`}
        >
          <MobileWelcomeWindow
            showWelcomeWindow={showWelcomeWindow}
            onPrimaryAction={() => handleAppClick("/projects")}
            onSecondaryAction={() => handleAppClick("/contact", true)}
          />
          <HomeApps
            apps={mobileApps}
            handleAppClick={handleAppClick}
            preloadHandlers={preloadHandlers}
          />
        </div>
        {/* <PageIndicators /> */}
        {!isAnyModalOpen && (
          <MobileDock
            handleAppClick={handleAppClick}
            showContactNotification={showContactNotification}
            linkedinUrl={EXTERNAL_LINKS.LINKEDIN}
            calendlyUrl={EXTERNAL_LINKS.CALENDLY}
            onContactPreload={handleContactPreload}
          />
        )}
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
    </div>
  );
};

export default MobileLayout;
