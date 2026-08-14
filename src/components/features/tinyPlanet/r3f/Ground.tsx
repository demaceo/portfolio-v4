import * as THREE from 'three';
import { useWorld } from './WorldContext';

/**
 * The world floor — a genuinely flat 720x720 plane.
 *
 * The 200x200 subdivision exists solely so the curvature displacement in the
 * vertex shader has enough vertices to bend smoothly; the ground itself is
 * never anything but flat, and all gameplay treats it as a plane.
 */
export function Ground() {
  const { materials, geo } = useWorld();
  const geometry = geo.get('ground', () => {
    const g = new THREE.PlaneGeometry(720, 720, 200, 200);
    g.rotateX(-Math.PI / 2);
    return g;
  });

  return <mesh geometry={geometry} material={materials.ground()} />;
}
