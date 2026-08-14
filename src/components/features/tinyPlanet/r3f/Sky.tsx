import { forwardRef } from 'react';
import * as THREE from 'three';
import { useWorld } from './WorldContext';

/**
 * Sky dome.
 *
 * The only material that does *not* use the shared curvature vertex shader —
 * it is drawn on the inside of a large sphere that the frame loop re-centres on
 * the camera every tick, so it behaves as a backdrop at infinity. `renderOrder`
 * of -1 keeps it behind everything else despite not writing depth.
 */
export const Sky = forwardRef<THREE.Mesh>(function Sky(_props, ref) {
  const { materials, geo } = useWorld();
  const geometry = geo.get('sky', () => new THREE.SphereGeometry(1200, 32, 16));

  return <mesh ref={ref} geometry={geometry} material={materials.sky} renderOrder={-1} />;
});
