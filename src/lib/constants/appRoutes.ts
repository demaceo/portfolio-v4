/**
 * The desktop "apps" that have their own URL.
 *
 * Each app is still an overlay on the desktop, but opening one pushes its path onto the
 * history stack (see `useModalState`), so Back/Forward work, the address bar is shareable,
 * and crawlers can request `/projects` and get a page of their own. Contact, the résumé and
 * the documentary are modals over whatever is open, not destinations, so they have no route.
 *
 * `APP_PATHS` is the single source of truth for these strings: DESKTOP_APPS, the click
 * handler, the sitemap and the `[app]` route all read it.
 */
export const APP_PATHS = {
  mindset: "/mindset",
  skillset: "/skillset",
  projects: "/projects",
  scrapbook: "/scrapbook",
} as const;

export type AppKey = keyof typeof APP_PATHS;

export interface AppRoute {
  key: AppKey;
  path: (typeof APP_PATHS)[AppKey];
  /** Browser-tab / search-result title. The site name is appended by the root layout's title template. */
  title: string;
  /** The one-line summary search engines may show under the title. */
  description: string;
  /** Listed in sitemap.xml and open to indexing. False for thin pages that exist only for deep links. */
  indexable: boolean;
}

export const APP_ROUTES: readonly AppRoute[] = [
  {
    key: "mindset",
    path: APP_PATHS.mindset,
    title: "About & Mindset",
    description:
      "Senior full-stack & mobile engineer who ships solo: security-first, compliance-minded production AI, plus the design principles behind the work.",
    indexable: true,
  },
  {
    key: "skillset",
    path: APP_PATHS.skillset,
    title: "Skills & Services",
    description:
      "Full-stack and mobile engineering services: web apps, mobile app design, front end development, APIs, cloud and DevOps, databases, and automation.",
    indexable: true,
  },
  {
    key: "projects",
    path: APP_PATHS.projects,
    title: "Projects",
    description:
      "Production apps by Demaceo Vincent, including The Yap App, Pinpoint, The Reckoning and Payback Own, built with React Native, TypeScript, Node and PostgreSQL.",
    indexable: true,
  },
  {
    key: "scrapbook",
    path: APP_PATHS.scrapbook,
    title: "Scrapbook",
    description:
      "A personal scrapbook of photos, accomplishments, interests and memories from Demaceo Vincent.",
    // Photos and short captions: nothing a search result could usefully summarise.
    indexable: false,
  },
];

/** Which app a pathname belongs to, tolerating a trailing slash. Null for `/` and anything else. */
export function appKeyForPath(pathname: string | null | undefined): AppKey | null {
  if (!pathname) return null;
  const normalized =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return APP_ROUTES.find((route) => route.path === normalized)?.key ?? null;
}
