import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Layout from "../../components/Layout/Layout";
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
    <Layout>
      <div
        style={{ padding: "1rem", background: "#f5f5f5", marginBottom: "2rem" }}
      >
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
      </div>
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
    </Layout>
  );
}

export async function generateStaticParams() {
  return projectData.map((project) => ({
    id: project.id.toString(),
  }));
}
