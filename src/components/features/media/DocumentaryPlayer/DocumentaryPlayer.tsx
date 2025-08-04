"use client";

import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTimes,
  faExternalLinkAlt,
  faFilm,
  faClock,
  faTv,
  faAward,
} from "@fortawesome/free-solid-svg-icons";
import "./DocumentaryPlayer.css";

interface DocumentaryPlayerProps {
  onClose: () => void;
}

const DocumentaryPlayer: React.FC<DocumentaryPlayerProps> = ({ onClose }) => {
  const handlePlayClick = () => {
    // Open the actual PBS video in a new window
    window.open("https://player.pbs.org/video/in-our-genes/", "_blank");
  };

  return (
    <div className="documentary-player-overlay" onClick={onClose}>
      <div
        className="documentary-player-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="documentary-player-header">
          <div className="documentary-badge">
            <FontAwesomeIcon icon={faFilm} className="badge-icon" />
            <span>PBS Documentary</span>
          </div>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close documentary player"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Video Thumbnail */}
        <div className="documentary-thumbnail-container">
          <Image
            src="https://image.pbs.org/video-assets/5Q3iQAC-asset-mezzanine-16x9-luFIYQ7.jpg?crop=1440x810&format=auto"
            alt="PBS Documentary: Unmasked - The Hidden Struggles of American Masculinity"
            className="documentary-thumbnail"
            width={1440}
            height={810}
            priority
          />
          <div className="play-overlay">
            <button
              className="play-button"
              onClick={handlePlayClick}
              aria-label="Watch documentary on PBS"
            >
              <FontAwesomeIcon icon={faPlay} />
              <span>Watch on PBS</span>
            </button>
          </div>
          <div className="duration-badge">
            <FontAwesomeIcon icon={faClock} />
            <span>25:33</span>
          </div>
        </div>

        {/* Content */}
        <div className="documentary-content">
          <div className="documentary-header">
            <h2 className="documentary-title">
              Unmasked: The Hidden Struggles of American Masculinity
            </h2>
            <p className="documentary-subtitle">
              Featured Story · Technology & Career Development
            </p>
          </div>

          <div className="documentary-description">
            <p>
              I was featured in this PBS documentary exploring the intersection
              of technology, innovation, and career development in the modern
              digital landscape. The documentary highlights personal stories of
              professionals navigating challenges and building meaningful
              careers in tech.
            </p>
          </div>

          <div className="documentary-meta">
            <div className="meta-item">
              <FontAwesomeIcon icon={faTv} className="meta-icon" />
              <div className="meta-content">
                <span className="meta-label">Network</span>
                <span className="meta-value">PBS</span>
              </div>
            </div>
            <div className="meta-item">
              <FontAwesomeIcon icon={faClock} className="meta-icon" />
              <div className="meta-content">
                <span className="meta-label">Duration</span>
                <span className="meta-value">25 minutes</span>
              </div>
            </div>
            <div className="meta-item">
              <FontAwesomeIcon icon={faAward} className="meta-icon" />
              <div className="meta-content">
                <span className="meta-label">Topic</span>
                <span className="meta-value">Tech Innovation</span>
              </div>
            </div>
          </div>

          <div className="documentary-actions">
            <button
              className="action-button primary"
              onClick={handlePlayClick}
              aria-label="Watch full documentary on PBS"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} />
              Watch Full Documentary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentaryPlayer;
