import React, { useMemo, useState } from "react";
import { aboutMePills } from "@/data/aboutMePills";
import { AboutMePill } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";
import "./AboutMeModal.css";

interface AboutMeModalProps {
  onClose: () => void;
  onOpenContact?: () => void;
  onOpenResume?: () => void;
}

const profileHighlights = [
  {
    label: "Core Role",
    value: "Product-minded software engineer and UI-focused builder",
  },
  {
    label: "Operating Mode",
    value: "Calm execution, high ownership, and strong follow-through",
  },
  {
    label: "Team Value",
    value: "Bridges strategy, design, and implementation",
  },
  {
    label: "Primary Focus",
    value: "Human-centered systems with measurable product outcomes",
  },
];

const collaborationSections = [
  {
    title: "How I Think",
    points: [
      "I break complex problems into practical delivery steps.",
      "I stay focused on user outcomes, not just feature output.",
      "I move between detail and big picture without losing momentum.",
    ],
  },
  {
    title: "How I Work",
    points: [
      "I prefer clear constraints, clean tradeoffs, and accountable execution.",
      "I communicate early when risk appears, then propose options with impact.",
      "I prioritize maintainable systems that teams can extend confidently.",
    ],
  },
  {
    title: "How I Collaborate",
    points: [
      "I work best in cooperative teams with direct, respectful feedback.",
      "I default to alignment through context, examples, and shared language.",
      "I balance speed and quality so decisions remain durable over time.",
    ],
  },
];

const AboutMeModal: React.FC<AboutMeModalProps> = ({
  onClose,
  // onOpenContact,
  // onOpenResume,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const pillsByLabel = useMemo(() => {
    return aboutMePills.reduce<Record<string, AboutMePill>>((acc, pill) => {
      acc[pill.label] = pill;
      return acc;
    }, {});
  }, []);

  const handlePillClick = (pill: AboutMePill) => {
    if (activeTooltip === pill.label) {
      if (pill.link) {
        window.open(pill.link, "_blank", "noopener,noreferrer");
      } else {
        setActiveTooltip(null);
      }
      return;
    }

    setActiveTooltip(pill.label);
  };

  const handleModalClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".about-modal-pill")) {
      setActiveTooltip(null);
    }
  };

  return (
    <ModalFrame
      onClose={onClose}
      title="About"
      size="md"
      titleId="about-title"
      closeAriaLabel="Close about modal"
    >
      <div className="about-modal-content" onClick={handleModalClick}>
        <header className="about-modal-header">
          <p className="about-modal-eyebrow">Profile</p>
          <h2>Hello, I&apos;m Demaceo Vincent</h2>
          <p className="about-modal-subtitle">
            Software Engineer, Designer, and systems-minded problem solver.
          </p>
        </header>

        <section className="about-highlight-grid" aria-label="At a glance profile highlights">
          {profileHighlights.map((item) => (
            <article key={item.label} className="about-highlight-card">
              <h3>{item.label}</h3>
              <p>{item.value}</p>
            </article>
          ))}
        </section>

        <section className="about-modal-body" aria-label="Working style details">
          {collaborationSections.map((section) => (
            <article key={section.title} className="about-modal-section">
              <h3>{section.title}</h3>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="about-strengths" aria-label="Core strengths">
          <header>
            <h3>Core Strengths</h3>
            <p>
              Select a strength to see detail. Click again to open external links.
            </p>
          </header>

          <div className="about-modal-pills">
            {aboutMePills.map((pill) => {
              const isActive = activeTooltip === pill.label;
              return (
                <button
                  key={pill.label}
                  type="button"
                  className={`about-modal-pill ${pill.link ? "clickable" : ""} ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() => handlePillClick(pill)}
                  aria-expanded={isActive}
                  aria-controls={`pill-tooltip-${pill.label.replace(/\s+/g, "-")}`}
                >
                  <span>{pill.label}</span>
                  {isActive && (
                    <span
                      id={`pill-tooltip-${pill.label.replace(/\s+/g, "-")}`}
                      className="about-modal-pill-tooltip"
                    >
                      {pillsByLabel[pill.label]?.tooltip}
                      {pill.link && (
                        <span className="tooltip-link-hint"> Click again to open.</span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </ModalFrame>
  );
};

export default AboutMeModal;
