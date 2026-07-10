import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Project } from "@/lib/types";
import {
  PROJECT_ICON_MAP,
  PROJECT_ICON_FALLBACK,
  isImageIcon,
  isGifSource,
} from "@/lib/constants/projectIcons";

interface ProjectMediaProps {
  project: Project;
  /** Applied to the <Image> when `project.icon` itself is the artwork (contain-fit). */
  iconImageClassName?: string;
  /** Applied to the <Image> when `project.image` is set (cover-fit, uses `fill`). */
  heroImageClassName?: string;
  /** Applied to the FontAwesome fallback wrapper when neither image is usable. */
  faIconClassName?: string;
  sizes?: string;
}

/**
 * Renders a project's visual: an image-as-icon, a full hero image, or a
 * FontAwesome fallback for legacy projects whose `icon` is a FA class string.
 * Shared between the gallery grid tiles and the project detail view.
 */
const ProjectMedia: React.FC<ProjectMediaProps> = ({
  project,
  iconImageClassName = "",
  heroImageClassName = "",
  faIconClassName = "",
  sizes = "(max-width: 640px) 100vw, 42vw",
}) => {
  const iconIsImage = isImageIcon(project.icon);
  const imageStr = typeof project.image === "string" ? project.image : undefined;

  if (iconIsImage && !imageStr) {
    return (
      <Image
        src={project.icon as string}
        alt={`${project.name} icon`}
        width={200}
        height={200}
        className={iconImageClassName}
        loading="lazy"
      />
    );
  }

  if (imageStr) {
    return (
      <Image
        src={imageStr}
        alt={project.name}
        fill
        className={heroImageClassName}
        loading="lazy"
        unoptimized={isGifSource(imageStr)}
        sizes={sizes}
      />
    );
  }

  return (
    <div className={faIconClassName} aria-hidden="true">
      <FontAwesomeIcon
        icon={PROJECT_ICON_MAP[project.icon as string] || PROJECT_ICON_FALLBACK}
        aria-hidden="true"
      />
    </div>
  );
};

export default ProjectMedia;
