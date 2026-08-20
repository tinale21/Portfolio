# Checkpoint — Hero collage portrait photo swap (fourth time): AI-retouched hair texture

## Context

Fourth swap of the same hero collage portrait slot in one continuous session (`2026-08-13-hero-portrait-photo-swap.md`, `2026-08-20-hero-portrait-photo-swap-2.md`, `2026-08-20-hero-portrait-photo-swap-3.md`). Same pose/backdrop as the immediately prior version, but run through an AI touch-up pass on the hair specifically (source filename: "...can you make the hair texture more natural looking and less oilly...") — same person/photo, refined texture.

## Human directions

- "can you do this photo actually: [new photo]" (source file `Firefly_Gemini Flash_can you make the hair texture more natural looking and less oilly 616959 1.png`) — swapping in this retouched version in place of the one from the immediately prior checkpoint.
- "build and push as it [sic — 'as is']" — explicit confirmation to ship with the light/cream backdrop unresolved (flagged again this round, still not acted on).

## Records of resistance / things I got wrong and had to correct

- New export's aspect ratio (734×982, ≈0.7475) didn't match the collage slot's established aspect (≈0.7160) — different from every prior swap, which all arrived pre-matched. Rather than stretch it to fit (which would visibly distort the face/proportions), center-cropped 31px off the width (703×982, matching aspect almost exactly) before upscaling. Confirmed visually afterward that the crop didn't clip any part of the subject — the trimmed margin came entirely out of the plain backdrop on each side.
- Checked for the same bottom-edge alpha artifact that showed up two checkpoints ago before trusting this export — alpha channel is uniformly 255 (fully opaque) across the entire image this time, no cropping needed for that reason.

## Successes

- Verified via Puppeteer against a production build: new portrait renders at the correct position/size in the collage, no distortion from the aspect-ratio correction, zero horizontal overflow on mobile.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error from every prior checkpoint this session.

## State at this checkpoint

- **Modified** `src/assets/hero/portrait.jpg`: replaced with the retouched photo, center-cropped from 734×982 to 703×982 to correct its aspect ratio to match the collage slot, then upscaled via Lanczos to the established 1452×2028.

## Remaining work

- Same open item as the prior checkpoint, now explicitly shipped as-is per direct instruction: the photo's light/cream backdrop still doesn't match the dark backdrop the rest of the collage uses. Flagged a second time before this push; user confirmed to proceed anyway rather than recolor it. Not a bug — a deliberate, acknowledged tradeoff at this point, not something to revisit unprompted.
