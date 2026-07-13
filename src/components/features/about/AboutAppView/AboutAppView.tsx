import React, { useCallback, useMemo, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faArrowUpRightFromSquare, faPlay, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { aboutMePills } from "@/data/aboutMePills";
import { AboutMePill } from "@/lib/types";
import { AppView } from "@/components/features/shell";
import styles from "./AboutAppView.module.css";

interface AboutAppViewProps {
  onClose: () => void;
  onOpenDocumentary?: () => void;
}

// "I build ___" hero — see codepenz's scroll-timeline-word-highlight for the
// underlying CSS mechanism (animation-timeline: view()). Words are pulled
// from the actual shipped-project domains (Pinpoint, Payback, RentHarbor,
// Feng Shui, Yap United), not generic category nouns.
const ABOUT_HERO_WORDS = [
  "Civic Platforms",
  "Privacy Systems",
  "AI Pipelines",
  "3D Experiences",
  "Voice Interfaces",
  "Realtime Apps",
  "Secure APIs",
  "Mobile Apps",
  "Design Systems",
  "Automations",
  "Products",
];
const ABOUT_HERO_START_INDEX = 5;

const profileHighlights = [
  {
    label: "Shipped Track Record",
    value: "5 production apps, solo — civic tech, privacy AI, PropTech, spatial AI, real-time voice — in 12 months.",
  },
  {
    label: "Signature Engineering Move",
    value: "Verified Firebase tokens via Google's JWKS directly — no Admin SDK, no exposed service account.",
  },
  {
    label: "Full-Stack Ownership",
    value: "Architecture, security, compliance docs, and 3D graphics — end to end, not handed off.",
  },
  {
    label: "Public Recognition",
    value: "Featured in a PBS documentary on public interest tech; SXSW EDU 2025 panelist.",
  },
];

const collaborationSections = [
  {
    title: "How I Think",
    points: [
      "I look for the constraint that actually breaks first — a rate limit, a token budget, a background task getting killed — before I reach for a clever solution.",
      "I treat security and compliance as design inputs, not cleanup: an on-device AES-256-GCM vault and JWKS-based auth were both scoped in from day one, not bolted on after an incident.",
      "I'd rather ship the smaller, correct architecture than the impressive one.",
    ],
  },
  {
    title: "How I Work",
    points: [
      "I've been the sole engineer, designer, and product owner on 5 shipped apps at once — I close the loop myself instead of waiting on a hand-off.",
      "I write the deployment runbook and the compliance doc in the same sprint as the feature, not after someone asks where they are.",
      "I default to typed, tested, CI-gated code — strict TypeScript, GitHub Actions, pre-commit hooks — so \"it works on my machine\" isn't a phase I pass through.",
    ],
  },
  {
    title: "How I Collaborate",
    points: [
      "I hand off systems other engineers can extend without a walkthrough — documented APIs, Postman collections, and architecture diagrams included.",
      "I mentor deliberately: years of 1:1 code reviews and mock interviews for bootcamp grads, not just filling in when a team needed an extra reviewer.",
      "I say the risk out loud early, then bring options — not just a problem — because a team that trusts the flag will trust the fix.",
    ],
  },
];

type Chapter =
  | { id: string; label: string; kind: "profile" }
  | { id: string; label: string; kind: "list"; sectionIndex: number }
  | { id: string; label: string; kind: "strengths" }
  | { id: string; label: string; kind: "featured" };

const chapters: Chapter[] = [
  { id: "profile", label: "Profile", kind: "profile" },
  { id: "think", label: "How I Think", kind: "list", sectionIndex: 0 },
  { id: "work", label: "How I Work", kind: "list", sectionIndex: 1 },
  { id: "collaborate", label: "How I Collaborate", kind: "list", sectionIndex: 2 },
  { id: "strengths", label: "Strengths", kind: "strengths" },
  { id: "featured", label: "Featured", kind: "featured" },
];

const chapterVariants = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 22 : -22 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -22 : 22 }),
};

const AboutAppView: React.FC<AboutAppViewProps> = ({ onClose, onOpenDocumentary }) => {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const chapter = chapters[chapterIndex];

  const pillsByLabel = useMemo(() => {
    return aboutMePills.reduce<Record<string, AboutMePill>>((acc, pill) => {
      acc[pill.label] = pill;
      return acc;
    }, {});
  }, []);

  // Center the "start" word within the hero list itself (not the page) each
  // time the list mounts — including when the Profile chapter is revisited.
  // A callback ref (not a mount-only effect) is used because AnimatePresence
  // unmounts and remounts the chapter, so the old `[]`-deps effect never re-ran.
  const centerHeroList = useCallback((node: HTMLUListElement | null) => {
    if (!node) return;
    const target = node.querySelector<HTMLLIElement>(
      `[data-index="${ABOUT_HERO_START_INDEX}"]`
    );
    if (!target) return;
    node.scrollTop = target.offsetTop - (node.clientHeight - target.clientHeight) / 2;
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

  const renderFeaturedChapter = () => (
    <>
      <p className={styles.aboutEyebrow}>In The Press</p>
      <h2 className={styles.aboutChapterTitle}>Featured Work</h2>
      <p className={styles.aboutLede}>
        Selected appearances and speaking engagements.
      </p>

      <div className={styles.aboutFeaturedCards}>
        {/* Tech For Us — PBS Documentary */}
        <div className={styles.aboutFeaturedCard}>
          <div className={styles.aboutFeaturedThumbnail}>
            <Image
              src="https://image.pbs.org/video-assets/5Q3iQAC-asset-mezzanine-16x9-luFIYQ7.jpg?crop=1440x810&format=auto"
              alt="Tech For Us — Breaking Barriers on PBS"
              width={480}
              height={270}
              className={styles.aboutFeaturedThumbImg}
            />
            <button
              type="button"
              className={styles.aboutFeaturedThumbOverlay}
              onClick={() => onOpenDocumentary?.()}
              aria-label="Play Tech For Us — Breaking Barriers documentary"
            >
              <FontAwesomeIcon icon={faPlay} className={styles.aboutFeaturedPlayIcon} />
            </button>
          </div>
          <div className={styles.aboutFeaturedInfo}>
            <div className={styles.aboutFeaturedBadges}>
              <span className={`${styles.aboutFeaturedBadge} ${styles.aboutFeaturedBadgePbs}`}>PBS</span>
              <span className={styles.aboutFeaturedBadge}>Documentary</span>
            </div>
            <h3 className={styles.aboutFeaturedTitle}>Tech For Us — Breaking Barriers</h3>
            <p className={styles.aboutFeaturedDesc}>
              Featured in a Roadtrip Nation documentary exploring technology, innovation, and career development through public interest technology stories.
            </p>
            <button
              type="button"
              className={styles.aboutFeaturedCta}
              onClick={() => onOpenDocumentary?.()}
            >
              <FontAwesomeIcon icon={faPlay} />
              Watch Documentary
            </button>
          </div>
        </div>

        {/* SXSW EDU 2025 Panel */}
        <div className={styles.aboutFeaturedCard}>
          <div className={`${styles.aboutFeaturedInfo} ${styles.aboutFeaturedInfoFull}`}>
            <div className={styles.aboutFeaturedBadges}>
              <span className={`${styles.aboutFeaturedBadge} ${styles.aboutFeaturedBadgeSxsw}`}>SXSW EDU</span>
              <span className={styles.aboutFeaturedBadge}>2025 Panel</span>
            </div>
            <h3 className={styles.aboutFeaturedTitle}>Behind the Wheel: Youth Driving Tech &amp; Media</h3>
            <p className={styles.aboutFeaturedDesc}>
              Panelist at SXSW EDU 2025 in Austin, TX — discussing how young people are shaping the future of technology and media.
            </p>
            <a
              href="https://schedule.sxswedu.com/2025/events/PP156313"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutFeaturedCta}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} />
              View Session
            </a>
          </div>
        </div>
      </div>
    </>
  );

  const renderChapter = () => {
    if (chapter.kind === "featured") {
      return renderFeaturedChapter();
    }

    if (chapter.kind === "profile") {
      return (
        <>
          <div className={styles.aboutHero}>
            <div className={styles.aboutHeroPhrase}>I build</div>
            <ul className={styles.aboutHeroScroll} ref={centerHeroList}>
              <li className={styles.aboutHeroPad} aria-hidden="true" />
              {ABOUT_HERO_WORDS.map((word, i) => (
                <li
                  key={word}
                  data-index={i}
                  className={styles.aboutHeroWord}
                  style={{ "--i": i } as CSSProperties}
                >
                  {word}
                </li>
              ))}
              <li className={styles.aboutHeroPad} aria-hidden="true" />
            </ul>
          </div>

          <p className={styles.aboutEyebrow}>Profile</p>
          <h2 className={styles.aboutChapterTitle}>Hello, I&apos;m Demaceo Vincent</h2>
          <p className={styles.aboutLede}>
            Full-stack engineer who ships solo, fast, and end-to-end — from civic
            platforms to privacy-first AI tools.
          </p>
          <div className={styles.aboutCredibilityStrip}>
            <span className={`${styles.aboutFeaturedBadge} ${styles.aboutFeaturedBadgePbs}`}>
              PBS Documentary
            </span>
            <span className={`${styles.aboutFeaturedBadge} ${styles.aboutFeaturedBadgeSxsw}`}>
              SXSW EDU 2025
            </span>
            <span className={styles.aboutCredibilityNote}>— see Featured chapter</span>
          </div>
          <div className={styles.aboutHighlightGrid}>
            {profileHighlights.map((item) => (
              <article key={item.label} className={styles.aboutHighlightCard}>
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
          <p className={styles.aboutEyebrow}>Working Style</p>
          <h2 className={styles.aboutChapterTitle}>{section.title}</h2>
          <ul className={styles.aboutPoints}>
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
        <p className={styles.aboutEyebrow}>What I Bring</p>
        <h2 className={styles.aboutChapterTitle}>Core Strengths</h2>
        <p className={styles.aboutLede}>
          Select a strength for detail. Click again to open external links.
        </p>

        <div className={styles.aboutPills}>
          {aboutMePills.map((pill) => {
            const isActive = activeTooltip === pill.label;
            return (
              <button
                key={pill.label}
                type="button"
                className={`${styles.aboutPill} ${pill.link ? styles.clickable : ""} ${
                  isActive ? styles.active : ""
                }`}
                onClick={() => handlePillClick(pill)}
                aria-expanded={isActive}
                aria-controls={isActive ? "about-strength-detail" : undefined}
              >
                <span>{pill.label}</span>
                {pill.link && (
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className={styles.aboutPillLinkIcon}
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
              className={styles.aboutStrengthDetail}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
            >
              <p className={styles.aboutStrengthDetailTitle}>{activeTooltip}</p>
              <p className={styles.aboutStrengthDetailCopy}>
                {pillsByLabel[activeTooltip]?.tooltip}
                {pillsByLabel[activeTooltip]?.link && (
                  <span className={styles.aboutLinkHint}> Click again to open.</span>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <AppView onClose={onClose} title="About" titleId="about-title">
      <div className={styles.aboutDossier}>
        {/* ── Chapter rail (table of contents) ─────────── */}
        <nav className={styles.aboutRail} aria-label="About chapters">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={`${styles.aboutRailItem} ${i === chapterIndex ? styles.active : ""}`}
              onClick={() => goToChapter(i)}
              aria-current={i === chapterIndex ? "true" : undefined}
            >
              <span className={styles.aboutRailNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.aboutRailLabel}>{c.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Stage ────────────────────────────────────── */}
        <div className={styles.aboutStageWrap}>
          <div className={styles.aboutStage}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.section
                key={chapter.id}
                custom={direction}
                variants={chapterVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={reduceMotion ? { duration: 0 } : { duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={styles.aboutChapter}
                aria-labelledby="about-title"
              >
                {renderChapter()}
              </motion.section>
            </AnimatePresence>
          </div>

          {/* ── Progress footer ────────────────────────── */}
          <div className={styles.aboutProgress}>
            <button
              type="button"
              className={styles.aboutProgArrow}
              onClick={() => navigate(-1)}
              disabled={chapterIndex === 0}
              aria-label="Previous chapter"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <span className={styles.aboutProgCounter} aria-hidden="true">
              <span className={styles.aboutProgCurrent}>
                {String(chapterIndex + 1).padStart(2, "0")}
              </span>
              <span className={styles.aboutProgSep}> / </span>
              <span className={styles.aboutProgTotal}>
                {String(chapters.length).padStart(2, "0")}
              </span>
            </span>

            <button
              type="button"
              className={styles.aboutProgArrow}
              onClick={() => navigate(1)}
              disabled={chapterIndex === chapters.length - 1}
              aria-label="Next chapter"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>
    </AppView>
  );
};

export default AboutAppView;
