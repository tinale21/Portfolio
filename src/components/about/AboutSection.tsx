import { ABOUT_ENTRIES } from "./about-data";
import { AboutEntry } from "./AboutEntry";
import { ExperiencesSection } from "@/components/experiences/ExperiencesSection";
import { ToolboxSection } from "@/components/toolbox/ToolboxSection";

// The trailing "My mission is to..." mission-quote block (and its
// sticky-pin-hold wrapper) was removed per direct instruction. The About page
// now ends with the trait entries followed by Experiences/Education and My
// Toolbox, which were moved here from the home page earlier.
export function AboutSection() {
  return (
    <>
      {ABOUT_ENTRIES.map((entry) => (
        <AboutEntry key={entry.traitLines.join(" ")} {...entry} />
      ))}

      <ExperiencesSection />
      <ToolboxSection />
    </>
  );
}
