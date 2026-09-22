"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLAGSHIP_SHOWCASE } from "./flagship-data";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const TITLE = "OUR FLAGSHIP";

/**
 * The doorway into the flagship sequence.
 *
 * The hero ends by collapsing its key light into a horizon line at the bottom
 * of the frame. This section opens from that same line: the seam draws apart,
 * the title rises out of it, and a guide line descends toward the four events
 * that follow. It is a transition rather than a heading, which is why it has a
 * beginning, a middle and an exit instead of just sitting there.
 *
 * Motion is GSAP with ScrollTrigger, matching the hero and the showcase. The
 * project also carries framer-motion for the past events gallery, but mixing
 * the two here would mean two scroll systems fighting over the same page.
 */
export function OurFlagship() {
  const sectionRef = useRef<HTMLElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
        const title = titleRef.current;
        if (!section || !title) return;

        const glyphs = gsap.utils.toArray<HTMLElement>("[data-of-glyph]", title);

        if (reduced) {
          // Show the finished composition and animate nothing.
          gsap.set(glyphs, { yPercent: 0, opacity: 1 });
          gsap.set(title, { filter: "blur(0px)" });
          gsap.set([seamRef.current, guideRef.current], {
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
          });
          gsap.set([bloomRef.current, countRef.current], { opacity: 1 });
          return;
        }

        /* ---------------------------------------------------------------
           Entrance. Fires once, as the section clears the fold.

           The blur lives on the title element rather than on each glyph:
           twelve simultaneous filter animations is twelve rasterisations a
           frame, and one on the parent looks the same.
           ------------------------------------------------------------- */
        gsap.set(seamRef.current, { scaleX: 0, opacity: 0 });
        gsap.set(bloomRef.current, { opacity: 0 });
        gsap.set(title, { filter: "blur(16px)" });
        gsap.set(glyphs, { yPercent: 115, opacity: 0 });
        gsap.set(guideRef.current, { scaleY: 0 });
        gsap.set(countRef.current, { opacity: 0, y: 8 });

        const reveal = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });

        reveal
          // the seam opens from the centre
          .to(
            seamRef.current,
            { scaleX: 1, opacity: 1, duration: 1.1, ease: "power3.inOut" },
            0
          )
          .to(bloomRef.current, { opacity: 1, duration: 1.4 }, 0.1)
          // the title rises out of it, letter by letter
          .to(
            glyphs,
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.05,
              stagger: 0.042,
              ease: "expo.out",
            },
            0.32
          )
          // and resolves from soft to sharp as it settles
          .to(title, { filter: "blur(0px)", duration: 1.2 }, 0.38)
          // then the eye is handed downward to the sequence
          .to(
            guideRef.current,
            { scaleY: 1, duration: 0.9, ease: "power2.inOut" },
            0.95
          )
          .to(countRef.current, { opacity: 1, y: 0, duration: 0.7 }, 1.25);

        const entrance = ScrollTrigger.create({
          trigger: section,
          start: "top 72%",
          once: true,
          onEnter: () => reveal.play(),
        });

        /* ---------------------------------------------------------------
           Exit. The block lifts and defocuses as the showcase pins behind
           it, so the two sections read as one continuous move rather than
           a heading followed by a carousel.
           ------------------------------------------------------------- */
        const exit = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "bottom 90%",
            end: "bottom top",
            scrub: 1,
          },
          defaults: { ease: "none" },
        });

        exit
          .to(contentRef.current, { yPercent: -26, opacity: 0, duration: 1 }, 0)
          .to(seamRef.current, { scaleX: 1.4, opacity: 0, duration: 1 }, 0)
          .to(bloomRef.current, { opacity: 0, duration: 0.8 }, 0);

        return () => {
          entrance.kill();
          reveal.kill();
          exit.kill();
        };
      },
      sectionRef
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#05070b]"
      aria-label="Our flagship events"
    >
      <div className="relative flex min-h-[78vh] flex-col items-center justify-center px-6 py-24 md:min-h-[88vh]">
        {/* The seam the hero's key light collapsed into, reopening. */}
        <div
          aria-hidden="true"
          ref={seamRef}
          className="stage-horizon absolute top-0 h-[1px] w-[86%] max-w-5xl origin-center"
        />
        <div
          aria-hidden="true"
          ref={bloomRef}
          className="pointer-events-none absolute left-1/2 top-0 h-[42vh] w-[92%] max-w-5xl -translate-x-1/2"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 0%, rgba(120,162,226,0.16) 0%, rgba(40,70,120,0.05) 42%, transparent 76%)",
          }}
        />

        <div ref={contentRef} className="relative flex flex-col items-center">
          <h2
            ref={titleRef}
            className="of-title will-change-[filter,transform]"
          >
            <span className="sr-only">{TITLE}</span>
            <span aria-hidden="true" className="flex flex-wrap justify-center">
              {TITLE.split(" ").map((word, wordIndex) => (
                <span key={word} className="inline-flex whitespace-nowrap">
                  {word.split("").map((character, index) => (
                    <span
                      // Characters repeat within a word, so the index is the
                      // only stable identity available here.
                      key={`${word}-${index}`}
                      className="inline-block overflow-hidden pb-[0.08em]"
                    >
                      <span
                        data-of-glyph
                        className="inline-block will-change-transform"
                      >
                        {character}
                      </span>
                    </span>
                  ))}
                  {wordIndex === 0 && (
                    <span className="inline-block w-[0.22em]" />
                  )}
                </span>
              ))}
            </span>
          </h2>

          {/* Guide line handing the eye down to the sequence. */}
          <div
            aria-hidden="true"
            ref={guideRef}
            className="mt-10 h-[11vh] w-[1px] origin-top md:mt-14"
            style={{
              background:
                "linear-gradient(to bottom, rgba(226,240,255,0.55) 0%, rgba(120,162,226,0.22) 55%, transparent 100%)",
            }}
          />
          <span
            ref={countRef}
            className="mt-4 font-mono text-[10px] tabular-nums tracking-[0.34em] text-neutral-500"
          >
            {String(FLAGSHIP_SHOWCASE.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
