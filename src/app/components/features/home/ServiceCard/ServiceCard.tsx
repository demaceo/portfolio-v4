import React, { useState } from "react";
import Image from "next/image";
import "./ServiceCard.css";
import services from "@/data/services";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  onClose: () => void;
  initialIndex?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  description,
  onClose,
  initialIndex,
}) => {
  const findInitialIndex = () => {
    if (typeof initialIndex === "number") return initialIndex;
    const idx = services.findIndex((s) => s.icon === icon && s.title === title);
    return idx !== -1 ? idx : 0;
  };

  const [currentIndex, setCurrentIndex] = useState(findInitialIndex());

  const service = services[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="service-card-overlay" onClick={onClose}>
      <div className="service-card" onClick={(e) => e.stopPropagation()}>
        <div className="service-card-title-bar">
          <div className="service-card-window-controls">
            <button
              className="service-card-close-btn"
              onClick={onClose}
              aria-label="Close Service Card"
            />
          </div>
          <span className="service-card-window-title">Services</span>
        </div>
        <div className="service-card-inner">
          <Image
            src={service.icon}
            alt={service.title}
            width={56}
            height={56}
            className="service-card-icon"
          />
          <h3 className="service-card-title">{service.title}</h3>
          <p className="service-card-description">{service.description}</p>
          <div className="service-card-bottom-arrows">
            <button
              className="service-card-arrow service-card-arrow-bottom service-card-arrow-left"
              onClick={handlePrev}
              aria-label="Previous Service"
              tabIndex={0}
              type="button"
            >
              &#8592;
            </button>
            <button
              className="service-card-arrow service-card-arrow-bottom service-card-arrow-right"
              onClick={handleNext}
              aria-label="Next Service"
              tabIndex={0}
              type="button"
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
