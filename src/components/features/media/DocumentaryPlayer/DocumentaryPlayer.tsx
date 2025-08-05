"use client";

import React, { useState } from "react";
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
  faExpand,
  faCompress,
  faList,
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    documentaryEpisodes[0]
  );
  const [showEpisodeList, setShowEpisodeList] = useState(false);

  const handleLoadVideo = () => {
    setIsVideoLoaded(true);
  };

  const handleExternalLink = () => {
    window.open(selectedEpisode.externalUrl, "_blank");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
    setIsVideoLoaded(false);
    setShowEpisodeList(false);
  };

  const toggleEpisodeList = () => {
    setShowEpisodeList(!showEpisodeList);
  };

  return (
    <div className="documentary-player-overlay" onClick={onClose}>
      <div
        className={`documentary-player-container ${
          isFullscreen ? "fullscreen" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="documentary-player-header">
          <div className="documentary-badge">
            <FontAwesomeIcon icon={faFilm} className="badge-icon" />
            <span>PBS Documentary Series</span>
          </div>
          <div className="header-controls">
            <button
              className="control-button"
              onClick={toggleEpisodeList}
              aria-label="Show episode list"
            >
              <FontAwesomeIcon icon={faList} />
            </button>
            <button
              className="control-button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
            </button>
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Close documentary player"
            >
              <FontAwesomeIcon icon={faTimes} />
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

        {/* Video Player Section */}
        <div className="documentary-video-section">
          {!isVideoLoaded ? (
            <div className="documentary-preview">
              <div className="preview-content">
                <div className="preview-thumbnail">
                  <Image
                    src="https://image.pbs.org/video-assets/5Q3iQAC-asset-mezzanine-16x9-luFIYQ7.jpg?crop=1440x810&format=auto"
                    alt="Tech For Us - PBS Documentary"
                    className="thumbnail-image"
                    width={1440}
                    height={810}
                    priority
                  />
                  <div className="play-overlay">
                    <button
                      className="play-button"
                      onClick={handleLoadVideo}
                      aria-label="Load and play documentary"
                    >
                      <FontAwesomeIcon icon={faPlay} />
                      <span>Watch Documentary</span>
                    </button>
                  </div>
                  <div className="duration-badge">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{selectedEpisode.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
              {isValidEmbedId(selectedEpisode.embedId) ? (
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
              ) : (
                <div className="documentary-iframe-error">
                  <p>Invalid video identifier. Unable to load video.</p>
                </div>
              )}
          )}
        </div>

        {/* Content Info - Only show when video is not loaded or not in fullscreen */}
        {(!isVideoLoaded || !isFullscreen) && (
          <div className="documentary-content">
            <div className="documentary-header">
              <h2 className="documentary-title">
                Tech For Us: {selectedEpisode.title}
              </h2>
              <p className="documentary-subtitle">
                Episode{" "}
                {documentaryEpisodes.findIndex(
                  (ep: Episode) => ep.id === selectedEpisode.id
                ) + 1}{" "}
                · Technology & Career Development
              </p>
            </div>

            <div className="documentary-description">
              <p>
                {selectedEpisode.id === "episode-1"
                  ? "I was featured in this PBS documentary episode exploring the intersection of technology, innovation, and career development in the modern digital landscape. This episode highlights breaking barriers and personal stories of professionals navigating challenges in tech."
                  : "The second episode continues the journey, focusing on building sustainable futures in technology and how professionals are creating lasting impact through innovation and community engagement."}
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
                  <span className="meta-value">{selectedEpisode.duration}</span>
                </div>
              </div>
              <div className="meta-item">
                <FontAwesomeIcon icon={faAward} className="meta-icon" />
                <div className="meta-content">
                  <span className="meta-label">Episode</span>
                  <span className="meta-value">{selectedEpisode.title}</span>
                </div>
              </div>
            </div>

            <div className="documentary-actions">
              {!isVideoLoaded && (
                <button
                  className="action-button primary"
                  onClick={handleLoadVideo}
                  aria-label="Load and watch documentary"
                >
                  <FontAwesomeIcon icon={faPlay} />
                  Watch Now
                </button>
              )}
              <button
                className="action-button secondary"
                onClick={handleExternalLink}
                aria-label="Open documentary on PBS website"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                View on PBS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentaryPlayer;
