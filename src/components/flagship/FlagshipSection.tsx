"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clsx } from "clsx";
import { HeroDebris } from "@/components/hero/HeroDebris";
import { FLAGSHIP_SHOWCASE } from "./flagship-data";
import { FlagshipPanel } from "./FlagshipPanel";
import { buildPanelTimeline, settlePanel } from "./flagship-timeline";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Scroll distance allotted to each flagship, in viewport heights. */
const PANEL_SCROLL_VH = 115;

/**
 * FLAGSHIP SHOWCASE
 *
 * Four events, one animation language, no navigation.
 *
 * The section is pinned and the four panels are stacked in place. Scrolling
 * advances the sequence; it does not scroll the panels past the camera. That
 * keeps the composition on the same axis as the hero, so the whole page reads
 * as one continuous move through a single space rather than a stack of
 * unrelated sections.
 *
 * The handoff from the hero is explicit: the hero's exit collapses its key
 * light into a horizon line at the bottom of the frame, and this section opens
 * from that same line, carrying a thinned out version of the hero's far debris
 * field with it so the space is recognisably the same space.
 */
export function FlagshipSection() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const carryoverRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { reduced } = context.conditions as {
          motion: boolean;
          reduced: boolean;
        };

        const stage = stageRef.current;
        const container = containerRef.current;
        const camera = cameraRef.current;
        if (!stage || !container || !camera) return;

        const panels = gsap.utils.toArray<HTMLElement>("[data-fs-panel]", stage);
        if (!panels.length) return;

        if (reduced) {
          panels.forEach(settlePanel);
          gsap.set([carryoverRef.current, horizonRef.current], { opacity: 0 });
          return;
        }

        /* ---------------------------------------------------------------
           The shared system: one timeline per panel, all built by the same
           function, differing only in which corner the lattice enters from.
           ------------------------------------------------------------- */
        const timelines = panels.map((panel, i) =>
          buildPanelTimeline(panel, { entry: FLAGSHIP_SHOWCASE[i].entry })
        );

        // Everything starts off screen; the first panel plays on entry.
        timelines.forEach((tl) => tl.progress(0).pause());

        const show = (next: number) => {
          const previous = activeIndexRef.current;
          if (next === previous) return;

          // The outgoing panel retreats faster than the incoming one arrives,
          // so the two never sit on screen at equal weight.
          timelines[previous].timeScale(1.75).reverse();
          timelines[next].timeScale(1).play();

          activeIndexRef.current = next;
          setActiveIndex(next);
        };

        /* ---------------------------------------------------------------
           Handoff from the hero. Runs while the section is still below the
           fold, so the space is already forming as the hero blows out.
           ------------------------------------------------------------- */
        gsap.set(camera, { scale: 1.06 });

        gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
          defaults: { ease: "none" },
        })
          .fromTo(
            horizonRef.current,
            { opacity: 1, scaleX: 1 },
            { opacity: 0, scaleX: 1.6, duration: 1 },
            0
          )
          .to(camera, { scale: 1, duration: 1 }, 0)
          .fromTo(
            carryoverRef.current,
            { opacity: 0.85 },
            { opacity: 0, duration: 0.85 },
            0.15
          );

        /* ---------------------------------------------------------------
           The sequence itself.
           ------------------------------------------------------------- */
        const sequence = ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          pin: stage,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.min(
              Math.floor(self.progress * panels.length),
              panels.length - 1
            );
            show(next);
          },
          onEnter: () => timelines[activeIndexRef.current].play(),
          onEnterBack: () => timelines[activeIndexRef.current].play(),
        });

        // The first panel composes itself as the section rises into view,
        // not when it mounts. Playing it at setup would spend the entrance
        // animation while the section is still a screen and a half below the
        // fold, and the user would arrive to a composition already at rest.
        const firstEntrance = ScrollTrigger.create({
          trigger: container,
          start: "top 85%",
          once: true,
          onEnter: () => timelines[0].play(),
        });

        return () => {
          firstEntrance.kill();
          sequence.kill();
          timelines.forEach((tl) => tl.kill());
        };
      },
      stageRef
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const refreshTimer = window.setTimeout(refresh, 900);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
      mm.revert();
    };
  }, []);

  const total = FLAGSHIP_SHOWCASE.length;

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#05070b]"
      style={{ height: `${total * PANEL_SCROLL_VH}vh` }}
      aria-label="Flagship events"
    >
      <div
        ref={stageRef}
        className="relative h-screen w-full overflow-hidden bg-[#05070b]"
      >
        {/* Everything the handoff pushes lives inside this node, because
            ScrollTrigger owns the transform on the pinned stage itself. */}
        <div ref={cameraRef} className="absolute inset-0">
        {/* ---- continuity with the hero ------------------------------- */}
        <div
          ref={horizonRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[5]"
        >
          <div className="stage-horizon mx-auto h-[1px] w-[70%]" />
          <div
            className="h-[26vh] w-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(96,140,210,0.18) 0%, transparent 100%)",
            }}
          />
        </div>

        <div
          ref={carryoverRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[6]"
        >
          <HeroDebris plane="far" />
        </div>

        {/* ---- ambient grade ------------------------------------------ */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(90% 70% at 22% 42%, rgba(22,32,50,0.85) 0%, rgba(8,11,18,0.94) 48%, #05070b 82%)",
          }}
        />

        {/* ---- the four panels ---------------------------------------- */}
        {FLAGSHIP_SHOWCASE.map((event, i) => (
          <div
            key={event.id}
            className={clsx(
              "absolute inset-0 transition-opacity duration-300",
              i === activeIndex
                ? "z-[10] opacity-100"
                : "pointer-events-none z-[9] opacity-0"
            )}
            aria-hidden={i !== activeIndex}
            /* Keeps the offscreen panels' controls out of the tab order. */
            inert={i !== activeIndex}
          >
            <FlagshipPanel event={event} position={i} total={total} />
          </div>
        ))}

        {/* ---- sequence rail ------------------------------------------
            Deliberately not a control: it reports position, the scroll does
            the moving. Four ticks, the active one extended. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[7vh] left-[7vw] z-[30] flex gap-2 md:bottom-auto md:left-auto md:right-[7vw] md:top-1/2 md:-translate-y-1/2 md:flex-col md:gap-3"
        >
          {FLAGSHIP_SHOWCASE.map((event, i) => (
            <span
              key={event.id}
              className={clsx(
                "block transition-all duration-500 ease-out",
                "h-[2px] md:h-[1px]",
                i === activeIndex
                  ? "w-9 bg-white/80 md:w-8"
                  : "w-4 bg-white/20 md:w-4"
              )}
            />
          ))}
        </div>

        {/* ---- lens finish, matched to the hero ----------------------- */}
        <div
          aria-hidden="true"
          className="stage-vignette pointer-events-none absolute inset-0 z-[40]"
        />
        </div>
      </div>
    </section>
  );
}
