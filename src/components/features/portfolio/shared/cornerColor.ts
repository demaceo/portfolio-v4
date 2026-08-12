import * as d3 from "d3";

// Documentary projects keep the fixed green corner used by the "Documentary"
// tag elsewhere in the app; every other project gets its own color from a
// hue rotation anchored at --noir-accent's hue — same pattern already used
// for per-item coloring in SkillsetAppView/ToolbeltGraph.tsx.
export const DOC_CORNER_COLOR = "#0f9d6b"; // --noir-doc
const CORNER_HUE_START = 21; // --noir-accent's own hue (#d4845a)
const CORNER_SATURATION = 0.48;
const CORNER_LIGHTNESS = 0.6;

export function cornerColorFor(index: number, count: number): string {
  const hue = (CORNER_HUE_START + index * (360 / count)) % 360;
  return d3.hsl(hue, CORNER_SATURATION, CORNER_LIGHTNESS).formatHex();
}
