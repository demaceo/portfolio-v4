/**
 * Random-number source for world generation.
 *
 * The reference engine calls `Math.random()` directly, so every load builds a
 * different village. That is still the default here — pass no seed and you get
 * exactly that behaviour. Passing a seed makes the layout reproducible, which is
 * what an embedder wants when every visitor should see the same curated world.
 */

export interface Rng {
  /** Uniform in [0, 1), the `Math.random()` contract. */
  next(): number;
  /** Uniform in [a, b) — the engine's `rand(a, b)`. */
  range(a: number, b: number): number;
  /** Uniform choice from a non-empty list — the engine's `arr[(Math.random()*n)|0]`. */
  pick<T>(items: readonly T[]): T;
  /** A point in the annulus between `minR` and `maxR`, uniform by area. */
  scatter(minR: number, maxR: number): [number, number];
}

/** Mulberry32 — small, fast, and good enough for scattering trees. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRng(seed?: number): Rng {
  const next = seed == null ? Math.random : mulberry32(seed);
  const range = (a: number, b: number) => a + next() * (b - a);
  return {
    next,
    range,
    pick: (items) => items[(next() * items.length) | 0],
    scatter: (minR, maxR) => {
      const a = next() * Math.PI * 2;
      const r = Math.sqrt(range(minR * minR, maxR * maxR));
      return [Math.cos(a) * r, Math.sin(a) * r];
    },
  };
}
