---
title: About chapters
type: subsystem
created: 2026-11-12
updated: 2026-11-12
sources:
  - code: src/components/features/about/AboutAppView/AboutAppView.tsx
  - code: src/components/features/about/AboutAppView/AboutAppView.module.css
  - code: src/data/aboutMePills.ts
verified_at: b6159e5
---

# About chapters

The About app (`/mindset`) shows three chapters as [[services-slides]]-style plates: Profile,
Strengths, Featured. Each opens with the big accent counter, an eyebrow and an uppercase title
(`ChapterHead`; `compact` puts the counter beside the title). One bottom bar holds prev/next and
labeled tabs; ←/→ inside the view also navigate. See [[project-detail-modal]] for the same grammar.

- **Profile**: name, a cycling "I build ___" line, the lede, `profileHighlights` as a 2×2 fact
  grid, and the headshot (`public/images/headshot.jpg`) in a tilted card.
- **Strengths**: every `aboutMePills` entry as a card in a 4-column grid, plus a résumé card.
- **Featured**: the PBS documentary (opens the documentary modal) and the SXSW EDU panel, as two
  equal 16:9 cards.

> ⚠️ The chapter centers with `margin: auto` inside the scrolling `.stage`, not with
> `justify-content: center`, which clips the top of a chapter taller than the stage.

> ⚠️ The layout is tuned so every chapter fits 1440×900 without scrolling, and a
> `max-height: 800px` query tightens it for laptops. Re-check both after adding a strength or a
> featured item: a fifth row of cards or a third featured card will not fit.

> ⚠️ On phones the prev/next arrows are hidden and the three tabs share the bar equally. With the
> arrows shown the bar was wider than a 390px screen.

> ⚠️ The "I build" word sits in a fixed-height slot and is hidden from screen readers; the full
> word list is in a visually hidden span next to it. Keep both when changing the words.
