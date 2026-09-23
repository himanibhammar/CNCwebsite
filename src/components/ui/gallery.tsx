"use client";

import { Ref, forwardRef, useState, useEffect, useRef } from "react";
import Image, { ImageProps } from "next/image";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

// ---- types ---------------------------------------------------------------

type Direction = "left" | "right";

// ---- helpers -------------------------------------------------------------

function getRandomNumberInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const MotionImage = motion(
  forwardRef(function MotionImageInner(
    props: ImageProps,
    ref: Ref<HTMLImageElement>
  ) {
    return <Image ref={ref} {...props} />;
  })
);

// ---- Photo ---------------------------------------------------------------

export const Photo = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    const randomRotation =
      getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1);
    setRotation(randomRotation);
  }, []);

  function handleMouse(event: {
    currentTarget: { getBoundingClientRect: () => DOMRect };
    clientX: number;
    clientY: number;
  }) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{
        scale: 1.1,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{ scale: 1.1, zIndex: 9999 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing"
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] border border-white/10">
        <MotionImage
          className={cn("rounded-2xl object-cover")}
          fill
          src={src}
          alt={alt}
          {...props}
          draggable={false}
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
};

// ---- PhotoGallery --------------------------------------------------------

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80";

const PAST_EVENTS = [
  { id: 1, order: 0, x: "-320px", y: "15px", zIndex: 50, direction: "left" as Direction,  src: "/images/past-events/image.png", label: "Event 01" },
  { id: 2, order: 1, x: "-160px", y: "32px", zIndex: 40, direction: "left" as Direction,  src: "/images/past-events/image1.png", label: "Event 02" },
  { id: 3, order: 2, x: "0px",    y: "8px",  zIndex: 30, direction: "right" as Direction, src: "/images/past-events/image3.png", label: "Event 03" },
  { id: 4, order: 3, x: "160px",  y: "22px", zIndex: 20, direction: "right" as Direction, src: "/images/past-events/image4.png", label: "Event 04" },
  { id: 5, order: 4, x: "320px",  y: "44px", zIndex: 10, direction: "left" as Direction,  src: "/images/past-events/image5.png", label: "Event 05" },
];

export const PhotoGallery = ({
  animationDelay = 0.5,
}: {
  animationDelay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded]   = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Only start the entry animation when the section actually enters the
    // viewport. Using a timer was the root cause of Past Events animating
    // in while the Flagship pin was still active above it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const vt = setTimeout(() => setIsVisible(true), animationDelay * 1000);
          const at = setTimeout(() => setIsLoaded(true), (animationDelay + 0.4) * 1000);
          observer.disconnect();
          return () => { clearTimeout(vt); clearTimeout(at); };
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [animationDelay]);

  const containerVariants = {
    hidden:  { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const photoVariants = {
    hidden:  () => ({ x: 0, y: 0, rotate: 0, scale: 1 }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#07090e] py-28 px-5 overflow-hidden"
      aria-label="Past Events Gallery"
    >
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)",
          backgroundSize: "3rem 3rem",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%,#000 60%,transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%,#000 60%,transparent 100%)",
        }}
      />

      {/* Top separator line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-white/10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[120px] rounded-full blur-[80px] bg-blue-500/8 pointer-events-none" />

      {/* Section label */}
      <p className="text-center font-mono text-[10px] tracking-[0.35em] text-white/30 uppercase mb-4">
        Through The Lens
      </p>

      {/* Heading */}
      <h2
        className="text-center font-black uppercase leading-none mb-2 text-white flex justify-center items-center gap-4"
        style={{
          fontFamily: "'Arial Black', 'Franklin Gothic Heavy', Impact, sans-serif",
          fontSize: "clamp(2.8rem, 8vw, 7rem)",
          letterSpacing: "-0.025em",
        }}
      >
        Past
        <div className="h-[80px] sm:h-[120px] flex items-center w-[300px] sm:w-[450px]">
          <TextHoverEffect text="EVENTS" />
        </div>
      </h2>

      <p className="text-center font-light text-white/35 text-sm tracking-wide mt-4">
        Moments captured. Stories told.
      </p>

      {/* Draggable photo fan */}
      <div className="relative h-[350px] w-full flex items-center justify-center mt-12">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative h-[220px] w-[220px]">
              {[...PAST_EVENTS].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{ x: photo.x, y: photo.y, order: photo.order }}
                >
                  <Photo
                    width={220}
                    height={220}
                    src={photo.src}
                    alt={photo.label}
                    direction={photo.direction}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Drag hint */}
      <p className="text-center font-mono text-[9px] tracking-[0.3em] text-white/18 uppercase mt-6 mb-10">
        Drag the photos
      </p>

      {/* CTA */}
      <div className="flex justify-center">
        <Button href="/events" variant="editorial" size="lg" showArrow>
          View All Events
        </Button>
      </div>
    </section>
  );
};
