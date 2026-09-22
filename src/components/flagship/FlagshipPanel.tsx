"use client";

import Image from "next/image";
import { clsx } from "clsx";
import type { FlagshipShowcaseEvent } from "./flagship-data";

interface FlagshipPanelProps {
  event: FlagshipShowcaseEvent;
  /** Panel order, used only for the lattice gutter rhythm. */
  position: number;
  total: number;
}

/**
 * One flagship, composed as an editorial spread rather than a card.
 *
 * Left: index, discipline, a hand broken title, one sentence, one control.
 * Right: a lattice of images rotated onto the diagonal, bleeding off the
 * frame edge and dissolving into the void on its inboard side.
 *
 * Everything animatable is tagged with a `data-fs-*` attribute. The timeline
 * that drives those tags lives in `flagship-timeline.ts` and is shared by all
 * four panels, so the four read as one system with four subjects.
 */
export function FlagshipPanel({ event, position, total }: FlagshipPanelProps) {
  return (
    <article
      data-fs-panel={event.id}
      className="absolute inset-0"
      aria-label={`Flagship ${event.index}: ${event.titleLines.join(" ")}`}
    >
      <FlagshipLattice event={event} position={position} />

      {/* ---- copy column --------------------------------------------------
          Sits on a 12 column grid on desktop and takes the first six, so the
          title always breaks against the same edge no matter how long it is. */}
      <div className="absolute inset-0 z-[20] flex items-end md:items-center">
        <div className="w-full px-[7vw] pb-[16vh] md:w-[56%] md:pb-0 md:pl-[7vw] md:pr-0 lg:w-[52%]">
          {/* index and discipline */}
          <div
            data-fs-meta
            className="mb-5 flex items-center gap-4 md:mb-7"
          >
            <span
              className="font-mono text-[11px] font-semibold tabular-nums tracking-[0.2em]"
              style={{ color: event.accent }}
            >
              {event.index}
            </span>
          </div>

          {/* title, one masked line at a time */}
          <h3 
            className="mb-6 md:mb-8 font-black uppercase tracking-[-0.03em] leading-[0.85] text-[clamp(2.5rem,6vw,5rem)]"
            style={{ fontFamily: "'Arial Black', 'Franklin Gothic Heavy', Impact, sans-serif" }}
          >
            <span className="sr-only">{event.titleLines.join(" ")}</span>
            {event.titleLines.map((line) => (
              <span
                key={line}
                aria-hidden="true"
                className="block overflow-hidden pb-[0.06em]"
              >
                <span
                  data-fs-line
                  className="fs-title block whitespace-nowrap will-change-transform"
                >
                  {line}
                </span>
              </span>
            ))}
          </h3>

          <p
            data-fs-body
            className="max-w-[30rem] font-sans text-[13px] font-light leading-relaxed text-neutral-400 sm:text-[15px]"
          >
            {event.standfirst}
          </p>
        </div>
      </div>

      {/* Quiet position marker, bottom right, so the eye can always find where
          it is in the sequence without a heavy chrome. */}
      <div
        aria-hidden="true"
        className="absolute bottom-[7vh] right-[7vw] z-[20] hidden items-baseline gap-1 font-mono tabular-nums md:flex"
      >
        <span className="text-[13px] text-neutral-300">{event.index}</span>
        <span className="text-[10px] text-neutral-700">
          / {String(total).padStart(2, "0")}
        </span>
      </div>
    </article>
  );
}

/**
 * The image lattice.
 *
 * A square grid rotated onto the diagonal, with each image counter rotated
 * inside its cell so the picture stays upright while its frame is a diamond.
 * Two cells carry photographs and two are cut as void slabs, which keeps the
 * grid from reading as a 2x2 block of cards.
 *
 * The inboard edge is removed with a mask rather than covered with a black
 * overlay. An overlay would paint solid black across the ambient grade behind
 * it and leave a visible vertical seam down the middle of the frame; a mask
 * takes the pixels away and lets the room show through.
 */
function FlagshipLattice({
  event,
  position,
}: {
  event: FlagshipShowcaseEvent;
  position: number;
}) {
  // Map the two photographs onto their chosen cells; the rest are void.
  const slotOf = (cell: number) => event.filledCells.indexOf(cell);
  const cells = Array.from({ length: 9 }, (_, i) => {
    const slot = slotOf(i);
    return slot === -1 ? null : event.tiles[slot] ?? null;
  });

  return (
    <div
      aria-hidden="true"
      data-fs-lattice
      className={clsx(
        "pointer-events-none absolute z-[10] overflow-hidden",
        // Mobile: the lattice takes the top of the frame and bleeds off the
        // top right corner. Desktop: it owns the right half, full height.
        "inset-x-0 top-0 h-[54%]",
        "md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[60%] lg:w-[58%]",
        "fs-lattice-mask"
      )}
    >
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 md:w-[138%] md:translate-x-[-28%] lg:w-[132%] lg:translate-x-[-25%]"
      >
        <div
          className="grid h-full w-full grid-cols-3 grid-rows-3 gap-[8px] md:gap-[12px]"
          style={{ transform: "rotate(45deg)" }}
        >
          {cells.map((tile, i) =>
            tile ? (
              <div
                key={`${tile.src}-${i}`}
                data-fs-tile
                className="relative overflow-hidden will-change-transform"
              >
                <div
                  data-fs-tile-img
                  className="absolute inset-0 will-change-transform"
                  style={{ transform: "rotate(-45deg) scale(1.55)" }}
                >
                  <Image
                    src={tile.src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 90vw, 40vw"
                    priority={position === 0 && slotOf(i) === 0}
                    className="object-cover"
                    style={{ filter: "contrast(1.06) brightness(1.12)" }}
                  />
                </div>

                {/* Directional grade: the same key light as the hero, falling
                    across every tile from the same upper right source. */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(218deg, rgba(196,218,250,0.2) 0%, transparent 38%, rgba(5,7,11,0.38) 100%)",
                  }}
                />
              </div>
            ) : (
              <div
                key={`void-${i}`}
                data-fs-tile
                className="relative overflow-hidden will-change-transform"
              >
                {/* The empty cell is not blank: it is a slab of the void with
                    a single lit edge, so it belongs to the same material. */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(218deg, rgba(28,38,56,0.9) 0%, rgba(8,11,17,0.95) 62%, #05070b 100%)",
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(218deg, ${event.accent}2e 0%, transparent 22%)`,
                  }}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
