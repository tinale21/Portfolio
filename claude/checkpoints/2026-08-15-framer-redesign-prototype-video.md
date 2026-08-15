# Checkpoint — Framer Redesign prototype video

## Context

Added the interactive prototype video below the Final Design intro copy, reusing the Before & After Overview slider's exact bezel treatment per direct instruction.

## Human directions

- "ok next below the final design copy, i have a video of the prototype. the video also have an outline; use the one similar to the outline of the slider with the same thickness and corner rounding. [motion reference recording] [reference screenshot]. The video: Screen Recording 2026-07-22 at 10.34.12 PM.mov"
- "don't trim the video down, keep it the full length. also can you scale it down a bit so it centered; it doesn't have to go from the right padding to the left padding." — follow-up correction after the first pass.

## Records of resistance / things I got wrong and had to correct

- Reusing the already-established (and already-debugged) bezel constants from `FramerRedesignBeforeAfter.tsx` (border width, color, `box-sizing: content-box` fix for aspect-ratio-vs-border interaction) avoided re-introducing the uneven-border bug found and fixed there.
- First pass trimmed the video to 40s and stretched the box full-width (`lg:px-[68px]`), following this project's usual background-video loop-length and full-width conventions. User corrected both: keep the complete 2:03 recording untrimmed, and shrink/center the box instead of stretching it — re-encoded the source without the `-t` trim flag (full length, same 1800px-wide scale) and capped the box at the same `max-width: 1100px` / `mx-auto` treatment the Before & After slider itself uses, rather than the section's default full-width stretch.

## Successes

- Before trimming the 2-minute-3-second source video, sampled frames across its *entire* runtime (not just the start) to confirm there was no sensitive content anywhere in it, following the same caution applied to the Emora "for kids" video and the Framer Exploration & Iterations "Prototype" image earlier in this project.
- Reused the slider's exact bezel styling (24px `#1D1D1D` border, `rounded-[12px]`, `box-sizing: content-box`) rather than re-deriving it, per explicit instruction — and because that treatment had already been debugged once (the uneven-border/drag-overflow issue), reusing it directly sidesteps re-introducing the same bug in a new component.

## State at this checkpoint

- **Modified `src/components/case-studies/framer-redesign/FramerRedesignFinalDesign.tsx`**: adds a centered, capped-width (`max-width: 1100px`, `mx-auto`) video box below the existing intro block, using the same bezel constants/technique as `FramerRedesignBeforeAfter.tsx` (24px `#1D1D1D` border, `rounded-[12px]`, `box-sizing: content-box`), with the frame's `aspect-ratio` set to the video's own exact native ratio (1800:994) so no cropping is needed.
- **New `public/projects/framer-redesign-prototype.mp4`** (5.9MB, 1800x994, full 2:03.35 length, no audio): scaled (not trimmed) from the 3456x1908, 2:03-long source, no crop.
- Verified: `npx tsc --noEmit` clean; video confirmed `readyState: 4` at the correct 1800x994 resolution; screenshot comparison confirms the box is now visibly smaller than the section's text columns and centered, not stretching from the left to right page padding; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds with the video path correctly prefixed (`grep` on the built HTML confirms `/Portfolio/projects/framer-redesign-prototype.mp4`); no new horizontal overflow beyond the pre-existing, unrelated Project Overview `w-[650px]` issue.

## Follow-up: intro-to-video spacing

- "add more space between the final design and the video" — increased the gap between the intro copy block and the video box from `mt-16` (64px) to `mt-24` (96px). Verified via Puppeteer measurement (gap grew as expected) and screenshot comparison; `npx tsc --noEmit` clean.

## Remaining Framer Redesign work

Everything past the Final Design section — Takeaway, Try These, and whatever else the reference design calls for — is not yet built.
