"use client";

import { motion, MotionValue } from "framer-motion";
import { CollagePhoto } from "./CollagePhoto";
import {
  desktopCollageAspect,
  desktopCollageLayout,
  mobileCollageAspect,
  mobileCollageLayout,
} from "./collage-layout";

// Every photo below is positioned as a % of this container, so shrinking
// the container scales the whole composition uniformly — positions,
// spacing, and layering all stay exactly as measured from Figma. Went
// 94% -> 84% per earlier feedback that the collage read oversized, then
// back up to 88% per later feedback that 84% read a little too small.
//
// Note: a previous version of this file shifted the container off-center
// to compensate for the left cluster's larger combined photo area (an
// "area-weighted visual centroid" adjustment). That overcorrected in
// practice — the geometric bounding box ended up ~32px right of true
// center — and read as less balanced, not more. Reverted to plain
// geometric centering, which matches Figma's own bounding box exactly
// (359px margins on both sides at the 1512 reference width).
const DESKTOP_SCALE = "88%";

export function HeroCollage({
  y,
  rotateX,
  perspective,
  progress,
}: {
  y: MotionValue<number>;
  rotateX: MotionValue<number>;
  perspective: number;
  progress: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{
        y,
        rotateX,
        transformPerspective: perspective,
        transformStyle: "preserve-3d",
      }}
      className="w-full"
    >
      {/* Desktop / tablet arrangement — positions are page-width-relative,
          matching the Figma frame (1512px) coordinate space exactly.
          preserve-3d so each photo's own translateZ (see collage-layout.ts
          "depth") renders as real 3D depth within the parent's rotateX,
          instead of being flattened onto one plane. */}
      <div
        className="relative mx-auto hidden lg:block"
        style={{
          aspectRatio: desktopCollageAspect,
          width: DESKTOP_SCALE,
          transformStyle: "preserve-3d",
        }}
      >
        {desktopCollageLayout.map((photo, i) => (
          <CollagePhoto key={i} {...photo} progress={progress} />
        ))}
      </div>

      {/* Mobile arrangement — no "depth" set on any of these, so their
          animated translateZ always resolves to 0; progress is still
          passed through since CollagePhoto always calls useTransform.
          Unlike the desktop composition (scaled down from its 1512px
          Figma frame via DESKTOP_SCALE), this one's source Figma frame
          (393x852, iPhone 16) is already phone-width, and its own margins
          are already baked into mobileCollageLayout's percentages — so no
          extra width-shrinking or padding here, just a full-width box
          capped at a sensible max so it doesn't scale past native size on
          wider phones. */}
      <div
        className="relative mx-auto w-full max-w-[430px] lg:hidden"
        style={{ aspectRatio: mobileCollageAspect }}
      >
        {mobileCollageLayout.map((photo, i) => (
          <CollagePhoto key={i} {...photo} progress={progress} />
        ))}
      </div>
    </motion.div>
  );
}
