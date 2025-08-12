"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

interface MobileDockProps {
  handleAppClick: (path: string) => void;
  showContactNotification: boolean;
  linkedinUrl: string;
  calendlyUrl: string;
  onContactPreload: () => void;
}

const MobileDock: React.FC<MobileDockProps> = ({
  handleAppClick,
  showContactNotification,
  linkedinUrl,
  calendlyUrl,
  onContactPreload,
}) => {
  return (
    <div className="dock-mobile">
      <button
        className="dock-app"
        type="button"
        onClick={() => handleAppClick(linkedinUrl)}
        tabIndex={0}
        aria-label="LinkedIn"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleAppClick(linkedinUrl);
          }
        }}
      >
        <FontAwesomeIcon icon={faLinkedin} />
      </button>
      <button
        className="dock-app"
        type="button"
        onClick={() => handleAppClick(calendlyUrl)}
        tabIndex={0}
        aria-label="Schedule Meeting"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleAppClick(calendlyUrl);
          }
        }}
      >
        <FontAwesomeIcon icon={faCalendarDays} />
      </button>
      <button
        className="dock-app"
        type="button"
        onMouseEnter={onContactPreload}
        onTouchStart={onContactPreload}
        onClick={() => handleAppClick("/contact")}
        tabIndex={0}
        aria-label="Contact"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleAppClick("/contact");
          }
        }}
      >
        <FontAwesomeIcon icon={faEnvelope} />
        {showContactNotification && <div className="notification-badge">!</div>}
      </button>
    </div>
  );
};

export default MobileDock;
