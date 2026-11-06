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
