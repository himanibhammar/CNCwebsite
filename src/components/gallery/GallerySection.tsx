"use client";

import React from "react";
import { HaloReel, type HaloReelItem } from "@/components/ui/halo-reel";

// ── All 32 unique images, 19.jpg is first as requested ─────────────────────
// Images are sourced from: public/images/drive-download-20260922T205022Z-1-001/
const BASE = "/images/drive-download-20260922T205022Z-1-001";

const GALLERY_ITEMS: HaloReelItem[] = [
  // 19.jpg is the hero/first card
  { src: `${BASE}/19.jpg`, alt: "C&C Gallery highlight photo" },
  // remaining 31 unique images in order
  { src: `${BASE}/1.jpg`,  alt: "C&C Gallery photo 1"  },
  { src: `${BASE}/2.jpg`,  alt: "C&C Gallery photo 2"  },
  { src: `${BASE}/3.jpg`,  alt: "C&C Gallery photo 3"  },
  { src: `${BASE}/4.jpg`,  alt: "C&C Gallery photo 4"  },
  { src: `${BASE}/5.jpg`,  alt: "C&C Gallery photo 5"  },
  { src: `${BASE}/6.jpg`,  alt: "C&C Gallery photo 6"  },
  { src: `${BASE}/7.jpg`,  alt: "C&C Gallery photo 7"  },
  { src: `${BASE}/8.jpg`,  alt: "C&C Gallery photo 8"  },
  { src: `${BASE}/9.jpg`,  alt: "C&C Gallery photo 9"  },
  { src: `${BASE}/10.jpg`, alt: "C&C Gallery photo 10" },
  { src: `${BASE}/11.jpg`, alt: "C&C Gallery photo 11" },
  { src: `${BASE}/12.jpg`, alt: "C&C Gallery photo 12" },
  { src: `${BASE}/13.jpg`, alt: "C&C Gallery photo 13" },
  { src: `${BASE}/14.jpg`, alt: "C&C Gallery photo 14" },
  { src: `${BASE}/15.jpg`, alt: "C&C Gallery photo 15" },
  { src: `${BASE}/16.jpg`, alt: "C&C Gallery photo 16" },
  { src: `${BASE}/17.jpg`, alt: "C&C Gallery photo 17" },
  { src: `${BASE}/18.jpg`, alt: "C&C Gallery photo 18" },
  { src: `${BASE}/20.jpg`, alt: "C&C Gallery photo 20" },
  { src: `${BASE}/21.jpg`, alt: "C&C Gallery photo 21" },
  { src: `${BASE}/22.jpg`, alt: "C&C Gallery photo 22" },
  { src: `${BASE}/23.jpg`, alt: "C&C Gallery photo 23" },
  { src: `${BASE}/24.jpg`, alt: "C&C Gallery photo 24" },
  { src: `${BASE}/25.jpg`, alt: "C&C Gallery photo 25" },
  { src: `${BASE}/26.jpg`, alt: "C&C Gallery photo 26" },
  { src: `${BASE}/27.jpg`, alt: "C&C Gallery photo 27" },
  { src: `${BASE}/28.jpg`, alt: "C&C Gallery photo 28" },
  { src: `${BASE}/29.jpg`, alt: "C&C Gallery photo 29" },
  { src: `${BASE}/30.jpg`, alt: "C&C Gallery photo 30" },
  { src: `${BASE}/31.jpg`, alt: "C&C Gallery photo 31" },
  { src: `${BASE}/32.jpg`, alt: "C&C Gallery photo 32" },
];

export function GallerySection() {
  return (
    <section className="relative w-full bg-[#05070b] flex flex-col">
      {/* ── Heading ───────────────────────────────────────────────── */}
      <div className="text-center pt-12 pb-6 px-4">
        <p className="font-mono text-[10px] tracking-[0.4em] text-white/25 uppercase mb-3">
          Captured Moments
        </p>
        <h1
          className="font-black uppercase leading-none text-white"
          style={{
            fontFamily: "'Arial Black', 'Franklin Gothic Heavy', Impact, sans-serif",
            fontSize: "clamp(2.8rem, 8vw, 7rem)",
            letterSpacing: "-0.03em",
          }}
        >
          C&amp;C Gallery
        </h1>
        <p className="mt-3 text-sm text-neutral-500 font-light tracking-wide">
          {GALLERY_ITEMS.length} photographs · drag or use arrow keys to explore
        </p>
        <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* ── Halo Reel ─────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ height: "70vh", minHeight: "480px" }}>
        <HaloReel
          items={GALLERY_ITEMS}
          aria-label="C&C Gallery"
          /* Place the ellipse to the left so cards fill most of the screen */
          centerXRatio={0.5}
          radiusXRatio={0.38}
          radiusYRatio={0.40}
          cardWidth={200}
          cardHeight={280}
          minScale={0.35}
          spread={1.15}
          maxCards={64}
          holdDuration={1800}
          stepDuration={800}
          autoPlay={true}
          pauseOnHover={true}
          draggable={true}
          showCenterLabel={false}
          className="h-full w-full bg-transparent"
        />

        {/* Edge gradients to blend cards into the dark background */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#05070b] to-transparent z-[1100]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#05070b] to-transparent z-[1100]" />
        <div className="pointer-events-none absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#05070b] to-transparent z-[1100]" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#05070b] to-transparent z-[1100]" />
      </div>

      {/* Hint */}
      <p className="text-center font-mono text-[9px] tracking-[0.3em] text-white/15 uppercase pb-10">
        Drag · Swipe · Arrow Keys
      </p>
    </section>
  );
}
