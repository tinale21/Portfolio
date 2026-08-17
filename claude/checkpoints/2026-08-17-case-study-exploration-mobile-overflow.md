# Checkpoint — Case study mobile fixes: Exploration & Iterations motion, Framer horizontal-scroll, Wayve scales overflow

## Context

Continuing the mobile-issues pass. Three related problems reported in one request:
1. The "Exploration & Iterations" section's progress bar (image ↔ text divider that fills as you scroll) was completely missing on mobile for AIG, Wayve, and Framer Redesign — it was wrapped in `hidden lg:block`, so mobile users saw no motion at all.
2. On the Framer Redesign case study, the Before & After Overview slider and the Final Design prototype video didn't align with the right padding on mobile and caused horizontal page scroll.
3. Possible horizontal-scroll issues on the other case studies too.

## Human directions

- "ok now for the mobile case studies, can you fix the exploration & iterations section for them so that the motion works correctly. this might also require you to scale the image down. right now the active/deactive bar is not there for when users scroll. also for the framer case study can you scale the before & after overview slider, as well as the final design video because it seems to not align with the right padding which is making the screen have a horizontal scroll; this horizontal scroll might also be an issue with the other case studies on mobile. there should only be a vertical scroll."

## Records of resistance / things I got wrong and had to correct

- Nothing required correction from the user this pass — but during the audit (part 3) I found a bug the user hadn't explicitly named: Wayve's "How Wayve Scales" section (the scalloped photo band with 5 numbered captions) overflowed by 148px on mobile — much larger than the other, purely-cosmetic-padding issues. Diagnosed and fixed it proactively as part of the requested audit rather than leaving it flagged-but-unfixed, since the user's own words ("this horizontal scroll might also be an issue with the other case studies") directly asked for this check.

## Successes

- Root cause for (1) was the same recurring pattern already seen this session (desktop-tuned pixel values / hidden-below-lg elements with no mobile equivalent): the vertical divider had `hidden lg:block`, and the column blocks used a fixed `style={{width: 380}}` with no responsive fallback. Fixed identically across `AigExplorationIterations.tsx`, `WayveExplorationIterations.tsx`, `FramerRedesignExplorationIterations.tsx`:
  - `imageBlock`/`textBlock`: `w-full max-w-[380px] ... lg:w-[380px]` (was a bare inline `width: 380`) — this also scales the image down automatically since `<Image>` uses `h-auto w-full` inside.
  - Added a new mobile-only **horizontal** progress bar (`lg:hidden`) between the badge and the image/text content, reusing the same scroll-linked `barWidth` motion value the desktop vertical bar (`barHeight`) already used — a mobile-appropriate reinterpretation, not a literal "un-hide," since desktop's vertical divider only makes sense between two side-by-side columns, which don't exist once mobile stacks them.
  - Outer section wrapper: `w-fit` → `w-full max-w-[380px] ... lg:w-fit lg:max-w-none` on all three files — `w-fit` doesn't respect a narrower ancestor, so this had to change too or the inner `max-w-[380px]` caps wouldn't actually constrain anything.
- Root cause for (2): both `FramerRedesignBeforeAfter.tsx`'s slider frame and `FramerRedesignFinalDesign.tsx`'s prototype video frame used `w-full` combined with `box-sizing: content-box` and a 24px border. Under `content-box`, `width` sizes the *content* box only — the border gets added *on top of* the already-100%-wide content, so the element's total rendered width was always exactly `2 × BORDER_WIDTH` (48px) wider than its available space. On desktop this was masked because `max-width: 1100` capped the content well below the overflow threshold; on mobile nothing capped it, so it always overflowed by 48px. Fixed by changing the width formula itself (not just gating it behind a breakpoint — this was a genuine box-model bug, not a missing-responsive-value one) from `w-full` to an inline `width: calc(100% - ${BORDER_WIDTH * 2}px)`, keeping the same `maxWidth` cap. Verified this leaves desktop rendering byte-for-byte the same (the `calc()` value still exceeds 1100 at desktop widths, so `max-width` still wins there, same as before).
- Root cause for (3), the newly-found Wayve bug: `WayveHowWayveScales.tsx`'s 5 item captions were positioned via `left: {percent}%` + `whitespace-nowrap` on text up to 59px, tuned against the 1396px desktop SVG's own proportions — nowrap text ignores its container width, so items past ~40% `left` ran straight off the right edge of a 390px viewport (measured 148px overflow). This entire treatment (scalloped SVG photo band + absolute captions) has no meaningful narrower rendering, so rather than trying to compress it, added a genuinely separate mobile-only stacked layout (`lg:hidden`): each of the 5 items as photo thumbnail + number + heading + description in a plain vertical list, reusing the same photo assets. The existing desktop treatment was wrapped in `hidden lg:block` and is otherwise untouched.
- Verified via a full scroll sweep (13 checkpoints from top to bottom) that all four case studies — AIG, Wayve, Emora, Framer Redesign — now report zero horizontal overflow (`document.documentElement.scrollWidth === clientWidth`) on mobile (390px), not just at the specific sections touched this pass. AIG and Emora were already clean.
- Verified desktop (1512px) renders pixel-identical to before for every file touched: Exploration & Iterations' vertical dividers/side-by-side columns/tilted images (AIG, Wayve, Framer), the Before & After slider and prototype video frames, and Wayve's scalloped photo band with absolute captions.
- `npx tsc --noEmit` and `npx eslint` clean; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds for all 8 static routes.

## State at this checkpoint

- **Modified** `AigExplorationIterations.tsx`, `WayveExplorationIterations.tsx`, `FramerRedesignExplorationIterations.tsx`: mobile-responsive column widths, new mobile-only horizontal progress bar, outer wrapper `w-fit` → responsive.
- **Modified** `FramerRedesignBeforeAfter.tsx`, `FramerRedesignFinalDesign.tsx`: fixed the `content-box` + `w-full` + border overflow bug via an explicit `calc()` width.
- **Modified** `WayveHowWayveScales.tsx`: added a new `lg:hidden` mobile stacked-list fallback; existing desktop treatment now wrapped in `hidden lg:block`, otherwise unchanged.
- Emora has no Exploration & Iterations-equivalent section (`EmoraDesignPrinciples.tsx` is a different icon-card layout) — nothing to fix there for part (1).

## Remaining mobile work

- None currently flagged. Full horizontal-overflow sweep across all four case studies came back clean at every scroll depth.
- The previously-flagged `w-[650px]` Project Overview overflow issue (see `2026-08-17-case-study-overview-mobile-spacing.md`) no longer reproduces in this session's sweep — not verified further since it wasn't the target of this pass, but worth a quick recheck if it resurfaces.
