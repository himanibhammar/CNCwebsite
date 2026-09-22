import { BRAND } from "@/lib/brand";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About: ${BRAND.name}`,
  description: BRAND.missionStatement,
};

export default function AboutPage() {
  const pillars = [
    {
      number: "01",
      title: "SOFTWARE & SYSTEMS",
      desc: "Full-scale hackathons, distributed cloud architecture, and embedded systems challenges designed for rapid ideation and deployment.",
    },
    {
      number: "02",
      title: "MECHATRONICS & DRIFT",
      desc: "High-octane RC and automotive telemetry trials testing chassis balance, powertrain calibration, and precision track dynamics.",
    },
    {
      number: "03",
      title: "AUTONOMOUS AERIAL ROBOTICS",
      desc: "Quadcopter flight decks, obstacle navigation gates, optical flow autonomy, and payload delivery engineering.",
    },
    {
      number: "04",
      title: "PLANETARY & OPEN DATA",
      desc: "Global hackathons in partnership with open space and Earth observation datasets addressing scientific exploration frontiers.",
    },
  ];

  return (
    <div className="w-full min-h-screen pt-32 pb-28 px-6 sm:px-10 lg:px-16 bg-[#07090e] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Title Section */}
        <div className="border-b border-white/[0.08] pb-14 mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-blue-400">
              C&C DOSSIER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="font-mono text-xs tracking-widest text-neutral-400">
              ORGANIZATION PROFILE
            </span>
          </div>

          <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white uppercase leading-[1] mb-6">
            ENGINEERING THE
            <br />
            NEXT CHALLENGE.
          </h1>

          <p className="font-sans text-base sm:text-xl text-neutral-300 font-light max-w-3xl leading-relaxed">
            {BRAND.missionStatement}
          </p>
        </div>

        {/* Editorial Two-Column Identity Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 pb-20 border-b border-white/[0.08]">
          <div className="lg:col-span-7 space-y-6">
            <p className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
              {"// PURPOSE & ETHOS"}
            </p>
            <h2 className="font-sans text-2xl sm:text-4xl font-light text-white uppercase leading-tight">
              A Platform Built For Rigorous Technical Competition
            </h2>
            <p className="font-sans text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
              Challenges & Championships (C&C) exists to conceptualize, design, and host competitive arenas where theoretical engineering transforms into real-world performance. From 36-hour coding sprints to high-precision RC drifting tracks and aerial obstacle courses, every C&C initiative demands uncompromised craftsmanship.
            </p>
            <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed">
              We reject cosmetic hackathons in favor of deep-tech evaluation, transparent jury standards, and production-grade validation criteria.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative p-8 rounded-sm bg-[#0b0e17] border border-white/[0.1] shadow-2xl flex flex-col items-center">
              <BrandLogo variant="card" priority />
              <p className="font-mono text-xs text-neutral-300 tracking-[0.25em] mt-4 uppercase">
                {BRAND.name}
              </p>
              <p className="font-mono text-[10px] text-neutral-500 tracking-widest mt-1">
                OFFICIAL DOMAIN EMBLEM
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/[0.08]">
            <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
              {"// CORE DOMAINS OF EXECUTION"}
            </h2>
            <span className="font-mono text-xs text-neutral-500">04 DISCIPLINES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="p-8 rounded-sm bg-[#090c14] border border-white/[0.06] space-y-4"
              >
                <span className="font-mono text-xs font-semibold text-blue-400 tracking-widest">
                  {pillar.number}
                </span>
                <h3 className="font-sans text-2xl font-light text-white uppercase">
                  {pillar.title}
                </h3>
                <p className="font-sans text-sm text-neutral-400 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Visual Vignette */}
        <div className="relative aspect-[21/9] w-full rounded-sm overflow-hidden border border-white/[0.08] mb-20 bg-[#0c101a]">
          <Image
            src="/images/flagships/hacksummit/01.jpg"
            alt="Hacksummit arena showcase"
            fill
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 sm:left-10 font-mono text-xs tracking-widest text-neutral-300 uppercase">
            C&C ARENA PROTOCOL // ZERO PLACEHOLDERS ON STAGE
          </div>
        </div>

        {/* Bottom Navigation CTA */}
        <div className="p-8 sm:p-12 rounded-sm bg-[#0b0e17] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-sans text-2xl font-light text-white uppercase">
              READY TO COMPETE OR COLLABORATE?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-400 font-light">
              Connect with the C&C committee for event rules, sponsorships, and technical participation.
            </p>
          </div>

          <div className="flex gap-4">
            <Button href="/events" variant="editorial">
              VIEW EVENTS
            </Button>
            <Button href="/contact" variant="solid">
              CONTACT US
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
