'use client';

import { useState, useCallback } from 'react';

export interface SelectedProject {
    id: number;
    name: string;
    description: string;
    image?: string;
    link: string;
}

export interface SelectedService {
    icon: string;
    title: string;
    description: string;
}

export interface DropdownState {
    openDropdown: string | null;
    hoveredTechCategory: string | null;
    selectedProject: SelectedProject | null;
    selectedService: SelectedService | null;
}

export interface DropdownActions {
    setOpenDropdown: (dropdown: string | null) => void;
    setHoveredTechCategory: (category: string | null) => void;
    setSelectedProject: (project: SelectedProject | null) => void;
    setSelectedService: (service: SelectedService | null) => void;
    closeAllDropdowns: () => void;
}

const initialDropdownState: DropdownState = {
    openDropdown: null,
    hoveredTechCategory: null,
    selectedProject: null,
    selectedService: null,
};

export function useDropdownState() {
    const [dropdownState, setDropdownState] = useState<DropdownState>(initialDropdownState);

    const setOpenDropdown = useCallback((dropdown: string | null) => {
        setDropdownState(prev => ({ ...prev, openDropdown: dropdown }));
    }, []);

    const setHoveredTechCategory = useCallback((category: string | null) => {
        setDropdownState(prev => ({ ...prev, hoveredTechCategory: category }));
    }, []);

    const setSelectedProject = useCallback((project: SelectedProject | null) => {
        setDropdownState(prev => ({ ...prev, selectedProject: project }));
    }, []);

    const setSelectedService = useCallback((service: SelectedService | null) => {
        setDropdownState(prev => ({ ...prev, selectedService: service }));
    }, []);

    const closeAllDropdowns = useCallback(() => {
        setDropdownState(initialDropdownState);
    }, []);

    const actions: DropdownActions = {
        setOpenDropdown,
        setHoveredTechCategory,
        setSelectedProject,
        setSelectedService,
        closeAllDropdowns,
    };

    return {
        dropdownState,
        actions,
    };
}
