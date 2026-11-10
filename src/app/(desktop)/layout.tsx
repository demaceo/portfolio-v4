import { LandingPage } from "@/components/layout";
import { siteJsonLd } from "@/lib/seo";

/**
 * Shared by `/` and every app route (`/projects`, ...). The desktop lives here, in the layout,
 * not in each page, so moving between apps keeps it mounted: the apps open and close as
 * overlays on one continuous desktop (their open/closed state is read from the URL by
 * `useModalState`) instead of the whole desktop remounting on every route change.
 *
 * The pages themselves render only the server-side text layer (see SeoLayer).
 */
export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* The desktop wallpaper is a CSS background on .macintosh-container, so
          the browser can't discover it until LandingPage.css has been fetched
          and parsed. Preloading it here (React hoists the tag into <head>)
          starts the request alongside the stylesheet instead of after it —
          this is the largest painted element on the page, so it's the LCP
          candidate. Declared on this group rather than the root layout so
          /woozyx3, which uses a different wallpaper, doesn't pay for it. */}
      <link
        rel="preload"
        as="image"
        href="/images/palmtreeleaves-5.webp"
        type="image/webp"
        fetchPriority="high"
      />
      {/* `<` is escaped so no string in the data can close the script tag early. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LandingPage />
      {children}
    </>
  );
}
