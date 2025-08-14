"use client";

import React from "react";
import dynamic from "next/dynamic";
import ServiceCard from "@/features/skills/ServiceCard/ServiceCard";
import ProjectCard from "@/features/portfolio/ProjectCard/ProjectCard";
import { SelectedProject, SelectedService } from "@/lib/types";

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
  selectedProject: SelectedProject | null;
  setSelectedProject: (project: SelectedProject | null) => void;
  selectedService: SelectedService | null;
  setSelectedService: (service: SelectedService | null) => void;
  showAboutMe: boolean;
  setShowAboutMe: (show: boolean) => void;
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
  selectedProject,
  setSelectedProject,
  selectedService,
  setSelectedService,
  showAboutMe,
  setShowAboutMe,
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
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
      {selectedProject && (
        <ProjectCard
          id={selectedProject.id}
          name={selectedProject.name}
          description={selectedProject.description}
          image={selectedProject.image}
          link={selectedProject.link}
          onClose={() => setSelectedProject(null)}
        />
      )}
      {selectedService && (
        <ServiceCard
          icon={selectedService.icon}
          title={selectedService.title}
          description={selectedService.description}
          onClose={() => setSelectedService(null)}
        />
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
      {showDocumentary && (
        <DocumentaryPlayer onClose={() => setShowDocumentary(false)} />
      )}
    </>
  );
};

export default Modals;
