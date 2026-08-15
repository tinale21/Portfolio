# Checkpoint — Framer Redesign Before & After Overview

## Context

Built a genuinely new, interactive section format: a drag-to-reveal before/after image comparison slider, the first custom-interaction component in this whole project (everything before this has been scroll-triggered motion, not user-draggable).

## Human directions

- "the next section is a Before & After Overview. this is a new format. here, i want to have a slider that users can scroll to see the before workspace of framer and the after with our new redesign workspace: [reference screenshot]. this is a reference for the motion of the slider" — then, after an interruption, the full request: motion reference recording (Screen Recording 2026-08-14 at 10.55.07 PM.mov), a live external reference site (nathanhines.design/project/stellar-menus-platform, which the recording shows the user navigating to and demonstrating the slider drag), and the two actual Before/After screenshots (Screenshot 2026-08-03 at 1.09.07 PM.png / ...1.10.27 PM.png).

## Records of resistance / things I got wrong and had to correct

- Wrote the component using `BASE_PATH`-prefixed raw `<img src>` paths pointing at `public/projects/`, matching this project's video-asset pattern — but the images had actually been saved to `src/assets/case-studies/framer-redesign/before-after/`, the location used for every other *static image* in this codebase (team photos, icons), which are imported and used via Next.js's static-import `<Image src={imported} />` pattern instead. Caught the inconsistency before verifying and switched to the correct, already-established pattern rather than leaving two different conventions for images vs. videos to look accidental.
- First verification screenshot appeared to show the Hero section instead of the new Before & After section, despite selecting `sections[sections.length - 1]` (correctly the last section, confirmed by listing all sections' text). This was the exact same document-relative vs. viewport-relative `clip` coordinate bug already found and fixed once this session (Emora's Research Method checkpoint) — `elementHandle.boundingBox()` returns viewport-relative coordinates, but `page.screenshot({clip})` needs document-relative ones after scrolling. Recognized the symptom immediately from having hit it before and applied the same fix (add `window.scrollX`/`scrollY`) rather than re-diagnosing from scratch.

## Successes

- Sampled the reference screenshot's actual colors (bezel/handle `#1D1D1D`, label pill `#363636`) directly rather than guessing "black," consistent with the color-sampling approach already used for Exploration & Iterations' badge/divider colors in this same project.
- Correctly read the motion reference as a "settle-in wiggle" hint animation (a brief nudge each direction before resting at center) rather than a literal sweep demo, and implemented it as a single `MotionValue` driving both the clip-path and handle position — so the mount-time animation and drag-updated position share one source of truth instead of two competing state values that could visibly conflict.
- Built the drag interaction with Pointer Events (not mouse-only handlers), so it works for touch input as well as mouse, without being asked — the reference's own interaction pattern (a draggable slider) inherently needs to support both on a public-facing site.
- Verified the drag interaction actually functions (not just the rest-state layout) by simulating a real pointer-down/move sequence in Puppeteer and confirming the handle and clip boundary moved to the expected position, rather than only screenshotting the static initial state.

## State at this checkpoint

- **New `src/components/case-studies/framer-redesign/FramerRedesignBeforeAfter.tsx`**: a `"use client"` component using a single Framer Motion `MotionValue` (0-100, the divider's percentage position) to drive both the "before" image's `clip-path` and the divider/handle's `left` offset. Pointer Events power the drag (`onPointerDown`/`onPointerMove` with `setPointerCapture`); a `useEffect` runs a one-time `animate()` wiggle (50 → 34 → 66 → 50) on mount. Frame is a `border-[16px]` bezel at `#1D1D1D` (color-sampled from the reference), `Before`/`After` pill labels at `#363636` pinned to the bottom corners.
- **New `src/assets/case-studies/framer-redesign/before-after/{before,after}.jpg`**: the two provided screenshots, resized to 1800x923 preserving their shared native aspect ratio.
- **Modified `src/app/work/framer-redesign/page.tsx`**: renders `<FramerRedesignBeforeAfter />` after `<FramerRedesignExplorationIterations />`.
- Verified: `npx tsc --noEmit` clean; screenshot at rest and after a simulated drag; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds; no new horizontal overflow.

## Follow-up: swap before/after sides, stop cropping

Per direct feedback ("the before and after images are switched. is there a way so that the before and after are not cut off. you can make it centered rather than stretching it out to the left and right padding"):

- **Images were switched**: the first pass had "before" as the always-visible base layer and "after" clipped in from the left — which put After's content on the left of the divider and Before's on the right, backwards from the labels themselves. Swapped so the base layer is "after" (visible past the divider, on the right) and the clipped top layer is "before" (visible up to the divider, on the left), matching the label placement.
- **Images were cropped**: the frame used an approximated `1172:629` aspect with `object-cover`, which didn't match the actual images' `1800:923` ratio and cropped both. Changed the frame's `aspect-ratio` to the images' own exact `1800:923` (so `object-contain` needs to do no letterboxing at all — cover and contain now behave identically since the ratios match precisely) and switched to `object-contain` explicitly per "not cut off."
- **Full-width → centered**: per "centered rather than stretching it out to the left and right padding," dropped the `lg:px-[68px]`-stretching `w-full` frame in favor of `mx-auto` with a fixed `max-width: 1100px` — a smaller, centered showcase in the same spirit as Exploration & Iterations' own fixed-width treatment, rather than this project's default full-width-per-section pattern.
- Re-verified both the rest state and a simulated drag after the changes: correct before/after alignment confirmed, previously-cropped content (the "Talented Personalization" title, the "Looking for something specific?" hint text) now fully visible; no new overflow; production build succeeds.

## Remaining Framer Redesign work

Everything past Before & After Overview — whatever sections the reference design calls for next (e.g. Takeaway, Try These) — is not yet built.
