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
  - code: src/hooks/useShortcutLabel.ts
  - code: src/components/features/command/PaletteContext.ts
  - code: src/components/features/contact/ContactForm/ContactForm.css
  - code: tsconfig.json
  - code: src/components/features/resume/InteractiveResume/InteractiveResume.tsx
  - code: src/components/features/resume/InteractiveResume/InteractiveResume.css
  - code: src/components/features/skills/SkillsetAppView/ToolbeltGraph.tsx
  - code: src/components/layout/LandingPage/components/SearchButton.tsx
  - code: src/data/DemaceoResume.tsx
  - code: public/resume/Demaceo_Vincent_Howard_Resume.pdf
verified_at: 5f3bf32
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
full-bleed background for AppViews, which have no blur scrim behind them;
`--gl-surface-solid` (`src/app/globals.css:181`) is its fully opaque twin.

> ⚠️ The accent is copper (\`--gl-accent\`, the Warm Noir hue tuned for contrast), not blue.
> \`ToolbeltGraph.tsx\` hard-codes that hue as \`ROOT_HUE_START\` (about 20°) so its first category
> matches the accent: change both together.

## The token bridge (`.glass-scope`)

Most content stylesheets were written against the older Warm Noir tokens (`--noir-*`,
`--lg-*`). Instead of rewriting them, `.glass-scope` (`src/app/globals.css:198`)
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

> ⚠️ `--lg-tint-solid` must map to an *opaque* Glass color (`--gl-surface-solid`), not
> `--gl-surface`. Legacy users rely on it being solid — the Projects Coverflow card face
> and the Toolbelt tool card would otherwise let overlapping content bleed through.

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
the MenuBar "Projects" item, the global Cmd/Ctrl+K listener
(`src/components/layout/LandingPage/LandingPage.tsx:48`) and the one on-screen `SearchButton`
(`src/components/layout/LandingPage/components/SearchButton.tsx`). That component has two looks,
picked by CSS in `src/components/layout/LandingPage/LandingPage.menu.css`: on a mouse desktop a
compact pill with the shortcut label seated in the taskbar strip (floating in the corner while an app is open), and on
phones/touch (the media query that hides the MenuBar) an icon-only circle at the top right.

> ⚠️ Keep the desktop pill inside the taskbar strip, not floating above it. The icon wheel's lowest
> rows curve into the bottom-right corner; a pill above the strip covered the "Contact" label at
> 1366×768 and crowded "Scrapbook" on larger screens. The wheel is clipped at the strip's top edge,
> so the strip is the one place they cannot meet.

> ⚠️ The palette is rendered from `LandingPage`, not inside `MenuBar`
> (`src/components/layout/LandingPage/LandingPage.tsx:199`). `.menu-bar` has a `backdrop-filter`, and an ancestor with a
> filter becomes the containing block for `position: fixed` descendants — a palette
> rendered inside the bar is positioned and clipped relative to the bar, not the viewport.

> ⚠️ Picking a project from the palette while the Projects AppView is already open does
> not remount the view. `ProjectsAppView` adopts the request during render, keyed on
> `initialProjectId` *and* `projectRequestKey`
> (`src/components/features/portfolio/ProjectsAppView/ProjectsAppView.tsx:40`), which
> LandingPage bumps on every pick. Keying on the id alone made re-picking the same project
> (after closing its sheet) a silent no-op.

> ⚠️ Palette search folds case *and* diacritics (`fold`,
> `src/components/features/command/CommandPalette.tsx:29`) so "resume" finds "résumé", and
> its key handler ignores keys while an IME is composing
> (`src/components/features/command/CommandPalette.tsx:107`); without that, Enter that
> commits a Japanese/Chinese/Korean word also opens the highlighted result.

On phones and touch devices the palette is reachable from the home-screen
`SearchButton` and from a search button in every AppView title bar
(`src/components/features/shell/AppView.tsx:31`), which reads the opener from
`PaletteContext` (provided by LandingPage) — so shells don't need to know who renders the
palette.

## Project artwork

> ⚠️ Never size project icons with `max-width/max-height: %` on a grid item whose box
> comes from `aspect-ratio`: the percentage does not resolve, the cap is ignored, and tall
> art (Pinpoint's 2:3 pin) overflows and is clipped by `overflow: hidden`. The project
> detail card pins the image to an explicit box and uses `object-fit: contain`; see
> [[project-detail-modal]].
> Never add `border-radius` or `object-fit: cover` to icon artwork — icons are transparent
> PNGs and must show in full.

## Per-surface notes

- **Toolbelt graph** (`src/components/features/skills/SkillsetAppView/ToolbeltGraph.tsx:573`):
  d3 sets only `--node-hue`/`--node-depth` on each node; the CSS derives the fill, so nodes
  follow light/dark without re-rendering.

> ⚠️ Don't hard-code colors in d3 (`.attr("fill", "#…")`) for anything inside a Glass
> surface — they can't follow the OS theme. Set a CSS custom property and color it in CSS.

### Résumé

The on-screen résumé renders `src/data/DemaceoResume.tsx`; its "Download PDF" link serves
the owner's hand-designed PDF as a static file,
`public/resume/Demaceo_Vincent_Howard_Resume.pdf`. (An earlier html2canvas + jsPDF
exporter that rasterised the modal was removed with the switch.)

> ⚠️ The PDF and `src/data/DemaceoResume.tsx` are two copies of the same résumé. When the
> owner sends a new PDF, update the data file to match — and vice versa — or the site
> shows one résumé and downloads another.

> ⚠️ The published PDF must have the phone number *removed*, not covered: a white box
> leaves the text selectable and searchable. Redact with a tool that deletes the text
> (e.g. PyMuPDF `apply_redactions`) and check with `pdftotext` that the number is gone.
> The repository is public, so committing the PDF publishes it.

> ⚠️ `src/components/features/resume/InteractiveResume/InteractiveResume.css` is a *global*
> stylesheet, not a CSS module: its rules apply site-wide. Its `.control-button` rules
> style the Documentary header buttons (`src/components/features/media/DocumentaryPlayer/components/DocumentaryHeader.tsx`), not the résumé, and its
> reduced-motion `*` rule affects every page. Before deleting a rule here, grep all of
> `src` for the class, not just the résumé.

> ⚠️ A `var()` with no fallback whose custom property is never defined makes that
> declaration behave as `unset`, which can still override another rule for the same
> element. The résumé's old `--ios-*`/`--space-*`/`--shadow-*` variables were defined on a
> class that never rendered, so the `.control-button` declarations that use them are
> "dead" but not inert — leave them unless you check the Documentary visually.

## Contact form

> ⚠️ `.contact-invite` must keep its natural height (`flex: none`) and clip only the x-axis
> (`overflow-x: clip`, `src/components/features/contact/ContactForm/ContactForm.css:26`).
> `overflow: hidden` with `flex: 1; min-height: 0` made it shrink to the sheet and clip the
> message step on short phones, hiding the Send button; the sheet's `.content` is the
> scroll container.

## Imports

> ⚠️ Import hooks from the `@/hooks` barrel, not `@/hooks/<name>`. `tsconfig.json:33`
> maps `@/hooks/*` to `src/lib/hooks/*` (which does not exist), while the barrel resolves
> through `@/*` to `src/hooks/index.ts`.

## Related

Contact form specifics (EmailJS fields) live in
`src/components/features/contact/ContactForm/ContactForm.tsx`; no page covers it yet.
