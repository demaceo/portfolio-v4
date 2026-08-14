import { useCallback, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { useWorld } from './WorldContext';

/**
 * Drifting clouds.
 *
 * Deliberately the one part of the world that does *not* bend: they use a plain
 * unlit material with no curvature vertex shader, so they read as sky rather
 * than as scenery sitting on the planet. Drift is applied by the frame loop
 * through the collected refs, and skipped entirely under reduced motion.
 */
export function Clouds({ groupsRef }: { groupsRef: MutableRefObject<THREE.Group[]> }) {
  const { materials: m, geo, world } = useWorld();

  // Collect each cloud group into a flat array the frame loop can walk.
  const collect = useCallback(
    (index: number) => (node: THREE.Group | null) => {
      if (node) groupsRef.current[index] = node;
    },
    [groupsRef],
  );

  return (
    <>
      {world.clouds.map((c, i) => (
        <group key={i} ref={collect(i)} position={[c.x, c.y, c.z]}>
          {c.puffs.map((p, j) => (
            <mesh
              key={j}
              geometry={geo.icosahedron(p.r, 0)}
              material={m.cloud}
              position={[p.x, p.y, p.z]}
              scale={[1, 0.6, 1]}
            />
          ))}
        </group>
      ))}
    </>
  );
}
