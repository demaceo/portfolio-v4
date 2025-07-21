"use client";

import React, { useEffect, useState } from "react";
import "./PurpleHaze.scss";

const PurpleHazeError: React.FC = () => {
  const heroText = "Demaceo Vincent Developer Designer";
  const [cipherText, setCipherText] = useState(
    "Demaceo Vincent Developer Designer"
  );
  const [isRevealed, setIsRevealed] = useState(false);
  const words = cipherText.split(" ");

  useEffect(() => {
    const randomChar = () => {
      let rand = Math.floor(Math.random() * (122 - 33 + 1) + 33);
      if (
        (rand > 38 && rand < 48) ||
        (rand > 57 && rand < 63) ||
        (rand > 90 && rand < 97)
      ) {
        rand += 10;
      }
      return String.fromCharCode(rand);
    };

    if (!isRevealed) {
      let i = 0;
      const interval = setInterval(() => {
        setCipherText(() => {
          return (
            heroText.substring(0, i) +
            heroText.substring(i).replace(/[^\s]/g, randomChar)
          );
        });

        i++;
        if (i > cipherText.length) {
          clearInterval(interval);
          setIsRevealed(true);
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [cipherText.length, isRevealed]);

  return (
    <section className="haze-wrapper">
      <div className="purple-haze-container">
        <svg width="0" height="0">
          <filter id="blur-filter">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </svg>

        <div className="h">
          <h1 className={`haze-title ${isRevealed ? "revealed" : ""}`}>
            {words[0]}
          </h1>
          <h1 className={`haze-title title-2 ${isRevealed ? "revealed" : ""}`}>
            {words[1]}
          </h1>
          <h2 className={`haze-subtitle  ${isRevealed ? "revealed" : ""}`}>
            {words[2]} | {words[3]}
          </h2>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={`c-${i}-${Math.random().toString(36).slice(2, 11)}`} className="c"></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PurpleHazeError;
