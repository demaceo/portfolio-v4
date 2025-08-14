"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import {  documentaryEpisodes } from "@/data";
import { Episode, EpisodeSelectorProps } from "@/lib/types";

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  selectedEpisode,
  onEpisodeSelect,
}) => {
  return (
    <div className="episode-selector">
      <h3>Choose Episode</h3>
      <div className="episode-list">
        {documentaryEpisodes.map((episode: Episode) => (
          <button
            key={episode.id}
            className={`episode-item ${
              selectedEpisode.id === episode.id ? "selected" : ""
            }`}
            onClick={() => onEpisodeSelect(episode)}
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
  );
};

export default EpisodeSelector;
