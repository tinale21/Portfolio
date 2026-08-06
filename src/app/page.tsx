import { HeroSection } from "@/components/hero/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      {/* TEMPORARY placeholder so there's scroll room to test the Hero's
          scroll animation — remove once the next real section is built. */}
      <div className="h-[150vh] bg-white" />
    </main>
  );
}
