"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface FitOptions {
  /**
   * Fraction of the container each line should span. Slightly under 1 leaves
   * the optical margin that a condensed face needs so the outer stems do not
   * look glued to the frame edge.
   */
  fill?: number;
  /** Combined line-box height ceiling, as a fraction of the stage height. */
  maxHeightRatio?: number;
  /** CSS line-height the lines are set in, used for the height budget. */
  lineHeight?: number;
}

/**
 * Sizes headline lines so each one spans the full measure.
 *
 * A viewport-unit font size can only ever be a guess: the correct size depends
 * on the glyphs in the line, and "CHALLENGES &" and "CHAMPIONSHIPS" do not
 * have the same width per em. Guessing leaves the ragged right edge that stops
 * a full bleed headline reading as full bleed.
 *
 * So we measure instead. Each line is rendered at a reference size, its natural
 * width is read once, and the real size is derived from the ratio. If the two
 * lines would then overflow the stage vertically, both are scaled down by the
 * same factor, which keeps their relative proportions intact.
 *
 * Runs after the display face has actually loaded, because measuring a fallback
 * and then swapping fonts would size the lines to the wrong metrics.
 */
export function useFitHeadline(
  lines: React.RefObject<HTMLElement | null>[],
  { fill = 1, maxHeightRatio = 0.58, lineHeight = 0.76 }: FitOptions = {}
) {
  // The caller builds a fresh array every render, so it cannot be a dependency
  // without restarting the observer each time. Capturing it in its own layout
  // effect keeps the mount effect below reading current values without writing
  // to a ref during render.
  const linesRef = useRef(lines);
  useIsomorphicLayoutEffect(() => {
    linesRef.current = lines;
  });

  useIsomorphicLayoutEffect(() => {
    const REFERENCE_SIZE = 100;

    const fit = () => {
      const elements = linesRef.current
        .map((ref) => ref.current)
        .filter((el): el is HTMLElement => Boolean(el));

      if (!elements.length) return;

      // The mask wrapper is a block inside the padded column, so its width
      // is exactly the measure available to the type. Reading the padded
      // parent instead would include its padding and overshoot.
      const mask = elements[0].parentElement;
      if (!mask) return;

      const measure = mask.clientWidth;
      if (!measure) return;

      // Natural width of each line at a known size.
      //
      // The lines are block level so the mask can clip them, and a block's
      // scrollWidth is its own width, not its text's. Shrink-wrapping each
      // line for the duration of the measurement is what actually reports the
      // glyph run. offsetWidth is pre-transform, so the entrance animation
      // cannot skew the reading.
      const sizes = elements.map((el) => {
        const display = el.style.display;
        el.style.fontSize = `${REFERENCE_SIZE}px`;
        el.style.display = "inline-block";
        const natural = el.offsetWidth;
        el.style.display = display;
        return natural > 0
          ? (measure * fill * REFERENCE_SIZE) / natural
          : REFERENCE_SIZE;
      });

      // Height budget: if the stack is too tall for the stage, shrink both by
      // the same factor so the typographic relationship survives.
      const stageHeight = window.innerHeight;
      const stackHeight = sizes.reduce((sum, size) => sum + size * lineHeight, 0);
      const ceiling = stageHeight * maxHeightRatio;
      const correction = stackHeight > ceiling ? ceiling / stackHeight : 1;

      elements.forEach((el, i) => {
        el.style.fontSize = `${(sizes[i] * correction).toFixed(2)}px`;
      });
    };

    // Fit immediately so nothing is ever unsized, then fit again once the
    // display face has actually arrived. `document.fonts.status` can already
    // read "loaded" for the body faces while the display face is still in
    // flight, so the second pass is not optional.
    let cancelled = false;
    const refit = () => {
      if (!cancelled) fit();
    };

    fit();
    document.fonts?.ready.then(refit).catch(refit);

    const observer = new ResizeObserver(fit);
    const container = linesRef.current[0]?.current?.parentElement ?? null;
    if (container) observer.observe(container);
    window.addEventListener("resize", fit);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);
}
