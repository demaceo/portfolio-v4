'use client';

import { useState, useEffect } from 'react';

export function useScrollPosition() {
    const [scrollY, setScrollY] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

    useEffect(() => {
        let lastScrollY = window.pageYOffset;

        const updateScrollPosition = () => {
            const currentScrollY = window.pageYOffset;
            setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
            setScrollY(currentScrollY);
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', updateScrollPosition, { passive: true });
        return () => window.removeEventListener('scroll', updateScrollPosition);
    }, []);

    return { scrollY, scrollDirection };
}
