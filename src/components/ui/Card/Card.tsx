"use client";

import React from "react";
import styles from "./Card.module.css";

interface CardBaseProps {
  variant?: "glass" | "flat";
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface CardAsDiv extends CardBaseProps {
  as?: "div";
  href?: undefined;
  onClick?: () => void;
}

interface CardAsButton extends CardBaseProps {
  as: "button";
  href?: undefined;
  onClick?: () => void;
}

interface CardAsAnchor extends CardBaseProps {
  as: "a";
  href: string;
  onClick?: () => void;
}

export type CardProps = CardAsDiv | CardAsButton | CardAsAnchor;

const Card: React.FC<CardProps> = ({
  as = "div",
  href,
  onClick,
  variant = "glass",
  interactive = false,
  className = "",
  children,
}) => {
  const classes = [
    styles.card,
    variant === "flat" ? styles.flat : styles.glass,
    interactive ? styles.interactive : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (as === "button") {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {children}
      </button>
    );
  }

  if (as === "a") {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
