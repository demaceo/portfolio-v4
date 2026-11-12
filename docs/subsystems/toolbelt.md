---
title: Toolbelt (Skillset)
type: subsystem
created: 2026-11-12
updated: 2026-11-12
sources:
  - code: src/data/toolbelt.ts
  - code: src/lib/utils/toolbeltTree.ts
  - code: src/lib/utils/toolUsage.ts
  - code: src/components/features/skills/SkillsetAppView/ToolbeltGraph.tsx
  - code: src/components/features/skills/SkillsetAppView/ToolbeltGraph.module.css
verified_at: 3bd73c8
---

# Toolbelt

The Skillset app's Toolbelt tab. Tools live in `src/data/toolbelt.ts`, in display order (categories
appear in the order of their first tool). `signature: true` marks the core stack, drawn in copper;
everything else is neutral. Picking a tool shows "Shipped in" (projects whose `stackPreview` lists
it) and "Used in" (services whose "Tech & tools" tags list it), from `buildToolUsageIndex` and
`usageForTool` in `src/lib/utils/toolUsage.ts`.

Wider than 1300px: a d3 graph (category roots pinned in a grid, tools on rings around them) with a
details panel beside it. 1300px and below: the same tools as a grouped chip list, with the details
in a bottom sheet. Copper is the only hue (see [[glass-overlays]]).

> ⚠️ Usage matching is exact-string. A tool spelled differently in a project's `stackPreview` or a
> service tag (`Expo SDK 54`, `Gemini 2.5 Pro`, `Express.js`) needs that spelling in its
> `aliases`, or the tool silently shows no projects.

> ⚠️ Leaves are placed by `forceX`/`forceY` toward a slot on an ellipse around their root
> (`ringOffset`), not by charge. Many-body repulsion is off on purpose: it pushed tools into
> neighbouring categories. Ring size is capped to just under half the spacing between roots; raise
> that cap and clusters interleave again.

> ⚠️ `LIST_MEDIA_QUERY` (1300px) is where the canvas beside the details panel stops fitting ~40
> labelled tools. Adding many tools, or a category, means re-checking 1366×768 and 1440×900 before
> lowering it.

> ⚠️ The mount-once d3 effect depends on `isCompact`: the `<svg>` only exists in the wide layout,
> so the simulation must be rebuilt when the window grows past the breakpoint.

> ⚠️ Category roots are re-sorted to paint last, and their labels carry a halo stroke. Without both,
> a neighbouring tool's circle covers labels like "CLOUD & DATA".

> ⚠️ The Escape handler and focus move apply only to the compact bottom sheet, through the shared
> overlay stack. The wide details panel is not modal; giving it the Escape handler would close the
> panel instead of the Skillset window, or both.
