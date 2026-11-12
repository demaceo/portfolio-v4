import type { Service, Project } from "@/lib/types";

export interface ToolUsageService {
  id: string;
  title: string;
}

export interface ToolUsageProject {
  id: number;
  name: string;
  link: string;
}

export interface ToolUsage {
  services: ToolUsageService[];
  projects: ToolUsageProject[];
}

/**
 * Cross-references toolbelt tool names against the "Tech & tools" tags on
 * each service and the stackPreview on each project, so a tapped tool node
 * can show where it's actually used instead of floating as decoration.
 * Matching is exact-string (e.g. "React" won't match "React Native") since
 * both source lists are hand-authored and already use consistent naming.
 */
export function buildToolUsageIndex(
  services: Service[],
  projects: Project[]
): Map<string, ToolUsage> {
  const index = new Map<string, ToolUsage>();

  const ensure = (tool: string): ToolUsage => {
    let entry = index.get(tool);
    if (!entry) {
      entry = { services: [], projects: [] };
      index.set(tool, entry);
    }
    return entry;
  };

  for (const service of services) {
    const tags = (service.panels ?? [])
      .filter((p) => p.kind === "tags")
      .flatMap((p) => p.points ?? []);
    for (const tag of tags) {
      ensure(tag).services.push({ id: service.id, title: service.title });
    }
  }

  for (const project of projects) {
    for (const tech of project.stackPreview ?? []) {
      ensure(tech).projects.push({ id: project.id, name: project.name, link: project.link });
    }
  }

  return index;
}

/**
 * Usage for one tool under its own name and every alias, de-duplicated (a
 * project listing both "Gemini API" and "Gemini Live API" counts once).
 */
export function usageForTool(
  index: Map<string, ToolUsage>,
  name: string,
  aliases: string[] = []
): ToolUsage {
  const services = new Map<string, ToolUsageService>();
  const projects = new Map<number, ToolUsageProject>();
  for (const key of [name, ...aliases]) {
    const entry = index.get(key);
    entry?.services.forEach((s) => services.set(s.id, s));
    entry?.projects.forEach((p) => projects.set(p.id, p));
  }
  return { services: [...services.values()], projects: [...projects.values()] };
}
