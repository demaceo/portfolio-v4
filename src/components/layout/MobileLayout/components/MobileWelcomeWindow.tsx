"use client";

import React from "react";

interface MobileWelcomeWindowProps {
  showWelcomeWindow: boolean;
  handleWelcomeWindowClose: () => void;
}

const MobileWelcomeWindow: React.FC<MobileWelcomeWindowProps> = ({
  showWelcomeWindow,
  handleWelcomeWindowClose,
}) => {
  if (!showWelcomeWindow) return null;

  return (
    <div className="mobile-welcome-window">
      <div className="mobile-window-title-bar">
        <div className="mobile-window-controls">
          <button
            className="mobile-close-btn"
            onClick={handleWelcomeWindowClose}
            aria-label="Close welcome window"
          ></button>
        </div>
        <span className="mobile-window-title">Welcome</span>
      </div>
      <div className="mobile-window-content">
        <p>Explore my work & get in touch.</p>
      </div>
    </div>
  );
};

export default MobileWelcomeWindow;
