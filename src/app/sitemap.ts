import type { MetadataRoute } from "next";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { SITE_URL } from "@/lib/constants/site";

/**
 * Served at /sitemap.xml: the home page plus every app route marked `indexable` in APP_ROUTES,
 * so adding an app there adds it here.
 *
 * Deliberately left out:
 *  - `/scrapbook`: photos and captions, `indexable: false` (it is also `noindex`).
 *  - `/woozyx3`: a secret-code gate page, not meant to be found.
 *  - `/versus`: another project's deployment, mounted here by a rewrite; it sends `noindex`.
 *  - `squabble.demaceo.com`: a separate host, so it can't be listed in this host's sitemap.
 *
 * No `lastModified`/`priority`/`changeFrequency`: Google ignores the latter two, and a
 * `lastModified` that changes on every deploy rather than when the content changes teaches
 * Google to ignore that field too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...APP_ROUTES.filter((route) => route.indexable).map((route) => route.path)];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
