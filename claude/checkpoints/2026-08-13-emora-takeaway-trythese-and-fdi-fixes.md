# Checkpoint — Emora Takeaway, Try These, and two Final Design Implementation fixes

## Context

Two Final Design Implementation follow-up fixes, then completed the Emora case study end to end by adding Takeaway and wiring in the shared Try These marquee.

## Human directions

- "for the video, increase the height; the tablet frame is cut off on the bottom and top" — video box aspect changed from `597/394` to `597/455`.
- "can you make sure the top of the title and description (e.g. Emora for Kids & it description) is aligned to the top of the video" — found (via close-up pixel measurement, not just the DOM bounding-box check) that the title text visually starts ~4px below the video's true top edge due to font leading, even though the boxes' `getBoundingClientRect()` values already matched exactly. Nudged the text column up 4px to correct the optical misalignment.
- "now add the takeaway and the if this caught your eye, try these sections. [reference screenshot]. use the same rule and motion as aig" — provided a full reference screenshot (Screenshot 2026-08-13 at 11.24.02 PM.png) with Takeaway's copy and a Try These marquee (thumbnails already showing AIG/Wayve/a fourth project, confirming Emora excludes itself the same way the other two case studies do).

## Records of resistance / things I got wrong and had to correct

- The alignment fix required catching a real gap between "the DOM boxes measure as aligned" and "it visually looks aligned" — `getBoundingClientRect()` on both the title paragraph and the video showed an exact 0px top difference, which could have been read as "already correct, nothing to do." Took a zoomed-in screenshot before concluding that, and it showed a clearly visible ~4px gap between the video's bezel edge and where the title's glyphs actually start (font line-height leading sits above the visible ink, inside the paragraph's own bounding box). Verified the fix the same way — pixel-measured the corrected close-up, not just re-checked the bounding boxes — since re-checking only the boxes would have "confirmed" the same false-positive alignment as before.

## Successes

- Correctly recognized "if this caught your eye, try these" needed zero new component work, same as it did for Wayve — the shared `TryTheseProjects` component (parameterized by `currentSlug`) is designed for exactly this reuse across every case study.
- For the alignment issue, didn't stop at the first (misleading) measurement that said everything was already correct — followed through with a more direct visual check when the user's report implied a real, visible problem the numbers weren't capturing.

## State at this checkpoint

- **Modified `src/components/case-studies/emora/EmoraFinalDesignImplementation.tsx`**: video box aspect ratio `597/394` → `597/455` (shows the full tablet bezel with no top/bottom crop); each row's title/description column gets `lg:relative lg:top-[-4px]` to visually align the text's glyph-top with the video's true top edge.
- **New `src/components/case-studies/emora/EmoraTakeaway.tsx`**: direct structural port of `AigTakeaway.tsx`, Emora's own copy transcribed from the reference screenshot.
- **Modified `src/app/work/emora/page.tsx`**: renders `<EmoraTakeaway />` after `<EmoraFinalDesignImplementation />`, then `<TryTheseProjects currentSlug="emora" />` — the Emora case study is now feature-complete end to end, matching Wayve's and AIG's full section sets.
- Verified: `npx tsc --noEmit` clean at each step; close-up pixel measurement confirms the video-title alignment fix (0px gap between bezel edge and glyph top, corrected from a ~4px gap); `TryTheseProjects` confirmed to exclude Emora and include aig/wayve/framer-redesign (9 links = 3 projects x 3 for the marquee loop); `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds; no new horizontal overflow beyond the pre-existing, unrelated Project Overview `w-[650px]` issue.

## Emora case study status

Complete: Hero, Project Overview, Key Contribution, Research Method, Key Findings, Our Design Principles, Final Design Implementation, Takeaway, Try These. No sections remain un-built — matches the full set already built for AIG and Wayve.
