"use client";

import React from "react";

interface MobileWelcomeWindowProps {
  showWelcomeWindow: boolean;
}

const MobileWelcomeWindow: React.FC<MobileWelcomeWindowProps> = ({
  showWelcomeWindow,
}) => {

  if (!showWelcomeWindow) return null;


  return (
    <div className={`mobile-welcome-window`}>
      <div className="mobile-window-title-bar">
        <div className="mobile-window-controls">
        </div>
        <span className="mobile-window-title">Welcome to My Portfolio</span>
        <div className="window-actions"></div>
      </div>
      <div className="mobile-window-content">
        <div className="welcome-message">
          <h3>Hello, I&apos;m Demaceo Vincent</h3>
          <p>
            Click around to explore my work, learn about me, what services I
            offer, and how to best reach out.
          </p>
        </div>
        <div className="welcome-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileWelcomeWindow;
