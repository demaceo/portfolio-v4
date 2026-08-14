"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { TinyPlanet, type TinyPlanetHandle } from '../r3f/TinyPlanet';
import { usePrefersReducedMotion } from '../r3f/usePrefersReducedMotion';
import { Overlay } from './Overlay';
import { ControlPanel } from './ControlPanel';
import { Dpad } from './Dpad';
import type { Dir } from '../world/constants';
import styles from './TinyPlanet.module.css';

/**
 * `<TinyPlanet>` plus its chrome: the control panel, the touch d-pad, and the
 * title/hint overlay.
 *
 * Kept separate from the experience itself so `<TinyPlanet>` stays a pure,
 * prop-driven component with no UI opinions. Everything here is scoped to a CSS
 * Module and positioned inside the component's own box, so this can be dropped
 * into a page section as readily as it fills a viewport.
 */

export interface TinyPlanetShowcaseProps {
  className?: string;
  /** Fixes the generated layout so every visitor sees the same world. */
  seed?: number;
  title?: string;
  subtitle?: string;
  credit?: string;
  showControls?: boolean;
  showDpad?: boolean;
}

// The load-in "sunrise": ease the day from dawn up to noon.
const INTRO_FROM = 0.3;
const INTRO_TO = 0.5;
const INTRO_MS = 4200;

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

export function TinyPlanetShowcase({
  className,
  seed,
  title,
  subtitle,
  credit,
  showControls = true,
  showDpad = true,
}: TinyPlanetShowcaseProps) {
  const reduced = usePrefersReducedMotion();
  const planet = useRef<TinyPlanetHandle>(null);

  const [curvature, setCurvature] = useState(0.0016);
  const [timeOfDay, setTimeOfDay] = useState(INTRO_FROM);
  const [cameraDistance, setCameraDistance] = useState(12);
  const [autoWander, setAutoWander] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  const onPress = useCallback((dir: Dir, down: boolean) => {
    planet.current?.press(dir, down);
  }, []);

  // Sunrise on load. Skipped entirely under reduced motion, which starts at noon.
  useEffect(() => {
    if (reduced) {
      setTimeOfDay(INTRO_TO);
      return;
    }
    let raf = 0;
    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / INTRO_MS);
      setTimeOfDay(INTRO_FROM + (INTRO_TO - INTRO_FROM) * easeInOut(p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Hide the hint after the first interaction.
  useEffect(() => {
    const hide = () => setHintVisible(false);
    window.addEventListener('pointerdown', hide, { once: true });
    window.addEventListener('keydown', hide, { once: true });
    return () => {
      window.removeEventListener('pointerdown', hide);
      window.removeEventListener('keydown', hide);
    };
  }, []);

  const rootClass = className ? `${styles.root} ${className}` : styles.root;

  return (
    <div className={rootClass}>
      <TinyPlanet
        ref={planet}
        className={styles.canvas}
        curvature={curvature}
        timeOfDay={timeOfDay}
        cameraDistance={cameraDistance}
        autoWander={autoWander}
        seed={seed}
      />

      <div className={styles.overlay}>
        <Overlay hintVisible={hintVisible} title={title} subtitle={subtitle} credit={credit} />

        {showControls && (
          <ControlPanel
            open={panelOpen}
            onToggle={() => setPanelOpen((o) => !o)}
            curvature={curvature}
            onCurvature={setCurvature}
            timeOfDay={timeOfDay}
            onTime={setTimeOfDay}
            cameraDistance={cameraDistance}
            onDistance={setCameraDistance}
            autoWander={autoWander}
            onWander={setAutoWander}
          />
        )}

        {showDpad && <Dpad onPress={onPress} />}
      </div>
    </div>
  );
}
