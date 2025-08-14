'use client';

import { useState, useCallback } from 'react';
import { SelectedProject, SelectedService, DropdownState, DropdownActions } from '@/lib/types';

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
