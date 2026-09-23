"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function CinematicFooter() {
  const handleEventsClick = (e: React.MouseEvent) => {
    e.preventDefault();

    document.getElementById("flagship")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer
      id="footer"
      className="
        relative
        w-full
        flex
        justify-center
        items-start
        px-4
        pt-10
        pb-24
        bg-[#07090e]
        overflow-hidden
      "
      aria-label="Site Footer"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ============================================================
          GLASS CARD
      ============================================================ */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-[1663px]
          min-h-[500px]
          bg-[rgba(255,255,255,0.07)]
          backdrop-blur-xl
          border
          border-white/10
          rounded-[32px]
          md:rounded-[38px]
          px-8
          sm:px-10
          md:px-14
          lg:px-16
          pt-8
          pb-6
          text-white
          overflow-hidden
          shadow-lg
        "
      >
        {/* ============================================================
            TOP RIGHT GLOW
        ============================================================ */}
        <div
          aria-hidden="true"
          className="
            absolute
            -right-32
            -top-40
            w-[700px]
            h-[350px]
            rounded-full
            pointer-events-none
          "
          style={{
            backgroundColor: "#131521",
            opacity: 0.35,
            filter: "blur(180px)",
          }}
        />

        {/* ============================================================
            BOTTOM LEFT GLOW
        ============================================================ */}
        <div
          aria-hidden="true"
          className="
            absolute
            -left-72
            bottom-0
            w-[600px]
            h-[350px]
            rounded-full
            pointer-events-none
          "
          style={{
            backgroundColor: "#21151a",
            opacity: 0.65,
            filter: "blur(180px)",
          }}
        />

        {/* ============================================================
            GIANT C&C WATERMARK
            Inside the glass card, behind the content
        ============================================================ */}
        <div
          aria-hidden="true"
          className="
            absolute
            left-1/2
            -translate-x-1/2
            -bottom-[85px]
            whitespace-nowrap
            pointer-events-none
            select-none
            z-0
          "
          style={{
            fontSize: "clamp(8rem, 16vw, 20rem)",
            fontFamily: "'Arial Black', Impact, sans-serif",
            fontWeight: 900,
            letterSpacing: "-0.07em",
            lineHeight: 0.7,

            color: "transparent",

            WebkitTextStroke: "1px rgba(255,255,255,0.055)",

            background:
              "linear-gradient(180deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.025) 70%, transparent 100%)",

            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          C&amp;C
        </div>

        {/* ============================================================
            TOP LOGOS
        ============================================================ */}
        <div
          className="
            relative
            z-10
            flex
            flex-col
            md:flex-row
            items-center
            md:items-start
            justify-between
            gap-8
          "
        >
          {/* LEFT — C&C LOGO */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative h-16 w-16">
              <Image
                src="/images/logo.png"
                alt="C&C Logo"
                fill
                priority
                className="
                  object-contain
                  opacity-90
                "
              />
            </div>

            <span
              className="
                mt-2
                font-mono
                text-[10px]
                tracking-[0.3em]
                text-white/40
                uppercase
              "
            >
              Challenges &amp; Championships
            </span>
          </div>

          {/* RIGHT — AARUUSH LOGO */}
          <div className="relative h-20 w-[300px]">
            <Image
              src="/image.png"
              alt="Aaruush Logo"
              fill
              priority
              className="
                object-contain
                object-center
                md:object-right
                opacity-95
              "
            />
          </div>
        </div>

        {/* ============================================================
            MAIN CONTENT
            Contact + Mail centered as a symmetrical group
        ============================================================ */}
        <div
          className="
            relative
            z-10
            mt-12
            flex
            justify-center
            items-start
            gap-16
            md:gap-24
            lg:gap-32
          "
        >
          {/* ==========================================================
              CONTACT US
          ========================================================== */}
          <div
            className="
              w-[320px]
              flex
              flex-col
              items-center
              text-center
            "
          >
            <h3
              className="
                mb-5
                font-bold
                leading-none
              "
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                color: "#FFFFFF",
              }}
            >
              Contact us
            </h3>

            <div className="space-y-2">
              {[
                {
                  name: "Himani Bhammar",
                  phone: "+91 7205258181",
                },
                {
                  name: "Rachit Sharma",
                  phone: "+91 78782 25188",
                },
              ].map(({ name, phone }) => (
                <p
                  key={name}
                  className="
                    whitespace-nowrap
                    leading-8
                  "
                  style={{
                    fontSize: "clamp(1rem, 1.5vw, 1.35rem)",
                    color: "#FFFFFF",
                    fontWeight: 300,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {name}:{" "}
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="
                      hover:underline
                      transition-all
                    "
                  >
                    {phone}
                  </a>
                </p>
              ))}
            </div>
          </div>

          {/* ==========================================================
              MAIL AT
          ========================================================== */}
          <div
            className="
              w-[400px]
              flex
              flex-col
              items-center
              text-center
            "
          >
            <h3
              className="
                mb-5
                font-bold
                leading-none
              "
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                color: "#FFFFFF",
              }}
            >
              Mail At
            </h3>

            <a
              href="mailto:challenges_hackathon@aaruush.org"
              className="
                whitespace-nowrap
                hover:text-blue-300
                transition-colors
              "
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.35rem)",
                color: "#FFFFFF",
                fontWeight: 300,
                letterSpacing: "-0.01em",
              }}
            >
              challenges_hackathon@aaruush.org
            </a>
            
            <a
              href="mailto:championships@aaruush.org"
              className="
                whitespace-nowrap
                hover:text-blue-300
                transition-colors
                mt-2
              "
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.35rem)",
                color: "#FFFFFF",
                fontWeight: 300,
                letterSpacing: "-0.01em",
              }}
            >
              championships@aaruush.org
            </a>

            {/* QUICK NAVIGATION */}
            <div
              className="
                flex
                gap-8
                mt-12
                font-mono
                text-[11px]
                uppercase
                tracking-[0.18em]
                text-white/40
              "
            >
              <Link
                href="/about"
                className="
                  hover:text-white
                  transition-colors
                "
              >
                About
              </Link>

              <a
                href="/#flagship"
                onClick={handleEventsClick}
                className="
                  hover:text-white
                  transition-colors
                  cursor-pointer
                "
              >
                Events
              </a>
            </div>
          </div>
        </div>

        {/* ============================================================
            BOTTOM DIVIDER
        ============================================================ */}
        <div
          className="
            absolute
            left-8
            right-8
            md:left-14
            md:right-14
            bottom-[68px]
            border-t
            border-white/[0.08]
          "
        />

        {/* ============================================================
            COPYRIGHT
        ============================================================ */}
        <div
          className="
            absolute
            left-8
            right-8
            md:left-14
            md:right-14
            bottom-5
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-3
            font-mono
            text-[10px]
            tracking-widest
            text-white/25
            uppercase
          "
        >
          <p>
            © {new Date().getFullYear()} Challenges &amp; Championships.
            All rights reserved.
          </p>

          <p>
            A platform by Aaruush, SRMIST
          </p>
        </div>
      </div>
    </footer>
  );
}