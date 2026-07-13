"use client";

import React from "react";

interface TaskbarProps {
  showWelcomeWindow: boolean;
  onTogglePortfolio: () => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ showWelcomeWindow, onTogglePortfolio }) => {
  return (
    <div className="taskbar">
      <div className="running-apps">
        <button
          type="button"
          className={`app-tab${showWelcomeWindow ? " active" : ""}`}
          onClick={onTogglePortfolio}
          aria-pressed={showWelcomeWindow}
        >
          Portfolio
        </button>
      </div>
      <div className="start-menu">Developer | Designer</div>
    </div>
  );
};

export default Taskbar;
