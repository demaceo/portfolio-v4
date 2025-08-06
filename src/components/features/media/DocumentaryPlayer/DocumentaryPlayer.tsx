"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faPlay,
  faExternalLinkAlt,
  faFilm,
  faClock,
  // faTv,
  // faAward,
  faExpand,
  faCompress,
  faList,
  faHeart,
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
  // Dynamically import mobile or desktop CSS based on screen size
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 769) {
      // @ts-expect-error importing CSS dynamically
      import("./Mobile.css");
    } else {
      // @ts-expect-error importing CSS dynamically
      import("./DocumentaryPlayer.css");
    }
  }, []);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    documentaryEpisodes[0]
  );
  const [showEpisodeList, setShowEpisodeList] = useState(false);

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
  };

  return (
    <div className="documentary-player-overlay" onClick={onClose}>
      <div
        className={`documentary-player-container`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="documentary-player-header">
          <div className="documentary-badge">
            {/* <FontAwesomeIcon icon={faFilm} className="badge-icon" /> */}
            <span>Media</span>
          </div>
          <div className="header-controls">
            <button
              className="control-button"
              onClick={onClose}
              aria-label="Close documentary player"
            >
              x
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

        {/* Content Info - Only show when video is not loaded or not in fullscreen */}
        {(!isVideoLoaded) && (
          <div className="documentary-content">
            <div className="documentary-header">
              <h2 className="documentary-title">Tech For Us</h2>
              <p className="documentary-subtitle">
                Episode{" "}
                {documentaryEpisodes.findIndex(
                  (ep: Episode) => ep.id === selectedEpisode.id
                ) + 1}{" "}
                · {selectedEpisode.title}
              </p>
            </div>

            <div className="documentary-description">
              <p>
                {selectedEpisode.id === "episode-1"
                  ? "I was featured in this PBS documentary episode exploring the intersection of technology, innovation, and career development in the modern digital landscape. This episode highlights breaking barriers and personal stories of professionals navigating challenges in tech."
                  : "The second episode continues the journey, focusing on building sustainable futures in technology and how professionals are creating lasting impact through innovation and community engagement."}
              </p>
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
        )}
      </div>
    </div>
  );
};

export default DocumentaryPlayer;
