# Checkpoint — Hero collage portrait photo swap (fifth time)

## Context

Fifth swap of the same hero collage portrait slot this session (`2026-08-13-hero-portrait-photo-swap.md`, `2026-08-20-hero-portrait-photo-swap-2.md` through `-4.md`). Same pose/backdrop family as the immediately prior version.

## Human directions

- "sorry, can you replace it with this image now: [new photo]" (source file `Rectangle 148.png`)
- "build and push"

## Records of resistance / things I got wrong and had to correct

- New export arrived at exactly the target resolution (1452×2028, matching aspect ratio already) — simpler than the prior two swaps, no crop needed.
- Had alpha transparency at all four corners, but checked *where* before assuming another export artifact like the one fixed in checkpoint `-3`: sampled the alpha channel directly and confirmed it's a genuine antialiased rounded-rectangle corner mask (smooth diagonal falloff, isolated to each corner's own radius), not a full-width edge band. Confirmed this is redundant rather than needed — `CollagePhoto.tsx:30` already applies `rounded-[10px] overflow-hidden` in CSS to every photo in the collage regardless of the source image's own shape — so flattened the transparent corners onto the photo's own sampled backdrop color (matching the flatten treatment used for every other version) rather than trying to preserve them.

## Successes

- Verified via Puppeteer against a production build: renders correctly at the expected position/size, zero horizontal overflow on mobile.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error from every prior checkpoint this session.

## State at this checkpoint

- **Modified** `src/assets/hero/portrait.jpg`: replaced with the new photo (already 1452×2028, no resize needed), flattened onto its own sampled backdrop color (220, 218, 218) to remove the baked-in rounded-corner transparency before saving as an opaque JPEG.

## Remaining work

- Same open item carried from the last two checkpoints: the light/cream backdrop still doesn't match the rest of the collage's dark backdrop. Still unaddressed, still the user's call whenever they want it revisited.
