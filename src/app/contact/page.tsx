import Contact from "../components/Contact/Contact";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main>
      <nav style={{ padding: "1rem", background: "#f5f5f5" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#007acc" }}>
          ← Back to Home
        </Link>
      </nav>
      <Contact />
    </main>
  );
}
