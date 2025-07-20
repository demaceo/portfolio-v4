import "./Contact.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import ContactForm from "../ContactForm/ContactForm";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Contact() {
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    if (showContactForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showContactForm]);

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
            to="https://www.linkedin.com/in/demaceo/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link"
          >
            <FontAwesomeIcon className="contact-icon" icon={faLinkedinIn} />
            <span className="contact-text">LinkedIn</span>
          </Link>
        </div>
      </motion.section>
    </>
  );
}
