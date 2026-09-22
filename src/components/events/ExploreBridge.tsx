import { Button } from "@/components/ui/Button";

export function ExploreBridge() {
  return (
    <section
      className="relative w-full py-28 md:py-36 px-6 md:px-16 bg-[#07090e] border-t border-white/[0.08] overflow-hidden"
      aria-label="Explore All Events Transition"
    >
      {/* Subtle atmospheric gradient light */}
      <div
        className="glow-atmosphere w-[400px] h-[400px] bg-indigo-900/20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <span className="font-mono text-xs tracking-[0.3em] uppercase text-blue-400 mb-4">
          EXPLORE ALL EVENTS
        </span>

        <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white uppercase leading-[1.08] mb-8">
          A year of challenges,
          <br />
          championships and ideas.
        </h2>

        <p className="font-sans text-sm sm:text-base text-neutral-400 font-light max-w-xl mb-10 leading-relaxed">
          From full-contact robotics to orbital data hacks, view our complete calendar of competitive engineering initiatives and historical archives.
        </p>

        <div>
          <Button href="/events" variant="editorial" size="lg">
            VIEW EVENTS ARCHIVE
          </Button>
        </div>
      </div>
    </section>
  );
}
