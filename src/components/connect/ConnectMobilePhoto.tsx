"use client";

import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";
import {
  ConnectPhotoData,
  MOBILE_ENTRY_AFTER,
  MOBILE_ENTRY_BEFORE,
  MOBILE_FIGMA_HEIGHT,
  MOBILE_FIGMA_WIDTH,
} from "./connect-data";

// Mobile counterpart of ConnectPhoto.tsx — same 3-point "rise from below,
// arrive, keep rising and exit above" motion, but animates `top` as a
// plain percentage string instead of a `y` transform. ConnectPhoto.tsx's
// own `overflow-hidden rounded-[10px]` + `y` transform combination is the
// exact pattern that caused PhilosophySection's mobile corner-rounding
// bug to silently fail to clip on a real device despite passing every
// Chrome test (see that component's own history) — avoided here from the
// start rather than building it the same way and finding the same bug
// again. width/height don't animate at all in this section (unlike
// Philosophy's cluster-to-final scale), so they're plain static
// percentages; only `top` needs interpolation.
export function ConnectMobilePhoto({
  src,
  alt,
  x,
  y,
  w,
  h,
  z,
  arrival,
  progress,
}: ConnectPhotoData & { progress: MotionValue<number> }) {
  const baseTopPercent = (y / MOBILE_FIGMA_HEIGHT) * 100;
  const entryBeforePercent = (MOBILE_ENTRY_BEFORE / MOBILE_FIGMA_HEIGHT) * 100;
  const entryAfterPercent = (MOBILE_ENTRY_AFTER / MOBILE_FIGMA_HEIGHT) * 100;

  const top = useTransform(
    progress,
    [0, arrival, 1],
    [`${baseTopPercent + entryBeforePercent}%`, `${baseTopPercent}%`, `${baseTopPercent - entryAfterPercent}%`],
  );
  const opacity = useTransform(progress, [0, arrival], [0, 1]);

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[10px]"
      style={{
        left: `${(x / MOBILE_FIGMA_WIDTH) * 100}%`,
        top,
        width: `${(w / MOBILE_FIGMA_WIDTH) * 100}%`,
        height: `${(h / MOBILE_FIGMA_HEIGHT) * 100}%`,
        zIndex: z,
        opacity,
      }}
    >
      {/* eager (not lazy) — same reasoning as ConnectPhoto.tsx: the scroll
          reveal leaves no time to lazy-fetch, and the WebP files are small
          enough to load all six up front. */}
      <Image src={src} alt={alt} fill sizes="40vw" loading="eager" className="object-cover" />
    </motion.div>
  );
}
