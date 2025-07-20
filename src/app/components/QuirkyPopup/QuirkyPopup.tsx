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
        return "🙃";
      case "special":
        return "✨";
      default:
        return "💬";
    }
  };

  return (
    <div
      className="quirky-modal-overlay"
      onClick={showRandomButton ? undefined : onClose}
    >
      <div
        className={`quirky-modal ${getModalClass()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quirky-modal-header">
          <span className="quirky-modal-icon">{getIcon()}</span>
          {!showRandomButton && (
            <button className="quirky-modal-close" onClick={onClose}>
              ×
            </button>
          )}
        </div>
        <div className="quirky-modal-content">
          <p className="quirky-modal-message">{message}</p>
          {showRandomButton && (
            <div className="and-then-hint">
              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  fontStyle: "italic",
                  marginTop: "10px",
                }}
              ></p>
            </div>
          )}
        </div>
        {!showRandomButton && (
          <div className="quirky-modal-footer">
            <div className="quirky-modal-progress"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuirkyPopup;
