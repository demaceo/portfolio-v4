---
title: Home screen (project icon grid, Featured links, app dock)
type: subsystem
created: 2026-11-26
updated: 2026-11-26
sources:
  - code: src/components/layout/LandingPage/components/Desktop.tsx
  - code: src/components/layout/LandingPage/components/HomeScreen.tsx
  - code: src/components/layout/LandingPage/components/HomeScreen.css
  - code: src/components/layout/LandingPage/components/AppSwitcher.tsx
  - code: src/components/layout/LandingPage/components/AppSwitcher.css
  - code: src/components/layout/LandingPage/LandingPage.tsx
  - code: src/components/layout/LandingPage/LandingPage.css
  - code: src/data/homeScreenProjects.ts
  - code: src/data/featuredLinks.ts
  - code: src/data/projects.ts
  - code: src/lib/constants/projectIcons.ts
  - code: src/components/features/portfolio/shared/ProjectMedia.tsx
verified_at: 71adc49
---

# Home screen

The desktop surface (`src/components/layout/LandingPage/components/Desktop.tsx`) is the frosted panel with the rain canvas behind a grid of
glass app icons (`src/components/layout/LandingPage/components/HomeScreen.tsx`). It replaced the curved app wheel removed on 2026-11-25
(see [[app-routes]] for why the launchers are buttons).

**Projects.** `src/data/homeScreenProjects.ts` lists project slugs in display order; `HomeScreen`
resolves them against the active projects from `useProjects`
(`src/components/layout/LandingPage/components/HomeScreen.tsx:108`). A slug with no matching
project is skipped, so a slug can be listed before its data exists (Zoori and Codepenz are, as of
2026-11-26). Tapping a tile calls `openProject` in `LandingPage`
(`src/components/layout/LandingPage/LandingPage.tsx:74`), the same function the ⌘K palette uses:
it opens the Projects app with that project's detail ([[project-detail-modal]]).

**Featured.** `src/data/featuredLinks.ts` is one list shared by the Featured row and the ⌘K
palette ([[glass-overlays]]). Each `path` goes through `useAppActions.handleAppClick`:
`/documentary` opens the documentary player, an http(s) URL a new tab. On the home screen the
external ones render as real `<a target="_blank">` links.

**Placeholders.** Squabble Up and Versus have lettered glyph icons (`"fas fa-s icon"` /
`"fas fa-v icon"`, mapped in `src/lib/constants/projectIcons.ts`) until real art exists.

> ⚠️ The 3D tilt writes `--rx`/`--ry`/`--glare-x`/`--glare-y` straight onto the hovered tile's
> style (`handleTilt`, `src/components/layout/LandingPage/components/HomeScreen.tsx:27`), not React
> state, so pointer moves never re-render the grid. It skips touch pointers; reduced motion turns the
> transform off in `src/components/layout/LandingPage/components/HomeScreen.css`, not in JS.

> ⚠️ Tiles pass `preferIcon` to `ProjectMedia` (`src/components/layout/LandingPage/components/HomeScreen.tsx:135`).
> By default `ProjectMedia` shows a project's hero `image` before its `icon`, so without it Unmasked
> Coaching renders its GIF instead of its logo.

> ⚠️ One media query, `(max-width: 768px), (pointer: coarse)`, decides four things together: the
> MenuBar hides (`src/components/layout/LandingPage/LandingPage.menu.css:389`), the AppSwitcher dock shows (`src/components/layout/LandingPage/components/AppSwitcher.css:31`),
> the retro taskbar hides (`src/components/layout/LandingPage/LandingPage.css:449`, it would sit under the dock) and the grid switches
> to its centered touch layout with bottom padding for the dock (`src/components/layout/LandingPage/components/HomeScreen.css:208`). Change one
> and the others must follow, or a screen size ends up with two launchers or none.

> ⚠️ On phones (≤480px) `.desktop` stays visible because it holds the grid; only `.desktop-rain` is
> hidden (`src/components/layout/LandingPage/LandingPage.css:458`), to spare phone GPUs.
