"use client";

import React from "react";

const Taskbar: React.FC = () => {
  return (
    <div className="taskbar">
      <div className="start-menu">Machina Ex Demaceo</div>
      <div className="running-apps">
        {/* <div className="app-tab active">Finder</div> */}
        <div className="app-tab">Portfolio</div>
      </div>
    </div>
  );
};

export default Taskbar;
