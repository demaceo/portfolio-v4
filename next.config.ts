/**
 * Next.js configuration object for portfolio-v4.
 *
 * Caching is split in two, because the two classes of static asset have very
 * different invalidation stories:
 *
 *  - `/_next/static/*` is content-hashed by the build. A given URL can never
 *    change contents, so it gets the maximal `immutable` year — the browser
 *    never even revalidates it on a repeat visit.
 *  - Everything under `public/` (icons, images, logos) keeps its filename
 *    across deploys, so an `immutable` year there means a redeployed image
 *    stays stale in visitors' caches for a year. Those get a short freshness
 *    window plus a long `stale-while-revalidate`, so repeat visits still
 *    render instantly from cache while the new bytes are fetched in the
 *    background.
 *
 * Also configures remote image domains for Next.js Image Optimization.
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
import type { NextConfig } from "next";

// Content-hashed build output: safe to cache forever and never revalidate.
const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

// Stable-filename assets in public/: serve from cache for an hour, then keep
// serving the cached copy for a week while revalidating in the background.
const REVALIDATING_CACHE =
  "public, max-age=3600, stale-while-revalidate=604800";

// Every extension served straight out of public/ (i.e. not through the image
// optimizer or the build pipeline), so the rules below stay in one place.
const PUBLIC_ASSET_EXTENSIONS = [
  "css",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "avif",
  "ico",
  "mp4",
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Bare `.js` files served from public/ — NOT build output, which is
      // matched by the more specific `/_next/static` rule last.
      {
        source: "/:path*.js",
        headers: [{ key: "Cache-Control", value: REVALIDATING_CACHE }],
      },
      ...PUBLIC_ASSET_EXTENSIONS.map((ext) => ({
        source: `/:path*.${ext}`,
        headers: [{ key: "Cache-Control", value: REVALIDATING_CACHE }],
      })),
      {
        source: "/(icons|images|logos|scrapbook)/:path*",
        headers: [{ key: "Cache-Control", value: REVALIDATING_CACHE }],
      },
      // Listed last on purpose: when several `headers()` entries match the
      // same request, the last one wins for a given header key. `/:path*.js`
      // above also matches `/_next/static/chunks/*.js`, so this rule has to
      // come after it to hand build output the immutable policy.
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
    ];
  },
  images: {
    // AVIF first (typically 20-30% smaller than WebP), WebP as the fallback
    // for browsers that don't accept it.
    formats: ["image/avif", "image/webp"],
    // Re-encoding a 2 MB source PNG is expensive, and the 60s default means
    // paying for it constantly. A week is long enough to make that cost
    // negligible while staying bounded by the same window as the
    // stale-while-revalidate above: this cache is keyed by source URL and
    // survives redeploys, so replacing an image in place without renaming it
    // serves the old derivative until this expires. Deliberately not the
    // `immutable` year that /_next/static gets — public/ filenames get reused.
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media2.giphy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media3.giphy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.pbs.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
