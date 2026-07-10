"use client";

import React from "react";
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
}) => {
  return (
    <div className={styles.filterBar}>
      <div className="glass-tab-list" role="tablist" aria-label={tabListLabel}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            className={`glass-tab ${activeTab === tab.key ? "active" : ""}`}
            aria-selected={activeTab === tab.key}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
            {typeof tab.count === "number" ? ` (${tab.count})` : ""}
          </button>
        ))}
      </div>

      {facets && facets.length > 0 && onFacetToggle && (
        <div className="glass-chip-list" aria-label={facetListLabel}>
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
