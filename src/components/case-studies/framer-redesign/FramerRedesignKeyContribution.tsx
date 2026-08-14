import Image from "next/image";
import vibeCodedIcon from "@/assets/case-studies/framer-redesign/icons/vibe-coded.svg";
import usabilityTestingIcon from "@/assets/case-studies/framer-redesign/icons/usability-testing.svg";
import secondaryResearchIcon from "@/assets/case-studies/framer-redesign/icons/secondary-research.svg";

// Per direct instruction, reuses the exact coloring, sizing, and
// spacing rules already established for the AIG Key Contribution
// section (AigKeyContribution.tsx) — same #F7F7F7 section background,
// same eyebrow color (#6C727D), same pt-[59px]/pb-[78px] section
// padding, same mt-[67px] eyebrow-to-row gap, same 64px icon size
// (the provided SVGs are 65x65, close enough to AIG's 72x72 source
// icons that the same scale-to-64px treatment applies identically),
// same 14px item text, same lg:px-[216px] row inset with
// sm:justify-between distributing the 3 items.
const ITEMS = [
  {
    icon: vibeCodedIcon,
    text: "Vibe coded the complete Framer redesign using Claude, creating a fully interactive prototype.",
  },
  {
    icon: usabilityTestingIcon,
    text: "Conducted moderated usability testing at SCAD User Test Fest to identify prototype improvements.",
  },
  {
    icon: secondaryResearchIcon,
    text: "Conducted secondary research to identify onboarding pain points and inform key design decisions.",
  },
];

export function FramerRedesignKeyContribution() {
  return (
    <section data-nav-theme="light" className="bg-[#F7F7F7] pt-[59px] pb-[78px]">
      <p className="px-5 font-sans text-base text-[#6C727D] sm:px-8 lg:px-[68px]">
        Key Contribution
      </p>

      <div className="mt-[67px] flex flex-col gap-8 px-5 sm:flex-row sm:justify-between sm:px-8 lg:px-[216px]">
        {ITEMS.map((item) => (
          <div
            key={item.text}
            className="flex w-full flex-col items-center gap-[31px] sm:w-[267px]"
          >
            <Image src={item.icon} alt="" className="h-[64px] w-[64px]" />
            <p className="self-stretch font-sans text-sm font-medium text-black">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
