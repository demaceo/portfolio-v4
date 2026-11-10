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
