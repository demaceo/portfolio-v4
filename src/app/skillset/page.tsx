import Toolbelt from "../components/Toolbelt/Toolbelt";
import ServiceSpectrum from "../components/ServiceSpectrum/ServiceSpectrum";
import Link from "next/link";

export default function SkillsetPage() {
  return (
    <main>
      <nav style={{ padding: "1rem", background: "#f5f5f5" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#007acc" }}>
          ← Back to Home
        </Link>
      </nav>
      <Toolbelt />
      <ServiceSpectrum />
    </main>
  );
}
