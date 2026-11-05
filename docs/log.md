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
