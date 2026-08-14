import { forwardRef } from 'react';
import * as THREE from 'three';
import { useWorld } from './WorldContext';

/**
 * The walker. Positioned and turned by the frame loop, which is why the group
 * and its shadow are exposed as refs rather than driven by props — their
 * transforms change every frame and must not go through React.
 */
export const Avatar = forwardRef<THREE.Group>(function Avatar(_props, ref) {
  const { materials: m, geo } = useWorld();
  return (
    <group ref={ref}>
      <mesh geometry={geo.cylinder(0.32, 0.42, 1.0, 10)} material={m.lit('#e8643c')} position={[0, 0.7, 0]} />
      <mesh geometry={geo.sphere(0.36, 14, 10)} material={m.lit('#f0c9a8')} position={[0, 1.45, 0]} />
      <mesh geometry={geo.box(0.5, 0.5, 0.3)} material={m.lit('#c63f2c')} position={[0, 0.85, -0.38]} />
    </group>
  );
});

export const AvatarShadow = forwardRef<THREE.Mesh>(function AvatarShadow(_props, ref) {
  const { materials: m, geo } = useWorld();
  return <mesh ref={ref} geometry={geo.circleXZ(0.55, 16)} material={m.flat('#2a1f14', 0.26)} />;
});
