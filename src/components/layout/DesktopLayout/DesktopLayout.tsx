"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

// Types
interface SelectedProject {
  id: number;
  name: string;
  description: string;
  image?: string;
  link: string;
}

interface SelectedService {
  icon: string;
  title: string;
  description: string;
}

// Idle and intent-based preloading to improve INP on first open
type RequestIdleCallback = (cb: () => void) => number | undefined;
const idle: RequestIdleCallback = (cb) => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void) => number;
  };
  if (typeof w.requestIdleCallback === "function")
    return w.requestIdleCallback(cb);
  return window.setTimeout(cb, 1);
};

const preload = {
  contact: () => import("@/features/contact/ContactForm/ContactForm"),
  about: () => import("@/features/about/AboutMeModal/AboutMeModal"),
  skillset: () => import("@/features/skills/SkillsetModal/SkillsetModal"),
  projects: () => import("@/features/portfolio/ProjectsModal/ProjectsModal"),
  documentary: () =>
    import("@/components/features/media").then((m) => m.DocumentaryPlayer),
  resume: () => import("@/features/resume/InteractiveResume/InteractiveResume"),
};

// On-intent network warmup for PBS iframe origin
const ensurePBSPreconnect = () => {
  if (typeof document === "undefined") return;
  const href = "https://player.pbs.org";
  if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
    const l = document.createElement("link");
    l.rel = "preconnect";
    l.href = href;
    l.crossOrigin = "anonymous";
    document.head.appendChild(l);
  }
  if (!document.querySelector(`link[rel="dns-prefetch"][href="${href}"]`)) {
    const d = document.createElement("link");
    d.rel = "dns-prefetch";
    d.href = href;
    document.head.appendChild(d);
  }
};

// Minute-based clock component to avoid re-rendering the entire desktop each second

const HomeScreen = () => {
  const router = useRouter();
  // State for various modals/windows
  const [showContactForm, setShowContactForm] = useState(false);
  const [showWelcomeWindow, setShowWelcomeWindow] = useState(true);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showSkillset, setShowSkillset] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showDocumentary, setShowDocumentary] = useState(false);
  const [showContactNotification, setShowContactNotification] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredTechCategory, setHoveredTechCategory] = useState<string | null>(
    null
  );
  const [selectedProject, setSelectedProject] =
    useState<SelectedProject | null>(null);
  const [selectedService, setSelectedService] =
    useState<SelectedService | null>(null);

  // Warm up the most likely modals after initial render without impacting LCP
  useEffect(() => {
    idle(() => {
      preload.about();
    });
    idle(() => {
      preload.contact();
    });
  }, []);

  const handleWelcomeWindowClose = (): void => {
    setShowWelcomeWindow(false);
  };

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
      ensurePBSPreconnect();
      setShowDocumentary(true);
    } else if (path.startsWith("http")) {
      // External URL - open in new tab
      window.open(path, "_blank");
    } else {
      // Internal navigation
      router.push(path);
    }
  };

  // Preload the corresponding dynamic chunk when the user shows intent
  const maybePreloadByPath = (path: string) => {
    if (path === "/contact") return preload.contact();
    if (path === "/mindset") return preload.about();
    if (path === "/skillset") return preload.skillset();
    if (path === "/projects") return preload.projects();
    if (path === "/documentary") {
      ensurePBSPreconnect();
      return preload.documentary();
    }
  };

  return (
    <div className="macintosh-container">
      <div className="mac-screen">
        <MenuBar
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          hoveredTechCategory={hoveredTechCategory}
          setHoveredTechCategory={setHoveredTechCategory}
          setShowAboutMe={setShowAboutMe}
          setSelectedService={setSelectedService}
          setSelectedProject={setSelectedProject}
          setShowSkillset={setShowSkillset}
          setShowContactForm={setShowContactForm}
          preload={preload}
          TimeDisplay={TimeDisplay}
        />

        <DesktopIcons
          showContactNotification={showContactNotification}
          handleAppClick={handleAppClick}
          maybePreloadByPath={maybePreloadByPath}
        />

        <WelcomeWindow
          showWelcomeWindow={showWelcomeWindow}
          handleWelcomeWindowClose={handleWelcomeWindowClose}
          handleAppClick={handleAppClick}
          preload={preload}
        />

        <Taskbar />
      </div>

      <Modals
        showContactForm={showContactForm}
        setShowContactForm={setShowContactForm}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        showAboutMe={showAboutMe}
        setShowAboutMe={setShowAboutMe}
        showResume={showResume}
        setShowResume={setShowResume}
        showSkillset={showSkillset}
        setShowSkillset={setShowSkillset}
        showProjects={showProjects}
        setShowProjects={setShowProjects}
        showDocumentary={showDocumentary}
        setShowDocumentary={setShowDocumentary}
      />
    </div>
  );
};

export default HomeScreen;
