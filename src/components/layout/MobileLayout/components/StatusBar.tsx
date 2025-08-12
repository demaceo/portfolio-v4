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
      <Image
        className="carrier"
        alt="portfolio-logo"
        src={`${ASSET_PATHS.LOGOS}/PORTFOLIO_LOGO.png`}
        width={20}
        height={20}
      />
      <span className="time">{formatTime(currentTime)}</span>
    </div>
  );
};

export default StatusBar;
