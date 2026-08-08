"use client";

import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";
import {
  CLUSTER_CARD_HEIGHT,
  CLUSTER_CARD_WIDTH,
  CLUSTER_CENTER_X,
  FIGMA_HEIGHT,
  FIGMA_WIDTH,
  PhilosophyImage as PhilosophyImageData,
} from "./philosophy-data";

export function PhilosophyImage({
  src,
  alt,
  x,
  y,
  w,
  h,
  z,
  progress,
  pxScale,
  clusterCenterY,
}: PhilosophyImageData & { progress: MotionValue<number>; pxScale: number; clusterCenterY: number }) {
  // Independent X/Y scale factors so every card renders at the exact same
  // CLUSTER_CARD_WIDTH x CLUSTER_CARD_HEIGHT at the start, regardless of
  // its own aspect ratio — a single aspect-preserving scale (normalizing
  // to each image's own max dimension) left images with mismatched
  // heights, which read as cards sticking out from behind each other
  // rather than a uniform stack. Both ratios converge to 1 by the end, so
  // each image settles back into its own true aspect ratio.
  const clusterScaleX = CLUSTER_CARD_WIDTH / w;
  const clusterScaleY = CLUSTER_CARD_HEIGHT / h;

  // Every card shares the exact same CLUSTER_CENTER_X/Y (no per-image
  // offset) so the starting composition is a true deck-of-cards stack —
  // all cards exactly overlapping — rather than a scattered cluster.
  const finalCenterX = x + w / 2;
  const finalCenterY = y + h / 2;
  const startTranslateX = (CLUSTER_CENTER_X - finalCenterX) * pxScale;
  const startTranslateY = (clusterCenterY - finalCenterY) * pxScale;

  const translateX = useTransform(progress, [0, 1], [startTranslateX, 0]);
  const translateY = useTransform(progress, [0, 1], [startTranslateY, 0]);
  const scaleX = useTransform(progress, [0, 1], [clusterScaleX, 1]);
  const scaleY = useTransform(progress, [0, 1], [clusterScaleY, 1]);

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[10px]"
      style={{
        left: `${(x / FIGMA_WIDTH) * 100}%`,
        top: `${(y / FIGMA_HEIGHT) * 100}%`,
        width: `${(w / FIGMA_WIDTH) * 100}%`,
        height: `${(h / FIGMA_HEIGHT) * 100}%`,
        zIndex: z,
        x: translateX,
        y: translateY,
        scaleX,
        scaleY,
      }}
    >
      <Image src={src} alt={alt} fill sizes="30vw" className="object-cover" />
    </motion.div>
  );
}
