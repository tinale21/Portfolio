# Checkpoint — Hero collage portrait photo swap

## Context

Swapped the largest/centered photo in the homepage hero collage ("Rectangle 97" in the user's Figma reference, `portrait` in `collage-layout.ts`) for a new headshot.

## Human directions

- "can you replace rectangle 97 image in the hero section to this image: [new photo]"
- "let's build and push".

## Successes

- Before processing, checked the new photo's aspect ratio (1452×2028) against the existing `portrait.jpg` (1074×1500) and the Figma slot's own dimensions (363×507) — all three reduce to exactly the same ratio (0.71598), confirming the new export was already correctly prepared for this exact slot, so no cropping was needed, just a resize-to-match and re-encode.
- Caught that the old alt text ("Portrait of Tina Le with the Atlanta skyline behind her") was specific to the *previous* photo's background and no longer accurate for the new one (a plain gray studio backdrop) — updated it on both the desktop and mobile collage layout entries rather than leaving stale copy.

## State at this checkpoint

- **Modified `src/assets/hero/portrait.jpg`**: replaced with the new photo, resized to 1074×1500 (matching the previous asset's resolution) and re-encoded as JPEG (quality 88, ~281KB — in line with the other hero photos' file sizes).
- **Modified `src/components/hero/collage-layout.ts`**: alt text updated from "Portrait of Tina Le with the Atlanta skyline behind her" to "Portrait of Tina Le" on both the desktop and mobile layout entries.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, confirmed via Puppeteer that the new image (1074×1500) loads correctly in the hero collage at its expected position (largest, centered, topmost).
