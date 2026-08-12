import { AigHero } from "@/components/case-studies/aig/AigHero";
import { AigKeyContribution } from "@/components/case-studies/aig/AigKeyContribution";
import { AigProjectOverview } from "@/components/case-studies/aig/AigProjectOverview";
import { AigResearchMethod } from "@/components/case-studies/aig/AigResearchMethod";

export default function AigCaseStudy() {
  return (
    <main>
      <AigHero />
      <AigProjectOverview />
      <AigKeyContribution />
      <AigResearchMethod />
    </main>
  );
}
