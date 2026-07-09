"use client";

import React from "react";

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const Chip: React.FC<ChipProps> = ({ active = false, onClick, className = "", children }) => {
  const isStatic = !onClick;

  if (isStatic) {
    return (
      <span className={["glass-chip", className].filter(Boolean).join(" ")}>
        {children}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={["glass-chip", active ? "active" : "", className].filter(Boolean).join(" ")}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Chip;
