'use client';

import { useState, useCallback } from 'react';
import { DropdownState, DropdownActions } from '@/lib/types';

const initialDropdownState: DropdownState = {
    openDropdown: null,
    hoveredTechCategory: null,
};

export function useDropdownState() {
    const [dropdownState, setDropdownState] = useState<DropdownState>(initialDropdownState);

    const setOpenDropdown = useCallback((dropdown: string | null) => {
        setDropdownState(prev => ({ ...prev, openDropdown: dropdown }));
    }, []);

    const setHoveredTechCategory = useCallback((category: string | null) => {
        setDropdownState(prev => ({ ...prev, hoveredTechCategory: category }));
    }, []);

    const closeAllDropdowns = useCallback(() => {
        setDropdownState(initialDropdownState);
    }, []);

    const actions: DropdownActions = {
        setOpenDropdown,
        setHoveredTechCategory,
        closeAllDropdowns,
    };

    return {
        dropdownState,
        actions,
    };
}
