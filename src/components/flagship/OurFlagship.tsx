"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";
import { OUR_FLAGSHIP_GALLERY } from "./our-flagship-gallery";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const TITLE = "OUR FLAGSHIP";

/** Total scroll height pinned to this section (in vh units). */
const GALLERY_SCROLL_VH = 250;

export function OurFlagship() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Shared mutable ref — the gallery scene reads this every frame
  const scrollVelocityRef = useRef(0);
  const lastScrollProgress = useRef(0);

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

        const section = sectionRef.current;
        const stage = stageRef.current;
        const title = titleRef.current;

        if (!section || !stage || !title) return;

        const glyphs = gsap.utils.toArray<HTMLElement>("[data-of-glyph]", title);

        /* ================================================================
           REDUCED MOTION
        ================================================================= */

        if (reduced) {
          gsap.set(glyphs, { yPercent: 0, opacity: 1 });
          gsap.set(title, { filter: "blur(0px)" });
          gsap.set(seamRef.current, { scaleX: 1, opacity: 1 });
          gsap.set(bloomRef.current, { opacity: 1 });
          gsap.set(galleryRef.current, { opacity: 1 });
          return;
        }

        /* ================================================================
           INITIAL STATE
        ================================================================= */

        gsap.set(seamRef.current, { scaleX: 0, opacity: 0 });
        gsap.set(bloomRef.current, { opacity: 0 });
        gsap.set(galleryRef.current, { opacity: 0 });
        gsap.set(title, { filter: "blur(16px)" });
        gsap.set(glyphs, { yPercent: 120, opacity: 0 });

        /* ================================================================
           ENTRANCE ANIMATION (plays once on enter)
        ================================================================= */

        const reveal = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });

        reveal
          .to(galleryRef.current, { opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
          .to(seamRef.current, { scaleX: 1, opacity: 1, duration: 1.0, ease: "power3.inOut" }, 0)
          .to(bloomRef.current, { opacity: 1, duration: 1.2, ease: "power2.out" }, 0.1)
          .to(glyphs, { yPercent: 0, opacity: 1, duration: 1.0, stagger: 0.045, ease: "expo.out" }, 0.28)
          .to(title, { filter: "blur(0px)", duration: 1.0, ease: "power2.out" }, 0.36);

        /* ================================================================
           PINNED SCROLL — gallery driven by scroll progress delta
        ================================================================= */

        const pinTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `bottom bottom`,
          pin: stage,
          pinSpacing: false,
          anticipatePin: 1,
          onEnter: () => reveal.play(),
          onEnterBack: () => reveal.play(),
          onUpdate: (self) => {
            // delta progress → velocity impulse for the 3D gallery
            const delta = self.progress - lastScrollProgress.current;
            lastScrollProgress.current = self.progress;
            // Scale delta → velocity: smaller number = slower gallery spin
            scrollVelocityRef.current += delta * 60;
          },
        });

        /* ================================================================
           EXIT — title fades as the pin is about to release
        ================================================================= */

        const exit = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "bottom 30%",
            end: "bottom top",
            scrub: 1,
          },
          defaults: { ease: "none" },
        });

        exit
          .to(contentRef.current, { yPercent: -22, opacity: 0, duration: 1 }, 0)
          .to(seamRef.current, { scaleX: 1.4, opacity: 0, duration: 1 }, 0)
          .to(bloomRef.current, { opacity: 0, duration: 0.8 }, 0)
          .to(galleryRef.current, { opacity: 0, duration: 0.9 }, 0);

        return () => {
          pinTrigger.kill();
          reveal.kill();
          exit.kill();
        };
      },
      sectionRef
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 900);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#05070b]"
      style={{ height: `${GALLERY_SCROLL_VH}vh` }}
      aria-label="Our flagship events"
    >
      {/* ── PINNED STAGE ─────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className="relative h-[100dvh] w-full overflow-hidden bg-[#05070b]"
      >
        {/* DEPTH GALLERY BACKDROP */}
        <div
          ref={galleryRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <InfiniteGallery
            images={OUR_FLAGSHIP_GALLERY}
            speed={3.5}
            visibleCount={12}
            externalVelocityRef={scrollVelocityRef}
            className="h-full w-full"
            fadeSettings={{
              fadeIn: { start: 0.04, end: 0.22 },
              fadeOut: { start: 0.42, end: 0.52 },
            }}
            blurSettings={{
              blurIn: { start: 0.0, end: 0.16 },
              blurOut: { start: 0.34, end: 0.52 },
              maxBlur: 9,
            }}
          />
        </div>

        {/* SCRIMS */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-[#05070b]/10" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(58% 42% at 50% 50%, rgba(5,7,11,0.78) 0%, rgba(5,7,11,0.52) 45%, rgba(5,7,11,0) 78%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, #05070b 0%, rgba(5,7,11,0) 26%, rgba(5,7,11,0) 74%, #05070b 100%)",
          }}
        />

        <div aria-hidden="true" className="stage-vignette pointer-events-none absolute inset-0 z-[1]" />

        {/* CONTENT */}
        <div className="relative z-[2] flex h-full w-full flex-col items-center justify-center px-6">
          {/* HORIZON */}
          <div
            ref={seamRef}
            aria-hidden="true"
            className="stage-horizon absolute top-0 h-[1px] w-[86%] max-w-[1400px] origin-center"
          />

          {/* BLOOM */}
          <div
            ref={bloomRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[55vh] w-full max-w-[1600px] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(60% 100% at 50% 0%, rgba(120,162,226,0.4) 0%, rgba(40,70,120,0.15) 42%, transparent 76%)",
            }}
          />

          {/* TITLE + HINT */}
          <div
            ref={contentRef}
            className="relative flex w-full flex-col items-center justify-center"
          >
            <h2
              ref={titleRef}
              className="of-title w-full text-center font-black leading-[0.85] tracking-[-0.04em] will-change-[filter,transform] flex flex-col items-center uppercase"
              style={{
                fontFamily: "'Arial Black', 'Franklin Gothic Heavy', Impact, sans-serif",
                fontSize: "clamp(5rem, 15vw, 16rem)",
              }}
            >
              <span className="sr-only">{TITLE}</span>

              <span aria-hidden="true" className="flex flex-wrap justify-center gap-x-[0.22em]">
                {TITLE.split(" ").map((word) => (
                  <span key={word} className="inline-flex whitespace-nowrap">
                    {word.split("").map((character, index) => (
                      <span
                        key={`${word}-${index}`}
                        className="inline-block overflow-hidden pb-[0.08em]"
                      >
                        <span
                          data-of-glyph
                          className="inline-block will-change-transform"
                          style={
                            word === "FLAGSHIP"
                              ? {
                                  WebkitTextStroke: "2px rgba(255,255,255,0.4)",
                                  color: "transparent",
                                }
                              : { color: "white" }
                          }
                        >
                          {character}
                        </span>
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </h2>

            {/* Scroll hint */}
            <p
              aria-hidden="true"
              className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-white/30"
            >
              Scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}