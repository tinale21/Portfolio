# Checkpoint — Hero collage portrait photo swap (again)

## Context

Second swap of the hero collage's largest/centered photo (previously "Rectangle 97" in the user's Figma reference, now referenced as "Rectangle 138" — Figma auto-renames a layer each time its fill is replaced, so this is the same collage slot as the prior swap in `2026-08-13-hero-portrait-photo-swap.md`, not a new one).

## Human directions

- "can you replace rectangle 138 image in the hero college to this image: [new photo]" (attached, source file `Rectangle 139.png`)

## Records of resistance / things I got wrong and had to correct

- Neither "Rectangle 138" nor "Rectangle 139" appears anywhere in this repo's code or checkpoint history — searched thoroughly before assuming. Didn't guess: matched the attached image against the current `portrait.jpg` (identical 1452×2028 dimensions, same subject/pose, same 61,61,61 gray backdrop) and cross-checked against the prior portrait-swap checkpoint's own instruction wording ("can you replace rectangle 97 image in the hero section to this image") — same phrasing pattern, same slot, confirming this is another portrait swap rather than a new/different image target.
- The new export had an alpha channel (RGBA) where the current asset is a flattened JPEG — checked the alpha channel wasn't meaningfully in use (99.95% of pixels fully opaque, only isolated edge/corner pixels transparent) before flattening, rather than assuming either "safe to ignore" or "background removal intended." Flattened onto the same (61,61,61) backdrop color already sampled from both images, rather than PIL's default black, to avoid dark fringing at the antialiased hair edges.

## Successes

- Confirmed via diffing before touching anything: same resolution, same background color at sampled points, same framing — this was a straightforward re-export/retouch of the same photo, not a crop or aspect change, so no repositioning of the collage layout entry was needed.
- Verified via Puppeteer against a production build: new portrait renders correctly at its expected position/size in both the desktop and mobile collages, zero horizontal overflow on mobile.
- `npx tsc --noEmit` clean. `npx eslint` shows the same single pre-existing, unrelated `HeroSection.tsx` error confirmed in the prior checkpoint — not introduced here.

## State at this checkpoint

- **Modified** `src/assets/hero/portrait.jpg`: replaced with the new photo (already at matching 1452×2028 resolution, no resize needed), re-encoded as JPEG quality 88 (~400KB, in line with the previous asset's ~503KB).
- No changes to `collage-layout.ts` — same dimensions/position/alt text as before, only the pixel content changed.

## Remaining work

- None currently flagged.
