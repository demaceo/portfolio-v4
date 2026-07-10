"use client";

import React from "react";
import styles from "./Grid.module.css";

interface GridProps {
  minItemWidth?: string;
  gap?: "sm" | "md" | "lg";
  /**
   * "fill" (default) reserves empty tracks so column widths stay stable
   * (auto-fill). "fit" collapses empty tracks so a few items expand to fill
   * the row (auto-fit) — use it when the item count is small relative to the
   * container width, e.g. a full-screen gallery.
   */
  fill?: "fill" | "fit";
  className?: string;
  children: React.ReactNode;
}

const Grid: React.FC<GridProps> = ({
  minItemWidth = "220px",
  gap = "md",
  fill = "fill",
  className = "",
  children,
}) => {
  const gapClass = gap === "sm" ? styles.gapSm : gap === "lg" ? styles.gapLg : styles.gapMd;

  return (
    <div
      className={[styles.grid, fill === "fit" ? styles.fit : "", gapClass, className]
        .filter(Boolean)
        .join(" ")}
      style={{ "--grid-min-item": minItemWidth } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default Grid;
