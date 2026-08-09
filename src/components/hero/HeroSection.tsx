"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useTransform } from "framer-motion";
import { HeroCollage } from "./HeroCollage";
import { CURSOR_WIDTH, PREFIX, TypewriterHeadline } from "./TypewriterHeadline";

const PHRASES = [
  "I'm Tina Le!",
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
// expressed as vw so it scales the same way the collage does.
const HEADLINE_FONT_SIZE_VW = (90 / 1512) * 100;

// Extra scroll distance the headline stays pinned once it reaches its
// resting position, before releasing and scrolling away normally. Exists
// purely so ProjectsSection can progressively cover it — without this,
// both the headline and Projects' rising edge move at the identical 1:1
// scroll rate the whole time (neither pinned), so whatever partial
// overlap first happens between them never changes as you keep
// scrolling. That's not a transition, it's a permanent, frozen slice
// through the text — confirmed via Puppeteer (the overlap sat at exactly
// 26% no matter how far past it you scrolled). Pinning the headline here
// gives Projects' edge a genuinely *stationary* target to sweep over, the
// same mechanism Connect's heading already uses for the same reason.
//
// 700px (the first working value) left ~500px of plain dark dead space
// pinned below the headline before the cover even started rising —
// exactly the "a lot of extra space" the empty screenshot showed. 150px
// swung too far the other way: covering was already 37% underway the
// instant the headline finished sticking, no beat to actually read it.
// 250px measured out to ~100px of dead time; bumped up per feedback that
// it could use a little more room to breathe.
const HEADLINE_HOLD = 350;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progress = useMotionValue(0);
  const collageY = useTransform(progress, EASE_STOPS, EASE_OUTPUT);
  const collageRotateX = useTransform(progress, EASE_STOPS, ROTATE_X_OUTPUT);
  const [headlineArrived, setHeadlineArrived] = useState(false);
  // Sizes the pin wrapper as exactly (headline's natural height) + HOLD,
  // same reasoning as ConnectSection's wrapperHeightPx: without measuring
  // the sticky child's real height and using it directly, native sticky
  // release would land at some arbitrary, viewport-dependent point rather
  // than exactly HOLD past where the headline actually settles.
  const [pinWrapperHeightPx, setPinWrapperHeightPx] = useState<number | null>(null);
  // Every phrase types in from the same fixed starting point, so left-
  // aligning them all makes shorter phrases ("I'm a dreamer") sit
  // noticeably left of where longer ones ("I'm a designer") end up. To
  // make the *longest* phrase land centered in the available width
  // instead — everything else then reads as "growing outward from
  // center" as it types — the actual rendered width of each phrase has to
  // be measured (character count isn't a reliable proxy for width in a
  // serif font), which changes with the responsive clamp()'d font-size.
  // Hidden measurement spans render every phrase off-screen in the exact
  // same font context (children of the same h1, so font-size/family
  // inherit identically) purely to read their widths.
  const [shiftPx, setShiftPx] = useState(0);

  useEffect(() => {
    function updateShift() {
      // Measuring headlineRef (the padded wrapper), not the h1 itself:
      // the h1 has `width: auto`, so once marginLeft is non-zero, the
      // h1's own rendered width already shrinks to absorb that margin —
      // measuring it here would feed the shifted width back into
      // computing the next shift, compounding on every re-run.
      // headlineRef's width is fixed by the section's layout and never
      // affected by the h1's margin.
      const wrapper = headlineRef.current;
      if (!wrapper) return;
      // getBoundingClientRect().width is the wrapper's border-box — it
      // still includes its own left/right padding (the lg:pl-[29.696%]
      // that positions the whole headline column), so it has to be
      // subtracted to get the actual content width the h1 renders into.
      const wrapperStyle = getComputedStyle(wrapper);
      const containerWidth =
        wrapper.getBoundingClientRect().width -
        parseFloat(wrapperStyle.paddingLeft) -
        parseFloat(wrapperStyle.paddingRight);
      const maxPhraseWidth = Math.max(
        0,
        ...measureRefs.current.map((el) => el?.getBoundingClientRect().width ?? 0),
      );
      // + CURSOR_WIDTH: centers the *visible block* a person actually
      // looks at (text plus the blinking cursor after it), not just the
      // bare text — see CURSOR_WIDTH's comment in TypewriterHeadline.tsx.
      setShiftPx(Math.max(0, (containerWidth - maxPhraseWidth - CURSOR_WIDTH) / 2));
    }

    updateShift();
    window.addEventListener("resize", updateShift);
    return () => window.removeEventListener("resize", updateShift);
  }, []);

  useEffect(() => {
    function updatePinHeight() {
      // Measuring stickyRef (headline + the trailing background-extending
      // spacer together), not headlineRef alone — the sticky child's real
      // rendered height includes both, and understating it here would
      // throw off exactly how long HEADLINE_HOLD actually holds for, the
      // same class of bug ConnectSection's wrapperHeightPx comment
      // describes.
      const sticky = stickyRef.current;
      if (!sticky) return;
      setPinWrapperHeightPx(sticky.getBoundingClientRect().height + HEADLINE_HOLD);
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
      data-nav-theme="dark"
      className="bg-[#262626]"
    >
      {/* First screen: collage only, unchanged from the approved layout.
          overflow-hidden lives here (not on the section itself anymore) —
          it clips the collage photos as they translate/tilt past their
          own bounds, but having it on an ancestor of the pinned headline
          below completely breaks position: sticky for that headline (a
          well-known CSS interaction — an overflow other than visible on
          *any* ancestor between a sticky element and its containing block
          disables the sticking entirely, which is exactly what happened
          here: the headline's sticky top-64px did nothing at all, its
          position just decreased 1:1 with scroll the whole time, until
          this was scoped down to only wrap what actually needs clipping. */}
      <div
        className="flex items-center overflow-hidden"
        style={{ minHeight: `calc(100vh - ${NAV_HEIGHT}px)` }}
      >
        <HeroCollage
          y={collageY}
          rotateX={collageRotateX}
          perspective={PERSPECTIVE_PX}
          progress={progress}
        />
      </div>

      {/* Headline pin wrapper: sized to (headline's natural height) +
          HEADLINE_HOLD so the sticky child below stays pinned at its
          resting position for that extra scroll distance before
          releasing — see HEADLINE_HOLD's comment for why this exists.
          Falls back to a plain height (no pin) before the first
          measurement runs, so there's no zero-height flash on load. */}
      <div
        style={pinWrapperHeightPx !== null ? { height: pinWrapperHeightPx } : undefined}
        className="relative"
      >
        {/* top-[64px] (NAV_HEIGHT) rather than top-0 so the pinned
            headline sticks just below the nav instead of underneath it. */}
        <div ref={stickyRef} className="sticky" style={{ top: NAV_HEIGHT }}>
          {/* Headline: already in the DOM at its resting position from the
              start, simply below the fold on load. Scrolling (plus the
              collage translating out of the way above) is what brings it
              into view; once reached, it now stays pinned there (see the
              pin wrapper above) instead of continuing to scroll away
              immediately. Only its text content animates on its own.
              Used to sit in a Figma-matched column starting at 29.696%
              from the left (lg:pl-[29.696%]) — dropped per feedback that
              the typewriter phrase should read as centered across the
              whole page, not just within that narrower column. The
              collage above sits in its own full-width row, not beside
              this one, so there's no layout reason to keep the offset.
              Padding is now symmetric at every breakpoint; shiftPx (see
              above) does the actual centering against this now-symmetric
              content width.
              Top padding is intentionally small — the headline only needs
              to stay below the fold, which is already guaranteed by
              sitting after a full-viewport-tall sibling above, not by its
              own padding. Bottom padding is kept larger for breathing
              room before whatever section follows. */}
          <div
            ref={headlineRef}
            className="px-5 pt-0 pb-24 sm:px-8 sm:pt-1 sm:pb-32 lg:px-8 lg:pt-[2px] lg:pb-40"
          >
            <h1
              className="relative text-[#E4E7EC]"
              style={{
                fontSize: `clamp(2.5rem, ${HEADLINE_FONT_SIZE_VW}vw, 5.625rem)`,
                marginLeft: shiftPx,
              }}
            >
              {/* Measurement-only, never shown — see shiftPx's comment
                  above. Split into the same two adjacent spans
                  TypewriterHeadline itself renders (rather than one span
                  with the full phrase) — measuring one continuous string
                  came out ~16px narrower than the live two-span version
                  actually renders, since splitting text across an element
                  boundary changes how the browser applies kerning versus
                  one unbroken text run. */}
              {PHRASES.map((phrase, i) => (
                <span
                  key={phrase}
                  ref={(el) => {
                    measureRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className="invisible absolute whitespace-nowrap"
                >
                  <span className="font-serif font-medium">{phrase.slice(0, PREFIX.length)}</span>
                  <span className="font-serif font-medium">{phrase.slice(PREFIX.length)}</span>
                </span>
              ))}
              <TypewriterHeadline phrases={PHRASES} start={headlineArrived} />
            </h1>
          </div>

          {/* Extends the section's black background past the headline's
              own bottom padding so the space below the headline matches
              the space above it. Trimmed 3px twice along with the top
              padding above per feedback that both gaps (shown to be
              matching) felt a touch too tall — only verified at the
              desktop (lg) breakpoint. */}
          <div className="h-[54px]" />
        </div>
      </div>
    </section>
  );
}
