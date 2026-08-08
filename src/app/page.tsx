import { ConnectSection } from "@/components/connect/ConnectSection";
import { ExperiencesSection } from "@/components/experiences/ExperiencesSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { ClientLogosSection } from "@/components/logos/ClientLogosSection";
import { PhilosophySection } from "@/components/philosophy/PhilosophySection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <PhilosophySection />
      <ConnectSection />
      <ExperiencesSection />
      <ClientLogosSection />
    </main>
  );
}
