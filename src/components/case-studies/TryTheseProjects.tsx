"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BASE_PATH } from "@/lib/base-path";
import { PROJECTS } from "@/components/projects/projects-data";

// Figma dev-mode inspect. Solid, directly-read values:
// - "If This Caught Your Eye, Try These" label: Inter 16px/400, #707682.
// - Card: 530x286px, 10px corner radius. Emora's card also gets a 1px
//   solid #F4F4F5 border (its video's own background is white, which
//   would otherwise be indistinguishable from the section's white
//   background — the same reasoning as ProjectCard's `bordered` flag,
//   reused directly from projects-data.ts here rather than duplicated).
// - Reuses the same video/poster assets already established for the
//   homepage/Work page project grid — no new assets needed.
//
// Not directly confirmed by any redline: the gap between cards (used
// 32px, a clean round value) and the loop's own speed (30s per full
// cycle — an aesthetic choice, not measurable from the reference).
// Section's own top padding bumped from pt-16 to pt-28 per direct
// feedback, for more breathing room below Takeaway (the section that
// directly precedes this one). Bottom padding likewise bumped from
// pb-16 to pb-28, for more room above the footer.
//
// Per direct feedback, cards should be clipped at the standard page
// padding rather than scrolling across the full viewport width. The
// padding and the overflow-hidden clip can't live on the same element
// for this: overflow-hidden clips at an element's own padding-box
// *outer* edge, so padding inside an overflow-hidden element doesn't
// actually cut content there — it just adds blank space inside the
// already-full-width clip boundary. Split into two nested divs
// instead: the outer one carries the padding (establishing the same
// content width as every other section), the inner one carries
// overflow-hidden with no padding of its own, so its clip boundary
// sits exactly at that already-inset edge.
//
// Motion: per direct instruction ("there should be no breaks"), this
// is a continuous, seamless auto-scrolling marquee — not a paginated
// or snap-scroll carousel. Implemented via the standard technique: the
// (already-filtered) project list is tripled end-to-end, and the whole
// track animates from x:0 to x:-(one full set's width) on an infinite
// linear loop. Because the 2nd copy's content is pixel-identical to
// the 1st copy's, the loop's snap-back from -100% to 0% is invisible —
// tripling (rather than just doubling) leaves a safety margin of extra
// cards so the strip never visibly runs out before the loop resets,
// even on very wide viewports.
//
// currentSlug excludes that project from the strip (a case study
// shouldn't recommend itself) — this component is meant to be reused
// on every case study page, not just AIG's.
const CARD_WIDTH = 530;
const CARD_HEIGHT = 286;
const CARD_GAP = 32;
// Per direct feedback, the 530x286 card (fine on desktop) was wider
// than the entire mobile viewport, so only a sliver of one card's
// video was ever visible at a time as the marquee scrolled by. Scaled
// down to roughly half size, keeping the same ~1.85:1 aspect ratio
// (object-cover on the video absorbs the small rounding difference,
// same as it already does for any source video whose native ratio
// doesn't match the card exactly).
const MOBILE_CARD_WIDTH = 280;
const MOBILE_CARD_HEIGHT = 150;
const MOBILE_CARD_GAP = 16;
const LOOP_DURATION_SECONDS = 30;
// Matches Tailwind's `lg`, same query HeroSection.tsx already uses for
// its own viewport-dependent motion.
const DESKTOP_QUERY = "(min-width: 1024px)";

export function TryTheseProjects({ currentSlug }: { currentSlug: string }) {
  const projects = PROJECTS.filter((project) => project.slug !== currentSlug);
  const track = [...projects, ...projects, ...projects];

  // The marquee's translateX distance has to match whichever card size
  // is actually rendered, or the loop's snap-back point drifts from
  // where the 2nd copy of the strip visually begins — same matchMedia-
  // driven pattern already used for the Framer bezel/tilt fixes.
  // isDesktop starts false (mobile sizing) until this effect resolves
  // it on mount, same one-frame correction those fixes already accept.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const cardWidth = isDesktop ? CARD_WIDTH : MOBILE_CARD_WIDTH;
  const cardHeight = isDesktop ? CARD_HEIGHT : MOBILE_CARD_HEIGHT;
  const cardGap = isDesktop ? CARD_GAP : MOBILE_CARD_GAP;
  const setWidth = projects.length * (cardWidth + cardGap);

  return (
    <section data-nav-theme="light" className="bg-white pt-28 pb-28">
      <p className="px-5 font-sans text-base text-[#707682] sm:px-8 lg:px-[68px]">
        If This Caught Your Eye, Try These
      </p>

      <div className="mt-8 px-5 sm:px-8 lg:px-[68px]">
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            style={{ gap: cardGap }}
            animate={{ x: [0, -setWidth] }}
            transition={{ duration: LOOP_DURATION_SECONDS, repeat: Infinity, ease: "linear" }}
          >
            {track.map((project, i) => (
              <Link
                key={`${project.slug}-${i}`}
                href={`/work/${project.slug}`}
                aria-label={`View ${project.name} project`}
                className={`relative block shrink-0 overflow-hidden rounded-[10px] ${
                  project.bordered ? "border border-[#F4F4F5]" : ""
                }`}
                style={{ width: cardWidth, height: cardHeight }}
              >
                <video
                  src={`${BASE_PATH}${project.videoSrc}`}
                  poster={`${BASE_PATH}${project.posterSrc}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
