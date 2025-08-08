"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faFilm,
  faClock,
  faTimes,
  faList,
  faHeart,
  faChevronDown,
  faChevronUp,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { documentaryEpisodes, type Episode } from "@/data";
import "./DocumentaryPlayer.css";

interface DocumentaryPlayerProps {
  onClose: () => void;
}

// Utility function to sanitize embed IDs
const sanitizeEmbedId = (embedId: string): string => {
  return embedId.replace(/[^a-zA-Z0-9]/g, "");
};

const DocumentaryPlayer: React.FC<DocumentaryPlayerProps> = ({ onClose }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    documentaryEpisodes[0]
  );
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const handleExternalLink = () => {
    window.open(selectedEpisode.externalUrl, "_blank");
  };

  const handleDonate = () => {
    window.open("https://www.pbs.org/donate", "_blank");
  };

  const handleEpisodeSelect = (episode: Episode) => {
    console.log("Episode selected:", episode.title);
    setSelectedEpisode(episode);
    setIsVideoLoaded(false);
    setShowEpisodeList(false);
  };

  const toggleEpisodeList = () => {
    console.log("Toggle episode list clicked. Current state:", showEpisodeList);
    setShowEpisodeList((prev) => !prev);
    // Close info dropdown when episode list is opened
    if (!showEpisodeList) {
      setShowInfoDropdown(false);
    }
  };

  const toggleInfoDropdown = () => {
    setShowInfoDropdown((prev) => !prev);
    // Close episode list when info dropdown is opened
    if (!showInfoDropdown) {
      setShowEpisodeList(false);
    }
  };

  const toggleContentExpansion = () => {
    setIsContentExpanded((prev) => !prev);
  };

  return (
    <div className="documentary-player-overlay" onClick={onClose}>
      <div
        className={`documentary-player-container`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="documentary-player-header">
          <button
            className="control-button"
            onClick={onClose}
            aria-label="Close documentary player"
          />
          <div className="documentary-badge">
            <FontAwesomeIcon icon={faFilm} className="badge-icon" />
            <span>Media</span>
          </div>
          <div className="header-controls">
            <button
              className={`control-button ${showInfoDropdown ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleInfoDropdown();
              }}
              aria-label="Show episode information"
              type="button"
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
            <button
              className={`control-button ${showEpisodeList ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleEpisodeList();
              }}
              aria-label="Show episode list"
              type="button"
            >
              <FontAwesomeIcon icon={faList} />
            </button>
          </div>
        </div>

        {/* Episode Selector */}
        {showEpisodeList && (
          <div className="episode-selector">
            <h3>Choose Episode</h3>
            <div className="episode-list">
              {documentaryEpisodes.map((episode: Episode) => (
                <button
                  key={episode.id}
                  className={`episode-item ${
                    selectedEpisode.id === episode.id ? "selected" : ""
                  }`}
                  onClick={() => handleEpisodeSelect(episode)}
                >
                  <div className="episode-info">
                    <span className="episode-title">{episode.title}</span>
                    <span className="episode-duration">
                      <FontAwesomeIcon icon={faClock} />
                      {episode.duration}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info Dropdown */}
        {showInfoDropdown && (
          <div className="info-dropdown">
            <div className="info-dropdown-content">
              <div className="documentary-header">
                <div className="documentary-title-section">
                  <h2 className="documentary-title">Tech For Us</h2>
                  <p className="documentary-subtitle">
                    Episode{" "}
                    {documentaryEpisodes.findIndex(
                      (ep: Episode) => ep.id === selectedEpisode.id
                    ) + 1}{" "}
                    · {selectedEpisode.title}
                  </p>
                </div>
                <button
                  className="content-expand-button"
                  onClick={toggleContentExpansion}
                  aria-label={
                    isContentExpanded ? "Collapse content" : "Expand content"
                  }
                >
                  <FontAwesomeIcon
                    icon={isContentExpanded ? faChevronUp : faChevronDown}
                  />
                </button>
              </div>

              <div className="documentary-description">
                <div className="description-content">
                  <p>
                    {selectedEpisode.id === "episode-1"
                      ? "I was featured in this documentary exploring the intersection of technology, innovation, and career development in the modern digital landscape. This episode highlights breaking barriers and personal stories of professionals navigating challenges in tech."
                      : "The second episode continues the journey, focusing on building sustainable futures in technology and how professionals are creating lasting impact through innovation and community engagement."}
                  </p>
                  {isContentExpanded && (
                    <div className="extended-description">
                      <p>
                        {selectedEpisode.id === "episode-1"
                          ? "In this compelling episode, I share my journey through the tech industry, discussing the challenges and triumphs that have shaped my career. This documentary captures the real human stories behind the technology that impact us every day. The episode features candid conversations about imposter syndrome, the importance of diversity in tech, and how personal experiences can drive innovation."
                          : "This episode delves deeper into the practical aspects of building sustainable careers in technology. Featuring insights on leadership, team building, and the responsibility that comes with technological advancement. The documentary explores how professionals are leveraging their skills to create positive social impact, build inclusive communities, and mentor the next generation of tech innovators."}
                      </p>
                      <div className="episode-details">
                        <div className="detail-item">
                          <span className="detail-label">Production:</span>
                          <span className="detail-value">
                            Roadtrip Nation
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Series:</span>
                          <span className="detail-value">Tech For Us</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Duration:</span>
                          <span className="detail-value">
                            {selectedEpisode.duration}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Topics:</span>
                          <span className="detail-value">
                            {selectedEpisode.id === "episode-1"
                              ? "Career Development, Public Interest Technology, Innovation"
                              : "Sustainability, Community Impact, Leadership"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="documentary-actions">
                <button
                  className="action-button secondary"
                  onClick={handleExternalLink}
                  aria-label="Open documentary on PBS website"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  View on PBS
                </button>
                <div className="donate-message">
                  Defunded but not defeated. Help keep your local PBS station
                  strong.
                </div>
                <button
                  className="action-button donate"
                  onClick={handleDonate}
                  aria-label="Donate to PBS"
                  title="Defunded but not defeated. Help keep your local PBS station strong."
                >
                  <FontAwesomeIcon icon={faHeart} />
                  Donate to PBS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Section */}
        <div className="documentary-video-section">
          <div className="documentary-iframe-container">
            <div
              className="pbs-viral-player-wrapper"
              style={{
                position: "relative",
                paddingTop: "calc(56.25% + 43px)",
              }}
            >
              <iframe
                src={`https://player.pbs.org/viralplayer/${sanitizeEmbedId(
                  selectedEpisode.embedId
                )}/`}
                allowFullScreen
                allow="encrypted-media"
                style={{
                  position: "absolute",
                  top: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                title={`Tech For Us - ${selectedEpisode.title}`}
              />
            </div>
          </div>
        </div>

    
      </div>
    </div>
  );
};

export default DocumentaryPlayer;
