"use client";

import React, { useId } from "react";
import { ModalFrameProps, ModalSize } from "@/lib/types";
import { useMediaQuery, SHEET_MEDIA_QUERY } from "@/hooks";
import ModalShell from "./ModalShell";
import styles from "./ModalFrame.module.css";
import glass from "./GlassFrame.module.css";

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

const ModalFrame: React.FC<ModalFrameProps> = ({
  onClose,
  title,
  size,
  children,
  headerActions,
  closeAriaLabel,
  titleId,
  variant = "noir",
  presentation = "window",
  eyebrow,
}) => {
  const generatedId = useId().replace(/:/g, "");
  const resolvedTitleId = titleId ?? `modal-title-${generatedId}`;
  const isPhone = useMediaQuery(SHEET_MEDIA_QUERY);

  /* ---------------------------------------------------------------------
     Glass: premium overlay chrome. No macOS title bar — a grab handle (sheets
     only), an optional eyebrow, header actions and a round close button. The
     visible heading lives in the content (each consumer renders its own
     <h2>), so the dialog's accessible name comes from a visually-hidden
     element carrying `titleId` — one id, never duplicated by consumers.
     --------------------------------------------------------------------- */
  if (variant === "glass") {
    const asSheet = presentation === "sheet" || isPhone;
    return (
      <ModalShell
        onClose={onClose}
        titleId={resolvedTitleId}
        motionPreset={asSheet ? "sheet" : "pop"}
        overlayClassName={`${glass.overlay} ${asSheet ? glass.overlaySheet : ""}`}
        dialogClassName={[
          glass.frame,
          sizeClassMap[size],
          asSheet ? glass.sheet : glass.window,
          presentation === "sheet" ? glass.fill : "",
        ].join(" ")}
      >
        {asSheet && (
          <div className={glass.handleRow} aria-hidden="true">
            <span className={glass.handle} />
          </div>
        )}
        <div className={glass.header}>
          <span id={resolvedTitleId} className={glass.srOnly}>
            {title}
          </span>
          {eyebrow ? (
            <span className={glass.eyebrow} aria-hidden="true">
              {eyebrow}
            </span>
          ) : (
            <span />
          )}
          <div className={glass.headerActions}>
            {headerActions}
            <button
              type="button"
              className={glass.close}
              onClick={onClose}
              aria-label={closeAriaLabel ?? "Close"}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className={glass.content}>{children}</div>
      </ModalShell>
    );
  }

  const variantClass = variant === "light" ? styles.light : "";

  return (
    <ModalShell
      onClose={onClose}
      titleId={resolvedTitleId}
      overlayClassName={`${styles.overlay} ${variantClass}`}
      dialogClassName={`${styles.frame} ${sizeClassMap[size]} ${variantClass}`}
    >
      <div className={styles.titleBar}>
        <div className={styles.windowControls}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={closeAriaLabel ?? "Close modal"}
          />
        </div>

        <span id={resolvedTitleId} className={styles.windowTitle}>
          {title}
        </span>

        <div className={styles.headerActions}>
          {headerActions ?? <div className={styles.headerSpacer} aria-hidden="true" />}
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </ModalShell>
  );
};

export default ModalFrame;
