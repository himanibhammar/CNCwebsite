"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <>
      {/* ── LOGO — fixed top-left, outside the pill ─────────────────── */}
      <Link
        href="/"
        aria-label={BRAND.name}
        className="fixed top-4 md:top-6 left-4 md:left-8 z-50 flex items-center gap-3 group pointer-events-auto"
      >
      
        <div className="hidden sm:flex flex-col leading-tight">
          
          <span className="text-[15px] font-mono tracking-[0.18em] text-neutral-500 uppercase">
            Challenges &amp; Championships
          </span>
        </div>
      </Link>

      {/* ── PILL NAV — centered at top ───────────────────────────────── */}
      <header
        className="fixed top-5 md:top-7 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        aria-label="Main Navigation"
      >
        <nav
          className={clsx(
            "pointer-events-auto flex items-center gap-1 px-4 py-2 rounded-full transition-all duration-500",
            "bg-[#07090e]/75 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
            scrolled && "border-white/[0.14] bg-[#07090e]/90 shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
          )}
        >
          {/* ABOUT — page route */}
          <Link
            href="/about"
            className={clsx(
              "relative px-5 py-1.5 text-[11px] font-mono tracking-[0.22em] uppercase rounded-full transition-all duration-300",
              pathname === "/about"
                ? "text-white bg-white/[0.09] font-semibold"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            About
            {pathname === "/about" && (
              <span
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"
                aria-hidden="true"
              />
            )}
          </Link>

          {/* EVENTS — scrolls to flagship */}
          <button
            type="button"
            onClick={() => scrollTo("flagship")}
            className="px-5 py-1.5 text-[11px] font-mono tracking-[0.22em] uppercase rounded-full transition-all duration-300 text-neutral-400 hover:text-white hover:bg-white/[0.04] cursor-pointer"
          >
            Events
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-1 p-1.5 text-neutral-300 hover:text-white focus:outline-none rounded-full"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </nav>
      </header>

      {/* ── MOBILE OVERLAY ───────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-[#07090e]/97 backdrop-blur-2xl flex flex-col justify-between px-8 py-28"
          role="dialog"
          aria-modal="true"
        >
          <div className="space-y-2">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-8">
              Navigation
            </p>

            {/* About */}
            <div className="border-b border-white/[0.06] pb-5">
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "block font-sans text-4xl font-light tracking-tight transition-colors",
                  pathname === "/about" ? "text-white" : "text-neutral-400 hover:text-white"
                )}
              >
                About
              </Link>
            </div>

            {/* Events */}
            <div className="border-b border-white/[0.06] pb-5">
              <button
                type="button"
                onClick={() => scrollTo("flagship")}
                className="block w-full text-left font-sans text-4xl font-light tracking-tight text-neutral-400 hover:text-white transition-colors"
              >
                Events
              </button>
            </div>
          </div>

          {/* Branding footer inside overlay */}
          <div className="flex items-center gap-3 pt-8 border-t border-white/[0.08]">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/images/logo.png"
                alt={BRAND.logo.alt}
                fill
                className="object-contain opacity-80"
              />
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase">
                {BRAND.shortName}
              </p>
              <p className="font-mono text-[9px] tracking-widest text-neutral-600 uppercase">
                {BRAND.tagline}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
