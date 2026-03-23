"use client";

import React from "react";
import dynamic from "next/dynamic";

const LoadingModal = () => {
  return <></>;
};

const ContactForm = dynamic(
  () => import("@/features/contact/ContactForm/ContactForm"),
  {
    loading: () => <LoadingModal />,
  }
);

const AboutMeModal = dynamic(
  () => import("@/features/about/AboutMeModal/AboutMeModal"),
  {
    loading: () => <LoadingModal />,
  }
);

const SkillsetModal = dynamic(
  () => import("@/features/skills/SkillsetModal/SkillsetModal"),
  {
    loading: () => <LoadingModal />,
  }
);

const ProjectsModal = dynamic(
  () => import("@/features/portfolio/ProjectsModal/ProjectsModal"),
  {
    loading: () => <LoadingModal />,
  }
);

const DocumentaryPlayer = dynamic(
  () => import("@/features/media").then((m) => m.DocumentaryPlayer),
  {
    ssr: false,
    loading: () => <LoadingModal />,
  }
);

interface MobileModalsProps {
  showContactForm: boolean;
  setShowContactForm: (show: boolean) => void;
  showAboutMe: boolean;
  setShowAboutMe: (show: boolean) => void;
  showSkillset: boolean;
  setShowSkillset: (show: boolean) => void;
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  showDocumentary: boolean;
  setShowDocumentary: (show: boolean) => void;
}

const MobileModals: React.FC<MobileModalsProps> = ({
  showContactForm,
  setShowContactForm,
  showAboutMe,
  setShowAboutMe,
  showSkillset,
  setShowSkillset,
  showProjects,
  setShowProjects,
  showDocumentary,
  setShowDocumentary,
}) => {
  return (
    <>
      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
      {showAboutMe && (
        <AboutMeModal onClose={() => setShowAboutMe(false)} />
      )}
      {showSkillset && (
        <SkillsetModal onClose={() => setShowSkillset(false)} />
      )}
      {showProjects && (
        <ProjectsModal onClose={() => setShowProjects(false)} />
      )}
      {showDocumentary && (
        <DocumentaryPlayer onClose={() => setShowDocumentary(false)} />
      )}
    </>
  );
};

export default MobileModals;
