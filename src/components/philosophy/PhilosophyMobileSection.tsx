"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  PHILOSOPHY_IMAGES,
  PhilosophyImage as PhilosophyImageData,
  QUOTE_CLOSE,
  QUOTE_LINES,
  QUOTE_OPEN,
} from "./philosophy-data";

// Desktop's PhilosophySection pins the section via position:sticky and
// spreads all 8 images apart from a central cluster as the user scrolls —
// works because the composition's Figma frame (1512x982) is landscape, so
// scaling it to fit any viewport width keeps its *height* comfortably
// under one screen. On mobile that same frame scales down proportionally
// with the (much narrower) viewport width, squashing the whole thing into
// a short, cramped landscape strip — all 8 images tiny and packed
// sideways. That's the "stuck horizontally" problem being fixed here.
//
// Rebuilding this as a *tall* portrait composition and keeping the same
// pin-and-spread mechanic doesn't work either: the pin only works because
// the sticky box is currently shorter than the viewport it's stuck
// against. A portrait version tall enough to comfortably fit 8 images
// stacked vertically would exceed typical mobile viewport height,
// and a position:sticky element taller than its viewport can only ever
// show its top portion while stuck — the rest never becomes visible in a
// controlled way once un-pinned it would just scroll past all at once.
//
// Used instead: the reference recording's own actual pattern (images
// peeking in from the screen edges, plain vertical text flow in between,
// no pinning) — each of the 4 spatial pairs from PHILOSOPHY_IMAGES
// (indices 0-1, 2-3, 4-5, 6-7 — see that file's own z-ordering comment)
// rendered as a self-contained "large photo + smaller overlapping photo"
// block, stacked vertically with the quote in the middle, each fading/
// sliding in via whileInView as it scrolls into view — a standard,
// reliable mobile pattern instead of trying to force the desktop
// mechanism into a shape it doesn't fit.
const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const REVEAL_TRANSITION = { duration: 0.6, ease: "easeOut" as const };
const REVEAL_VIEWPORT = { once: true, margin: "-80px" };

function PhilosophyPair({
  large,
  small,
  overlapSide,
}: {
  large: PhilosophyImageData;
  small: PhilosophyImageData;
  overlapSide: "left" | "right";
}) {
  return (
    <motion.div
      variants={FADE_UP}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      transition={REVEAL_TRANSITION}
      className="relative mx-auto w-full max-w-[320px]"
    >
      <div
        className="relative w-full overflow-hidden rounded-[10px]"
        style={{ aspectRatio: `${large.w} / ${large.h}` }}
      >
        <Image src={large.src} alt={large.alt} fill sizes="80vw" className="object-cover" />
      </div>
      {/* Overlapping smaller photo, peeking above one top corner of the
          large one — same "smaller rect sits in front of the larger one"
          relationship desktop's data comment describes, just simplified
          to a consistent corner (alternating left/right per pair below)
          instead of each pair's own bespoke desktop offset. */}
      <div
        className={`absolute -top-8 w-[48%] overflow-hidden rounded-[10px] ${
          overlapSide === "right" ? "right-4" : "left-4"
        }`}
        style={{ aspectRatio: `${small.w} / ${small.h}` }}
      >
        <Image src={small.src} alt={small.alt} fill sizes="40vw" className="object-cover" />
      </div>
    </motion.div>
  );
}

export function PhilosophyMobileSection() {
  const pairs: { large: PhilosophyImageData; small: PhilosophyImageData; overlapSide: "left" | "right" }[] = [
    { large: PHILOSOPHY_IMAGES[0], small: PHILOSOPHY_IMAGES[1], overlapSide: "right" },
    { large: PHILOSOPHY_IMAGES[2], small: PHILOSOPHY_IMAGES[3], overlapSide: "left" },
    { large: PHILOSOPHY_IMAGES[4], small: PHILOSOPHY_IMAGES[5], overlapSide: "right" },
    { large: PHILOSOPHY_IMAGES[6], small: PHILOSOPHY_IMAGES[7], overlapSide: "left" },
  ];

  return (
    <div data-nav-theme="light" className="bg-white px-5 pt-24 pb-24 lg:hidden">
      <div className="flex flex-col items-center gap-20">
        <PhilosophyPair {...pairs[0]} />
        <PhilosophyPair {...pairs[1]} />

        {/* Quote copy/marks reused verbatim from philosophy-data.ts. The
            explicit 2-line split (QUOTE_LINES) was tuned for desktop's
            570px-wide box — joined with a space here instead so it wraps
            naturally at mobile's much narrower width, rather than forcing
            the same 2-line break at a size where it wasn't designed to
            fit. */}
        <motion.p
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          transition={REVEAL_TRANSITION}
          className="text-center font-serif text-black"
          style={{ fontSize: "clamp(1.5rem, 6vw, 2rem)", fontWeight: 700 }}
        >
          <span style={{ marginLeft: "-0.35em" }}>{QUOTE_OPEN}</span>
          {QUOTE_LINES.join(" ")}
          <span style={{ marginRight: "-0.35em" }}>{QUOTE_CLOSE}</span>
        </motion.p>

        <PhilosophyPair {...pairs[2]} />
        <PhilosophyPair {...pairs[3]} />
      </div>
    </div>
  );
}
