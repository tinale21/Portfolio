"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import beforeImage from "@/assets/case-studies/framer-redesign/before-after/before.jpg";
import afterImage from "@/assets/case-studies/framer-redesign/before-after/after.jpg";

// New section format (no prior AIG/Wayve/Emora section uses this
// layout), built from a live reference the user pulled up directly
// (nathanhines.design/project/stellar-menus-platform) rather than a
// Figma export — a classic drag-to-reveal before/after image compare
// slider: a laptop-bezel-style frame, a draggable handle with a
// left-right arrow glyph sitting on the divider line, and "Before"/
// "After" pill labels pinned to the bottom corners.
//
// Colors color-sampled directly from the reference screenshot
// (Screenshot 2026-08-14 at 10.54.07 PM.png), not eyeballed: bezel/
// handle #1D1D1D, label pill #363636.
//
// Motion: the provided recording shows the handle doing a brief
// settle-in wiggle on load (nudging a bit off-center each direction
// before resting at 50%) — an invitation to drag, not a literal
// autoplay sweep from 0-100%. Implemented with a single Framer Motion
// MotionValue (0-100, representing the divider's position as a
// percentage) driving both the "after" image's clip-path and the
// handle/divider's left offset, so drag updates and the mount-time
// wiggle animation share one source of truth instead of two competing
// position states. Drag uses Pointer Events (not mouse-only) so it
// works with touch as well.
//
// Before/After images: the two provided screenshots (Screenshot
// 2026-08-03 at 1.09.07 PM.png / ...1.10.27 PM.png, both 3456x1772,
// resized to 1800x923) are Framer's own old vs. redesigned editor UI.
//
// First pass stretched the frame full-width (lg:px-[68px], this
// project's default for most sections) at an approximated 1172:629
// box aspect, using object-cover — which cropped both images to fill
// that mismatched ratio. Per direct feedback ("make the before and
// after not cut off... centered rather than stretching it out to the
// left and right padding"), switched to the images' own exact native
// aspect (1800:923) for the frame, so it matches perfectly and no
// object-cover crop is needed, and capped the frame at a fixed
// max-width (mx-auto) instead of stretching to the page padding — a
// smaller, centered showcase like Exploration & Iterations' own
// fixed-width treatment, rather than every other section's default
// full-width stretch.
//
// Also swapped which image sits on which side of the clip: the first
// pass had the base (always-visible) layer as "before" and clipped
// "after" in from the left, which put After's content on the left
// side of the divider and Before's on the right — backwards relative
// to the Before/After labels themselves. Now the base layer is
// "after" (visible on the right, past the divider) and the clipped
// top layer is "before" (visible on the left, up to the divider),
// matching the labels' own left/right placement.
//
// Follow-up fix ("fix the black outline so it is even on all sides.
// the slider should also not go pass into the black outline"): both
// symptoms traced back to the same root cause. By default,
// `aspect-ratio` targets the *border box* (Tailwind's preflight sets
// box-sizing: border-box globally), so the 1800:923 ratio was being
// applied to the OUTER edge of the 16px border — meaning the actual
// content area inside the border (outer size minus 32px both ways)
// ended up at a slightly different ratio than the image itself,
// object-contain letterboxed to compensate, and that letterbox gap
// sat *inside* the visible border stripe, reading as an uneven
// border on two sides. Fixed by setting box-sizing: content-box on
// this element so aspect-ratio targets the content box instead — the
// border is now added uniformly *outside* an already-correctly-
// proportioned content area, with zero letterbox needed.
// Separately, the drag math used `getBoundingClientRect()` on this
// same element, which always reports the *border box* regardless of
// box-sizing — so position 0%/100% mapped to the outer (border)
// edges while the images/divider are positioned relative to the
// content box (CSS's own rule for what an absolutely-positioned
// child's containing block is, when the parent has a border).
// Subtracted BORDER_WIDTH from the measured rect on both sides so the
// draggable range maps exactly to the content area, matching where
// the divider is actually rendered — the handle can no longer be
// dragged into the border/bezel itself.
const FRAME_MAX_WIDTH = 1100;
const FRAME_ASPECT = "1800 / 923";
const BEZEL_COLOR = "#1D1D1D";
const LABEL_COLOR = "#363636";
const BORDER_WIDTH = 24;

function ArrowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 4L1 8L5 12M11 4L15 8L11 12M1.5 8H14.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FramerRedesignBeforeAfter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const position = useMotionValue(50);
  const clipPath = useTransform(position, (p) => `inset(0 ${100 - p}% 0 0)`);
  const leftPct = useTransform(position, (p) => `${p}%`);

  useEffect(() => {
    const controls = animate(position, [50, 34, 66, 50], {
      duration: 1.8,
      times: [0, 0.35, 0.7, 1],
      ease: "easeInOut",
      delay: 0.4,
    });
    return () => controls.stop();
  }, [position]);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const contentLeft = rect.left + BORDER_WIDTH;
    const contentWidth = rect.width - BORDER_WIDTH * 2;
    const pct = ((clientX - contentLeft) / contentWidth) * 100;
    position.set(Math.min(100, Math.max(0, pct)));
  };

  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-[172px] pb-16 sm:px-8 lg:px-[68px]">
      <p className="font-sans text-base text-[#707682]">Before &amp; After Overview</p>

      <div
        ref={containerRef}
        className="relative mx-auto mt-[130px] w-full touch-none overflow-hidden rounded-[12px] border-solid select-none"
        style={{
          maxWidth: FRAME_MAX_WIDTH,
          aspectRatio: FRAME_ASPECT,
          borderColor: BEZEL_COLOR,
          backgroundColor: BEZEL_COLOR,
          borderWidth: BORDER_WIDTH,
          boxSizing: "content-box",
        }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1) return;
          updateFromClientX(e.clientX);
        }}
      >
        <Image
          src={afterImage}
          alt="Framer's editor after the redesign"
          fill
          className="pointer-events-none object-contain"
          draggable={false}
        />
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <Image
            src={beforeImage}
            alt="Framer's editor before the redesign"
            fill
            className="pointer-events-none object-contain"
            draggable={false}
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-y-0 w-[2px] bg-white"
          style={{ left: leftPct }}
        />

        <motion.div
          className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-[10px]"
          style={{ left: leftPct, backgroundColor: BEZEL_COLOR }}
        >
          <ArrowsIcon />
        </motion.div>

        <div
          className="pointer-events-none absolute bottom-4 left-4 rounded-[8px] px-4 py-2 font-sans text-sm text-white"
          style={{ backgroundColor: LABEL_COLOR }}
        >
          Before
        </div>
        <div
          className="pointer-events-none absolute right-4 bottom-4 rounded-[8px] px-4 py-2 font-sans text-sm text-white"
          style={{ backgroundColor: LABEL_COLOR }}
        >
          After
        </div>
      </div>
    </section>
  );
}
