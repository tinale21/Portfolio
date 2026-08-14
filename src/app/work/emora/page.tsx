import { TryTheseProjects } from "@/components/case-studies/TryTheseProjects";
import { EmoraDesignPrinciples } from "@/components/case-studies/emora/EmoraDesignPrinciples";
import { EmoraFinalDesignImplementation } from "@/components/case-studies/emora/EmoraFinalDesignImplementation";
import { EmoraHero } from "@/components/case-studies/emora/EmoraHero";
import { EmoraKeyContribution } from "@/components/case-studies/emora/EmoraKeyContribution";
import { EmoraKeyFindings } from "@/components/case-studies/emora/EmoraKeyFindings";
import { EmoraProjectOverview } from "@/components/case-studies/emora/EmoraProjectOverview";
import { EmoraResearchMethod } from "@/components/case-studies/emora/EmoraResearchMethod";
import { EmoraTakeaway } from "@/components/case-studies/emora/EmoraTakeaway";

export default function EmoraCaseStudy() {
  return (
    <main>
      <EmoraHero />
      <EmoraProjectOverview />
      <EmoraKeyContribution />
      <EmoraResearchMethod />
      <EmoraKeyFindings />
      <EmoraDesignPrinciples />
      <EmoraFinalDesignImplementation />
      <EmoraTakeaway />
      <TryTheseProjects currentSlug="emora" />
    </main>
  );
}
