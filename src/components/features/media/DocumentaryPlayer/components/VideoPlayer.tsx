"use client";

import React from "react";
import { VideoPlayerProps } from "@/lib/types";
import { sanitizeEmbedId } from "../utils";


const VideoPlayer: React.FC<VideoPlayerProps> = ({
  selectedEpisode,
  onVideoLoad,
}) => {
  return (
    <div className="documentary-video-section">
      <div className="documentary-iframe-container">
        <div className="pbs-viral-player-wrapper">
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
              left: 0,
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
