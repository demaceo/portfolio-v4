"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { createInputState, type Controls } from './state';
import {
  DEFAULT_CAMERA_DISTANCE,
  DEFAULT_CURVATURE,
  DEFAULT_TIME_OF_DAY,
  type Dir,
} from '../world/constants';

/**
 * The Tiny Planet experience as one prop-driven component.
 *
 * Fills its parent box — size the container, not this — and brings no global
 * CSS with it, so it can be dropped into any layout. All chrome (controls,
 * d-pad, titles) lives outside; see `TinyPlanetShowcase` for the full demo.
 */

export interface TinyPlanetProps {
  /** Cosmetic curvature. 0 is a flat world; higher reads as a smaller planet. */
  curvature?: number;
  /** 0..1 through dawn, noon, dusk, night. Drives every colour uniform. */
  timeOfDay?: number;
  /** Third-person camera distance. */
  cameraDistance?: number;
  /** Walk a lazy loop on its own, ignoring input. */
  autoWander?: boolean;
  /** Force ambient motion off. Defaults to the OS `prefers-reduced-motion` setting. */
  reducedMotion?: boolean;
  /** Fixes the generated layout. Omit for a different world every mount. */
  seed?: number;
  className?: string;
}

export interface TinyPlanetHandle {
  /** Set a movement flag, for on-screen controls. Keyboard writes the same flags. */
  press(dir: Dir, down: boolean): void;
}

export const TinyPlanet = forwardRef<TinyPlanetHandle, TinyPlanetProps>(function TinyPlanet(
  {
    curvature = DEFAULT_CURVATURE,
    timeOfDay = DEFAULT_TIME_OF_DAY,
    cameraDistance = DEFAULT_CAMERA_DISTANCE,
    autoWander = false,
    reducedMotion,
    seed,
    className,
  },
  ref,
) {
  const systemReducedMotion = usePrefersReducedMotion();
  const resolvedReducedMotion = reducedMotion ?? systemReducedMotion;

  const input = useRef(createInputState()).current;
  const wander = useRef(0);

  // Props are mirrored into a ref rather than passed down, so the frame loop
  // always sees the latest values without the scene re-rendering to deliver them.
  const controls = useRef<Controls>({
    curvature,
    timeOfDay,
    cameraDistance,
    autoWander,
    reducedMotion: resolvedReducedMotion,
  });
  controls.current.curvature = curvature;
  controls.current.timeOfDay = timeOfDay;
  controls.current.cameraDistance = cameraDistance;
  controls.current.autoWander = autoWander;
  controls.current.reducedMotion = resolvedReducedMotion;

  // Restart the wander path whenever the toggle flips, as the engine did.
  useEffect(() => {
    wander.current = 0;
  }, [autoWander]);

  useImperativeHandle(
    ref,
    () => ({
      press(dir, down) {
        input.keys[dir] = down;
      },
    }),
    [input],
  );

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        // `flat` is load-bearing: it selects NoToneMapping, matching the original
        // renderer. Without it r3f's default ACES tone mapping washes out the
        // whole palette.
        flat
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ fov: 55, near: 0.1, far: 2000 }}
        onCreated={({ gl }) => {
          // Set here rather than in a stylesheet so the component stays free of
          // any global CSS requirement.
          gl.domElement.style.touchAction = 'none';
          gl.domElement.style.cursor = 'grab';
        }}
      >
        <Scene controls={controls} input={input} wander={wander} seed={seed} />
      </Canvas>
    </div>
  );
});
