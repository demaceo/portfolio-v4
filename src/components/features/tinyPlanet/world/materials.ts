import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { vert, vertPath, fragLit, fragGround, fragFlat, fragGlow, fragPath, skyVert, skyFrag } from './shaders';
import { SUN, FOG_COLOR, FOG_NEAR, FOG_FAR, DEFAULT_CURVATURE } from './constants';

/**
 * The six world materials, defined with drei's `shaderMaterial` helper.
 *
 * Every material except the sky shares the same vertex shader, which is what
 * makes the curvature read as one continuous world rather than per-object
 * warping. Instances are handed out through the caches in `createMaterials`
 * below — the reference engine cached by colour too — and the frame loop walks
 * the resulting registry once per frame to refresh uniforms.
 *
 * Note on construction: drei applies constructor parameters inside `super()`,
 * *before* it installs the per-uniform accessors. So constructor args are for
 * material properties only (transparent / depthWrite / side); uniform values
 * are assigned afterwards through the generated accessors.
 */

/** Uniforms every world material carries: player position, curvature, and fog. */
const common = () => ({
  uPlayer: new THREE.Vector3(),
  uCurvature: DEFAULT_CURVATURE,
  uFog: new THREE.Color(FOG_COLOR),
  uFogNear: FOG_NEAR,
  uFogFar: FOG_FAR,
});

/** Uniforms shared by the two directionally-lit materials. */
const lighting = () => ({
  uLightDir: SUN.clone(),
  uLightColor: new THREE.Color(1, 1, 1),
  uAmbient: new THREE.Color(0.4, 0.45, 0.5),
});

const LitMaterial = shaderMaterial({ ...common(), ...lighting(), uColor: new THREE.Color('#ffffff') }, vert, fragLit);
const GroundMaterial = shaderMaterial({ ...common(), ...lighting() }, vert, fragGround);
const FlatMaterial = shaderMaterial({ ...common(), uColor: new THREE.Color('#ffffff'), uAlpha: 1 }, vert, fragFlat);
const GlowMaterial = shaderMaterial(
  { ...common(), uDayColor: new THREE.Color('#ffffff'), uNightColor: new THREE.Color('#ffffff'), uGlow: 0 },
  vert,
  fragGlow,
);
const PathMaterial = shaderMaterial({ ...common(), uTint: new THREE.Color(1, 1, 1) }, vertPath, fragPath);
const SkyMaterial = shaderMaterial(
  {
    uHorizon: new THREE.Color('#cfe7e6'),
    uZenith: new THREE.Color('#6ea7d6'),
    uSun: SUN.clone(),
    uSunCol: new THREE.Color('#fff2cf'),
  },
  skyVert,
  skyFrag,
);

export type SkyMaterialImpl = InstanceType<typeof SkyMaterial>;

export interface Materials {
  /**
   * Every material the frame loop refreshes each tick. The sky is deliberately
   * absent — it has its own uniform set and is updated directly.
   */
  registry: THREE.ShaderMaterial[];
  /** Solid, directionally-lit colour. Cached per hex, as in the reference engine. */
  lit(hex: string): THREE.ShaderMaterial;
  /** The procedurally-tinted ground. One instance. */
  ground(): THREE.ShaderMaterial;
  /** Unlit flat colour, optionally translucent. Cached per hex+alpha. */
  flat(hex: string, alpha: number): THREE.ShaderMaterial;
  /** Emissive blend that lifts from `dayHex` to `nightHex` as dusk falls. Cached per pair. */
  glow(dayHex: string, nightHex: string): THREE.ShaderMaterial;
  /** The dirt path ribbon. One instance. */
  path(): THREE.ShaderMaterial;
  sky: SkyMaterialImpl;
  /**
   * Clouds are plain unlit basic material, exactly as in the reference engine —
   * deliberately outside the registry, so they neither curve with the world nor
   * pick up the day/night tint. They read as distant sky, not as scenery.
   */
  cloud: THREE.MeshBasicMaterial;
  dispose(): void;
}

/**
 * Build one material set. Call once per mounted world (inside a `useMemo`) —
 * never per frame, and never per mesh.
 */
export function createMaterials(): Materials {
  const registry: THREE.ShaderMaterial[] = [];
  const litCache = new Map<string, THREE.ShaderMaterial>();
  const flatCache = new Map<string, THREE.ShaderMaterial>();
  const glowCache = new Map<string, THREE.ShaderMaterial>();
  let groundMat: THREE.ShaderMaterial | null = null;
  let pathMat: THREE.ShaderMaterial | null = null;

  const track = <T extends THREE.ShaderMaterial>(m: T): T => {
    registry.push(m);
    return m;
  };

  const sky = new SkyMaterial({ side: THREE.BackSide, depthWrite: false });
  const cloud = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });

  return {
    registry,
    sky,
    cloud,

    lit(hex) {
      let m = litCache.get(hex);
      if (!m) {
        const created = new LitMaterial();
        created.uColor = new THREE.Color(hex);
        m = track(created);
        litCache.set(hex, m);
      }
      return m;
    },

    ground() {
      groundMat ??= track(new GroundMaterial());
      return groundMat;
    },

    flat(hex, alpha) {
      const key = `${hex}_${alpha}`;
      let m = flatCache.get(key);
      if (!m) {
        const created = new FlatMaterial({ transparent: alpha < 1.0, depthWrite: alpha >= 1.0 });
        created.uColor = new THREE.Color(hex);
        created.uAlpha = alpha;
        m = track(created);
        flatCache.set(key, m);
      }
      return m;
    },

    glow(dayHex, nightHex) {
      const key = `${dayHex}_${nightHex}`;
      let m = glowCache.get(key);
      if (!m) {
        const created = new GlowMaterial();
        created.uDayColor = new THREE.Color(dayHex);
        created.uNightColor = new THREE.Color(nightHex);
        m = track(created);
        glowCache.set(key, m);
      }
      return m;
    },

    path() {
      pathMat ??= track(new PathMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide }));
      return pathMat;
    },

    dispose() {
      for (const m of registry) m.dispose();
      registry.length = 0;
      litCache.clear();
      flatCache.clear();
      glowCache.clear();
      groundMat = null;
      pathMat = null;
      sky.dispose();
      cloud.dispose();
    },
  };
}
