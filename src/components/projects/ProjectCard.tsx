"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BASE_PATH } from "@/lib/base-path";
import { BADGE_FADE_TRANSITION, BADGE_LAYOUT_TRANSITION } from "./badge-transition";
import { Project } from "./projects-data";

// Per the Work page's Figma prototype (motion reference video): hovering a
// card crossfades the bottom-left badge from "{name} · {year}" to a short
// description, with the pill's own width animating to fit — reverts on
// mouse-leave. `layout` on the pill handles the width animation; `AnimatePresence
// mode="popLayout"` takes the exiting text out of flow immediately so that
// resize isn't fighting the outgoing element's own space.
//
// The two text spans inside AnimatePresence also need their own `layout`
// prop, or the parent's width-resize (which Framer Motion implements via a
// scale transform, not literal width interpolation) visibly stretches/
// squishes them for a frame instead of un-scaling them back to normal —
// caught on video: hovering out showed the outgoing and incoming text
// overlapping and horizontally warped for a split second.
//
// The pill also needs overflow-hidden: measured via Puppeteer that the
// text's opacity fade (a flat 280ms) reaches ~77% before the pill's spring
// -driven width is even half-grown for a big text-length jump like
// Wayve's, so the incoming text visibly stuck out past the pill's white
// background for the transition's first ~100ms. Clipping to the pill's
// own (animating) width turns that into a clean wipe-reveal instead.
// Reported on mobile: cards were showing a play button and not
// autoplaying — this is a well-known mobile-browser gap, not something
// specific to this component. The bare `autoPlay` HTML attribute is
// unreliable on mobile Safari/Chrome, especially with several videos
// autoplaying on the same page at once (this grid has one per project);
// browsers commonly ignore it there even though it's muted+playsInline
// and would otherwise be allowed to autoplay. The robust fix is to also
// explicitly call video.play() from JS once the element has mounted and
// is in view, via IntersectionObserver, rather than relying solely on
// the attribute. play() returns a promise that can reject (e.g. if the
// browser still refuses), so the rejection is swallowed — there's no
// fallback UI to show either way, and the poster frame is a reasonable
// static result if it does fail.
//
// Still reported broken on a real device after that first pass, on a
// cold/first load specifically. Two follow-up changes, both defensive
// against the most likely *timing* cause (the IntersectionObserver firing
// before the video has buffered enough to actually start): preload="auto"
// asks the browser to prioritize fetching this video's data immediately
// rather than deferring it, and a second play() attempt is wired to the
// loadeddata event (gated by the same isIntersecting flag), covering the
// case where intersection fires first but the browser wasn't ready to
// play yet. attemptPlay is idempotent (play() on an already-playing video
// is a harmless no-op), so calling it from two triggers can't double-play
// or otherwise misbehave.
//
// Important caveat if this still doesn't resolve it: some mobile browsers
// expose a hard, user-level autoplay preference (iOS Safari: Settings >
// Safari > Auto-Play > "Never Auto-Play") that blocks *all* autoplay,
// muted or not, regardless of any JS play() call — no web-side code can
// override that. If the symptom persists after this change, that's worth
// checking on the actual device before assuming it's still a code bug.
export function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const showDescription = hovered && project.description;
  const videoRef = useRef<HTMLVideoElement>(null);
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = () => {
      if (isIntersectingRef.current) {
        video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) attemptPlay();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    video.addEventListener("loadeddata", attemptPlay);
    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", attemptPlay);
    };
  }, []);

  return (
    <Link
      href={`/work/${project.slug}`}
      aria-label={`View ${project.name} project`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative block aspect-[670/337] overflow-hidden rounded-[10px] ${
        project.bordered ? "border border-[#F4F4F5]" : ""
      }`}
    >
      <video
        ref={videoRef}
        // videoSrc/posterSrc are plain public/ paths, not next/image or
        // next/link — Next doesn't auto-prefix those with basePath, so it
        // has to happen here (see src/lib/base-path.ts).
        src={`${BASE_PATH}${project.videoSrc}`}
        poster={`${BASE_PATH}${project.posterSrc}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />
      <motion.span
        layout
        transition={{ layout: BADGE_LAYOUT_TRANSITION }}
        className={`absolute bottom-2.5 left-2.5 flex h-[27px] items-center overflow-hidden rounded-full bg-white px-3 ${
          project.bordered ? "border border-[#F4F4F5]" : ""
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {showDescription ? (
            <motion.span
              key="description"
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ layout: BADGE_LAYOUT_TRANSITION, opacity: BADGE_FADE_TRANSITION, y: BADGE_FADE_TRANSITION }}
              className="whitespace-nowrap text-xs font-semibold text-black"
            >
              {project.description}
            </motion.span>
          ) : (
            <motion.span
              key="name-year"
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ layout: BADGE_LAYOUT_TRANSITION, opacity: BADGE_FADE_TRANSITION, y: BADGE_FADE_TRANSITION }}
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <span className="text-xs font-semibold text-black">{project.name}</span>
              <span className="text-xs font-semibold text-[#A1A1AA]">· {project.year}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </Link>
  );
}
