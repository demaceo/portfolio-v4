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
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <Image
          className="carrier-logo"
          alt="Demaceo Vincent portfolio logo"
          src={`${ASSET_PATHS.LOGOS}/PORTFOLIO_LOGO.png`}
          width={24}
          height={24}
          priority
        />
        <span className="carrier-text">Demaceo Vincent</span>
      </div>

      <div className="status-bar-center">
        <span className="status-chip">
          <span className="status-chip-dot" aria-hidden="true"></span>
          Available for Projects
        </span>
      </div>

      <div className="status-bar-right">
        <span className="time">{formatTime(currentTime)}</span>
      </div>
    </div>
  );
};

export default StatusBar;
