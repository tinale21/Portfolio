"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// "Data Points" section for the Wayve case study (after Secondary Research),
// styled after the reference (celinafang.framer.website/work/nectar): a field of
// faded sticky notes behind a bold centered count. Per direct instruction this
// uses the site's own type (Inter for both the callout and the notes) and the
// brand purple #4A25A9 for the number instead of the reference's orange. Each
// note is signed "Tina", per the provided source.
//
// Layout: a grid of SQUARE sticky notes (per direct instruction — real
// sticky-note shape). Because every cell is the same square, the spacing between
// notes is uniform in both axes, the center gap is genuinely empty cells (clean
// rectangle, no overlay), and the bottom lines up. The callout spans the 3 center
// cells of the middle row, surrounded by notes. Text was condensed to fit the
// squares (per direct instruction). A radial mask fades the field toward the
// edges. Everything is laid out at a fixed design width and transform-scaled to
// the container (same approach as the Secondary Research collage), so note
// sizing/text stay consistent at every breakpoint and nothing overflows
// horizontally.
const DESIGN_W = 1240;
const COL_COUNT = 7;

// The callout spans the center 3 columns of the middle (2nd) row. Those cells are
// left empty, so "500+ Data Points" sits on the white background surrounded by
// notes — no overlay needed.
const HOLE_COL = "3 / 6";
const HOLE_ROW = "2";

// Fades the note field out toward the edges; large solid center keeps the middle
// notes clearly visible.
const FADE = "radial-gradient(ellipse 66% 74% at 50% 50%, #000 36%, transparent 83%)";

// 24 notes, condensed to fit a square. Auto-flow fills the 7×4 grid around the
// callout; the single leftover cell lands in the faded bottom-right corner. The
// two "six-month retention" findings (same data point from the source) are kept
// far apart so they don't read as a repeat.
const NOTES = [
  "Participants listen to music throughout the day — studying, commuting, relaxing, and working.",
  "Sonic Playroom was the second most preferred concept, chosen by 13 participants (35.1%).",
  "Research into K-pop fandoms, Twitch, and Roblox concerts showed younger audiences engage with music socially.",
  "Music can shift participants' mood, energy, and focus, or motivate them to move.",
  "Growth potential favored Flowstate (48.6%), then Sonic Playroom (37.8%) and Vaulted (13.5%).",
  "Live music is multisensory: sound, visuals, movement, and crowd energy all shape the experience.",
  "Over six months, retention favored Flowstate (40.5%), then Sonic Playroom (37.8%) and Vaulted (21.6%).",
  "Music is discovered across social media, streaming, friends, games, and live shows.",
  "Vaulted was the least preferred concept overall, chosen by just 6 participants (16.2%).",
  "Participants valued music as both a personal experience and a way to connect with others.",
  "Cultural probes showed music triggers physical and emotional reactions — energy, relaxation, and focus.",
  "Flowstate was the top pick overall, selected by 18 of the 37 participants (48.6%).",
  "Younger audiences want to participate in music experiences, not just passively consume them.",
  "Vaulted was the least clear concept for 20 participants (54.1%), who found its value harder to grasp.",
  "An opportunity emerged to connect music discovery, self-expression, and physical engagement.",
  "Willingness to pay favored Flowstate (45.9%), then Sonic Playroom (43.2%) and Vaulted (10.8%).",
  "Music ties to specific memories, people, and places, giving songs meaning beyond the audio.",
  "Participants worried about Vaulted's mystery-box model — repetition, long-term interest, and value for price.",
  "These findings shaped merging Flowstate and Sonic Playroom into the final Wayve concept.",
  "34 of the 37 participants were Gen Z (91.9%); the rest were Gen Alpha or other groups.",
  "Participants understood Sonic Playroom but questioned how it would stand out from existing experiences.",
  "Participants liked Flowstate's focus on emotion and atmosphere, but wanted it explained more clearly.",
  "Flowstate and Sonic Playroom scored closely — appeal for both emotional and playful experiences.",
  "After six months, most participants still expected to be actively engaging with Flowstate (40.5%).",
];

function Note({ text }: { text: string }) {
  // aspect-square gives the real sticky-note shape; text at top, signature pinned
  // to the bottom, blank middle like a partly-filled note. overflow-hidden guards
  // against any note that runs long.
  return (
    <div className="flex aspect-square flex-col justify-between gap-2 overflow-hidden rounded-[2px] border border-[#EEEEEE] bg-white px-4 py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <p className="font-sans text-[11px] leading-[1.5] text-[#B4B4B4]">{text}</p>
      <span className="font-sans text-[10px] text-[#C8C8C8]">Tina</span>
    </div>
  );
}

function Scatter() {
  // Uniform square cells → spacing is even in both axes automatically, and the
  // empty center cells form a clean rectangular gap for the callout.
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${COL_COUNT}, minmax(0, 1fr))`,
        maskImage: FADE,
        WebkitMaskImage: FADE,
      }}
    >
      {/* Callout — count in brand purple, label in black, both in Inter. Occupies
          the empty center cells. */}
      <div
        className="z-10 flex flex-col items-center justify-center self-center text-center"
        style={{ gridColumn: HOLE_COL, gridRow: HOLE_ROW }}
      >
        <p className="font-sans font-bold leading-none text-[#4A25A9]" style={{ fontSize: "64px" }}>
          500+
        </p>
        <p className="mt-2.5 font-sans font-bold leading-none text-black" style={{ fontSize: "26px" }}>
          Data Points
        </p>
      </div>

      {NOTES.map((text, i) => (
        <Note key={i} text={text} />
      ))}
    </div>
  );
}

export function WayveDataPoints() {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [designH, setDesignH] = useState(0);

  // Scale = container width ÷ design width (never upscaled past 1:1).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth) setScale(Math.min(1, el.clientWidth / DESIGN_W));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Measure the natural (unscaled) height from the DOM. The box height is this ×
  // scale.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const update = () => setDesignH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section data-nav-theme="light" className="overflow-hidden bg-white pt-14 pb-24">
      <div className="px-5 sm:px-8 lg:px-[68px]">
        {/* Fixed-design field scaled to fit. The stage is absolutely positioned in
            an overflow-hidden box (height = measured design height × scale) so its
            DESIGN_W layout width can't cause page overflow; isolate scopes the
            callout's z-index under the sticky nav. */}
        <div
          ref={stageRef}
          className="relative isolate mx-auto max-w-[1240px] overflow-hidden"
          style={{ height: designH * scale }}
        >
          <motion.div
            ref={contentRef}
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: DESIGN_W, transform: `scale(${scale})` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Scatter />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
