import ProjectGallery from "../components/ProjectGallery/ProjectGallery";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main>
      <nav style={{ padding: "1rem", background: "#f5f5f5" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#007acc" }}>
          ← Back to Home
        </Link>
      </nav>
      <ProjectGallery />
    </main>
  );
}
