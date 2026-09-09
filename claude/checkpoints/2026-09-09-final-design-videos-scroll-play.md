# Checkpoint — Final Design videos only play when scrolled into view

## Context

The videos in each case study's Final Design section used the plain `autoPlay` attribute, so they started playing (and buffering) as soon as the browser allowed — long before the user scrolled down to that section.

## Human directions

- "can you also make sure videos in the final design sections don't start playing until users scroll to the part"

## Records of resistance / things I got wrong and had to correct

- Rather than bolt an IntersectionObserver into each of the four Final Design components inline, extracted a single reusable `ScrollPlayVideo` client component — the same play-on-view pattern already used by `ProjectCard`, but with pause-on-leave added (ProjectCard only ever plays). Keeps all four sections consistent and the logic in one place.
- Kept `muted` (dropped only the `autoPlay` attribute): a programmatic `play()` without a user gesture is only permitted on muted media, the same constraint ProjectCard depends on. Removing `muted` would have made the observer's `play()` call silently rejected.
- Used `preload="metadata"` (not the browser default/`auto`) so the full video isn't fetched up front — it won't play until scrolled to anyway — with a 200px observer `rootMargin` so playback/buffering kicks off just before the element is fully on screen, avoiding a stall on first view.
- Framer's Final Design has two kinds of video (the phone-frame prototype plus the 5 screen rows); swapped both, preserving the prototype's `object-contain lg:object-cover` className (moved its explanatory note to a JSX comment since the old inline `//` comment lived inside the `<video>` tag).

## State at this checkpoint

- **Added** `src/components/case-studies/ScrollPlayVideo.tsx`: a `"use client"` muted/looping `<video>` with no `autoPlay`, driven by an IntersectionObserver (`play()` on enter, `pause()` on leave; `rootMargin: 200px`; `preload="metadata"`). Accepts `src` and `className`.
- **Modified** `AigFinalDesignImplementation`, `WayveFinalDesignImplementation`, `EmoraFinalDesignImplementation`, `FramerRedesignFinalDesign`: replaced each inline `<video autoPlay loop muted playsInline>` with `<ScrollPlayVideo>` and added the import. (Framer: both its prototype video and its 5 screen videos.)
- Left the Lightbox modal videos, hero videos, and other sections' videos unchanged — only the Final Design sections were in scope.

## Verification

- Puppeteer (AIG): at page top all 5 Final Design videos report `paused:true, currentTime:0`; after scrolling to the "Final Design Implementation" heading, only the videos now in view are playing (`paused:false`, time advancing) while the ones still below stay paused until reached.
- Puppeteer (Framer): same behavior across its prototype + 5 screen videos.
- Overflow sweep on all four case study pages at 1512px and 390px: 0px.
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Remaining work

- None for the requested scope. If the hero or other-section videos should get the same treatment later, they can reuse `ScrollPlayVideo` directly.
