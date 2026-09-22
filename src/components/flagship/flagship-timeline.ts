import gsap from "gsap";

/**
 * The flagship animation system.
 *
 * One timeline builder, used by all four panels. The four events differ in
 * subject, imagery, accent and which corner the lattice arrives from, but they
 * share a single motion language, which is what makes the section feel
 * authored rather than assembled.
 *
 * The sequence, taken from the reference:
 *
 *   1. the lattice flies in along its own diagonal and settles
 *   2. each image inside the lattice pushes back from a slight overscale,
 *      so the picture and its frame arrive at different rates
 *   3. the title rises out of its mask, one line at a time
 *   4. a hairline draws out from the title's left edge
 *   5. standfirst, then the control, settle last
 *
 * Everything is expressed as a paused timeline the caller plays or reverses.
 * Nothing here reads the scroll position, so the same builder works for a
 * scroll driven sequence, a click driven one, or a test.
 */

/** Distance the lattice travels along its diagonal, in percent of its own box. */
const LATTICE_TRAVEL = 58;

export interface PanelTimelineOptions {
  /** Which side the lattice enters from. */
  entry: "right" | "left";
}

export function buildPanelTimeline(
  panel: HTMLElement,
  { entry }: PanelTimelineOptions
): gsap.core.Timeline {
  const q = gsap.utils.selector(panel);
  const direction = entry === "right" ? 1 : -1;

  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out" },
  });

  timeline
    // 1. the lattice arrives on the diagonal
    .fromTo(
      q("[data-fs-tile]"),
      {
        xPercent: LATTICE_TRAVEL * direction,
        yPercent: -LATTICE_TRAVEL,
        opacity: 0,
        scale: 1.08,
      },
      {
        xPercent: 0,
        yPercent: 0,
        opacity: 1,
        scale: 1,
        duration: 1.15,
        stagger: 0.075,
        ease: "expo.out",
      },
      0
    )
    // 2. the pictures settle back inside their frames a beat later
    .fromTo(
      q("[data-fs-tile-img]"),
      { scale: 1.9 },
      { scale: 1.55, duration: 1.5, stagger: 0.075, ease: "power2.out" },
      0.05
    )
    // 3. the title rises
    .fromTo(
      q("[data-fs-meta]"),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.2
    )
    .fromTo(
      q("[data-fs-line]"),
      { yPercent: 116 },
      { yPercent: 0, duration: 1, stagger: 0.085, ease: "expo.out" },
      0.24
    )
    // 4. the hairline draws
    .fromTo(
      q("[data-fs-rule]"),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.85, ease: "power2.inOut" },
      0.42
    )
    // 5. supporting copy settles
    .fromTo(
      q("[data-fs-body]"),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.8 },
      0.5
    )
    .fromTo(
      q("[data-fs-cta]"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.62
    );

  return timeline;
}

/**
 * Puts a panel into its finished state with no animation.
 *
 * Used for the reduced motion path and for the panel that is already on screen
 * when the section mounts.
 */
export function settlePanel(panel: HTMLElement) {
  const q = gsap.utils.selector(panel);
  gsap.set(q("[data-fs-tile]"), {
    xPercent: 0,
    yPercent: 0,
    opacity: 1,
    scale: 1,
  });
  gsap.set(q("[data-fs-tile-img]"), { scale: 1.55 });
  gsap.set(q("[data-fs-line]"), { yPercent: 0 });
  gsap.set(q("[data-fs-rule]"), { scaleX: 1 });
  gsap.set(q("[data-fs-meta]"), { opacity: 1, y: 0 });
  gsap.set(q("[data-fs-body]"), { opacity: 1, y: 0 });
  gsap.set(q("[data-fs-cta]"), { opacity: 1, y: 0 });
}
