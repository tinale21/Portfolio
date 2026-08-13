import { TryTheseProjects } from "@/components/case-studies/TryTheseProjects";
import { WayveExplorationIterations } from "@/components/case-studies/wayve/WayveExplorationIterations";
import { WayveFinalDesignImplementation } from "@/components/case-studies/wayve/WayveFinalDesignImplementation";
import { WayveHero } from "@/components/case-studies/wayve/WayveHero";
import { WayveHowWayveScales } from "@/components/case-studies/wayve/WayveHowWayveScales";
import { WayveKeyContribution } from "@/components/case-studies/wayve/WayveKeyContribution";
import { WayveKeyFindings } from "@/components/case-studies/wayve/WayveKeyFindings";
import { WayveProjectOverview } from "@/components/case-studies/wayve/WayveProjectOverview";
import { WayveResearchMethod } from "@/components/case-studies/wayve/WayveResearchMethod";
import { WayveTakeaway } from "@/components/case-studies/wayve/WayveTakeaway";

export default function WayveCaseStudy() {
  return (
    <main>
      <WayveHero />
      <WayveProjectOverview />
      <WayveKeyContribution />
      <WayveResearchMethod />
      <WayveKeyFindings />
      <WayveExplorationIterations />
      <WayveFinalDesignImplementation />
      <WayveHowWayveScales />
      <WayveTakeaway />
      <TryTheseProjects currentSlug="wayve" />
    </main>
  );
}
