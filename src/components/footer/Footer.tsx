import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  return (
    <footer
      className="relative w-full bg-[#05070a] border-t border-white/[0.08] text-white pt-20 pb-12 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="Global Footer"
    >
      {/* Subtle Bottom Ambient Glow */}
      <div
        className="glow-atmosphere w-[600px] h-[300px] bg-blue-950/20 bottom-0 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Primary Statement */}
        <div className="border-b border-white/[0.08] pb-14 mb-14">
          <p className="font-mono text-xs tracking-[0.35em] text-blue-400 uppercase mb-4">
            MOTTO & VISION
          </p>
          <h2 className="font-sans text-3xl sm:text-5xl md:text-7xl font-light tracking-tight text-white uppercase max-w-5xl leading-[1.05]">
            {BRAND.tagline}
          </h2>
        </div>

        {/* Multi-column Organization Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-white/[0.08]">
          {/* Brand Identity */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo variant="footer" />
            </Link>
            <div className="space-y-1">
              <p className="font-sans text-base font-medium tracking-tight text-white">
                {BRAND.name}
              </p>
              <p className="font-mono text-xs text-neutral-400 tracking-wider">
                {BRAND.shortName}{" // OFFICIAL"}
              </p>
            </div>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed font-light">
              Premier technical challenges, engineering championships, and hackathons.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <p className="font-mono text-[11px] tracking-[0.25em] text-neutral-400 uppercase">
              EXPLORE
            </p>
            <ul className="space-y-2 font-mono text-xs tracking-wider">
              <li>
                <Link
                  href={BRAND.routes.about}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  ABOUT
                </Link>
              </li>
              <li>
                <Link
                  href={BRAND.routes.events}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  EVENTS ARCHIVE
                </Link>
              </li>
              <li>
                <Link
                  href={BRAND.routes.contact}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Headquarters */}
          <div className="space-y-3">
            <p className="font-mono text-[11px] tracking-[0.25em] text-neutral-400 uppercase">
              CONTACT & CAMPUS
            </p>
            <div className="space-y-2 text-xs font-mono text-neutral-400">
              <p className="hover:text-white transition-colors cursor-pointer">
                {BRAND.contact.email}
              </p>
              <p className="leading-relaxed text-neutral-400">
                {BRAND.contact.office}
              </p>
            </div>
          </div>

          {/* Socials */}
          <div className="space-y-3">
            <p className="font-mono text-[11px] tracking-[0.25em] text-neutral-400 uppercase">
              NETWORK
            </p>
            <ul className="space-y-2 font-mono text-xs tracking-wider">
              {BRAND.contact.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright & Meta Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] tracking-widest text-neutral-400">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. ALL RIGHTS RESERVED.
          </p>
          <p className="text-neutral-400">
            ENGINEERING THE NEXT CHALLENGE // EST. C&C
          </p>
        </div>
      </div>
    </footer>
  );
}
