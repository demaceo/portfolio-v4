---
title: Services slides (Skillset app)
type: subsystem
created: 2026-11-10
updated: 2026-11-10
sources:
  - code: src/components/features/skills/SkillsetAppView/SkillsetAppView.tsx
  - code: src/components/features/skills/SkillsetAppView/SkillsetAppView.module.css
  - code: src/data/services.ts
verified_at: 5655253
---

# Services slides

The Services tab of the Skillset app shows one service at a time from `src/data/services.ts`: a
horizontal carousel of services (arrows, dots, swipe, ←/→) and, per service, a vertical carousel of
panels (Overview, then each entry in `panels`; ↑/↓ or the right-hand rail). See [[glass-overlays]]
for the app shell around it.

Each slide is an oversized illustration (`.plateArt`, the service's `icon`) cropped off the
top-right corner, and a left-aligned copy column (`.plateCopy`). On phones (≤640px) the illustration
sits behind the copy, which becomes a frosted Glass card near the bottom.

> ⚠️ Position `.plateArt` with offsets (`top`/`right`/`left`/`width`), never `transform`:
> framer-motion owns that element's transform for the entrance scale, and a CSS transform on it is
> overwritten. The illustration's own tilt and drift live on the inner image (`.plateArtImg`).

> ⚠️ The illustration's left edge is masked (`mask-image`) so it fades out before the copy column.
> If you widen `.plateCopy` or the art, re-check at ~1024px wide, where the two meet first.

> ⚠️ The service icons are 1024px PNGs with transparent backgrounds. The layout relies on both:
> a smaller or opaque-backed image would look blurry or boxed at this size.

> ⚠️ Anything placed over the illustration needs its own backing to stay visible: the vertical
> rail (`.plateVRail`) has a frosted pill for this reason.
