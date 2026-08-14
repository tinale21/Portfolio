import Image from "next/image";
import humanCenteredIcon from "@/assets/case-studies/emora/icons/human-centered.svg";
import guidedLearningIcon from "@/assets/case-studies/emora/icons/guided-learning.svg";
import connectedDevicesIcon from "@/assets/case-studies/emora/icons/connected-devices.svg";
import dataPrivacyIcon from "@/assets/case-studies/emora/icons/data-privacy.svg";

// New section format (no prior AIG/Wayve section uses this layout), so
// most values below are approximated from the reference screenshot
// (Screenshot 2026-08-13 at 7.25.54 PM.png, color-sampled and pixel-
// measured directly rather than eyeballed) and checked via rendered
// screenshot comparison, same approach used for other un-redlined new
// formats (How Wayve Scales) in this codebase.
//
// Per direct instruction, only the drop shadow is a deliberate reuse
// from Key Findings (EmoraKeyFindings.tsx): the same tighter, reworked
// shadow (0px 4px 10px -4px rgba(0,0,0,0.15)) rather than a literal
// Figma value, plus the same white card / 10px radius / 2px solid
// #F9FAFB border treatment that shadow was originally tuned against.
//
// Colors sampled directly from the reference screenshot (darkest pixel
// in each element's own region, not eyeballed): number "01"-"04" is
// #7F7F7F (not Key Findings' blue #5465DF — a deliberately different
// treatment for this new format), body text is pure black, eyebrow is
// #717682 (effectively the same #707682 used everywhere else, within
// screenshot compression/rounding). Icon badges are used as complete,
// self-contained SVGs (each already 65x65 with its own 10px-rounded
// #ABD1D1 background baked in) rather than re-implemented as a
// separate icon + wrapper div.
//
// Both number and body text measured at the same ~16-17px glyph
// height as the page's other established 16px (text-base) elements
// (the eyebrow above it, Key Findings' own reduced 16px number/body) —
// used text-base for both here too, distinguished by color/weight
// instead of size.
const PRINCIPLES = [
  {
    icon: humanCenteredIcon,
    text: "Technology should support children without drawing attention or interrupting conversations.",
  },
  {
    icon: guidedLearningIcon,
    text: "Real-world guidance should be reinforced with simple, interactive lessons children can practice over time.",
  },
  {
    icon: connectedDevicesIcon,
    text: "Children and parents each need different tools, but they should work together as one connected experience.",
  },
  {
    icon: dataPrivacyIcon,
    text: "Sensitive emotional data should be handled responsibly and transparently to build confidence with families.",
  },
];

export function EmoraDesignPrinciples() {
  return (
    <section data-nav-theme="light" className="bg-white pt-16 pb-16">
      <p className="px-5 font-sans text-base text-[#707682] sm:px-8 lg:px-[68px]">
        Our Design Principles
      </p>

      <div className="mt-8 flex flex-col gap-8 px-5 sm:flex-row sm:gap-6 sm:px-8 lg:px-[68px]">
        {PRINCIPLES.map((item, i) => (
          <div
            key={item.text}
            className="flex w-full flex-1 flex-col items-start gap-6 rounded-[10px] border-2 border-[#F9FAFB] bg-white px-10 pt-10 pb-20 shadow-[0px_4px_10px_-4px_rgba(0,0,0,0.15)]"
          >
            <Image src={item.icon} alt="" className="h-16 w-16" />
            <div className="flex flex-col gap-3">
              <p className="font-sans text-base font-normal text-[#7F7F7F]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="font-sans text-base font-normal text-black">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
