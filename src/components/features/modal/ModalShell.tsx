"use client";

import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ModalShellProps } from "@/lib/types";

let bodyScrollLockCount = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";

const lockBodyScroll = () => {
  if (typeof document === "undefined") return;

  if (bodyScrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  bodyScrollLockCount += 1;
};

const unlockBodyScroll = () => {
  if (typeof document === "undefined") return;
  if (bodyScrollLockCount === 0) return;

  bodyScrollLockCount -= 1;

  if (bodyScrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPaddingRight;
  }
};

const ModalShell: React.FC<ModalShellProps> = ({
  onClose,
  children,
  titleId,
  overlayClassName,
  dialogClassName,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    lockBodyScroll();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      unlockBodyScroll();
    };
  }, [onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
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
