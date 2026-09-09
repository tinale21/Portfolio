"use client";

import { useEffect, useRef } from "react";

// A muted/looping video that only plays once it's scrolled into view, and
// pauses when it leaves — used by the case studies' Final Design sections
// per direct instruction ("videos ... don't start playing until users
// scroll to the part"). Unlike the plain `autoPlay` attribute (which starts
// as soon as the browser allows, well before the section is on screen), all
// playback here is driven by an IntersectionObserver.
//
// - No `autoPlay` attribute — play()/pause() are called explicitly instead.
// - `muted` is kept because a programmatic play() without a user gesture is
//   only allowed for muted media (same constraint ProjectCard relies on).
// - `preload="metadata"` so the full video isn't downloaded up front (it
//   won't play until scrolled to anyway); the observer's 200px rootMargin
//   starts playback just before the element is fully visible, giving the
//   browser a moment to buffer so it isn't stalled on first view.
// - play() returns a promise that can reject (e.g. a browser still refusing
//   autoplay); swallowed, since the paused first frame is a fine fallback.
export function ScrollPlayVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px", threshold: 0 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      loop
      muted
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
