# Checkpoint — Hero collage portrait photo swap (sixth time)

## Context

Sixth swap of the same hero collage portrait slot this session (`2026-08-13-hero-portrait-photo-swap.md`, `2026-08-20-hero-portrait-photo-swap-2.md` through `-5.md`). Source file this round: `FINALHEADSHOT.png`.

## Human directions

- "can you replace the rectangle 148 image in the hero college to this one: [new photo]" (source file `FINALHEADSHOT.png`)
- "build and push"

## Records of resistance / things I got wrong and had to correct

- Nothing to correct this round — new export arrived at 1448×2028 (aspect 0.71400), within 0.3% of the collage slot's established aspect (0.71598) and only 4px narrower than the target 1452px width. Close enough that a direct resize to the exact target dimensions introduces no perceptible distortion, so skipped the crop step used in earlier rounds. Fully opaque (no alpha edge artifacts to check for this time).

## Successes

- Verified via Puppeteer against `next dev`: renders correctly at the expected position/size in the desktop collage, zero horizontal overflow on mobile.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error from every prior checkpoint this session.

## State at this checkpoint

- **Modified** `src/assets/hero/portrait.jpg`: replaced with the new photo, resized from 1448×2028 to the established 1452×2028 (negligible ~0.3% stretch, no visible distortion), re-encoded as JPEG quality 90.

## Remaining work

- Same open item carried from prior checkpoints: the light/cream backdrop still doesn't match the rest of the collage's dark backdrop. Still unaddressed, still the user's call.
