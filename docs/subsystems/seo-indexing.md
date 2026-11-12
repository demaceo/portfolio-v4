---
title: SEO indexing (sitemap, robots, canonical host, metadata)
type: subsystem
created: 2026-11-10
updated: 2026-11-12
sources:
  - code: src/lib/constants/site.ts
  - code: src/lib/seo.ts
  - code: src/app/sitemap.ts
  - code: src/app/robots.ts
  - code: src/app/layout.tsx
  - code: src/app/(desktop)/page.tsx
  - code: src/app/(desktop)/[app]/page.tsx
  - code: src/app/(desktop)/layout.tsx
  - code: src/lib/constants/appRoutes.ts
  - code: next.config.ts
verified_at: 2429066
---

# SEO indexing

`/sitemap.xml` and `/robots.txt` are Next metadata routes (`src/app/sitemap.ts`,
`src/app/robots.ts`), not files in `public/`. Every host, title and description comes from
`src/lib/constants/site.ts`; per-route values from `APP_ROUTES` in
`src/lib/constants/appRoutes.ts` (see [[app-routes]] for how the routes themselves work).

- **Sitemap**: the home page plus every `APP_ROUTES` entry with `indexable: true`
  (`/mindset`, `/skillset`, `/projects`). Adding an indexable app there adds it to the sitemap.
- **Metadata**: `pageMetadata()` in `src/lib/seo.ts` builds title, description, canonical and
  Open Graph for the home page (`src/app/(desktop)/page.tsx`) and for each app route
  (`generateMetadata` in `src/app/(desktop)/[app]/page.tsx`). The root layout holds only the
  site-wide defaults and the title template (`%s | Demaceo Vincent`).
- **Structured data**: one `Person` + `WebSite` JSON-LD block, emitted by the `(desktop)` layout
  (so `/woozyx3` has none). `sameAs` is the GitHub and LinkedIn URLs from `EXTERNAL_LINKS`.
- **Search Console** is a Domain property for `demaceo.com`; the sitemap
  (`https://www.demaceo.com/sitemap.xml`) is submitted there by hand. Nothing in the code does it.

> ⚠️ `SITE_URL` must be the host that actually serves pages. `demaceo.com` 308-redirects to
> `www.demaceo.com` (checked live 2026-11-10), so it is the `www` host. `metadataBase` once
> pointed at `demaceovincent.com`, which made every canonical and Open Graph URL resolve to a
> foreign host. If the redirect direction in the Vercel domain settings changes, change `SITE_URL`.

> ⚠️ Keep `/woozyx3` (secret-code gate) out of `src/app/sitemap.ts`, and do not add it to
> `src/app/robots.ts`: a `Disallow` line is public and would advertise the path. `/versus` is
> another project mounted by a rewrite in `next.config.ts` and sends `noindex` itself.

> ⚠️ Canonicals are set per page (`pageMetadata`), never in the root layout. A layout-level
> canonical would be inherited by `/woozyx3` and tell crawlers it is a duplicate of another page.

> ⚠️ Next replaces `openGraph` wholesale when a page sets its own; nested fields are not merged.
> A page that writes its own `openGraph` object silently loses the image. Build it with
> `siteOpenGraph()` in `src/lib/seo.ts`, which is the one place the image is declared.

> ⚠️ `/scrapbook` is a real route but `indexable: false` in `APP_ROUTES`: it is `noindex` and not
> in the sitemap (photos and captions, nothing to summarise). Flip the flag to change both at once;
> do not set one without the other.

> ⚠️ `squabble.demaceo.com` is a different host: the `beforeFiles` rewrite in `next.config.ts`
> proxies every path on it, `/sitemap.xml` and `/robots.txt` included, to the Worker. This app's
> sitemap cannot cover it; it would need its own, served by that project.

> ⚠️ The copy is aimed at employers and recruiters and leads with the résumé's role and stack. It
> lives only in `src/lib/constants/site.ts` (home title, description, role, names) and
> `src/lib/constants/appRoutes.ts` (per-route titles and descriptions); nothing else hard-codes it.
> The welcome window and the text layer read the same constants, so the title, the structured data
> and what the page shows cannot drift apart. The taskbar's "Developer | Designer" is deliberate and
> is separate from the role constant.

> ⚠️ Two names are in play on purpose: `SITE_FULL_NAME` ("Demaceo Vincent Howard", the résumé name)
> leads the home title and the JSON-LD `name`, and `SITE_NAME` ("Demaceo Vincent") is the short form
> used in sub-page titles and as the JSON-LD `alternateName`. Keep both, so a search for either
> connects.

> ⚠️ No em dashes in any of this copy (see `CLAUDE.md`). The home title uses a colon between the name
> and the role for that reason; `npx eslint src` fails on a violation.
