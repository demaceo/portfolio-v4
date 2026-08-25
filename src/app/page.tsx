import { LandingPage } from "@/components/layout";
import "./globals.css";

export default function Home() {
  return (
    <>
      {/* The desktop wallpaper is a CSS background on .macintosh-container, so
          the browser can't discover it until LandingPage.css has been fetched
          and parsed. Preloading it here (React hoists the tag into <head>)
          starts the request alongside the stylesheet instead of after it —
          this is the largest painted element on the page, so it's the LCP
          candidate. Declared on the page rather than the root layout so
          /woozyx3, which uses a different wallpaper, doesn't pay for it. */}
      <link
        rel="preload"
        as="image"
        href="/images/palmtreeleaves-5.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <LandingPage />
    </>
  );
}
