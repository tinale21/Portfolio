"use client";

import { useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import lowFiImage from "@/assets/case-studies/framer-redesign/exploration/low-fi.png";
import midFiImage from "@/assets/case-studies/framer-redesign/exploration/mid-fi.png";
import prototypeImage from "@/assets/case-studies/framer-redesign/exploration/prototype.png";

// Per direct instruction, reuses the exact spacing, text size, and
// motion already established for the AIG Exploration & Iterations
// section (AigExplorationIterations.tsx) — same 380px column width,
// same badge (41x40px, 5px radius, white Inria Serif 20px number),
// same heading (font-serif, 31px) and body (15px) typography, same
// centered fixed-width column layout (not stretched to page padding),
// same gap-8/gap-20 rhythm, same pt-[122px] section top padding, and
// the same motion end to end: per-block scroll progress bar
// (useScroll offset ["start 80%", "start 30%"]), blur/slide/fade-in on
// the whole block, and the image tilt (0deg -> ±5deg, mirrored by
// which side the image is on).
//
// The one deliberate departure, per the reference screenshot (color-
// sampled directly, not eyeballed): the badge and divider's active
// color is black (#000000, not AIG's indigo #5465DF), and the
// divider's inactive track is #BFBFBF (not AIG's lavender #D4D8F7) —
// matching this reference's own monochrome black/gray palette, the
// same kind of deliberate per-project color substitution already used
// for Wayve's own Exploration & Iterations (#4A25A9/#D2C8E9).
//
// Images: the three provided composite PNGs (1696x1024, identical
// dimensions to AIG's own three exploration exports) are used as-is.
// 3 steps, alternating image-left/text-right (steps 1 and 3) and
// text-left/image-right (step 2), matching the reference screenshot's
// own alternation.
//
// Per direct question about the "Prototype" (step 3) image: it
// includes a terminal window overlaid on the Framer-editor mockup
// showing an actual dev session (git push output, local file paths,
// GitHub username) — flagged this directly before using it, since it
// wasn't obviously intentional. Confirmed to use as provided.
const ACTIVE_COLOR = "#000000";
const INACTIVE_COLOR = "#BFBFBF";

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
    heading: "Low-fi Exploration",
    description:
      "Explored multiple concepts for onboarding, workflows, and feature organization before narrowing down the strongest design direction.",
    image: lowFiImage,
    imageFirst: true,
  },
  {
    number: "02",
    heading: "Mid-fi Iteration",
    description:
      "Validated concepts through usability testing and refined the experience into mid-fidelity screens based on user feedback.",
    image: midFiImage,
    imageFirst: false,
  },
  {
    number: "03",
    heading: "Prototype",
    description:
      "Transformed the final designs into a fully interactive prototype through vibe coding with Claude, bringing the redesigned experience to life.",
    image: prototypeImage,
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
      <Image src={image} alt={`${heading} screens`} className="h-auto w-full" />
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

export function FramerRedesignExplorationIterations() {
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
