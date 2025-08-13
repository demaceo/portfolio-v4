'use client';

import { useMemo } from 'react';
import { type Episode, documentaryEpisodes } from '@/data';
import { getEpisodeContent, getEpisodeNumber, type EpisodeContent } from '../utils';

export function useEpisodeContent(selectedEpisode: Episode) {
    const episodeContent = useMemo((): EpisodeContent => {
        return getEpisodeContent(selectedEpisode.id);
    }, [selectedEpisode.id]);

    const episodeNumber = useMemo((): number => {
        return getEpisodeNumber(documentaryEpisodes, selectedEpisode.id);
    }, [selectedEpisode.id]);

    const episodeTitle = useMemo(() => {
        return `Episode ${episodeNumber} · ${selectedEpisode.title}`;
    }, [episodeNumber, selectedEpisode.title]);

    return {
        episodeContent,
        episodeNumber,
        episodeTitle,
    };
}
