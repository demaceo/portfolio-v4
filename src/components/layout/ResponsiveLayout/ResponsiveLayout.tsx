"use client";

import React, { useState, useEffect } from "react";
import HomeScreen from "../DesktopLayout/DesktopLayout";
import MobileLayout from "../MobileLayout/MobileLayout";

const ResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to check if device is mobile
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 768;
      setIsMobile(isMobileDevice);
      setIsLoading(false);
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
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        Loading...
      </div>
    );
  }

  // Render appropriate layout based on device type
  return isMobile ? <MobileLayout /> : <HomeScreen />;
};

export default ResponsiveLayout;
