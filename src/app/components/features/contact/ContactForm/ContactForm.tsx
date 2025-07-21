"use client";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import "./ContactForm.css";

interface ContactFormProps {
  onClose: () => void;
}

const ContactForm = ({ onClose }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

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
        process.env.REACT_APP_SERVICE_ID as string,
        process.env.REACT_APP_TEMPLATE_ID as string,
        e.target,
        process.env.REACT_APP_PUBLIC_KEY as string
      )
      .then(() => showMessage("Message sent!"))
      .catch(() => showMessage("Something went wrong, please try again later"))
      .finally(() => {
        setIsSubmitting(false);
        e.target.reset();
      });
  };

  return (
    <div className="contact-form-container">
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
      </div>
    </div>
  );
};

export default ContactForm;
