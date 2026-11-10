---
title: App routes (URL-driven overlays and the text layer)
type: subsystem
created: 2026-11-10
updated: 2026-11-10
sources:
  - code: src/lib/constants/appRoutes.ts
  - code: src/hooks/useModalState.ts
  - code: src/hooks/useAppActions.ts
  - code: src/lib/constants/desktopApps.ts
  - code: src/app/(desktop)/layout.tsx
  - code: src/app/(desktop)/[app]/page.tsx
  - code: src/components/seo/SeoLayer.tsx
  - code: src/components/layout/LandingPage/components/AppViews.tsx
  - code: src/data/aboutMePills.ts
  - code: src/app/globals.css
verified_at: 0e5a56e
---

# App routes

The desktop's four full-screen apps (Mindset, Skillset, Projects, Scrapbook) each have a URL:
`/mindset`, `/skillset`, `/projects`, `/scrapbook`. They are still overlays on one desktop. The
paths live in one place, `APP_PATHS` / `APP_ROUTES` (`src/lib/constants/appRoutes.ts`), which the
desktop icons, the click handler, the sitemap and the route all read. Contact, the résumé and the
documentary are modals over whatever is open and have no route.

**Structure.** `src/app/(desktop)/layout.tsx` renders `LandingPage` once, so moving between apps
never remounts the desktop. `/` and one generated `[app]` page sit inside it; the pages render
only metadata and the text layer. `/woozyx3` and `/api/*` are outside the group on purpose.

**URL is the source of truth for which app is open.** `useModalState` derives `showAboutMe`,
`showSkillset`, `showProjects` and `showScrapbook` from `usePathname()`, so every consumer of
those booleans is unchanged. Its setters push a history entry (open) or push `/` (close), so
Back, Forward, deep links and reload all work, and "only one app open" is now structural: there
is one pathname.

**The text layer.** `SeoLayer` server-renders an `<h1>`, the real copy and crawlable links for the
route, from the same data modules the overlays use (`projects`, `services`, `principles`,
`aboutMePills`, `profileHighlights`). Without it the HTML a crawler receives is a greeting.

> ⚠️ Open and close apps through the `setShow*` actions, never by calling `router.push` or
> `history.pushState` from a component. The setters also clear the per-app selection
> (`CLEARED_ON_OPEN`), and the close path only leaves the URL if that app is still the one showing,
> so a late close from an app that was just replaced cannot send the user home from the new one.

> ⚠️ Navigation is `window.history.pushState`, deliberately not `router.push`. Next patches
> `pushState` so `usePathname` follows it with no server fetch; `router.push` would make every app
> open wait on a network round trip. The setters read `window.location.pathname` at call time, not
> a closed-over pathname, so callbacks held by long-lived components cannot act on a stale one.

> ⚠️ The overlays must stay client-only. They measure the window, run d3 and so on, and have never
> been server-rendered. `useModalState` therefore treats the URL as "no app open" until after
> hydration (`useHydrated`), so a direct load of `/projects` renders the desktop first and the
> overlay mounts a moment later. Reading `usePathname()` directly would server-render the overlay
> and risk a hydration mismatch.

> ⚠️ Keep `SeoLayer` `inert` and visually hidden (`.seo-layer` in `src/app/globals.css`). It is a
> duplicate of what the overlay shows, so without `inert` screen readers hear everything twice and
> hidden links take keyboard focus. Do not put content in it that the overlay cannot show: it must
> mirror the live UI, drawn from the same data, never a separate, keyword-tuned copy. If an overlay
> reads from a constant inside its component, move that constant into `src/data/` (as
> `profileHighlights` was) so both read it.

> ⚠️ Adding an app touches five places: `APP_PATHS` and `APP_ROUTES`, `DESKTOP_APPS`, the branch in
> `useAppActions.handleAppClick`, `preloadByPath` in `src/lib/utils/preload.ts` (still matches the
> path strings by hand), and `CONTENT` in `SeoLayer` (skip it for a thin page and mark the route
> `indexable: false`). `useModalState` needs a `CLEARED_ON_OPEN` entry and a `show*` boolean.

> ⚠️ Escape closes only the topmost overlay (shared `overlayStack`). Picking a project in the ⌘K
> palette opens Projects *and* that project's detail modal, so it takes two Escapes to get back to
> `/`. That is the stack working, not a stuck URL.

> ⚠️ The Welcome window starts open on every load, including a deep link to an app, and returns
> when that app is closed. Not a bug, but it means `/projects` closes onto the welcome screen.
