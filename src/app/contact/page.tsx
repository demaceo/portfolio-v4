"use client";

import ContactForm from "../components/ContactForm/ContactForm";
import NavBar from "../components/NavBar/NavBar";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="portfolio-container">
      <NavBar />
      <main
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <ContactForm onClose={handleClose} />
      </main>
    </div>
  );
}
