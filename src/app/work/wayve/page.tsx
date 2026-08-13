import { WayveHero } from "@/components/case-studies/wayve/WayveHero";
import { WayveKeyContribution } from "@/components/case-studies/wayve/WayveKeyContribution";
import { WayveKeyFindings } from "@/components/case-studies/wayve/WayveKeyFindings";
import { WayveProjectOverview } from "@/components/case-studies/wayve/WayveProjectOverview";
import { WayveResearchMethod } from "@/components/case-studies/wayve/WayveResearchMethod";

export default function WayveCaseStudy() {
  return (
    <main>
      <WayveHero />
      <WayveProjectOverview />
      <WayveKeyContribution />
      <WayveResearchMethod />
      <WayveKeyFindings />
    </main>
  );
}
