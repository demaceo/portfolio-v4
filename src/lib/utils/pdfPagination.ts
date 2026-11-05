// Page-break planning for exporting a single tall DOM capture (html2canvas)
// as a multi-page PDF. Pure functions only — no DOM or PDF library imports —
// so the logic can be reasoned about and tested in isolation.

/** US Letter in PostScript points (72 pt = 1 in). */
export const LETTER_PT = { width: 612, height: 792 } as const;

export interface PageSlice {
  /** Inclusive start, in source pixels (canvas pixels). */
  start: number;
  /** Exclusive end, in source pixels. */
  end: number;
}

/**
 * Split a capture of `totalHeight` px into slices no taller than
 * `pageHeight` px, preferring to cut exactly at one of `candidates`
 * (y-offsets where cutting is safe: the top edge of a heading, card, row…).
 *
 * - A page breaks at the latest candidate that fits on it, so content is
 *   never split mid-line when a safe boundary exists.
 * - A candidate is only used if the page would end at least `minFill` full,
 *   so one early boundary can't produce a near-empty page; past that, and
 *   when no candidate fits (a single block taller than a page), the page is
 *   hard-cut at `pageHeight`.
 */
export function planPageSlices(
  totalHeight: number,
  pageHeight: number,
  candidates: number[],
  minFill = 0.6
): PageSlice[] {
  if (totalHeight <= 0 || pageHeight <= 0) return [];
  const sorted = Array.from(new Set(candidates.map(Math.round)))
    .filter((c) => c > 0 && c < totalHeight)
    .sort((a, b) => a - b);

  const slices: PageSlice[] = [];
  let start = 0;
  while (start < totalHeight) {
    const limit = start + pageHeight;
    if (limit >= totalHeight) {
      slices.push({ start, end: totalHeight });
      break;
    }
    const floor = start + pageHeight * minFill;
    let end = limit; // hard cut if no safe boundary fits
    for (const c of sorted) {
      if (c > limit) break;
      if (c >= floor) end = c;
    }
    slices.push({ start, end });
    start = end;
  }
  return slices;
}

/**
 * Safe break offsets inside `container`: the top edge of every element
 * matching `selector`, relative to the container's top, in CSS px.
 * Breaking at an element's TOP keeps a heading with what follows it.
 */
export function measureBreakCandidates(container: HTMLElement, selector: string): number[] {
  const top = container.getBoundingClientRect().top;
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).map(
    (el) => el.getBoundingClientRect().top - top
  );
}
