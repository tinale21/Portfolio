# Checkpoint — Hero collage portrait photo swap (third time), fixed a real export artifact

## Context

Third swap of the hero collage's largest/centered photo (same slot as `2026-08-13-hero-portrait-photo-swap.md` and `2026-08-20-hero-portrait-photo-swap-2.md`; Figma renames the layer each time its fill is replaced — this round it was called "Rectangle 139" in the instruction, source file `Rectangle 141.png`). Unlike the two prior swaps, this new photo is a genuinely different take: side-profile pose, denim jacket instead of the blazer, and — new — a light/cream studio backdrop instead of the dark gray one every other collage photo (including both prior portrait versions) shares.

## Human directions

- "can you replace rectangle 139 image in the hero college to this image: [new photo]" (source file `Rectangle 141.png`)
- Follow-up, after I flagged the background-color mismatch and asked whether to proceed as-is: "is there a white line in the bottom of the image"
- "build and push"

## Records of resistance / things I got wrong and had to correct

- Shipped a real artifact on the first pass and only caught it because the user asked a direct, specific question about it rather than me catching it myself first. Diffed pixel values at the bottom edge of the placed asset after the question and found rows 2025-2027 (of 2028) were consistently ~100-150 values brighter than the rows just above them — a visible light line across the bottom of the image.
- Root-caused it properly instead of just patching the symptom: checked the *source* PNG's alpha channel row-by-row near its bottom edge and found the last two pixel rows (1012, 1013 of 1014) were a uniform, full-width partial/zero-alpha band — an export artifact from Figma (the layer's bounding box picked up a hairline of transparency at its own edge, unrelated to any actual image content; the visible content, the jacket, is fully opaque right up to that boundary). My original flatten step composited that transparent band onto the light backdrop fill color I'd picked, which is what produced the visible light line once flattened to an opaque JPEG.
- Fixed by cropping those two artifact rows off the source *before* flattening/upscaling, not by trying to sample/patch the affected pixels after the fact — confirmed clean via the same row-by-row check (bottom rows now consistent with the jacket's dark tones, no brightness spike) before placing the file.
- Flagged, not fixed (user hasn't responded to this part yet): the new photo's light/cream backdrop doesn't match the dark backdrop the rest of the collage (and both prior portrait versions) uses — screenshotted it in place on both desktop and mobile and pointed out it now reads as a bright rectangle against the otherwise dark, cohesive composition. Proceeded with the swap as literally instructed rather than unilaterally recoloring the backdrop, since that's a real content/design decision, not a bug — left it as an open question for the user rather than a blocking one.

## Successes

- Full production-build overflow sweep across all seven pages, both breakpoints, all come back at 0px.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error confirmed in both prior portrait checkpoints.

## State at this checkpoint

- **Modified** `src/assets/hero/portrait.jpg`: replaced with the new photo (source 726×1014, cropped 2px off the bottom to remove the alpha-artifact edge, then upscaled via Lanczos to match the existing 1452×2028 convention), flattened onto the photo's own sampled backdrop color (231, 224, 224) rather than resized/flattened as originally received.
- No changes to `collage-layout.ts` — same position/size/alt text, only pixel content changed (twice, in this same conversation turn — first pass had the artifact, second pass fixed it before it was ever committed).

## Remaining work

- Open question for the user, not yet resolved: keep the light backdrop as-is, or recolor it to match the collage's dark gray convention (like the two prior portrait swaps)? Not implemented either way pending their answer.
