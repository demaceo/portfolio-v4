import * as THREE from 'three';
import { useWorld } from './WorldContext';

/**
 * The dirt road.
 *
 * A triangle ribbon carrying a custom `aEdge` attribute that runs -1..1 across
 * the width, which the path fragment shader feathers into soft edges. It uses
 * its own vertex shader — identical to the shared one apart from passing that
 * attribute through — so it curves with the rest of the world.
 */
export function PathMesh() {
  const { materials, geo, world } = useWorld();

  const geometry = geo.get('path', () => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(world.path.positions, 3));
    g.setAttribute('aEdge', new THREE.BufferAttribute(world.path.edges, 1));
    g.setIndex(new THREE.BufferAttribute(world.path.index, 1));
    return g;
  });

  return <mesh geometry={geometry} material={materials.path()} />;
}
