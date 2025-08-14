"use client";

import React from "react";
import { documentaryEpisodes } from "@/data";
import "./DocumentaryPlayer.css";
import {
  DocumentaryHeader,
  EpisodeSelector,
  EpisodeInfo,
  VideoPlayer,
} from "./components";
import {
  useDocumentaryPlayer,
  useDocumentaryActions,
  useEpisodeContent,
} from "./hooks";
import { ModalProps } from "@/lib/types";

const DocumentaryPlayer: React.FC<ModalProps> = ({ onClose }) => {
  // Initialize hooks
  const { playerState, actions } = useDocumentaryPlayer(documentaryEpisodes[0]);
  const documentaryActions = useDocumentaryActions({ actions, onClose });
  const { episodeContent, episodeTitle } = useEpisodeContent(playerState.selectedEpisode);

  return (
    <div className="documentary-player-overlay" onClick={documentaryActions.handleClosePlayer}>
      <div
        className="documentary-player-container"
        onClick={(e) => e.stopPropagation()}
      >
        <DocumentaryHeader
          onClose={documentaryActions.handleClosePlayer}
          onToggleInfo={documentaryActions.handleToggleInfoDropdown}
          onToggleEpisodeList={documentaryActions.handleToggleEpisodeList}
          showInfoDropdown={playerState.showInfoDropdown}
          showEpisodeList={playerState.showEpisodeList}
        />

        {playerState.showEpisodeList && (
          <EpisodeSelector
            selectedEpisode={playerState.selectedEpisode}
            onEpisodeSelect={documentaryActions.handleEpisodeSelect}
          />
        )}

        {playerState.showInfoDropdown && (
          <EpisodeInfo
            selectedEpisode={playerState.selectedEpisode}
            episodeTitle={episodeTitle}
            episodeContent={episodeContent}
            isContentExpanded={playerState.isContentExpanded}
            onToggleContentExpansion={documentaryActions.handleToggleContentExpansion}
            onExternalLink={documentaryActions.handleExternalLink}
            onDonate={documentaryActions.handleDonate}
          />
        )}

        <VideoPlayer
          selectedEpisode={playerState.selectedEpisode}
          onVideoLoad={documentaryActions.handleVideoLoad}
        />
      </div>
    </div>
  );
};

export default DocumentaryPlayer;
