"use client";

import React, { useEffect } from "react";
import "./QuirkyPopup.css";

interface QuirkyPopupProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  type?: "file" | "edit" | "view" | "special";
  showRandomButton?: boolean;
  onRandomButtonClick?: () => void;
}

const QuirkyPopup: React.FC<QuirkyPopupProps> = ({
  isOpen,
  message,
  onClose,
  type = "file",
  showRandomButton = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRandomButtonClick,
}) => {
  useEffect(() => {
    if (isOpen && !showRandomButton) {
      // Only auto-close if not showing random button
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, showRandomButton]);

  if (!isOpen) return null;

  const getModalClass = () => {
    switch (type) {
      case "file":
        return "quirky-modal-file";
      case "edit":
        return "quirky-modal-edit";
      case "view":
        return "quirky-modal-view";
      case "special":
        return "quirky-modal-special";
      default:
        return "quirky-modal-file";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "file":
        return "📁";
      case "edit":
        return "✏️";
      case "view":
        return "�️";
      case "special":
        return "✨";
      default:
        return "💬";
    }
  };

  const getAriaLabel = () => {
    switch (type) {
      case "file":
        return "File menu notification";
      case "edit":
        return "Edit menu notification";
      case "view":
        return "View menu notification";
      case "special":
        return "Special effects notification";
      default:
        return "Notification";
    }
  };

  return (
    <div
      className="quirky-modal-overlay"
      onClick={showRandomButton ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      <div
        className={`quirky-modal ${getModalClass()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quirky-modal-header">
          <div className="modal-header-content">
            <span
              className="quirky-modal-icon"
              role="img"
              aria-label={getAriaLabel()}
            >
              {getIcon()}
            </span>
          </div>
          {!showRandomButton && (
            <button
              className="quirky-modal-close"
              onClick={onClose}
              aria-label="Close notification"
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <div className="quirky-modal-content">
          <p id="modal-message" className="quirky-modal-message">
            {message}
          </p>
          {showRandomButton && (
            <div className="and-then-hint">
              <p>Click the button below to continue the adventure...</p>
            </div>
          )}
        </div>
        {!showRandomButton && (
          <div className="quirky-modal-footer">
            <div
              className="quirky-modal-progress"
              role="progressbar"
              aria-label="Auto-close timer"
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuirkyPopup;
