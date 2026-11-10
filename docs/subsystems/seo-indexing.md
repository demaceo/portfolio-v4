---
title: SEO indexing (sitemap, robots, canonical host)
type: subsystem
created: 2026-11-10
updated: 2026-11-10
sources:
  - code: src/lib/constants/site.ts
  - code: src/app/sitemap.ts
  - code: src/app/robots.ts
  - code: src/app/layout.tsx
  - code: src/app/page.tsx
  - code: next.config.ts
verified_at: ab3b40b
---

# SEO indexing

`/sitemap.xml` and `/robots.txt` are Next metadata routes (`src/app/sitemap.ts`,
`src/app/robots.ts`), not files in `public/`. Both, plus `metadataBase` in
`src/app/layout.tsx` and the home canonical in `src/app/page.tsx`, take their host from one
constant, `SITE_URL` in `src/lib/constants/site.ts`.

The sitemap lists only `/`: the portfolio is one page and its apps are overlays, not routes.
Search Console (a Domain property for `demaceo.com`) is given
`https://www.demaceo.com/sitemap.xml` by hand; nothing in the code submits it.

> ⚠️ `SITE_URL` must be the host that actually serves pages. `demaceo.com` 308-redirects to
> `www.demaceo.com` (checked live 2026-11-10), so it is the `www` host. `metadataBase` once
> pointed at `demaceovincent.com`, which made every canonical and Open Graph URL resolve to a
> foreign host. If the redirect direction in the Vercel domain settings changes, change `SITE_URL`.

> ⚠️ Keep `/woozyx3` (secret-code gate) out of `src/app/sitemap.ts`, and do not add it to `src/app/robots.ts`:
> a `Disallow` line is public and would advertise the path. `/versus` is another project mounted
> by a rewrite in `next.config.ts` and sends `noindex` itself.

> ⚠️ The canonical lives in `src/app/page.tsx`, not the root layout. A layout-level canonical of
> `/` would be inherited by `/woozyx3` and tell crawlers it is a duplicate of the home page.

> ⚠️ `squabble.demaceo.com` is a different host: the `beforeFiles` rewrite in `next.config.ts`
> proxies every path on it, `/sitemap.xml` and `/robots.txt` included, to the Worker. This app's
> sitemap cannot cover it; it would need its own, served by that project.
