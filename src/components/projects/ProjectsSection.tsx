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
      // Now that Hero's pinned block is the (much taller) fade-in intro
      // paragraph rather than the old single-line headline, this pull is
      // derived differently than the −350px value the comment above used
      // to describe: since this section always moves at a fixed 1:1 rate
      // with scroll (pull only shifts its *starting* document position,
      // never its rate), and Hero's pin only holds for exactly
      // INTRO_HOLD's worth of scroll (see that constant in
      // HeroSection.tsx), the pull has to place this section just off the
      // bottom edge of the viewport at the *start* of that pinned window
      // and let it travel the rest of the way to fully covering (~64px
      // from the top) by the window's *end* — otherwise either the sweep
      // visibly cuts off Hero's text before it can be read (pull too
      // large, arrives too early) or never finishes covering before the
      // pin releases, freezing at a permanent partial overlap (pull too
      // small) — both were real, confirmed-via-Puppeteer regressions hit
      // while tuning this. Re-derived alongside INTRO_HOLD each time that
      // constant changes; a 200px increase to INTRO_HOLD (see its own
      // comment) is paired with reducing this pull by the same 200px, so
      // the added time becomes a pause *before* the sweep starts rather
      // than the sweep just starting 200px later after already finishing.
      // Stays well under this section's own natural content height
      // (~962px measured), so it can't bleed into whatever comes after it.
      className="relative -mt-[838px] bg-white px-5 pt-[45px] pb-10 sm:px-8 sm:pt-[61px] sm:pb-14 lg:px-[68px] lg:pt-[77px] lg:pb-16"
    >
      {/* Per direct instruction, replaces the old "Selected projects,
          thoughtfully curated." title with just "My Work" — the h2's size
          was originally the same as Experiences'/Education's (text-[26px])
          but bumped up per direct follow-up feedback wanting it a bit
          bigger, a deliberate divergence from those two now rather than
          shared styling. The descriptor below it was removed in that same
          pass, then restored per direct follow-up feedback — same text and
          spacing (mt-2) as before the rename. */}
      <h2 className="font-serif text-[32px] font-bold text-black">My Work</h2>
      <p className="mt-2 max-w-[746px] font-sans text-lg font-extralight text-[#6D6B6B]">
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
