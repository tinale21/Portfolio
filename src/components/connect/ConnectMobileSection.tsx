"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import {
  MOBILE_CONNECT_PHOTOS,
  MOBILE_FIGMA_HEIGHT,
  MOBILE_FIGMA_WIDTH,
  MOBILE_HEADING_FONT_SIZE_VW,
  MOBILE_PIN_SCROLL_DISTANCE,
  HEADING,
  getConnectExitTiming,
} from "./connect-data";
import { ConnectMobilePhoto } from "./ConnectMobilePhoto";

// Mobile version of ConnectSection — per direct feedback ("it is
// currently built horizontal but for mobile it should be rebuilt
// vertically"), see MOBILE_CONNECT_PHOTOS's comment in connect-data.ts
// for why a narrower portrait reference frame (rather than reusing
// desktop's 1512x982 landscape one) was the fix, the same shape as
// PhilosophySection's own mobile rebuild earlier in this pass.
//
// Structurally this mirrors ConnectSection.tsx closely on purpose — same
// position:sticky pin, same wrapper-height-from-measured-sticky-child
// approach, same viewport-centered (not Figma-frame-centered) heading —
// just pointed at the mobile constants/photo component instead of
// desktop's. getConnectExitTiming (connect-data.ts) was made breakpoint-
// aware so ExperiencesSection's own pull-up-to-cover effect stays
// correctly sized against *this* section's geometry on mobile, not
// desktop's.
export function ConnectMobileSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [wrapperHeightPx, setWrapperHeightPx] = useState<number | null>(null);
  const [headingCenterYPx, setHeadingCenterYPx] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;

      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const raw = (window.scrollY - wrapperTop) / MOBILE_PIN_SCROLL_DISTANCE;
      progress.set(Math.min(1, Math.max(0, raw)));

      const { hold } = getConnectExitTiming(window.innerWidth, window.innerHeight);
      setWrapperHeightPx(container.getBoundingClientRect().height + MOBILE_PIN_SCROLL_DISTANCE + hold);
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
        height:
          wrapperHeightPx !== null ? `${wrapperHeightPx}px` : `calc(100vh + ${MOBILE_PIN_SCROLL_DISTANCE + 700}px)`,
      }}
      className="relative bg-[#262626] lg:hidden"
    >
      <div className="sticky top-0 overflow-hidden">
        <div
          className="relative mx-auto w-full max-w-[430px]"
          ref={containerRef}
          style={{ aspectRatio: `${MOBILE_FIGMA_WIDTH} / ${MOBILE_FIGMA_HEIGHT}` }}
        >
          <p
            className="absolute left-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif font-bold text-white"
            style={{
              top: headingCenterYPx !== null ? `${headingCenterYPx}px` : "50%",
              // calc(...) around the whole clamp (not just tweaking the
              // clamp's own min/max) so it's exactly 2px smaller at every
              // viewport width, per direct feedback — not just at
              // whichever single breakpoint happened to be tested.
              fontSize: `calc(clamp(1.75rem, ${MOBILE_HEADING_FONT_SIZE_VW}vw, 2.75rem) - 2px)`,
            }}
          >
            {HEADING}
          </p>

          {MOBILE_CONNECT_PHOTOS.map((photo, i) => (
            <ConnectMobilePhoto key={i} {...photo} progress={progress} />
          ))}
        </div>
      </div>
    </div>
  );
}
