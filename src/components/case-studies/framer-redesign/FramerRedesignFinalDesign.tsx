// Copy transcribed directly from the reference screenshot (source:
// Screenshot 2026-08-15 at 12.04.15 AM.png). Per direct instruction
// ("add the final design copy"), reuses AIG's/Emora's Final Design
// intro rule and spacing exactly (AigFinalDesignImplementation.tsx /
// EmoraFinalDesignImplementation.tsx): row title Inter 15px/400
// #707682, intro description Inter 15px/500 #000, right-column intro
// paragraphs 15px/500 #6E7681, 512px left column, 597px right column
// (ml-auto against the standard lg:px-[68px] padding), pt-44 top
// padding.
//
// Only the intro copy was provided this round — no sub-item videos or
// images yet, unlike AIG's/Emora's versions, which each pair this
// same intro block with a row of screen-by-screen video breakdowns
// underneath it. Built just the intro for now; the SCREENS-style rows
// can be added the same way once that content is provided, following
// this same file.
const INTRO = {
  description:
    "Our final redesign transforms Framer into a more approachable website builder that helps first-time users and designers build with confidence.",
  paragraphs: [
    "This project reimagines Framer's onboarding and editing experience for first-time users and designers transitioning from Figma.",
    "Guided by research and usability testing, the redesign introduces guided onboarding, contextual learning, real-time error checking, AI-powered design suggestions, and embedded resources that help users learn as they build. The result is a more approachable website-building experience with less friction and greater confidence.",
  ],
};

export function FramerRedesignFinalDesign() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-[122px] pb-16 sm:px-8 lg:px-[68px]">
      <p className="font-sans text-base text-[#707682]">Final Design</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="lg:w-[512px] lg:shrink-0">
          <p className="font-sans text-[15px] font-medium text-black">{INTRO.description}</p>
        </div>
        <div className="flex flex-col gap-4 lg:ml-auto lg:w-[597px]">
          {INTRO.paragraphs.map((paragraph, i) => (
            <p key={i} className="font-sans text-[15px] font-medium text-[#6E7681]">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
