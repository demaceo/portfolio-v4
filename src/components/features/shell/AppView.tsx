"use client";

import React, { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { AppViewProps } from "@/lib/types";
import { pushOverlay, popOverlay, isTopmostOverlay, lockBodyScroll, unlockBodyScroll } from "@/lib/utils/overlayStack";
import { trapTabKey } from "@/lib/utils/focusTrap";
import styles from "./AppView.module.css";

/**
 * Full-screen, non-modal replacement for ModalFrame — used by content areas
 * that have been "dissolved" out of the small floating-window presentation
 * (About Me first; Skillset/Projects follow later). Takes over the entire
 * `.mac-screen` bounds instead of floating a card over a blurred backdrop.
 *
 * Shares the same overlayStack as ModalShell so a real modal opened from
 * within an AppView (e.g. DocumentaryPlayer from About's Featured chapter)
 * still stacks correctly — Escape closes only the topmost of the two.
 */
const AppView: React.FC<AppViewProps> = ({ onClose, title, headerActions, titleId, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceId = useRef(Symbol("app-view")).current;
  const prefersReducedMotion = useReducedMotion();
  const generatedId = useId().replace(/:/g, "");
  const resolvedTitleId = titleId ?? `app-view-title-${generatedId}`;

  useEffect(() => {
    pushOverlay(instanceId);
    lockBodyScroll();
    // Return focus to the trigger (desktop icon / app switcher) on close.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopmostOverlay(instanceId)) return;
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Tab" && containerRef.current) {
        trapTabKey(event, containerRef.current);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    containerRef.current?.focus();

    return () => {
      popOverlay(instanceId);
      document.removeEventListener("keydown", handleKeyDown);
      unlockBodyScroll();
      previouslyFocused?.focus?.();
    };
  }, [onClose, instanceId]);

  const variants: Variants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.12 } },
      }
    : {
        // Opacity-only (no translate): a transform on this container offsets
        // ScrollTrigger's pin measurement inside the Scrapbook AppView, which
        // surfaced as the flow map "scrolling to an empty view" until a
        // corrective refresh fired. Fading avoids needing that refresh at all.
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.28, ease: "easeOut" } },
        exit: { opacity: 0, transition: { duration: 0.16, ease: "easeIn" } },
      };

  return (
    <motion.div
      ref={containerRef}
      className={styles.appView}
      role="region"
      aria-labelledby={resolvedTitleId}
      tabIndex={-1}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: "opacity" }}
    >
      <div className={styles.titleBar}>
        <div className={styles.headerControls}>
          <button
            type="button"
            className={styles.backButton}
            onClick={onClose}
            aria-label="Back to desktop"
          >
            <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
          </button>
        </div>

        <h1 id={resolvedTitleId} className={styles.titleText}>
          {title}
        </h1>

        <div className={styles.headerActions}>
          {headerActions ?? <div className={styles.headerSpacer} aria-hidden="true" />}
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </motion.div>
  );
};

export default AppView;
