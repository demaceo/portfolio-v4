'use client';

import { useCallback, useSyncExternalStore } from 'react';

// One MediaQueryList per query string for the life of the page. Calling
// window.matchMedia() inside getSnapshot would allocate and parse a new list
// on every render (useSyncExternalStore calls getSnapshot repeatedly).
const mediaQueryLists = new Map<string, MediaQueryList>();

function getMediaQueryList(query: string): MediaQueryList {
    let mql = mediaQueryLists.get(query);
    if (!mql) {
        mql = window.matchMedia(query);
        mediaQueryLists.set(query, mql);
    }
    return mql;
}

/**
 * Subscribes to a CSS media query. SSR-safe: the server snapshot is `false`,
 * so markup renders the desktop variant first and hydrates to the real value.
 * useSyncExternalStore (rather than useState + useEffect) avoids a tearing
 * frame where the first client render disagrees with the live query.
 */
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const mql = getMediaQueryList(query);
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        },
        [query]
    );

    return useSyncExternalStore(
        subscribe,
        () => getMediaQueryList(query).matches,
        () => false
    );
}

/** Single source of truth for "overlays render as bottom sheets". Mirrors the
 *  768px / coarse-pointer breakpoint the MenuBar already uses to hide itself. */
export const SHEET_MEDIA_QUERY = '(max-width: 768px)';
