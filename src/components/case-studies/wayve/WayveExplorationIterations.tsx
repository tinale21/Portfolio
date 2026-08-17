"use client";

import { useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import researchDiscoveryImage from "@/assets/case-studies/wayve/exploration/research-discovery.png";
import conceptExplorationImage from "@/assets/case-studies/wayve/exploration/concept-exploration.png";
import validationRefinementImage from "@/assets/case-studies/wayve/exploration/validation-refinement.png";
import finalSolutionImage from "@/assets/case-studies/wayve/exploration/final-solution.png";

// Per direct instruction, reuses the exact spacing, text size, and
// font already established for the AIG Exploration & Iterations
// section (AigExplorationIterations.tsx) — same 380px column width,
// same badge (41x40px, 5px radius, white Inria Serif 20px number),
// same heading (font-serif, 31px) and body (15px) typography, same
// centered fixed-width column layout (not stretched to page padding),
// same gap-8/gap-20 rhythm, and the same motion end to end: per-block
// scroll progress bar, blur/slide/fade-in on the whole block, and the
// image tilt (0deg -> ±5deg, mirrored by which side the image is on).
//
// The one deliberate departure, per direct instruction: the divider's
// active/inactive colors are Wayve-specific — #4A25A9 active (also
// reused for the badge background, matching how AIG's badge shares
// its own active-bar color) and #D2C8E9 inactive, instead of AIG's
// #5465DF / #D4D8F7.
//
// Images: the four provided composite PNGs (1696x1024, identical
// aspect ratio to AIG's own three exploration exports) are used as-is,
// each already on its own pale background per the reference — same
// "use the flat export directly" approach as AIG's low-fi/mid-fi/
// high-fi images. 4 steps this time (not 3), alternating image-left/
// text-right (steps 1 and 3) and text-left/image-right (steps 2 and
// 4), matching the reference screenshot's own alternation, extended
// one step further in the same pattern.
//
// One further motion change beyond a straight AIG port, per direct
// feedback ("make it where the previous active state finishes when it
// goes to the next"): AIG's own useScroll offset (["start end", "end
// start"]) spans a block's *entire* viewport transit — enter at the
// bottom, exit at the top — which for a ~230px-tall track meant
// adjacent items' fill animations overlapped for roughly 800px of
// scroll (measured directly: step 2 was already 10-15% filled while
// step 1 was still only 35% done). Narrowed the trigger window twice
// (first to ["start start","start start"]-style top-edge-only timing,
// then to the current ["start 80%", "start 30%"]) until the measured
// overlap shrank to roughly 100px — step 1 reaches its own max right
// as step 2's bar starts climbing. True zero overlap isn't reachable
// with each block's trigger computed independently of its neighbors
// (the math requires the gap between item tops to exceed the viewport
// height, which isn't the case here), but this is a large, verified
// reduction from the original ~800px down to ~100px.
const ACTIVE_COLOR = "#4A25A9";
const INACTIVE_COLOR = "#D2C8E9";

// Matches Tailwind's `lg`, same query HeroSection.tsx already uses for
// its own viewport-dependent motion.
const DESKTOP_QUERY = "(min-width: 1024px)";

const STEPS: {
  number: string;
  heading: string;
  description: string;
  image: StaticImageData;
  imageFirst: boolean;
}[] = [
  {
    number: "01",
    heading: "Research & Discovery",
    description:
      "We conducted interviews, surveys, and secondary research to uncover how younger generations discover and engage with music.",
    image: researchDiscoveryImage,
    imageFirst: true,
  },
  {
    number: "02",
    heading: "Concept Exploration",
    description:
      "Using our research, we developed three concept directions: physical, digital, and hybrid.",
    image: conceptExplorationImage,
    imageFirst: false,
  },
  {
    number: "03",
    heading: "Validation & Refinement",
    description:
      "We refined each concept through mentor feedback and user testing to identify the strongest solution.",
    image: validationRefinementImage,
    imageFirst: true,
  },
  {
    number: "04",
    heading: "Final Solution",
    description:
      "The strongest ideas came together to create Wayve, an interactive platform that encourages deeper music engagement.",
    image: finalSolutionImage,
    imageFirst: false,
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
    offset: ["start 80%", "start 30%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [24, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 0.3], [8, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);
  const barHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Per direct feedback, the image tilt is desktop-only now (was
  // applying on mobile too). The scroll-linked tilt angle itself is
  // unchanged; it's just scaled to 0 below `lg` via a second motion
  // value driven by matchMedia rather than a plain React state flip —
  // useTransform's array-form input/output ranges are captured once
  // and don't reliably pick up a changed target on a later re-render,
  // so the two are combined as a multi-value transform instead (each
  // one independently reactive, combined via the multi-input overload).
  const desktopTiltScale = useMotionValue(0);
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const update = () => desktopTiltScale.set(mql.matches ? 1 : 0);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [desktopTiltScale]);
  const tiltDeg = useTransform(scrollYProgress, [0, 0.3], [0, imageFirst ? -5 : 5]);
  const rotate = useTransform([tiltDeg, desktopTiltScale], ([deg, scale]: number[]) => deg * scale);

  // Per direct feedback, mobile always shows image -> divider -> text,
  // regardless of `imageFirst` (which only controls left/right column
  // order once the columns sit side by side on desktop). Both blocks
  // render once each; `order-*` utilities reposition them per
  // breakpoint instead of swapping which block renders first.
  const imageBlock = (
    <motion.div
      className={`relative order-1 w-full max-w-[380px] shrink-0 overflow-hidden rounded-[10px] lg:w-[380px] ${imageFirst ? "lg:order-1" : "lg:order-3"}`}
      style={{ rotate }}
    >
      <Image src={image} alt={`${heading} exploration screens`} className="h-auto w-full" />
    </motion.div>
  );

  const textBlock = (
    <div
      className={`order-3 w-full max-w-[380px] shrink-0 lg:w-[380px] ${imageFirst ? "lg:order-3" : "lg:order-1"}`}
    >
      <p className="font-serif text-[31px] text-black">{heading}</p>
      <p className="mt-4 font-sans text-[15px] text-black">{description}</p>
    </div>
  );

  return (
    <motion.div ref={ref} style={{ opacity, y, filter }} className="flex w-full flex-col items-center gap-8">
      <div
        className="flex h-10 w-[41px] shrink-0 items-center justify-center rounded-[5px]"
        style={{ backgroundColor: ACTIVE_COLOR }}
      >
        <span className="font-serif text-xl text-white">{number}</span>
      </div>

      <div className="flex w-full flex-col items-center gap-8 lg:w-fit lg:flex-row lg:items-stretch lg:gap-8">
        {imageBlock}

        {/* Per direct feedback, this stays a vertical bar at every
            breakpoint (not a horizontal one on mobile, tried first) —
            same scroll progress, same fill direction, just a shorter
            fixed height when the columns stack instead of self-stretch
            filling the full row height like desktop. */}
        <div
          className="relative order-2 h-16 w-[2px] shrink-0 self-center lg:h-auto lg:self-stretch"
          style={{ backgroundColor: INACTIVE_COLOR }}
        >
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{ height: barHeight, backgroundColor: ACTIVE_COLOR }}
          />
        </div>

        {textBlock}
      </div>
    </motion.div>
  );
}

export function WayveExplorationIterations() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-[122px] pb-16 sm:px-8 lg:px-[68px]">
      <p className="font-sans text-base text-[#707682]">Exploration &amp; Iterations</p>

      <div className="mx-auto mt-8 flex w-full max-w-[380px] flex-col gap-20 lg:w-fit lg:max-w-none">
        {STEPS.map((step) => (
          <ExplorationStep key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}
