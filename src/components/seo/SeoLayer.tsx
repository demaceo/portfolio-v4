import Link from "next/link";
import { APP_ROUTES, type AppKey } from "@/lib/constants/appRoutes";
import { EXTERNAL_LINKS } from "@/lib/constants/paths";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/constants/site";
import { aboutMePills, profileHighlights } from "@/data/aboutMePills";
import principles from "@/data/principles";
import projects from "@/data/projects";
import services from "@/data/services";

/**
 * A plain-HTML mirror of what the page's overlays show, rendered on the server.
 *
 * The desktop is an interactive UI: its apps are overlays that only exist after JavaScript
 * runs and someone clicks, so the HTML a crawler (or a link-preview bot, or a reader with
 * scripts off) is given would otherwise be a title and a greeting, with no headings, no text
 * and no links. This layer gives every route a real `<h1>`, the actual copy, and crawlable
 * links, drawn from the same data modules the overlays render, so the two can't disagree.
 *
 * It is visually hidden (`.seo-layer`) and `inert`: it is not for people looking at the
 * screen, and `inert` keeps it out of the accessibility tree and the tab order, so screen
 * reader users get the live overlay rather than a second copy read out underneath it.
 */

const indexableRoutes = APP_ROUTES.filter((route) => route.indexable);

function SiteNav() {
  return (
    <nav aria-label="Portfolio sections">
      <ul>
        <li>
          <Link href="/" prefetch={false}>
            Home
          </Link>
        </li>
        {indexableRoutes.map((route) => (
          <li key={route.key}>
            <Link href={route.path} prefetch={false}>
              {route.title}
            </Link>
          </li>
        ))}
        <li>
          <a href={EXTERNAL_LINKS.GITHUB}>{SITE_NAME} on GitHub</a>
        </li>
        <li>
          <a href={EXTERNAL_LINKS.LINKEDIN}>{SITE_NAME} on LinkedIn</a>
        </li>
      </ul>
    </nav>
  );
}

function Home() {
  return (
    <>
      <h1>{SITE_TITLE}</h1>
      <p>{SITE_DESCRIPTION}</p>
      <p>
        Explore the desktop to see the work: About &amp; Mindset, Skills &amp; Services, and
        Projects, or get in touch.
      </p>
    </>
  );
}

function Mindset() {
  return (
    <>
      <h1>{`About ${SITE_NAME}`}</h1>
      <dl>
        {profileHighlights.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <h2>Strengths</h2>
      <ul>
        {aboutMePills.map((pill) => (
          <li key={pill.label}>
            <strong>{pill.label}.</strong> {pill.tooltip}
            {pill.link && (
              <>
                {" "}
                <a href={pill.link}>{pill.linkLabel ?? "Open link"}</a>
              </>
            )}
          </li>
        ))}
      </ul>
      <h2>Principles</h2>
      <ul>
        {principles.map((principle) => (
          <li key={principle.id}>
            <strong>{principle.title}</strong> {principle.description}
          </li>
        ))}
      </ul>
    </>
  );
}

function Skillset() {
  return (
    <>
      <h1>Skills &amp; Services</h1>
      {services.map((service) => (
        <article key={service.id}>
          <h2>{service.title}</h2>
          <p>{service.description}</p>
          {service.outcome && <p>{service.outcome}</p>}
        </article>
      ))}
    </>
  );
}

function Projects() {
  return (
    <>
      <h1>Projects</h1>
      {projects.map((project) => (
        <article key={project.id}>
          <h2>
            <a href={project.link}>{project.name}</a>
          </h2>
          {project.yearRange && <p>{project.yearRange}</p>}
          <p>{project.description}</p>
          {project.highlights && (
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          )}
          {project.stackPreview && <p>Stack: {project.stackPreview.join(", ")}</p>}
        </article>
      ))}
    </>
  );
}

// Scrapbook is deliberately absent: it is photos and captions with nothing to summarise, so
// its route is `noindex` and shows only the shared navigation.
const CONTENT: Partial<Record<AppKey, () => React.JSX.Element>> = {
  mindset: Mindset,
  skillset: Skillset,
  projects: Projects,
};

export default function SeoLayer({ app }: { app: AppKey | null }) {
  const Content = app ? CONTENT[app] : Home;
  return (
    <main className="seo-layer" inert>
      {Content && <Content />}
      <SiteNav />
    </main>
  );
}
