import React, { useState } from "react";
import { aboutMePills } from "@/data/aboutMePills";
import { AboutMePill } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";
import "./AboutMeModal.css";

interface AboutMeModalProps {
  onClose: () => void;
  onOpenContact?: () => void;
  onOpenResume?: () => void;
}

const AboutMeModal: React.FC<AboutMeModalProps> = ({
  onClose,
  // onOpenContact,
  // onOpenResume,
}) => {

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handlePillClick = (pill: AboutMePill) => {
    // Toggle tooltip display for all pills
    if (activeTooltip === pill.label) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip(pill.label);
    }

    // Handle link navigation for clickable pills
    if (pill.link) {
      // Small delay to show tooltip before opening link
      setTimeout(() => {
        window.open(pill.link, "_blank", "noopener,noreferrer");
      }, 300);
    }
  }

  // Close tooltip when clicking outside of pills
  const handleModalClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
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
      <div
        className="about-modal-content"
        // ref={bodyRef}
        onClick={handleModalClick}
      >
        <div className="about-modal-header">
          <h2>Hello, I&apos;m Demaceo Vincent</h2>
          <p className="about-modal-subtitle">
            Developer, Designer, Dog-Dad, & Diver
          </p>
        </div>

        <div className="about-modal-body">
          <div className="about-modal-section">
            <h3>Who I Am</h3>
            <p>
              I&apos;m a goal-oriented professional who thrives on connecting ideas,
              people, and possibilities. Driven by exceeding expectations and achieving
              meaningful results, I bring exceptional follow-through to every project.
              Whether breaking down complex problems or zooming out to see the bigger 
              picture, I&apos;m comfortable navigating ambiguity and turning challenges 
              into actionable solutions.
            </p>
            <p>
              My intellectual curiosity energizes me to explore new technologies, 
              embrace novel experiences, and engage in creative problem-solving. 
              Known for my cooperative spirit and patient approach, I deliver results 
              while fostering collaborative environments where teams can thrive.
            </p>
          </div>

          <div className="about-modal-section">
            <h3>How I Work</h3>
            <p>
              I excel at untangling problems with a service-oriented mindset, 
              always seeking to accommodate others while maintaining high standards. 
              My cooperative nature means I value social harmony and actively seek 
              common ground in team situations. Complexity doesn&apos;t intimidate 
              me - it inspires growth and fresh perspectives.
            </p>
            <p>
              Highly tolerant of frustrations and naturally patient, I remain 
              calm and level-headed when challenges arise. My intellectual curiosity 
              drives experimentation and creative solutions, while my goal-oriented 
              approach ensures consistent follow-through. I thrive in collaborative 
              environments where diverse viewpoints contribute to meaningful outcomes.
            </p>
          </div>

          <div className="about-modal-section">
            <h3>Core Strengths</h3>
            <div className="about-modal-pills">
              {aboutMePills.map((pill) => (
                <div
                  key={pill.label}
                  className={`about-modal-pill ${
                    pill.link ? "clickable" : ""
                  } ${activeTooltip === pill.label ? "active" : ""}`}
                  onClick={() => handlePillClick(pill)}
                  style={{ cursor: "pointer" }}
                >
                  {pill.label}
                  {activeTooltip === pill.label && (
                    <div className="about-modal-pill-tooltip">
                      {pill.tooltip}
                      {pill.link && (
                        <span className="tooltip-link-hint">
                          {" "}
                          (Click to open)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="about-modal-section">
            <h3>In Summary</h3>
            <p>
              Whether I&apos;m leading a project, supporting a team, or exploring 
              new ideas, I bring together goal-oriented drive, intellectual curiosity, 
              and genuine collaborative spirit. My patient and tolerant nature, 
              combined with strong achievement motivation, makes me someone teams 
              can count on for both innovative thinking and reliable execution. 
              I&apos;m at my best where insight meets action, and where cooperative 
              problem-solving drives meaningful results.
            </p>
          </div>
        </div>
      </div>

      {/* <div className="about-modal-footer">
        <div className="about-modal-progress-bar">
          <div
            className="about-modal-progress-fill"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <div className="about-modal-actions">
          <div className="about-modal-status">
            <span>Reading: {Math.round(scrollProgress)}% complete</span>
          </div>
          <div className="about-modal-buttons">
            <button
              className="about-modal-action-btn contact-btn"
              onClick={handleContactMe}
              type="button"
            >
              Contact
            </button>
            <button
              className="about-modal-action-btn resume-btn"
              onClick={handleViewResume}
              type="button"
            >
              View Work XP
            </button>
          </div>
        </div>
      </div> */}
    </ModalFrame>
  );
};

export default AboutMeModal;
