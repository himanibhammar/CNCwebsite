"use client";

import { forwardRef } from "react";

/** Base colour, shared with OUR FLAGSHIPS so the two screens read as one. */
export const HERO_BACKGROUND = "#05070b";

/**
 * The stage backdrop, matched to OUR FLAGSHIPS: the same near-black, the same
 * cool bloom falling from the top edge (a touch softer here, with no gallery
 * behind it), a faint lift behind the headline so the centre is not a flat
 * void, and the shared vignette. The intro fades it up from black, so it
 * still "powers on" with the rest of the stage.
 */
export const HeroAtmosphere = forwardRef<HTMLDivElement>(
  function HeroAtmosphere(_props, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: HERO_BACKGROUND }}
      >
        <div
          className="absolute left-1/2 top-0 h-[60vh] w-full max-w-[1600px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 0%, rgba(120,162,226,0.24) 0%, rgba(40,70,120,0.09) 42%, transparent 76%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 55%, rgba(26,40,70,0.32) 0%, transparent 72%)",
          }}
        />
        <div className="stage-vignette absolute inset-0" />
      </div>
    );
  }
);
