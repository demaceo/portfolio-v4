import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import type { InputState } from './state';
import type { Dir } from '../world/constants';

/**
 * Keyboard and pointer input, matching `world/engine.js`.
 *
 * Both WASD/arrows and the on-screen d-pad write the same movement flags on the
 * shared `InputState`, so the two are interchangeable. Pointer drag on the
 * canvas rotates the camera rig directly — no React state is involved anywhere
 * in here, because all of it is read by the frame loop.
 */

const KEY_MAP: Record<string, Dir> = {
  KeyW: 'f',
  ArrowUp: 'f',
  KeyS: 'b',
  ArrowDown: 'b',
  KeyA: 'l',
  ArrowLeft: 'l',
  KeyD: 'r',
  ArrowRight: 'r',
};

export function useInput(input: InputState) {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.code];
      if (dir) {
        input.keys[dir] = true;
        // Stops the arrow keys scrolling the host page out from under the canvas.
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.code];
      if (dir) input.keys[dir] = false;
    };
    /** Losing focus mid-stride would otherwise leave the walker running forever. */
    const releaseAll = () => {
      input.keys.f = input.keys.b = input.keys.l = input.keys.r = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', releaseAll);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', releaseAll);
      releaseAll();
    };
  }, [input]);

  useEffect(() => {
    const el = gl.domElement;
    let dragging = false;
    let lx = 0;
    let ly = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      el.style.cursor = 'grabbing';
      if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      input.camYaw -= (e.clientX - lx) * 0.005;
      input.camPitch = Math.min(1.15, Math.max(0.08, input.camPitch + (e.clientY - ly) * 0.004));
      lx = e.clientX;
      ly = e.clientY;
    };
    const onPointerUp = () => {
      dragging = false;
      el.style.cursor = 'grab';
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    };
  }, [gl, input]);
}
