"use client";

import { forwardRef } from "react";

/**
 * The lighting rig.
 *
 * Left of the seam is the void, the challenge. Right of it is a blown-out key
 * light, the championship. Everything here is one physical setup: a single
 * source behind and to the right of the subject, plus the haze, rays, flare,
 * floor bounce and vignette that source would actually produce.
 *
 * The light core sits low (58% down) so the top strip of the stage stays dark
 * and the navigation bar remains readable over it.
 */
export const HeroAtmosphere = forwardRef<HTMLDivElement>(
  function HeroAtmosphere(_props, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Cold ambient fill so the void side is never flatly black */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 18% 24%, rgba(16,23,38,0.55) 0%, rgba(6,9,14,0.94) 40%, #05070b 72%)",
          }}
        />

        {/* The hard diagonal: void meets light */}
        <div
          data-atmos="seam"
          className="stage-seam-light absolute inset-0 opacity-70"
          style={{ filter: "blur(2px)" }}
        />

        {/* Rim along the seam itself */}
        <div
          data-atmos="seam-edge"
          className="stage-seam-edge absolute top-0 h-full w-[1px] opacity-60 origin-top"
          style={{
            left: "44%",
            transform: "rotate(-9.5deg) scaleY(1.4)",
            filter: "blur(1.5px)",
          }}
        />

        {/* Volumetric key light */}
        <div
          data-atmos="key"
          className="stage-keylight absolute inset-0 animate-breathe"
          style={{ filter: "blur(18px)" }}
        />

        {/* God rays thrown past the subject's silhouette */}
        <div
          data-atmos="rays"
          className="absolute inset-0 opacity-[0.22] mix-blend-screen"
          style={{ filter: "blur(14px)" }}
        >
          {[
            { left: "38%", w: 46, rot: -13, h: "78%" },
            { left: "47%", w: 22, rot: -9, h: "86%" },
            { left: "56%", w: 62, rot: -6, h: "72%" },
            { left: "66%", w: 30, rot: -2, h: "82%" },
            { left: "74%", w: 52, rot: 3, h: "66%" },
          ].map((ray) => (
            <div
              key={ray.left}
              className="stage-ray absolute top-[-8%] origin-top"
              style={{
                left: ray.left,
                width: `${ray.w}px`,
                height: ray.h,
                transform: `rotate(${ray.rot}deg)`,
              }}
            />
          ))}
        </div>

        {/* Atmospheric haze drifting through the beam */}
        <div
          data-atmos="haze"
          className="absolute left-[30%] top-[20%] h-[70%] w-[70%] opacity-[0.22]"
          style={{
            background:
              "radial-gradient(45% 55% at 40% 60%, rgba(178,200,230,0.22) 0%, transparent 70%)",
            filter: "blur(46px)",
          }}
        />

        {/* Anamorphic streak through the light core */}
        <div
          data-atmos="flare"
          className="stage-flare absolute left-[14%] h-[1px] w-[84%] opacity-50 mix-blend-screen animate-flicker"
          style={{ top: "57%", filter: "blur(3px)" }}
        />
        <div
          className="stage-flare absolute left-[30%] h-[1px] w-[52%] opacity-30 mix-blend-screen"
          style={{ top: "57%", filter: "blur(8px)" }}
        />

        {/* Floor plane + horizon the subject stands on */}
        <div
          data-atmos="floor"
          className="stage-floor absolute inset-x-0 bottom-0 h-[26%]"
        />
        <div
          className="stage-horizon absolute inset-x-[8%] h-[1px] opacity-70"
          style={{ bottom: "18%", filter: "blur(0.6px)" }}
        />
        <div
          className="stage-horizon absolute inset-x-[22%] h-[3px] opacity-30"
          style={{ bottom: "18%", filter: "blur(7px)" }}
        />

        {/* Lens finish: scanlines then vignette, in that order */}
        <div className="stage-scanlines absolute inset-0 opacity-[0.35] mix-blend-overlay" />
        <div className="stage-vignette absolute inset-0" />
      </div>
    );
  }
);
