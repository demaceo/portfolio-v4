---
title: Glass overlays (modals, AppViews, ⌘K palette)
type: subsystem
created: 2026-11-05
updated: 2026-11-05
sources:
  - code: src/app/globals.css
  - code: src/components/features/modal/ModalFrame.tsx
  - code: src/components/features/modal/ModalShell.tsx
  - code: src/components/features/modal/ModalFrame.module.css
  - code: src/components/features/shell/AppView.tsx
  - code: src/components/features/command/CommandPalette.tsx
  - code: src/components/features/portfolio/ProjectDetailModal/ProjectDetailModal.module.css
  - code: src/components/layout/LandingPage/LandingPage.tsx
  - code: src/components/layout/LandingPage/LandingPage.menu.css
  - code: src/hooks/useMediaQuery.ts
  - code: tsconfig.json
verified_at: 0b8fabb
---

# Glass overlays

Everything that opens *over* the desktop — every floating modal, every full-screen
AppView, the ⌘K command palette and the MenuBar's About/Services popovers — uses one
"Glass" design system. The desktop itself (wallpaper, MenuBar chrome, desktop icons, the
mobile app dock) keeps its own look and is **not** themed by it.

## Tokens and light/dark

All Glass colors are `--gl-*` custom properties in `src/app/globals.css:105` (light, on
`:root`) with dark overrides under `prefers-color-scheme: dark` at
`src/app/globals.css:142`. There is no in-app theme toggle: the overlays follow the
visitor's OS appearance. `--gl-surface` (`src/app/globals.css:177`) is the near-opaque
full-bleed background for AppViews, which have no blur scrim behind them.

## The token bridge (`.glass-scope`)

Most content stylesheets were written against the older Warm Noir tokens (`--noir-*`,
`--lg-*`). Instead of rewriting them, `.glass-scope` (`src/app/globals.css:194`)
re-declares those variable names to point at `--gl-*` values. `ModalFrame` and `AppView`
put `glass-scope` on their root element, so any content inside resolves the old names to
Glass colors and follows light/dark automatically. The MenuBar sits outside the scope, so
the same variable names still give it Warm Noir there.

> ⚠️ Hard-coded color literals bypass the bridge. A `rgba(240, 236, 232, …)` cream text or
> `rgba(212, 132, 90, …)` copper written directly in a content stylesheet stays dark-theme
> colored inside a light Glass surface and becomes unreadable. Use `--gl-*` tokens (or the
> bridged `--noir-*` names) in anything rendered inside a modal or AppView.

> ⚠️ New code should use `--gl-*` directly. The `--noir-*`/`--lg-*` names mean different
> colors inside and outside `.glass-scope`, which is only acceptable for legacy content.

## Shells

- **`ModalFrame`** (`src/components/features/modal/ModalFrame.tsx`) is the only modal
  shell. `presentation="window"` floats centered; `"sheet"` docks to the bottom edge.
  On phones (`SHEET_MEDIA_QUERY`, `src/hooks/useMediaQuery.ts:30`) every modal becomes
  a bottom sheet regardless of the prop (`src/components/features/modal/ModalFrame.tsx:46`). The header shows `eyebrow`,
  falling back to `title`; the dialog's accessible name is a visually-hidden element
  carrying `titleId`, so consumers must **not** put that id on their own heading.
- **`ModalShell`** (`src/components/features/modal/ModalShell.tsx`) owns overlay-stack,
  Esc, focus trap, scroll lock and focus return. `motionPreset="sheet"` slides up
  (`src/components/features/modal/ModalShell.tsx:73`); reduced motion cross-fades. `initialFocusRef` focuses a specific
  element (the palette's input) instead of the dialog (`src/components/features/modal/ModalShell.tsx:40`).
- **`AppView`** (`src/components/features/shell/AppView.tsx`) is the full-screen
  takeover; it carries `glass-scope` too.

> ⚠️ Only the overlay carries `backdrop-filter`; the modal frame never does. The frame
> animates `transform`, and a blur on a transforming element is re-sampled every frame.
> The frame is a translucent material over the already-blurred scrim instead.

## ⌘K command palette

`src/components/features/command/CommandPalette.tsx` lists active projects plus actions
(contact, résumé). It uses the combobox/listbox pattern: focus stays in the input and ↑/↓
move `aria-activedescendant` (`src/components/features/command/CommandPalette.tsx:198`); options use `onMouseDown`
preventDefault so clicking doesn't steal focus (`src/components/features/command/CommandPalette.tsx:152`). It opens from
the MenuBar "Projects" item, the MenuBar ⌘K button, the global Cmd/Ctrl+K listener
(`src/components/layout/LandingPage/LandingPage.tsx:48`) and, on phones/touch, the
floating `MobileSearchButton` (`src/components/layout/LandingPage/LandingPage.tsx:137`), which is shown only under the same
media query that hides the MenuBar (`src/components/layout/LandingPage/LandingPage.menu.css:431`).

> ⚠️ The palette is rendered from `LandingPage`, not inside `MenuBar`
> (`src/components/layout/LandingPage/LandingPage.tsx:199`). `.menu-bar` has a `backdrop-filter`, and an ancestor with a
> filter becomes the containing block for `position: fixed` descendants — a palette
> rendered inside the bar is positioned and clipped relative to the bar, not the viewport.

> ⚠️ Picking a project from the palette while the Projects AppView is already open only
> changes `initialProjectId`; it does not remount the view. `ProjectsAppView` adopts the
> new id during render (`src/components/features/portfolio/ProjectsAppView/ProjectsAppView.tsx:34`).
> Removing that block makes palette picks silently do nothing while Projects is open.

## Project artwork

> ⚠️ Never size project icons with `max-width/max-height: %` on a grid item whose box
> comes from `aspect-ratio`: the percentage does not resolve, the cap is ignored, and tall
> art (Pinpoint's 2:3 pin) overflows and is clipped by `overflow: hidden`. The detail
> sheet pins the image to absolute insets and uses `object-fit: contain`
> (`src/components/features/portfolio/ProjectDetailModal/ProjectDetailModal.module.css:51`).
> Never add `border-radius` or `object-fit: cover` to icon artwork — icons are transparent
> PNGs and must show in full.

## Imports

> ⚠️ Import hooks from the `@/hooks` barrel, not `@/hooks/<name>`. `tsconfig.json:33`
> maps `@/hooks/*` to `src/lib/hooks/*` (which does not exist), while the barrel resolves
> through `@/*` to `src/hooks/index.ts`.

## Related

Contact form specifics (EmailJS fields) live in
`src/components/features/contact/ContactForm/ContactForm.tsx`; no page covers it yet.
