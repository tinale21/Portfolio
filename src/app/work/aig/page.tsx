import { AigExplorationIterations } from "@/components/case-studies/aig/AigExplorationIterations";
import { AigHero } from "@/components/case-studies/aig/AigHero";
import { AigKeyContribution } from "@/components/case-studies/aig/AigKeyContribution";
import { AigKeyFindings } from "@/components/case-studies/aig/AigKeyFindings";
import { AigProjectOverview } from "@/components/case-studies/aig/AigProjectOverview";
import { AigResearchMethod } from "@/components/case-studies/aig/AigResearchMethod";
import { AigVisualDirections } from "@/components/case-studies/aig/AigVisualDirections";

export default function AigCaseStudy() {
  return (
    <main>
      <AigHero />
      <AigProjectOverview />
      <AigKeyContribution />
      <AigResearchMethod />
      <AigKeyFindings />
      <AigVisualDirections />
      <AigExplorationIterations />
    </main>
  );
}
