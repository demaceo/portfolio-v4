"use client";

import React, { useId } from "react";
import { ModalFrameProps, ModalSize } from "@/lib/types";
import { useMediaQuery, SHEET_MEDIA_QUERY } from "@/hooks";
import ModalShell from "./ModalShell";
import styles from "./ModalFrame.module.css";

const sizeClassMap: Record<ModalSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
};

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

/**
 * Glass modal shell shared by every floating overlay. No macOS title bar: a
 * grab handle (sheets only), an eyebrow line (defaults to `title`), header
 * actions and a round close button. The dialog's accessible name comes from a
 * visually-hidden element carrying `titleId` — one id, never duplicated by
 * consumers, who render their own visible <h2> where they want one.
 *
 * `glass-scope` (globals.css) re-points the legacy --noir-/--lg- tokens at the
 * --gl- palette, so content styled with those tokens follows Glass light/dark.
 */
const ModalFrame: React.FC<ModalFrameProps> = ({
  onClose,
  title,
  size,
  children,
  headerActions,
  closeAriaLabel,
  titleId,
  presentation = "window",
  eyebrow,
}) => {
  const generatedId = useId().replace(/:/g, "");
  const resolvedTitleId = titleId ?? `modal-title-${generatedId}`;
  const isPhone = useMediaQuery(SHEET_MEDIA_QUERY);
  const asSheet = presentation === "sheet" || isPhone;

  return (
    <ModalShell
      onClose={onClose}
      titleId={resolvedTitleId}
      motionPreset={asSheet ? "sheet" : "pop"}
      overlayClassName={`${styles.overlay} ${asSheet ? styles.overlaySheet : ""}`}
      dialogClassName={[
        "glass-scope",
        styles.frame,
        sizeClassMap[size],
        asSheet ? styles.sheet : styles.window,
        presentation === "sheet" ? styles.fill : "",
      ].join(" ")}
    >
      {asSheet && (
        <div className={styles.handleRow} aria-hidden="true">
          <span className={styles.handle} />
        </div>
      )}
      <div className={styles.header}>
        <span id={resolvedTitleId} className={styles.srOnly}>
          {title}
        </span>
        <span className={styles.eyebrow} aria-hidden="true">
          {eyebrow ?? title}
        </span>
        <div className={styles.headerActions}>
          {headerActions}
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={closeAriaLabel ?? "Close"}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </ModalShell>
  );
};

export default ModalFrame;
