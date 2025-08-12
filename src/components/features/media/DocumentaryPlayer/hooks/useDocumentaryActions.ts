'use client';

import { useCallback } from 'react';
import { type Episode } from '@/data';
import { DocumentaryPlayerActions } from './useDocumentaryPlayer';
import { openPBSLink, openDonateLink } from '../utils';

export interface UseDocumentaryActionsProps {
    actions: DocumentaryPlayerActions;
    onClose: () => void;
}

export function useDocumentaryActions({ actions, onClose }: UseDocumentaryActionsProps) {
    const handleExternalLink = useCallback((externalUrl: string) => {
        openPBSLink(externalUrl);
    }, []);

    const handleDonate = useCallback(() => {
        openDonateLink();
    }, []);

    const handleEpisodeSelect = useCallback((episode: Episode) => {
        actions.setSelectedEpisode(episode);
    }, [actions]);

    const handleToggleEpisodeList = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        actions.toggleEpisodeList();
    }, [actions]);

    const handleToggleInfoDropdown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        actions.toggleInfoDropdown();
    }, [actions]);

    const handleToggleContentExpansion = useCallback(() => {
        actions.toggleContentExpansion();
    }, [actions]);

    const handleVideoLoad = useCallback(() => {
        actions.setIsVideoLoaded(true);
    }, [actions]);

    const handleClosePlayer = useCallback(() => {
        onClose();
    }, [onClose]);

    return {
        handleExternalLink,
        handleDonate,
        handleEpisodeSelect,
        handleToggleEpisodeList,
        handleToggleInfoDropdown,
        handleToggleContentExpansion,
        handleVideoLoad,
        handleClosePlayer,
    };
}
