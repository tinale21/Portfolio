"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import { CONNECT_PHOTOS, FIGMA_HEIGHT, FIGMA_WIDTH, HEADING, HEADING_FONT_SIZE_VW } from "./connect-data";
import { ConnectPhoto } from "./ConnectPhoto";

// Same pinned-scroll mechanism as PhilosophySection. Confirmed against the
// live motion-reference site (justharshal.framer.website) by sampling its
// DOM across the full scroll range: the heading sits in a genuinely
// sticky layer with a completely constant transform (never moves), while
// its photos live outside that sticky layer entirely and animate
// underneath — same two-layer split used here.
const PIN_SCROLL_DISTANCE = 1200;

export function ConnectSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [pxScale, setPxScale] = useState(1);

  useEffect(() => {
    function update() {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;

      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const raw = (window.scrollY - wrapperTop) / PIN_SCROLL_DISTANCE;
      progress.set(Math.min(1, Math.max(0, raw)));

      setPxScale(container.getBoundingClientRect().width / FIGMA_WIDTH);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progress]);

  return (
    <div
      ref={wrapperRef}
      data-nav-theme="dark"
      style={{ height: `calc(100vh + ${PIN_SCROLL_DISTANCE}px)` }}
      // Plain, unanimated bg-color on the outer wrapper — per the brief
      // ("the background remains the same dark color throughout the
      // entire section"), this never changes regardless of scroll
      // progress or how the pinned inner content animates.
      className="relative bg-[#262626]"
    >
      <div className="sticky top-0 overflow-hidden">
        <div
          className="relative mx-auto w-full"
          ref={containerRef}
          style={{ aspectRatio: `${FIGMA_WIDTH} / ${FIGMA_HEIGHT}` }}
        >
          {/* Dead center, z-index above every photo, and never animated —
              per direct feedback plus the live reference's own DOM (see
              connect-data.ts), this sits in a logically separate layer
              from the Figma-positioned photo scatter, not at a Figma
              coordinate within it. */}
          <p
            className="absolute left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif font-bold text-white"
            style={{ fontSize: `clamp(1.75rem, ${HEADING_FONT_SIZE_VW}vw, 3rem)` }}
          >
            {HEADING}
          </p>

          {CONNECT_PHOTOS.map((photo, i) => (
            <ConnectPhoto key={i} {...photo} progress={progress} pxScale={pxScale} />
          ))}
        </div>
      </div>
    </div>
  );
}
