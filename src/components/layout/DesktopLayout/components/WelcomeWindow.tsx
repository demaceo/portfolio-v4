"use client";

import React from "react";

interface WelcomeWindowProps {
  showWelcomeWindow: boolean;
  handleWelcomeWindowClose: () => void;
  handleAppClick: (path: string, isToggle?: boolean) => void;
  preload: {
    contact: () => void;
  };
}

const WelcomeWindow: React.FC<WelcomeWindowProps> = ({
  showWelcomeWindow,
  handleWelcomeWindowClose,
  handleAppClick,
  preload,
}) => {
  if (!showWelcomeWindow) return null;

  return (
    <div className="welcome-window">
      <div className="window-title-bar">
        <div className="window-controls">
          {/* <button
            className="close-btn"
            onClick={handleWelcomeWindowClose}
            aria-label="Close welcome window"
          ></button> */}
        </div>
        <span className="window-title">Welcome to My Portfolio</span>
      </div>
      <div className="window-content">
        <h2>Hello, I&#39;m Demaceo Vincent</h2>
        <p>
          Click around to explore my work, learn about me, what services I
          offer, and how to best reach out!
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
    </div>
  );
};

export default WelcomeWindow;
