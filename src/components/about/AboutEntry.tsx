"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AboutEntry as AboutEntryData, SIGNATURE } from "./about-data";

// Cross-correlating the motion-reference video frame-by-frame (image ROI vs
// adjacent text ROI) mostly showed them moving at the identical rate — i.e.
// no clearly-provable parallax there. But per direct feedback the photos do
// read as drifting a little relative to the rest of each entry, so this
// adds a plain scroll-linked parallax (image translates within its own box
// as the entry crosses the viewport, text stays in normal flow) rather than
// static images — a common, tasteful default rather than an exact reference
// measurement.
//
// The image itself is scaled up 60% (see BASE_PHOTO_SCALE below) so
// translating it by the full +/-PARALLAX_RANGE_PX range never reveals
// empty space past its edges — needed at the smallest box size (now
// 205x288 on mobile, 8% bigger than the original 190x267), where this
// range is a bigger fraction of the box than at desktop's 335x470. 60px
// (120px total travel) read fine but per direct feedback wanted a bit
// more; 80px (160px total travel) needed the scale bumped from 1.4 to 1.6
// to keep covering the smallest box with margin to spare.
const PARALLAX_RANGE_PX = 80;
// Moved from a Tailwind scale-[1.6] class to a JS constant so a per-photo
// photoZoom multiplier (see about-data.ts) can combine with it — needed
// once object-position turned out to have no room to pan for photos whose
// source aspect ratio already nearly matches the 365:513 box.
const BASE_PHOTO_SCALE = 1.6;

// Renders each array entry on its own line via an explicit <br/> rather
// than letting the browser wrap — see the traitLines/taglineLines/
// captionLines comment in about-data.ts for why the line count needs to be
// forced rather than left to whatever width the responsive column has.
function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export function AboutEntry({
  traitLines,
  taglineLines,
  captionLines,
  image,
  alt,
  photoZoom = 1,
  photoPanX = 0,
}: AboutEntryData) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [PARALLAX_RANGE_PX, -PARALLAX_RANGE_PX]);
  const photoScale = BASE_PHOTO_SCALE * photoZoom;

  return (
    <section
      ref={sectionRef}
      data-nav-theme="light"
      className="flex min-h-screen items-center justify-center bg-white px-5 py-16 sm:px-8 lg:px-[68px]"
    >
      {/* Row is vertically centered as a group (name column / photo /
          tagline column all share the same center line) per direct
          feedback — an earlier pass top-aligned everything using offsets
          measured off Figma dev-mode (text starting 23-30% down the
          photo's height) to match the reference pixel-for-pixel, but the
          simpler centered composition was preferred once seen rendered. */}
      <div
        className="flex w-full max-w-[1100px] flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-16"
        style={{ transform: "translateY(-10px)" }}
      >
        <div className="flex flex-col items-center gap-2 text-center lg:w-[300px] lg:shrink-0 lg:items-end lg:gap-[44px] lg:text-right">
          <p
            className="relative z-10 font-serif text-black italic"
            style={{
              fontSize: "clamp(1.3rem, 2.2vw, 2.2rem)",
              fontWeight: 300,
              transform: "translate(75px, -53px)",
            }}
          >
            {SIGNATURE}
          </p>
          <p
            className="relative z-10 font-serif text-black italic"
            style={{
              fontSize: "clamp(2rem, 3.75vw, 3.25rem)",
              fontWeight: 400,
              transform: "translate(10px, -55px)",
            }}
          >
            <Lines lines={traitLines} />
          </p>
        </div>

        <div
          className="relative h-[288px] w-[195px] shrink-0 overflow-hidden sm:h-[364px] sm:w-[246px] lg:h-[471px] lg:w-[318px]"
        >
          <motion.div className="absolute inset-0" style={{ y }}>
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 318px, (min-width: 640px) 246px, 195px"
              className="object-cover"
              style={{ transform: `scale(${photoScale}) translateX(${photoPanX}%)` }}
            />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center lg:w-[300px] lg:shrink-0 lg:items-start lg:gap-[112px] lg:text-left">
          <p
            className="font-sans text-black"
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.5rem)", transform: "translateX(-35px)" }}
          >
            <Lines lines={taglineLines} />
          </p>
          <p
            className="font-sans text-black"
            style={{ fontSize: "clamp(0.85rem, 1vw, 0.95rem)", transform: "translate(-50px, 25px)" }}
          >
            <Lines lines={captionLines} />
          </p>
        </div>
      </div>
    </section>
  );
}
