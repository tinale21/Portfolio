"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CLIENT_LOGOS } from "@/components/logos/logos-data";

const CYCLE_MS = 1800;

// Per direct feedback: the "Previously at" line cycles through the same
// logo set as the homepage's Trusted By marquee, one at a time, rather
// than a single static company logo.
export function CyclingClientLogo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CLIENT_LOGOS.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const logo = CLIENT_LOGOS[index];

  return (
    <span className="relative inline-block h-[24px] w-[100px] align-middle">
      <AnimatePresence mode="wait">
        <motion.span
          key={logo.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 flex items-center"
        >
          <Image src={logo.src} alt={logo.name} className="h-[24px] w-auto object-contain" />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
