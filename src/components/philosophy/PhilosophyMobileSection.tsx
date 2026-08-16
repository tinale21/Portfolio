"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  MOBILE_CLUSTER_CENTER_Y,
  MOBILE_FIGMA_HEIGHT,
  MOBILE_FIGMA_WIDTH,
  MOBILE_PHILOSOPHY_IMAGES,
  QUOTE_CLOSE,
  QUOTE_LINES,
  QUOTE_OPEN,
} from "./philosophy-data";
import { PhilosophyMobileImage } from "./PhilosophyMobileImage";

// Second pass at the mobile version of this section. Per direct feedback
// ("the logic of the motion should work like how it is on desktop where
// all the images start off at the same scale and one behind another,
// then when users scroll the images move out and adjust in scale, the
// quotes also fades in and reveals itself"), this now replicates
// PhilosophySection.tsx's actual mechanism — one shared scroll-linked
// progress value, driving every image out from a single common cluster
// plus the quote's own fade/scale — rather than the first pass's
// per-pair whileInView-then-per-pair-useScroll approach, which matched
// the general *feel* but not the specific logic being asked for.
//
// The reason desktop's exact frame (1512x982, landscape) can't just be
// reused at mobile scale is the same reason the very first mobile pass
// existed at all: scaling that landscape frame down to a phone's width
// keeps its full height proportionally, squashing everything into a
// short, cramped strip. And the reason a *portrait* version of that same
// idea failed on the previous pass (a single tall column of 8 images)
// is a structural one, not a taste one: desktop's position:sticky pin
// only functions because the sticky box is *shorter* than the viewport
// it's pinned against — a sticky element taller than its own viewport
// can only ever show its top slice while pinned, the rest never becomes
// visible in a controlled way.
//
// The fix applied here: keep the pin (it's required for "one shared
// progress drives everything, exactly like desktop"), but make the
// composition itself compact enough to actually fit under one pinned
// viewport — a 2x2 grid of pairs (see MOBILE_PHILOSOPHY_IMAGES in
// philosophy-data.ts) using *uniform* boxes per photo role instead of
// each photo's true native size, which is what let desktop's own frame
// sprawl wide in the first place.
//
// Third pass, per further direct feedback ("make the image start off
// bigger and then when users scroll the image can just move out of the
// frame entirely like the reference"): unlike desktop, where every image
// settles into a *visible* final position, this composition's images now
// exit off-frame entirely (see MOBILE_PHILOSOPHY_IMAGES's own comment) —
// closer to the reference recording's actual behavior of cards flying
// past the screen's edges as the surrounding text takes over, rather
// than resolving into a small on-screen grid. Cluster starting size was
// also bumped up (MOBILE_CLUSTER_CARD_WIDTH/HEIGHT) per the same
// feedback.
const MOBILE_PIN_SCROLL_DISTANCE = 500;

export function PhilosophyMobileSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [pxScale, setPxScale] = useState(1);
  const quoteOpacity = useTransform(progress, [0.3, 1], [0, 1]);
  const quoteScale = useTransform(progress, [0.3, 1], [0.9, 1]);

  useEffect(() => {
    function update() {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;

      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const raw = (window.scrollY - wrapperTop) / MOBILE_PIN_SCROLL_DISTANCE;
      progress.set(Math.min(1, Math.max(0, raw)));

      setPxScale(container.getBoundingClientRect().width / MOBILE_FIGMA_WIDTH);
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
      data-nav-theme="light"
      style={{ height: `calc(100vh + ${MOBILE_PIN_SCROLL_DISTANCE}px)` }}
      className="relative bg-white lg:hidden"
    >
      <div className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden px-5">
        <div
          ref={containerRef}
          // overflow-hidden here (not just on the outer sticky/viewport-
          // sized wrapper above) so the images can actually exit the
          // *frame* rather than just the screen — see
          // MOBILE_PHILOSOPHY_IMAGES's comment in philosophy-data.ts for
          // why their positions are now off-frame exit points instead of
          // resting positions.
          className="relative mx-auto w-full max-w-[380px] overflow-hidden"
          style={{ aspectRatio: `${MOBILE_FIGMA_WIDTH} / ${MOBILE_FIGMA_HEIGHT}` }}
        >
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: "50%",
              top: `${(MOBILE_CLUSTER_CENTER_Y / MOBILE_FIGMA_HEIGHT) * 100}%`,
              width: "84%",
            }}
          >
            {/* Quote copy/marks reused verbatim from philosophy-data.ts.
                The explicit 2-line split (QUOTE_LINES) was tuned for
                desktop's 570px-wide box — joined with a space here
                instead so it wraps naturally at this composition's much
                narrower width. */}
            <motion.p
              className="text-center font-serif text-black"
              style={{
                fontSize: "clamp(1rem, 4.2vw, 1.35rem)",
                fontWeight: 700,
                opacity: quoteOpacity,
                scale: quoteScale,
              }}
            >
              <span style={{ marginLeft: "-0.35em" }}>{QUOTE_OPEN}</span>
              {QUOTE_LINES.join(" ")}
              <span style={{ marginRight: "-0.35em" }}>{QUOTE_CLOSE}</span>
            </motion.p>
          </div>

          {MOBILE_PHILOSOPHY_IMAGES.map((image, i) => (
            <PhilosophyMobileImage key={i} {...image} progress={progress} pxScale={pxScale} />
          ))}
        </div>
      </div>
    </div>
  );
}
