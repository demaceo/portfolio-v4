---
title: Project detail modal
type: subsystem
created: 2026-11-12
updated: 2026-11-12
sources:
  - code: src/components/features/portfolio/ProjectDetailModal/ProjectDetailModal.tsx
  - code: src/components/features/portfolio/ProjectDetailModal/ProjectDetailModal.module.css
  - code: src/components/features/portfolio/shared/ProjectMedia.tsx
  - code: src/components/features/portfolio/ProjectsAppView/ProjectsAppView.tsx
verified_at: 903c634
---

# Project detail modal

Opening a project in the Projects app shows one project as a floating Glass card
(`ModalFrame`, window presentation; a bottom sheet on phones, see [[glass-overlays]]). The layout
copies the [[services-slides]] plates: the artwork bleeds off the right edge behind a left copy
column (counter, uppercase title, status/year chips, description, "What's inside" check points,
"Built with" chips), and a bottom bar holds prev/dots/next and the actions. ←/→ and swipe move
between projects; `ProjectsAppView` passes the list the project was opened from (`projects`), which
drives the counter and dots.

The art depends on `getProjectMediaKind` (`ProjectMedia.tsx`), exposed on the plate as
`data-media`:

- `icon`: a transparent PNG, oversized with an accent glow and a slow drift, sized per project by
  `--icon-scale` (capped at 1.5).
- `image`: a screenshot, GIF or thumbnail, shown inside a tilted faux browser window whose URL bar
  shows the link's hostname.
- `glyph`: the FontAwesome fallback for older projects.

On phones the art becomes a banner above the copy and the whole plate scrolls under the pinned
action bar.

> ⚠️ `.art` shares a `layoutId` with the coverflow card and `.artInner` runs an entrance scale, so
> framer-motion writes inline `transform`s on both. Position `.art` with offsets only, and put any
> tilt on a child (`.browser`, `.illustration`). A CSS transform on either motion element is
> silently replaced by `transform: none`.

> ⚠️ `.detail` must stay `flex: none` with an explicit height on desktop. With `flex: 1` (a zero
> basis) inside ModalFrame's auto-height content column the height is ignored, the card shrinks to
> its copy, and its size jumps on every prev/next. Phones switch back to `flex: 1 1 auto`.

> ⚠️ The icon art box spans the plate's full height (`top: 0; bottom: 0`). The plate, not the frame,
> is the clip edge, so letting the box rise above it (as the Services art does) cuts tall icons
> such as Pinpoint with a hard line under the header.

> ⚠️ The copy centers with `margin-block: auto` inside the `.scroll` container, not with
> `justify-content: center`, which would clip the top of a long column instead of letting it scroll.
