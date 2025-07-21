"use client";

import "./ServiceSpectrum.css";
import { motion } from "framer-motion";
import services from "../../utilities/servicesData";
import { useState, useEffect } from "react";
import ContactForm from "../ContactForm/ContactForm";
import logoFelt from "../../../assets/logo/PORTFOLIO_LOGO.png";
import Image from "next/image";

const ServiceSpectrum = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showContactForm ? "hidden" : "auto";
  }, [showContactForm]);

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
              </div>
              <h3 className="service-title">{title}</h3>
              {isMobile && <p className="service-description">{description}</p>}
            </div>
            <div className="card-back">
              <h3 className="service-title">{title}</h3>
              <p className="service-description">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact card */}
      <div
        className="contact-logo-card"
        onClick={() => setShowContactForm(true)}
      >
        <div className="card-inner no-flip">
          <div className="card-front">
            <div className="illustration-container">
              <Image
                src={logoFelt}
                alt="Contact"
                loading="lazy"
                decoding="async"
                className="illustration"
                width={80}
                height={80}
              />
            </div>
            <h3 className="contact-title">Contact</h3>
          </div>
        </div>
      </div>

      {showContactForm && (
        <div
          className="contact-modal-overlay"
          onClick={() => setShowContactForm(false)}
        >
          <div
            className="contact-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <ContactForm onClose={() => setShowContactForm(false)} />
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default ServiceSpectrum;
