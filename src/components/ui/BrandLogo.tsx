"use client";

import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { clsx } from "clsx";

interface BrandLogoProps {
  /** Display variant */
  variant?: "nav" | "hero" | "footer" | "card";
  /** Additional custom classes */
  className?: string;
  /** Priority loading flag */
  priority?: boolean;
}

/**
 * BrandLogo provides an abstraction layer over the official C&C artwork.
 * When a transparent PNG/SVG is supplied in the future, updating BRAND.logo
 * will cleanly update the entire site without component-level refactoring.
 */
export function BrandLogo({
  variant = "nav",
  className,
  priority = false,
}: BrandLogoProps) {
  const isLight = BRAND.logo.isLightBackground;

  // The wrapper owns the box and the image fills it, so the rendered aspect
  // ratio can never drift from the asset's. Fixing width while CSS constrains
  // height is what produced Next's aspect-ratio warning.
  const dimensions = {
    nav: { wrapper: "w-9", sizes: "36px" },
    card: { wrapper: "w-16", sizes: "64px" },
    footer: { wrapper: "w-22", sizes: "88px" },
    hero: { wrapper: "w-72 sm:w-96 md:w-[440px]", sizes: "(max-width: 768px) 18rem, 440px" },
  }[variant];

  return (
    <div
      className={clsx(
        "relative flex select-none items-center justify-center overflow-hidden",
        dimensions.wrapper,
        className
      )}
      style={{ aspectRatio: `${BRAND.logo.width} / ${BRAND.logo.height}` }}
    >
      <Image
        src={BRAND.logo.src}
        alt={BRAND.logo.alt}
        fill
        sizes={dimensions.sizes}
        priority={priority}
        className={clsx(
          "object-contain transition-all duration-300",
          // For light-background JPEG in a dark environment:
          // Invert + screen blend renders crisp, glowing white technical linework on dark backgrounds
          isLight && "invert mix-blend-screen brightness-125 contrast-125"
        )}
      />
    </div>
  );
}
