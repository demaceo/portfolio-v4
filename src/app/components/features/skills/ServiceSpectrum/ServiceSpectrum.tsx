"use client";

import "./ServiceSpectrum.css";
import { motion } from "framer-motion";
import services from "@/data/services";
import { useState, useEffect } from "react";
import Image from "next/image";

const ServiceSpectrum = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCardToggle = (index: number): void =>
    setFlippedIndex((prev: number | null) => (prev === index ? null : index));

  return (
    <motion.section
      className="services-page"
      id="services-slide"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="service-main-title-container">
        <h2 className="service-main-title shadowed-text">Service Spectrum</h2>
      </div>

      <div className="service-boxes-container">
        {services.map(({ id, title, description, icon }, i) => (
          <div
            key={id}
            className={`service-box ${flippedIndex === i ? "is-flipped" : ""}`}
            onMouseEnter={() => !isMobile && handleCardToggle(i)}
            onMouseLeave={() => !isMobile && handleCardToggle(i)}
            onClick={() => isMobile && handleCardToggle(i)}
          >
            <div className="card-inner">
              <div className="card-front">
                <Image
                  src={icon}
                  alt={title}
                  className="illustration"
                  loading="lazy"
                  decoding="async"
                  width={80}
                  height={80}
                />
                <h3 className="service-title">{title}</h3>
                {isMobile && (
                  <p className="service-description">{description}</p>
                )}
              </div>
              <div className="card-back">
                <h3 className="service-title">{title}</h3>
                <p className="service-description">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default ServiceSpectrum;
