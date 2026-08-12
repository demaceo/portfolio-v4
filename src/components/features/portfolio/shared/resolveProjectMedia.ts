import { Project } from "@/lib/types";
import { isImageIcon } from "@/lib/constants/projectIcons";

export interface ResolvedProjectMedia {
  src: string | null;
  fit: "cover" | "contain";
}

/**
 * Mirrors ProjectMedia's own source-picking order (hero image string, then
 * an image-path icon, then neither) so a CSS-background carousel can show
 * the same artwork as the rest of the app without rendering a component.
 * A hero image is a photo/gif meant to fill its frame (`cover`); an icon is
 * a logo mark that needs breathing room around it (`contain`).
 */
export function resolveProjectMedia(project: Project): ResolvedProjectMedia {
  const imageStr = typeof project.image === "string" ? project.image : undefined;
  const iconIsImage = isImageIcon(project.icon);

  if (iconIsImage && !imageStr) {
    return { src: project.icon as string, fit: "contain" };
  }
  if (imageStr) {
    return { src: imageStr, fit: "cover" };
  }
  return { src: null, fit: "contain" };
}
