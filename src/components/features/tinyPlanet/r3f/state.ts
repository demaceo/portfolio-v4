import type { Dir } from '../world/constants';

/**
 * The two mutable objects the frame loop reads.
 *
 * Both are plain objects held in refs rather than React state: they change every
 * frame (or on every pointer move) and must never trigger a re-render, because
 * a re-render of the scene would mean rebuilding it — the exact thing the
 * uniform-driven design exists to avoid.
 */

/** Prop values, mirrored into a ref each render so the loop sees them without re-subscribing. */
export interface Controls {
  curvature: number;
  timeOfDay: number;
  cameraDistance: number;
  autoWander: boolean;
  reducedMotion: boolean;
}

/** Live input. Keyboard and the on-screen d-pad write to the same movement flags. */
export interface InputState {
  keys: Record<Dir, boolean>;
  camYaw: number;
  camPitch: number;
}

export function createInputState(): InputState {
  return { keys: { f: false, b: false, l: false, r: false }, camYaw: 0.0, camPitch: 0.4 };
}
