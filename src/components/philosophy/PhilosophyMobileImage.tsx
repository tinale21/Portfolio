"use client";

import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";
import {
  MOBILE_CLUSTER_CARD_HEIGHT,
  MOBILE_CLUSTER_CARD_WIDTH,
  MOBILE_CLUSTER_CENTER_X,
  MOBILE_CLUSTER_CENTER_Y,
  MOBILE_FIGMA_HEIGHT,
  MOBILE_FIGMA_WIDTH,
  PhilosophyImage as PhilosophyImageData,
} from "./philosophy-data";

// Mobile counterpart of PhilosophyImage.tsx — identical math (cluster
// start -> final position/scale, driven by one shared scroll progress),
// kept as a separate component rather than reusing PhilosophyImage.tsx
// directly so desktop's own hardcoded CLUSTER_CENTER_X/CLUSTER_CARD_WIDTH/
// HEIGHT imports stay completely untouched — no risk of a mobile-driven
// prop threading through changing anything about desktop's behavior.
// See MOBILE_PHILOSOPHY_IMAGES's comment in philosophy-data.ts for why
// mobile uses a *fixed* MOBILE_CLUSTER_CENTER_Y here instead of the
// screen-centered dynamic clusterCenterY prop PhilosophyImage.tsx takes —
// this composition isn't pinned to the full viewport the way desktop's
// is, so there's no live viewport height to center against.
export function PhilosophyMobileImage({
  src,
  alt,
  x,
  y,
  w,
  h,
  z,
  progress,
  pxScale,
}: PhilosophyImageData & { progress: MotionValue<number>; pxScale: number }) {
  const clusterScaleX = MOBILE_CLUSTER_CARD_WIDTH / w;
  const clusterScaleY = MOBILE_CLUSTER_CARD_HEIGHT / h;

  const finalCenterX = x + w / 2;
  const finalCenterY = y + h / 2;
  const startTranslateX = (MOBILE_CLUSTER_CENTER_X - finalCenterX) * pxScale;
  const startTranslateY = (MOBILE_CLUSTER_CENTER_Y - finalCenterY) * pxScale;

  const translateX = useTransform(progress, [0, 1], [startTranslateX, 0]);
  const translateY = useTransform(progress, [0, 1], [startTranslateY, 0]);
  const scaleX = useTransform(progress, [0, 1], [clusterScaleX, 1]);
  const scaleY = useTransform(progress, [0, 1], [clusterScaleY, 1]);

  return (
    // Rounding lives on a *separate, untransformed* inner div rather than
    // on this same element — found via direct inspection (computed style
    // showed overflow:hidden + border-radius:10px correctly, but the
    // browser's actual paint still rendered a hard square corner) that
    // combining overflow-hidden + border-radius + an independent-axis
    // scaleX/scaleY transform on the *same* element can fail to clip
    // correctly, even though isolated test pages with the same transform
    // values rendered fine — a compositing-layer edge case specific to
    // this page's actual complexity, not reproducible in a minimal
    // repro. Splitting "the element that transforms" from "the element
    // that clips/rounds" sidesteps it: the outer div carries position and
    // the scroll-driven transform with no rounding of its own, and the
    // inner div (100% of the outer, never transformed itself) carries
    // overflow-hidden + rounded-[10px] and the actual image.
    <motion.div
      className="absolute"
      style={{
        left: `${(x / MOBILE_FIGMA_WIDTH) * 100}%`,
        top: `${(y / MOBILE_FIGMA_HEIGHT) * 100}%`,
        width: `${(w / MOBILE_FIGMA_WIDTH) * 100}%`,
        height: `${(h / MOBILE_FIGMA_HEIGHT) * 100}%`,
        zIndex: z,
        x: translateX,
        y: translateY,
        scaleX,
        scaleY,
      }}
    >
      <div className="h-full w-full overflow-hidden rounded-[10px]">
        <Image src={src} alt={alt} fill sizes="40vw" className="object-cover" />
      </div>
    </motion.div>
  );
}
