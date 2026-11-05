"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface MobileSearchButtonProps {
  onOpen: () => void;
  onPreload: () => void;
  isOpen: boolean;
}

/**
 * Touch/phone entry point to the ⌘K command palette. The MenuBar (which hosts
 * the desktop "Projects" + ⌘K triggers) is hidden at ≤768px / coarse
 * pointers, so this floating Glass button takes its place there. CSS shows it
 * only under that exact media query (see LandingPage.menu.css).
 */
const MobileSearchButton: React.FC<MobileSearchButtonProps> = ({ onOpen, onPreload, isOpen }) => (
  <button
    type="button"
    className="mobile-search-button"
    onClick={onOpen}
    onPointerDown={onPreload}
    onFocus={onPreload}
    aria-label="Search projects and actions"
    aria-haspopup="dialog"
    aria-expanded={isOpen}
  >
    <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
  </button>
);

export default MobileSearchButton;
