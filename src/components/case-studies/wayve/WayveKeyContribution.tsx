import Image from "next/image";
import surveyIcon from "@/assets/case-studies/wayve/icons/survey.svg";
import personaIcon from "@/assets/case-studies/wayve/icons/persona.svg";
import uxDesignIcon from "@/assets/case-studies/wayve/icons/ux-design.svg";

// Per direct instruction, reuses the exact coloring, sizing, and
// spacing rules already established for the AIG Key Contribution
// section (AigKeyContribution.tsx) — same #F7F7F7 section background,
// same eyebrow color (#6C727D), same pt-[59px]/pb-[78px] section
// padding, same mt-[67px] eyebrow-to-row gap, same 64px icon size
// (the provided SVGs are 71x71, close enough to AIG's 72x72 source
// icons that the same scale-to-64px treatment applies identically),
// same 14px item text, same lg:px-[216px] row inset with
// sm:justify-between distributing the 3 items.
const ITEMS = [
  {
    icon: surveyIcon,
    text: "Contributed to primary and secondary research by conducting interviews and market research.",
  },
  {
    icon: personaIcon,
    text: "Created the Gen Z and Gen Alpha personas that guided design decisions throughout the project.",
  },
  {
    icon: uxDesignIcon,
    text: "Led the UX design of Wayve by defining user flows and designing the app experience.",
  },
];

export function WayveKeyContribution() {
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
