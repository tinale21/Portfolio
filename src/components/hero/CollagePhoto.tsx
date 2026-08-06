"use client";

import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";
import { CollagePhotoConfig } from "./collage-layout";

export function CollagePhoto({
  src,
  alt,
  top,
  left,
  width,
  height,
  rotate,
  z,
  depth,
  priority,
  progress,
}: CollagePhotoConfig & { progress: MotionValue<number> }) {
  // Depth ramps from 0 (at rest) up to its full value in sync with the
  // collage's rotation — so scroll=0 renders identical to the approved
  // flat composition, and the per-photo 3D separation only appears once
  // scrolling begins. A constant (always-on) translateZ was tried first
  // and it shrank/repositioned the smallest background photos even at
  // rest, since perspective foreshortening applies regardless of rotation.
  const translateZ = useTransform(progress, [0, 1], [0, depth ?? 0]);

  return (
    <motion.div
      className="absolute overflow-hidden rounded-[10px]"
      style={{
        top,
        left,
        width,
        height,
        rotate: rotate ?? 0,
        z: translateZ,
        zIndex: z,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 30vw, 45vw"
        className="object-cover"
        placeholder="blur"
        priority={priority}
      />
    </motion.div>
  );
}
