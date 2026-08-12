"use client";

import { motion } from "framer-motion";

// Figma dev-mode inspect. Solid, directly-read values:
// - Divider rules under each number: 304x2px, #E4E4E4.
// - Heading ("Employee Interviews" etc.): Inter 20px/600, #000 — reduced
//   to 19px per direct feedback.
// - Description body: Inter 16px/500, #707682 — reduced to 15px per
//   direct feedback.
// - Number: Inter 128px/600, #000 — reduced to 127px per direct
//   feedback.
// - Gap between the divider and the heading: 15px (a 2-selection redline,
//   "divider + heading" group measuring 41px tall = 2 + 15 + ~24 line
//   height).
// - Gap between the heading and the description: 9px (same technique,
//   "heading + description" group measuring 90px tall = 24 + 9 + ~57 for
//   a 3-line description).
// - Grid: 2 columns. Column 1's divider sits 281px from the section's
//   left edge, column 2's sits 928px in, and column 2's divider has a
//   280px gap to the section's right edge (281 + 304 + 928's own math:
//   928 + 304 + 280 = 1512 exact) — i.e. ~280px symmetric side margins,
//   a much bigger inset than the page's usual 68px, similar to how Key
//   Contribution's icon row also used its own larger inset (216px).
//   Column gap derived from these: 1512 - 280 - 304 - 304 - 280 = 344px.
//
// Two things below are NOT directly confirmed by any redline in this
// batch of screenshots, since no screenshot captured them:
// - The gap between the number and the divider under it (used 24px, a
//   clean round guess consistent with the rest of this rhythm).
// - The vertical gap between the two rows (used 64px — there's a rough
//   320px divider-to-divider figure derivable from the two dividers'
//   raw canvas Y-coordinates, but that number depends on assumptions
//   about description line count and canvas-coordinate math that aren't
//   solid enough to hard-code as fact).
// - "weeks" next to Research Phase's "3" isn't in any redline either;
//   styled here as font-serif (matching this site's existing use of
//   serif for display/accent text elsewhere, e.g. About page traits)
//   at a size proportional to the 128px number, baseline-aligned.
//
// Motion: per direct feedback, the number itself isn't a plain fade —
// frame-by-frame analysis of the second reference recording (and the
// referenced Framer site) shows each DIGIT independently rolling
// through a short run of values on a vertical strip, with motion blur
// mid-roll, before landing on the real digit — a slot-machine/odometer
// effect, distinct from the surrounding heading/description, which
// still just slides up + un-blurs + fades in (the same technique
// already used for the About page's mission quote). Both are driven by
// one shared whileInView trigger via Framer Motion variants propagation
// (the digit strip has no initial/animate of its own, so it inherits
// "hidden"/"visible" from the item's motion.div ancestor), re-triggering
// every time the item re-enters view (once: false) so the roll replays
// on every scroll pass, matching the reference. Because each item's own
// viewport trigger fires independently, the bottom row naturally lags
// behind the top row without any explicit stagger delay.
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

// 5 digits on the strip: the target digit plus 4 "lead-in" digits
// counting backward (wrapping under 0), landing on the real value.
const DIGIT_ROLL_STEPS = 5;
// Percentages in a CSS transform are relative to the ELEMENT'S OWN box
// (the full 5-digit strip), not one digit's height — so moving up by
// (STEPS-1) digit-heights is (STEPS-1)/STEPS of the strip's own height,
// not (STEPS-1)*100%. Got this wrong the first time (used -400%, which
// is 5x too far and scrolled the whole strip off-screen).
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
    number: "2",
    heading: "Employee Interviews",
    description:
      "Interviewed current AIG employees to understand workflows, visitor interactions, and wayfinding needs.",
  },
  {
    number: "3",
    heading: "Personas & Journeys",
    description:
      "Developed personas and user journeys for a potential client, partner representative, and AIG employee.",
  },
  {
    number: "1",
    heading: "Site Visit",
    description:
      "Visited AIG's 9th Floor Innovation Hub to observe the physical environment and validate design decisions.",
  },
  {
    number: "3",
    suffix: "weeks",
    heading: "Research Phase",
    description:
      "Conducted research over three weeks through interviews, competitive analysis, and site observations.",
  },
];

export function AigResearchMethod() {
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
