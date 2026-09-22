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
  /** Short discipline line. Kept to three words so it never wraps. */
  discipline: string;
  /** Title broken by hand: the line breaks are a design decision, not a fallback. */
  titleLines: string[];
  /** One sentence. If it needs two, it is too long for this composition. */
  standfirst: string;
  /** Revealed in place when the panel is expanded. No navigation. */
  detail: string[];
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
  filledCells: [number, number];
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
    discipline: "SOFTWARE / SYSTEMS / BUILD",
    titleLines: ["HACK", "SUMMIT"],
    standfirst:
      "Thirty six hours, one room, and whatever you can ship before the clock runs out.",
    detail: [
      "Full stack and distributed systems sprints",
      "Embedded hardware and IoT integration tracks",
      "Live jury review with working demos only",
    ],
    tiles: [
      { src: "/images/flagships/hacksummit/01.jpg", alt: "Hack Summit main build floor" },
      { src: "/images/flagships/hacksummit/02.jpg", alt: "Hardware prototyping bench at Hack Summit" },
    ],
    entry: "right",
    filledCells: [1, 2],
    accent: "#7fb2ff",
  },
  {
    id: "nasa-space-apps",
    index: "02",
    discipline: "ORBIT / EARTH DATA / SCIENCE",
    titleLines: ["NASA", "SPACE APPS"],
    standfirst:
      "Open planetary data, a global judging floor, and 48 hours to make sense of it.",
    detail: [
      "Planetary and Earth observation data sets",
      "Satellite telemetry and orbit modelling",
      "Judged alongside chapters worldwide",
    ],
    tiles: [
      { src: "/images/flagships/nasa-space-apps/01.jpg", alt: "Mission data lab at NASA Space Apps" },
      { src: "/images/flagships/nasa-space-apps/02.jpg", alt: "Orbit modelling session at NASA Space Apps" },
    ],
    entry: "left",
    filledCells: [1, 3],
    accent: "#8fd0e8",
  },
  {
    id: "turbodrift",
    index: "03",
    discipline: "CHASSIS / SLIP / TELEMETRY",
    titleLines: ["TURBO", "DRIFT"],
    standfirst:
      "Tandem drift battles decided by suspension geometry and how late you lift.",
    detail: [
      "Custom RC drift chassis and suspension tuning",
      "Optical lap tracking with slip angle sensors",
      "Head to head tandem finals on a technical course",
    ],
    tiles: [
      { src: "/images/flagships/turbodrift/01.jpg", alt: "Technical chicane during TurboDrift" },
      { src: "/images/flagships/turbodrift/02.jpg", alt: "Chassis alignment in the TurboDrift paddock" },
    ],
    entry: "right",
    filledCells: [2, 3],
    accent: "#c9b391",
  },
  {
    id: "quadcopter",
    index: "04",
    discipline: "THRUST / AUTONOMY / FLIGHT",
    titleLines: ["QUAD", "COPTER"],
    standfirst:
      "Autonomous waypoint guidance, obstacle gates, and a payload that has to land where you said.",
    detail: [
      "Optical flow navigation through obstacle gates",
      "High rate ESC telemetry and motor diagnostics",
      "Payload drop accuracy scored to the centimetre",
    ],
    tiles: [
      { src: "/images/flagships/quadcopter/01.jpg", alt: "Autonomous flight arena at the Quadcopter championship" },
      { src: "/images/flagships/quadcopter/02.jpg", alt: "Speed gate traversal at the Quadcopter championship" },
    ],
    entry: "left",
    filledCells: [0, 1],
    accent: "#a8bcd6",
  },
];
