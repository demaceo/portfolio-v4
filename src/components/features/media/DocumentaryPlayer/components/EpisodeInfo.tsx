"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { EpisodeInfoProps } from "@/lib/types";
import DocumentaryActions from "./DocumentaryActions";



const EpisodeInfo: React.FC<EpisodeInfoProps> = ({
  selectedEpisode,
  episodeTitle,
  episodeContent,
  isContentExpanded,
  onToggleContentExpansion,
  onExternalLink,
  onDonate,
}) => {
  return (
    <div className="info-dropdown">
      <div className="info-dropdown-content">
        <div className="documentary-header">
          <div className="documentary-title-section">
            <h2 className="documentary-title">Tech For Us</h2>
            <p className="documentary-subtitle">{episodeTitle}</p>
          </div>
          <button
            className="content-expand-button"
            onClick={onToggleContentExpansion}
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
            <p>{episodeContent.description}</p>
            {isContentExpanded && (
              <div className="extended-description">
                <p>{episodeContent.extendedDescription}</p>
                <div className="episode-details">
                  <div className="detail-item">
                    <span className="detail-label">Production:</span>
                    <span className="detail-value">
                      {episodeContent.production}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Series:</span>
                    <span className="detail-value">
                      {episodeContent.series}
                    </span>
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
                      {episodeContent.topics}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DocumentaryActions
          externalUrl={selectedEpisode.externalUrl}
          onExternalLink={onExternalLink}
          onDonate={onDonate}
        />
      </div>
    </div>
  );
};

export default EpisodeInfo;
