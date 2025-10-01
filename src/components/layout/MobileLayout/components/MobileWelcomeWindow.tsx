"use client";

import React, { useState } from "react";

interface MobileWelcomeWindowProps {
  showWelcomeWindow: boolean;
  handleWelcomeWindowClose: () => void;
}

const MobileWelcomeWindow: React.FC<MobileWelcomeWindowProps> = ({
  showWelcomeWindow,
  handleWelcomeWindowClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!showWelcomeWindow) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      handleWelcomeWindowClose();
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  return (
    <div className={`mobile-welcome-window ${isClosing ? "closing" : ""}`}>
      <div className="mobile-window-title-bar">
        <div className="mobile-window-controls">
          <button
            className="mobile-close-btn"
            onClick={handleClose}
            aria-label="Close welcome window"
          >
            <span className="close-x"></span>
          </button>
        </div>
        <span className="mobile-window-title">Demaceo&apos;s Portfolio</span>
        <div className="window-actions"></div>
      </div>
      <div className="mobile-window-content">
        <div className="welcome-message">
          <h3>Hello there!</h3>
          <p>Explore my work & get in touch.</p>
          <div className="welcome-actions">
            <button className="welcome-btn primary" onClick={handleClose}>
              Let&apos;s Go
            </button>
          </div>
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
