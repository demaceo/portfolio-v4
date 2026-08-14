# Tiny Planet (vendored)

The 3D experience mounted at `/tiny-planet`. Copied verbatim from
[demaceo/tiny-planet](https://github.com/demaceo/tiny-planet) at commit `517686f`.

**Edit upstream, not here.** Changes belong in `tiny-planet/src/`, then get re-copied over this
folder so the two stay diffable. The upstream repo is where the experience can be run standalone
and where the shader-parity check lives.

## Layout

Subfolder depth mirrors upstream exactly, which is what lets every relative import (`../world/palette`,
`../r3f/TinyPlanet`) stay unedited:

| Path | Upstream origin |
|---|---|
| `world/` | `src/world/` — shaders, palette, RNG, materials, geometry cache, generator |
| `r3f/` | `src/r3f/` — the scene graph, the single `useFrame`, input hooks |
| `components/` | `src/components/` — control panel, d-pad, overlay, showcase wrapper, CSS Module |

## Deliberate divergences from upstream

Only two, both additive:

1. **`"use client"`** is prepended to `TinyPlanetShowcase.tsx` and `r3f/TinyPlanet.tsx`. Not
   strictly required — the route that imports them is already a Client Component, so the boundary
   is inherited — but it makes the boundary explicit and stops a future Server Component import
   from failing confusingly.
2. **`index.ts`** (this folder's barrel) and this README are additions; upstream has neither.

Everything else is byte-identical, so `diff -r` against the upstream `src/` is meaningful.

## Notes

- `world/engine.js` is **not** vendored. It is the original imperative Three.js implementation,
  kept upstream as a reference; nothing here depends on it.
- Comments in `world/shaders.ts` refer to `scripts/verify-shaders.mjs`, which lives upstream. That
  script asserts the GLSL still matches `engine.js` byte-for-byte as part of the upstream build.
- The GLSL is the effect and must not be edited: the world is a flat plane, and the "planet" is
  entirely a vertex-shader displacement (`wp.y -= d * d * uCurvature`) applied by every world
  material.

## Theming

`TinyPlanet.module.css` declares all of its colours and fonts as custom properties on `.root`. A
host restyles by overriding those variables rather than forking the stylesheet — see
`src/app/tiny-planet/tiny-planet.module.css`, which overrides only the two font variables so the
chrome uses the site's typography while keeping the cream glass the world was tuned for.
