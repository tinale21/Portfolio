"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { HeroCollage } from "./HeroCollage";

// Per direct instruction, replaces the old typewriter phrase-cycling
// headline with a single static intro paragraph that fades in once
// scrolled to.
const INTRO_TEXT =
  "Hi, I’m Tina! I’m a UX designer who turns curiosity into thoughtful experiences. I love exploring ideas, solving problems, and obsessing over the little details that make an experience feel just right.";

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

// Extra scroll distance the intro paragraph stays pinned once it reaches
// its resting position, before releasing and scrolling away normally.
// Exists purely so ProjectsSection can progressively cover it — without
// this, both the intro block and Projects' rising edge move at the
// identical 1:1 scroll rate the whole time (neither pinned), so whatever
// partial overlap first happens between them never changes as you keep
// scrolling. That's not a transition, it's a permanent, frozen slice
// through the text — confirmed via Puppeteer when this was still the
// typewriter headline (the overlap sat at exactly 26% no matter how far
// past it you scrolled). Pinning this block gives Projects' edge a
// genuinely *stationary* target to sweep over, the same mechanism
// Connect's heading uses for the same reason. Carried over unchanged from
// the old headline (see git history) since the underlying mechanism this
// protects against hasn't changed, just what's inside the pinned block.
//
// 850 was the minimum needed for ProjectsSection's sweep to travel from
// fully off-screen to fully covering within this one pinned window (see
// ProjectsSection's own pull-up comment for the paired derivation) — at
// that value the sweep starts covering the instant the block settles,
// with no pause. Bumped by 200px per direct feedback wanting a brief
// "just sit here, fully visible" beat before the sweep begins — paired
// with reducing ProjectsSection's pull by the same 200px so that pause
// lands at the *start* of this extra time (block sits still, uncovered,
// for the first ~200px of the added hold) rather than after the sweep
// already finishes (which would just be idle scrolling through a plain
// white screen with nothing left to reveal).
const INTRO_HOLD = 1050;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const collageY = useTransform(progress, EASE_STOPS, EASE_OUTPUT);
  const collageRotateX = useTransform(progress, EASE_STOPS, ROTATE_X_OUTPUT);
  const lenis = useLenis();
  // Sizes the pin wrapper as exactly (intro block's natural height) +
  // INTRO_HOLD, same reasoning as ConnectSection's wrapperHeightPx:
  // without measuring the sticky child's real height and using it
  // directly, native sticky release would land at some arbitrary,
  // viewport-dependent point rather than exactly INTRO_HOLD past where
  // the block actually settles.
  const [pinWrapperHeightPx, setPinWrapperHeightPx] = useState<number | null>(null);

  useEffect(() => {
    function updatePinHeight() {
      const sticky = stickyRef.current;
      if (!sticky) return;
      setPinWrapperHeightPx(sticky.getBoundingClientRect().height + INTRO_HOLD);
    }

    updatePinHeight();
    window.addEventListener("resize", updatePinHeight);
    return () => window.removeEventListener("resize", updatePinHeight);
  }, []);

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

  // "Explore More" scrolls one viewport down from wherever the page
  // currently is, rather than to a specific named element — this section
  // is meant to be a generic "keep going" cue, not a jump-to-content link.
  // Routed through Lenis's own scrollTo when mounted (desktop), same
  // reasoning as NavBar's scrollToTop: a raw window.scrollTo fights
  // Lenis's per-frame resync back to its last tracked target.
  function handleExploreMore() {
    const target = window.scrollY + window.innerHeight;
    if (lenis) lenis.scrollTo(target);
    else window.scrollTo({ top: target, behavior: "smooth" });
  }

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="bg-[#262626]"
    >
      {/* First screen: collage only, unchanged from the approved layout on
          desktop (lg:items-center, lg:min-h-[calc(100vh-64px)], both
          unchanged). On mobile, top-aligned instead per direct feedback
          ("shift the photo collage up and make the typewriter closer to
          the photo collage but still not visible until users scroll
          down"), with a *reduced* min-height (78vh instead of the full
          100vh-nav) per further direct feedback ("is there a way so that
          the typewriter moves up but is still hidden until the scroll")
          — the intro block below is hidden by its own fade-in animation
          instead, not by this min-height. 78vh is a first pass, not
          derived from anything — free to tune up/down, since correctness
          no longer depends on it. The "64" in both min-h values is a
          literal copy of NAV_HEIGHT, not a template-interpolated
          reference to it — Tailwind's arbitrary-value classes have to be
          static text for its scanner to pick them up, so a
          `${NAV_HEIGHT}` interpolation here would silently fail to
          generate the class at build time. Keep both literals in sync
          with NAV_HEIGHT by hand if that constant ever changes (same
          manual-sync caveat NAV_HEIGHT's own comment already flags for
          collage-layout.ts).
          pt-[89px] gives the collage breathing room off the nav rather
          than touching it directly (bumped from an initial pt-6, then
          pt-16, then pt-[84px], per direct feedback to shift it down
          further each time).
          overflow-hidden lives here (not on the section itself anymore) —
          it clips the collage photos as they translate/tilt past their
          own bounds, but having it on an ancestor of the pinned intro
          block below completely breaks position: sticky for that block (a
          well-known CSS interaction — an overflow other than visible on
          *any* ancestor between a sticky element and its containing block
          disables the sticking entirely, which is exactly what happened
          here: the block's sticky top-64px did nothing at all, its
          position just decreased 1:1 with scroll the whole time, until
          this was scoped down to only wrap what actually needs clipping. */}
      <div
        className="flex items-start overflow-hidden pt-[89px] min-h-[calc(78vh-64px)] lg:items-center lg:pt-0 lg:min-h-[calc(100vh-64px)]"
      >
        <HeroCollage
          y={collageY}
          rotateX={collageRotateX}
          perspective={PERSPECTIVE_PX}
          progress={progress}
        />
      </div>

      {/* Intro pin wrapper: sized to (block's natural height) + INTRO_HOLD
          so the sticky child below stays pinned at its resting position
          for that extra scroll distance before releasing — see
          INTRO_HOLD's comment for why this exists. Falls back to a plain
          height (no pin) before the first measurement runs, so there's no
          zero-height flash on load. */}
      <div
        style={pinWrapperHeightPx !== null ? { height: pinWrapperHeightPx } : undefined}
        className="relative"
      >
        {/* top-[64px] (NAV_HEIGHT) rather than top-0 so the pinned block
            sticks just below the nav instead of underneath it. */}
        <div ref={stickyRef} className="sticky" style={{ top: NAV_HEIGHT }}>
          {/* Per direct instruction: takes up a full screen's worth of
              space on its own so it reads as filling most of the screen
              rather than a cramped strip of text, with the paragraph up
              top and "Explore More" anchored to the bottom via
              justify-between — both per the provided reference image.
              Deliberately min-h-[80vh] (mobile: 70vh), not a full
              min-h-[calc(100vh-64px)] like the collage block above — a
              full-viewport-tall stuck block's bottom edge sits exactly at
              the screen's bottom edge the instant it settles, which left
              zero room before ProjectsSection's own pull-up (tuned
              against the old, much shorter single-line headline) started
              visibly covering "Explore More" — confirmed via Puppeteer:
              at 100vh tall, Explore More was already painted over by
              Projects' white background the moment the block finished
              settling, before any of INTRO_HOLD's pinned scroll distance
              had even elapsed. Reducing this by 20/30vh leaves genuine
              dark space below the block once stuck, giving Projects'
              rising edge room to sweep up gradually instead of arriving
              instantly — reverified after this change that Explore More
              stays visible and uncovered through a real range of scroll
              before the sweep reaches it.
              whileInView fade-in replaces the old scroll-progress-driven,
              mobile-only opacity the typewriter headline used — that
              mechanism existed specifically to keep the typewriter from
              starting before its text was visible; a plain paragraph has
              no such start-trigger to coordinate, so the simpler,
              already-established AboutSection-style fade covers "hidden
              until scroll, then fades in" on every breakpoint uniformly.
              once: false (matching AboutSection's own mission-quote fade)
              per direct instruction — replays the fade every time this
              scrolls into view, not just the first time, so scrolling back
              up past it and down again re-triggers it too. */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex min-h-[90vh] flex-col px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[97vh] lg:px-[68px] lg:py-24"
          >
            {/* Paragraph vertically centers within its own fixed-height
                zone (matching the block's original, pre-"push Explore More
                down" min-height) rather than the whole (now-taller) block —
                per direct feedback, growing the block to push the button
                further down had shifted the paragraph's own centered
                position down with it, which wasn't wanted: only the
                button's position should move, not the paragraph's. The
                second, flex-1 wrapper below then absorbs *only* the extra
                height added beyond that original zone, pushing just the
                button toward the bottom within that leftover space. */}
            <div className="flex h-[55vh] items-center lg:h-[59vh]">
              <p
                className="max-w-[1200px] font-sans font-bold text-[#E4E7EC]"
                style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.5rem)", lineHeight: 1.35 }}
              >
                {INTRO_TEXT}
              </p>
            </div>

            {/* Consumes exactly the extra height added beyond the
                paragraph's own fixed zone above, so the button below sits
                at the bottom of *that* leftover space rather than
                immediately following the paragraph. */}
            <div className="flex-1" />

            <button
              type="button"
              onClick={handleExploreMore}
              className="flex w-fit items-center gap-2 font-sans text-base text-[#9AA1AF] transition-colors duration-300 hover:text-[#E4E7EC]"
            >
              Explore More
              <span aria-hidden="true">&darr;</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
