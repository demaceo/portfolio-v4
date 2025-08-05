"use client";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { EXTERNAL_LINKS } from "@/lib/constants/paths";
import "./ContactForm.css";

interface ContactFormProps {
  onClose: () => void;
}

// Declare Calendly for TypeScript
declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const ContactForm = ({ onClose }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();

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
  }, []);

  const handleCalendlyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: EXTERNAL_LINKS.CALENDLY });
    }
  };

  type ShowMessageFn = (message: string) => void;

  const showMessage: ShowMessageFn = (message) => {
    setStateMessage(message);
    setTimeout(() => setStateMessage(null), 5000);
  };

  interface SendEmailEvent extends React.FormEvent<HTMLFormElement> {
    target: HTMLFormElement;
  }

  const sendEmail = (e: SendEmailEvent): void => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        e.target,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
      )
      .then(() => showMessage("Message sent!"))
      .catch(() => showMessage("Something went wrong, please try again later"))
      .finally(() => {
        setIsSubmitting(false);
        e.target.reset();
      });
  };

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div
        className="contact-form-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="email-form-wrapper">
          <div className="contact-title-bar">
            <div className="contact-window-controls">
              <button
                className="contact-close-btn"
                onClick={onClose}
                aria-label="Close Contact Form"
              ></button>
            </div>
            <span className="contact-window-title">Contact Me</span>
          </div>

          <form className="email-form" onSubmit={sendEmail}>
            <label htmlFor="from_name">Name</label>
            <input
              ref={nameInputRef}
              type="text"
              name="from_name"
              id="from_name"
              placeholder="Enter your name"
              required
            />

            <label htmlFor="reply_to">Email</label>
            <input
              type="email"
              name="reply_to"
              id="reply_to"
              placeholder="Enter your email"
              required
            />

            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              placeholder="Enter your message"
              required
            />

            <input
              id="submit-button"
              type="submit"
              value={isSubmitting ? "Sending..." : "Send"}
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            />
          </form>

          <p
            id="form-sent-status"
            aria-live="polite"
            role="status"
            style={{ minHeight: "1.5rem" }}
          >
            {stateMessage}
          </p>

          <div className="alternative-contact-methods">
            <div className="contact-divider">
              <span>or connect via</span>
            </div>

            <div className="alternative-buttons">
              <a
                href={EXTERNAL_LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="alternative-contact-btn linkedin-btn"
              >
                <i className="fab fa-linkedin-in"></i>
                LinkedIn
              </a>

              <button
                onClick={handleCalendlyClick}
                className="alternative-contact-btn calendly-btn"
              >
                <i className="fas fa-calendar-alt"></i>
                Schedule a Virtual Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
