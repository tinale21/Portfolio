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

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[10px]"
      style={{
        left: `${(x / FIGMA_WIDTH) * 100}%`,
        top: `${(y / FIGMA_HEIGHT) * 100}%`,
        width: `${(w / FIGMA_WIDTH) * 100}%`,
        height: `${(h / FIGMA_HEIGHT) * 100}%`,
        zIndex: z,
        y: translateY,
        opacity,
      }}
    >
      <Image src={src} alt={alt} fill sizes="20vw" className="object-cover" />
    </motion.div>
  );
}
