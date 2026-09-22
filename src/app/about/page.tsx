"use client";

import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/Button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#07090e] text-white overflow-hidden pt-24">

      <ContainerScroll
        titleComponent={
          <div className="text-center px-4">
            {/* Label */}
        

            {/* ABOUT US headline */}
            <h1
              className="font-black uppercase text-white leading-[0.88]"
              style={{
                fontFamily: "'Arial Black', 'Franklin Gothic Heavy', Impact, sans-serif",
                fontSize: "clamp(5rem, 16vw, 16rem)",
                letterSpacing: "-0.04em",
              }}
            >
              ABOUT
              <br />
              <span
                style={{
                  WebkitTextStroke: "2px rgba(255,255,255,0.25)",
                  color: "transparent",
                }}
              >
                US
              </span>
            </h1>
          </div>
        }
      >
        {/* ── CONTENT INSIDE THE CARD ── */}
        <div className="h-full w-full overflow-y-auto overflow-x-hidden rounded-2xl bg-[#0a0d16] p-6 sm:p-10 space-y-10 scrollbar-none">

          {/* Decorative top bar */}
          <div className="flex items-center gap-2 pb-6 border-b border-white/[0.07]">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/10" />
            
          </div>

          {/* Journey headline */}
          <div>
            <h2
              className="font-black uppercase text-white leading-[0.9] mb-6"
              style={{
                fontFamily: "'Arial Black', Impact, sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                letterSpacing: "-0.025em",
              }}
            >
              The Journey from
              <br />
              <span
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.25)",
                  color: "transparent",
                }}
              >
                Challenge
              </span>{" "}
              to Championship.
            </h2>

            <div className="space-y-4">
              <p className="text-white/50 text-sm leading-relaxed font-light">
                Challenges &amp; Championships (C&amp;C), a vibrant platform of Aaruush, SRMIST, is the
                place where the spirit of competition, innovation, and the will to win thrive.
              </p>
              <p className="text-white/50 text-sm leading-relaxed font-light">
                From intense technical challenges to strategy and competition-based events, we offer a
                platform to put your grey matter to the test, think out-of-the-box, and battle it out
                amongst the best brains to crown a winner. Our events are designed to provide an arena
                to showcase skills and intellect, bringing together technology, strategy, innovation,
                brainstorming, and much more.
              </p>
              <p className="text-white/40 text-sm leading-relaxed font-light border-l-2 border-blue-500/40 pl-4 italic">
                We believe every challenge is a chance to learn, unlearn, and relearn an
                opportunity to collaborate, co-create, and innovate.
              </p>
            </div>
          </div>

       

          {/* CTAs */}
  
        </div>
      </ContainerScroll>
    </div>
  );
}
