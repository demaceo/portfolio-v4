import React, { useCallback, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faArrowUpRightFromSquare, faPlay, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { aboutMePills } from "@/data/aboutMePills";
import { AppView } from "@/components/features/shell";
import styles from "./AboutAppView.module.css";

interface AboutAppViewProps {
  onClose: () => void;
  onOpenDocumentary?: () => void;
}

// "I build ___" hero — see codepenz's scroll-timeline-word-highlight for the
// underlying CSS mechanism (animation-timeline: view()). Words are pulled
// from the actual shipped-project domains (Pinpoint, Payback, RentHarbor,
// Feng Shui, The Yap App), not generic category nouns.
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
    label: "Shipped",
    value: "Five production apps in twelve months, solo — civic tech, privacy AI, PropTech, spatial AI, and real-time voice.",
  },
  {
    label: "Built",
    value: "Firebase tokens verified straight against Google's JWKS — no Admin SDK, no service account sitting on a server to leak.",
  },
  {
    label: "Owned",
    value: "Architecture, security, compliance docs, 3D graphics. Nothing handed off because it wasn't my job.",
  },
  {
    label: "On Record",
    value: "A PBS documentary on public interest tech, and a panel at SXSW EDU 2025.",
  },
];

type Chapter =
  | { id: string; label: string; kind: "profile" }
  | { id: string; label: string; kind: "strengths" }
  | { id: string; label: string; kind: "featured" };

const chapters: Chapter[] = [
  { id: "profile", label: "Profile", kind: "profile" },
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
  const [openStrength, setOpenStrength] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const chapter = chapters[chapterIndex];

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
    setOpenStrength(null);
  };

  const navigate = (dir: 1 | -1) => {
    const next = chapterIndex + dir;
    if (next < 0 || next > chapters.length - 1) return;
    goToChapter(next);
  };

  const toggleStrength = (label: string) => {
    setOpenStrength((current) => (current === label ? null : label));
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
          <p className={styles.aboutCredit}>
            PBS Documentary
            <span className={styles.aboutCreditSep} aria-hidden="true">
              ·
            </span>
            SXSW EDU 2025 Panel
          </p>
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

    // strengths
    return (
      <>
        <p className={styles.aboutEyebrow}>What I Bring</p>
        <h2 className={styles.aboutChapterTitle}>Core Strengths</h2>
        <p className={styles.aboutLede}>Open a line for the detail behind it.</p>

        <ul className={styles.aboutIndex}>
          {aboutMePills.map((pill, i) => {
            const isOpen = openStrength === pill.label;
            const bodyId = `about-strength-${i}`;
            return (
              <li key={pill.label} className={styles.aboutIndexRow}>
                <button
                  type="button"
                  className={styles.aboutIndexTrigger}
                  onClick={() => toggleStrength(pill.label)}
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                >
                  <span className={styles.aboutIndexNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.aboutIndexLabel}>{pill.label}</span>
                  <span className={styles.aboutIndexToggle} aria-hidden="true" />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={bodyId}
                      className={styles.aboutIndexBody}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }
                      }
                    >
                      <div className={styles.aboutIndexBodyInner}>
                        <p className={styles.aboutIndexCopy}>{pill.tooltip}</p>
                        {pill.link && (
                          <a
                            href={pill.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.aboutIndexLink}
                          >
                            {pill.linkLabel ?? "Open link"}
                            <FontAwesomeIcon
                              icon={faArrowUpRightFromSquare}
                              aria-hidden="true"
                            />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
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
                className={`${styles.aboutChapter} ${
                  chapter.kind === "profile" ? styles.aboutChapterCentered : ""
                }`}
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
