import { PROJECTS } from "./projects-data";
import { ProjectCard } from "./ProjectCard";

export function ProjectsSection() {
  return (
    <section
      data-nav-theme="light"
      // Pulled up to overlap Hero's tail end so this section's opaque
      // white background visibly rises over Hero's headline as the user
      // scrolls past it, rather than the headline just exiting on its own
      // first and this section simply arriving afterward — same "next
      // section scrolls in front of the previous one" effect built for
      // Connect -> Experiences.
      //
      // Two earlier attempts at this were wrong in different ways. The
      // first assumed Hero's headline moves continuously the whole time
      // (like this section does) and just needed the pull to "catch up"
      // to it — 450px, then 250px once recomputed. Both produced a
      // *frozen, non-progressing* overlap: since neither the headline nor
      // this section's edge was pinned, whatever partial overlap first
      // happened between them never changed no matter how far you kept
      // scrolling (confirmed via Puppeteer: stuck at exactly 26% coverage
      // regardless of scroll position) — not a transition, just a static
      // slice through the text. Fixed properly by pinning Hero's headline
      // itself (see HEADLINE_HOLD in HeroSection.tsx), which gives this
      // section's rising edge an actually-stationary target to sweep over.
      //
      // With the headline now pinned at a fixed screen position (measured
      // at 66px from viewport top while stuck), the pull only needs to be
      // large enough that this section's edge reaches that position no
      // later than the moment the pin releases — same derivation as
      // Connect's PULL_MARGIN: (stickyHeight − headlineY) + buffer =
      // (352 − 66) + buffer ≈ 350px. Stays well under this section's own
      // natural content height (~962px measured), so it can't bleed into
      // whatever comes after it.
      className="relative -mt-[350px] bg-white px-5 pt-[45px] pb-10 sm:px-8 sm:pt-[61px] sm:pb-14 lg:px-[68px] lg:pt-[77px] lg:pb-16"
    >
      <h2 className="font-serif text-[26px] font-bold text-black">
        Selected projects, thoughtfully curated.
      </h2>
      <p className="mt-2 max-w-[746px] font-sans text-base font-extralight text-[#6D6B6B]">
        A small collection of work exploring clarity, care, and
        human-centered design.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-9 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
