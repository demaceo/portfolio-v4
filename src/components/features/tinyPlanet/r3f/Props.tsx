import { useWorld } from './WorldContext';
import type { HouseSpec, TreeSpec } from '../world/generate';

/**
 * Every piece of static scenery, transcribed from the builder functions in
 * `world/engine.js`. Dimensions, colours and offsets are unchanged.
 *
 * All geometry and materials come from the shared caches, so the 46 trees
 * between them use a handful of buffers and a handful of materials rather than
 * one of each per mesh — which is what keeps the per-frame uniform sweep cheap.
 */

function BroadTree({ spec }: { spec: TreeSpec }) {
  const { materials: m, geo } = useWorld();
  const foliage = m.lit(spec.foliageHex);
  return (
    <group position={[spec.x, 0, spec.z]} rotation={[0, spec.rotY, 0]} scale={spec.scale}>
      <mesh geometry={geo.cylinder(0.16, 0.28, 1.5, 8)} material={m.lit('#8a674a')} position={[0, 0.75, 0]} />
      <mesh geometry={geo.icosahedron(1.3, 1)} material={foliage} position={[0, 2.25, 0]} rotation={spec.blobRot} />
      <mesh geometry={geo.icosahedron(1.0, 1)} material={foliage} position={[0.75, 2.7, 0.25]} />
      <mesh geometry={geo.icosahedron(0.95, 1)} material={foliage} position={[-0.65, 2.6, -0.3]} />
      <mesh geometry={geo.icosahedron(0.7, 1)} material={foliage} position={[0.1, 3.15, -0.5]} />
    </group>
  );
}

function PineTree({ spec }: { spec: TreeSpec }) {
  const { materials: m, geo } = useWorld();
  return (
    <group position={[spec.x, 0, spec.z]} rotation={[0, spec.rotY, 0]} scale={spec.scale}>
      <mesh geometry={geo.cylinder(0.18, 0.26, 1.2, 8)} material={m.lit('#7a5a3e')} position={[0, 0.6, 0]} />
      <mesh geometry={geo.cone(1.3, 1.8, 10)} material={m.lit('#3f7d3a')} position={[0, 1.8, 0]} />
      <mesh geometry={geo.cone(1.0, 1.5, 10)} material={m.lit('#458a40')} position={[0, 2.7, 0]} />
      <mesh geometry={geo.cone(0.7, 1.2, 10)} material={m.lit('#4d9647')} position={[0, 3.5, 0]} />
    </group>
  );
}

function House({ spec }: { spec: HouseSpec }) {
  const { materials: m, geo } = useWorld();
  const { w, dp, hh } = spec;
  const frame = m.lit('#6a5138');
  // The one emissive material in the village: cool glass by day, warm lamplight
  // after dusk, blended entirely by the uGlow uniform.
  const windowMat = m.glow('#bfe6ef', '#ffdf8a');
  const winX = w / 2 - 0.55;

  return (
    <group position={[spec.x, 0, spec.z]} rotation={[0, spec.rotY, 0]}>
      <mesh geometry={geo.box(w, hh, dp)} material={m.lit(spec.wallHex)} position={[0, hh / 2, 0]} />
      <mesh geometry={geo.box(w + 0.06, 0.22, dp + 0.06)} material={frame} position={[0, 0.11, 0]} />
      <mesh
        geometry={geo.cone(Math.max(w, dp) * 0.72, 1.3, 4)}
        material={m.lit(spec.roofHex)}
        position={[0, hh + 0.55, 0]}
        rotation={[0, Math.PI / 4, 0]}
      />
      <mesh geometry={geo.box(0.5, 0.9, 0.1)} material={m.lit('#5a3a2a')} position={[0, 0.45, dp / 2 + 0.02]} />

      <mesh geometry={geo.box(0.58, 0.58, 0.06)} material={frame} position={[winX, hh * 0.6, dp / 2 + 0.01]} />
      <mesh geometry={geo.box(0.42, 0.42, 0.08)} material={windowMat} position={[winX, hh * 0.6, dp / 2 + 0.03]} />
      <mesh geometry={geo.box(0.58, 0.58, 0.06)} material={frame} position={[-winX, hh * 0.6, dp / 2 + 0.01]} />
      <mesh geometry={geo.box(0.42, 0.42, 0.08)} material={windowMat} position={[-winX, hh * 0.6, dp / 2 + 0.03]} />

      <mesh
        geometry={geo.box(0.3, 0.7, 0.3)}
        material={m.lit('#8a6a5a')}
        position={[w / 2 - 0.5, hh + 0.7, -(dp / 2 - 0.5)]}
      />
    </group>
  );
}

function Torii({ x, z, rotY }: { x: number; z: number; rotY: number }) {
  const { materials: m, geo } = useWorld();
  const red = m.lit('#d94b3a');
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <mesh geometry={geo.cylinder(0.18, 0.2, 4, 10)} material={red} position={[-1.4, 2, 0]} />
      <mesh geometry={geo.cylinder(0.18, 0.2, 4, 10)} material={red} position={[1.4, 2, 0]} />
      <mesh geometry={geo.box(4.3, 0.35, 0.5)} material={red} position={[0, 4.1, 0]} />
      <mesh geometry={geo.box(3.4, 0.25, 0.4)} material={red} position={[0, 3.4, 0]} />
    </group>
  );
}

function Mailbox({ x, z, rotY }: { x: number; z: number; rotY: number }) {
  const { materials: m, geo } = useWorld();
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <mesh geometry={geo.cylinder(0.07, 0.07, 1.0, 8)} material={m.lit('#6a4f3a')} position={[0, 0.5, 0]} />
      <mesh geometry={geo.box(0.5, 0.35, 0.3)} material={m.lit('#cf4636')} position={[0, 1.1, 0]} />
    </group>
  );
}

function Lamp({ x, z }: { x: number; z: number }) {
  const { materials: m, geo } = useWorld();
  return (
    <group position={[x, 0, z]}>
      <mesh geometry={geo.cylinder(0.08, 0.1, 2.6, 8)} material={m.lit('#3a3f44')} position={[0, 1.3, 0]} />
      <mesh geometry={geo.sphere(0.22, 12, 10)} material={m.glow('#7a7252', '#ffe6a0')} position={[0, 2.65, 0]} />
    </group>
  );
}

/** Every prop's contact shadow — a translucent disc lying just above the ground. */
export function Shadows() {
  const { materials: m, geo, world } = useWorld();
  const material = m.flat('#2a1f14', 0.22);
  return (
    <>
      {world.shadows.map((s, i) => (
        <mesh key={i} geometry={geo.circleXZ(s.r, 16)} material={material} position={[s.x, 0.02, s.z]} />
      ))}
    </>
  );
}

export function Scenery() {
  const { materials: m, geo, world } = useWorld();

  return (
    <>
      {world.houses.map((h, i) => (
        <House key={`house-${i}`} spec={h} />
      ))}
      {world.mailboxes.map((b, i) => (
        <Mailbox key={`mail-${i}`} {...b} />
      ))}
      {world.lamps.map((l, i) => (
        <Lamp key={`lamp-${i}`} {...l} />
      ))}
      {world.torii.map((t, i) => (
        <Torii key={`torii-${i}`} {...t} />
      ))}
      {world.trees.map((t, i) =>
        t.kind === 'broad' ? <BroadTree key={`tree-${i}`} spec={t} /> : <PineTree key={`tree-${i}`} spec={t} />,
      )}

      {world.ponds.map((p, i) => (
        <group key={`pond-${i}`}>
          <mesh
            geometry={geo.circleXZ(p.r, 28)}
            material={m.flat('#5aa6c8', 0.6)}
            position={[p.x, 0.06, p.z]}
          />
          {p.lilies.map((l, j) => (
            <mesh
              key={j}
              geometry={geo.circleXZ(0.35, 10)}
              material={m.lit('#5fae57')}
              position={[l.x, 0.08, l.z]}
            />
          ))}
        </group>
      ))}

      {world.flowers.map((f, i) => (
        <mesh key={`flower-${i}`} geometry={geo.sphere(0.16, 8, 6)} material={m.lit(f.hex)} position={[f.x, 0.15, f.z]} />
      ))}

      {world.rocks.map((r, i) => (
        <mesh
          key={`rock-${i}`}
          geometry={geo.icosahedron(r.r, 0)}
          material={m.lit('#9aa3a0')}
          position={[r.x, 0.2, r.z]}
          rotation={[0, r.rotY, 0]}
        />
      ))}
    </>
  );
}
