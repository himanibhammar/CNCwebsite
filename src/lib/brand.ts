/**
 * Central Brand Configuration for CHALLENGES & CHAMPIONSHIPS (C&C)
 *
 * All brand metadata, taglines, and asset references are centralized here
 * so they can be modified without altering individual UI components.
 */

export const BRAND = {
  name: "CHALLENGES & CHAMPIONSHIPS",
  shortName: "C&C",
  tagline: "ENGINEERING THE NEXT CHALLENGE.",
  missionStatement:
    "An event-organizing domain conceptualizing and conducting premier engineering championships, technical challenges, hackathons, and student competitions.",
  logo: {
    src: "/images/logo.png",
    alt: "Challenges & Championships Official Brand Mark",
    width: 1312,
    height: 1199,
    isLightBackground: true, // PNG on white background; HeroStage uses direct path for advanced filter effects
  },
  routes: {
    home: "/",
    about: "/about",
    events: "/events",
    contact: "/contact",
  },
  contact: {
    email: "contact@challengesandchampionships.org",
    office: "Campus Innovation Complex, Engineering Hub",
    socials: [
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Instagram", href: "https://instagram.com" },
      { label: "GitHub", href: "https://github.com" },
      { label: "X / Twitter", href: "https://x.com" },
    ],
  },
} as const;
