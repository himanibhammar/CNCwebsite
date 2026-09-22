import { HeroStage } from "@/components/hero/HeroStage";
import { OurFlagship } from "@/components/flagship/OurFlagship";
import { FlagshipSection } from "@/components/flagship/FlagshipSection";
import { PhotoGallery } from "@/components/ui/gallery";

export default function HomePage() {
  return (
    <main className="relative w-full overflow-hidden bg-[#07090e]">
      {/* 01 / Cinematic brand introduction */}
      <HeroStage />

      {/* 02 / Transition into the flagship sequence */}
      <OurFlagship />

      {/* 03 / The four flagships */}
      <FlagshipSection />

      {/* 04 / Past events */}
      <PhotoGallery />
    </main>
  );
}
