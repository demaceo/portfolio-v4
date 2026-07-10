import {
  faBriefcase,
  faPaw,
  faTheaterMasks,
  faRobot,
  faMusic,
  faCookieBite,
  faFilm,
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";

// Legacy projects (pre-2025) store their icon as a FontAwesome class string
// (e.g. "fas fa-briefcase icon") instead of an image path. This maps those
// legacy strings to the actual icon definitions.
export const PROJECT_ICON_MAP: Record<string, typeof faBriefcase> = {
  "fas fa-briefcase icon": faBriefcase,
  "fa fa-paw icon": faPaw,
  "fas fa-theater-masks icon": faTheaterMasks,
  "fas fa-robot icon": faRobot,
  "fas fa-music icon": faMusic,
  "fas fa-cookie-bite icon": faCookieBite,
  "fas fa-film icon": faFilm,
};

// Shared fallback for any project whose `icon` doesn't match a mapped
// FontAwesome string and isn't an image path — matches the Projects desktop
// icon (DesktopIcons.tsx) so the fallback stays visually consistent.
export const PROJECT_ICON_FALLBACK = faLaptopCode;

export const isImageIcon = (icon?: string): boolean => {
  if (!icon) return false;
  return (
    (icon.startsWith("/") || icon.startsWith("http")) &&
    /\.(png|jpe?g|webp|svg)$/i.test(icon)
  );
};

export const isGifSource = (source?: string): boolean => {
  if (!source) return false;
  return /\.gif($|\?)/i.test(source);
};
