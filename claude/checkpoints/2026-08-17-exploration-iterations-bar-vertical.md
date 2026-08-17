# Checkpoint — Revert Exploration & Iterations mobile bar to vertical

## Context

Direct follow-up to the same-day Exploration & Iterations mobile fix (`2026-08-17-case-study-exploration-mobile-overflow.md`). That pass added a *horizontal* progress bar on mobile (a deliberate reinterpretation, since desktop's vertical divider only makes sense between two side-by-side columns). The user watched their own screen recording and didn't want that interpretation — they wanted a vertical bar kept at every breakpoint.

## Human directions

- "ok on mobile the exploration & iterations scroll bar is weird, it is going horizontal rather than vertical" + a screen recording confirming the horizontal bar in place below each step's number badge.

## Records of resistance / things I got wrong and had to correct

- My earlier design choice (a full-width horizontal bar directly below the badge, reusing the same scroll progress as a new `barWidth` value) was a plausible-sounding "mobile-appropriate reinterpretation," but wrong — the user wanted the bar to just stay vertical, full stop, not be reinterpreted into a different axis. Lesson: when a desktop element doesn't have an obvious mobile equivalent, the safer default is to keep its core visual identity (orientation) and just adapt its size/position, not redesign its axis, unless asked.

## Successes

- Extracted frames from the user's screen recording via `python3`/`opencv` (no `ffmpeg` on this machine, but `cv2` was already available) to see the actual on-device behavior directly rather than guessing from the description alone.
- Fix was a straightforward unification, not a new build: removed the separate horizontal-bar block and its `barWidth` motion value entirely; the existing vertical divider (previously `hidden lg:block`, `self-stretch`) is now always rendered, with `h-16 w-[2px] self-center` as its mobile size and `lg:h-auto lg:self-stretch` restoring the exact original desktop behavior. Same `barHeight` motion value drives the fill at both breakpoints — one element, one code path, instead of two parallel bars.
- Also removed a leftover unused `COLUMN_WIDTH` constant in all three files (dead code from the still-earlier width-responsiveness fix, flagged by `eslint` as unused) while already in these files.
- Verified: `npx tsc --noEmit` and `npx eslint` clean; mobile screenshots (AIG, Wayve, Framer Redesign) confirm a short vertical bar now sits centered between the stacked image and text, filling top-to-bottom on scroll; desktop screenshots confirm byte-for-byte the same rendering as before (full-height divider between the two side-by-side columns); full horizontal-overflow sweep across all four case studies still comes back clean (0px) after the change; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## State at this checkpoint

- **Modified** `AigExplorationIterations.tsx`, `WayveExplorationIterations.tsx`, `FramerRedesignExplorationIterations.tsx`: removed the mobile-only horizontal bar entirely; the single vertical divider is now unconditional, sized `h-16 w-[2px] self-center` on mobile and `lg:h-auto lg:self-stretch` on desktop (unchanged desktop value). Removed the now-unused `barWidth` motion value and the dead `COLUMN_WIDTH` constant from all three files.
- Local dev server restarted after this pass (it had been left down from the prior verification round — user reported "my local server isn't working" mid-session, now confirmed serving on :3000).

## Remaining mobile work

- None currently flagged.
