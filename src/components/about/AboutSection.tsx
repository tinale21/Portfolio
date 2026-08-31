"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ABOUT_ENTRIES,
  MISSION_QUOTE,
  MISSION_QUOTE_CLOSE,
  MISSION_QUOTE_OPEN,
} from "./about-data";
import { AboutEntry } from "./AboutEntry";

// Matches NavBar's own height (see HeroSection's identical constant) — the
// pinned quote sticks just below the nav rather than underneath it.
const NAV_HEIGHT = 64;

// Per direct feedback: a flat pb-[850px] below the quote (this section's
// previous approach to keeping the Footer off-screen while the quote reads)
// worked, but felt like "too much white space" — scrolling through it was
// just blank page with nothing on screen. Replaced with the same
// sticky-pin-hold mechanism HeroSection's intro paragraph uses: the quote
// sticks in place for this many px of scroll (still something on screen the
// whole time, not blank space) before releasing back into normal flow, at
// which point the Footer follows immediately after with no extra gap.
//
// This only works because the sticky content below is sized to the full
// viewport (min-h-[calc(100vh-64px)]) rather than the old min-h-[60vh] —
// first attempt kept 60vh and still leaked the Footer into view *while the
// quote was still actively stuck*, confirmed via direct scroll-position
// math: the sticky child's own height and the point where it releases are
// two independent things. A pin wrapper taller than its sticky child (which
// is exactly what MISSION_HOLD creates) leaves a "hollow" gap below the
// visually-stuck content, still inside the wrapper — once scrollY passes
// (wrapperDocBottom - viewportHeight), the Footer starts peeking up through
// that gap from below regardless of whether the sticky element itself has
// released yet. Filling the full viewport leaves no such gap to peek
// through, so the Footer genuinely cannot appear until MISSION_HOLD has
// fully elapsed.
const MISSION_HOLD = 300;

export function AboutSection() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const [pinWrapperHeightPx, setPinWrapperHeightPx] = useState<number | null>(null);

  useEffect(() => {
    function updatePinHeight() {
      const sticky = stickyRef.current;
      if (!sticky) return;
      setPinWrapperHeightPx(sticky.getBoundingClientRect().height + MISSION_HOLD);
    }

    updatePinHeight();
    window.addEventListener("resize", updatePinHeight);
    return () => window.removeEventListener("resize", updatePinHeight);
  }, []);

  return (
    <>
      {ABOUT_ENTRIES.map((entry) => (
        <AboutEntry key={entry.traitLines.join(" ")} {...entry} />
      ))}

      {/* Pin wrapper sized to (quote block's natural height) + MISSION_HOLD,
          same pattern as HeroSection's intro pin wrapper — see MISSION_HOLD's
          comment above for why. Falls back to a plain height (no pin) before
          the first measurement runs, so there's no zero-height flash on
          load. */}
      <div
        data-nav-theme="light"
        style={pinWrapperHeightPx !== null ? { height: pinWrapperHeightPx } : undefined}
        className="relative bg-white"
      >
        <div ref={stickyRef} className="sticky" style={{ top: NAV_HEIGHT }}>
          <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 sm:px-8 lg:px-[68px]">
            <motion.p
              className="max-w-[720px] text-center font-serif text-black italic"
              style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.6rem)", fontWeight: 700 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span style={{ marginLeft: "-0.45em" }}>{MISSION_QUOTE_OPEN}</span>
              {MISSION_QUOTE}
              <span style={{ marginRight: "-0.45em" }}>{MISSION_QUOTE_CLOSE}</span>
            </motion.p>
          </section>
        </div>
      </div>
    </>
  );
}
