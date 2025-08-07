import React, { useState, useRef } from "react";
import { aboutMePills, AboutMePill } from "@/data/aboutMePills";
import "./AboutMeModal.css";

interface AboutMeModalProps {
  onClose: () => void;
  onOpenContact?: () => void;
  onOpenResume?: () => void;
}

const AboutMeModal: React.FC<AboutMeModalProps> = ({
  onClose,
  onOpenContact,
  onOpenResume,
}) => {
  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const dragOffset = useRef({ x: 0, y: 0 });
  const bodyRef = useRef<HTMLDivElement>(null);

  // Tooltip state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Center the modal on mount
  React.useEffect(() => {
    const centerX = window.innerWidth / 2 - 450; // modal width / 2
    const centerY = window.innerHeight / 2 - 300; // modal height / 2
    setPosition({ x: Math.max(centerX, 0), y: Math.max(centerY, 0) });
  }, []);

  // Track scroll progress
  React.useEffect(() => {
    const bodyElement = bodyRef.current;
    if (!bodyElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = bodyElement;
      const maxScroll = scrollHeight - clientHeight;
      // Prevent division by zero
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    bodyElement.addEventListener("scroll", handleScroll);
    // Initial calculation in case already scrolled
    handleScroll();
    return () => {
      bodyElement.removeEventListener("scroll", handleScroll);
    };
  }, [bodyRef]);

  const handlePillClick = (pill: AboutMePill) => {
    // Toggle tooltip display for all pills
    if (activeTooltip === pill.label) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip(pill.label);
    }

    // Handle link navigation for clickable pills
    if (pill.link) {
      console.log("Modal pill clicked:", pill.label, pill.link);
      // Small delay to show tooltip before opening link
      setTimeout(() => {
        window.open(pill.link, "_blank", "noopener,noreferrer");
      }, 300);
    }
  };

  // Action button handlers
  const handleContactMe = () => {
    onClose();
    if (onOpenContact) {
      onOpenContact();
    }
  };

  const handleViewResume = () => {
    onClose();
    if (onOpenResume) {
      onOpenResume();
    }
  };

  // Mouse events for drag
  const handleDragStart = (e: React.MouseEvent) => {
    setDragging(true);
    const modal = e.currentTarget.closest(".about-modal") as HTMLElement;
    const rect = modal.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.body.style.userSelect = "none";
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleDragEnd = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  // Touch events for drag (mobile support)
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    const modal = e.currentTarget.closest(".about-modal") as HTMLElement;
    const rect = modal.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    document.body.style.userSelect = "none";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragOffset.current.x,
      y: touch.clientY - dragOffset.current.y,
    });
  };

  const handleTouchEnd = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  // Close tooltip when clicking outside of pills
  const handleModalClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".about-modal-pill")) {
      setActiveTooltip(null);
    }
  };

  return (
    <div
      className="about-modal-overlay"
      onClick={onClose}
      style={{ cursor: dragging ? "grabbing" : undefined }}
    >
      <div
        className="about-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          zIndex: 3000,
          cursor: dragging ? "grabbing" : "default",
          transition: dragging ? "none" : "box-shadow 0.2s",
        }}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="about-modal-title-bar"
          style={{ cursor: "grab" }}
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchStart}
        >
          <div className="about-modal-window-controls">
            <button
              className="about-modal-close-btn"
              onClick={onClose}
              aria-label="Close About Modal"
            />
          </div>
          <span className="about-modal-window-title">About</span>
        </div>

        <div
          className="about-modal-content"
          ref={bodyRef}
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
                I&apos;m a lifelong learner who thrives on connecting ideas,
                people, and possibilities. Whether breaking down complex
                problems or zooming out to see the bigger picture, I&apos;m
                comfortable navigating ambiguity and turning challenges into
                actionable solutions.
              </p>
              <p>
                Known for my adaptability, empathy, and reliability, I deliver
                results - whether working solo or collaborating with a team.
                I&apos;m eager to explore new technologies, spark meaningful
                conversations, and apply knowledge to create tangible, positive
                impact.
              </p>
            </div>

            <div className="about-modal-section">
              <h3>How I Work</h3>
              <p>
                I excel at untangling problems, uncovering connections, and
                getting to the root of &quot;why.&quot; Complexity doesn&apos;t
                intimidate me - it inspires growth and fresh perspectives. I
                approach challenges with integrity, focusing on genuine
                collaboration and shared purpose.
              </p>
              <p>
                Empathy drives how I build relationships and foster
                collaboration. I listen deeply, value diverse viewpoints, and
                aim to create meaningful change. Guided by continuous growth -
                personal, professional, and collective - I&apos;m motivated to
                make a difference wherever insight meets action.
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
                Whether I&apos;m leading a project, supporting a team, or
                exploring new ideas, I bring together curiosity, reliability,
                and a genuine desire to make a difference. I&apos;m at my best
                where insight meets action, and where growth is both the journey
                and the goal.
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
      </div>
    </div>
  );
};

export default AboutMeModal;
