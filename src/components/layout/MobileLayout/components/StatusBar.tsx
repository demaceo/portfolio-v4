"use client";

import React from "react";
import Image from "next/image";
import { ASSET_PATHS } from "@/lib/constants/paths";

interface StatusBarProps {
  currentTime: Date;
}

const StatusBar: React.FC<StatusBarProps> = ({ currentTime }) => {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <Image
          className="carrier-logo"
          alt="portfolio-logo"
          src={`${ASSET_PATHS.LOGOS}/PORTFOLIO_LOGO.png`}
          width={24}
          height={24}
          priority
        />
        {/* <span className="carrier-text">Demaceo</span> */}
        <span className="time">{formatTime(currentTime)}</span>
      </div>

      <div className="status-bar-center">
        <div className="notch-indicator"></div>
      </div>

      <div className="status-bar-right">
        <div className="signal-bars">
          <div className="bar bar-1"></div>
          <div className="bar bar-2"></div>
          <div className="bar bar-3"></div>
          <div className="bar bar-4"></div>
        </div>
        <div className="battery-container">
          <div className="battery-level"></div>
          <div className="battery-tip"></div>
        </div>
        {/* <span className="time">{formatTime(currentTime)}</span> */}
      </div>
    </div>
  );
};

export default StatusBar;
