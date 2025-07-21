import ContactForm from "../components/ContactForm/ContactForm";
import NavBar from "../components/NavBar/NavBar";

export default function ContactPage() {
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
        <ContactForm onClose={() => window.history.back()} />
      </main>
    </div>
  );
}
