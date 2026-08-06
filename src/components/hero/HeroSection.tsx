"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useTransform } from "framer-motion";
import { HeroCollage } from "./HeroCollage";
import { TypewriterHeadline } from "./TypewriterHeadline";

const PHRASES = [
  "I'm Tina",
  "I'm a designer",
  "I'm a dreamer",
  "I'm a creative",
];

// The Hero sits after the sticky nav in normal flow, so a plain
// min-h-screen (100vh) section makes nav + Hero taller than one screen —
// the nav's height spills past the initial viewport, meaning the user
// doesn't actually see the full section without scrolling first. Sizing
// the "screen" block below to (100vh - nav height) instead makes nav +
// that block together fill exactly one screen. If NavBar's height
// changes, update this to match (same coupling as collage-layout.ts).
const NAV_HEIGHT = 64;

// Total upward travel of the collage, reached once the user has scrolled
// roughly one viewport height into the hero. Tied directly to scroll
// position (not a one-shot trigger) so scrolling back up reverses it, and
// the page keeps scrolling naturally — no pinning/scroll-jacking.
const TRANSLATE_DISTANCE = 120;

// Cubic ease-out applied to raw scroll progress before mapping to pixels —
// the motion reference showed a fast-start, decelerating-settle feel
// rather than a mechanical linear drag. Still a pure function of scroll
// position (reversible either direction), just remapped non-linearly.
// Sampled at 21 points so framer-motion's piecewise-linear interpolation
// between them closely approximates the smooth curve.
const EASE_SAMPLES = 20;
const EASE_STOPS = Array.from({ length: EASE_SAMPLES + 1 }, (_, i) => i / EASE_SAMPLES);
const EASE_OUTPUT = EASE_STOPS.map(
  (t) => -TRANSLATE_DISTANCE * (1 - Math.pow(1 - t, 3)),
);

// Depth via rotateX + perspective, on the same eased curve as the translate.
// Decomposing the live reference's actual transform matrix (not just
// eyeballing screenshots) showed the entire collage wrapper rotates via
// rotateX — from ~0deg to -40deg, capping by ~600px of scroll. -8deg (the
// first attempt at "extremely subtle") read as barely noticeable, -16deg
// still read as too subtle, so bumped again to -24deg. Individual photos
// now also each have their own translateZ ("depth" in collage-layout.ts,
// applied via CollagePhoto) so they foreshorten at different rates as the
// group tilts, rather than reading as one flat rotated plane.
const ROTATE_X_END = -24;
const ROTATE_X_OUTPUT = EASE_STOPS.map(
  (t) => ROTATE_X_END * (1 - Math.pow(1 - t, 3)),
);
const PERSPECTIVE_PX = 800;

// Figma font-size for the headline (90px at the 1512 reference width),
// expressed as vw so it scales the same way the collage does. (Headline
// left position — 449/1512 = 29.696% — is applied directly below as a
// static Tailwind class; see the comment there.)
const HEADLINE_FONT_SIZE_VW = (90 / 1512) * 100;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const collageY = useTransform(progress, EASE_STOPS, EASE_OUTPUT);
  const collageRotateX = useTransform(progress, EASE_STOPS, ROTATE_X_OUTPUT);
  const [headlineArrived, setHeadlineArrived] = useState(false);

  useEffect(() => {
    function updateProgress() {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const distance = window.innerHeight;
      const raw = (window.scrollY - sectionTop) / distance;
      progress.set(Math.min(1, Math.max(0, raw)));

      // Trigger the typewriter off the headline's own visibility, not
      // collage progress — the two used to coincide (progress hit 1 right
      // as the headline scrolled into view), but tightening the headline's
      // top padding to bring it up moved its resting position earlier than
      // that, so by the time progress reached 1 the headline had already
      // scrolled mostly past, hidden under the sticky nav. Checking the
      // headline's own rect keeps the trigger correct regardless of how
      // its position or the collage's travel distance are tuned later.
      // Latches on first visibility and never resets, even scrolling back up.
      const headline = headlineRef.current;
      if (headline) {
        const rect = headline.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > NAV_HEIGHT) {
          setHeadlineArrived(true);
        }
      }
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
      className="overflow-hidden bg-[#262626]"
    >
      {/* First screen: collage only, unchanged from the approved layout. */}
      <div
        className="flex items-center"
        style={{ minHeight: `calc(100vh - ${NAV_HEIGHT}px)` }}
      >
        <HeroCollage
          y={collageY}
          rotateX={collageRotateX}
          perspective={PERSPECTIVE_PX}
          progress={progress}
        />
      </div>

      {/* Headline: already in the DOM at its resting position from the
          start, simply below the fold on load. It never moves itself —
          scrolling (plus the collage translating out of the way above)
          is what brings it into view. Only its text content animates.
          lg:pl-[29.696%] is HEADLINE_LEFT_PCT (449/1512) as a static
          class — Tailwind can't reliably pick up a dynamically
          interpolated arbitrary value, so it's hardcoded here and kept
          in sync with the constant above by hand.
          Top padding is intentionally small — the headline only needs to
          stay below the fold, which is already guaranteed by sitting
          after a full-viewport-tall sibling above, not by its own
          padding. A smaller top padding just brings it closer to that
          boundary (less scrolling to reveal it) without ever risking it
          appearing within the initial viewport. Bottom padding is kept
          larger for breathing room before whatever section follows. */}
      <div
        ref={headlineRef}
        className="px-5 pt-6 pb-24 sm:px-8 sm:pt-8 sm:pb-32 lg:pr-8 lg:pt-12 lg:pb-40 lg:pl-[29.696%]"
      >
        <h1
          className="text-[#E4E7EC]"
          style={{
            fontSize: `clamp(2.5rem, ${HEADLINE_FONT_SIZE_VW}vw, 5.625rem)`,
          }}
        >
          <TypewriterHeadline phrases={PHRASES} start={headlineArrived} />
        </h1>
      </div>
    </section>
  );
}
