import { TryTheseProjects } from "@/components/case-studies/TryTheseProjects";
import { FramerRedesignBeforeAfter } from "@/components/case-studies/framer-redesign/FramerRedesignBeforeAfter";
import { FramerRedesignExplorationIterations } from "@/components/case-studies/framer-redesign/FramerRedesignExplorationIterations";
import { FramerRedesignFinalDesign } from "@/components/case-studies/framer-redesign/FramerRedesignFinalDesign";
import { FramerRedesignHero } from "@/components/case-studies/framer-redesign/FramerRedesignHero";
import { FramerRedesignKeyContribution } from "@/components/case-studies/framer-redesign/FramerRedesignKeyContribution";
import { FramerRedesignKeyFindings } from "@/components/case-studies/framer-redesign/FramerRedesignKeyFindings";
import { FramerRedesignProjectOverview } from "@/components/case-studies/framer-redesign/FramerRedesignProjectOverview";
import { FramerRedesignResearchMethod } from "@/components/case-studies/framer-redesign/FramerRedesignResearchMethod";
import { FramerRedesignTakeaway } from "@/components/case-studies/framer-redesign/FramerRedesignTakeaway";

export default function FramerRedesignCaseStudy() {
  return (
    <main>
      <FramerRedesignHero />
      <FramerRedesignProjectOverview />
      <FramerRedesignKeyContribution />
      <FramerRedesignResearchMethod />
      <FramerRedesignKeyFindings />
      <FramerRedesignExplorationIterations />
      <FramerRedesignBeforeAfter />
      <FramerRedesignFinalDesign />
      <FramerRedesignTakeaway />
      <TryTheseProjects currentSlug="framer-redesign" />
    </main>
  );
}
