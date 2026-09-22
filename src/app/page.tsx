import { HeroStage } from "@/components/hero/HeroStage";
import { FlagshipSection } from "@/components/flagship/FlagshipSection";
import { PhotoGallery } from "@/components/ui/gallery";

export default function HomePage() {
  return (
    <main className="relative w-full bg-[#07090e] overflow-hidden">
      <HeroStage />
      <FlagshipSection />
      <PhotoGallery />
    </main>
  );
}
