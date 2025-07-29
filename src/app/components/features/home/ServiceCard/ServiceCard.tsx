import React, { useState, useRef } from "react";
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

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Mouse events for drag
  const handleDragStart = (e: React.MouseEvent) => {
    setDragging(true);
    const card = e.currentTarget.closest(".service-card") as HTMLElement;
    const rect = card.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.body.style.userSelect = "none";
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleDragEnd = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  // Touch events for drag (mobile support)
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    const card = e.currentTarget.closest(".service-card") as HTMLElement;
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    document.body.style.userSelect = "none";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragOffset.current.x,
      y: touch.clientY - dragOffset.current.y,
    });
  };

  const handleTouchEnd = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  return (
    <div
      className="service-card-overlay"
      onClick={onClose}
      style={{ cursor: dragging ? "grabbing" : undefined }}
    >
      <div
        className="service-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          zIndex: 3000,
          cursor: dragging ? "grabbing" : "default",
          transition: dragging ? "none" : "box-shadow 0.2s",
        }}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="service-card-title-bar"
          style={{ cursor: "grab" }}
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchStart}
        >
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
