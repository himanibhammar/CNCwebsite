/**
 * The four flagship events, as the showcase needs them.
 *
 * Deliberately separate from `@/data/flagship-events`, which feeds the archive
 * listing on /events. The showcase needs composition data (which images build
 * the lattice, which corner it enters from, how the title breaks across lines)
 * that has no business in a data model used for listings.
 *
 * Nothing here carries an href. The showcase never navigates.
 */

export interface FlagshipTile {
  src: string;
  alt: string;
}

export interface FlagshipShowcaseEvent {
  id: string;
  /** Two digit index, shown in the rail and the panel meta. */
  index: string;
  /** Title broken by hand: the line breaks are a design decision, not a fallback. */
  titleLines: string[];
  /** One sentence. If it needs two, it is too long for this composition. */
  standfirst: string;
  /**
   * The photographs that build the lattice. Two per event, which is what
   * actually exists: every `03.jpg` in the repo is still a development
   * placeholder, and shipping those would be worse than composing for two.
   */
  tiles: FlagshipTile[];
  /** Which corner the lattice flies in from. Alternates to break the rhythm. */
  entry: "right" | "left";
  /**
   * Which of the four lattice cells carry photographs. The other two are cut
   * as void slabs. Rotating the grid 45 degrees maps cell 0 to the left apex,
   * 1 to the top, 2 to the bottom and 3 to the right, so the choice here is a
   * composition decision: it sets where the light sits in the frame.
   */
  filledCells: number[];
  /**
   * A restrained cool accent per event. Used for one hairline and one label,
   * never for a glow.
   */
  accent: string;
}

export const FLAGSHIP_SHOWCASE: FlagshipShowcaseEvent[] = [
  {
    id: "hacksummit",
    index: "01",
    titleLines: ["HACK", "SUMMIT"],
    standfirst:
      "Thirty six hours, one room, and whatever you can ship before the clock runs out.",
    tiles: [
      { src: "/images/flagships/hacksummit/1.jpg", alt: "Hack Summit photo 1" },
      { src: "/images/flagships/hacksummit/2.jpg", alt: "Hack Summit photo 2" },
      { src: "/images/flagships/hacksummit/3.jpg", alt: "Hack Summit photo 3" },
      { src: "/images/flagships/hacksummit/4.jpg", alt: "Hack Summit photo 4" },
      { src: "/images/flagships/hacksummit/5.jpg", alt: "Hack Summit photo 5" },
      { src: "/images/flagships/hacksummit/6.jpg", alt: "Hack Summit photo 6" },
      { src: "/images/flagships/hacksummit/7.jpg", alt: "Hack Summit photo 7" },
      { src: "/images/flagships/hacksummit/8.jpg", alt: "Hack Summit photo 8" },
    ],
    entry: "right",
    filledCells: [0, 1, 2, 3, 4, 5, 7, 8],
    accent: "#7fb2ff",
  },
  {
    id: "nasa-space-apps",
    index: "02",
    titleLines: ["NASA", "SPACE APPS"],
    standfirst:
      "Open planetary data, a global judging floor, and 48 hours to make sense of it.",
    tiles: [
      { src: "/images/flagships/nasa-space-apps/9.jpg", alt: "NASA photo 1" },
      { src: "/images/flagships/nasa-space-apps/10.jpg", alt: "NASA photo 2" },
      { src: "/images/flagships/nasa-space-apps/11.jpg", alt: "NASA photo 3" },
      { src: "/images/flagships/nasa-space-apps/12.jpg", alt: "NASA photo 4" },
      { src: "/images/flagships/nasa-space-apps/13.jpg", alt: "NASA photo 5" },
      { src: "/images/flagships/nasa-space-apps/14.jpg", alt: "NASA photo 6" },
      { src: "/images/flagships/nasa-space-apps/15.jpg", alt: "NASA photo 7" },
      { src: "/images/flagships/nasa-space-apps/16.jpg", alt: "NASA photo 8" },
    ],
    entry: "left",
    filledCells: [0, 1, 2, 4, 5, 6, 7, 8],
    accent: "#8fd0e8",
  },
  {
    id: "turbodrift",
    index: "03",
    titleLines: ["TURBO", "DRIFT"],
    standfirst:
      "Tandem drift battles decided by suspension geometry and how late you lift.",
    tiles: [
      { src: "/images/flagships/turbodrift/17.jpg", alt: "TurboDrift photo 1" },
      { src: "/images/flagships/turbodrift/18.jpg", alt: "TurboDrift photo 2" },
      { src: "/images/flagships/turbodrift/19.jpg", alt: "TurboDrift photo 3" },
      { src: "/images/flagships/turbodrift/20.jpg", alt: "TurboDrift photo 4" },
      { src: "/images/flagships/turbodrift/21.jpg", alt: "TurboDrift photo 5" },
      { src: "/images/flagships/turbodrift/22.jpg", alt: "TurboDrift photo 6" },
      { src: "/images/flagships/turbodrift/23.jpg", alt: "TurboDrift photo 7" },
      { src: "/images/flagships/turbodrift/24.jpg", alt: "TurboDrift photo 8" },
    ],
    entry: "right",
    filledCells: [0, 1, 3, 4, 5, 6, 7, 8],
    accent: "#c9b391",
  },
  {
    id: "quadcopter",
    index: "04",
    titleLines: ["QUAD", "COPTER"],
    standfirst:
      "Autonomous waypoint guidance, obstacle gates, and a payload that has to land where you said.",
    tiles: [
      { src: "/images/flagships/quadcopter/25.jpg", alt: "Quadcopter photo 1" },
      { src: "/images/flagships/quadcopter/26.jpg", alt: "Quadcopter photo 2" },
      { src: "/images/flagships/quadcopter/27.jpg", alt: "Quadcopter photo 3" },
      { src: "/images/flagships/quadcopter/28.jpg", alt: "Quadcopter photo 4" },
      { src: "/images/flagships/quadcopter/29.jpg", alt: "Quadcopter photo 5" },
      { src: "/images/flagships/quadcopter/30.jpg", alt: "Quadcopter photo 6" },
      { src: "/images/flagships/quadcopter/31.jpg", alt: "Quadcopter photo 7" },
      { src: "/images/flagships/quadcopter/32.jpg", alt: "Quadcopter photo 8" },
    ],
    entry: "left",
    filledCells: [0, 1, 2, 3, 4, 6, 7, 8],
    accent: "#a8bcd6",
  },
];
