"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

interface WelcomeWindowProps {
  onClose: () => void;
  handleAppClick: (path: string, isToggle?: boolean) => void;
  preload: {
    contact: () => void;
  };
}

/**
 * "animate" is the resting pose — top/left 50% + self-centering x/y: -50%,
 * matching the original static CSS. "initial" and "exit" both collapse
 * toward the taskbar's bottom-left corner, so mounting (restoring from the
 * Portfolio tab, or first page load) flies out of that corner and unmounting
 * (minimizing) shrinks back into it — true reverse of each other ("vice
 * versa"), not just a plain fade.
 */
const corner = { top: "100%", left: "0%", x: "-50%", y: "-50%", scale: 0.05, opacity: 0 };

const windowVariants: Variants = {
  initial: corner,
  animate: {
    top: "50%",
    left: "50%",
    x: "-50%",
    y: "-50%",
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 32, mass: 0.9 },
  },
  exit: { ...corner, transition: { duration: 0.32, ease: "easeIn" } },
};

const reducedWindowVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

const WelcomeWindow: React.FC<WelcomeWindowProps> = ({ onClose, handleAppClick, preload }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="welcome-window"
      variants={prefersReducedMotion ? reducedWindowVariants : windowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="window-title-bar">
        <div className="window-controls">
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close welcome window"
          >
            &times;
          </button>
        </div>
        <span className="window-title">Welcome to My Portfolio</span>
      </div>
      <div className="window-content">
        <h2>Hello, I&#39;m Demaceo Vincent</h2>
        <p>
          Click around to explore my work, learn about me, what services I
          offer, and how to best reach out.
        </p>
        <div className="quick-links">
          <button onClick={() => handleAppClick("/mindset")}>About Me</button>
          <button onClick={() => handleAppClick("/skillset")}>
            Service Spectrum
          </button>
          <button
            onMouseEnter={() => preload.contact()}
            onClick={() => handleAppClick("/contact")}
          >
            Contact
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeWindow;
