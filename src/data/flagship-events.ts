import { FlagshipEvent } from "@/types/events";

export const FLAGSHIP_EVENTS: FlagshipEvent[] = [
  {
    id: "hacksummit",
    number: "01 / 04",
    title: "HACKSUMMIT",
    category: "IDEAS / BUILD / COLLABORATE",
    tagline: "36 hours of rapid software engineering, hardware prototyping, and systems innovation.",
    description:
      "A flagship hackathon uniting developers, designers, and systems architects to conceptualize and deploy production-ready technical solutions.",
    year: "2026",
    highlights: [
      "Full-stack software and distributed system sprints",
      "Embedded hardware and IoT integration tracks",
      "Direct technical jury evaluations and real-time demos",
    ],
    images: [
      {
        src: "/images/flagships/hacksummit/01.jpg",
        alt: "Hacksummit main arena coding sprint",
        caption: "Main Arena / Sprint Stage",
        layout: { x: 5, y: -6, width: 62, rotation: -1, zIndex: 1 },
      },
      {
        src: "/images/flagships/hacksummit/02.jpg",
        alt: "Hacksummit collaborative prototyping session",
        caption: "Hardware & Prototype Lab",
        layout: { x: 38, y: 32, width: 56, rotation: 1.5, zIndex: 2 },
      },
      {
        src: "/images/flagships/hacksummit/03.jpg",
        alt: "Hacksummit final system evaluations",
        caption: "Jury Demonstration Stage",
        layout: { x: -8, y: 52, width: 48, rotation: -0.5, zIndex: 3 },
      },
    ],
  },
  {
    id: "turbodrift",
    number: "02 / 04",
    title: "TURBODRIFT",
    category: "PRECISION / SPEED / TELEMETRY",
    tagline: "High-octane RC and electric drift telemetry challenges tested on dynamic tracks.",
    description:
      "A competitive automotive engineering and RC drifting championship testing chassis balance, powertrain tuning, and real-time cornering telemetry.",
    year: "2026",
    highlights: [
      "Custom RC drift chassis dynamics & suspension tuning",
      "Real-time optical lap tracking and slip angle sensors",
      "Head-to-head tandem drift battles on technical courses",
    ],
    images: [
      {
        src: "/images/flagships/turbodrift/01.jpg",
        alt: "Turbodrift high-speed cornering and track telemetry",
        caption: "Technical Chicane / Sector 1",
        layout: { x: 18, y: -4, width: 64, rotation: 1.2, zIndex: 1 },
      },
      {
        src: "/images/flagships/turbodrift/02.jpg",
        alt: "Turbodrift paddock chassis tuning",
        caption: "Paddock Pit / Chassis Alignment",
        layout: { x: -4, y: 28, width: 52, rotation: -2, zIndex: 2 },
      },
      {
        src: "/images/flagships/turbodrift/03.jpg",
        alt: "Turbodrift tandem drift evaluation",
        caption: "Tandem Drift Finals",
        layout: { x: 42, y: 48, width: 54, rotation: 0.8, zIndex: 3 },
      },
    ],
  },
  {
    id: "quadcopter",
    number: "03 / 04",
    title: "QUADCOPTER",
    category: "AERODYNAMICS / AUTONOMY / FLIGHT",
    tagline: "Autonomous drone navigation, precision obstacle courses, and aerial payload delivery.",
    description:
      "An aerial robotics championship challenging participants to construct high-thrust multirotors capable of autonomous waypoint guidance and aerobatic maneuvering.",
    year: "2026",
    highlights: [
      "Autonomous optical flow and obstacle avoidance gates",
      "High-rate ESC telemetry and motor response diagnostics",
      "Dynamic payload drop zone accuracy scoring",
    ],
    images: [
      {
        src: "/images/flagships/quadcopter/01.jpg",
        alt: "Quadcopter flight test in autonomous arena",
        caption: "Autonomous Flight Arena",
        layout: { x: -2, y: -2, width: 60, rotation: -1.5, zIndex: 2 },
      },
      {
        src: "/images/flagships/quadcopter/02.jpg",
        alt: "Quadcopter high-speed gate traversal",
        caption: "Speed Gate Traversal",
        layout: { x: 36, y: 16, width: 58, rotation: 1.8, zIndex: 1 },
      },
      {
        src: "/images/flagships/quadcopter/03.jpg",
        alt: "Quadcopter telemetry and ground control station",
        caption: "Telemetry GCS Ground Station",
        layout: { x: 12, y: 54, width: 50, rotation: -0.6, zIndex: 3 },
      },
    ],
  },
  {
    id: "nasa-space-apps",
    number: "04 / 04",
    title: "NASA SPACE APPS CHALLENGE",
    category: "ASTRONOMY / EARTH DATA / EXPLORATION",
    tagline: "Global hackathon solving real-world space and planetary challenges using open NASA data.",
    description:
      "An international hackathon convening aerospace enthusiasts, data scientists, and engineers to address orbital dynamics, Earth observation, and deep space data sets.",
    year: "2026",
    highlights: [
      "Planetary and Earth science open data access",
      "Satellite telemetry visualization and orbit modeling",
      "Global judging alongside worldwide aerospace chapters",
    ],
    images: [
      {
        src: "/images/flagships/nasa-space-apps/01.jpg",
        alt: "NASA Space Apps data analysis and Earth telemetry",
        caption: "Mission Control Data Lab",
        layout: { x: 12, y: -8, width: 66, rotation: 0.5, zIndex: 1 },
      },
      {
        src: "/images/flagships/nasa-space-apps/02.jpg",
        alt: "NASA Space Apps planetary visualization sprint",
        caption: "Planetary Orbit Modelers",
        layout: { x: -6, y: 22, width: 50, rotation: -1.2, zIndex: 3 },
      },
      {
        src: "/images/flagships/nasa-space-apps/03.jpg",
        alt: "NASA Space Apps project presentation",
        caption: "Final Global Pitch Session",
        layout: { x: 34, y: 44, width: 58, rotation: 1.4, zIndex: 2 },
      },
    ],
  },
];
