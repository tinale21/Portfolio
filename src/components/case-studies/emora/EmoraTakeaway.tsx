// Structure and copy transcribed directly from the reference screenshot
// (source: Screenshot 2026-08-13 at 11.24.02 PM.png). Per direct
// instruction, reuses AIG's Takeaway text sizing, color, and spacing
// exactly (AigTakeaway.tsx): 15px/medium throughout, black left-column
// statement, #6E7681 right-column paragraphs at 597px width, same
// gap-8/gap-4 rhythm and 512px left-column width.
const TAKEAWAY = {
  description:
    "Designing with empathy means moving quickly without losing sight of the people you're designing for.",
  paragraphs: [
    "Working on Emora taught me how to balance the pace of a two-week startup sprint with the responsibility of designing for a sensitive topic like autism. Every design decision required thoughtful research, empathy, and collaboration to ensure the experience felt supportive, accessible, and respectful of children's unique needs. This project strengthened my ability to design under tight deadlines while creating solutions that put people first.",
    "It also reinforced the importance of listening to users and letting research guide every design decision. Most importantly, I learned that meaningful innovation comes from creating technology that empowers people without overshadowing their everyday experiences.",
  ],
};

export function EmoraTakeaway() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-16 pb-16 sm:px-8 lg:px-[68px]">
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
