import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
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

type Chapter =
  | { id: string; label: string; kind: "profile" }
  | { id: string; label: string; kind: "list"; sectionIndex: number }
  | { id: string; label: string; kind: "strengths" };

const chapters: Chapter[] = [
  { id: "profile", label: "Profile", kind: "profile" },
  { id: "think", label: "How I Think", kind: "list", sectionIndex: 0 },
  { id: "work", label: "How I Work", kind: "list", sectionIndex: 1 },
  { id: "collaborate", label: "How I Collaborate", kind: "list", sectionIndex: 2 },
  { id: "strengths", label: "Strengths", kind: "strengths" },
];

const chapterVariants = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 22 : -22 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -22 : 22 }),
};

const AboutMeModal: React.FC<AboutMeModalProps> = ({ onClose }) => {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const chapter = chapters[chapterIndex];

  const pillsByLabel = useMemo(() => {
    return aboutMePills.reduce<Record<string, AboutMePill>>((acc, pill) => {
      acc[pill.label] = pill;
      return acc;
    }, {});
  }, []);

  const goToChapter = (index: number) => {
    if (index === chapterIndex) return;
    setDirection(index > chapterIndex ? 1 : -1);
    setChapterIndex(index);
    setActiveTooltip(null);
  };

  const navigate = (dir: 1 | -1) => {
    const next = chapterIndex + dir;
    if (next < 0 || next > chapters.length - 1) return;
    goToChapter(next);
  };

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

  const renderChapter = () => {
    if (chapter.kind === "profile") {
      return (
        <>
          <p className="about-eyebrow">Profile</p>
          <h2 className="about-chapter-title">Hello, I&apos;m Demaceo Vincent</h2>
          <p className="about-lede">
            Software Engineer, Designer, and systems-minded problem solver.
          </p>
          <div className="about-highlight-grid">
            {profileHighlights.map((item) => (
              <article key={item.label} className="about-highlight-card">
                <h3>{item.label}</h3>
                <p>{item.value}</p>
              </article>
            ))}
          </div>
        </>
      );
    }

    if (chapter.kind === "list") {
      const section = collaborationSections[chapter.sectionIndex];
      return (
        <>
          <p className="about-eyebrow">Working Style</p>
          <h2 className="about-chapter-title">{section.title}</h2>
          <ul className="about-points">
            {section.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </>
      );
    }

    // strengths
    return (
      <>
        <p className="about-eyebrow">What I Bring</p>
        <h2 className="about-chapter-title">Core Strengths</h2>
        <p className="about-lede">
          Select a strength for detail. Click again to open external links.
        </p>

        <div className="about-pills">
          {aboutMePills.map((pill) => {
            const isActive = activeTooltip === pill.label;
            return (
              <button
                key={pill.label}
                type="button"
                className={`about-pill ${pill.link ? "clickable" : ""} ${
                  isActive ? "active" : ""
                }`}
                onClick={() => handlePillClick(pill)}
                aria-expanded={isActive}
                aria-controls="about-strength-detail"
              >
                <span>{pill.label}</span>
                {pill.link && (
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="about-pill-link-icon"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTooltip && pillsByLabel[activeTooltip] && (
            <motion.div
              key={activeTooltip}
              id="about-strength-detail"
              className="about-strength-detail"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="about-strength-detail-title">{activeTooltip}</p>
              <p className="about-strength-detail-copy">
                {pillsByLabel[activeTooltip]?.tooltip}
                {pillsByLabel[activeTooltip]?.link && (
                  <span className="about-link-hint"> Click again to open.</span>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <ModalFrame
      onClose={onClose}
      title="About"
      size="lg"
      variant="light"
      titleId="about-title"
      closeAriaLabel="Close about modal"
    >
      <div className="about-dossier">
        {/* ── Chapter rail (table of contents) ─────────── */}
        <nav className="about-rail" aria-label="About chapters">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={`about-rail-item ${i === chapterIndex ? "active" : ""}`}
              onClick={() => goToChapter(i)}
              aria-current={i === chapterIndex ? "true" : undefined}
            >
              <span className="about-rail-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="about-rail-label">{c.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Stage ────────────────────────────────────── */}
        <div className="about-stage-wrap">
          <div className="about-stage" aria-live="polite">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.section
                key={chapter.id}
                custom={direction}
                variants={chapterVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="about-chapter"
                aria-labelledby="about-title"
              >
                {renderChapter()}
              </motion.section>
            </AnimatePresence>
          </div>

          {/* ── Progress footer ────────────────────────── */}
          <div className="about-progress">
            <button
              type="button"
              className="about-prog-arrow"
              onClick={() => navigate(-1)}
              disabled={chapterIndex === 0}
              aria-label="Previous chapter"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <span className="about-prog-counter" aria-hidden="true">
              <span className="about-prog-current">
                {String(chapterIndex + 1).padStart(2, "0")}
              </span>
              <span className="about-prog-sep"> / </span>
              <span className="about-prog-total">
                {String(chapters.length).padStart(2, "0")}
              </span>
            </span>

            <button
              type="button"
              className="about-prog-arrow"
              onClick={() => navigate(1)}
              disabled={chapterIndex === chapters.length - 1}
              aria-label="Next chapter"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
};

export default AboutMeModal;
