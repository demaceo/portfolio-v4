'use client';

import { useMemo } from 'react';
import { documentaryEpisodes } from '@/data';
import { getEpisodeContent, getEpisodeNumber } from '../utils';

import { EpisodeContent, Episode } from '@/lib/types';

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
