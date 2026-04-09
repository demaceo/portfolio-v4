"use client";

import React from "react";

interface MobileWelcomeWindowProps {
  showWelcomeWindow: boolean;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
}

const MobileWelcomeWindow: React.FC<MobileWelcomeWindowProps> = ({
  showWelcomeWindow,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  if (!showWelcomeWindow) return null;

  return (
    <section className="mobile-welcome-window">
      <div className="mobile-window-content">
        <div className="welcome-message">
          <h3>Demaceo Vincent</h3>
          <p>
            Product-minded engineer focused on polished interfaces, strong UX
            systems, and delivery-ready frontend architecture.
          </p>
          <div className="welcome-highlights">
            <span className="highlight-pill">Frontend Systems</span>
            <span className="highlight-pill">UI Engineering</span>
            <span className="highlight-pill">Product Delivery</span>
          </div>
          <div className="welcome-actions">
            <button className="welcome-btn primary" onClick={onPrimaryAction}>
              View Projects
            </button>
            <button
              className="welcome-btn secondary"
              onClick={onSecondaryAction}
            >
              Contact
            </button>
          </div>
        </div>
        <div className="welcome-decoration" aria-hidden="true">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>
    </section>
  );
};

export default MobileWelcomeWindow;
