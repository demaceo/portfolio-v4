"use client";

import type React from "react";
import DesktopRain from "./DesktopRain";
import HomeScreen, { type HomeScreenProps } from "./HomeScreen";

/**
 * The desktop surface: the frosted-glass panel with the animated rain layer
 * behind the home-screen icon grid. Apps launch from the MenuBar, the Welcome
 * window and the ⌘K palette on mouse desktops, and from the AppSwitcher dock
 * on phones, tablets and other touch screens.
 */
const Desktop: React.FC<HomeScreenProps> = (props) => (
  <div className="desktop">
    <DesktopRain />
    <HomeScreen {...props} />
  </div>
);

export default Desktop;
