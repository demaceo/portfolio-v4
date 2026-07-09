"use client";

import React from "react";
import styles from "./Grid.module.css";

interface GridProps {
  minItemWidth?: string;
  gap?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

const Grid: React.FC<GridProps> = ({
  minItemWidth = "220px",
  gap = "md",
  className = "",
  children,
}) => {
  const gapClass = gap === "sm" ? styles.gapSm : gap === "lg" ? styles.gapLg : styles.gapMd;

  return (
    <div
      className={[styles.grid, gapClass, className].filter(Boolean).join(" ")}
      style={{ "--grid-min-item": minItemWidth } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default Grid;
