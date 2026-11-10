"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useShortcutLabel } from "@/hooks";

interface SearchButtonProps {
  onOpen: () => void;
  onPreload: () => void;
  isOpen: boolean;
  /** A full-screen AppView is open. Touch devices hide the button then (every AppView title
   *  bar has its own search button there); the desktop pill stays. */
  isAppViewOpen: boolean;
}

/**
 * The one on-screen entry point to the ⌘K palette, for every device. CSS picks the look (see
 * LandingPage.menu.css): a frosted pill with the shortcut label in the bottom-right corner on a
 * mouse desktop, and an icon-only circle top-right on phones and touch tablets, where the
 * MenuBar is hidden and there is no keyboard shortcut to advertise.
 */
const SearchButton: React.FC<SearchButtonProps> = ({ onOpen, onPreload, isOpen, isAppViewOpen }) => {
  const shortcut = useShortcutLabel("k");
  return (
    <button
      type="button"
      className={`search-button${isAppViewOpen ? " search-button--app-open" : ""}`}
      onClick={onOpen}
      onPointerEnter={onPreload}
      onPointerDown={onPreload}
      onFocus={onPreload}
      aria-label="Search projects and actions"
      aria-keyshortcuts="Control+K Meta+K"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
      <kbd className="search-button-kbd" aria-hidden="true">
        {shortcut.label}
      </kbd>
    </button>
  );
};

export default SearchButton;
