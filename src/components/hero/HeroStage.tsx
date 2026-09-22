"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { HeroDebris } from "./HeroDebris";
import { PARALLAX_DEPTH } from "./hero-config";
import { useFitHeadline } from "./useFitHeadline";

/** GSAP wants layout effects; SSR wants none. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
 *   1. entrance      the rig powers up and the headline rises out of its mask
 *   2. drift + tumble  continuous, per fragment, no two alike
 *   3. pointer parallax  depth-weighted, interpolated
 *   4. scroll dolly   the camera pushes through the debris field and hands the
 *                     frame to the flagship section without a visible seam
 */
export function HeroStage() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const ampersandRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);

  // Measured, not guessed: both lines span the full measure on every viewport.
  useFitHeadline([line1Ref, line2Ref]);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        pinned: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { motion, pinned, reduced } = context.conditions as {
          motion: boolean;
          pinned: boolean;
          reduced: boolean;
        };

        const stage = stageRef.current;
        if (!stage) return;

        const shards = gsap.utils.toArray<HTMLElement>("[data-shard]", stage);
        const spinners = gsap.utils.toArray<HTMLElement>("[data-spin]", stage);
        const planes = {
          far: stage.querySelector<HTMLElement>('[data-debris-plane="far"]'),
          mid: stage.querySelector<HTMLElement>('[data-debris-plane="mid"]'),
          near: stage.querySelector<HTMLElement>('[data-debris-plane="near"]'),
        };
        const parallaxNode = (name: string) =>
          stage.querySelector<HTMLElement>(`[data-parallax="${name}"]`);

        if (reduced) {
          gsap.set([atmosphereRef.current, ctaRef.current, ...shards], {
            opacity: 1,
          });
          gsap.set([line1Ref.current, line2Ref.current], { yPercent: 0 });
          gsap.set(ampersandRef.current, { opacity: 1, scale: 1, rotate: 0 });
          return;
        }

        if (!motion) return;

        /* ---------------------------------------------------------------
           1. Entrance
           ------------------------------------------------------------- */
        gsap.set(atmosphereRef.current, { opacity: 0, scale: 1.18 });
        gsap.set([line1Ref.current, line2Ref.current], { yPercent: 118 });
        gsap.set(ampersandRef.current, { opacity: 0, scale: 0.45, rotate: -18 });
        gsap.set(ctaRef.current, { opacity: 0, y: 26 });
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
            [line1Ref.current, line2Ref.current],
            { yPercent: 0, duration: 1.5, stagger: 0.12, ease: "expo.out" },
            0.32
          )
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
          .to(
            ampersandRef.current,
            {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 1.1,
              ease: "back.out(2.2)",
            },
            1.15
          )
          .to(ctaRef.current, { opacity: 1, y: 0, duration: 1.2 }, 1.35);

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

        if (pinned) {
          window.addEventListener("pointermove", handlePointer, {
            passive: true,
          });
        }

        /* ---------------------------------------------------------------
           4. Scroll dolly.
              The camera does not cut away, it travels: the near field rushes
              past the lens, the type parts and falls out of focus behind it,
              and the key light collapses to a single horizon line at the
              bottom of the frame. The flagship section opens from exactly
              that line, so the two read as one continuous move.
           ------------------------------------------------------------- */
        if (pinned) {
          const dolly = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              pin: stage,
              anticipatePin: 1,
            },
            defaults: { ease: "none" },
          });

          dolly
            .to(ctaRef.current, { opacity: 0, y: 60, duration: 0.18 }, 0)
            // Type parts around the centre, then recedes out of focus
            .to(line1Ref.current, { xPercent: -34, duration: 0.86 }, 0)
            .to(line2Ref.current, { xPercent: 34, duration: 0.86 }, 0)
            .to(
              parallaxNode("headline"),
              { scale: 1.22, filter: "blur(14px)", duration: 0.86 },
              0
            )
            .to(
              [line1Ref.current, line2Ref.current],
              { opacity: 0, duration: 0.34 },
              0.62
            )
            // Debris field rushes the lens, nearest plane fastest
            .to(planes.near ?? {}, { scale: 3.1, opacity: 0, duration: 0.72 }, 0)
            .to(planes.mid ?? {}, { scale: 1.9, opacity: 0, duration: 0.86 }, 0.06)
            .to(planes.far ?? {}, { scale: 1.3, opacity: 0, duration: 0.9 }, 0.1)
            // Key light collapses down into the horizon the next section opens from
            .to(atmosphereRef.current, { scale: 1.45, duration: 1 }, 0)
            .to(atmosphereRef.current, { opacity: 0, duration: 0.38 }, 0.68)
            .fromTo(
              horizonRef.current,
              { opacity: 0, scaleX: 0.25 },
              { opacity: 1, scaleX: 1, duration: 0.38 },
              0.66
            );
        }

        return () => {
          window.removeEventListener("pointermove", handlePointer);
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
      className="relative w-full bg-[#05070b] h-[150vh] md:h-[185vh]"
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
            <div aria-hidden="true" className="-translate-y-[50%] px-[3vw]">
              <span className="hero-line-mask">
                <span
                  ref={line1Ref}
                  className="hero-display block whitespace-nowrap will-change-transform"
                >
                  <span className="hero-display-fill">CHALLENGES</span>
                  <span ref={ampersandRef} className="hero-amp">
                    &amp;
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

        {/* ---- 05 · the single call to action ------------------------- */}
        <div
          ref={ctaRef}
          className="absolute inset-x-0 bottom-[9vh] z-[60] flex justify-center px-6"
        >
          <Link href={BRAND.routes.events} className="hero-cta group">
            <span>EXPLORE</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* ---- 06 · the horizon the next section opens from ----------- */}
        <div
          ref={horizonRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[55] opacity-0"
        >
          <div className="stage-horizon mx-auto h-[1px] w-[70%]" />
          <div
            className="mx-auto h-[24vh] w-full"
            style={{
              background:
                "linear-gradient(to top, rgba(96,140,210,0.16) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
