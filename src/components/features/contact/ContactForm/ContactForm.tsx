"use client";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenNib,
  faCalendarAlt,
  faArrowLeft,
  faCheck,
  faPaperPlane,
  faEnvelope,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { EXTERNAL_LINKS } from "@/lib/constants/paths";
import "./ContactForm.css";
import { ModalProps } from "@/lib/types";
import { ModalFrame } from "@/components/features/modal";

// Declare Calendly for TypeScript
declare global {
  interface Window {
    Calendly: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

type ContactView = "choose" | "message" | "sent";

const viewVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -48 : 48 }),
};

const ContactForm = ({ onClose }: ModalProps) => {
  const [view, setView] = useState<ContactView>("choose");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const firstDoorRef = useRef<HTMLButtonElement>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
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
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Keep keyboard focus on a sensible target as views swap in/out — the
  // previously focused control unmounts, so focus would otherwise fall to body.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (view === "message") nameInputRef.current?.focus();
      else if (view === "sent") doneButtonRef.current?.focus();
      else firstDoorRef.current?.focus();
    }, 60);
    return () => window.clearTimeout(id);
  }, [view]);

  const goToView = (next: ContactView, dir: 1 | -1) => {
    setDirection(dir);
    setErrorMessage(null); // drop transient state so it can't resurface on return
    setView(next);
  };

  const handleCalendlyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: EXTERNAL_LINKS.CALENDLY });
    }
  };

  interface SendEmailEvent extends React.FormEvent<HTMLFormElement> {
    target: HTMLFormElement;
  }

  const sendEmail = (e: SendEmailEvent): void => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const form = e.target;

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        form,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
      )
      .then(() => {
        form.reset();
        goToView("sent", 1);
      })
      .catch(() =>
        setErrorMessage("Something went wrong — please try again, or reach out directly below.")
      )
      .finally(() => setIsSubmitting(false));
  };

  return (
    <ModalFrame
      onClose={onClose}
      title="Contact"
      size="sm"
      variant="light"
      titleId="contact-title"
      closeAriaLabel="Close contact modal"
    >
      <div className="contact-invite">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ── Intent chooser ─────────────────────────── */}
          {view === "choose" && (
            <motion.div
              key="choose"
              custom={direction}
              variants={viewVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="contact-stage"
            >
              <header className="contact-hero">
                <p className="contact-eyebrow">Let&apos;s connect</p>
                <h2 className="contact-headline">
                  Let&apos;s build something worth shipping.
                </h2>
                <p className="contact-subline">
                  Open to roles, collaborations, and good conversations. Pick a
                  door — I usually reply within a day.
                </p>
              </header>

              <div className="contact-doors" role="group" aria-label="Ways to reach me">
                <button
                  ref={firstDoorRef}
                  type="button"
                  className="contact-door"
                  onClick={() => goToView("message", 1)}
                >
                  <span className="door-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faPenNib} />
                  </span>
                  <span className="door-text">
                    <span className="door-title">Write a message</span>
                    <span className="door-sub">Drop me a note and I&apos;ll get back to you.</span>
                  </span>
                  <span className="door-arrow" aria-hidden="true">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </button>

                <button
                  type="button"
                  className="contact-door"
                  onClick={handleCalendlyClick}
                >
                  <span className="door-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </span>
                  <span className="door-text">
                    <span className="door-title">Book a 30-min chat</span>
                    <span className="door-sub">Grab a time that works — live over video.</span>
                  </span>
                  <span className="door-arrow" aria-hidden="true">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </button>
              </div>

              <div className="contact-quiet">
                <span className="contact-quiet-label">or find me on</span>
                <div className="contact-quiet-links">
                  <a
                    href={EXTERNAL_LINKS.LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quiet-link linkedin"
                  >
                    <FontAwesomeIcon icon={faLinkedinIn} aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                  <a href={EXTERNAL_LINKS.EMAIL} className="quiet-link email">
                    <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Message surface ────────────────────────── */}
          {view === "message" && (
            <motion.div
              key="message"
              custom={direction}
              variants={viewVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="contact-stage"
            >
              <button
                type="button"
                className="contact-back"
                onClick={() => goToView("choose", -1)}
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
                <span>Back</span>
              </button>

              <header className="contact-form-head">
                <h2 className="contact-headline sm">Send a message</h2>
                <p className="contact-subline">
                  A line or two is plenty — I&apos;ll take it from there.
                </p>
              </header>

              <form className="contact-form" onSubmit={sendEmail}>
                <div className="field">
                  <input
                    ref={nameInputRef}
                    type="text"
                    name="from_name"
                    id="from_name"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="from_name">Your name</label>
                </div>

                <div className="field">
                  <input
                    type="email"
                    name="reply_to"
                    id="reply_to"
                    placeholder=" "
                    required
                  />
                  <label htmlFor="reply_to">Your email</label>
                </div>

                <div className="field">
                  <textarea
                    name="message"
                    id="message"
                    placeholder=" "
                    rows={4}
                    required
                  />
                  <label htmlFor="message">Your message</label>
                </div>

                {errorMessage && (
                  <p className="contact-error" role="alert">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="contact-send"
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                >
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    aria-hidden="true"
                    className={isSubmitting ? "sending" : ""}
                  />
                  <span>{isSubmitting ? "Sending…" : "Send message"}</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* ── Sent confirmation ──────────────────────── */}
          {view === "sent" && (
            <motion.div
              key="sent"
              custom={direction}
              variants={viewVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="contact-stage contact-sent"
            >
              <motion.span
                className="sent-check"
                aria-hidden="true"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 320, damping: 18 }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </motion.span>
              <h2 className="contact-headline sm">Message sent</h2>
              <p className="contact-subline">
                Thanks for reaching out — I&apos;ll be in touch shortly.
              </p>
              <div className="sent-actions">
                <button type="button" className="contact-send ghost" onClick={() => goToView("choose", -1)}>
                  Send another
                </button>
                <button
                  ref={doneButtonRef}
                  type="button"
                  className="contact-send"
                  onClick={onClose}
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalFrame>
  );
};

export default ContactForm;
