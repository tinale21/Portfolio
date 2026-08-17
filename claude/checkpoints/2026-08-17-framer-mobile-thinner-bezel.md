# Checkpoint — Framer Before & After slider / prototype video: thinner mobile bezel

## Context

Continuing the mobile-issues pass on the Framer Redesign case study. Both media frames (the Before & After Overview drag slider and the Final Design prototype video) use a thick black "bezel" border (24px, originally sized for desktop). On mobile that border ate into a proportionally large share of the frame.

## Human directions

- "ok now for the mobile framer before & after overview and mobile framer final design video, can you make the black outline of it less thick and then you can then make the video and actual slider more bigger"

## Records of resistance / things I got wrong and had to correct

- Nothing to correct this pass — but worth noting the interpretation call: "make it less thick" and "make the video/slider bigger" read as two separate asks, but they're mechanically the same lever here. Both frames already fill 100% of the section's available width on mobile (`width: calc(100% - 2*border)`, a fixed point from an earlier overflow fix), so the frame's total footprint can't get any wider — the only way to grow the visible media is to shrink the border eating into that same footprint. Went with that single-lever interpretation rather than also breaking the frame out of the section's standard `px-5` side padding (a bigger, more novel structural change not clearly asked for) — flagged here in case the user meant something more dramatic and wants to say so.
- Picked 10px as the mobile border width (down from 24px) as a reasonable first pass, matching this codebase's established pattern of shipping a sensible default and refining on feedback rather than blocking on a pixel-exact spec upfront.

## Successes

- Root cause of "why can't this just be a JS constant like before": the two frames' border-width and outer width are coupled (content-box sizing means total on-screen size = content width + 2×border), and that coupling has to hold at *every* breakpoint to avoid reintroducing the horizontal-overflow bug from `2026-08-17-case-study-exploration-mobile-overflow.md`. A single JS `BORDER_WIDTH` constant driving an inline style couldn't express "10px on mobile, 24px on desktop" — moved both off inline styles and onto plain responsive Tailwind classes (`border-[10px] lg:border-[24px]`, `w-[calc(100%-20px)] lg:w-[calc(100%-48px)]`), which handle the breakpoint switch in pure CSS.
- The Before & After slider's drag math (`updateFromClientX`) read the old `BORDER_WIDTH` JS constant to convert pointer position into a content-relative percentage — with two different border widths at play, hardcoding either would break dragging at the other breakpoint. Replaced it with `getComputedStyle(el).borderLeftWidth`, read live at drag-time — correct at any breakpoint automatically, with no JS/CSS values to keep in sync.
- Removed the now-unused `BORDER_WIDTH`/`FRAME_MAX_WIDTH` (Before & After) and `PROTOTYPE_BORDER_WIDTH`/`PROTOTYPE_MAX_WIDTH` (Final Design) constants rather than leaving them as dead code.
- Verified via Puppeteer: mobile screenshots show a visibly thinner bezel and a proportionally larger interior slider/video on both frames; a simulated pointer drag on the mobile slider landed the divider handle at the mathematically correct position (287.5px, matching the hand-computed expectation from the live 10px border), confirming the computed-style-based drag fix works; desktop measurements are pixel-identical to before (border 24px, content width 1100px, total frame 1148px, matching the pre-change baseline exactly); full horizontal-overflow sweep across all four case studies still comes back at 0px.
- `npx tsc --noEmit` and `npx eslint` clean; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## State at this checkpoint

- **Modified** `FramerRedesignBeforeAfter.tsx`: border-width and outer width moved from inline styles (driven by a JS `BORDER_WIDTH` constant) to responsive Tailwind classes (10px mobile / 24px desktop, unchanged). Drag math now reads the live computed border width instead of a hardcoded constant.
- **Modified** `FramerRedesignFinalDesign.tsx`: same treatment applied to the prototype video's frame (no drag interaction there, so no JS math to update).

## Remaining mobile work

- None currently flagged. If 10px reads as too thin (or not thin enough) once seen live, it's a one-line change in both files' `border-[10px]` classes.
