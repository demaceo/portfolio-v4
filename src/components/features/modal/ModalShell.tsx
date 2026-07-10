"use client";

import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ModalShellProps } from "@/lib/types";
import { pushOverlay, popOverlay, isTopmostOverlay, lockBodyScroll, unlockBodyScroll } from "@/lib/utils/overlayStack";
import { trapTabKey } from "@/lib/utils/focusTrap";

const ModalShell: React.FC<ModalShellProps> = ({
  onClose,
  children,
  titleId,
  overlayClassName,
  dialogClassName,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const instanceId = useRef(Symbol("modal")).current;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    pushOverlay(instanceId);
    lockBodyScroll();
    // Return focus here (the trigger) when this overlay closes, so keyboard
    // users don't get dropped to <body>.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopmostOverlay(instanceId)) return;
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Tab" && dialogRef.current) {
        trapTabKey(event, dialogRef.current);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      popOverlay(instanceId);
      document.removeEventListener("keydown", handleKeyDown);
      unlockBodyScroll();
      previouslyFocused?.focus?.();
    };
  }, [onClose, instanceId]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && isTopmostOverlay(instanceId)) {
      onClose();
    }
  };

  // Symmetric enter/exit so closing fades out instead of popping. A spring on
  // enter gives a fluid settle; exit uses a quick tween so dismissal feels
  // immediate. Reduced-motion users get a plain cross-fade.
  const overlayVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.16, ease: "easeIn" } },
  };

  const dialogVariants: Variants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.12 } },
      }
    : {
        initial: { opacity: 0, y: 18, scale: 0.98 },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.9 },
        },
        exit: {
          opacity: 0,
          y: 12,
          scale: 0.985,
          transition: { duration: 0.16, ease: "easeIn" },
        },
      };

  return (
    <motion.div
      className={overlayClassName}
      onClick={handleOverlayClick}
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        ref={dialogRef}
        className={dialogClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={titleId ? undefined : "Modal dialog"}
        tabIndex={-1}
        variants={dialogVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ModalShell;
