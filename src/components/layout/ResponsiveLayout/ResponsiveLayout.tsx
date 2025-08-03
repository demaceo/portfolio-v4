"use client";

import React, { useState, useEffect } from "react";
import DesktopLayout from "../DesktopLayout/DesktopLayout";
import MobileLayout from "../MobileLayout/MobileLayout";

const ResponsiveLayout: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set mounted flag and initial window width
    setIsMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show loading state while hydrating to prevent SSR mismatch
  if (!isMounted) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  // Use 768px as the breakpoint for mobile/desktop
  const isMobile = windowWidth < 768;

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default ResponsiveLayout;
