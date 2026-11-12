import { EXTERNAL_LINKS } from "@/lib/constants/paths";

/**
 * The origin crawlers should treat as canonical.
 *
 * `demaceo.com` answers with a 308 to `www.demaceo.com`, so the `www` host is the one that
 * actually serves pages. Sitemap URLs, the robots.txt `Sitemap:` line, canonical links and
 * Open Graph URLs must all use this host: Search Console ignores sitemap entries whose host
 * differs from the sitemap's own, and a canonical that points at a redirecting or foreign
 * host tells Google to index a page it can't fetch.
 */
export const SITE_URL = "https://www.demaceo.com";

/** The short form, used in sub-page titles ("Projects | Demaceo Vincent") and as an alternate name. */
export const SITE_NAME = "Demaceo Vincent";
/** The full name as it appears on the résumé; the home title and the structured data lead with it. */
export const SITE_FULL_NAME = "Demaceo Vincent Howard";

// Search-result copy, aimed at employers and recruiters: the role matches the résumé headline
// and the stack line matches its summary. Tune it here in one place: the root layout, every
// route's metadata, the JSON-LD, the text layer and the welcome window all read it.
// House style: no em dashes in anything visitors read (see CLAUDE.md).
export const SITE_JOB_TITLE = "Senior Full-Stack & Mobile Engineer";
export const SITE_TITLE = `${SITE_FULL_NAME}: ${SITE_JOB_TITLE}`;
export const SITE_DESCRIPTION =
  "Senior full-stack & mobile engineer (React, TypeScript, Node). Shipped 5+ production apps solo: civic tech, privacy AI, PropTech and real-time voice.";

/** Profiles that are verifiably this person; emitted as `sameAs` in the JSON-LD. */
export const SOCIAL_PROFILES = [EXTERNAL_LINKS.GITHUB, EXTERNAL_LINKS.LINKEDIN] as const;
