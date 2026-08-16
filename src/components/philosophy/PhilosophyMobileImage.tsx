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
    // Two layered fixes for corner rounding not rendering, both kept:
    // (1) splitting "the element that transforms" from "the element that
    // clips/rounds" — the outer div carries position and the scroll-
    // driven transform with no rounding of its own; the inner div (100%
    // of the outer, never transformed itself) does the clipping. First
    // attempt at just this alone fixed it in a Chrome test but a real
    // device screenshot on Safari showed *no* image in the composition
    // rounded at all afterward — worse than the original bug, and not
    // reproduced in any Chrome test throughout this, so it reads as a
    // Safari-specific compositing/clipping bug for `overflow: hidden` +
    // `border-radius` combined with a transformed ancestor, not the same
    // failure mode diagnosed on Chrome. (2) clip-path instead of
    // overflow-hidden + border-radius for the actual clipping — a
    // different, more explicit CSS clipping primitive that doesn't rely
    // on the overflow/box-model interaction with transforms the way
    // overflow-hidden does, and is generally more consistent across
    // browsers for exactly this transformed-ancestor scenario.
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
      <div className="h-full w-full" style={{ clipPath: "inset(0px round 10px)" }}>
        <Image src={src} alt={alt} fill sizes="40vw" className="object-cover" />
      </div>
    </motion.div>
  );
}
