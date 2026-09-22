"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface FlagshipDef {
  id: string;
  num: string;
  total: string;
  category: string;
  titleLines: string[];
  tagline: string;
  href: string;
  year: string;
  imgMain: string;
  imgMainAlt: string;
  imgSecondary: string;
  imgSecondaryAlt: string;
  accent: string;
  clipStart: string;
  clipEnd: string;
  imageEntry: "left" | "right";
}

const EVENTS: FlagshipDef[] = [
  {
    id: "hacksummit",
    num: "01",
    total: "04",
    category: "INNOVATION / BUILD / COLLABORATE",
    titleLines: ["HACK", "SUMMIT"],
    tagline: "36 hours. Zero boundaries. A hackathon where engineers build the future in real time.",
    href: "/events/hacksummit",
    year: "2026",
    imgMain: "/images/flagships/hacksummit/01.jpg",
    imgMainAlt: "Hack Summit — coding arena",
    imgSecondary: "/images/flagships/hacksummit/02.jpg",
    imgSecondaryAlt: "Hack Summit — close focus",
    accent: "#3b82f6",
    clipStart: "polygon(40% 0%, 100% 0%, 100% 100%, 10% 100%)",
    clipEnd:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    imageEntry: "right",
  },
  {
    id: "nasa-space-apps",
    num: "02",
    total: "04",
    category: "SPACE / SCIENCE / EARTH DATA",
    titleLines: ["NASA", "SPACE APPS", "CHALLENGE"],
    tagline: "Open NASA data. Global minds. Solving planetary challenges from orbit to Earth.",
    href: "/events/nasa-space-apps",
    year: "2026",
    imgMain: "/images/flagships/nasa-space-apps/01.jpg",
    imgMainAlt: "NASA Space Apps — mission control",
    imgSecondary: "/images/flagships/nasa-space-apps/02.jpg",
    imgSecondaryAlt: "NASA Space Apps — star map",
    accent: "#06b6d4",
    clipStart: "polygon(0% 0%, 60% 0%, 90% 100%, 0% 100%)",
    clipEnd:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    imageEntry: "left",
  },
  {
    id: "turbodrift",
    num: "03",
    total: "04",
    category: "AUTOMOTIVE / SPEED / TELEMETRY",
    titleLines: ["TURBO", "DRIFT"],
    tagline: "Chassis. Cornering. Smoke. RC drift engineering pushed to its mechanical limit.",
    href: "/events/turbodrift",
    year: "2026",
    imgMain: "/images/flagships/turbodrift/01.jpg",
    imgMainAlt: "TurboDrif - drift car in action",
    imgSecondary: "/images/flagships/turbodrift/02.jpg",
    imgSecondaryAlt: "TurboDrift — spinning wheel close-up",
    accent: "#f97316",
    clipStart: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)",
    clipEnd:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    imageEntry: "right",
  },
  {
    id: "quadcopter",
    num: "04",
    total: "04",
    category: "AERODYNAMICS / AUTONOMY / PRECISION",
    titleLines: ["QUAD", "COPTER", "CHAMP"],
    tagline: "Autonomous flight. Precision gates. Engineering gravity-defying precision at speed.",
    href: "/events/quadcopter",
    year: "2026",
    imgMain: "/images/flagships/quadcopter/01.jpg",
    imgMainAlt: "Quadcopter Championship — drone arena",
    imgSecondary: "/images/flagships/quadcopter/02.jpg",
    imgSecondaryAlt: "Quadcopter — frame assembly",
    accent: "#a3e635",
    clipStart: "polygon(0% 0%, 70% 0%, 100% 100%, 0% 100%)",
    clipEnd:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    imageEntry: "left",
  },
];

// Event Nav
function EventNavigation({ events, activeIdx, visible }: { events: FlagshipDef[]; activeIdx: number; visible: boolean }) {
  return (
    <nav
      className="fixed right-8 top-1/2 -translate-y-1/2 z-[60] hidden xl:flex flex-col gap-4 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      aria-label="Event navigation"
    >
      {events.map((e, i) => (
        <div key={e.id} className="flex items-center gap-3">
          <span
            className="font-mono text-[9px] tracking-widest transition-all duration-300"
            style={{ color: i === activeIdx ? e.accent : "rgba(255,255,255,0.25)" }}
          >
            {e.num}
          </span>
          <div
            className="rounded-full transition-all duration-500"
            style={{
              width: i === activeIdx ? "20px" : "4px",
              height: "2px",
              background: i === activeIdx ? e.accent : "rgba(255,255,255,0.2)",
            }}
          />
        </div>
      ))}
    </nav>
  );
}

export function FlagshipSection() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const stageRef       = useRef<HTMLDivElement>(null);
  const introRef       = useRef<HTMLDivElement>(null);
  const introTitleRef  = useRef<HTMLDivElement>(null);
  const introSubRef    = useRef<HTMLDivElement>(null);
  const slideRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const imgMainRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const imgSecRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx]   = useState(-1);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Initial states
      EVENTS.forEach((ev, i) => {
        gsap.set(slideRefs.current[i],   { opacity: 0, pointerEvents: "none" });
        gsap.set(imgMainRefs.current[i], { clipPath: ev.clipStart, x: ev.imageEntry === "right" ? 80 : -80 });
        gsap.set(imgSecRefs.current[i],  { opacity: 0, y: 60 });
        gsap.set(titleRefs.current[i],   { opacity: 0, x: ev.imageEntry === "right" ? -60 : 60 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          pin: stageRef.current,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.22) {
              setActiveIdx(-1);
              setNavVisible(false);
            } else {
              setNavVisible(true);
              const eP = (p - 0.22) / 0.78;
              setActiveIdx(Math.min(Math.floor(eP * 4), 3));
            }
          },
        },
      });

      // INTRO hold + exit
      tl.to({}, { duration: 0.6 })
        .to(introTitleRef.current, { y: "-120%", opacity: 0, duration: 0.9, ease: "power3.in" }, "+=0.15")
        .to(introSubRef.current,   { opacity: 0, y: -20,  duration: 0.5, ease: "power2.in" }, "<+=0.1")
        .to(introRef.current,      { opacity: 0, duration: 0.3, pointerEvents: "none" }, "<+=0.5");

      function enterEvent(i: number, at: string) {
        const ev = EVENTS[i];
        const fromLeft = ev.imageEntry === "left";
        tl.to(slideRefs.current[i],   { opacity: 1, pointerEvents: "auto", duration: 0.01 }, at);
        tl.fromTo(imgMainRefs.current[i],
          { clipPath: ev.clipStart, x: fromLeft ? -80 : 80 },
          { clipPath: ev.clipEnd,   x: 0, duration: 1.1, ease: "power3.out" }, at);
        tl.to(imgSecRefs.current[i],  { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, `${at}+=0.4`);
        tl.to(titleRefs.current[i],   { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }, `${at}+=0.3`);
        const lines = titleRefs.current[i]?.querySelectorAll(".fs-tline span");
        if (lines?.length) {
          tl.fromTo(lines, { y: "110%", opacity: 0 }, { y: "0%", opacity: 1, stagger: 0.1, duration: 0.65, ease: "power3.out" }, `${at}+=0.4`);
        }
        const tagEl = titleRefs.current[i]?.querySelector(".fs-tag");
        if (tagEl) tl.fromTo(tagEl, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, `${at}+=0.7`);
        const ctaEl = titleRefs.current[i]?.querySelector(".fs-cta");
        if (ctaEl) tl.fromTo(ctaEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, `${at}+=0.85`);
      }

      function exitEvent(i: number, at: string) {
        const fromLeft = EVENTS[i].imageEntry === "left";
        tl.to(imgMainRefs.current[i],  { x: fromLeft ? -110 : 110, opacity: 0.2, duration: 0.8, ease: "power3.in" }, at);
        tl.to(imgSecRefs.current[i],   { opacity: 0, y: -35, duration: 0.55, ease: "power2.in" }, at);
        tl.to(titleRefs.current[i],    { opacity: 0, x: fromLeft ? 70 : -70, duration: 0.65, ease: "power3.in" }, at);
        tl.to(slideRefs.current[i],    { opacity: 0, pointerEvents: "none", duration: 0.2 }, `${at}+=0.8`);
      }

      enterEvent(0, "+=0.0");
      tl.to({}, { duration: 0.9 });
      exitEvent(0, "+=0.1"); enterEvent(1, "<+=0.2");
      tl.to({}, { duration: 0.9 });
      exitEvent(1, "+=0.1"); enterEvent(2, "<+=0.2");
      tl.to({}, { duration: 0.9 });
      exitEvent(2, "+=0.1"); enterEvent(3, "<+=0.2");
      tl.to({}, { duration: 0.9 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

  return (
    <>
      <EventNavigation events={EVENTS} activeIdx={activeIdx} visible={navVisible} />

      <section
        ref={containerRef}
        className="relative w-full bg-[#07090e] text-white"
        style={{ height: "620vh" }}
        aria-label="Flagship Events Cinematic Experience"
      >
        {/* PINNED STAGE */}
        <div
          ref={stageRef}
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: "100svh", background: "#07090e" }}
        >

          {/* ── INTRO LAYER ── */}
          <div
            ref={introRef}
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
            style={{ zIndex: 20 }}
          >
            {/* Vertical line above */}
            <div style={{ width: 1, height: 80, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.25))", marginBottom: 36 }} />

            <div ref={introTitleRef} className="text-center overflow-hidden">
              <div
                className="uppercase font-black leading-[0.88] text-white"
                style={{
                  fontFamily: "'Arial Black', 'Franklin Gothic Heavy', Impact, sans-serif",
                  fontSize: "clamp(5rem, 13vw, 15rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                FLAGSHIP
              </div>
              <div
                className="uppercase font-black leading-[0.88]"
                style={{
                  fontFamily: "'Arial Black', 'Franklin Gothic Heavy', Impact, sans-serif",
                  fontSize: "clamp(5rem, 13vw, 15rem)",
                  letterSpacing: "-0.04em",
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.22)",
                  color: "transparent",
                }}
              >
                EVENTS
              </div>
            </div>

            
          </div>

          {/* ── EVENT SLIDES ── */}
          {EVENTS.map((ev, idx) => {
            const fromLeft = ev.imageEntry === "left";
            return (
              <div
                key={ev.id}
                ref={(el) => { slideRefs.current[idx] = el; }}
                className="absolute inset-0 overflow-hidden"
                style={{ opacity: 0, pointerEvents: "none", willChange: "opacity" }}
              >
                {/* Event tint */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden
                  style={{
                    background: fromLeft
                      ? `radial-gradient(ellipse 60% 90% at 12% 50%, ${ev.accent}10 0%, transparent 70%)`
                      : `radial-gradient(ellipse 60% 90% at 88% 50%, ${ev.accent}10 0%, transparent 70%)`,
                  }}
                />

                {/* MAIN IMAGE */}
                <div
                  ref={(el) => { imgMainRefs.current[idx] = el; }}
                  className="absolute overflow-hidden"
                  style={{
                    top: "6%", height: "86%", width: "60%",
                    right: fromLeft ? "auto" : "-1%",
                    left: fromLeft ? "-1%" : "auto",
                    clipPath: ev.clipStart,
                    willChange: "clip-path, transform",
                  }}
                >
                  <Image
                    src={ev.imgMain}
                    alt={ev.imgMainAlt}
                    fill priority={idx === 0}
                    sizes="62vw"
                    className="object-cover"
                    style={{ filter: "contrast(1.08) saturate(0.82)", transform: "scale(1.06)", willChange: "transform" }}
                  />
                  {/* Inner shadow fades image toward text side */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: fromLeft
                      ? "linear-gradient(to right, transparent 55%, rgba(7,9,14,0.9) 100%)"
                      : "linear-gradient(to left, transparent 55%, rgba(7,9,14,0.9) 100%)",
                  }} />
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: "linear-gradient(to top, rgba(7,9,14,0.45) 0%, transparent 45%)",
                  }} />
                  {/* Film grain on image */}
                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{ opacity: 0.12, backgroundImage: GRAIN, backgroundSize: "180px 180px" }} />
                  {/* Caption */}
                  <div
                    className="absolute bottom-3 font-mono text-[9px] tracking-[0.28em] text-white/35 uppercase"
                    style={{ [fromLeft ? "right" : "left"]: 12 }}
                  >
                    {ev.num} / {ev.total} — C&C {ev.year}
                  </div>
                </div>

                {/* SECONDARY IMAGE */}
                <div
                  ref={(el) => { imgSecRefs.current[idx] = el; }}
                  className="absolute hidden lg:block overflow-hidden"
                  style={{
                    bottom: "7%", width: "21%", aspectRatio: "3/4",
                    right: fromLeft ? "-2%" : "auto",
                    left: fromLeft ? "auto" : "-2%",
                    willChange: "transform, opacity",
                    boxShadow: "0 20px 56px rgba(0,0,0,0.75)",
                  }}
                >
                  <Image
                    src={ev.imgSecondary}
                    alt={ev.imgSecondaryAlt}
                    fill sizes="22vw"
                    className="object-cover"
                    style={{ filter: "contrast(1.1) saturate(0.7)" }}
                  />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(7,9,14,0.55) 0%, transparent 60%)" }} />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ border: `1px solid ${ev.accent}28` }} />
                </div>

                {/* TYPOGRAPHY */}
                <div
                  ref={(el) => { titleRefs.current[idx] = el; }}
                  className="absolute"
                  style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: fromLeft ? "auto" : "4%",
                    right: fromLeft ? "4%" : "auto",
                    width: "42%",
                    willChange: "transform, opacity",
                    zIndex: 10,
                  }}
                >
                  {/* Number + category */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-xs tracking-[0.28em] font-semibold" style={{ color: ev.accent }}>
                      {ev.num}
                    </span>
                    <span className="block h-px w-8" style={{ background: `${ev.accent}55` }} />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/38 uppercase">
                      {ev.category.split("/")[0].trim()}
                    </span>
                  </div>

                  {/* Big title */}
                  <h2
                    className="uppercase font-black text-white leading-[0.88]"
                    style={{
                      fontFamily: "'Arial Black', 'Franklin Gothic Heavy', Impact, sans-serif",
                      fontSize: "clamp(3.5rem, 7vw, 9rem)",
                      letterSpacing: "-0.025em",
                      textShadow: "0 2px 40px rgba(0,0,0,0.85)",
                    }}
                  >
                    {ev.titleLines.map((line, li) => (
                      <span key={li} className="fs-tline block overflow-hidden">
                        <span className="block" style={{ paddingLeft: li % 2 === 1 ? "0.1em" : "0" }}>
                          {line}
                        </span>
                      </span>
                    ))}
                  </h2>

                  {/* Tagline */}
                  <p className="fs-tag font-light text-white/45 mt-5 leading-relaxed"
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      fontSize: "clamp(0.72rem, 0.95vw, 0.88rem)",
                      maxWidth: "33ch",
                      willChange: "transform, opacity",
                    }}
                  >
                    {ev.tagline}
                  </p>

                  {/* CTA */}
                  <div className="fs-cta mt-7" style={{ willChange: "transform, opacity" }}>
                    <Link
                      href={ev.href}
                      className="group inline-flex items-center gap-3 font-mono text-xs tracking-[0.28em] uppercase text-white/70 hover:text-white transition-colors duration-300"
                    >
                      <span className="relative">
                        EXPLORE EVENT
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                          style={{ background: ev.accent }} />
                      </span>
                      <span className="transition-transform duration-500 group-hover:translate-x-2"
                        style={{ color: ev.accent }}>
                        →
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Thin vertical divider */}
                <div
                  className="absolute top-[12%] hidden xl:block pointer-events-none"
                  style={{
                    height: "76%", width: 1,
                    left: fromLeft ? "60%" : "40%",
                    background: `linear-gradient(to bottom, transparent, ${ev.accent}20 30%, ${ev.accent}20 70%, transparent)`,
                  }}
                  aria-hidden
                />
              </div>
            );
          })}

          {/* Bottom progress indicator */}
          <div
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 transition-opacity duration-500"
            style={{ opacity: navVisible ? 1 : 0 }}
          >
            {EVENTS.map((e, i) => (
              <div
                key={e.id}
                style={{
                  height: 2,
                  width: i === activeIdx ? 28 : 5,
                  background: i === activeIdx ? e.accent : i < activeIdx ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)",
                  borderRadius: 99,
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="md:hidden px-5 pb-20" style={{ background: "#07090e" }}>
          <div className="py-16 text-center border-b border-white/[0.06]">
            <h2 className="uppercase font-black leading-none text-white"
              style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: "clamp(3.2rem, 18vw, 5.5rem)", letterSpacing: "-0.03em" }}>
              FLAGSHIP
            </h2>
            <h2 className="uppercase font-black leading-none"
              style={{
                fontFamily: "'Arial Black', Impact, sans-serif",
                fontSize: "clamp(3.2rem, 18vw, 5.5rem)",
                letterSpacing: "-0.03em",
                WebkitTextStroke: "1px rgba(255,255,255,0.28)",
                color: "transparent",
              }}>
              EVENTS
            </h2>
            <p className="font-mono text-[9px] tracking-[0.35em] text-white/28 uppercase mt-4">04 CHAPTERS / 2026</p>
          </div>
          {EVENTS.map((ev) => (
            <article key={`m-${ev.id}`} className="py-12 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs tracking-[0.25em] font-medium" style={{ color: ev.accent }}>{ev.num}</span>
                <span className="block h-px w-6" style={{ background: `${ev.accent}50` }} />
                <span className="font-mono text-[10px] tracking-wider text-white/38 uppercase">
                  {ev.category.split("/")[0].trim()}
                </span>
              </div>
              <h3 className="uppercase font-black text-white leading-[0.9] mb-5"
                style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontSize: "clamp(2.8rem, 14vw, 4.5rem)", letterSpacing: "-0.02em" }}>
                {ev.titleLines.map((l, i) => <span key={i} className="block">{l}</span>)}
              </h3>
              <div className="relative w-full overflow-hidden mb-5" style={{ aspectRatio: "16/10", clipPath: ev.clipEnd }}>
                <Image src={ev.imgMain} alt={ev.imgMainAlt} fill sizes="100vw" className="object-cover"
                  style={{ filter: "contrast(1.08) saturate(0.82)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,9,14,0.5) 0%, transparent 50%)" }} />
              </div>
              <p className="text-sm text-white/45 leading-relaxed font-light mb-6">{ev.tagline}</p>
              <Link href={ev.href}
                className="group inline-flex items-center gap-3 font-mono text-xs tracking-[0.28em] uppercase text-white/65 hover:text-white transition-colors duration-300">
                <span className="relative">EXPLORE EVENT
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-500" style={{ background: ev.accent }} />
                </span>
                <span style={{ color: ev.accent }} className="group-hover:translate-x-2 transition-transform duration-500">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
