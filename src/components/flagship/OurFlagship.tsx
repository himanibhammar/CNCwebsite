"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLAGSHIP_SHOWCASE } from "./flagship-data";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const TITLE = "OUR FLAGSHIP";

export function OurFlagship() {
  const sectionRef = useRef<HTMLElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
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

        const glyphs = gsap.utils.toArray<HTMLElement>(
          "[data-of-glyph]",
          title
        );

        /* ================================================================
           REDUCED MOTION
        ================================================================= */

        if (reduced) {
          gsap.set(glyphs, {
            yPercent: 0,
            opacity: 1,
          });

          gsap.set(title, {
            filter: "blur(0px)",
          });

          gsap.set(seamRef.current, {
            scaleX: 1,
            opacity: 1,
          });

          gsap.set(bloomRef.current, {
            opacity: 1,
          });

          return;
        }

        /* ================================================================
           INITIAL STATE
        ================================================================= */

        gsap.set(seamRef.current, {
          scaleX: 0,
          opacity: 0,
        });

        gsap.set(bloomRef.current, {
          opacity: 0,
        });

        gsap.set(title, {
          filter: "blur(16px)",
        });

        gsap.set(glyphs, {
          yPercent: 120,
          opacity: 0,
        });

        /* ================================================================
           ENTRANCE ANIMATION
        ================================================================= */

        const reveal = gsap.timeline({
          paused: true,
          defaults: {
            ease: "power3.out",
          },
        });

        reveal

          // Horizon line opens from the centre
          .to(
            seamRef.current,
            {
              scaleX: 1,
              opacity: 1,
              duration: 1.15,
              ease: "power3.inOut",
            },
            0
          )

          // Atmospheric bloom
          .to(
            bloomRef.current,
            {
              opacity: 1,
              duration: 1.5,
              ease: "power2.out",
            },
            0.1
          )

          // Letters rise individually
          .to(
            glyphs,
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.055,
              ease: "expo.out",
            },
            0.32
          )

          // Blur resolves into sharp typography
          .to(
            title,
            {
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power2.out",
            },
            0.4
          );

        /* ================================================================
           SCROLL TRIGGER — ENTRANCE
        ================================================================= */

        const entrance = ScrollTrigger.create({
          trigger: section,
          start: "top 72%",
          once: true,

          onEnter: () => {
            reveal.play();
          },
        });

        /* ================================================================
           EXIT ANIMATION
        ================================================================= */

        const exit = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "bottom 90%",
            end: "bottom top",
            scrub: 1,
          },

          defaults: {
            ease: "none",
          },
        });

        exit

          // Move the entire title upward
          .to(
            contentRef.current,
            {
              yPercent: -26,
              opacity: 0,
              duration: 1,
            },
            0
          )

          // Horizon expands
          .to(
            seamRef.current,
            {
              scaleX: 1.4,
              opacity: 0,
              duration: 1,
            },
            0
          )

          // Bloom fades away
          .to(
            bloomRef.current,
            {
              opacity: 0,
              duration: 0.8,
            },
            0
          );

        /* ================================================================
           CLEANUP
        ================================================================= */

        return () => {
          entrance.kill();
          reveal.kill();
          exit.kill();
        };
      },
      sectionRef
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#05070b]
      "
      aria-label="Our flagship events"
    >
      {/* ================================================================
          FULL SCREEN CONTAINER
      ================================================================= */}

      <div
        className="
          relative
          flex
          min-h-screen
          w-full
          flex-col
          items-center
          justify-center
          px-6
        "
      >
        {/* ================================================================
            HORIZON / SEAM
        ================================================================= */}

        <div
          ref={seamRef}
          aria-hidden="true"
          className="
            stage-horizon
            absolute
            top-0
            h-[1px]
            w-[86%]
            max-w-[1400px]
            origin-center
          "
        />

        {/* ================================================================
            CINEMATIC BLOOM
        ================================================================= */}

        <div
          ref={bloomRef}
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-[55vh]
            w-full
            max-w-[1600px]
            -translate-x-1/2
          "
          style={{
            background:
              "radial-gradient(60% 100% at 50% 0%, rgba(120,162,226,0.16) 0%, rgba(40,70,120,0.05) 42%, transparent 76%)",
          }}
        />

        {/* ================================================================
            CONTENT
        ================================================================= */}

        <div
          ref={contentRef}
          className="
            relative
            flex
            w-full
            flex-col
            items-center
            justify-center
          "
        >
          {/* ================================================================
              TITLE
          ================================================================= */}

          <h2
            ref={titleRef}
            className="
              of-title
              w-full
              text-center
              text-[clamp(5rem,15vw,16rem)]
              font-black
              leading-[0.85]
              tracking-[-0.04em]
              will-change-[filter,transform]
              flex
              flex-col
              items-center
              uppercase
            "
            style={{
              fontFamily: "'Arial Black', 'Franklin Gothic Heavy', Impact, sans-serif",
            }}
          >
            {/* Accessible text */}

            <span className="sr-only">{TITLE}</span>

            {/* Animated visual text */}

            <span
              aria-hidden="true"
              className="
                flex
                flex-wrap
                justify-center
                gap-x-[0.22em]
              "
            >
              {TITLE.split(" ").map((word) => (
                <span
                  key={word}
                  className="
                    inline-flex
                    whitespace-nowrap
                  "
                >
                  {word.split("").map((character, index) => (
                    <span
                      key={`${word}-${index}`}
                      className="
                        inline-block
                        overflow-hidden
                        pb-[0.08em]
                      "
                    >
                      <span
                        data-of-glyph
                        className="
                          inline-block
                          will-change-transform
                        "
                        style={word === "FLAGSHIP" ? {
                          WebkitTextStroke: "2px rgba(255,255,255,0.4)",
                          color: "transparent",
                        } : {
                          color: "white"
                        }}
                      >
                        {character}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}