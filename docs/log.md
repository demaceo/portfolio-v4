# Work log

Append-only. Newest entries at the bottom.

---

## [2026-11-05] setup | docs/ wiki scaffolded

- Categories: concepts - architecture - subsystems - decisions - reference - operations - history
- Baseline commit: `0b8fabb`
- Created: `docs/{CLAUDE,index,log}.md`, `raw/`, 4 `.claude/commands/docs-*`,
  and `.claude/scripts/docs-lint.py`

## [2026-11-05] grow | started in grow mode

- Wrote [[glass-overlays]] from the code of the overlay redesign (PR #79):
  tokens, token bridge, shells, palette, icon-sizing and containing-block traps.
- Other areas intentionally undocumented until work touches them.

## [2026-11-05] grow | Glass migration of every overlay

- [[glass-overlays]] extended: opaque-surface trap, Toolbelt d3 theming, résumé PDF
  export and html2canvas `color-mix()` traps, dead résumé selectors.

## [2026-11-05] grow | résumé PDF pagination

- [[glass-overlays]]: Letter pagination of the résumé export and its two traps
  (measure on the clone; extend `PDF_BREAK_SELECTOR` for new block types).

## [2026-11-05] grow | dead résumé CSS removed

- [[glass-overlays]]: replaced the "dead selectors" note with the global-stylesheet and
  undefined-`var()` traps found while deleting 820 lines of dead résumé CSS.

## [2026-11-05] grow | résumé now serves the owner's PDF

- [[glass-overlays]]: replaced the html2canvas/pagination notes (code removed) with the
  static-PDF setup and its sync and phone-redaction traps.

## [2026-11-05] grow | code-review fixes

- [[glass-overlays]]: palette re-pick (`projectRequestKey`), diacritic-folding search and
  IME guard, AppView palette button via `PaletteContext`, and the contact-form clipping trap.

## [2026-11-06] config | Squabble Up served at squabble.demaceo.com

- `next.config.ts`: Host-scoped `beforeFiles` rewrite proxies `squabble.demaceo.com/*` to the
  `hasanv-web` Cloudflare Worker; `/squabble` on the main domain 307s there. public/ caching
  rules are kept off that host with `missing`. A subdomain rather than a path because the game
  assumes it is at the root of its origin; a Cloudflare custom domain was ruled out because
  demaceo.com's DNS is at name.com.

## [2026-11-10] config | sitemap.xml and robots.txt added

- `src/app/sitemap.ts` (lists `/` only) and `src/app/robots.ts` (allow all but `/api/`, points at
  the sitemap) are served by Next's metadata routes; both take the host from
  `src/lib/constants/site.ts` (`SITE_URL`).
- `SITE_URL` is `https://www.demaceo.com`: the apex 308s to `www`. `metadataBase` in
  `src/app/layout.tsx` previously pointed at `demaceovincent.com`, so every canonical/OG URL
  resolved against a host that is not this site; it now uses `SITE_URL`.
- The canonical link is set in `src/app/page.tsx`, not the root layout, so `/woozyx3` does not
  inherit a canonical pointing at the home page.
- See [[seo-indexing]]. Left out of the sitemap on purpose: `/woozyx3` (secret-code gate), `/versus` (other project,
  sends `noindex`), `squabble.demaceo.com` (different host). Not listed in robots.txt either,
  since a `Disallow` line is public.

## [2026-11-10] grow | apps get real URLs and a crawlable text layer

- New [[app-routes]]: `/mindset`, `/skillset`, `/projects`, `/scrapbook` now exist. `useModalState`
  reads the open app from the URL and pushes history entries; the desktop moved into a `(desktop)`
  route group so it stays mounted between apps. Overlays remain client-only (hydration-gated).
- Each route server-renders an inert, visually hidden text layer from the same data modules as the
  overlays (before: ~390 characters, no `<h1>`, no links). `profileHighlights` moved to
  `src/data/aboutMePills.ts` so both read it.
- [[seo-indexing]] rewritten: per-route metadata via `pageMetadata()`, JSON-LD, sitemap now driven by
  `APP_ROUTES`, canonical trap updated (set per page; the home page file moved into the `(desktop)` group).
- Title/description copy was rewritten from claims the site already makes; it is meant to be tuned in
  `src/lib/constants/site.ts` and `src/lib/constants/appRoutes.ts`.


## [2026-11-10] ui | Services slides: oversized illustration layout

- `SkillsetAppView`: each service's illustration is now shown oversized, tilted and cropped off
  the top-right (`.plateArt`, masked on its left edge so it fades before the copy), with a
  left-aligned copy column (large counter, uppercase title). It eases in per service and drifts
  slowly (CSS keyframes, off under `prefers-reduced-motion`). Phones (≤640px): illustration behind,
  copy in a frosted card near the bottom. The vertical panel rail got a frosted backing so it stays
  visible over the art. Chosen from mockups (layout C, phone M2).

## [2026-11-10] ui | An App Idea logo replaced

- Skillset byline now uses `public/logos/an-app-idea.svg` (the new bulb logo) instead of
  `public/logos/mhi-logo.png`, which nothing references any more (left in place, not deleted).
- See [[services-slides]] for the contrast trap: the logo is thin strokes designed for a dark
  surface, so it sits on a dark chip.

## [2026-11-10] ui | ⌘K search button moved out of the top bar

- The ⌘K button left the MenuBar (it sat beside the clock). `MobileSearchButton` became the single
  `SearchButton` for every device: a compact pill in the taskbar strip (bottom-right) on a mouse
  desktop, floating in the corner while an app is open; the round top-right button on phones/touch,
  unchanged. See [[glass-overlays]] for the trap (keep it in the strip, not above it).

## [2026-11-12] config | no em dashes in UI copy; employer-facing title and description

- New root `CLAUDE.md` with the house rule (no em dashes in anything visitors read), enforced by a
  `no-restricted-syntax` rule in `eslint.config.mjs` on string literals, template strings and JSX text.
  56 existing instances in `src/` were rewritten by context (data files, aria-labels, contact form
  copy, scrapbook blurbs, the woozyx3 messages, console warnings). The résumé PDF in `public/` has one
  that only its source document can fix.
- [[seo-indexing]]: home title is now "Demaceo Vincent Howard: Senior Full-Stack & Mobile Engineer",
  description rewritten for recruiters, JSON-LD carries both names. The welcome window gains the role
  line under the greeting; the taskbar tagline is unchanged.
