"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
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
// First pass used a one-shot whileInView fade/slide-up per pair. Per
// direct feedback ("the intended card stack motion isn't there... it
// should start stacked one behind another and then move out when users
// scroll down"), replaced that with genuine scroll-linked motion instead:
// re-watched the reference recording at denser frame intervals and
// confirmed it's not a fixed-duration reveal-on-enter — a card visibly
// duplicates/fans out progressively as you scroll, tracking scroll
// position continuously (reversible scrolling back up), the same
// "physically tied to scroll, not a timed animation" spirit as desktop's
// mechanism, just applied per-pair instead of to one giant pinned cluster
// (which — per the comment above — can't work at mobile's proportions).
// Each pair's own useScroll({target}) gives a local 0-1 progress as that
// specific pair moves through the viewport; the small photo animates from
// stacked almost directly behind the large one at progress 0 to its
// resting "peeking corner" offset at progress 1.
function PhilosophyPair({
  large,
  small,
  overlapSide,
}: {
  large: PhilosophyImageData;
  small: PhilosophyImageData;
  overlapSide: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  // "start end" -> "start center": progress 0 exactly when the pair's top
  // edge first touches the viewport's bottom edge (i.e. the instant
  // before any of it is visible at all), progress 1 once that same top
  // edge has scrolled up to the viewport's vertical center. First attempt
  // used ["start 0.9", "start 0.4"] instead — measured via Puppeteer that
  // it front-loaded most of the transition into the ~84px sliver right as
  // the pair started entering (barely visible), so by the time enough of
  // it was actually on screen to perceive, it read as already mostly (or
  // fully) spread — the "stacked" starting state was essentially never
  // seen. This range keeps the transition's visible-on-screen fraction
  // much higher throughout.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });

  // Small photo's resting position (its final, "spread" state) is set via
  // plain CSS below (-top-8, right-4/left-4) — these motion values are an
  // *additional* transform on top of that, animating from "pulled back in
  // toward the large photo's center, stacked behind it" (progress 0) to
  // "no extra offset, resting exactly at its designed peeking position"
  // (progress 1). Percent-based x/y so the magnitude scales with the
  // small photo's own rendered size rather than a fixed px guess.
  const smallX = useTransform(scrollYProgress, [0, 1], [overlapSide === "right" ? "-45%" : "45%", "0%"]);
  const smallY = useTransform(scrollYProgress, [0, 1], ["55%", "0%"]);
  const smallScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  // Large photo gets a much subtler settle (scale/opacity only, no
  // position shift) — reads as "the whole pair is unpacking," not just
  // the small photo moving independently in front of a static backdrop.
  const largeScale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const largeOpacity = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[320px]">
      <motion.div
        style={{ scale: largeScale, opacity: largeOpacity, aspectRatio: `${large.w} / ${large.h}` }}
        className="relative w-full overflow-hidden rounded-[10px]"
      >
        <Image src={large.src} alt={large.alt} fill sizes="80vw" className="object-cover" />
      </motion.div>
      {/* Overlapping smaller photo, peeking above one top corner of the
          large one — same "smaller rect sits in front of the larger one"
          relationship desktop's data comment describes, just simplified
          to a consistent corner (alternating left/right per pair below)
          instead of each pair's own bespoke desktop offset. */}
      <motion.div
        style={{
          x: smallX,
          y: smallY,
          scale: smallScale,
          aspectRatio: `${small.w} / ${small.h}`,
        }}
        className={`absolute -top-8 w-[48%] overflow-hidden rounded-[10px] ${
          overlapSide === "right" ? "right-4" : "left-4"
        }`}
      >
        <Image src={small.src} alt={small.alt} fill sizes="40vw" className="object-cover" />
      </motion.div>
    </div>
  );
}

const QUOTE_FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

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
            fit. Kept as a simple one-shot whileInView fade (unlike the
            pairs above) — the "card stack" feedback was specifically
            about the photos, not the quote. */}
        <motion.p
          variants={QUOTE_FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
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
