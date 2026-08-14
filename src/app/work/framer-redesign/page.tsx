import { FramerRedesignExplorationIterations } from "@/components/case-studies/framer-redesign/FramerRedesignExplorationIterations";
import { FramerRedesignHero } from "@/components/case-studies/framer-redesign/FramerRedesignHero";
import { FramerRedesignKeyContribution } from "@/components/case-studies/framer-redesign/FramerRedesignKeyContribution";
import { FramerRedesignKeyFindings } from "@/components/case-studies/framer-redesign/FramerRedesignKeyFindings";
import { FramerRedesignProjectOverview } from "@/components/case-studies/framer-redesign/FramerRedesignProjectOverview";
import { FramerRedesignResearchMethod } from "@/components/case-studies/framer-redesign/FramerRedesignResearchMethod";

export default function FramerRedesignCaseStudy() {
  return (
    <main>
      <FramerRedesignHero />
      <FramerRedesignProjectOverview />
      <FramerRedesignKeyContribution />
      <FramerRedesignResearchMethod />
      <FramerRedesignKeyFindings />
      <FramerRedesignExplorationIterations />
    </main>
  );
}
