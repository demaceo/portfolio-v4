'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

function isApplePlatform(): boolean {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const platform = nav.userAgentData?.platform || nav.platform || nav.userAgent;
    return /mac|iphone|ipad|ipod/i.test(platform);
}

/**
 * Display label for a Cmd/Ctrl + `key` shortcut: "⌘K" on Apple platforms,
 * "Ctrl K" elsewhere, plus a spoken form for aria-labels. The server snapshot
 * is the Apple form; non-Apple clients switch after hydration without a
 * hydration mismatch (useSyncExternalStore handles the hand-off).
 */
export function useShortcutLabel(key: string): { label: string; spoken: string } {
    const apple = useSyncExternalStore(noopSubscribe, isApplePlatform, () => true);
    const upper = key.toUpperCase();
    return apple
        ? { label: `⌘${upper}`, spoken: `Command ${upper}` }
        : { label: `Ctrl ${upper}`, spoken: `Control ${upper}` };
}
