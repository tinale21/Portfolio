"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import {
  CONNECT_PHOTOS,
  FIGMA_HEIGHT,
  FIGMA_WIDTH,
  HEADING,
  HEADING_FONT_SIZE_VW,
  getConnectExitTiming,
} from "./connect-data";
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
  // The wrapper's height used to be a flat `100vh + PIN_SCROLL_DISTANCE`,
  // which assumes the sticky child (the aspect-ratio box below) is
  // exactly one viewport tall. It isn't — its height is width-derived
  // (982/1512 of the container's width), and that essentially never
  // equals the actual viewport height. Measuring the sticky child's real
  // height and sizing the wrapper as exactly `stickyHeight +
  // PIN_SCROLL_DISTANCE + hold` makes native release land exactly at
  // progress=1 plus the extra hold distance, rather than at some
  // viewport-dependent, arbitrarily-earlier point. `hold` itself comes from
  // getConnectExitTiming (see connect-data.ts) — it used to be a fixed
  // constant tuned against one test viewport, which broke once the heading
  // centering below was fixed to track the *real* viewport height instead
  // of the aspect-ratio box's height (a shorter browser window moves the
  // heading, which changes how much hold/pull the cover effect needs).
  const [wrapperHeightPx, setWrapperHeightPx] = useState<number | null>(null);
  // The heading was centered via `top-1/2`, i.e. 50% of the aspect-ratio
  // container's own height — but that container's height is width-derived
  // (982/1512 of its width) and essentially never matches the actual
  // browser viewport height, so it landed noticeably off the real visual
  // center (a ~41px offset measured at 1512x900). Since the container's
  // top already coincides with the viewport's top while pinned, half the
  // *real* viewport height is the correct target — same fix as
  // PhilosophySection's clusterCenterY, just without needing the
  // Figma-px/pxScale conversion since this isn't threaded through that
  // system.
  const [headingCenterYPx, setHeadingCenterYPx] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;

      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const raw = (window.scrollY - wrapperTop) / PIN_SCROLL_DISTANCE;
      progress.set(Math.min(1, Math.max(0, raw)));

      setPxScale(container.getBoundingClientRect().width / FIGMA_WIDTH);
      const { hold } = getConnectExitTiming(window.innerWidth, window.innerHeight);
      setWrapperHeightPx(container.getBoundingClientRect().height + PIN_SCROLL_DISTANCE + hold);
      setHeadingCenterYPx(window.innerHeight / 2);
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
      style={{
        // Pre-measurement fallback only (replaced on mount) — hold isn't
        // known yet without a viewport read, so this just needs to be a
        // reasonable placeholder to avoid a zero-height flash.
        height: wrapperHeightPx !== null ? `${wrapperHeightPx}px` : `calc(100vh + ${PIN_SCROLL_DISTANCE + 700}px)`,
      }}
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
            className="absolute left-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif font-bold text-white"
            style={{
              top: headingCenterYPx !== null ? `${headingCenterYPx}px` : "50%",
              fontSize: `clamp(1.75rem, ${HEADING_FONT_SIZE_VW}vw, 3rem)`,
            }}
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
