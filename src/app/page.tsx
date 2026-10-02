import { ConnectSection } from "@/components/connect/ConnectSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { PhilosophySection } from "@/components/philosophy/PhilosophySection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <ConnectSection />
      <PhilosophySection />
    </main>
  );
}
