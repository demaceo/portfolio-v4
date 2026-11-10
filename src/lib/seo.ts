import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_JOB_TITLE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_PROFILES,
} from "@/lib/constants/site";

// Really 1200x630 (see the note in the root layout), unlike the square master it replaced.
const OG_IMAGE = {
  url: "/logos/og-image.png",
  width: 1200,
  height: 630,
  alt: "Demaceo Vincent's Portfolio Logo",
};

/**
 * Next replaces `openGraph` wholesale when a page sets its own (nested fields are not merged),
 * so every place that sets one has to repeat the image. This is that one place.
 */
export function siteOpenGraph(title: string, description: string, path?: string): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: SITE_NAME,
    title,
    description,
    ...(path ? { url: path } : {}),
    images: [OG_IMAGE],
  };
}

interface PageMetadataInput {
  /** Omit for the home page, which uses the full site title instead of "<title> | <site>". */
  title?: string;
  description?: string;
  /** Path of this page, used for the canonical link and `og:url`. Resolved against `metadataBase`. */
  path: string;
  indexable?: boolean;
}

export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  indexable = true,
}: PageMetadataInput): Metadata {
  return {
    title: title ?? { absolute: SITE_TITLE },
    description,
    alternates: { canonical: path },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
    openGraph: siteOpenGraph(title ? `${title} | ${SITE_NAME}` : SITE_TITLE, description, path),
  };
}

/**
 * Who and what this site is, for search engines. The `@id`s let the two nodes refer to each
 * other, and `sameAs` ties the name to the LinkedIn/GitHub profiles so "Demaceo Vincent" can be
 * disambiguated from other people of that name.
 */
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      jobTitle: SITE_JOB_TITLE,
      sameAs: [...SOCIAL_PROFILES],
    },
  ],
};
