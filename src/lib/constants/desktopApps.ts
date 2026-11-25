import {
  faBrain,
  faToolbox,
  faLaptopCode,
  faEnvelope,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { APP_PATHS } from "@/lib/constants/appRoutes";

export interface DesktopApp {
  name: string;
  icon: IconDefinition;
  path: string;
  isToggle?: boolean;
  color: string;
}

// The apps listed in AppSwitcher (the dock shown wherever the MenuBar is hidden).
export const DESKTOP_APPS: DesktopApp[] = [
  { name: "Mindset", icon: faBrain, path: APP_PATHS.mindset, color: "#8b7dfb" },
  { name: "Skillset", icon: faToolbox, path: APP_PATHS.skillset, color: "#f0ab1b" },
  { name: "Projects", icon: faLaptopCode, path: APP_PATHS.projects, color: "#2f9be0" },
  { name: "Contact", icon: faEnvelope, path: "/contact", isToggle: true, color: "#ef4a5f" },
];
