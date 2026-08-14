import { useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createSkyState, updateSkyState } from '../world/palette';
import { MOVE_SPEED, WORLD_R } from '../world/constants';
import type { Materials } from '../world/materials';
import type { Controls, InputState } from './state';

/**
 * The one and only per-frame callback.
 *
 * Everything that moves happens here, in the same order as the reference
 * engine's `animate()`: resolve the sun, integrate movement, push uniforms,
 * drift the clouds, then place the camera. Nothing in this loop touches React
 * state, allocates, or rebuilds anything — it only mutates existing objects.
 *
 * Note that movement is entirely flat 2D. `player` has no height and the world
 * is a plane; the curvature that makes it look like a planet exists only in the
 * vertex shader, and no gameplay maths is aware of it.
 */

export interface FrameRefs {
  avatar: RefObject<THREE.Group | null>;
  avatarShadow: RefObject<THREE.Mesh | null>;
  sky: RefObject<THREE.Mesh | null>;
  clouds: RefObject<THREE.Group[]>;
}

export interface FrameDriverOptions {
  controls: RefObject<Controls>;
  input: InputState;
  materials: Materials;
  refs: FrameRefs;
  /** Elapsed auto-wander time. Reset externally when the toggle flips. */
  wander: RefObject<number>;
}

export function useFrameDriver({ controls, input, materials, refs, wander }: FrameDriverOptions) {
  const sky = useRef(createSkyState()).current;
  const player = useRef(new THREE.Vector3(0, 0, 0)).current;
  const bob = useRef({ phase: 0, amount: 0 }).current;

  useFrame((state, rawDelta) => {
    const { camera, gl } = state;
    const c = controls.current;
    const dt = Math.min(rawDelta, 0.05);

    // --- 1. time of day -> sun, palette, fog, glow -------------------------
    updateSkyState(sky, c.timeOfDay);

    const skyMat = materials.sky;
    skyMat.uSun.copy(sky.sunDir);
    skyMat.uHorizon.copy(sky.horizon);
    skyMat.uZenith.copy(sky.zenith);
    skyMat.uSunCol.copy(sky.sunCol);
    gl.setClearColor(sky.horizon, 1);

    // --- 2. movement, in flat 2D ------------------------------------------
    let mx = 0;
    let mz = 0;
    if (c.autoWander) {
      wander.current += dt;
      const t = wander.current;
      const heading = t * 0.22 + Math.sin(t * 0.3) * 0.9;
      mx = Math.sin(heading);
      mz = Math.cos(heading);
    } else {
      // Walk relative to where the camera is looking, not to world axes.
      const fX = -Math.sin(input.camYaw);
      const fZ = -Math.cos(input.camYaw);
      const rX = Math.cos(input.camYaw);
      const rZ = -Math.sin(input.camYaw);
      if (input.keys.f) {
        mx += fX;
        mz += fZ;
      }
      if (input.keys.b) {
        mx -= fX;
        mz -= fZ;
      }
      if (input.keys.r) {
        mx += rX;
        mz += rZ;
      }
      if (input.keys.l) {
        mx -= rX;
        mz -= rZ;
      }
    }

    const len = Math.hypot(mx, mz);
    const moving = len > 1e-4;
    if (moving) {
      mx /= len;
      mz /= len;
      player.x += mx * MOVE_SPEED * dt;
      player.z += mz * MOVE_SPEED * dt;
      const pr = Math.hypot(player.x, player.z);
      if (pr > WORLD_R) {
        player.x *= WORLD_R / pr;
        player.z *= WORLD_R / pr;
      }
      if (refs.avatar.current) refs.avatar.current.rotation.y = Math.atan2(mx, mz);
    }
    refs.avatar.current?.position.set(player.x, 0, player.z);
    refs.avatarShadow.current?.position.set(player.x, 0.03, player.z);

    // --- 3. one uniform sweep across every world material ------------------
    for (const m of materials.registry) {
      const u = m.uniforms;
      u.uPlayer.value.set(player.x, 0, player.z);
      u.uCurvature.value = c.curvature;
      if (u.uFog) u.uFog.value.copy(sky.horizon);
      if (u.uLightDir) u.uLightDir.value.copy(sky.sunDir);
      if (u.uLightColor) u.uLightColor.value.copy(sky.light);
      if (u.uAmbient) u.uAmbient.value.copy(sky.ambient);
      if (u.uGlow) u.uGlow.value = sky.glow;
      if (u.uTint) u.uTint.value.copy(sky.tint);
    }

    // --- 4. ambient motion --------------------------------------------------
    if (!c.reducedMotion) {
      for (const cloud of refs.clouds.current) {
        if (!cloud) continue;
        cloud.position.x += 1.2 * dt;
        if (cloud.position.x > 200) cloud.position.x = -200;
      }
    }

    // --- 5. third-person rig, with footstep bob ----------------------------
    bob.amount += ((moving && !c.reducedMotion ? 1 : 0) - bob.amount) * Math.min(1, dt * 8);
    if (moving) bob.phase += dt * 8.2;
    const bobY = Math.sin(bob.phase) * 0.08 * bob.amount;
    const bobS = Math.cos(bob.phase * 0.5) * 0.05 * bob.amount;

    const cp = Math.cos(input.camPitch);
    const sp = Math.sin(input.camPitch);
    const tx = player.x;
    const ty = 1.2;
    const tz = player.z;
    const dist = c.cameraDistance;

    camera.position.set(tx + Math.sin(input.camYaw) * cp * dist, ty + sp * dist, tz + Math.cos(input.camYaw) * cp * dist);
    camera.position.y += bobY;
    camera.position.x += Math.cos(input.camYaw) * bobS;
    camera.position.z += -Math.sin(input.camYaw) * bobS;
    camera.lookAt(tx, ty, tz);

    // Keep the dome centred on the camera so it reads as sky at infinity.
    refs.sky.current?.position.copy(camera.position);
  });
}
