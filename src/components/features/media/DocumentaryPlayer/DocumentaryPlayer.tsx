"use client";

import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTimes,
  faExternalLinkAlt,
  faFilm,
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
    <div className="documentary-player-overlay">
      <div className="documentary-player-container">
        <div className="documentary-player-header">
          <div className="documentary-info">
            <FontAwesomeIcon icon={faFilm} className="documentary-icon" />
            <div className="documentary-title-info">
              <h2>PBS Documentary Feature</h2>
              <p className="documentary-network">PBS · 25:33</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="documentary-player-content">
          <div className="documentary-thumbnail-container">
            <Image
              src="https://image.pbs.org/video-assets/5Q3iQAC-asset-mezzanine-16x9-luFIYQ7.jpg?crop=1440x810&format=auto"
              alt="PBS Documentary Thumbnail"
              className="documentary-thumbnail"
              width={1440}
              height={810}
              priority
            />
            <div className="play-overlay">
              <button className="play-button" onClick={handlePlayClick}>
                <FontAwesomeIcon icon={faPlay} />
                <span>Watch on PBS</span>
              </button>
            </div>
          </div>

          <div className="documentary-description">
            <h3>Featured Story</h3>
            <p>
              I was featured in this PBS documentary exploring technology,
              innovation, and career development in the modern digital
              landscape. The documentary highlights stories of professionals
              navigating the tech industry and building meaningful careers.
            </p>

            <div className="documentary-features">
              <div className="feature-item">
                <span className="feature-label">Network:</span>
                <span className="feature-value">PBS</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">Duration:</span>
                <span className="feature-value">25 minutes 33 seconds</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">Topic:</span>
                <span className="feature-value">
                  Technology & Career Development
                </span>
              </div>
            </div>

            <div className="documentary-actions">
              <button
                className="action-button primary"
                onClick={handlePlayClick}
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                Watch on PBS.org
              </button>
              <button className="action-button secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentaryPlayer;
