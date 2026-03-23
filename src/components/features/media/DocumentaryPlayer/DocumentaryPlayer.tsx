"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faList } from "@fortawesome/free-solid-svg-icons";
import { documentaryEpisodes } from "@/data";
import "./DocumentaryPlayer.css";
import {
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
import { ModalFrame } from "@/components/features/modal";

const DocumentaryPlayer: React.FC<ModalProps> = ({ onClose }) => {
  // Initialize hooks
  const { playerState, actions } = useDocumentaryPlayer(documentaryEpisodes[0]);
  const documentaryActions = useDocumentaryActions({ actions, onClose });
  const { episodeContent, episodeTitle } = useEpisodeContent(playerState.selectedEpisode);

  const headerActions = (
    <div className="documentary-frame-actions">
      <button
        className={`documentary-frame-button ${
          playerState.showInfoDropdown ? "active" : ""
        }`}
        onClick={documentaryActions.handleToggleInfoDropdown}
        aria-label="Show episode information"
        type="button"
      >
        <FontAwesomeIcon icon={faInfoCircle} />
      </button>
      <button
        className={`documentary-frame-button ${
          playerState.showEpisodeList ? "active" : ""
        }`}
        onClick={documentaryActions.handleToggleEpisodeList}
        aria-label="Show episode list"
        type="button"
      >
        <FontAwesomeIcon icon={faList} />
      </button>
    </div>
  );

  return (
    <ModalFrame
      onClose={documentaryActions.handleClosePlayer}
      title="Documentary"
      size="xl"
      titleId="documentary-title"
      closeAriaLabel="Close documentary player"
      headerActions={headerActions}
    >
      <div className="documentary-player-content">
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
    </ModalFrame>
  );
};

export default DocumentaryPlayer;
