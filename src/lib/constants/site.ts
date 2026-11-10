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

export const SITE_NAME = "Demaceo Vincent";

// Search-result copy. Written from what the site already claims (the welcome window's
// "Developer | Designer" and the About app's shipped-apps line), so it can be tuned here
// in one place: the root layout, every route's metadata, JSON-LD and the text layer read it.
export const SITE_JOB_TITLE = "Developer & Designer";
export const SITE_TITLE = `${SITE_NAME} — ${SITE_JOB_TITLE}`;
export const SITE_DESCRIPTION =
  "Portfolio of Demaceo Vincent, a developer and designer who ships production apps solo — civic tech, privacy AI, PropTech, and real-time voice.";

/** Profiles that are verifiably this person; emitted as `sameAs` in the JSON-LD. */
export const SOCIAL_PROFILES = [EXTERNAL_LINKS.GITHUB, EXTERNAL_LINKS.LINKEDIN] as const;
