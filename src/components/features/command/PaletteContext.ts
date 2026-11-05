"use client";

import { createContext, useContext } from "react";

/**
 * Opens the ⌘K command palette. Provided by LandingPage (which owns the
 * palette); null when no palette is mounted (e.g. other routes). Lets shells
 * such as AppView offer a search trigger without knowing who renders it.
 */
export const PaletteContext = createContext<(() => void) | null>(null);

export const usePaletteOpener = () => useContext(PaletteContext);
