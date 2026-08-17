# Checkpoint — Framer mobile: tighter Before & After / Final Design spacing

## Context

Same-day follow-up to the thinner-bezel fix (`2026-08-17-framer-mobile-thinner-bezel.md`) on the Framer Redesign case study. Two more desktop-tuned gaps around the Before & After Overview slider were unconditionally large on mobile.

## Human directions

- "ok great. for the mobile framer, can you put less space between the 'Before & After Overview' title and the slider, as well as less space between the slider and the Final Design section"

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — same recurring root-cause pattern as every other spacing fix this session (a desktop-measured pixel value applied with no breakpoint gating). No exact target was given ("less space," not a number), so picked reasonable mobile values consistent with this codebase's existing rhythm rather than blocking on a pixel-exact spec.

## Successes

- **Title → slider gap** (`FramerRedesignBeforeAfter.tsx`): the slider frame's own `mt-[130px]` was unconditional. Changed to `mt-8 lg:mt-[130px]` — `mt-8` (32px) matches the same title-to-content gap already used right after "Exploration & Iterations" own title elsewhere in this codebase, rather than inventing a new value. Desktop's exact original 130px preserved via `lg:`.
- **Slider → Final Design gap**: this is actually two paddings meeting at the section boundary — `FramerRedesignBeforeAfter`'s own `pb-16` (64px) plus `FramerRedesignFinalDesign`'s `pt-[122px]` (122px), totaling 186px. The 122px top padding was clearly the dominant contributor (same value shared, unrelated, by three *other* sections in this codebase — AIG's and Wayve's own Exploration & Iterations, and this project's own — so changed only `FramerRedesignFinalDesign`'s copy of it, not the shared value elsewhere, to avoid touching unrelated sections). Changed to `pt-16 lg:pt-[122px]` (64px mobile, matching `pb-16` for a symmetrical, tighter transition). Left `pb-16` itself unchanged — already a modest, standard-looking gap, not the oversized contributor.
- Verified via Puppeteer: mobile gap measurements are exactly 32px (title→slider, down from 130px) and 128px (slider→Final Design, down from 186px); desktop measurements are unchanged at 130px and 186px respectively; full horizontal-overflow sweep across all four case studies still comes back at 0px.
- `npx tsc --noEmit` and `npx eslint` clean; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## State at this checkpoint

- **Modified** `FramerRedesignBeforeAfter.tsx`: slider frame's `mt-[130px]` → `mt-8 lg:mt-[130px]`.
- **Modified** `FramerRedesignFinalDesign.tsx`: section's `pt-[122px]` → `pt-16 lg:pt-[122px]`.

## Remaining mobile work

- None currently flagged.
