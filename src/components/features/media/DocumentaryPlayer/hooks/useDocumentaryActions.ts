'use client';

import { useCallback } from 'react';
import { Episode } from '@/lib/types';
import { UseDocumentaryActionsProps } from '@/lib/types';
import { openPBSLink, openDonateLink } from '../utils';

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
