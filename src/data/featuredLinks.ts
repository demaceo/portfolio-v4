import {
  faFilm,
  faMicrophoneLines,
  faPodcast,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

export const SXSW_URL = "https://schedule.sxswedu.com/2025/events/PP156313";
export const PODCAST_URL = "https://youtu.be/do5r6RZhJzc";

export interface FeaturedLink {
  key: string;
  /** Short name shown under the home-screen tile. */
  label: string;
  /** Longer, searchable name used in the ⌘K palette and as the tile's accessible name. */
  title: string;
  icon: IconDefinition;
  color: string;
  /** Passed to useAppActions' handleAppClick: "/documentary" opens the in-site
   *  player (the Roadtrip Nation / PBS episodes); an http(s) URL opens a new tab. */
  path: string;
}

// Shared by the home screen's Featured row and the ⌘K palette, so both list
// the same links from one place.
export const FEATURED_LINKS: FeaturedLink[] = [
  {
    key: "documentary",
    label: "Documentary",
    title: "Watch the Roadtrip Nation documentary",
    icon: faFilm,
    color: "#2f9be0",
    path: "/documentary",
  },
  {
    key: "sxsw",
    label: "SXSW Panel",
    title: "SXSW EDU 2025 panel",
    icon: faMicrophoneLines,
    color: "#f0ab1b",
    path: SXSW_URL,
  },
  {
    key: "podcast",
    label: "Podcast",
    title: "Moments That Define Us podcast episode",
    icon: faPodcast,
    color: "#ef4a5f",
    path: PODCAST_URL,
  },
];
