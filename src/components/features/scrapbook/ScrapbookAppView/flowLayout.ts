/**
 * Generative geometry for the Scrapbook flow map.
 *
 * The source pen (codepenz "Horizontal Flow Map") hand-placed every card
 * coordinate and every SVG connector path. Here those become pure functions of
 * the item index, so the map lays itself out for any number of entries: cards
 * march left-to-right along a gentle serpentine, connectors are auto-generated
 * S-curves between consecutive cards, and the canvas width grows to fit.
 *
 * The GSAP pin/scrub mechanics in ScrapbookAppView read the resulting sizes off
 * the live DOM (`canvas.scrollWidth`, etc.), so nothing about the scroll
 * animation needs to change when the content count does.
 */

export interface Position {
  x: number;
  y: number;
}

/** Vertical center line of the canvas (also CANVAS_HEIGHT / 2). */
export const BASELINE_Y = 500;
/** Total canvas height — the coordinate space shared by cards and the SVG viewBox. */
export const CANVAS_HEIGHT = 1000;
/** Horizontal padding before the first and after the last card center. */
export const MARGIN_X = 320;
/** Horizontal distance between consecutive card centers. */
export const CARD_SPACING_X = 480;
/** How far cards swing above/below the baseline (kept modest so cards stay
 *  vertically visible even in a shorter desktop window). */
export const WAVE_AMPLITUDE = 150;
/** Phase step per card — π/2 yields a center → down → center → up serpentine. */
export const WAVE_PHASE = Math.PI / 2;
/** Extra horizontal runway past the last card (matches the pen's +200). */
export const END_PAD = 200;
/** Floor so a 1–2 item map still has room to breathe. */
const MIN_CANVAS_WIDTH = 1400;

/** Card position for a given index along the serpentine path. */
export function positionFor(index: number): Position {
  return {
    x: MARGIN_X + index * CARD_SPACING_X,
    y: BASELINE_Y + WAVE_AMPLITUDE * Math.sin(index * WAVE_PHASE),
  };
}

/** All card positions for `count` items, in order. */
export function computePositions(count: number): Position[] {
  return Array.from({ length: count }, (_, i) => positionFor(i));
}

/**
 * Cubic-Bézier connector between two card centers, with horizontal tangents at
 * both ends (matching the pen's S-curve style). Degenerates to a straight
 * horizontal line when the two cards share a baseline (a.y === b.y).
 */
export function buildConnectorPath(a: Position, b: Position): string {
  const midX = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`;
}

/** One connector path per consecutive pair of positions. */
export function buildConnectors(positions: Position[]): string[] {
  const paths: string[] = [];
  for (let i = 0; i < positions.length - 1; i += 1) {
    paths.push(buildConnectorPath(positions[i], positions[i + 1]));
  }
  return paths;
}

/** Canvas dimensions sized to fit `count` cards. */
export function computeCanvasSize(count: number): {
  width: number;
  height: number;
} {
  const spanned = MARGIN_X * 2 + Math.max(0, count - 1) * CARD_SPACING_X;
  return { width: Math.max(MIN_CANVAS_WIDTH, spanned), height: CANVAS_HEIGHT };
}
