import * as THREE from 'three';

/**
 * Keyed geometry cache.
 *
 * The scene is declarative, so a mesh's geometry is read on every render pass.
 * Allocating `new THREE.ConeGeometry(...)` inline there would leak a fresh
 * buffer each time, so all geometry is pulled from one cache built alongside
 * the materials and disposed with them. It also collapses the repeats — 46
 * trees share a handful of buffers instead of minting 200-odd.
 */
export interface GeometryCache {
  get(key: string, make: () => THREE.BufferGeometry): THREE.BufferGeometry;
  cylinder(rTop: number, rBottom: number, height: number, radial: number): THREE.BufferGeometry;
  cone(radius: number, height: number, radial: number): THREE.BufferGeometry;
  sphere(radius: number, width: number, height: number): THREE.BufferGeometry;
  icosahedron(radius: number, detail: number): THREE.BufferGeometry;
  box(w: number, h: number, d: number): THREE.BufferGeometry;
  /** A circle laid flat on the ground plane (rotated onto XZ), as the engine's shadows are. */
  circleXZ(radius: number, segments: number): THREE.BufferGeometry;
  dispose(): void;
}

export function createGeometryCache(): GeometryCache {
  const cache = new Map<string, THREE.BufferGeometry>();

  const get = (key: string, make: () => THREE.BufferGeometry) => {
    let g = cache.get(key);
    if (!g) {
      g = make();
      cache.set(key, g);
    }
    return g;
  };

  /** Geometry dimensions are floats; round the key so near-identical props still share. */
  const k = (n: number) => n.toFixed(4);

  return {
    get,
    cylinder: (rt, rb, h, radial) =>
      get(`cyl:${k(rt)}:${k(rb)}:${k(h)}:${radial}`, () => new THREE.CylinderGeometry(rt, rb, h, radial)),
    cone: (r, h, radial) => get(`cone:${k(r)}:${k(h)}:${radial}`, () => new THREE.ConeGeometry(r, h, radial)),
    sphere: (r, w, h) => get(`sph:${k(r)}:${w}:${h}`, () => new THREE.SphereGeometry(r, w, h)),
    icosahedron: (r, detail) => get(`ico:${k(r)}:${detail}`, () => new THREE.IcosahedronGeometry(r, detail)),
    box: (w, h, d) => get(`box:${k(w)}:${k(h)}:${k(d)}`, () => new THREE.BoxGeometry(w, h, d)),
    circleXZ: (r, segments) =>
      get(`circ:${k(r)}:${segments}`, () => {
        const g = new THREE.CircleGeometry(r, segments);
        g.rotateX(-Math.PI / 2);
        return g;
      }),
    dispose() {
      for (const g of cache.values()) g.dispose();
      cache.clear();
    },
  };
}
