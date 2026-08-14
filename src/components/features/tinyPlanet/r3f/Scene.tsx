import { useEffect, useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { WorldProvider, type WorldResources } from './WorldContext';
import { Sky } from './Sky';
import { Ground } from './Ground';
import { PathMesh } from './PathMesh';
import { Scenery, Shadows } from './Props';
import { Clouds } from './Clouds';
import { Avatar, AvatarShadow } from './Avatar';
import { useInput } from './useInput';
import { useFrameDriver } from './useFrameDriver';
import { createMaterials } from '../world/materials';
import { createGeometryCache } from '../world/geometry';
import { generateWorld } from '../world/generate';
import type { Controls, InputState } from './state';

/**
 * The declarative scene graph, plus the single frame loop that animates it.
 *
 * Everything below is built once and then only mutated through uniforms and a
 * handful of refs. Changing `timeOfDay` or `curvature` re-renders nothing here:
 * those props are read straight off a ref inside `useFrameDriver`.
 */

interface Resources extends WorldResources {
  dispose(): void;
}

function createResources(seed?: number): Resources {
  const materials = createMaterials();
  const geo = createGeometryCache();
  const world = generateWorld(seed);
  return {
    materials,
    geo,
    world,
    dispose() {
      materials.dispose();
      geo.dispose();
    },
  };
}

/**
 * Build the world once per seed.
 *
 * Disposal only runs when the seed actually changes and a *new* set replaces the
 * old one. Teardown of the whole canvas is left to r3f, which disposes the
 * renderer and forces context loss — that frees these GPU resources too, and
 * skipping an unmount-time dispose keeps StrictMode's simulated remount from
 * pulling the materials out from under a still-live scene.
 */
function useResources(seed?: number): Resources {
  const resources = useMemo(() => createResources(seed), [seed]);
  const previous = useRef(resources);

  useEffect(() => {
    if (previous.current !== resources) {
      previous.current.dispose();
      previous.current = resources;
    }
  }, [resources]);

  return resources;
}

export interface SceneProps {
  controls: RefObject<Controls>;
  input: InputState;
  wander: RefObject<number>;
  seed?: number;
}

export function Scene({ controls, input, wander, seed }: SceneProps) {
  const resources = useResources(seed);

  const avatar = useRef<THREE.Group>(null);
  const avatarShadow = useRef<THREE.Mesh>(null);
  const sky = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Group[]>([]);

  useInput(input);
  useFrameDriver({
    controls,
    input,
    materials: resources.materials,
    wander,
    refs: { avatar, avatarShadow, sky, clouds },
  });

  return (
    <WorldProvider value={resources}>
      <Sky ref={sky} />
      <Ground />
      <PathMesh />
      <Shadows />
      <Scenery />
      <Clouds groupsRef={clouds} />
      <Avatar ref={avatar} />
      <AvatarShadow ref={avatarShadow} />
    </WorldProvider>
  );
}
