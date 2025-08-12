"use client";

import React from "react";
import { type Episode } from "@/data";
import { sanitizeEmbedId } from "../utils";

interface VideoPlayerProps {
  selectedEpisode: Episode;
  onVideoLoad: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  selectedEpisode,
  onVideoLoad,
}) => {
  return (
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
            onLoad={onVideoLoad}
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
  );
};

export default VideoPlayer;
