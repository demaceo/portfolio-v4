import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site";

/**
 * Served at /robots.txt. Crawlers may fetch everything except API routes, and are pointed
 * at the sitemap. Paths that shouldn't be indexed are kept out of the sitemap (and, for
 * /versus, marked `noindex` by its own deployment) rather than listed here: a `Disallow`
 * line is public, so it would advertise the very paths it is meant to hide.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
