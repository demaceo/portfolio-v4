"use client";

import React, { useState, useEffect } from "react";
import HomeScreen from "../DesktopLayout/DesktopLayout";
import MobileLayout from "../MobileLayout/MobileLayout";
import BackgroundBit from "@/components/woozyx3/BackgroundBit/Background";

const ResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag to true and check device
    setIsClient(true);

    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 768;
      setIsMobile(isMobileDevice);
    };

    // Check device on mount
    checkDevice();

    // Add event listener for window resize
    const handleResize = () => {
      checkDevice();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Show loading state during hydration to prevent mismatch
  if (!isClient) {
    return null; // Return null during SSR to prevent hydration mismatch
  }

  // Render appropriate layout based on device type
  return isMobile ? <MobileLayout /> : <HomeScreen />;
};

export default ResponsiveLayout;
