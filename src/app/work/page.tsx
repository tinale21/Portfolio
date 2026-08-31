import { ProjectCard } from "@/components/projects/ProjectCard";
import { PROJECTS } from "@/components/projects/projects-data";
import { CyclingClientLogo } from "@/components/work/CyclingClientLogo";
import { NdaProjectCard } from "@/components/work/NdaProjectCard";
import { NDA_PROJECTS } from "@/components/work/nda-projects-data";

// The Work page's own grid order (Framer Redesign, Emora, Wayve, AIG) is
// the Figma prototype's order, not the homepage Selected Projects order —
// reordered here via slug lookup rather than reordering the shared
// PROJECTS array, so the homepage grid is unaffected.
const WORK_ORDER = ["framer-redesign", "emora", "wayve", "aig"];
const orderedProjects = WORK_ORDER.map(
  (slug) => PROJECTS.find((p) => p.slug === slug)!,
);

export default function Work() {
  return (
    <main data-nav-theme="light">
      {/* Figma dev-mode inspect: "My Work" is Inria Serif 36px/400 (was
          40px/700 — dev-mode showed a plain, non-bold weight). Weight
          bumped to font-bold per direct instruction, to match the "My
          Works" heading's weight on the homepage's Projects section,
          overriding the Figma spec above. "Previously at" is Inter 20px/200
          (Inter's Extra Light) at #6D6B6B, in a 746px-fixed-width box on
          the Figma canvas — reproduced as a max-width instead of a hard
          width, so it can still wrap/shrink below that on narrow screens
          rather than overflowing. */}
      <section className="px-5 pt-24 pb-8 sm:px-8 lg:px-[68px]">
        <h1 className="font-serif text-[36px] font-bold text-black">My Works</h1>
        <p className="mt-2 flex max-w-[746px] items-center gap-2 font-sans text-xl font-extralight text-[#6D6B6B]">
          Previously at <CyclingClientLogo />
        </p>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-[68px]">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          {orderedProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
          {NDA_PROJECTS.map((project) => (
            <NdaProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
