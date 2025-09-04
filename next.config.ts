/**
 * Next.js configuration object for portfolio-v4.
 *
 * - Sets long-term cache headers (`Cache-Control: public, max-age=31536000, immutable`)
 *   for static assets such as JS, CSS, images, and icons to optimize client-side caching.
 * - Applies cache headers conditionally for production builds.
 * - Configures remote image domains for Next.js Image Optimization, allowing images
 *   to be loaded from specified external sources.
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
import type { NextConfig } from "next";
// max age value is initially  31536000 which is 1 year
// 6000 is 
const LONG_CACHE = "public, max-age=6000, immutable";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: LONG_CACHE,
          },
        ],
      },
      // Use valid Next.js glob patterns for static assets
      {
        source: "/:path*.js",
        headers: [
          {
            key: "Cache-Control",
            value: LONG_CACHE,
          },
        ],
      },
      ...(process.env.NODE_ENV === 'production'
        ? [{
          source: "/:path*.js",
          headers: [
            {
              key: "Cache-Control",
              value: LONG_CACHE,
            },
          ],
        }]
        : []),
      {
        source: "/:path*.css",
        headers: [
          {
            key: "Cache-Control",
            value: LONG_CACHE,
          },
        ],
      },
      {
        source: "/:path*.png",
        headers: [
          {
            key: "Cache-Control",
            value: LONG_CACHE,
          },
        ],
      },
      {
        source: "/:path*.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: LONG_CACHE,
          },
        ],
      },
      {
        source: "/:path*.jpeg",
        headers: [
          {
            key: "Cache-Control",
            value: LONG_CACHE,
          },
        ],
      },
      {
        source: "/:path*.gif",
        headers: [
          {
            key: "Cache-Control",
            value: LONG_CACHE,
          },
        ],
      },
      {
        source: "/:path*.svg",
        headers: [
          {
            key: "Cache-Control",
            value: LONG_CACHE,
          },
        ],
      },
      {
        source: "/:path*.webp",
        headers: [
          {
            key: "Cache-Control",
            value: LONG_CACHE,
          },
        ],
      },
      {
        source: "/:path*.ico",
        headers: [
          {
            key: "Cache-Control",
            value: LONG_CACHE,
          },
        ],
      },
      {
        source: "/(icons|images|logos)/:path*",
        headers: [
          { key: "Cache-Control", value: LONG_CACHE },
        ],
      },
    ];
  },
  images: {
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