"use client";

/* eslint-disable react-hooks/immutability --
   Same exemption as components/ui/3d-gallery-photography.tsx: react-three-fiber
   animates by mutating the Three.js object graph from `useFrame`, outside
   React, sixty times a second. That is the library's supported pattern and
   the React Compiler immutability rule has no model for it, so it is off for
   this file only. Every other rule stays on. */

import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * HERO VEHICLE
 *
 * Bruno Simon's folio-2025 vehicle (MIT, see public/models/vehicle.LICENSE.txt)
 * driving around the hero stage, chasing the cursor.
 *
 * The model ships as a kit, not a finished car: a chassis plus ONE wheel
 * assembly (tyre, arch guard, suspension strut) parked under the body. The
 * source project clones that wheel four times in code, mirrors the two on the
 * right side, spins the tyres and stretches the struts as the suspension
 * works. This does the same, with a small kinematic model in place of the
 * source's physics engine:
 *
 *   drive      bicycle-model steering toward a target on the ground plane,
 *              arrive-style braking, reversing when the target is behind
 *   wheels     spin from distance travelled, front pair steers
 *   body       springs for pitch (accel/brake), roll (cornering) and a road
 *              buzz, with each strut re-stretched so the tyres stay planted
 *   lights     stop lights on braking, back lights reversing, blinkers turning
 *
 * It opens with a stunt choreographed with the hero stage: dropped in from
 * above onto the C of CHALLENGES, it drives the headline, over the
 * ampersand, U-turns and runs CHAMPIONSHIPS back to its C, reporting its
 * screen position every frame so the stage can uncover the type beneath it.
 * Then it parks and waits for the cursor.
 *
 * With no pointer input for a while, the mouse outside the window, or on
 * touch until tapped, the target roams a figure of eight so the stage never
 * goes still.
 */

const MODEL_URL = "/models/vehicle.glb";

/** Body and wheel-hub paint. The model ships red; the site wants light blue. */
const PAINT = "#8ecbff";

/** Wheel layout from the source project's physics settings. Front is +X. */
const WHEEL_OFFSET = { x: 0.9, z: 0.75 };
const WHEEL_RADIUS = 0.4;
const WHEELBASE = WHEEL_OFFSET.x * 2;
/** The source clamps wheel travel here: the tyre fully tucked into its arch. */
const WHEEL_TUCKED = -0.5;

/** Chassis origin above the ground. Slightly lifted so the struts show. */
const RIDE_HEIGHT = 1.15;

const MAX_SPEED = 7.5;
const MAX_REVERSE = 3.2;
const ACCEL = 9;
const BRAKE = 16;
/** Steering lock: tight at a crawl so U-turns stay on screen, gentler at speed. */
const STEER_LOCK = { slow: 0.95, fast: 0.55 };
const ARRIVE_RADIUS = 1.3;
/** Seconds without input before the car stops waiting and roams. */
const IDLE_AFTER = 10;

/** Camera looks down at the ground plane from the front. */
const CAMERA_DIRECTION = new THREE.Vector3(0, 13, 13).normalize();
const CAMERA_FOV = 32;
/**
 * Minimum ground area kept in view, so the car stays a sensible size.
 * Portrait screens get a narrower field, or the car shrinks to a speck.
 */
const MIN_VIEW = {
  landscape: { width: 20, height: 11.5 },
  portrait: { width: 9, height: 8 },
};

const GROUND = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

interface Pointer {
  /** Normalised device coordinates of the last input. */
  ndc: THREE.Vector2;
  /** Clock time of the last input, or -Infinity if none yet. */
  at: number;
}

interface Wheel {
  container: THREE.Object3D;
  cylinder: THREE.Object3D | null;
  suspension: THREE.Object3D | null;
  x: number;
  z: number;
  mirrored: boolean;
  front: boolean;
}

interface Rig {
  root: THREE.Group;
  body: THREE.Group;
  wheels: Wheel[];
  lights: {
    stop: THREE.Object3D | null;
    back: THREE.Object3D | null;
    blinkLeft: THREE.Object3D | null;
    blinkRight: THREE.Object3D | null;
  };
}

/* ------------------------------------------------------------------------
   Maths helpers
   ---------------------------------------------------------------------- */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Shortest signed angle from a to b, in (-PI, PI]. */
const angleDelta = (from: number, to: number) => {
  const d = (to - from) % (Math.PI * 2);
  return d > Math.PI ? d - Math.PI * 2 : d < -Math.PI ? d + Math.PI * 2 : d;
};

/** 0..1 ease with soft ends, clamped. */
const smoothstep = (x: number) => {
  const c = clamp(x, 0, 1);
  return c * c * (3 - 2 * c);
};

const approach = (value: number, target: number, maxStep: number) =>
  value < target
    ? Math.min(target, value + maxStep)
    : Math.max(target, value - maxStep);

/** Damped spring step; returns [position, velocity]. */
const spring = (
  x: number,
  v: number,
  target: number,
  dt: number,
  stiffness = 90,
  damping = 9
): [number, number] => {
  const nextV = v + (stiffness * (target - x) - damping * v) * dt;
  return [x + nextV * dt, nextV];
};

/* ------------------------------------------------------------------------
   Rig: turn the kit into a car
   ---------------------------------------------------------------------- */

function buildRig(source: THREE.Object3D): Rig {
  const model = source.clone(true);

  // Repaint: the body and hub panels share the model's "redGradient"
  // material. Clone it so the cached original is left alone.
  let paint: THREE.MeshStandardMaterial | null = null;
  model.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const material = mesh.isMesh
      ? (mesh.material as THREE.MeshStandardMaterial)
      : null;
    if (material?.name === "redGradient") {
      paint ??= Object.assign(material.clone(), { name: "paint" });
      paint.color.set(PAINT);
      mesh.material = paint;
    }
  });

  // The paint is a 128x4 strip of flat swatches, one texel per colour. The
  // file asks for mipmaps, and at this size the mip chain averages the whole
  // strip into a muddy olive, so sample exact texels instead.
  model.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const material = mesh.isMesh ? (mesh.material as THREE.MeshStandardMaterial) : null;
    if (material?.map && material.map.generateMipmaps) {
      material.map.generateMipmaps = false;
      material.map.minFilter = THREE.NearestFilter;
      material.map.magFilter = THREE.NearestFilter;
      material.map.needsUpdate = true;
    }
  });

  const find = (pattern: RegExp) => {
    let match: THREE.Object3D | null = null;
    model.traverse((child) => {
      if (!match && pattern.test(child.name)) match = child;
    });
    return match as THREE.Object3D | null;
  };

  const chassis = find(/^chassis/);
  const template = find(/^wheelContainer/);
  if (!chassis || !template) {
    throw new Error("vehicle.glb is missing its chassis or wheel template");
  }

  // root: ground position and heading. body: ride height, pitch and roll.
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  chassis.removeFromParent();
  chassis.position.set(0, 0, 0);
  body.add(chassis);

  template.removeFromParent();

  // Wheel order follows the source: front right, front left, rear right,
  // rear left. The template is modelled for the left side (-Z), so the
  // right-hand pair is turned half a revolution to face outward.
  const layout = [
    { x: WHEEL_OFFSET.x, z: WHEEL_OFFSET.z },
    { x: WHEEL_OFFSET.x, z: -WHEEL_OFFSET.z },
    { x: -WHEEL_OFFSET.x, z: WHEEL_OFFSET.z },
    { x: -WHEEL_OFFSET.x, z: -WHEEL_OFFSET.z },
  ];

  const wheels = layout.map(({ x, z }, i): Wheel => {
    const container = template.clone(true);
    let cylinder: THREE.Object3D | null = null;
    let suspension: THREE.Object3D | null = null;

    container.traverse((child) => {
      if (/^wheelCylinder/.test(child.name)) cylinder = child;
      if (/^wheelSuspension/.test(child.name)) suspension = child;
    });

    const mirrored = z > 0;
    container.position.set(x, WHEEL_TUCKED, z);
    container.rotation.y = mirrored ? Math.PI : 0;
    body.add(container);

    return { container, cylinder, suspension, x, z, mirrored, front: i < 2 };
  });

  const lights = {
    stop: find(/^stopLights/),
    back: find(/^backLights/),
    blinkLeft: find(/^blinkerLeft/),
    blinkRight: find(/^blinkerRight/),
  };
  Object.values(lights).forEach((light) => light && (light.visible = false));

  return { root, body, wheels, lights };
}

/* ------------------------------------------------------------------------
   Scene pieces
   ---------------------------------------------------------------------- */

/** Frames the ground so a minimum area is always visible, at any aspect. */
function frameCamera(
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number
) {
  const aspect = width / Math.max(height, 1);
  const view = aspect < 1 ? MIN_VIEW.portrait : MIN_VIEW.landscape;
  const tan = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));
  const needed = Math.max(view.height, view.width / aspect);
  const distance = needed / 2 / tan;

  camera.fov = CAMERA_FOV;
  camera.position.copy(CAMERA_DIRECTION).multiplyScalar(distance);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
  // Ground picking reads the world matrix, which the renderer would only
  // refresh at the end of this frame
  camera.updateMatrixWorld();
}

interface Bounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

// Scratch objects, reused every frame.
const scratchRay = new THREE.Raycaster();
const scratchHit = new THREE.Vector3();
const scratchNdc = new THREE.Vector2();

/** Where a point on screen (NDC) lands on the ground, or null above the horizon. */
function toGround(camera: THREE.Camera, x: number, y: number) {
  scratchRay.setFromCamera(scratchNdc.set(x, y), camera);
  return scratchRay.ray.intersectPlane(GROUND, scratchHit);
}

/**
 * Ground rectangle guaranteed to be on screen, inset by a margin. The view
 * is a trapezoid on the ground: the screen's bottom edge is the near, narrow
 * side, so its half width bounds X; the top and bottom centres bound Z.
 */
function groundBounds(camera: THREE.Camera, margin: number, out: Bounds) {
  const halfWidth = Math.abs(toGround(camera, 1, -1)?.x ?? 6);
  out.minX = -halfWidth + margin;
  out.maxX = halfWidth - margin;
  out.minZ = (toGround(camera, 0, 1)?.z ?? -5) + margin;
  out.maxZ = (toGround(camera, 0, -1)?.z ?? 5) - margin;
}

/* ------------------------------------------------------------------------
   Intro: drop onto the headline and drive it
   ---------------------------------------------------------------------- */

/** How the hero stage and the car coordinate the opening sequence. */
export interface VehicleIntro {
  /** "go" once the headline is laid out; "skip" if the stage gave up. */
  status: "pending" | "go" | "skip";
  /** The type the route is measured from, or null if it is not ready. */
  targets: () => {
    /** Line block of CHALLENGES &, for its vertical band. */
    line1: HTMLElement;
    /** The CHALLENGES word itself, for its horizontal extent. */
    word1: HTMLElement;
    amp: HTMLElement;
    /** Line block of CHAMPIONSHIPS. */
    line2: HTMLElement;
  } | null;
  onStart: () => void;
  /** Every frame on the ground: which line the car is on, and its screen x. */
  onProgress: (leg: IntroLeg, clientX: number) => void;
  /** The car has reached the ampersand. */
  onAmp: () => void;
  onDone: () => void;
  /** The car cannot run at all (no WebGL, model failed): go on without it. */
  abort: () => void;
  /**
   * 0..1, driven by the stage as it clears for OUR FLAGSHIPS: the car
   * stops, turns to face the viewer and zooms off the bottom of the frame.
   * Winding it back to 0 returns the car exactly where it was.
   */
  exit: number;
}

export type IntroLeg = "line1" | "turn" | "line2";

/** Height the car is dropped from, above its ride height. */
const DROP_HEIGHT = 12;

/** Exit: heading that faces the viewer (forward +X turned to +Z). */
const EXIT_HEADING = -Math.PI / 2;
/** Exit: ground distance run toward the camera, far enough to leave frame. */
const EXIT_RUN = 24;
/** Exit: extra scale at the end of the run, on top of the perspective. */
const EXIT_ZOOM = 0.8;
const GRAVITY = 34;
/** Beat on the springs after touchdown before it pulls away. */
const LAND_PAUSE = 0.35;
const INTRO_SPEED = 9.5;
const INTRO_ACCEL = 13;
const INTRO_DECEL = 10;
/** Sideways grip on the route; sets how fast it takes the U-turn. */
const LATERAL_GRIP = 16;
/** Fraction down each headline line that the tyres run along. */
const ROUTE_Y = 0.74;
/** Half the car's length plus a margin, in ground units. */
const CAR_HALF_LENGTH = 1.9;
/** Route control points that mark where the legs change (see buildRoute). */
const ROUTE_AMP = 4;
const ROUTE_LINE2 = 6;

/** Fully extended strut, when the car is in the air. */
const WHEEL_DROOP = -1.1;
/** Deepest the body can sink before the tucked tyres would meet the ground. */
const MAX_SQUAT = RIDE_HEIGHT - WHEEL_RADIUS + WHEEL_TUCKED;

interface Route {
  curve: THREE.CatmullRomCurve3;
  length: number;
  /** Segments in the curve, to turn curve t into a control point index. */
  span: number;
  ampReached: boolean;
}

/**
 * Lays the route over the headline as it sits on screen: land on the C of
 * CHALLENGES, run to its S, over the ampersand, U-turn at the right edge,
 * then back along CHAMPIONSHIPS from its S to its C. Every point is measured
 * in screen space and cast onto the ground, so the car tracks the type at
 * any viewport size.
 */
function buildRoute(
  intro: VehicleIntro,
  canvas: HTMLCanvasElement,
  camera: THREE.Camera
): Route | null {
  const el = intro.targets();
  if (!el) return null;

  const view = canvas.getBoundingClientRect();
  if (!view.width || !view.height) return null;

  const l1 = el.line1.getBoundingClientRect();
  const w1 = el.word1.getBoundingClientRect();
  const amp = el.amp.getBoundingClientRect();
  const l2 = el.line2.getBoundingClientRect();
  if (!w1.width || !l2.width) return null;

  const y1 = l1.top + l1.height * ROUTE_Y;
  const y2 = l2.top + l2.height * ROUTE_Y;
  const along = (rect: DOMRect, f: number) => rect.left + rect.width * f;
  // The U-turn apex sits just past the type, but far enough inside the
  // frame that the whole car stays on screen through the turn
  const turnX = Math.min(
    Math.max(amp.right, l2.right) + (y2 - y1) * 0.2,
    view.right - view.width * 0.1
  );

  const screen: [number, number][] = [
    [along(w1, 0.06), y1], // 0  the C: touchdown
    [along(w1, 0.38), y1],
    [along(w1, 0.7), y1],
    [along(w1, 0.97), y1], // 3  the S
    [amp.left + amp.width * 0.5, amp.top + amp.height * 0.72], // 4  the &
    [turnX, (y1 + y2) / 2], // 5  U-turn
    [along(l2, 0.92), y2], // 6  the S of CHAMPIONSHIPS
    [along(l2, 0.62), y2],
    [along(l2, 0.3), y2],
    [along(l2, 0.06), y2], // 9  the C: stop
  ];

  const points: THREE.Vector3[] = [];
  for (const [x, y] of screen) {
    const ndcY = -((y - view.top) / view.height) * 2 + 1;
    const hit = toGround(camera, ((x - view.left) / view.width) * 2 - 1, ndcY);
    if (!hit) return null;
    const point = new THREE.Vector3(hit.x, 0, hit.z);

    // Keep the whole car on screen: on a narrow viewport the C at either
    // end of the headline sits closer to the edge than half a car length
    const left = toGround(camera, -1, ndcY)?.x;
    const right = toGround(camera, 1, ndcY)?.x;
    if (left !== undefined && right !== undefined) {
      point.x = clamp(point.x, left + CAR_HALF_LENGTH, right - CAR_HALF_LENGTH);
    }
    points.push(point);
  }

  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
  return {
    curve,
    length: curve.getLength(),
    span: points.length - 1,
    ampReached: false,
  };
}

const scratchTangent = new THREE.Vector3();
const scratchPoint = new THREE.Vector3();
const scratchProject = new THREE.Vector3();

/** Heading of the route at a distance along it (yaw, forward = +X). */
function headingAt(route: Route, distance: number) {
  const u = clamp(distance / route.length, 0, 1);
  route.curve.getTangentAt(u, scratchTangent);
  return Math.atan2(-scratchTangent.z, scratchTangent.x);
}

/** Signed curvature (rad per unit), positive turning toward -Z. */
function curvatureAt(route: Route, distance: number) {
  const ds = 0.3;
  const a = clamp(distance - ds / 2, 0, route.length);
  const b = clamp(distance + ds / 2, 0, route.length);
  if (b - a < 1e-4) return 0;
  return angleDelta(headingAt(route, a), headingAt(route, b)) / (b - a);
}

/* ------------------------------------------------------------------------
   The car
   ---------------------------------------------------------------------- */

type Mode = "waiting" | "intro" | "free";

interface Sim {
  mode: Mode;
  placed: boolean;
  route: Route | null;
  /** Distance travelled along the intro route. */
  dist: number;
  /** Height above ride height while dropping in, and its velocity. */
  air: number;
  airV: number;
  landedAt: number;
  /** When the car last had a reason to stay put (end of the intro). */
  holdSince: number;
  /** How far the exit run has carried the car, for spinning its wheels. */
  exitRun: number;
  x: number;
  z: number;
  yaw: number;
  speed: number;
  steer: number;
  /**
   * "toward": backing up to a target close behind. "swing": the reverse
   * leg of a three-point turn, nose swinging round toward the target.
   */
  reverse: "none" | "toward" | "swing";
  spin: number;
  pitch: number;
  pitchV: number;
  roll: number;
  rollV: number;
  lift: number;
  liftV: number;
}

interface Step {
  accel: number;
  yawRate: number;
  braking: boolean;
}

/** One frame of the scripted drop and drive along the headline. */
function stepIntro(s: Sim, route: Route, t: number, dt: number): Step {
  let accel = 0;
  let braking = false;

  if (s.air > 0) {
    s.airV -= GRAVITY * dt;
    s.air += s.airV * dt;

    if (s.air <= 0) {
      // Touchdown: the body carries on down into the springs, the nose
      // kicks, and it all settles back out
      s.liftV += Math.max(s.airV * 0.14, -3.4);
      s.pitchV += 0.55;
      s.rollV -= 0.3;
      s.air = 0;
      s.airV = 0;
      s.landedAt = t;
    }
  } else if (t - s.landedAt > LAND_PAUSE) {
    // Fastest speed that still makes the bends ahead and stops on the mark
    const remaining = route.length - s.dist;
    const bend = Math.max(
      Math.abs(curvatureAt(route, s.dist + 0.8)),
      Math.abs(curvatureAt(route, s.dist + 2)),
      1e-3
    );
    const wanted = Math.min(
      INTRO_SPEED,
      Math.sqrt(LATERAL_GRIP / bend),
      Math.sqrt(2 * INTRO_DECEL * Math.max(remaining, 0))
    );

    const previous = s.speed;
    s.speed = approach(
      s.speed,
      wanted,
      (wanted > s.speed ? INTRO_ACCEL : BRAKE) * dt
    );
    accel = (s.speed - previous) / Math.max(dt, 1e-4);
    braking = wanted < previous - 0.2 && previous > 0.5;
    s.dist = Math.min(route.length, s.dist + s.speed * dt);
  }

  route.curve.getPointAt(clamp(s.dist / route.length, 0, 1), scratchPoint);
  s.x = scratchPoint.x;
  s.z = scratchPoint.z;
  s.yaw = headingAt(route, s.dist);

  // The wheels steer the curvature the route actually has
  const curvature = curvatureAt(route, s.dist);
  const steerTarget = clamp(
    Math.atan(WHEELBASE * curvature),
    -STEER_LOCK.slow,
    STEER_LOCK.slow
  );
  s.steer += (steerTarget - s.steer) * Math.min(1, dt * 10);
  s.spin += (s.speed * dt) / WHEEL_RADIUS;

  return { accel, yawRate: s.speed * curvature, braking };
}

/** One frame of free driving toward a ground target. */
function stepDrive(
  s: Sim,
  tx: number,
  tz: number,
  b: Bounds,
  dt: number
): Step {
  const dx = tx - s.x;
  const dz = tz - s.z;
  const distance = Math.hypot(dx, dz);
  // Forward is +X, and a positive yaw turns +X toward -Z
  const bearing = Math.atan2(-dz, dx);
  const ahead = angleDelta(s.yaw, bearing);
  const arrived = distance < ARRIVE_RADIUS;

  // Target close behind: back up to it rather than orbit it. Target far
  // behind with the car against an edge: a forward U-turn would swing off
  // screen, so do a three-point turn, reversing on full lock until the nose
  // comes round.
  const nearEdge =
    s.x < b.minX + 0.5 ||
    s.x > b.maxX - 0.5 ||
    s.z < b.minZ + 0.5 ||
    s.z > b.maxZ - 0.5;

  if (s.reverse === "none" && Math.abs(ahead) > 2.3 && distance < 4) {
    s.reverse = "toward";
  } else if (s.reverse === "none" && Math.abs(ahead) > 2 && nearEdge) {
    s.reverse = "swing";
  } else if (
    s.reverse === "toward" &&
    (Math.abs(ahead) < 1.2 || distance > 5.5)
  ) {
    s.reverse = "none";
  } else if (s.reverse === "swing" && Math.abs(ahead) < 0.9) {
    s.reverse = "none";
  }

  let steerTarget: number;
  let wanted: number;
  const pace = Math.min(1, Math.abs(s.speed) / MAX_SPEED);
  const lock = STEER_LOCK.slow + (STEER_LOCK.fast - STEER_LOCK.slow) * pace;

  if (s.reverse === "swing") {
    // In reverse, opposite lock turns the nose toward the target
    steerTarget = -Math.sign(ahead) * STEER_LOCK.slow;
    wanted = -MAX_REVERSE * 0.8;
  } else if (s.reverse === "toward") {
    const behind = angleDelta(s.yaw + Math.PI, bearing);
    steerTarget = arrived ? 0 : -clamp(behind * 1.6, -lock, lock);
    wanted = arrived
      ? 0
      : -Math.min(MAX_REVERSE, (distance - ARRIVE_RADIUS) * 2);
  } else {
    steerTarget = arrived ? 0 : clamp(ahead * 1.6, -lock, lock);
    // Slow right down for anything well off the nose, so the turn is
    // tight instead of a wide arc off the edge of the screen
    const cornering = clamp(1 - Math.abs(ahead) / (Math.PI * 0.6), 0.38, 1);
    wanted = arrived
      ? 0
      : Math.min(MAX_SPEED, (distance - ARRIVE_RADIUS) * 2.2) * cornering;
  }

  s.steer += (steerTarget - s.steer) * Math.min(1, dt * 8);

  const previous = s.speed;
  const speedingUp = Math.abs(wanted) > Math.abs(s.speed);
  s.speed = approach(s.speed, wanted, (speedingUp ? ACCEL : BRAKE) * dt);

  const yawRate = (s.speed / WHEELBASE) * Math.tan(s.steer);
  s.yaw += yawRate * dt;
  s.x += Math.cos(s.yaw) * s.speed * dt;
  s.z -= Math.sin(s.yaw) * s.speed * dt;
  s.spin += (s.speed * dt) / WHEEL_RADIUS;

  return {
    accel: (s.speed - previous) / Math.max(dt, 1e-4),
    yawRate,
    braking: Math.abs(wanted) < Math.abs(s.speed) - 0.2 && Math.abs(s.speed) > 0.5,
  };
}

function Vehicle({
  pointer,
  reduced,
  intro,
}: {
  pointer: React.RefObject<Pointer>;
  reduced: boolean;
  intro?: React.RefObject<VehicleIntro | null>;
}) {
  const { scene } = useGLTF(MODEL_URL, false, false);
  const invalidate = useThree((state) => state.invalidate);

  // three.js objects are mutated every frame, so they live in refs, not in
  // render state. The rig is assembled from a clone and mounted imperatively.
  const mountRef = useRef<THREE.Group>(null);
  const rigRef = useRef<Rig | null>(null);
  const framedFor = useRef("");
  const bounds = useRef<Bounds>({ minX: -6, maxX: 6, minZ: -4, maxZ: 4 });

  // Everything the simulation mutates per frame.
  const sim = useRef<Sim>({
    mode: "waiting",
    placed: false,
    route: null,
    dist: 0,
    air: 0,
    airV: 0,
    landedAt: -Infinity,
    holdSince: -Infinity,
    exitRun: 0,
    x: 0,
    z: 0,
    yaw: 0,
    speed: 0,
    steer: 0,
    reverse: "none",
    spin: 0,
    pitch: 0,
    pitchV: 0,
    roll: 0,
    rollV: 0,
    lift: 0,
    liftV: 0,
  });

  useEffect(() => {
    const rig = buildRig(scene);
    mountRef.current?.add(rig.root);
    rigRef.current = rig;
    invalidate();

    return () => {
      rig.root.removeFromParent();
      rigRef.current = null;
    };
  }, [scene, invalidate]);

  // Reduced motion renders on demand; ask for the one frame that parks it.
  useEffect(() => {
    if (reduced) {
      sim.current.mode = "free";
      sim.current.placed = false;
    }
    invalidate();
  }, [reduced, invalidate]);

  useFrame((state, rawDelta) => {
    const rig = rigRef.current;
    if (!rig) return;

    const dt = Math.min(rawDelta, 1 / 20);
    const s = sim.current;
    const t = state.clock.elapsedTime;
    const { root, body, wheels, lights } = rig;
    const camera = state.camera as THREE.PerspectiveCamera;
    const canvas = state.gl.domElement;
    const b = bounds.current;
    const cue = intro?.current ?? null;
    const exitAmount = clamp(cue?.exit ?? 0, 0, 1);

    const frame = `${state.size.width}x${state.size.height}`;
    if (framedFor.current !== frame) {
      frameCamera(camera, state.size.width, state.size.height);
      framedFor.current = frame;
    }
    groundBounds(camera, 1.8, b);

    /* ---- mode ------------------------------------------------------- */
    if (s.mode === "waiting") {
      if (reduced || !cue || cue.status === "skip") {
        s.mode = "free";
      } else if (cue.status === "go") {
        const route = buildRoute(cue, canvas, camera);
        if (route) {
          s.route = route;
          s.mode = "intro";
          s.placed = true;
          s.dist = 0;
          s.speed = 0;
          s.air = DROP_HEIGHT;
          s.airV = 0;
          s.yaw = headingAt(route, 0);
          cue.onStart();
        }
      }
    }

    if (s.mode === "free" && !s.placed) {
      // Parked in view when motion is reduced; otherwise off stage left,
      // so the first thing it does is drive in.
      s.x = reduced ? b.maxX * 0.45 : b.minX - 4;
      s.z = reduced ? b.maxZ * 0.4 : b.maxZ * 0.35;
      s.yaw = reduced ? 0.5 : 0;
      s.placed = true;
    }

    // The stage is clearing for OUR FLAGSHIPS. If the intro was still
    // running, it ends where the car stands; the car then holds still.
    if (exitAmount > 0 && s.mode === "intro") {
      s.mode = "free";
      s.route = null;
      s.speed = 0;
      s.air = 0;
      s.airV = 0;
      s.holdSince = t;
    }

    // Nothing to show until the drop begins, or once it has zoomed away
    root.visible = s.mode !== "waiting" && exitAmount < 0.98;
    if (s.mode === "waiting") return;

    /* ---- drive ------------------------------------------------------ */
    let step: Step = { accel: 0, yawRate: 0, braking: false };

    if (exitAmount > 0) {
      // Held while the stage clears; the exit pose is applied below
    } else if (s.mode === "intro" && s.route && !reduced) {
      const route = s.route;
      step = stepIntro(s, route, t, dt);

      // Tell the stage where the car is, so the type is uncovered under it
      if (cue && s.air <= 0) {
        const index =
          route.curve.getUtoTmapping(s.dist / route.length, s.dist) * route.span;
        if (!route.ampReached && index >= ROUTE_AMP) {
          route.ampReached = true;
          cue.onAmp();
        }

        scratchProject.set(s.x, 0, s.z).project(camera);
        const view = canvas.getBoundingClientRect();
        const clientX = view.left + ((scratchProject.x + 1) / 2) * view.width;
        const leg: IntroLeg =
          index < ROUTE_AMP ? "line1" : index < ROUTE_LINE2 ? "turn" : "line2";
        cue.onProgress(leg, clientX);
      }

      if (s.dist >= route.length - 0.02) {
        s.mode = "free";
        s.speed = 0;
        s.holdSince = t;
        s.route = null;
        cue?.onDone();
      }
    } else if (s.mode === "free" && !reduced) {
      const input = pointer.current;
      const following = t - input.at < IDLE_AFTER;
      const holding = !following && t - s.holdSince < IDLE_AFTER;
      let tx: number;
      let tz: number;

      if (following) {
        const point = toGround(camera, input.ndc.x, input.ndc.y);
        tx = point ? point.x : s.x;
        tz = point ? point.z : s.z;
      } else if (holding) {
        // Just finished the intro: wait where it stopped for the cursor
        tx = s.x;
        tz = s.z;
      } else {
        // Figure of eight across the stage
        const w = (b.maxX - b.minX) / 2;
        const d = (b.maxZ - b.minZ) / 2;
        const cx = (b.maxX + b.minX) / 2;
        const cz = (b.maxZ + b.minZ) / 2;
        tx = cx + w * 0.8 * Math.sin(t * 0.21);
        tz = cz + d * 0.7 * Math.sin(t * 0.42);
      }

      step = stepDrive(
        s,
        clamp(tx, b.minX, b.maxX),
        clamp(tz, b.minZ, b.maxZ),
        b,
        dt
      );
    }

    /* ---- body and lights -------------------------------------------- */
    if (!reduced) {
      // Nose lifts under acceleration and dives under braking (about Z),
      // and the body leans to the outside of a turn (about X).
      const pace = Math.min(1, Math.abs(s.speed) / MAX_SPEED);
      const pitchTarget = clamp(
        step.accel * 0.011 * Math.sign(s.speed || 1),
        -0.11,
        0.11
      );
      const rollTarget = clamp(s.speed * step.yawRate * 0.022, -0.13, 0.13);
      const buzz =
        s.air > 0
          ? 0
          : pace * 0.025 * (Math.sin(t * 19) * 0.6 + Math.sin(t * 31 + 1.3) * 0.4);

      [s.pitch, s.pitchV] = spring(s.pitch, s.pitchV, pitchTarget, dt);
      [s.roll, s.rollV] = spring(s.roll, s.rollV, rollTarget, dt);
      [s.lift, s.liftV] = spring(s.lift, s.liftV, buzz, dt, 140, 12);
      if (s.lift < -MAX_SQUAT) {
        s.lift = -MAX_SQUAT;
        s.liftV = Math.max(s.liftV, 0);
      }

      if (lights.stop) lights.stop.visible = step.braking;
      if (lights.back) lights.back.visible = s.speed < -0.1;

      const turning = Math.abs(s.steer) > 0.28 && Math.abs(s.speed) > 0.6;
      const blinkOn = Math.floor(t / 0.4) % 2 === 0;
      if (lights.blinkLeft) lights.blinkLeft.visible = turning && s.steer > 0 && blinkOn;
      if (lights.blinkRight) lights.blinkRight.visible = turning && s.steer < 0 && blinkOn;
    }

    /* ---- apply ------------------------------------------------------ */
    root.position.set(s.x, 0, s.z);
    root.rotation.y = s.yaw;

    if (exitAmount > 0) {
      // Turn to face the viewer, then run at the camera and off the bottom
      // of the frame, growing as it comes
      const turn = smoothstep(exitAmount / 0.45);
      root.rotation.y = s.yaw + angleDelta(s.yaw, EXIT_HEADING) * turn;
      const run = EXIT_RUN * exitAmount * exitAmount;
      root.position.z += run;
      root.scale.setScalar(1 + EXIT_ZOOM * exitAmount);
      s.spin += (run - s.exitRun) / WHEEL_RADIUS;
      s.exitRun = run;
    } else if (s.exitRun !== 0) {
      root.scale.setScalar(1);
      s.exitRun = 0;
    }

    const height = RIDE_HEIGHT + s.lift + s.air;
    body.position.y = height;
    body.rotation.set(s.roll, 0, s.pitch);

    const sinPitch = Math.sin(s.pitch);
    const sinRoll = Math.sin(s.roll);

    for (const wheel of wheels) {
      // Where this corner of the body sits, then drop the tyre to the
      // ground from there. The strut stretches to fill the gap, up to its
      // full extension while the car is in the air.
      const mountY = height + wheel.x * sinPitch - wheel.z * sinRoll;
      const drop = clamp(WHEEL_RADIUS - mountY, WHEEL_DROOP, WHEEL_TUCKED);
      wheel.container.position.y = drop;

      if (wheel.suspension) {
        wheel.suspension.scale.y = Math.max(0.001, Math.abs(drop) + WHEEL_TUCKED);
      }
      if (wheel.cylinder) {
        wheel.cylinder.rotation.z = wheel.mirrored ? s.spin : -s.spin;
      }
      if (wheel.front) {
        wheel.container.rotation.y = (wheel.mirrored ? Math.PI : 0) + s.steer;
      }
    }
  });

  return <group ref={mountRef} />;
}

useGLTF.preload(MODEL_URL, false, false);

/* ------------------------------------------------------------------------
   Canvas
   ---------------------------------------------------------------------- */

export default function HeroVehicle({
  intro,
}: {
  /** Opening choreography shared with the hero stage; omit to skip it. */
  intro?: React.RefObject<VehicleIntro | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ ndc: new THREE.Vector2(), at: -Infinity });
  const clockRef = useRef<() => number>(() => 0);
  const [visible, setVisible] = useState(true);
  // Read up front (this component never renders on the server): flipping it
  // after mount would switch the loop to on-demand before the parked frame
  // is drawn, leaving the car off stage.
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // The canvas is pointer-events-none so the page stays usable; listen on
  // the window and map into the canvas rectangle instead.
  useEffect(() => {
    const handle = (event: PointerEvent) => {
      // Touch only steers on a tap, never on a scroll gesture
      if (event.type === "pointermove" && event.pointerType === "touch") return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      if (event.clientY < rect.top || event.clientY > rect.bottom) return;

      pointer.current.ndc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      pointer.current.at = clockRef.current();
    };

    // Mouse gone from the window: stop waiting for it and roam
    const release = () => {
      pointer.current.at = -Infinity;
    };
    const root = document.documentElement;

    window.addEventListener("pointermove", handle, { passive: true });
    window.addEventListener("pointerdown", handle, { passive: true });
    root.addEventListener("mouseleave", release);
    return () => {
      window.removeEventListener("pointermove", handle);
      window.removeEventListener("pointerdown", handle);
      root.removeEventListener("mouseleave", release);
    };
  }, []);

  // Stop rendering once the hero has scrolled away
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting)
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <VehicleBoundary onFail={() => intro?.current?.abort()}>
        <Canvas
          frameloop={!visible ? "never" : reduced ? "demand" : "always"}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          camera={{ fov: CAMERA_FOV, near: 0.5, far: 120 }}
          onCreated={(state) => {
            clockRef.current = () => state.clock.elapsedTime;
          }}
        >
          {/* Cool key from the upper right to match the hero's lighting, a
              warm low fill, and a sky/ground wash so the shadow side reads. */}
          <hemisphereLight args={["#d6e4ff", "#20170f", 1.15]} />
          <directionalLight position={[6, 10, 3]} intensity={2.6} color="#eef3ff" />
          <directionalLight position={[-7, 4, -6]} intensity={0.9} color="#7fa6ff" />
          <ambientLight intensity={0.25} />

          <Suspense fallback={null}>
            <Vehicle pointer={pointer} reduced={reduced} intro={intro} />
          </Suspense>
        </Canvas>
      </VehicleBoundary>
    </div>
  );
}

/**
 * The car is decoration. If it cannot run (the model fails to load, WebGL is
 * unavailable), render nothing and let the stage carry on without it, rather
 * than letting the error take the whole page down.
 */
class VehicleBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
