"use client";

import { useState } from "react";
import principlesData from "@/data/principles";
import "./PrinciplesList.css";

export default function PrinciplesList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleItem(index);
    }
  };

  return (
    <section className="principles-page">
      <div className="principle-main-title-container">
        <h2 className="principle-main-title shadowed-text">
          Principles & Strategies
        </h2>
      </div>

      <div className="accordion-container" role="presentation">
        {principlesData.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.id}>
              <div
                className="accordion-title"
                id={`accordion-header-${index}`}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${index}`}
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <span className="accordion-title-text">{item.title}</span>
                <span className="accordion-arrow">
                  <i
                    className={`fa fa-angle-down ${
                      isOpen ? "fa-rotate-180" : ""
                    }`}
                  ></i>
                </span>
              </div>
              <div
                id={`accordion-content-${index}`}
                className={`accordion-content ${
                  isOpen ? "accordion-content-open" : ""
                }`}
                role="region"
                aria-labelledby={`accordion-header-${index}`}
              >
                <p
                  className={`accordion-text ${
                    isOpen ? "accordion-text-open" : ""
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
