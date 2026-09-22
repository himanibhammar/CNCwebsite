"use client";

import { clsx } from "clsx";
import {
  PLANE_PERSPECTIVE,
  SHARD_SHAPES,
  SHARDS,
  deriveShardMotion,
  type ShardDepth,
} from "./hero-config";

interface HeroDebrisProps {
  /**
   * Focal plane to render. Planes mount separately so the headline can be
   * interleaved between them in the z-stack. That interleaving, with fragments
   * both behind and in front of the type, is what makes the composition read
   * as space rather than as stacked images.
   */
  plane: ShardDepth;
  className?: string;
}

/**
 * Machined fragments suspended in a perspective frustum.
 *
 * Each fragment sits at a real Z offset inside a `perspective` container, so
 * the browser derives its on-screen size from its distance rather than from a
 * width we picked. Defocus, opacity and tumble rate are interpolated from that
 * same distance, so every depth cue agrees with every other one.
 *
 * The DOM is four levels deep, and each level owns exactly one job. That
 * separation matters: GSAP writes whole `transform` strings, so two animations
 * on one node would silently overwrite each other.
 *
 *   anchor          placement + Z, never animated
 *   [data-shard]    entrance and drift (opacity, x, y)
 *   [data-spin]     continuous tumble on three axes
 *   face            static orientation, bevel and defocus
 */
export function HeroDebris({ plane, className }: HeroDebrisProps) {
  const shards = SHARDS.filter((shard) => shard.depth === plane);

  return (
    <div
      aria-hidden="true"
      data-debris-plane={plane}
      className={clsx("pointer-events-none absolute inset-0", className)}
      style={{
        perspective: `${PLANE_PERSPECTIVE}px`,
        perspectiveOrigin: "50% 45%",
        transformStyle: "preserve-3d",
      }}
    >
      {shards.map((shard) => {
        const motion = deriveShardMotion(shard);

        return (
          <div
            key={shard.id}
            className="absolute"
            style={{
              left: `${shard.x}%`,
              top: `${shard.y}%`,
              width: `clamp(${Math.round(shard.size * 0.4)}px, ${(
                (shard.size / 1440) *
                100
              ).toFixed(2)}vw, ${Math.round(shard.size * 1.2)}px)`,
              aspectRatio: `1 / ${shard.ratio}`,
              // Perspective does the depth scaling; we only place the fragment.
              transform: `translate3d(-50%, -50%, ${motion.z.toFixed(0)}px)`,
              transformStyle: "preserve-3d",
              opacity: motion.opacity,
            }}
          >
            <div
              data-shard={shard.id}
              data-drift={shard.drift}
              data-travel={shard.travel}
              data-delay={shard.delay}
              data-proximity={motion.proximity.toFixed(3)}
              className="h-full w-full will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                data-spin={shard.id}
                data-spin-x={motion.spinX.toFixed(1)}
                data-spin-y={motion.spinY.toFixed(1)}
                data-spin-z={motion.spinZ.toFixed(1)}
                data-spin-duration={motion.spinDuration.toFixed(2)}
                data-spin-phase={motion.phase.toFixed(3)}
                className="h-full w-full will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="relative h-full w-full"
                  style={{
                    transform: `rotate(${shard.rotate}deg) rotateX(${shard.tiltX}deg) rotateY(${shard.tiltY}deg)`,
                    filter: [
                      motion.blur > 0.05 ? `blur(${motion.blur.toFixed(1)}px)` : "",
                      // Fragments crossing close to the lens smear along their
                      // travel instead of staying crisp.
                      motion.motionBlur
                        ? `drop-shadow(0 0 ${(motion.blur * 0.8).toFixed(
                            1
                          )}px rgba(120,150,190,0.25))`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" "),
                  }}
                >
                  {/* Cast shadow, thrown down and away from the key light */}
                  <div
                    className="absolute inset-0 translate-x-[-6%] translate-y-[10%]"
                    style={{
                      clipPath: SHARD_SHAPES[shard.shape],
                      background: "rgba(0,0,0,0.72)",
                      filter: "blur(6px)",
                    }}
                  />

                  {/* Alloy body */}
                  <div
                    className={clsx(
                      "absolute inset-0",
                      shard.dark ? "shard-face-dark" : "shard-face"
                    )}
                    style={{ clipPath: SHARD_SHAPES[shard.shape] }}
                  />

                  {/* Specular sliver along the lit edge */}
                  <div
                    className="absolute inset-0 mix-blend-screen"
                    style={{
                      clipPath: SHARD_SHAPES[shard.shape],
                      background:
                        "linear-gradient(118deg, transparent 0%, transparent 42%, rgba(214,232,255,0.5) 49%, rgba(255,255,255,0.85) 51%, rgba(170,200,245,0.28) 55%, transparent 64%)",
                    }}
                  />

                  {/* Ambient occlusion pooling on the underside */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: SHARD_SHAPES[shard.shape],
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.58) 0%, transparent 46%)",
                    }}
                  />

                  {/* Cool bounce from the key light washing the far edge */}
                  <div
                    className="absolute inset-0 mix-blend-screen opacity-40"
                    style={{
                      clipPath: SHARD_SHAPES[shard.shape],
                      background:
                        "linear-gradient(298deg, rgba(150,190,245,0.4) 0%, transparent 38%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
