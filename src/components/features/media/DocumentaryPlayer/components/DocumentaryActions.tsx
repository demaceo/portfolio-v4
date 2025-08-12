"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faHeart } from "@fortawesome/free-solid-svg-icons";

interface DocumentaryActionsProps {
  externalUrl: string;
  onExternalLink: (url: string) => void;
  onDonate: () => void;
}

const DocumentaryActions: React.FC<DocumentaryActionsProps> = ({
  externalUrl,
  onExternalLink,
  onDonate,
}) => {
  return (
    <div className="documentary-actions">
      <button
        className="action-button secondary"
        onClick={() => onExternalLink(externalUrl)}
        aria-label="Open documentary on PBS website"
      >
        <FontAwesomeIcon icon={faExternalLinkAlt} />
        View on PBS
      </button>
      <div className="donate-message">
        Defunded but not defeated. Help keep your local PBS station strong.
      </div>
      <button
        className="action-button donate"
        onClick={onDonate}
        aria-label="Donate to PBS"
        title="Defunded but not defeated. Help keep your local PBS station strong."
      >
        <FontAwesomeIcon icon={faHeart} />
        Donate to PBS
      </button>
    </div>
  );
};

export default DocumentaryActions;
