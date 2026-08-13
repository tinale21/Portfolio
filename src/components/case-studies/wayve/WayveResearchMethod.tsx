"use client";

import { motion } from "framer-motion";

// Per direct instruction, reuses the exact coloring, sizing, spacing,
// and motion already established for the AIG Research Method section
// (AigResearchMethod.tsx) — same divider (304x2px, #E4E4E4), same
// heading (19px/600/#000) and description (15px/500/#707682)
// typography, same number size (127px/600/#000), same 15px
// divider-to-heading and 9px heading-to-description gaps, same 2-
// column grid with lg:px-[280px]/lg:gap-x-[344px], same pt-[59px]/
// pb-[78px] section padding and mt-[67px] eyebrow-to-grid gap.
//
// Motion is copied verbatim, not just visually matched: the same
// RollingDigit component (each digit independently rolls through 5
// values on a vertical strip with mid-roll blur before landing) and
// the same container blur/slide/fade-in (whileInView, once: false),
// both driven by one shared trigger via Framer Motion variants
// propagation, so the digit roll and the surrounding fade stay in
// sync exactly like AIG's version. "220+" needs no special handling —
// RollingDigit already passes non-digit characters (here, "+") through
// as a plain, non-rolling span, the same way AIG's "weeks" suffix is
// handled as a separate field for a differently-styled unit.
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const DIGIT_ROLL_STEPS = 5;
const DIGIT_VARIANTS = {
  hidden: { y: "0%" },
  visible: {
    y: `-${((DIGIT_ROLL_STEPS - 1) / DIGIT_ROLL_STEPS) * 100}%`,
    filter: ["blur(0px)", "blur(10px)", "blur(0px)"],
  },
};

function RollingDigit({ digit }: { digit: string }) {
  if (!/^[0-9]$/.test(digit)) {
    return <span>{digit}</span>;
  }
  const target = Number(digit);
  const sequence = Array.from({ length: DIGIT_ROLL_STEPS }, (_, i) => {
    const stepsBack = DIGIT_ROLL_STEPS - 1 - i;
    return ((target - stepsBack) % 10 + 10) % 10;
  });

  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-top">
      <motion.span
        variants={DIGIT_VARIANTS}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="rolling-digit-strip flex flex-col"
      >
        {sequence.map((d, i) => (
          <span key={i} className="h-[1em] leading-none">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

const ITEMS = [
  {
    number: "220+",
    heading: "Survey Conducted",
    description:
      "Collected insights from Gen Z, Gen Alpha, and Gen Alpha parents to understand music engagement.",
  },
  {
    number: "3",
    heading: "Concept Directions",
    description:
      "Developed and explored physical, digital, and hybrid concepts before refining the final Wayve experience.",
  },
  {
    number: "2",
    heading: "Industry Mentors",
    description:
      "Collaborated with music industry mentors to validate and refine the project's direction.",
  },
  {
    number: "8",
    suffix: "week",
    heading: "Research & Design",
    description:
      "Spent 8 weeks conducting research, synthesizing insights, and iterating toward the final concept.",
  },
];

export function WayveResearchMethod() {
  return (
    <section data-nav-theme="light" className="bg-white pt-[59px] pb-[78px]">
      <p className="px-5 font-sans text-base text-[#6C727D] sm:px-8 lg:px-[68px]">
        Research Method
      </p>

      <div className="mt-[67px] grid grid-cols-1 gap-x-5 gap-y-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-x-[344px] lg:gap-y-16 lg:px-[280px]">
        {ITEMS.map((item) => (
          <motion.div
            key={item.heading}
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="flex items-baseline gap-2 font-sans text-black">
              <span className="flex text-[127px] leading-none font-semibold">
                {item.number.split("").map((ch, i) => (
                  <RollingDigit key={i} digit={ch} />
                ))}
              </span>
              {item.suffix && (
                <span className="font-serif text-[40px] leading-none font-normal">
                  {item.suffix}
                </span>
              )}
            </p>
            <div className="mt-6 h-[2px] w-[304px] max-w-full bg-[#E4E4E4]" />
            <p className="mt-[15px] font-sans text-[19px] font-semibold text-black">
              {item.heading}
            </p>
            <p className="mt-[9px] max-w-[305px] font-sans text-[15px] font-medium text-[#707682]">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
