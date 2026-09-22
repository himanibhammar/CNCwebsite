"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "ABOUT", href: "/about" },
    { label: "EVENTS", href: "/#flagship" },
    { label: "GALLERY", href: "/gallery" },
    { label: "CONTACT", href: "/#footer" },
  ];

  return (
    <>
      <header
        className="fixed top-5 md:top-7 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none"
        aria-label="Main Navigation"
      >
        <nav
          className={clsx(
            "pointer-events-auto w-full max-w-4xl flex items-center justify-between px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-500",
            "bg-[#07090e]/75 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
            scrolled && "border-white/[0.14] bg-[#07090e]/85 shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-full pr-2"
            aria-label={`${BRAND.name} Home`}
          >
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/images/logo.png"
                alt={BRAND.logo.alt}
                fill
                sizes="32px"
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-semibold tracking-[0.2em] text-white group-hover:text-blue-400 transition-colors">
                {BRAND.shortName}
              </span>
              <span className="hidden sm:block text-[9px] font-mono tracking-widest text-neutral-400">
                CHALLENGES &amp; CHAMPIONSHIPS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "relative px-4 py-1.5 text-[11px] font-mono tracking-[0.22em] uppercase transition-all duration-300 rounded-full",
                    isActive
                      ? "text-white bg-white/[0.08] font-medium"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Explore + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/#flagship"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1 text-[10px] font-mono tracking-widest text-neutral-300 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-colors"
            >
              <span>EXPLORE</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-neutral-300 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-full"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-[#07090e]/95 backdrop-blur-2xl flex flex-col justify-between px-8 py-28 transition-all duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div className="space-y-3">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-6">
              NAVIGATION
            </p>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.href} className="border-b border-white/[0.06] pb-4">
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      "block font-sans text-3xl font-light tracking-tight transition-colors",
                      isActive ? "text-white" : "text-neutral-400 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 pt-8 border-t border-white/[0.08]">
            <p className="font-mono text-[11px] tracking-widest text-neutral-400">
              {BRAND.tagline}
            </p>
            <p className="font-mono text-[10px] tracking-widest text-neutral-500">
              CHALLENGES &amp; CHAMPIONSHIPS
            </p>
          </div>
        </div>
      )}
    </>
  );
}
