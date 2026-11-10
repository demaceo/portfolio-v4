import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site";

/**
 * Served at /sitemap.xml.
 *
 * Only `/` is listed because the portfolio is a single page: every "app" (About, Projects,
 * Skills, ...) opens as an overlay on it rather than at its own URL. Deliberately left out:
 *  - `/woozyx3`: a secret-code gate page, not meant to be found.
 *  - `/versus`: another project's deployment, mounted here by a rewrite; it sends `noindex`.
 *  - `squabble.demaceo.com`: a separate host, so it can't be listed in this host's sitemap.
 *
 * No `lastModified`/`priority`/`changeFrequency`: Google ignores the latter two, and a
 * `lastModified` that changes on every deploy rather than when the content changes teaches
 * Google to ignore that field too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/` }];
}
