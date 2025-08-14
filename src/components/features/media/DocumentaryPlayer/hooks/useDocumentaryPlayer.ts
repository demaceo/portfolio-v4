'use client';

import { useState } from 'react';
import { Episode } from '@/lib/types';
import { DocumentaryPlayerState, DocumentaryPlayerActions } from '@/lib/types';


export function useDocumentaryPlayer(initialEpisode: Episode) {
    const [playerState, setPlayerState] = useState<DocumentaryPlayerState>({
        isVideoLoaded: false,
        selectedEpisode: initialEpisode,
        showEpisodeList: false,
        showInfoDropdown: false,
        isContentExpanded: false,
    });

    const setIsVideoLoaded = (loaded: boolean) => {
        setPlayerState(prev => ({ ...prev, isVideoLoaded: loaded }));
    };

    const setSelectedEpisode = (episode: Episode) => {
        setPlayerState(prev => ({
            ...prev,
            selectedEpisode: episode,
            isVideoLoaded: false,
            showEpisodeList: false,
        }));
    };

    const setShowEpisodeList = (show: boolean) => {
        setPlayerState(prev => ({ ...prev, showEpisodeList: show }));
    };

    const setShowInfoDropdown = (show: boolean) => {
        setPlayerState(prev => ({ ...prev, showInfoDropdown: show }));
    };

    const setIsContentExpanded = (expanded: boolean) => {
        setPlayerState(prev => ({ ...prev, isContentExpanded: expanded }));
    };

    const toggleEpisodeList = () => {
        setPlayerState(prev => ({
            ...prev,
            showEpisodeList: !prev.showEpisodeList,
            // Close info dropdown when episode list is opened
            showInfoDropdown: !prev.showEpisodeList ? false : prev.showInfoDropdown,
        }));
    };

    const toggleInfoDropdown = () => {
        setPlayerState(prev => ({
            ...prev,
            showInfoDropdown: !prev.showInfoDropdown,
            // Close episode list when info dropdown is opened
            showEpisodeList: !prev.showInfoDropdown ? false : prev.showEpisodeList,
        }));
    };

    const toggleContentExpansion = () => {
        setPlayerState(prev => ({
            ...prev,
            isContentExpanded: !prev.isContentExpanded
        }));
    };

    const resetVideoLoad = () => {
        setPlayerState(prev => ({ ...prev, isVideoLoaded: false }));
    };

    const actions: DocumentaryPlayerActions = {
        setIsVideoLoaded,
        setSelectedEpisode,
        setShowEpisodeList,
        setShowInfoDropdown,
        setIsContentExpanded,
        toggleEpisodeList,
        toggleInfoDropdown,
        toggleContentExpansion,
        resetVideoLoad,
    };

    return {
        playerState,
        actions,
    };
}
