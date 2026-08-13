// Per direct instruction, reuses the exact coloring, sizing, spacing,
// and shadow already established for the AIG Key Findings section
// (AigKeyFindings.tsx) — same #707682 eyebrow, same card treatment
// (10px radius, 2px solid #F9FAFB border, white background, 11px
// number-to-text gap, 80px/80px vertical and 56px/55px horizontal
// padding), same flex-1 row stretching to the standard lg:px-[68px]
// page padding with a gap-10 between cards, same #5465DF number and
// black body text both at 16px, and the same reworked shadow
// (0px 4px 10px -4px rgba(0,0,0,0.15) — a tighter, crisper elevation
// than the literal Figma value, which read as "mushy" once rendered).
const FINDINGS = [
  {
    number: "01",
    text: "Bright visuals, audio cues, and constant feedback increase sensory overload.",
  },
  {
    number: "02",
    text: "Existing solutions distract children with screens/prompts during social interactions.",
  },
  {
    number: "03",
    text: "Families need confidence that emotional data is handled securely and responsibly.",
  },
];

export function EmoraKeyFindings() {
  return (
    <section data-nav-theme="light" className="bg-white pt-16 pb-16">
      <p className="px-5 font-sans text-base text-[#707682] sm:px-8 lg:px-[68px]">
        Key Findings
      </p>

      <div className="mt-8 flex flex-col gap-8 px-5 sm:flex-row sm:gap-10 sm:px-8 lg:px-[68px]">
        {FINDINGS.map((item) => (
          <div
            key={item.number}
            className="flex w-full flex-1 flex-col items-start gap-[11px] rounded-[10px] border-2 border-[#F9FAFB] bg-white pt-[80px] pr-[56px] pb-[80px] pl-[55px] shadow-[0px_4px_10px_-4px_rgba(0,0,0,0.15)]"
          >
            <p className="font-sans text-base font-semibold text-[#5465DF]">{item.number}</p>
            <p className="font-sans text-base font-normal text-black">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
