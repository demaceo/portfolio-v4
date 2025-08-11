
const LONG_CACHE = "public, max-age=31536000, immutable";
import type { NextConfig } from "next";

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
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(icons|images|logos)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
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
    ],
  },
};

export default nextConfig;