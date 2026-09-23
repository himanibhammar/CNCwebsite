"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { HeroDebris } from "./HeroDebris";
import { PARALLAX_DEPTH } from "./hero-config";
import { useFitHeadline } from "./useFitHeadline";
import type { VehicleIntro } from "./HeroVehicle";

// WebGL only exists in the browser, and the car is decoration: load it after
// the stage, never on the server.
const HeroVehicle = dynamic(() => import("./HeroVehicle"), { ssr: false });

/** GSAP wants layout effects; SSR wants none. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Shards the ampersand breaks into: a fan of triangles from an off-centre
 * impact point to the rim of its box, each thrown outward along its own
 * bearing. Deterministic, so every visit shatters the same way.
 */
const AMP_IMPACT: [number, number] = [46, 56];
const AMP_RIM: [number, number][] = [
  [0, 0], [30, 0], [62, 0], [100, 0], [100, 38], [100, 72],
  [100, 100], [64, 100], [28, 100], [0, 100], [0, 62], [0, 26],
];
const AMP_SHARDS = AMP_RIM.map((a, i) => {
  const b = AMP_RIM[(i + 1) % AMP_RIM.length];
  const [cx, cy] = AMP_IMPACT;
  const dx = (a[0] + b[0] + cx) / 3 - cx;
  const dy = (a[1] + b[1] + cy) / 3 - cy;
  const length = Math.hypot(dx, dy) || 1;
  const reach = 150 + ((i * 37) % 90);
  return {
    clip: `polygon(${cx}% ${cy}%, ${a[0]}% ${a[1]}%, ${b[0]}% ${b[1]}%)`,
    x: (dx / length) * reach,
    y: (dy / length) * reach + 40,
    rotation: (i % 2 ? 1 : -1) * (120 + ((i * 53) % 200)),
  };
});

/** Seconds for the glide between the hero and OUR FLAGSHIPS. */
const GLIDE_DURATION = 1.1;

/** Soft edge of the wipe that follows the car across the headline, px. */
const WIPE_FEATHER = 90;
/** How far ahead of the car's centre the wipe edge runs, px. */
const WIPE_LEAD = 40;
/** Seconds to wait for the car before uncovering the headline without it. */
const CAR_TIMEOUT = 4;

/**
 * HERO
 *
 * One image, no supporting copy: CHALLENGES & CHAMPIONSHIPS standing in a
 * black frustum with machined debris tumbling through it. The brand is a
 * duality, so the lighting is too, a void on the left meeting a cold key light
 * on the right, with the ampersand sitting on the seam between them.
 *
 * Four motion systems run on the stage, each on its own DOM layer so they
 * never overwrite one another's transforms:
 *
 *   1. entrance      the rig powers up, then the car drops onto the headline
 *                    and drives it open, CHALLENGES left to right, over the
 *                    ampersand, CHAMPIONSHIPS back right to left
 *   2. drift + tumble  continuous, per fragment, no two alike
 *   3. pointer parallax  depth-weighted, interpolated
 *   4. exit          on the first scroll down the page holds while the stage
 *                    clears (CHALLENGES left, CHAMPIONSHIPS right, the
 *                    ampersand shatters, the car zooms off), then glides to
 *                    OUR FLAGSHIPS; scrolling back up reverses all of it
 */
export function HeroStage() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const ampersandRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const cueIntroRef = useRef<HTMLDivElement>(null);
  const cueIconRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  // Shared with the car so it can drive the headline open
  const introRef = useRef<VehicleIntro | null>(null);

  // Measured, not guessed: both lines span the full measure on every viewport.
  useFitHeadline([line1Ref, line2Ref], { lineHeight: 1.02 });

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        pointer: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { motion, pointer, reduced } = context.conditions as {
          motion: boolean;
          pointer: boolean;
          reduced: boolean;
        };

        const stage = stageRef.current;
        if (!stage) return;

        const shards = gsap.utils.toArray<HTMLElement>("[data-shard]", stage);
        const spinners = gsap.utils.toArray<HTMLElement>("[data-spin]", stage);
        const lines = [line1Ref.current, line2Ref.current];
        const parallaxNode = (name: string) =>
          stage.querySelector<HTMLElement>(`[data-parallax="${name}"]`);

        if (reduced) {
          gsap.set([atmosphereRef.current, cueIntroRef.current, ...shards], {
            opacity: 1,
          });
          gsap.set(lines, { yPercent: 0 });
          gsap.set(ampersandRef.current, { opacity: 1, scale: 1, rotate: 0 });

          // No choreography with reduced motion: the cue fades as you scroll
          gsap.to(cueRef.current, {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "20% top",
              scrub: true,
            },
          });
          return;
        }

        if (!motion) return;

        /* ---------------------------------------------------------------
           1. Entrance. The rig powers up; the headline stays dark until
              the car drives over it (1b).
           ------------------------------------------------------------- */
        gsap.set(atmosphereRef.current, { opacity: 0, scale: 1.18 });
        gsap.set(ampersandRef.current, { opacity: 0, scale: 0.45, rotate: -18 });
        gsap.set(cueIntroRef.current, { opacity: 0, y: -12 });
        gsap.set(shards, { opacity: 0, scale: 0.35 });

        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.1,
        });

        intro
          .to(atmosphereRef.current, {
            opacity: 1,
            scale: 1,
            duration: 2.1,
            ease: "power2.out",
          })
          .to(
            shards,
            {
              opacity: 1,
              scale: 1,
              duration: 1.6,
              ease: "power2.out",
              stagger: { each: 0.035, from: "random" },
            },
            0.72
          )
          .to(cueIntroRef.current, { opacity: 1, y: 0, duration: 1.2 }, 1.35);

        /* ---------------------------------------------------------------
           1b. The car uncovers the headline.
               Each line sits under a feathered mask whose edge follows the
               car: CHALLENGES opens left to right behind it, the ampersand
               pops as it drives over, CHAMPIONSHIPS opens right to left on
               the way back. If the car never turns up (no WebGL, a slow
               model), the same wipe runs on its own.
           ------------------------------------------------------------- */
        const word1 = word1Ref.current;
        const line2 = line2Ref.current;
        const shown = { one: 0, two: 0 };

        const mask = (el: HTMLElement | null, fromLeft: boolean, px: number) => {
          if (!el) return;
          const value = `linear-gradient(${fromLeft ? "to right" : "to left"}, #000 ${px - WIPE_FEATHER}px, transparent ${px}px)`;
          el.style.setProperty("mask-image", value);
          el.style.setProperty("-webkit-mask-image", value);
        };
        const unmask = (el: HTMLElement | null) => {
          el?.style.removeProperty("mask-image");
          el?.style.removeProperty("-webkit-mask-image");
        };

        mask(word1, true, 0);
        mask(line2, false, 0);

        /** Run a line's wipe the rest of the way, then drop the mask. */
        const finish = (which: "one" | "two", duration: number) => {
          const el = which === "one" ? word1 : line2;
          if (!el) return;
          gsap.to(shown, {
            [which]: el.getBoundingClientRect().width + WIPE_FEATHER,
            duration,
            ease: "power2.out",
            onUpdate: () => mask(el, which === "one", shown[which]),
            onComplete: () => unmask(el),
          });
        };

        const popAmpersand = () =>
          gsap.to(ampersandRef.current, {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1.1,
            ease: "back.out(2.2)",
          });

        let cancelled = false;
        let start: gsap.core.Tween | null = null;
        let timeout: gsap.core.Tween | null = null;

        let started = false;
        let uncovered = false;
        let headlineDone = false;

        const withoutCar = () => {
          if (uncovered) return;
          uncovered = true;
          headlineDone = true;
          timeout?.kill();
          if (introRef.current) introRef.current.status = "skip";
          finish("one", 1.2);
          gsap.delayedCall(0.55, popAmpersand);
          gsap.delayedCall(0.4, () => finish("two", 1.2));
        };

        introRef.current = {
          status: "pending",
          exit: 0,
          targets: () =>
            line1Ref.current && word1 && ampersandRef.current && line2
              ? { line1: line1Ref.current, word1, amp: ampersandRef.current, line2 }
              : null,
          onStart: () => timeout?.kill(),
          onProgress: (leg, clientX) => {
            if (leg === "line1" && word1) {
              const box = word1.getBoundingClientRect();
              shown.one = Math.max(shown.one, clientX - box.left + WIPE_LEAD);
              mask(word1, true, shown.one);
            } else if (leg === "line2" && line2) {
              const box = line2.getBoundingClientRect();
              shown.two = Math.max(shown.two, box.right - clientX + WIPE_LEAD);
              mask(line2, false, shown.two);
            }
          },
          onAmp: () => {
            finish("one", 0.45);
            popAmpersand();
          },
          onDone: () => {
            headlineDone = true;
            finish("two", 0.6);
          },
          // The car cannot run at all (no WebGL, the model failed to load)
          abort: () => {
            if (started) withoutCar();
            else if (introRef.current) introRef.current.status = "skip";
          },
        };

        // Start once the display face has settled the headline's size, so
        // the route is laid over the type where it will actually sit
        document.fonts.ready.then(() => {
          if (cancelled) return;
          start = gsap.delayedCall(0.35, () => {
            if (!introRef.current) return;
            started = true;
            // The car already gave up before the stage was ready
            if (introRef.current.status === "skip") {
              withoutCar();
              return;
            }
            introRef.current.status = "go";
            timeout = gsap.delayedCall(CAR_TIMEOUT, withoutCar);
          });
        });

        /* ---------------------------------------------------------------
           4. Leaving for OUR FLAGSHIPS, and coming back.
              The page is held still while the stage clears: CHALLENGES
              exits left, CHAMPIONSHIPS right, the ampersand shatters and
              the car turns and zooms off the bottom of the frame. Only
              then does the page glide down. Scrolling back up glides to
              the top first, then plays all of it in reverse.
           ------------------------------------------------------------- */
        const next = containerRef.current?.nextElementSibling;
        const ampWhole = stage.querySelector<HTMLElement>("[data-amp-whole]");
        const ampShards = gsap.utils.toArray<HTMLElement>("[data-amp-shard]", stage);
        const car = { exit: 0 };

        const exit = gsap.timeline({ paused: true });
        exit
          .to(cueRef.current, { opacity: 0, y: 24, duration: 0.3, ease: "power2.in" }, 0)
          .to(
            word1,
            {
              x: () => -((word1?.getBoundingClientRect().right ?? 0) + 80),
              duration: 0.85,
              ease: "power3.in",
            },
            0.05
          )
          .to(
            line2,
            {
              x: () =>
                window.innerWidth - (line2?.getBoundingClientRect().left ?? 0) + 80,
              duration: 0.85,
              ease: "power3.in",
            },
            0.05
          )
          // The whole glyph hands over to its shards on the first frame
          .set(ampWhole, { opacity: 0 }, 0)
          .set(ampShards, { opacity: 1 }, 0)
          .to(
            car,
            {
              exit: 1,
              duration: 1,
              ease: "power1.in",
              onUpdate: () => {
                if (introRef.current) introRef.current.exit = car.exit;
              },
            },
            0
          );

        ampShards.forEach((shard, i) => {
          const burst = AMP_SHARDS[i];
          exit.to(
            shard,
            {
              x: burst.x,
              y: burst.y,
              rotation: burst.rotation,
              scale: 0.45,
              opacity: 0,
              filter: "blur(3px)",
              duration: 0.9,
              ease: "power3.out",
            },
            0
          );
        });

        // If the car is still mid-intro, finish uncovering the headline now,
        // so what leaves the stage is the complete title
        const completeHeadline = () => {
          if (headlineDone) return;
          headlineDone = true;
          timeout?.kill();
          if (introRef.current) introRef.current.status = "skip";
          finish("one", 0.2);
          finish("two", 0.2);
          gsap.set(ampersandRef.current, { opacity: 1, scale: 1, rotate: 0 });
        };

        let phase: "home" | "leaving" | "away" | "returning" = "home";

        const leave = () => {
          const lenis = window.__lenis;
          if (phase !== "home" || !lenis || !(next instanceof HTMLElement)) return;
          phase = "leaving";
          lenis.stop();
          completeHeadline();
          exit.timeScale(1).play();
        };

        const comeBack = () => {
          const lenis = window.__lenis;
          if (phase !== "away" || !lenis) return;
          phase = "returning";
          lenis.scrollTo(0, {
            duration: GLIDE_DURATION,
            lock: true,
            force: true,
            onComplete: () => {
              lenis.stop();
              exit.timeScale(1.15).reverse();
            },
          });
        };

        exit.eventCallback("onComplete", () => {
          const lenis = window.__lenis;
          if (!lenis || !(next instanceof HTMLElement)) return;
          lenis.start();
          lenis.scrollTo(next, {
            duration: GLIDE_DURATION,
            lock: true,
            force: true,
            onComplete: () => {
              phase = "away";
            },
          });
        });

        exit.eventCallback("onReverseComplete", () => {
          window.__lenis?.start();
          phase = "home";
        });

        // The first wheel tick down, caught before Lenis moves the page
        const onWheel = (event: WheelEvent) => {
          if (phase === "home" && event.deltaY > 0 && window.scrollY < 4) leave();
        };
        window.addEventListener("wheel", onWheel, { capture: true, passive: true });

        // Everything else (keys, scrollbar) and the way back up
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            if (self.progress <= 0.001 || self.progress >= 0.999) return;
            if (self.direction > 0 && phase === "home") leave();
            else if (self.direction < 0 && phase === "away") comeBack();
          },
        });

        // Distances are measured when the exit first plays; re-measure if
        // the window changes size while the headline is home
        const onResize = () => {
          if (phase === "home") exit.invalidate();
        };
        window.addEventListener("resize", onResize);

        const teardown = () => {
          cancelled = true;
          start?.kill();
          timeout?.kill();
          introRef.current = null;
          unmask(word1);
          unmask(line2);
          window.removeEventListener("wheel", onWheel, { capture: true });
          window.removeEventListener("resize", onResize);
          window.__lenis?.start();
        };

        // The cue's idle bob lives on its own node, clear of both of the above
        gsap.to(cueIconRef.current, {
          y: 8,
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        /* ---------------------------------------------------------------
           2. Drift and tumble.
              Drift lives on [data-shard], tumble on [data-spin]. Separate
              nodes, so the two never fight over one transform string. Every
              fragment gets its own period, phase and axis weighting, which is
              what stops the field looking like a particle preset.
           ------------------------------------------------------------- */
        shards.forEach((shard) => {
          const drift = Number(shard.dataset.drift ?? 10);
          const travel = Number(shard.dataset.travel ?? 30);
          const delay = Number(shard.dataset.delay ?? 0);
          const proximity = Number(shard.dataset.proximity ?? 0.5);

          // Fragments nearer the lens sweep further and faster: real parallax
          // between the near and far field, not a uniform bob.
          const reach = travel * (0.55 + proximity * 1.1);

          gsap.to(shard, {
            y: reach,
            x: reach * (0.2 + proximity * 0.45),
            duration: drift,
            delay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        spinners.forEach((spinner) => {
          const duration = Number(spinner.dataset.spinDuration ?? 40);
          const phase = Number(spinner.dataset.spinPhase ?? 0);

          gsap.to(spinner, {
            rotationX: `+=${spinner.dataset.spinX ?? 0}`,
            rotationY: `+=${spinner.dataset.spinY ?? 0}`,
            rotationZ: `+=${spinner.dataset.spinZ ?? 0}`,
            duration,
            delay: -phase * duration,
            repeat: -1,
            ease: "none",
          });
        });

        if (!pointer) return teardown;

        /* ---------------------------------------------------------------
           3. Pointer parallax.
              Targets are dedicated [data-parallax] wrappers that nothing else
              animates, so quickTo owns those transforms outright.
           ------------------------------------------------------------- */
        const parallax = [
          { el: parallaxNode("atmosphere"), depth: PARALLAX_DEPTH.atmosphere },
          { el: parallaxNode("headline"), depth: PARALLAX_DEPTH.headline },
          { el: parallaxNode("far"), depth: 7 },
          { el: parallaxNode("mid"), depth: 26 },
          { el: parallaxNode("near"), depth: 64 },
        ].filter((layer): layer is { el: HTMLElement; depth: number } =>
          Boolean(layer.el)
        );

        const movers = parallax.map(({ el, depth }) => ({
          depth,
          x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3" }),
        }));

        const camera = {
          rotY: gsap.quickTo(cameraRef.current, "rotationY", {
            duration: 1.4,
            ease: "power3",
          }),
          rotX: gsap.quickTo(cameraRef.current, "rotationX", {
            duration: 1.4,
            ease: "power3",
          }),
        };

        const handlePointer = (event: PointerEvent) => {
          const nx = (event.clientX / window.innerWidth - 0.5) * 2;
          const ny = (event.clientY / window.innerHeight - 0.5) * 2;

          movers.forEach(({ depth, x, y }) => {
            x(-nx * depth);
            y(-ny * depth * 0.6);
          });

          camera.rotY(nx * 1.7);
          camera.rotX(-ny * 1.1);
        };

        window.addEventListener("pointermove", handlePointer, {
          passive: true,
        });

        return () => {
          window.removeEventListener("pointermove", handlePointer);
          teardown();
        };
      },
      stageRef
    );

    // The pinned measurements are only trustworthy once the display face and
    // the first paint have settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const refreshTimer = window.setTimeout(refresh, 900);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-[#05070b]"
      aria-label={`${BRAND.name}: introduction`}
    >
      <div
        ref={stageRef}
        className="hero-stage relative h-screen w-full overflow-hidden bg-[#05070b]"
      >
        {/* ---- 00 · lighting rig ------------------------------------- */}
        <div data-parallax="atmosphere" className="absolute inset-0 z-0">
          <HeroAtmosphere ref={atmosphereRef} />
        </div>

        <div
          ref={cameraRef}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ---- 01 · far field --------------------------------------- */}
          <div data-parallax="far" className="absolute inset-0 z-[10]">
            <HeroDebris plane="far" />
          </div>

          {/* ---- 02 · the headline ------------------------------------ */}
          <div
            data-parallax="headline"
            className="absolute inset-x-0 top-1/2 z-[20]"
          >
            <h1 className="sr-only">{BRAND.name}</h1>
            <div aria-hidden="true" className="-translate-y-[50%] px-[8vw]">
              <span className="hero-line-mask">
                <span
                  ref={line1Ref}
                  className="hero-display block whitespace-nowrap will-change-transform"
                >
                  <span
                    ref={word1Ref}
                    // Padded box: the gradient fill only paints inside it,
                    // and the caps stand taller than the 0.76 line height
                    className="hero-display-fill inline-block -my-[0.2em] py-[0.2em] will-change-transform"
                  >
                    CHALLENGES
                  </span>
                  <span ref={ampersandRef} className="hero-amp relative">
                    <span data-amp-whole>&amp;</span>
                    {/* Shards for the exit: exact copies of the glyph, each
                        clipped to one triangle. The box is oversized so the
                        italic overhang and the glow are inside the clip. */}
                    {AMP_SHARDS.map(({ clip }) => (
                      <span
                        key={clip}
                        data-amp-shard
                        className="pointer-events-none absolute -inset-[0.3em] p-[0.3em] opacity-0 will-change-transform"
                        style={{ clipPath: clip }}
                      >
                        &amp;
                      </span>
                    ))}
                  </span>
                </span>
              </span>

              <span className="hero-line-mask">
                <span
                  ref={line2Ref}
                  className="hero-display hero-display-fill block whitespace-nowrap will-change-transform"
                >
                  CHAMPIONSHIPS
                </span>
              </span>
            </div>
          </div>

          {/* ---- 03 · mid field, between type and camera -------------- */}
          <div data-parallax="mid" className="absolute inset-0 z-[30]">
            <HeroDebris plane="mid" />
          </div>

          {/* ---- 04 · near field, crossing the lens ------------------- */}
          <div data-parallax="near" className="absolute inset-0 z-[50]">
            <HeroDebris plane="near" />
          </div>
        </div>

        {/* ---- 04b · the car, driving over the stage ------------------- */}
        {/* Outside the CSS camera: pointer parallax would skew the canvas. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[40]"
        >
          <HeroVehicle intro={introRef} />
        </div>

        {/* ---- 05 · scroll cue ---------------------------------------- */}
        {/* Three nodes, three owners: scroll fade, entrance, idle bob. */}
        <div
          ref={cueRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[7vh] z-[60] flex justify-center"
        >
          <div ref={cueIntroRef}>
            <div
              ref={cueIconRef}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/[0.03] text-white/80 backdrop-blur-sm"
            >
              <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
