import { EmoraDesignPrinciples } from "@/components/case-studies/emora/EmoraDesignPrinciples";
import { EmoraHero } from "@/components/case-studies/emora/EmoraHero";
import { EmoraKeyContribution } from "@/components/case-studies/emora/EmoraKeyContribution";
import { EmoraKeyFindings } from "@/components/case-studies/emora/EmoraKeyFindings";
import { EmoraProjectOverview } from "@/components/case-studies/emora/EmoraProjectOverview";
import { EmoraResearchMethod } from "@/components/case-studies/emora/EmoraResearchMethod";

export default function EmoraCaseStudy() {
  return (
    <main>
      <EmoraHero />
      <EmoraProjectOverview />
      <EmoraKeyContribution />
      <EmoraResearchMethod />
      <EmoraKeyFindings />
      <EmoraDesignPrinciples />
    </main>
  );
}
