import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import projectData from "../../utilities/projectData";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectId = parseInt(params.id);
  const project = projectData.find((p) => p.id === projectId);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <nav style={{ padding: "1rem", background: "#f5f5f5" }}>
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#007acc",
            marginRight: "1rem",
          }}
        >
          ← Back to Home
        </Link>
        <Link
          href="/projects"
          style={{ textDecoration: "none", color: "#007acc" }}
        >
          ← Back to Projects
        </Link>
      </nav>
      <div className="project-detail" style={{ padding: "2rem" }}>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        {project.image && (
          <Image
            src={project.image}
            alt={project.name}
            width={500}
            height={300}
            className="project-image"
          />
        )}
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            View Project
          </a>
        )}
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return projectData.map((project) => ({
    id: project.id.toString(),
  }));
}
