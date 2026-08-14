import * as THREE from 'three';

/**
 * The day/night cycle, lifted from `world/engine.js`.
 *
 * One scalar — `timeOfDay` in 0..1 — drives everything: sun direction, sky
 * gradient, light and ambient colour, fog, the path tint, and the emissive
 * "glow" that lifts lamps and windows at dusk. Nothing here rebuilds geometry
 * or swaps materials; the frame loop just copies these values into uniforms.
 */

/** Shared so the control label and the actual sun agree on the current phase. */
export function phaseLabel(timeT: number): 'Dawn' | 'Day' | 'Dusk' | 'Night' {
  const up = -Math.cos(timeT * Math.PI * 2.0);
  if (up > 0.2) return 'Day';
  if (up < -0.08) return 'Night';
  return timeT < 0.5 ? 'Dawn' : 'Dusk';
}

/** Smoothstep. Also runs backwards (e0 > e1), which is how `glow` inverts. */
const ss = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Day / twilight / night stops for one blended channel. */
interface Stops {
  d: THREE.Color;
  t: THREE.Color;
  n: THREE.Color;
}

const P: Record<'horizon' | 'zenith' | 'sunCol' | 'light' | 'ambient', Stops> = {
  horizon: { d: new THREE.Color('#cfe7e6'), t: new THREE.Color('#f3c89a'), n: new THREE.Color('#16223c') },
  zenith: { d: new THREE.Color('#6ea7d6'), t: new THREE.Color('#8a6f9e'), n: new THREE.Color('#0a1024') },
  sunCol: { d: new THREE.Color('#fff2cf'), t: new THREE.Color('#ffb060'), n: new THREE.Color('#9fb0cf') },
  light: { d: new THREE.Color(0.97, 0.93, 0.82), t: new THREE.Color(0.95, 0.55, 0.3), n: new THREE.Color(0.1, 0.13, 0.22) },
  ambient: { d: new THREE.Color(0.45, 0.48, 0.46), t: new THREE.Color(0.32, 0.27, 0.3), n: new THREE.Color(0.11, 0.13, 0.2) },
};

function blend(field: keyof typeof P, out: THREE.Color, wN: number, wT: number, wD: number) {
  const a = P[field].n;
  const b = P[field].t;
  const c = P[field].d;
  out.setRGB(a.r * wN + b.r * wT + c.r * wD, a.g * wN + b.g * wT + c.g * wD, a.b * wN + b.b * wT + c.b * wD);
}

/** Everything `timeOfDay` resolves to. Mutated in place each frame — never reallocated. */
export interface SkyState {
  sunDir: THREE.Vector3;
  horizon: THREE.Color;
  zenith: THREE.Color;
  sunCol: THREE.Color;
  light: THREE.Color;
  ambient: THREE.Color;
  tint: THREE.Color;
  /** 0 by day, 1 at night — drives the emissive lamp/window blend. */
  glow: number;
}

export function createSkyState(): SkyState {
  return {
    sunDir: new THREE.Vector3(),
    horizon: new THREE.Color(),
    zenith: new THREE.Color(),
    sunCol: new THREE.Color(),
    light: new THREE.Color(),
    ambient: new THREE.Color(),
    tint: new THREE.Color(),
    glow: 0,
  };
}

/** Resolve `timeT` (0..1) into `state`, in place. */
export function updateSkyState(state: SkyState, timeT: number): void {
  const ang = timeT * Math.PI * 2.0;
  state.sunDir.set(Math.sin(ang) * 0.6, -Math.cos(ang), 0.32).normalize();
  const up = state.sunDir.y;

  let wD = ss(0.1, 0.4, up);
  let wN = 1.0 - ss(-0.28, 0.06, up);
  let wT = Math.max(0, 1.0 - wD - wN);
  const sum = wD + wN + wT || 1;
  wD /= sum;
  wN /= sum;
  wT /= sum;

  blend('horizon', state.horizon, wN, wT, wD);
  blend('zenith', state.zenith, wN, wT, wD);
  blend('sunCol', state.sunCol, wN, wT, wD);
  blend('light', state.light, wN, wT, wD);
  blend('ambient', state.ambient, wN, wT, wD);
  state.tint.setRGB(
    Math.min(1, state.ambient.r + state.light.r * 0.6),
    Math.min(1, state.ambient.g + state.light.g * 0.6),
    Math.min(1, state.ambient.b + state.light.b * 0.6),
  );
  state.glow = ss(0.15, -0.1, up);
}
