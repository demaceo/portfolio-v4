import * as THREE from 'three';
import { createRng, type Rng } from './rng';
import { PATH_HW, WORLD_R } from './constants';

/**
 * Procedural layout for the village, ported from `world/engine.js`.
 *
 * This produces plain data only — no THREE objects beyond the path curve maths,
 * no scene mutation. The r3f scene calls `generateWorld` once inside a `useMemo`
 * and maps the result to JSX, so nothing here ever re-runs on a re-render, let
 * alone per frame.
 *
 * Random draws happen in the same order as the reference engine, so a given
 * seed produces a layout of the same character (and no seed reproduces today's
 * every-load-is-different behaviour exactly).
 */

export interface TreeSpec {
  kind: 'broad' | 'pine';
  x: number;
  z: number;
  rotY: number;
  scale: number;
  /** Broad-leaf foliage colour; unused by pines, which have fixed tiers. */
  foliageHex: string;
  /** Random euler for the main foliage blob (broad-leaf only). */
  blobRot: [number, number, number];
}

export interface HouseSpec {
  x: number;
  z: number;
  rotY: number;
  w: number;
  dp: number;
  hh: number;
  wallHex: string;
  roofHex: string;
}

export interface ToriiSpec {
  x: number;
  z: number;
  rotY: number;
}

export interface MailboxSpec {
  x: number;
  z: number;
  rotY: number;
}

export interface LampSpec {
  x: number;
  z: number;
}

export interface ShadowSpec {
  x: number;
  z: number;
  r: number;
}

export interface PondSpec {
  x: number;
  z: number;
  r: number;
  lilies: { x: number; z: number }[];
}

export interface FlowerSpec {
  x: number;
  z: number;
  hex: string;
}

export interface RockSpec {
  x: number;
  z: number;
  rotY: number;
  r: number;
}

export interface CloudSpec {
  x: number;
  y: number;
  z: number;
  puffs: { x: number; y: number; z: number; r: number }[];
}

export interface PathData {
  positions: Float32Array;
  edges: Float32Array;
  index: Uint16Array;
}

export interface WorldData {
  path: PathData;
  houses: HouseSpec[];
  mailboxes: MailboxSpec[];
  lamps: LampSpec[];
  torii: ToriiSpec[];
  trees: TreeSpec[];
  ponds: PondSpec[];
  flowers: FlowerSpec[];
  rocks: RockSpec[];
  clouds: CloudSpec[];
  shadows: ShadowSpec[];
}

const HOUSE_WALLS = ['#e8b4a0', '#ecd49b', '#a9cbe3', '#cdb4e0', '#e6c0b0'] as const;
const HOUSE_ROOFS = ['#6b4a3a', '#8a5a42', '#5f6e46'] as const;
const BROAD_FOLIAGE = ['#4f9a48', '#5aa84f', '#46913f'] as const;
const FLOWER_COLORS = ['#e8643c', '#f0c64a', '#f4f4f4', '#e86ca0'] as const;

/** Control points of the village road. Fixed — the road is authored, not random. */
const PATH_POINTS: [number, number][] = [
  [-130, -60],
  [-85, -78],
  [-48, -42],
  [-18, -58],
  [12, -26],
  [26, 16],
  [-6, 46],
  [-36, 66],
  [-14, 96],
  [36, 112],
  [80, 98],
  [122, 124],
];

/** Perpendicular to a tangent, in the ground plane. */
function perpXZ(t: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(t.z, 0, -t.x).normalize();
}

/** Ribbon of triangles following the road, with an `aEdge` attribute for the soft edges. */
function buildPath(curve: THREE.CatmullRomCurve3): PathData {
  const N = 240;
  const pos: number[] = [];
  const edge: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const p = curve.getPoint(t);
    const tan = curve.getTangent(t);
    tan.y = 0;
    tan.normalize();
    const pp = perpXZ(tan);
    pos.push(p.x + pp.x * PATH_HW, 0.04, p.z + pp.z * PATH_HW, p.x - pp.x * PATH_HW, 0.04, p.z - pp.z * PATH_HW);
    edge.push(-1, 1);
  }
  for (let i = 0; i < N; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = i * 2 + 2;
    const d = i * 2 + 3;
    idx.push(a, b, d, a, d, c);
  }
  return { positions: new Float32Array(pos), edges: new Float32Array(edge), index: new Uint16Array(idx) };
}

export function generateWorld(seed?: number): WorldData {
  const rng: Rng = createRng(seed);
  const { range, pick, next, scatter } = rng;

  const curve = new THREE.CatmullRomCurve3(
    PATH_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false,
    'centripetal',
  );

  /** Coarse samples of the road, used to keep scattered props off it. */
  const pathSamples: THREE.Vector3[] = [];
  for (let i = 0; i <= 120; i++) pathSamples.push(curve.getPoint(i / 120));

  const distToPath = (x: number, z: number) => {
    let m = 1e9;
    for (const p of pathSamples) {
      const dx = x - p.x;
      const dz = z - p.z;
      const d = dx * dx + dz * dz;
      if (d < m) m = d;
    }
    return Math.sqrt(m);
  };

  const houses: HouseSpec[] = [];
  const mailboxes: MailboxSpec[] = [];
  const lamps: LampSpec[] = [];
  const torii: ToriiSpec[] = [];
  const trees: TreeSpec[] = [];
  const ponds: PondSpec[] = [];
  const flowers: FlowerSpec[] = [];
  const rocks: RockSpec[] = [];
  const clouds: CloudSpec[] = [];
  const shadows: ShadowSpec[] = [];

  // Houses along the road, alternating sides, each turned to face it.
  const nH = 11;
  for (let k = 0; k < nH; k++) {
    const t = Math.min(0.97, Math.max(0.03, (k + 0.5) / nH + range(-0.02, 0.02)));
    const p = curve.getPoint(t);
    const tan = curve.getTangent(t);
    tan.y = 0;
    tan.normalize();
    const pp = perpXZ(tan);
    const side = k % 2 ? 1 : -1;
    const off = PATH_HW + range(2.2, 3.0);
    const hx = p.x + pp.x * off * side;
    const hz = p.z + pp.z * off * side;

    const wallHex = pick(HOUSE_WALLS);
    const roofHex = pick(HOUSE_ROOFS);
    const w = range(2.2, 2.8);
    const dp = range(2.0, 2.6);
    const hh = range(1.8, 2.4);

    const dir = new THREE.Vector3(p.x - hx, 0, p.z - hz).normalize();
    const rotY = Math.atan2(dir.x, dir.z);

    houses.push({ x: hx, z: hz, rotY, w, dp, hh, wallHex, roofHex });
    shadows.push({ x: hx, z: hz, r: Math.max(w, dp) * 0.85 });

    if (k % 2 === 0) {
      const mx = hx + dir.x * (off - 1.0);
      const mz = hz + dir.z * (off - 1.0);
      mailboxes.push({ x: mx, z: mz, rotY });
      shadows.push({ x: mx, z: mz, r: 0.4 });
    }
  }

  // Street lamps, also alternating sides.
  for (let s = 0; s < 7; s++) {
    const t = (s + 0.5) / 7;
    const p = curve.getPoint(t);
    const tan = curve.getTangent(t);
    tan.y = 0;
    tan.normalize();
    const pp = perpXZ(tan);
    const side = s % 2 ? 1 : -1;
    const lx = p.x + pp.x * (PATH_HW + 0.5) * side;
    const lz = p.z + pp.z * (PATH_HW + 0.5) * side;
    lamps.push({ x: lx, z: lz });
    shadows.push({ x: lx, z: lz, r: 0.5 });
  }

  // A torii gate at each end of the road.
  for (const t of [0.06, 0.94]) {
    const p = curve.getPoint(t);
    const tan = curve.getTangent(t);
    tan.y = 0;
    tan.normalize();
    torii.push({ x: p.x, z: p.z, rotY: Math.atan2(tan.x, tan.z) });
    shadows.push({ x: p.x, z: p.z, r: 2.4 });
  }

  // Trees, rejection-sampled so none land on the road.
  let placed = 0;
  let tries = 0;
  while (placed < 46 && tries < 3000) {
    tries++;
    const [x, z] = scatter(8, WORLD_R);
    if (distToPath(x, z) < 6) continue;
    const kind: TreeSpec['kind'] = next() < 0.65 ? 'broad' : 'pine';
    const foliageHex = kind === 'broad' ? pick(BROAD_FOLIAGE) : '';
    const blobRot: [number, number, number] =
      kind === 'broad' ? [next(), next(), next()] : [0, 0, 0];
    const scale = range(0.8, 1.3);
    const rotY = next() * 6.28;
    trees.push({ kind, x, z, rotY, scale, foliageHex, blobRot });
    shadows.push({ x, z, r: 1.5 * scale });
    placed++;
  }

  // Two ponds, each with a few lily pads.
  for (const [minR, maxR] of [
    [26, 70],
    [30, 100],
  ]) {
    const [x, z] = scatter(minR, maxR);
    const r = range(3, 4.5);
    const lilies: { x: number; z: number }[] = [];
    for (let i = 0; i < 4; i++) {
      const a = next() * 6.28;
      const lr = range(0.5, 2.2);
      lilies.push({ x: x + Math.cos(a) * lr, z: z + Math.sin(a) * lr });
    }
    ponds.push({ x, z, r, lilies });
  }

  for (let i = 0; i < 34; i++) {
    const hex = pick(FLOWER_COLORS);
    const [x, z] = scatter(4, WORLD_R);
    flowers.push({ x, z, hex });
  }

  for (let i = 0; i < 10; i++) {
    const r = range(0.4, 0.9);
    const [x, z] = scatter(8, WORLD_R);
    rocks.push({ x, z, rotY: next() * 6.28, r });
  }

  for (let i = 0; i < 7; i++) {
    const [x, z] = scatter(20, 150);
    const y = range(34, 58);
    const puffs = [];
    for (let j = 0; j < 4; j++) {
      const r = range(2, 3.4);
      puffs.push({ x: range(-3, 3), y: range(-0.6, 0.6), z: range(-2, 2), r });
    }
    clouds.push({ x, y, z, puffs });
  }

  return { path: buildPath(curve), houses, mailboxes, lamps, torii, trees, ponds, flowers, rocks, clouds, shadows };
}
