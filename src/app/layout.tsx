import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ChunkErrorRecoveryListener from "@/components/ChunkErrorRecoveryListener";

// Self-hosted from the build output instead of the `@import
// url("https://fonts.googleapis.com/...")` that used to sit at the top of
// globals.css. A CSS @import is discovered only *after* globals.css has been
// downloaded and parsed, so the font request was serialized behind it — two
// extra round trips (fonts.googleapis.com for the stylesheet, then
// fonts.gstatic.com for the file) on the critical path, to a third-party
// origin with no preconnect. next/font emits the @font-face inline, preloads
// the .woff2 from our own origin, and drops both DNS lookups.
const sora = Sora({
  subsets: ["latin"],
  // Sora ships as a variable font: omitting `weight` pulls the single
  // variable .woff2 covering 400-800 rather than five static files.
  display: "swap",
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://demaceovincent.com"),
  title: "Demaceo Vincent's portfolio",
  description:
    "Welcome to my portfolio website showcasing my projects and skills.",
  icons: {
    // Derived from logos/PORTFOLIO_LOGO.png, which is a 1024x1024 / 1.7 MB
    // master. Favicons and apple-touch-icons are served straight from
    // public/ (no image optimizer in front of them), so pointing these at
    // the master meant every visitor downloaded 1.7 MB to paint a 16px tab
    // icon.
    icon: "/logos/portfolio-logo-192.png",
    apple: "/logos/portfolio-logo-192.png",
  },
  openGraph: {
    title: "Demaceo Vincent's portfolio",
    description:
      "Welcome to my portfolio website showcasing my projects and skills.",
    images: [
      {
        // Was the same 1.7 MB square master, declared as 1200x630 but not
        // actually that shape — so crawlers downloaded it and then letterboxed
        // it themselves. This one really is 1200x630.
        url: "/logos/og-image.png",
        width: 1200,
        height: 630,
        alt: "Demaceo Vincent's Portfolio Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.variable}>
      {/* No <head> preconnects here on purpose. The giphy / githubusercontent
          origins are only ever hit by the browser for the unoptimized .gif
          project art inside the Projects app view, and image.pbs.org is
          fetched server-side by the image optimizer (so the browser never
          connects to it at all). Warming those sockets on every page load
          spent handshakes most visitors never use; they're now opened on
          intent instead — see ensureProjectMediaPreconnect in
          lib/utils/preload.ts, matching how player.pbs.org already worked. */}
      <body>
        <ChunkErrorRecoveryListener />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
