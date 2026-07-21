/**
 * Scrapbook — the personal-side content that powers the desktop "Scrapbook"
 * app (a horizontal flow map of photos, accomplishments, interests, hobbies,
 * books, and memories).
 *
 * HOW TO EDIT (this is the only file you need to touch for content):
 *   • Add / remove / reorder entries in `scrapbookItems` below. The flow map
 *     lays itself out automatically — positions, connector lines, and the
 *     canvas width all derive from the array, so there are no coordinates to
 *     hand-tune (see ./ScrapbookAppView/flowLayout.ts for the geometry).
 *   • `category` drives each card's chip color + emoji + label via
 *     CATEGORY_META — no per-item styling needed.
 *   • `image` is optional. Drop real photos into `public/scrapbook/` and point
 *     to them, e.g. image: "/scrapbook/graduation.jpg". If an image is missing
 *     or fails to load, the card falls back to a tasteful category-tinted
 *     gradient, so entries look intentional even before you add photos.
 *   • The seeded entries below are PLACEHOLDERS (with picsum.photos stand-in
 *     images) — replace their text and images with your real content.
 */

export type ScrapbookCategory =
  | "photo"
  | "accomplishment"
  | "interest"
  | "hobby"
  | "book"
  | "memory";

export interface ScrapbookItem {
  /** Stable unique key (used by React and for accessibility labels). */
  id: string;
  category: ScrapbookCategory;
  title: string;
  /** One or two short lines shown in the card's bottom panel. */
  blurb: string;
  /** Optional image URL — local `/scrapbook/*.jpg` preferred. Gradient
   *  fallback renders when absent or on load error. */
  image?: string;
  /** Optional free-form date/era, e.g. "2019" or "Aug 2023". */
  date?: string;
}

/**
 * Per-category presentation: the chip label, an accent color, and an emoji.
 * Colors are reused as the card's gradient-fallback tint, so every category
 * reads distinctly even without a photo.
 */
export const CATEGORY_META: Record<
  ScrapbookCategory,
  { label: string; color: string; icon: string }
> = {
  photo: { label: "Photo", color: "#3ec9a7", icon: "📷" },
  accomplishment: { label: "Accomplishment", color: "#f0ab1b", icon: "🏆" },
  interest: { label: "Interest", color: "#8b7dfb", icon: "✨" },
  hobby: { label: "Hobby", color: "#2f9be0", icon: "🎨" },
  book: { label: "Book", color: "#e0709a", icon: "📖" },
  memory: { label: "Memory", color: "#d4845a", icon: "🕰️" },
};

/**
 * Placeholder content — edit freely. Entries render left-to-right in array
 * order along the flow map, so this doubles as the display order.
 */
export const scrapbookItems: ScrapbookItem[] = [
  {
    id: "origin",
    category: "memory",
    title: "The Origin Story",
    blurb: "Born in Chicago — the first stop on a long, winding map.",
    image: "https://picsum.photos/seed/scrapbook-origin/500/400",
    date: "Chapter One",
  },
  {
    id: "biology-degree",
    category: "accomplishment",
    title: "B.S. in Biology",
    blurb: "Cornell College — where curiosity about living systems took root.",
    image: "https://picsum.photos/seed/scrapbook-biology/500/400",
    date: "Cornell College",
  },
  {
    id: "scuba",
    category: "hobby",
    title: "Scuba Diving",
    blurb: "Certified Dive Master — most at peace 120 feet under, weightless and quiet.",
    image: "/scrapbook/scuba-doodz.jpg",
    date: "Ongoing",
  },
  {
    id: "conservation",
    category: "interest",
    title: "Conservation & the Sea",
    blurb: "Fieldwork with reefs and wildlife — tech in service of the planet.",
    image: "/scrapbook/coral-dive.jpg",
  },
  {
    id: "roadtrip",
    category: "memory",
    title: "Cross-Country Road Trip",
    blurb: "Thousands of miles, a full playlist, and a reset on what mattered.",
    image: "https://picsum.photos/seed/scrapbook-roadtrip/500/400",
  },
  {
    id: "turing",
    category: "accomplishment",
    title: "Turing School",
    blurb: "Front-end engineering + UI/UX — the pivot into building software.",
    image: "https://picsum.photos/seed/scrapbook-turing/500/400",
    date: "Bootcamp",
  },
  {
    id: "favorite-book",
    category: "book",
    title: "A Book That Stuck",
    blurb: "Sapiens by Yuval Noah Harari — a lens for thinking about the world and our place in it.",
    image: "/scrapbook/book-sapiens.jpg",
  },
  {
    id: "colorado",
    category: "photo",
    title: "Woozy on the Rockies",
    blurb: "Colorado mornings — a favorite frame from a favorite trailhead.",
    image: "/scrapbook/woozy-me-mtn(1).jpg",
    date: "Colorado",
  },
  {
    id: "coding",
    category: "hobby",
    title: "Building for Fun",
    blurb: "Side projects and CodePens — tinkering is its own reward.",
    image: "https://picsum.photos/seed/scrapbook-coding/500/400",
  },
  {
    id: "public-interest-tech",
    category: "interest",
    title: "Public Interest Tech",
    blurb: "Technology for people and communities, not just for the demo.",
    image: "/scrapbook/PIT-group-shot(1).jpeg",
  },
  {
    id: "documentary",
    category: "accomplishment",
    title: "On Camera",
    blurb: "Featured in a Roadtrip Nation documentary on public interest tech.",
    image: "https://picsum.photos/seed/scrapbook-doc/500/400",
    date: "Roadtrip Nation",
  },
  {
    id: "sxsw",
    category: "memory",
    title: "SXSW EDU Panel",
    blurb: "Panelist on youth, technology, and media — a full-circle moment.",
    image: "/scrapbook/sxsw-panel02.jpg",
    date: "2025",
  },
  {
    id: "current-read",
    category: "book",
    title: "Currently Reading",
    blurb: "The Alchemist by Paulo Coelho",
    image: "/scrapbook/book-alchemist.jpg",
  },
  {
    id: "underwater-photo",
    category: "photo",
    title: "Below the Surface",
    blurb: "A quiet frame from a dive — light, blue, and a curious fish.",
    image: "/scrapbook/manatee.jpg",
  },
];
