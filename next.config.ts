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
 * `/versus` is the game *Hasan vs.*, a separate Vercel project (demaceo/make-me-viral)
 * served under this domain by a rewrite: the address bar stays on demaceo.com while the
 * game's own deployment answers. The two deploy independently.
 *
 * `squabble.demaceo.com` is the game *Squabble Up* (demaceo/hasanv), hosted on a Cloudflare
 * Worker. Unlike Hasan vs., it is built to sit at the root of its origin (its service worker,
 * manifest and invite links all start at `/`), so it gets its own subdomain instead of a path:
 * the subdomain is added to this Vercel project, and every request carrying that Host is
 * proxied to the Worker before this app's own pages and files are consulted. `/squabble` on
 * the main domain redirects there. demaceo.com's DNS is at name.com, not Cloudflare, which is
 * why the Worker cannot take the subdomain as a Cloudflare custom domain itself.
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

// The game's production address (the `versus` project's stable alias). Its build is made
// with Vite's `base: '/versus/'`, so every URL it emits already starts with /versus/.
const VERSUS_ORIGIN = "https://versus.vercel.app";

// Squabble Up's public hostname, and the Worker that actually serves it (`hasanv-web`, whose
// `not_found_handling: "single-page-application"` answers deep links like `/link?code=…`).
const SQUABBLE_HOST = "squabble.demaceo.com";
const SQUABBLE_ORIGIN = "https://hasanv-web.anappidea.workers.dev";
const ON_SQUABBLE = [{ type: "host" as const, value: SQUABBLE_HOST }];

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
  async redirects() {
    return [
      // Temporary (307), not permanent: a 308 is cached by browsers indefinitely, which would
      // pin this address even if the game later moves.
      { source: "/squabble", destination: `https://${SQUABBLE_HOST}`, permanent: false },
      { source: "/squabble/:path*", destination: `https://${SQUABBLE_HOST}/:path*`, permanent: false },
    ];
  },
  async rewrites() {
    return {
      // `beforeFiles`, because the default (`afterFiles`) runs only after this app's pages
      // and public/ files are checked: `/` on the subdomain would render the portfolio.
      beforeFiles: [
        { source: "/:path*", has: ON_SQUABBLE, destination: `${SQUABBLE_ORIGIN}/:path*` },
      ],
      afterFiles: [
        { source: "/versus", destination: `${VERSUS_ORIGIN}/versus` },
        { source: "/versus/:path*", destination: `${VERSUS_ORIGIN}/versus/:path*` },
      ],
      fallback: [],
    };
  },
  async headers() {
    return [
      // Bare `.js` files served from public/ — NOT build output, which is
      // matched by the more specific `/_next/static` rule last.
      {
        source: "/:path*.js",
        missing: ON_SQUABBLE,
        headers: [{ key: "Cache-Control", value: REVALIDATING_CACHE }],
      },
      ...PUBLIC_ASSET_EXTENSIONS.map((ext) => ({
        source: `/:path*.${ext}`,
        missing: ON_SQUABBLE,
        headers: [{ key: "Cache-Control", value: REVALIDATING_CACHE }],
      })),
      {
        source: "/(icons|images|logos|scrapbook)/:path*",
        missing: ON_SQUABBLE,
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
      // The game's content-hashed bundles. Also last on purpose: `/:path*.js` and
      // `/:path*.css` above match them too, and would cut their year down to an hour.
      // The game's index.html is not matched here and keeps its own must-revalidate.
      {
        source: "/versus/assets/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
      // Squabble Up's content-hashed bundles. Every other file on that host (index.html, sw.js
      // among them) keeps the Worker's own must-revalidate: the public/ rules above are kept off
      // that host by `missing`, since the game's service worker decides what it caches, and an
      // hour of HTTP cache on its shell would delay every update the game ships.
      {
        source: "/_expo/static/:path*",
        has: ON_SQUABBLE,
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
