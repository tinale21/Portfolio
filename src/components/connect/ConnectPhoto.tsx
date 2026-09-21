"use client";

import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";
import { ConnectPhotoData, ENTRY_AFTER, ENTRY_BEFORE, FIGMA_HEIGHT, FIGMA_WIDTH } from "./connect-data";

export function ConnectPhoto({
  src,
  alt,
  x,
  y,
  w,
  h,
  z,
  arrival,
  progress,
  pxScale,
}: ConnectPhotoData & { progress: MotionValue<number>; pxScale: number }) {
  // Unclamped 3-point line — see ENTRY_BEFORE/ENTRY_AFTER's comment.
  // Converted from Figma reference px to actual on-screen px via pxScale,
  // same as the Philosophy section's cluster translate, so it scales
  // fluidly with viewport width instead of drifting out of sync with the
  // percentage-based static position/size below.
  const translateY = useTransform(
    progress,
    [0, arrival, 1],
    [ENTRY_BEFORE * pxScale, 0, -ENTRY_AFTER * pxScale],
  );
  // Fades in on the way up to its resting spot, then stays fully opaque —
  // it's already hidden below the frame during that fade (clipped by the
  // sticky container's overflow-hidden), so this only softens the reveal
  // right as it crosses into view, not a separate visibility mechanism.
  const opacity = useTransform(progress, [0, arrival], [0, 1]);

  // Polaroid frame: the positioned box is a white card (thin border on
  // top/sides, thicker at the bottom, like a real polaroid) with a soft drop
  // shadow; the photo sits in the window inside it. The card keeps the exact
  // same footprint/position as before, so the composition and rise/exit
  // animation are unchanged.
  //
  // The frame padding lives on an INNER wrapper, not the card itself: CSS
  // padding percentages resolve against the containing block's width, and
  // the card's containing block is the big Connect frame (~viewport-wide),
  // so `p-[6%]` on the card became ~90px on a 248px card and crushed the
  // photo. On the inner wrapper the containing block is the card, so the %
  // is relative to the card's own width — a proportional, correct border.
  return (
    <motion.div
      className="absolute rounded-[2px] bg-white"
      style={{
        left: `${(x / FIGMA_WIDTH) * 100}%`,
        top: `${(y / FIGMA_HEIGHT) * 100}%`,
        width: `${(w / FIGMA_WIDTH) * 100}%`,
        height: `${(h / FIGMA_HEIGHT) * 100}%`,
        zIndex: z,
        y: translateY,
        opacity,
        // Strong-ish shadow (inline, deterministic) so each polaroid reads
        // as its own card and separates from the ones it overlaps.
        boxShadow: "0 10px 26px rgba(0,0,0,0.4)",
      }}
    >
      {/* Padding via inline style (top/sides 9%, bottom 26% of the card's
          width) rather than Tailwind arbitrary-% classes — inline is
          deterministic and its % correctly resolves against the card. A
          chunky border (esp. the thick bottom) is what makes it read as a
          polaroid rather than just a bordered photo. */}
      <div className="flex h-full w-full flex-col" style={{ padding: "9% 9% 26%" }}>
        <div className="relative w-full flex-1 overflow-hidden">
          {/* eager (not the next/image default lazy) so these begin downloading
              on page load rather than only when scrolled into view — the scroll
              reveal gives no lead time to fetch otherwise, so they popped in
              late. Files are small WebP now (see connect-data.ts), so eager-
              loading all six up front is cheap. */}
          <Image src={src} alt={alt} fill sizes="20vw" loading="eager" className="object-cover" />
        </div>
      </div>
    </motion.div>
  );
}
