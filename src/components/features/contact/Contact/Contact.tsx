"use client";

import "./Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import ContactForm from "../ContactForm/ContactForm";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/dist/client/link";
import { EXTERNAL_LINKS } from "@/lib/constants/paths";

// Declare Calendly for TypeScript
declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export default function Contact() {
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    if (showContactForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Load Calendly script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    // Load Calendly CSS
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [showContactForm]);

  const handleCalendlyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: EXTERNAL_LINKS.CALENDLY });
    }
  };

  return (
    <>
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
      <motion.section
        className="contact-container"
        id="contact-jump"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="contact-title-container">
          <h2 id="contact">Contact</h2>
          <h3 id="contact-desc">Let&apos;s work together.</h3>
        </div>

        <div className="contact-info-container">
          <button
            className="popup-button"
            onClick={() => setShowContactForm(true)}
          >
            <i className="fa fa-envelope contact-icon"></i>
            <span className="contact-text">Email Me</span>
          </button>

          <Link
            href={EXTERNAL_LINKS.LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link"
          >
            <FontAwesomeIcon className="contact-icon" icon={faLinkedinIn} />
            <span className="contact-text">LinkedIn</span>
          </Link>

          <button
            className="popup-button calendly-contact-btn"
            onClick={handleCalendlyClick}
          >
            <i className="fas fa-calendar-alt contact-icon"></i>
            <span className="contact-text">Schedule a Chat</span>
          </button>
        </div>
      </motion.section>
    </>
  );
}
