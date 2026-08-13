// Structure and copy transcribed directly from the reference screenshot
// (source: Screenshot 2026-08-13 at 6.09.49 PM.png). Per direct
// instruction, reuses AIG's Takeaway text sizing, color, and spacing
// exactly (AigTakeaway.tsx): 15px/medium throughout, black left-column
// statement, #6E7681 right-column paragraphs at 597px width, same
// gap-8/gap-4 rhythm and 512px left-column width.
const TAKEAWAY = {
  description: "Great ideas aren't just designed. They're refined, validated, and built to grow.",
  paragraphs: [
    "The Wayve project taught me that successful product design extends beyond creating a great user experience. I learned how to evaluate ideas through both a user and business lens by considering scalability, long-term engagement, and sustainable revenue. Rather than choosing between our strongest concepts, Flowstate and Sonic Playroom, we continuously tested, challenged, and refined our ideas until they evolved into Wayve, a solution that balanced user needs with business goals.",
    "It reinforced that great design is an iterative process, and the strongest products are shaped through research, collaboration, and continuous refinement. Most importantly, it showed me that the best products succeed not only because they solve user problems, but because they are designed to evolve, adapt, and create lasting value over time.",
  ],
};

export function WayveTakeaway() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-36 pb-16 sm:px-8 lg:px-[68px]">
      <p className="font-sans text-base text-[#707682]">Takeaway</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="lg:w-[512px] lg:shrink-0">
          <p className="font-sans text-[15px] font-medium text-black">{TAKEAWAY.description}</p>
        </div>
        <div className="flex flex-col gap-4 lg:ml-auto lg:w-[597px]">
          {TAKEAWAY.paragraphs.map((paragraph, i) => (
            <p key={i} className="font-sans text-[15px] font-medium text-[#6E7681]">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
