"use client";

import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import lowFiImage from "@/assets/case-studies/aig/exploration/low-fi.png";
import midFiImage from "@/assets/case-studies/aig/exploration/mid-fi.png";
import highFiImage from "@/assets/case-studies/aig/exploration/high-fi.png";

// Figma dev-mode inspect. Solid, directly-read values:
// - Step badge ("01"/"02"/"03"): 41x40px, background #5465DF, 5px corner
//   radius, containing white Inria Serif 20px text, centered.
// - Step body text: Inter 16px/400, #000 — reduced to 15px per direct
//   feedback (the badge number stayed untouched, matching the same
//   distinction drawn for Research Method's numbers).
// - The divider between each step's image and text is a two-layer bar,
//   not a plain static line — a light-lavender track (#D4D8F7, matching
//   the image boxes' own background) at the block's full height, with
//   an indigo (#5465DF, matching the badge) "active" segment on top.
//   Missed this on the first pass entirely (no divider at all) — per
//   direct feedback, re-examined the reference recording and confirmed
//   it's a per-block scroll progress indicator: the active segment
//   grows from 0 to the block's full height as that block scrolls
//   through the viewport, using the same useScroll/useTransform
//   technique already established in this codebase (AboutEntry.tsx's
//   photo parallax) rather than a plain whileInView threshold trigger.
// - The step heading ("Low-fi"/"Mid-fi"/"High-fi") wasn't captured with
//   its own explicit font-size line in these redlines, but its glyph
//   bearing badges (32px/38px, matching the same "left bearing ≈
//   font-size" pattern seen everywhere else in this case study) point
//   to 32px — the same size as the Hero's own h1, so used here too,
//   font-serif, not italic, weight 400 — reduced to 31px per the same
//   "1px smaller" feedback as the body text above.
// - Each step's image is the flat composite PNG the user exported
//   directly (low-fi wireframes / mid-fi mockups / high-fi flow
//   diagrams, already on their own #D4D8F7 background) — used as-is,
//   at their native 1696:1024 aspect ratio (identical across all three
//   exports).
// - Per direct feedback ("add the image tilt like the reference
//   motion"), each image tilts as it scrolls into view, tied to the
//   same scroll progress as the fade/blur/y above — applied only to
//   the image, not the badge/divider/text. First pass had the direction
//   backwards (started tilted, straightened to 0deg); corrected to
//   start straight (0deg) and tilt in as it scrolls, went up to -7deg
//   then eased back to 5deg magnitude per "decrease the tilt a bit."
//   Also mirrors direction by side (-5deg for image-left steps 1/3,
//   +5deg for image-right step 2) per direct feedback — a left-side
//   image and a right-side image tilting the same way read as
//   inconsistent once seen rendered. The exact angle isn't measurable
//   from compressed reference video, so this is an approximated value
//   in the same spirit as this whole section's other inferred numbers.
//
// Layout: per direct feedback, this section doesn't need to stretch to
// the page's left/right padding like every other section in this case
// study — it stays as a centered, fixed-width column instead (matching
// the reference screenshots, where "Exploration & Iterations" sits at
// the standard page padding but the timeline itself floats centered
// with visible margin on both sides). Each step alternates image-left/
// text-right (steps 1 and 3) and text-left/image-right (step 2),
// matching the 3 composite reference images provided directly — this
// ordering isn't a redline value, it's just what those references show.
// The divider's own horizontal position stays fixed between the two
// (equal-width) columns regardless of which side has the image, so the
// badge above it — centered on the row — lines up with the divider on
// every step.
//
// Not directly confirmed by any redline in this batch: the exact gap
// between a badge and its content block, and between one step and the
// next. Used gap-8 (32px) and gap-20 (80px) respectively, matching the
// same rhythm already used for Visual Directions' row gap.
const COLUMN_WIDTH = 380;

const STEPS: {
  number: string;
  heading: string;
  description: string;
  image: StaticImageData;
  imageFirst: boolean;
}[] = [
  {
    number: "01",
    heading: "Low-fi",
    description:
      "AIG wanted combinations of the cityline motion from On the Horizon with the color palette of Future Forward. We then created low-fidelity wireframes to define the core flows.",
    image: lowFiImage,
    imageFirst: true,
  },
  {
    number: "02",
    heading: "Mid-fi",
    description:
      "We tested and iterated on layouts, navigation, and content hierarchy, refining the experience before applying the final visual design.",
    image: midFiImage,
    imageFirst: false,
  },
  {
    number: "03",
    heading: "High-fi",
    description:
      "We brought the experience to life by applying AIG's visual identity, polished UI, and interactive prototypes for the final client presentation.",
    image: highFiImage,
    imageFirst: true,
  },
];

function ExplorationStep({
  number,
  heading,
  description,
  image,
  imageFirst,
}: (typeof STEPS)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [24, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 0.3], [8, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);
  const rotate = useTransform(scrollYProgress, [0, 0.3], [0, imageFirst ? -5 : 5]);
  const barHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const imageBlock = (
    <motion.div
      className="relative shrink-0 overflow-hidden rounded-[10px]"
      style={{ width: COLUMN_WIDTH, rotate }}
    >
      <Image src={image} alt={`${heading} exploration screens`} className="h-auto w-full" />
    </motion.div>
  );

  const textBlock = (
    <div className="shrink-0" style={{ width: COLUMN_WIDTH }}>
      <p className="font-serif text-[31px] text-black">{heading}</p>
      <p className="mt-4 font-sans text-[15px] text-black">{description}</p>
    </div>
  );

  return (
    <motion.div ref={ref} style={{ opacity, y, filter }} className="flex flex-col items-center gap-8">
      <div className="flex h-10 w-[41px] shrink-0 items-center justify-center rounded-[5px] bg-[#5465DF]">
        <span className="font-serif text-xl text-white">{number}</span>
      </div>

      <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-8">
        {imageFirst ? imageBlock : textBlock}

        <div className="relative hidden w-[2px] shrink-0 self-stretch bg-[#D4D8F7] lg:block">
          <motion.div
            className="absolute inset-x-0 top-0 bg-[#5465DF]"
            style={{ height: barHeight }}
          />
        </div>

        {imageFirst ? textBlock : imageBlock}
      </div>
    </motion.div>
  );
}

export function AigExplorationIterations() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-16 pb-16 sm:px-8 lg:px-[68px]">
      <p className="font-sans text-base text-[#707682]">Exploration &amp; Iterations</p>

      <div className="mx-auto mt-8 flex w-fit flex-col gap-20">
        {STEPS.map((step) => (
          <ExplorationStep key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}
