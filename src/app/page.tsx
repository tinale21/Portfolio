import { HeroSection } from "@/components/hero/HeroSection";
import { ClientLogosSection } from "@/components/logos/ClientLogosSection";
import { PhilosophySection } from "@/components/philosophy/PhilosophySection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <ClientLogosSection />
      <PhilosophySection />
    </main>
  );
}
