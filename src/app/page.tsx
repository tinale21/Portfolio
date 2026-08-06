import { HeroSection } from "@/components/hero/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      {/* TEMPORARY placeholder so there's scroll room to test the Hero's
          scroll animation — remove once the next real section is built.
          data-nav-theme="light" marks this as a light-background section
          for NavBar's color-scheme detection; every real section should
          carry the same attribute ("dark" or "light") once built. */}
      <div data-nav-theme="light" className="h-[150vh] bg-white" />
    </main>
  );
}
