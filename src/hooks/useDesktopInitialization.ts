'use client';

import { useEffect } from 'react';
import { idlePreload } from '@/lib/utils/preload';

export function useDesktopInitialization() {
    // Warm up the most likely modals after initial render without impacting LCP
    useEffect(() => {
        idlePreload(['about', 'contact']);
    }, []);
}
