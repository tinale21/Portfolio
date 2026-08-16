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

// Mobile counterpart of PhilosophyImage.tsx — same cluster-start ->
// final-position concept, driven by one shared scroll progress — but a
// deliberately different implementation after two transform-based
// attempts both failed on real Safari despite working in every Chrome
// test:
//   1st: rounding + overflow-hidden + independent scaleX/scaleY on one
//        element -> one image's corner rendered square on a real device.
//   2nd: split the transformed element from the rounded/clipped element,
//        still using overflow-hidden + border-radius -> regressed to
//        *zero* rounding on any image on a real device.
//   3rd: same split, swapped clip-path in for overflow-hidden +
//        border-radius -> still broken per direct follow-up ("back to
//        the same issue").
// All three shared one thing: a CSS `transform` (translate/scale) on the
// animated element or its immediate parent, combined with rounded
// clipping somewhere in that same subtree. Rather than guess a 4th
// clipping mechanism, this removes the transform from the picture
// entirely — cluster-to-final now animates the actual layout box
// (left/top/width/height as %, triggering real reflow instead of a
// compositor-only transform) instead of translate+scale. No element in
// this component now has *any* transform, so the rounded-corner-under-
// transform bug class simply doesn't apply, regardless of which browser
// or exact mechanism was causing it. Reflow-based animation is less
// performant than transform-based, but for 8 elements driven by scroll
// (not a continuous/high-frequency animation) that's not a concern here.
export function PhilosophyMobileImage({
  src,
  alt,
  x,
  y,
  w,
  h,
  z,
  progress,
}: PhilosophyImageData & { progress: MotionValue<number> }) {
  const clusterLeft = MOBILE_CLUSTER_CENTER_X - MOBILE_CLUSTER_CARD_WIDTH / 2;
  const clusterTop = MOBILE_CLUSTER_CENTER_Y - MOBILE_CLUSTER_CARD_HEIGHT / 2;

  const left = useTransform(
    progress,
    [0, 1],
    [`${(clusterLeft / MOBILE_FIGMA_WIDTH) * 100}%`, `${(x / MOBILE_FIGMA_WIDTH) * 100}%`],
  );
  const top = useTransform(
    progress,
    [0, 1],
    [`${(clusterTop / MOBILE_FIGMA_HEIGHT) * 100}%`, `${(y / MOBILE_FIGMA_HEIGHT) * 100}%`],
  );
  const width = useTransform(
    progress,
    [0, 1],
    [`${(MOBILE_CLUSTER_CARD_WIDTH / MOBILE_FIGMA_WIDTH) * 100}%`, `${(w / MOBILE_FIGMA_WIDTH) * 100}%`],
  );
  const height = useTransform(
    progress,
    [0, 1],
    [`${(MOBILE_CLUSTER_CARD_HEIGHT / MOBILE_FIGMA_HEIGHT) * 100}%`, `${(h / MOBILE_FIGMA_HEIGHT) * 100}%`],
  );

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[10px]"
      style={{ left, top, width, height, zIndex: z }}
    >
      <Image src={src} alt={alt} fill sizes="40vw" className="object-cover" />
    </motion.div>
  );
}
