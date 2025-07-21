"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ContactForm from "../ContactForm/ContactForm";
import logo from "../../../assets/logo/PORTFOLIO_LOGO.png";
import "./FloatingContactButton.css";

const FloatingContactButton: React.FC = () => {
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    if (showContactForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showContactForm]);

  const handleOpenContact = () => {
    setShowContactForm(true);
  };

  const handleCloseContact = () => {
    setShowContactForm(false);
  };

  return (
    <>
      <button
        className="floating-contact-button"
        onClick={handleOpenContact}
        aria-label="Open Contact Form"
        title="Contact Me"
      >
        <Image
          src={logo}
          alt="Contact"
          width={60}
          height={60}
          className="floating-logo"
        />
        <span className="floating-contact-text">Contact</span>
      </button>

      {showContactForm && (
        <div
          className="floating-contact-modal-overlay"
          onClick={handleCloseContact}
        >
          <div
            className="floating-contact-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <ContactForm onClose={handleCloseContact} />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingContactButton;
