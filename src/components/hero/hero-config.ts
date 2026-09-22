/**
 * Hero stage composition data.
 *
 * Every floating fragment in the hero is placed by hand rather than randomised,
 * so the composition stays balanced: nothing lands on the subject's face, the
 * near-field pieces stay out of the headline's reading path, and the depth
 * layers read as three distinct focal planes.
 */

/** Focal plane a fragment lives on. Drives blur, scale and parallax weight. */
export type ShardDepth = "far" | "mid" | "near";

export interface Shard {
  id: string;
  depth: ShardDepth;
  /** Horizontal position, % of stage width (0 = left edge). */
  x: number;
  /** Vertical position, % of stage height (0 = top edge). */
  y: number;
  /** Width in px at a 1440px reference viewport; scaled fluidly at runtime. */
  size: number;
  /** Height as a multiple of `size`. */
  ratio: number;
  /** In-plane rotation, degrees. */
  rotate: number;
  /** Out-of-plane tilt, degrees, which gives each plate real thickness. */
  tiltX: number;
  tiltY: number;
  /** Index into SHARD_SHAPES. */
  shape: number;
  /** Use the darker alloy ramp (fragments on the void side catch less light). */
  dark?: boolean;
  /** Seconds for one idle drift cycle. */
  drift: number;
  /** Idle drift travel in px. */
  travel: number;
  /** Stagger offset for the drift loop, seconds. */
  delay: number;
}

/** Irregular milled-fragment silhouettes. */
export const SHARD_SHAPES = [
  "polygon(0% 22%, 58% 0%, 100% 28%, 82% 100%, 18% 88%)",
  "polygon(4% 0%, 100% 14%, 92% 82%, 26% 100%, 0% 46%)",
  "polygon(0% 40%, 44% 0%, 100% 18%, 88% 76%, 30% 100%)",
  "polygon(12% 0%, 100% 32%, 74% 100%, 0% 72%)",
  "polygon(0% 12%, 86% 0%, 100% 62%, 40% 100%, 6% 70%)",
  "polygon(8% 6%, 96% 0%, 100% 48%, 62% 96%, 0% 64%)",
] as const;

export const SHARDS: Shard[] = [
  // ---- far plane -----------------------------------------------------------
  { id: "f1", depth: "far", x: 11, y: 19, size: 46, ratio: 0.42, rotate: -18, tiltX: 24, tiltY: -30, shape: 0, dark: true, drift: 7, travel: 48, delay: 0 },
  { id: "f2", depth: "far", x: 79, y: 14, size: 38, ratio: 0.5, rotate: 34, tiltX: -18, tiltY: 26, shape: 2, drift: 8, travel: 40, delay: 1.4 },
  { id: "f3", depth: "far", x: 26, y: 68, size: 52, ratio: 0.38, rotate: 8, tiltX: 30, tiltY: 14, shape: 4, dark: true, drift: 9, travel: 55, delay: 2.9 },
  { id: "f4", depth: "far", x: 88, y: 58, size: 44, ratio: 0.46, rotate: -26, tiltX: -22, tiltY: -18, shape: 1, drift: 6.5, travel: 44, delay: 0.8 },
  { id: "f5", depth: "far", x: 57, y: 12, size: 30, ratio: 0.55, rotate: 52, tiltX: 16, tiltY: 34, shape: 3, drift: 8.5, travel: 36, delay: 3.6 },
  { id: "f6", depth: "far", x: 41, y: 82, size: 34, ratio: 0.44, rotate: -40, tiltX: -28, tiltY: 20, shape: 5, dark: true, drift: 7.5, travel: 52, delay: 2.1 },
  { id: "f7", depth: "far", x: 66, y: 44, size: 28, ratio: 0.48, rotate: 22, tiltX: 20, tiltY: -22, shape: 3, drift: 9.5, travel: 32, delay: 1.0 },
  { id: "f8", depth: "far", x: 5, y: 82, size: 40, ratio: 0.5, rotate: -10, tiltX: -14, tiltY: 30, shape: 2, dark: true, drift: 7, travel: 46, delay: 4.2 },
  { id: "f9", depth: "far", x: 94, y: 35, size: 36, ratio: 0.42, rotate: 48, tiltX: 26, tiltY: -16, shape: 0, drift: 6, travel: 42, delay: 0.5 },
  { id: "f10", depth: "far", x: 34, y: 8, size: 50, ratio: 0.36, rotate: -6, tiltX: -20, tiltY: 24, shape: 4, dark: true, drift: 8, travel: 50, delay: 3.0 },
  { id: "f11", depth: "far", x: 76, y: 76, size: 32, ratio: 0.52, rotate: 68, tiltX: 14, tiltY: -28, shape: 1, drift: 7, travel: 38, delay: 1.7 },
  { id: "f12", depth: "far", x: 52, y: 54, size: 42, ratio: 0.4, rotate: -32, tiltX: -26, tiltY: 12, shape: 5, dark: true, drift: 8.5, travel: 44, delay: 5.1 },

  // ---- mid plane -----------------------------------------------------------
  { id: "m1", depth: "mid", x: 6, y: 44, size: 132, ratio: 0.3, rotate: -12, tiltX: 18, tiltY: -38, shape: 1, dark: true, drift: 5, travel: 70, delay: 0.3 },
  { id: "m2", depth: "mid", x: 72, y: 26, size: 158, ratio: 0.28, rotate: 7, tiltX: -14, tiltY: 32, shape: 3, drift: 6, travel: 80, delay: 1.9 },
  { id: "m3", depth: "mid", x: 17, y: 71, size: 96, ratio: 0.36, rotate: 28, tiltX: 26, tiltY: 18, shape: 0, dark: true, drift: 5.5, travel: 62, delay: 3.2 },
  { id: "m4", depth: "mid", x: 84, y: 72, size: 118, ratio: 0.32, rotate: -34, tiltX: -20, tiltY: -26, shape: 4, drift: 6.5, travel: 74, delay: 0.9 },
  { id: "m5", depth: "mid", x: 63, y: 84, size: 78, ratio: 0.4, rotate: 46, tiltX: 22, tiltY: 28, shape: 2, drift: 4.5, travel: 56, delay: 2.4 },
  { id: "m6", depth: "mid", x: 31, y: 30, size: 70, ratio: 0.38, rotate: -52, tiltX: -30, tiltY: 16, shape: 5, dark: true, drift: 7, travel: 60, delay: 4.1 },
  { id: "m7", depth: "mid", x: 92, y: 48, size: 88, ratio: 0.34, rotate: 20, tiltX: 16, tiltY: -34, shape: 0, drift: 5, travel: 68, delay: 0.6 },
  { id: "m8", depth: "mid", x: 44, y: 18, size: 104, ratio: 0.30, rotate: -20, tiltX: -24, tiltY: 22, shape: 3, dark: true, drift: 6, travel: 76, delay: 2.8 },
  { id: "m9", depth: "mid", x: 9, y: 18, size: 80, ratio: 0.36, rotate: 36, tiltX: 28, tiltY: -18, shape: 2, drift: 5.5, travel: 58, delay: 1.2 },
  { id: "m10", depth: "mid", x: 55, y: 56, size: 90, ratio: 0.32, rotate: -44, tiltX: -16, tiltY: 30, shape: 4, dark: true, drift: 6.5, travel: 66, delay: 3.8 },
  { id: "m11", depth: "mid", x: 77, y: 88, size: 68, ratio: 0.42, rotate: 14, tiltX: 22, tiltY: -24, shape: 5, drift: 4, travel: 52, delay: 0.4 },
  { id: "m12", depth: "mid", x: 24, y: 52, size: 112, ratio: 0.28, rotate: -28, tiltX: -32, tiltY: 12, shape: 1, dark: true, drift: 5.5, travel: 72, delay: 4.6 },

  // ---- near plane (foreground, out of focus) -------------------------------
  { id: "n1", depth: "near", x: -4, y: 60, size: 260, ratio: 0.26, rotate: -22, tiltX: 14, tiltY: -34, shape: 3, dark: true, drift: 4, travel: 90, delay: 0 },
  { id: "n2", depth: "near", x: 90, y: 8, size: 228, ratio: 0.3, rotate: 16, tiltX: -24, tiltY: 30, shape: 1, drift: 4.5, travel: 82, delay: 1.6 },
  { id: "n3", depth: "near", x: 46, y: 96, size: 192, ratio: 0.28, rotate: -8, tiltX: 32, tiltY: 12, shape: 0, dark: true, drift: 3.5, travel: 76, delay: 3 },
  { id: "n4", depth: "near", x: 78, y: 92, size: 164, ratio: 0.34, rotate: 38, tiltX: -18, tiltY: -28, shape: 4, drift: 5, travel: 86, delay: 2.2 },
  { id: "n5", depth: "near", x: 18, y: 6, size: 210, ratio: 0.3, rotate: -44, tiltX: 20, tiltY: 26, shape: 2, dark: true, drift: 4, travel: 88, delay: 0.8 },
  { id: "n6", depth: "near", x: 55, y: 38, size: 180, ratio: 0.28, rotate: 26, tiltX: -28, tiltY: -16, shape: 5, drift: 4.5, travel: 80, delay: 2.6 },
  { id: "n7", depth: "near", x: -3, y: 12, size: 240, ratio: 0.26, rotate: 12, tiltX: 16, tiltY: -32, shape: 3, dark: true, drift: 3.5, travel: 92, delay: 4.0 },
  { id: "n8", depth: "near", x: 96, y: 74, size: 200, ratio: 0.32, rotate: -30, tiltX: -22, tiltY: 18, shape: 1, drift: 5, travel: 84, delay: 1.0 },
];


/**
 * Parallax weight per layer, in px of travel at the extremes of the pointer.
 * Values climb with proximity to the camera so the whole stage resolves like a
 * real multi-plane rig rather than a flat image sliding around.
 */
export const PARALLAX_DEPTH = {
  atmosphere: 10,
  headline: 16,
  subject: 30,
  hud: 6,
} as const;

/* ===========================================================================
   DEPTH
   The planes are not stacked images: each fragment sits at a real Z offset
   inside a perspective frustum, so the browser derives its screen size from
   its distance. Blur, opacity and drift speed are then interpolated from that
   same distance, which is what keeps every cue agreeing with every other one.
   ========================================================================= */

/** Camera focal length for the debris frustum, in px. */
export const PLANE_PERSPECTIVE = 1250;

interface DepthBand {
  /** Z range in px. Negative recedes from the camera. */
  z: [number, number];
  /** Defocus at the near and far end of the band. */
  blur: [number, number];
  opacity: [number, number];
  /** Seconds for one full tumble. Closer fragments tumble faster. */
  spin: [number, number];
}

export const DEPTH_BANDS: Record<ShardDepth, DepthBand> = {
  // Deep background grit: tiny, soft, almost static.
  far: { z: [-1150, -720], blur: [3, 5.5], opacity: [0.16, 0.34], spin: [58, 96] },
  // The readable layer that carries the scene's structure.
  mid: { z: [-430, -110], blur: [0, 1.3], opacity: [0.58, 0.92], spin: [26, 52] },
  // Foreground fragments crossing the lens, well outside the focal plane.
  near: { z: [150, 370], blur: [7, 17], opacity: [0.3, 0.6], spin: [11, 24] },
};

/**
 * Deterministic 0..1 from a shard id.
 *
 * Every fragment needs its own depth, tumble axis and phase, but a real random
 * source would mean the server and the client disagree and React would rip the
 * markup out on hydration. Hashing the id gives per-shard variety that is
 * identical in both places.
 */
function hash01(seed: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // xorshift finish, then fold to 0..1
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return ((h >>> 0) % 100000) / 100000;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface ShardMotion {
  /** Distance from camera, px. */
  z: number;
  /** 0 = far edge of the band, 1 = near edge. */
  proximity: number;
  blur: number;
  opacity: number;
  /** Continuous tumble, seconds per revolution, per axis. */
  spinDuration: number;
  spinX: number;
  spinY: number;
  spinZ: number;
  /** Tumble phase offset so nothing starts in lockstep. */
  phase: number;
  /** Fragments this close to the lens get a directional smear. */
  motionBlur: boolean;
}

/**
 * Resolves a shard's placement in the frustum and how it moves through it.
 *
 * The three tumble axes are weighted independently, so some fragments spin
 * almost flat like a thrown plate, some roll end over end, and some do both.
 * Nothing shares a rotation signature with its neighbour.
 */
export function deriveShardMotion(shard: Shard): ShardMotion {
  const band = DEPTH_BANDS[shard.depth];
  const t = hash01(shard.id, 1);
  const z = lerp(band.z[0], band.z[1], t);

  // Proximity runs 0 (far edge) to 1 (near edge) within the band.
  const proximity = t;

  const axisPick = hash01(shard.id, 2);
  const spread = hash01(shard.id, 3);

  // Bias each fragment toward one dominant axis so tumbles read as distinct
  // physical behaviours rather than a uniform wobble.
  const dominant = axisPick < 0.34 ? "x" : axisPick < 0.67 ? "y" : "z";
  const strong = lerp(0.75, 1, spread);
  const weak = lerp(0.05, 0.4, hash01(shard.id, 4));
  const middling = lerp(0.2, 0.6, hash01(shard.id, 5));

  const direction = hash01(shard.id, 6) < 0.5 ? -1 : 1;

  return {
    z,
    proximity,
    blur: lerp(band.blur[1], band.blur[0], proximity),
    opacity: lerp(band.opacity[0], band.opacity[1], proximity),
    spinDuration: lerp(band.spin[1], band.spin[0], proximity),
    spinX: direction * 360 * (dominant === "x" ? strong : weak),
    spinY: direction * 360 * (dominant === "y" ? strong : middling),
    spinZ: -direction * 360 * (dominant === "z" ? strong : weak),
    phase: hash01(shard.id, 7),
    motionBlur: shard.depth === "near" && proximity > 0.45,
  };
}
