"use client";

import React, { useRef } from "react";
import Chip from "../Chip/Chip";
import styles from "./FilterBar.module.css";

interface FilterTab {
  key: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  facets?: string[];
  activeFacets?: Set<string>;
  onFacetToggle?: (facet: string) => void;
  tabListLabel?: string;
  facetListLabel?: string;
  /** id of the panel these tabs control — enables aria-controls + stable tab
   *  ids (so the panel can be aria-labelledby the active tab). */
  panelId?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  facets,
  activeFacets,
  onFacetToggle,
  tabListLabel = "Filter categories",
  facetListLabel = "Filter by tag",
  panelId,
}) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  // WAI-ARIA tabs keyboard pattern: arrows/Home/End move selection + focus.
  const handleTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    if (next === null) return;
    event.preventDefault();
    onTabChange(tabs[next].key);
    tabListRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus();
  };

  return (
    <div className={styles.filterBar}>
      <div ref={tabListRef} className="glass-tab-list" role="tablist" aria-label={tabListLabel}>
        {tabs.map((tab, index) => {
          const selected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={panelId ? `${panelId}-tab-${tab.key}` : undefined}
              className={`glass-tab ${selected ? "active" : ""}`}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => onTabChange(tab.key)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {tab.label}
              {typeof tab.count === "number" ? ` (${tab.count})` : ""}
            </button>
          );
        })}
      </div>

      {facets && facets.length > 0 && onFacetToggle && (
        <div className="glass-chip-list" role="group" aria-label={facetListLabel}>
          {facets.map((facet) => (
            <Chip
              key={facet}
              active={activeFacets?.has(facet)}
              onClick={() => onFacetToggle(facet)}
            >
              {facet}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
