import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronRight,
  faFileLines,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { aboutMePills, profileHighlights } from "@/data/aboutMePills";
import { AppView } from "@/components/features/shell";
import styles from "./AboutAppView.module.css";

interface AboutAppViewProps {
  onClose: () => void;
  onOpenDocumentary?: () => void;
}

// "I build ___": words come from the shipped-project domains (Pinpoint,
// Payback, RentHarbor, Feng Shui, The Yap App), not generic category nouns.
const BUILD_WORDS = [
  "Realtime Apps",
  "Civic Platforms",
  "Privacy Systems",
  "AI Pipelines",
  "3D Experiences",
  "Voice Interfaces",
  "Secure APIs",
  "Mobile Apps",
  "Design Systems",
];
const BUILD_WORD_MS = 2400;

const RESUME_URL = "/resume/Demaceo_Vincent_Howard_Resume.pdf";
const SXSW_URL = "https://schedule.sxswedu.com/2025/events/PP156313";
const PBS_THUMB =
  "https://image.pbs.org/video-assets/5Q3iQAC-asset-mezzanine-16x9-luFIYQ7.jpg?crop=1440x810&format=auto";

const chapters = [
  { id: "profile", label: "Profile" },
  { id: "strengths", label: "Strengths" },
  { id: "featured", label: "Featured" },
] as const;

type ChapterId = (typeof chapters)[number]["id"];

const pad2 = (n: number) => String(n).padStart(2, "0");

const chapterVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28 }),
};

/** Big accent counter + eyebrow + title shared by every chapter. */
const ChapterHead: React.FC<{
  index: number;
  eyebrow: string;
  title: React.ReactNode;
  titleId: string;
  /** Counter beside the title instead of above it, for content-heavy chapters. */
  compact?: boolean;
}> = ({ index, eyebrow, title, titleId, compact = false }) => (
  <header className={`${styles.head} ${compact ? styles.headCompact : ""}`}>
    <span className={styles.counter} aria-hidden="true">
      <span className={styles.counterCurrent}>{pad2(index + 1)}</span>
      <span className={styles.counterTotal}> / {pad2(chapters.length)}</span>
    </span>
    <div className={styles.headText}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
    </div>
  </header>
);

/** "I build ___" with the noun cycling. Static under reduced motion. */
const BuildLine: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % BUILD_WORDS.length), BUILD_WORD_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <p className={styles.build}>
      <span>I build</span>{" "}
      <span className={styles.buildWordSlot} aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={BUILD_WORDS[i]}
            className={styles.buildWord}
            initial={{ opacity: 0, y: "0.5em" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-0.5em" }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {BUILD_WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className={styles.srOnly}>{BUILD_WORDS.join(", ")}</span>
    </p>
  );
};

/**
 * About as three Services-style plates (Profile, Strengths, Featured): a big
 * accent counter and uppercase title on every chapter, art on the right where
 * a chapter has some, and one bottom bar with prev/next and labeled tabs.
 * ←/→ anywhere inside move between chapters.
 */
const AboutAppView: React.FC<AboutAppViewProps> = ({ onClose, onOpenDocumentary }) => {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduceMotion = useReducedMotion() ?? false;

  const chapter: ChapterId = chapters[chapterIndex].id;
  const titleId = `about-${chapter}-title`;

  const goToChapter = (index: number) => {
    if (index === chapterIndex || index < 0 || index >= chapters.length) return;
    setDirection(index > chapterIndex ? 1 : -1);
    setChapterIndex(index);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowRight") goToChapter(chapterIndex + 1);
    else if (e.key === "ArrowLeft") goToChapter(chapterIndex - 1);
  };

  const renderProfile = () => (
    <div className={styles.profile}>
      <div className={styles.copy}>
        <ChapterHead
          index={0}
          eyebrow="Profile"
          titleId={titleId}
          title={<>Hello, I&apos;m Demaceo Vincent</>}
        />
        <BuildLine reduceMotion={reduceMotion} />
        <p className={styles.lede}>
          Full-stack engineer who ships solo, fast, and end-to-end, from civic platforms to
          privacy-first AI tools.
        </p>
        <dl className={styles.facts}>
          {profileHighlights.map((item) => (
            <div key={item.label} className={styles.fact}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <figure className={styles.portrait}>
        <div className={styles.portraitFrame}>
          <Image
            src="/images/headshot.jpg"
            alt="Demaceo Vincent Howard, smiling, in a rust-colored cap and black tee"
            fill
            sizes="(max-width: 768px) 50vw, 420px"
            className={styles.portraitImg}
          />
        </div>
        <figcaption className={styles.portraitCaption}>
          <span className={styles.dot} aria-hidden="true" />
          PBS documentary · SXSW EDU 2025 panelist
        </figcaption>
      </figure>
    </div>
  );

  const renderStrengths = () => (
    <div className={styles.stack}>
      <div className={styles.headRow}>
        <ChapterHead index={1} eyebrow="What I bring" titleId={titleId} title="Core strengths" compact />
        <p className={styles.lede}>
          Seven habits that show up in every build, each backed by something shipped.
        </p>
      </div>

      <ul className={styles.strengthGrid}>
        {aboutMePills.map((pill, i) => (
          <li key={pill.label} className={styles.strength}>
            <h3 className={styles.strengthTitle}>
              <span className={styles.strengthNum} aria-hidden="true">
                {pad2(i + 1)}
              </span>
              {pill.label}
            </h3>
            <p className={styles.strengthBody}>{pill.tooltip}</p>
            {pill.link && (
              <a
                href={pill.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inlineLink}
              >
                {pill.linkLabel ?? "Open link"}
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
              </a>
            )}
          </li>
        ))}
        <li className={`${styles.strength} ${styles.strengthCta}`}>
          <h3 className={styles.strengthTitle}>
            <FontAwesomeIcon icon={faFileLines} className={styles.strengthNum} aria-hidden="true" />
            Want the full picture?
          </h3>
          <p className={styles.strengthBody}>
            Roles, dates, and every shipped project, on one page.
          </p>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
            Open résumé
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
          </a>
        </li>
      </ul>
    </div>
  );

  const renderFeatured = () => (
    <div className={styles.stack}>
      <div className={styles.headRow}>
        <ChapterHead index={2} eyebrow="In the press" titleId={titleId} title="Featured work" compact />
        <p className={styles.lede}>Selected appearances and speaking engagements.</p>
      </div>

      <div className={styles.featureGrid}>
        <article className={styles.feature}>
          <button
            type="button"
            className={styles.featureMedia}
            onClick={() => onOpenDocumentary?.()}
            aria-label="Play Tech For Us: Breaking Barriers"
          >
            <Image
              src={PBS_THUMB}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className={styles.featureImg}
            />
            <span className={styles.play} aria-hidden="true">
              <FontAwesomeIcon icon={faPlay} />
            </span>
          </button>
          <div className={styles.featureInfo}>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgePbs}`}>PBS</span>
              <span className={styles.badge}>Documentary</span>
            </div>
            <h3 className={styles.featureTitle}>Tech For Us: Breaking Barriers</h3>
            <p className={styles.featureDesc}>
              A Roadtrip Nation documentary on technology, innovation, and careers in public
              interest tech.
            </p>
            <button type="button" className={styles.cta} onClick={() => onOpenDocumentary?.()}>
              <FontAwesomeIcon icon={faPlay} aria-hidden="true" />
              Watch documentary
            </button>
          </div>
        </article>

        <article className={styles.feature}>
          <div className={styles.featureMedia}>
            <Image
              src="/scrapbook/sxsw_panel02.jpg"
              alt="The SXSW EDU 2025 panel on stage under the conference banner"
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className={`${styles.featureImg} ${styles.featureImgSxsw}`}
            />
          </div>
          <div className={styles.featureInfo}>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgeSxsw}`}>SXSW EDU</span>
              <span className={styles.badge}>2025 panel</span>
            </div>
            <h3 className={styles.featureTitle}>Behind the Wheel: Youth Driving Tech &amp; Media</h3>
            <p className={styles.featureDesc}>
              Panelist in Austin, TX, on how young people are shaping the future of technology
              and media.
            </p>
            <a href={SXSW_URL} target="_blank" rel="noopener noreferrer" className={styles.cta}>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
              View session
            </a>
          </div>
        </article>
      </div>
    </div>
  );

  return (
    <AppView onClose={onClose} title="About" titleId="about-title">
      <div className={styles.about} onKeyDown={onKeyDown}>
        <div className={styles.stage}>
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.section
              key={chapter}
              custom={direction}
              variants={chapterVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={
                reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
              }
              className={styles.chapter}
              aria-labelledby={titleId}
            >
              {chapter === "profile" && renderProfile()}
              {chapter === "strengths" && renderStrengths()}
              {chapter === "featured" && renderFeatured()}
            </motion.section>
          </AnimatePresence>
        </div>

        <nav className={styles.bar} aria-label="About chapters">
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goToChapter(chapterIndex - 1)}
            disabled={chapterIndex === 0}
            aria-label="Previous chapter"
          >
            <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
          </button>

          <div className={styles.tabs}>
            {chapters.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={`${styles.tab} ${i === chapterIndex ? styles.tabActive : ""}`}
                onClick={() => goToChapter(i)}
                aria-current={i === chapterIndex ? "true" : undefined}
              >
                <span className={styles.tabNum} aria-hidden="true">
                  {pad2(i + 1)}
                </span>
                {c.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.arrow}
            onClick={() => goToChapter(chapterIndex + 1)}
            disabled={chapterIndex === chapters.length - 1}
            aria-label="Next chapter"
          >
            <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
          </button>
        </nav>
      </div>
    </AppView>
  );
};

export default AboutAppView;
