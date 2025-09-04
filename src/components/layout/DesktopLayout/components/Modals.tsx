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

const InteractiveResume = dynamic(
  () => import("@/features/resume/InteractiveResume/InteractiveResume"),
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DocumentaryPlayer = dynamic(
  () => import("@/features/media").then((m) => m.DocumentaryPlayer),
  {
    ssr: false,
    loading: () => <LoadingModal />,
  }
);

interface ModalsProps {
  showContactForm: boolean;
  setShowContactForm: (show: boolean) => void;
  showAboutMe: boolean;
  setShowAboutMe: (show: boolean) => void;
  showResume: boolean;
  setShowResume: (show: boolean) => void;
  showSkillset: boolean;
  setShowSkillset: (show: boolean) => void;
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  showDocumentary?: boolean;
  setShowDocumentary?: (show: boolean) => void;
}

const Modals: React.FC<ModalsProps> = ({
  showContactForm,
  setShowContactForm,
  showAboutMe,
  setShowAboutMe,
  showResume,
  setShowResume,
  showSkillset,
  setShowSkillset,
  showProjects,
  setShowProjects,
  // showDocumentary,
  // setShowDocumentary,
}) => {
  return (
    <>
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
      {showAboutMe && (
        <AboutMeModal
          onClose={() => setShowAboutMe(false)}
          onOpenContact={() => setShowContactForm(true)}
          onOpenResume={() => setShowResume(true)}
        />
      )}
      {showResume && <InteractiveResume onClose={() => setShowResume(false)} />}
      {showSkillset && <SkillsetModal onClose={() => setShowSkillset(false)} />}
      {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} />}
      {/* {showDocumentary && ( */}
      {/* <DocumentaryPlayer onClose={() => setShowDocumentary(false)} /> */}
      {/* )} */}
    </>
  );
};

export default Modals;
