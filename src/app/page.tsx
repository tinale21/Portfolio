import { ConnectSection } from "@/components/connect/ConnectSection";
import { ExperiencesSection } from "@/components/experiences/ExperiencesSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { PhilosophySection } from "@/components/philosophy/PhilosophySection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { ToolboxSection } from "@/components/toolbox/ToolboxSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <PhilosophySection />
      <ConnectSection />
      <ExperiencesSection />
      <ToolboxSection />
    </main>
  );
}
