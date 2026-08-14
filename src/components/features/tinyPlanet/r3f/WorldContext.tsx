import { createContext, useContext, type ReactNode } from 'react';
import type { Materials } from '../world/materials';
import type { GeometryCache } from '../world/geometry';
import type { WorldData } from '../world/generate';

/**
 * Shared, build-once resources for the scene: the material set, the geometry
 * cache, and the generated layout. Created in a single `useMemo` and handed
 * down so every prop component can pull cached instances instead of allocating.
 */
export interface WorldResources {
  materials: Materials;
  geo: GeometryCache;
  world: WorldData;
}

const WorldContext = createContext<WorldResources | null>(null);

export function WorldProvider({ value, children }: { value: WorldResources; children: ReactNode }) {
  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
}

export function useWorld(): WorldResources {
  const value = useContext(WorldContext);
  if (!value) throw new Error('useWorld must be used inside <WorldProvider>');
  return value;
}
