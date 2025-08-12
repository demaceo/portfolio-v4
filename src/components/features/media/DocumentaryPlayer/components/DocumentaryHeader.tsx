"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilm,
  faInfoCircle,
  faList,
} from "@fortawesome/free-solid-svg-icons";

interface DocumentaryHeaderProps {
  onClose: () => void;
  onToggleInfo: (e: React.MouseEvent) => void;
  onToggleEpisodeList: (e: React.MouseEvent) => void;
  showInfoDropdown: boolean;
  showEpisodeList: boolean;
}

const DocumentaryHeader: React.FC<DocumentaryHeaderProps> = ({
  onClose,
  onToggleInfo,
  onToggleEpisodeList,
  showInfoDropdown,
  showEpisodeList,
}) => {
  return (
    <div className="documentary-player-header">
      <button
        className="control-button"
        onClick={onClose}
        aria-label="Close documentary player"
        type="button"
      />
      <div className="documentary-badge">
        <FontAwesomeIcon icon={faFilm} className="badge-icon" />
        <span>Media</span>
      </div>
      <div className="header-controls">
        <button
          className={`control-button ${showInfoDropdown ? "active" : ""}`}
          onClick={onToggleInfo}
          aria-label="Show episode information"
          type="button"
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </button>
        <button
          className={`control-button ${showEpisodeList ? "active" : ""}`}
          onClick={onToggleEpisodeList}
          aria-label="Show episode list"
          type="button"
        >
          <FontAwesomeIcon icon={faList} />
        </button>
      </div>
    </div>
  );
};

export default DocumentaryHeader;
