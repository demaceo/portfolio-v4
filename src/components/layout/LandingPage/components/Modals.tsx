"use client";

import React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

const LoadingModal = () => {
  return <></>;
};

const ContactForm = dynamic(
  () => import("@/components/features/contact/ContactForm/ContactForm"),
  {
    loading: () => <LoadingModal />,
  }
);

const InteractiveResume = dynamic(
  () => import("@/components/features/resume/InteractiveResume/InteractiveResume"),
  {
    loading: () => <LoadingModal />,
  }
);

const SkillsetModal = dynamic(
  () => import("@/components/features/skills/SkillsetModal/SkillsetModal"),
  {
    loading: () => <LoadingModal />,
  }
);

const ProjectsGalleryModal = dynamic(
  () =>
    import(
      "@/components/features/portfolio/ProjectsGalleryModal/ProjectsGalleryModal"
    ),
  {
    loading: () => <LoadingModal />,
  }
);

const DocumentaryPlayer = dynamic(
  () => import("@/components/features/media").then((m) => m.DocumentaryPlayer),
  {
    ssr: false,
    loading: () => <LoadingModal />,
  }
);

interface ModalsProps {
  showContactForm: boolean;
  setShowContactForm: (show: boolean) => void;
  showResume: boolean;
  setShowResume: (show: boolean) => void;
  showSkillset: boolean;
  setShowSkillset: (show: boolean) => void;
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  showDocumentary: boolean;
  setShowDocumentary: (show: boolean) => void;
}

const Modals: React.FC<ModalsProps> = ({
  showContactForm,
  setShowContactForm,
  showResume,
  setShowResume,
  showSkillset,
  setShowSkillset,
  showProjects,
  setShowProjects,
  showDocumentary,
  setShowDocumentary,
}) => {
  return (
    <>
      <AnimatePresence>
        {showContactForm && (
          <ContactForm key="contact" onClose={() => setShowContactForm(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showResume && (
          <InteractiveResume key="resume" onClose={() => setShowResume(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSkillset && (
          <SkillsetModal key="skillset" onClose={() => setShowSkillset(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showProjects && (
          <ProjectsGalleryModal key="projects" onClose={() => setShowProjects(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDocumentary && (
          <DocumentaryPlayer key="documentary" onClose={() => setShowDocumentary(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Modals;
