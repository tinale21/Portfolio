"use client";

import { motion, MotionValue } from "framer-motion";
import { CollagePhoto } from "./CollagePhoto";
import {
  desktopCollageAspect,
  desktopCollageLayout,
  mobileCollageLayout,
} from "./collage-layout";

// Every photo below is positioned as a % of this container, so shrinking
// the container scales the whole composition uniformly — positions,
// spacing, and layering all stay exactly as measured from Figma, just at
// 84% (10% + a further 6% reduction), per design feedback that the collage
// read slightly oversized.
//
// Note: a previous version of this file shifted the container off-center
// to compensate for the left cluster's larger combined photo area (an
// "area-weighted visual centroid" adjustment). That overcorrected in
// practice — the geometric bounding box ended up ~32px right of true
// center — and read as less balanced, not more. Reverted to plain
// geometric centering, which matches Figma's own bounding box exactly
// (359px margins on both sides at the 1512 reference width).
const DESKTOP_SCALE = "84%";

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
          passed through since CollagePhoto always calls useTransform. */}
      <div className="relative mx-auto aspect-[5/6] w-full max-w-[420px] px-6 lg:hidden">
        {mobileCollageLayout.map((photo, i) => (
          <CollagePhoto key={i} {...photo} progress={progress} />
        ))}
      </div>
    </motion.div>
  );
}
