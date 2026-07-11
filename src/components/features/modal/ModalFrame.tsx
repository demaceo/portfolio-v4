"use client";

import React, { useId } from "react";
import { ModalFrameProps, ModalSize } from "@/lib/types";
import ModalShell from "./ModalShell";
import styles from "./ModalFrame.module.css";

const sizeClassMap: Record<ModalSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
};

const ModalFrame: React.FC<ModalFrameProps> = ({
  onClose,
  title,
  size,
  children,
  headerActions,
  closeAriaLabel,
  titleId,
  variant = "noir",
}) => {
  const generatedId = useId().replace(/:/g, "");
  const resolvedTitleId = titleId ?? `modal-title-${generatedId}`;
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

        <h2 id={resolvedTitleId} className={styles.windowTitle}>
          {title}
        </h2>

        <div className={styles.headerActions}>
          {headerActions ?? <div className={styles.headerSpacer} aria-hidden="true" />}
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </ModalShell>
  );
};

export default ModalFrame;
