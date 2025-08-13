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
      {showContactForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowContactForm(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="contact-form-inner">
              <ContactForm onClose={() => setShowContactForm(false)} />
            </div>
          </div>
        </div>
      )}

      {showAboutMe && (
        <div className="modal-overlay" onClick={() => setShowAboutMe(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AboutMeModal onClose={() => setShowAboutMe(false)} />
          </div>
        </div>
      )}

      {showSkillset && (
        <div className="modal-overlay" onClick={() => setShowSkillset(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <SkillsetModal onClose={() => setShowSkillset(false)} />
          </div>
        </div>
      )}

      {showProjects && (
        <div className="modal-overlay" onClick={() => setShowProjects(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ProjectsModal onClose={() => setShowProjects(false)} />
          </div>
        </div>
      )}

      {showDocumentary && (
        <div
          className="modal-overlay"
          onClick={() => setShowDocumentary(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <DocumentaryPlayer onClose={() => setShowDocumentary(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileModals;
