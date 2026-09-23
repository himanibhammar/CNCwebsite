import { GallerySection } from "@/components/gallery/GallerySection";
import { CinematicFooter } from "@/components/ui/motion-footer";

export default function GalleryPage() {
  return (
    <main className="relative w-full min-h-screen bg-[#05070b] flex flex-col">
      {/* Offset for the fixed navbar */}
      <div className="h-20 shrink-0" />
      <div className="flex-1 w-full">
        <GallerySection />
      </div>
      <CinematicFooter />
    </main>
  );
}

