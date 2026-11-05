"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  type IconDefinition,
  faEnvelope,
  faFileLines,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { ModalShell } from "@/components/features/modal";
import { useProjects, useMediaQuery, useShortcutLabel, SHEET_MEDIA_QUERY } from "@/hooks";
import ProjectMedia from "@/components/features/portfolio/shared/ProjectMedia";
import type { Project } from "@/lib/types";
import styles from "./CommandPalette.module.css";

export interface CommandPaletteProps {
  onClose: () => void;
  onOpenProject: (id: number) => void;
  onOpenContact: () => void;
  onOpenResume: () => void;
}

type PaletteItem =
  | { kind: "project"; key: string; label: string; meta: string; project: Project; run: () => void }
  | { kind: "action"; key: string; label: string; icon: IconDefinition; run: () => void };

/** Lowercase and strip diacritics, so "resume" matches "résumé". */
const fold = (value: string) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const matches = (foldedQuery: string, ...fields: (string | undefined)[]) =>
  fields.some((f) => f !== undefined && fold(f).includes(foldedQuery));

/** Project artwork in a fixed tile, via the shared ProjectMedia (icon → hero
 *  image → FontAwesome fallback). Icons are contain-fit so tall art such as
 *  Pinpoint's pin is never cropped. */
const ProjectThumb: React.FC<{ project: Project }> = ({ project }) => (
  <span className={styles.thumb}>
    <ProjectMedia
      project={project}
      decorative
      sizes="34px"
      iconImageClassName={styles.thumbImg}
      heroImageClassName={styles.thumbCover}
      faIconClassName={styles.thumbFa}
    />
  </span>
);

/**
 * ⌘K command palette: search + jump to any active project, plus quick
 * actions. Combobox/listbox pattern — focus stays in the input while ↑/↓ move
 * aria-activedescendant through the options; Enter runs the active one.
 * Focus trap, Esc, scroll lock and focus return come from ModalShell.
 */
const CommandPalette: React.FC<CommandPaletteProps> = ({
  onClose,
  onOpenProject,
  onOpenContact,
  onOpenResume,
}) => {
  const { activeProjects } = useProjects();
  const isPhone = useMediaQuery(SHEET_MEDIA_QUERY);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const shortcut = useShortcutLabel("k");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const { projectItems, actionItems } = useMemo(() => {
    const q = fold(query.trim());
    const projectItems: PaletteItem[] = activeProjects
      .filter((p) => !q || matches(q, p.name, p.description, ...(p.stackPreview ?? [])))
      .map((p) => ({
        kind: "project",
        key: `project-${p.id}`,
        label: p.name,
        meta: p.description,
        project: p,
        run: () => onOpenProject(p.id),
      }));
    const actionItems: PaletteItem[] = (
      [
        { kind: "action", key: "action-contact", label: "Start a conversation", icon: faEnvelope, run: onOpenContact },
        { kind: "action", key: "action-resume", label: "View résumé", icon: faFileLines, run: onOpenResume },
      ] as const
    ).filter((a) => !q || matches(q, a.label));
    return { projectItems, actionItems };
  }, [query, activeProjects, onOpenProject, onOpenContact, onOpenResume]);

  const items = useMemo(() => [...projectItems, ...actionItems], [projectItems, actionItems]);
  const clampedIndex = Math.min(activeIndex, Math.max(items.length - 1, 0));
  const optionId = (i: number) => `${listboxId}-opt-${i}`;

  // Keep the keyboard-active option visible inside the scrolling list.
  useEffect(() => {
    document.getElementById(optionId(clampedIndex))?.scrollIntoView({ block: "nearest" });
    // optionId is derived from the stable listboxId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clampedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (items.length === 0) return;
    // An IME (Japanese, Chinese, Korean…) uses Enter/arrows to pick a
    // candidate; those keys belong to the composition, not the list.
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((clampedIndex + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((clampedIndex - 1 + items.length) % items.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(items.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      items[clampedIndex]?.run();
    }
  };

  const renderOption = (item: PaletteItem, index: number) => {
    const active = index === clampedIndex;
    return (
      <div
        key={item.key}
        id={optionId(index)}
        role="option"
        aria-selected={active}
        className={`${styles.option} ${active ? styles.optionActive : ""}`}
        onMouseMove={() => !active && setActiveIndex(index)}
        // mousedown (not click) + preventDefault keeps focus in the input.
        onMouseDown={(e) => e.preventDefault()}
        onClick={item.run}
      >
        {item.kind === "project" ? (
          <>
            <ProjectThumb project={item.project} />
            <span className={styles.optionLabel}>{item.label}</span>
            <span className={styles.optionMeta}>{item.meta}</span>
            {item.project.yearRange && (
              <span className={styles.tag}>{item.project.yearRange.split("-")[0]}</span>
            )}
          </>
        ) : (
          <>
            <span className={`${styles.thumb} ${styles.actionThumb}`}>
              <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
            </span>
            <span className={styles.optionLabel}>{item.label}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <ModalShell
      onClose={onClose}
      ariaLabel="Search projects and actions"
      motionPreset={isPhone ? "sheet" : "pop"}
      initialFocusRef={inputRef}
      overlayClassName={styles.overlay}
      dialogClassName={styles.palette}
    >
      {isPhone && (
        <div className={styles.handleRow} aria-hidden="true">
          <span className={styles.handle} />
        </div>
      )}
      <div className={styles.searchRow}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listboxId}
          aria-activedescendant={items.length ? optionId(clampedIndex) : undefined}
          aria-autocomplete="list"
          aria-label="Search projects and actions"
          placeholder="Search projects, actions…"
          className={styles.input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        {isPhone ? (
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
        ) : (
          <kbd className={styles.kbd}>esc</kbd>
        )}
      </div>

      <div className={styles.results}>
        <div id={listboxId} role="listbox" aria-label="Results" className={styles.listbox}>
          {projectItems.length > 0 && (
            <div role="group" aria-labelledby={`${listboxId}-projects`}>
              <div id={`${listboxId}-projects`} className={styles.groupLabel}>
                Projects
              </div>
              {projectItems.map((item, i) => renderOption(item, i))}
            </div>
          )}
          {actionItems.length > 0 && (
            <div role="group" aria-labelledby={`${listboxId}-actions`}>
              <div id={`${listboxId}-actions`} className={styles.groupLabel}>
                Actions
              </div>
              {actionItems.map((item, i) => renderOption(item, projectItems.length + i))}
            </div>
          )}
        </div>
        {items.length === 0 && (
          <p className={styles.empty} role="status">
            No results for “{query}”
          </p>
        )}
      </div>

      <div className={styles.footer} aria-hidden="true">
        <span>↑↓ to navigate</span>
        <span>↵ to open</span>
        <span className={styles.footerEnd}>{shortcut.label} from anywhere</span>
      </div>
    </ModalShell>
  );
};

export default CommandPalette;
