import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Monumental display face for the hero headline.
 *
 * Self-hosted rather than pulled through `next/font/google`: the Google Fonts
 * fetch is not reachable from every build environment, and when it fails
 * next/font silently substitutes Arial, which quietly destroys the headline.
 * Shipping the subset with the repo makes the type deterministic offline.
 *
 * Anton by Vernon Adams, SIL Open Font License 1.1. Latin subset.
 */
const anton = localFont({
  src: "./fonts/Anton-Regular-latin.woff2",
  variable: "--font-anton",
  weight: "400",
  style: "normal",
  display: "swap",
  // Metric overrides matched to Arial so the fallback holds the same box and
  // the headline does not reflow when the real face arrives.
  adjustFontFallback: "Arial",
  fallback: ["Arial Narrow", "Haettenschweiler", "sans-serif"],
});

export const metadata: Metadata = {
  title: `${BRAND.name}`,
  description: BRAND.missionStatement,
  openGraph: {
    title: `${BRAND.name} (${BRAND.shortName})`,
    description: BRAND.missionStatement,
    siteName: BRAND.name,
    locale: "en_US",
    type: "website",
  },
};

/**
 * Paints the browser chrome black before the document renders, so there is no
 * light frame on load, reload or overscroll.
 */
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#05070b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased dark`}
      /* Inline so the void colour is in the very first byte of markup, ahead of
         any stylesheet. Nothing white is ever painted. */
      style={{ backgroundColor: "#05070b", colorScheme: "dark" }}
    >
      <body
        className="flex min-h-screen flex-col text-[#f2f4f8]"
        style={{ backgroundColor: "#05070b" }}
      >
        <SmoothScroll>
          <GrainOverlay />
          <Navbar />
          <div className="flex w-full flex-1 flex-col">{children}</div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
