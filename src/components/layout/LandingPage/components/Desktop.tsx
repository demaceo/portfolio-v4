"use client";

import type React from "react";
import DesktopRain from "./DesktopRain";

/**
 * The desktop surface itself: the frosted-glass panel with the animated rain
 * layer. Apps are launched from the MenuBar, the Welcome window and the ⌘K
 * palette on desktop/tablet, and from the AppSwitcher dock on phones (where
 * this whole surface is hidden, see LandingPage.css).
 */
const Desktop: React.FC = () => (
  <div className="desktop">
    <DesktopRain />
  </div>
);

export default Desktop;
