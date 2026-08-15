// Copy transcribed directly from the reference screenshot. Structure,
// spacing, and typography reused directly from AigTakeaway.tsx's own
// rule (15px, no larger heading treatment; right-column paragraphs at
// 597px width, #6E7681) per direct instruction ("follow the same
// rules as aig's").
const TAKEAWAY = {
  description: "The best part of this project wasn't learning how to use AI. It was learning how to collaborate with it.",
  paragraphs: [
    "Developing our final interactive prototype with Claude expanded my understanding of AI-assisted development and its capabilities beyond simple code generation. I gained hands-on experience using AI to build interactive interfaces, rapidly iterate on ideas, and transform static designs into fully functional experiences.",
    "This project also showed me how AI can become a meaningful part of the design process, and it has since become an integral part of my workflow. More importantly, I learned that the best AI-generated solutions are driven by strong UX thinking, clear design direction, and intentional decision making.",
  ],
};

export function FramerRedesignTakeaway() {
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
