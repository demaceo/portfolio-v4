import {
  faBrain,
  faToolbox,
  faLaptopCode,
  faEnvelope,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

export interface DesktopApp {
  name: string;
  icon: IconDefinition;
  path: string;
  isToggle?: boolean;
  color: string;
}

// Shared by DesktopIcons (the curved wheel picker, desktop/tablet) and
// AppSwitcher (the mobile pill switcher, ≤480px) so both render from one
// source of truth.
export const DESKTOP_APPS: DesktopApp[] = [
  { name: "Mindset", icon: faBrain, path: "/mindset", color: "#8b7dfb" },
  { name: "Skillset", icon: faToolbox, path: "/skillset", color: "#f0ab1b" },
  { name: "Projects", icon: faLaptopCode, path: "/projects", color: "#2f9be0" },
  { name: "Contact", icon: faEnvelope, path: "/contact", isToggle: true, color: "#ef4a5f" },
];
