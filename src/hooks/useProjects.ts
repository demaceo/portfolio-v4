'use client';

import { useMemo } from 'react';
import { projectsData } from '@/data/projects';
import { Project } from '@/lib/types';

export function useProjects() {
    const activeProjects = useMemo(
        () => projectsData.filter((p: Project) => !p.archived),
        []
    );

    const archivedProjects = useMemo(
        () => projectsData.filter((p: Project) => p.archived),
        []
    );

    const getProjectById = useMemo(
        () => (id: number) => projectsData.find((p: Project) => p.id === id),
        []
    );

    return {
        activeProjects,
        archivedProjects,
        getProjectById,
        allProjects: projectsData
    };
}
