"use client";

import React, { useState, useEffect } from "react";
import "./RandomButton.css";

interface RandomButtonProps {
  isVisible: boolean;
  onButtonClick: () => void;
}

const RandomButton: React.FC<RandomButtonProps> = ({
  isVisible,
  onButtonClick,
}) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Generate random position when button becomes visible
      const randomX = Math.random() * 80 + 10; // 10% to 90% of screen width
      const randomY = Math.random() * 70 + 15; // 15% to 85% of screen height
      setPosition({ x: randomX, y: randomY });
      setClickCount(0);
    }
  }, [isVisible]);

  const handleClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount < 3) {
      // Move to a new random position for the first 2 clicks
      const randomX = Math.random() * 80 + 10;
      const randomY = Math.random() * 70 + 15;
      setPosition({ x: randomX, y: randomY });
    } else {
      // After 3 clicks, finally close the modal
      onButtonClick();
    }
  };

  if (!isVisible) return null;

  const getButtonText = () => {
    switch (clickCount) {
      case 0:
        return "No and then.";
      case 1:
        return "No and then!";
      case 2:
        return "NO AND THEN!";
      default:
        return "NO AND THEN!";
    }
  };

  return (
    <button
      className={`random-button random-button-click-${clickCount}`}
      style={{
        position: "fixed",
        left: `${position.x}%`,
        top: `${position.y}%`,
        zIndex: 10001,
      }}
      onClick={handleClick}
    >
      {getButtonText()}
    </button>
  );
};

export default RandomButton;
