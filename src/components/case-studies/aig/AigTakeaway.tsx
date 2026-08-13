// Structure and copy transcribed directly from the composite reference
// screenshot (source: Screenshot 2026-08-12 at 9.23.46 PM.png) — same
// text sizing rule reused from Visual Directions/Final Design
// Implementation (15px, no larger heading treatment) since no
// dev-mode redlines were provided for this section specifically. The
// right-column paragraphs are also matched to the same 597px width
// used for Final Design Implementation's videos, and recolored to
// #6E7681 (same as Final Design Implementation's own intro paragraphs
// and Project Overview's right column) per direct feedback, even
// though this section has no video of its own to size against.
const TAKEAWAY = {
  description:
    "Great design comes from collaboration, adaptability, and a willingness to embrace change.",
  paragraphs: [
    "This project was my first opportunity to work with a multidisciplinary team and my first client-based design experience. It taught me the importance of staying flexible as project requirements evolved and adapting my work to changing client needs. I also gained valuable experience presenting research findings, communicating design decisions, and showcasing interactive prototypes in a way that was clear and engaging for stakeholders.",
    "Collaborating with teammates from different disciplines showed me how diverse expertise leads to stronger design solutions. More than anything, this project reinforced that successful design is just as much about collaboration and communication as it is about creating meaningful user experiences.",
  ],
};

export function AigTakeaway() {
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
