"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform } from "framer-motion";
import { HeroCollage } from "./HeroCollage";

// The Hero sits after the sticky nav in normal flow, so a plain
// min-h-screen (100vh) section makes nav + Hero taller than one screen —
// the nav's height spills past the initial viewport, meaning the user
// doesn't actually see the full section without scrolling first. Sizing
// the section to (100vh - nav height) instead makes nav + Hero together
// fill exactly one screen, so centering within it matches centering
// within what's actually visible on load. If NavBar's height changes,
// update this to match (same coupling as collage-layout.ts).
const NAV_HEIGHT = 64;

// Total upward travel of the collage, reached once the user has scrolled
// roughly one viewport height into the hero. Tied directly to scroll
// position (not a one-shot trigger) so scrolling back up reverses it, and
// the page keeps scrolling naturally — no pinning/scroll-jacking.
const TRANSLATE_DISTANCE = 120;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);
  const collageY = useTransform(progress, [0, 1], [0, -TRANSLATE_DISTANCE]);

  useEffect(() => {
    function updateProgress() {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const distance = window.innerHeight;
      const raw = (window.scrollY - sectionTop) / distance;
      progress.set(Math.min(1, Math.max(0, raw)));
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [progress]);

  return (
    <section
      ref={sectionRef}
      className="flex items-center overflow-hidden bg-[#262626]"
      style={{ minHeight: `calc(100vh - ${NAV_HEIGHT}px)` }}
    >
      <HeroCollage y={collageY} />
    </section>
  );
}
