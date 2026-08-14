import * as THREE from 'three';

/** Movement clamp: the player can never walk further than this from the origin. */
export const WORLD_R = 178;
/** Walk speed, world units per second. */
export const MOVE_SPEED = 14;
/** Half-width of the dirt path ribbon. */
export const PATH_HW = 1.7;

/** Cosmetic curvature. 0 is a flat world; higher reads as a smaller planet. */
export const DEFAULT_CURVATURE = 0.0016;
export const DEFAULT_TIME_OF_DAY = 0.5;
export const DEFAULT_CAMERA_DISTANCE = 12;

/** Baked-in sun direction used as the materials' initial uLightDir. */
export const SUN = new THREE.Vector3(0.45, 0.6, 0.5).normalize();

export const FOG_COLOR = '#cfe7e6';
export const FOG_NEAR = 60;
export const FOG_FAR = 270;

export type Dir = 'f' | 'b' | 'l' | 'r';
