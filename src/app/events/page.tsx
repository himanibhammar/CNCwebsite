"use client";

import { useState } from "react";
import Image from "next/image";
import { FLAGSHIP_EVENTS } from "@/data/flagship-events";
import { PAST_EVENTS } from "@/data/past-events";
import { clsx } from "clsx";

export default function EventsArchivePage() {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "FLAGSHIPS" | "ARCHIVE">("ALL");

  const filterTabs = [
    { label: "ALL INITIATIVES", key: "ALL" as const },
    { label: "CURRENT FLAGSHIPS", key: "FLAGSHIPS" as const },
    { label: "PAST EDITIONS", key: "ARCHIVE" as const },
  ];

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 sm:px-10 lg:px-16 bg-[#07090e] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Title & Editorial Lead */}
        <div className="border-b border-white/[0.08] pb-12 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-blue-400">
              C&C ARCHIVE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="font-mono text-xs tracking-widest text-neutral-400">
              RECORD OF COMPETITIONS
            </span>
          </div>

          <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white uppercase leading-[1.02] mb-6 max-w-4xl">
            CHRONOLOGY OF
            <br />
            CHALLENGES & SUMMITS
          </h1>

          <p className="font-sans text-base sm:text-lg text-neutral-400 font-light max-w-2xl leading-relaxed">
            An editorial registry of collegiate championships, hackathons, aerodynamic trials, and robotics arenas organized under the C&C banner.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 mb-12 border-b border-white/[0.06] pb-4 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={clsx(
                "px-4 py-2 font-mono text-xs tracking-widest uppercase rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap",
                activeFilter === tab.key
                  ? "bg-white text-black font-medium shadow-lg"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECTION 1: FLAGSHIP EVENTS */}
        {(activeFilter === "ALL" || activeFilter === "FLAGSHIPS") && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
                {"// 2026 FLAGSHIP CALENDAR (04)"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FLAGSHIP_EVENTS.map((event) => (
                <article
                  key={event.id}
                  className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-sm bg-[#0b0e17] border border-white/[0.08] hover:border-white/[0.25] transition-all duration-500 overflow-hidden"
                >
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold tracking-widest text-blue-400">
                        {event.number}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest px-2.5 py-1 rounded-full bg-white/[0.06] text-neutral-300 uppercase">
                        FLAGSHIP
                      </span>
                    </div>

                    <h3 className="font-sans text-2xl sm:text-4xl font-light tracking-tight text-white uppercase group-hover:text-blue-300 transition-colors">
                      {event.title}
                    </h3>

                    <p className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
                      {event.category}
                    </p>

                    <p className="font-sans text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Image Preview with Hover Zoom */}
                  <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-white/[0.08] mb-6">
                    <Image
                      src={event.images[0].src}
                      alt={event.images[0].alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] font-mono text-xs tracking-widest text-neutral-400">
                    <span>{event.year}</span>
                    <span className="text-neutral-500">FLAGSHIP EDITION</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: PAST / ARCHIVE EVENTS */}
        {(activeFilter === "ALL" || activeFilter === "ARCHIVE") && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
                {`// HISTORICAL ARCHIVE (${PAST_EVENTS.length})`}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PAST_EVENTS.map((event) => (
                <article
                  key={event.id}
                  className="group flex flex-col justify-between p-5 rounded-sm bg-[#090c14] border border-white/[0.07] hover:border-white/20 transition-all duration-300"
                >
                  <div className="space-y-3 mb-5">
                    {/* Event Photo Preview */}
                    <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-white/[0.08] mb-3">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-[2px] font-mono text-[9px] text-neutral-300">
                        {event.year}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400">
                      <span>{event.category}</span>
                      <span className="text-neutral-400">{event.teamSize}</span>
                    </div>

                    <h3 className="font-sans text-xl font-light text-white uppercase group-hover:text-blue-300 transition-colors">
                      {event.title}
                    </h3>

                    <p className="font-sans text-xs text-neutral-400 leading-relaxed font-light line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] font-mono text-[11px] tracking-widest text-neutral-400">
                    <span>{event.year}</span>
                    <span className="text-neutral-500">{event.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
