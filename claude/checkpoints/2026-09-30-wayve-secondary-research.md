# Checkpoint — Wayve "Secondary Research" section

## Context

Replicates the AIG Secondary Research section in the Wayve case study, same spot (between Research Method and Key Findings), same layout/spacing, with Wayve's own links.

## Human directions

- "add the same secondary research section in my Wayve case study ... between the Research Method and Key Findings. Same positioning and spacing, we are just replacing the links." Provided 3 card links (title + image) and 5 more URL-pill links.

## Records of resistance / things I got wrong and had to correct

- Mapped the 3 supplied images to their articles/files: MIDiA "All eyes, no ears" → `cover_image-1758030618.png` (orange silhouettes); Spotify "Culture Next 2024" → `CULTURE-NEXT-REPORT_COVER-1-1-1440x733.jpg`; Luminate "2024 Year-End Music Report" → `music-year-end-cover.avif`. Processed all to 800px-wide WebP (PIL read the `.avif` fine on this Pillow 12.3). Stripped the `?utm_source` params from every href/display.
- Kept it as a **separate copy** (`WayveSecondaryResearch.tsx`) rather than sharing one component with AIG — matches the codebase's per-case-study duplication pattern and lets each section's scatter be tuned independently later. Reused the exact same `LAYOUT` (3 cards + 5 pills = 8 entries, matching AIG's current state) and section spacing (`pt-16 pb-32`) so they start visually identical.
- Fixed a real wrapping bug the longer Wayve URLs exposed: the frontiersin URL overflowed its pill to the right because the pill's text (a flex item) has default `min-width: auto` and can't shrink below the URL's intrinsic width, so `break-words` never engaged. Added `min-w-0` to the pill's text span so it shrinks and the URL wraps within the pill. (AIG's shorter URLs didn't trigger this; left AIG as-is.)

## State at this checkpoint

- **Added** `src/assets/case-studies/wayve/secondary/{midia,culturenext,luminate}.webp` (the 3 card thumbnails, 8-36KB each).
- **Added** `src/components/case-studies/wayve/WayveSecondaryResearch.tsx`: same design as AIG's (overlapping collage desktop / stacked feed mobile), 3 article cards + 5 URL pills, all-`%` LAYOUT identical to AIG's, `min-w-0` added on the pill text span.
- **Modified** `src/app/work/wayve/page.tsx`: imported and placed `<WayveSecondaryResearch />` between `<WayveResearchMethod />` and `<WayveKeyFindings />`.

## Verification

- Screenshots: desktop matches the AIG collage layout with Wayve's cards/pills; the long frontiersin URL now wraps inside its pill; mobile stacks cleanly.
- All links are real `target="_blank"` anchors (utm params stripped).
- Overflow sweep on `/work/wayve` (scrolling) at 1512/1280/1024/768/390: 0px.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.

## Remaining work

- None flagged. Positions live in `WayveSecondaryResearch.tsx`'s `LAYOUT` (indexed to `ITEMS`), tunable independently of AIG's.
