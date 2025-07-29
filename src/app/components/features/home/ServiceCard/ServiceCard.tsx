import React from "react";
import Image from "next/image";
import "./ServiceCard.css";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  onClose: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  onClose,
}) => {
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
            src={icon}
            alt={title}
            width={56}
            height={56}
            className="service-card-icon"
          />
          <h3 className="service-card-title">{title}</h3>
          <p className="service-card-description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
