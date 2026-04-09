"use client";

import React from "react";
import Image from "next/image";
import { ASSET_PATHS } from "@/lib/constants/paths";

interface StatusBarProps {
  currentTime?: Date;
  showPerformanceToggle?: boolean;
  performanceMode?: boolean;
  onPerformanceModeToggle?: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({
  showPerformanceToggle = false,
  performanceMode = false,
  onPerformanceModeToggle,
}) => {
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
      </div>

      <div className="status-bar-center">
        <span className="status-chip">
          <span className="status-chip-dot" aria-hidden="true"></span>
          Available for Projects
        </span>
      </div>

      <div className="status-bar-right">
        {showPerformanceToggle && onPerformanceModeToggle && (
          <button
            type="button"
            className={`status-performance-toggle ${performanceMode ? "active" : ""}`}
            onClick={onPerformanceModeToggle}
            aria-pressed={performanceMode}
            aria-label={
              performanceMode
                ? "Disable modal performance mode"
                : "Enable modal performance mode"
            }
            title={performanceMode ? "Performance Mode On" : "Performance Mode Off"}
          >
            Perf
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
