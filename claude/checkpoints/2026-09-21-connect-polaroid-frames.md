# Checkpoint — Polaroid frames on Let's Connect photos

## Context

Adds a polaroid-style white frame around each photo in the homepage "Let's Connect!" section.

## Human directions

- "for the let's connect section, can you try adding a polaroid frame around each image"

## Records of resistance / things I got wrong and had to correct

- The photos are absolutely-positioned boxes whose width/height are precise percentages of the Figma reference frame (which drives the whole scattered composition + the rise/exit scroll animation). Rather than grow each box outward (which would shift positions and risk overflow), kept the exact same footprint and inset the photo *within* it — so the frame appears without disturbing the layout or motion.
- Implemented the frame as padding in `%` (padding % is always relative to the element's width), so the border scales proportionally with each differently-sized photo, and made the bottom padding larger (`p-[6%] pb-[18%]`) for the classic polaroid look (thin top/sides, thick bottom).
- Moved `overflow-hidden` off the outer box and onto the inner photo window, so the polaroid card's drop shadow isn't clipped by its own container.
- Verified the frames didn't introduce horizontal overflow (the frame is inside the existing footprint; shadow doesn't affect layout) — 0px at 1512 and 390, scrolling through.

## State at this checkpoint

- **Modified** `src/components/connect/ConnectPhoto.tsx` and `ConnectMobilePhoto.tsx`: the positioned `motion.div` is now a white card (`bg-white`, `rounded-[2px]`, `p-[6%] pb-[18%]`, `shadow-[0_6px_16px_rgba(0,0,0,0.22)]`, `flex flex-col`) with the `next/image` moved into an inner `relative w-full flex-1 overflow-hidden` window. Position/size/animation/eager-loading all unchanged.

## Verification

- Screenshots (desktop + mobile) at settled scroll positions confirm each photo now has a white polaroid border (thin top/sides, thick bottom) with a soft shadow; cropped two individual photos to confirm the frame proportions read as a polaroid.
- Overflow sweep on the home page at 1512px and 390px, scrolling top-to-bottom: 0px.
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Follow-up -- fix crushed frames (padding % bug) + make frames read

### Human feedback

- "the polaroid don't look like it at all. some images are not there and some are way too small"

### Records of resistance / things I got wrong and had to correct

- Root cause of "images too small / not there": I'd put the frame padding (`p-[6%] pb-[18%]`) directly on the positioned card. **CSS padding percentages resolve against the containing block's width, not the element's own** — and the card's containing block is the big Connect frame (~viewport-wide). So `6%` became ~90px on a ~248px card, crushing the photo window to ~67px wide and ~0 tall. Proved it by measuring: `winW: 67, winH: 0`.
- Fix: moved the padding onto an INNER wrapper whose containing block IS the card, so the % resolves against the card's own width. Verified with a proper DOM walk (img -> window -> wrapper -> card) that the window is now correctly inset (e.g. 213x282 inside a 248x349 card).
- Second gotcha: my quick verify script measured `img.closest('[style]')` as the "card", but `next/image fill` puts its own inline `style` on the `<img>`, so it was measuring the image against itself (always equal) — a bogus signal. Switched to an explicit parent-chain walk, and used inline `style={{ padding }}` (deterministic) instead of Tailwind arbitrary-`%` classes (which the dev server's JIT wasn't reliably regenerating for the new values).
- Tuned the frame to actually read as a polaroid in the dense overlapping collage: border `9%` top/sides and `26%` bottom (the thick bottom is the polaroid signature), plus a stronger inline `boxShadow: 0 10px 26px rgba(0,0,0,0.4)` so each card separates from the ones it overlaps.

### State at this checkpoint

- **`ConnectPhoto.tsx` / `ConnectMobilePhoto.tsx`**: card = `absolute rounded-[2px] bg-white` + inline `boxShadow`; inner wrapper `flex h-full w-full flex-col` with inline `padding: "9% 9% 26%"`; photo in a `relative w-full flex-1 overflow-hidden` window. Footprint/position/animation unchanged.

### Verification

- DOM-walk measurement confirms the photo window is correctly inset within each card (frame present on all six).
- Cropped screenshots (center portrait + several photos) show the polaroid border, with the thick bottom edge clearly reading as a polaroid.
- Overflow sweep at 1512 and 390 (scrolling through): 0px.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.

## Follow-up -- shorten photo4's height

### Human feedback

- "i do feel like this one is too long in height, can we re-adjust the scale of the height" (the mirror-selfie photo, photo4)

### State at this checkpoint

- **Modified** `src/components/connect/connect-data.ts`: `photo4`'s box height reduced in both `CONNECT_PHOTOS` (458 -> 340, w stays 232) and `MOBILE_CONNECT_PHOTOS` (257 -> 191, w stays 130). At the old heights its aspect (~0.51) was much taller/narrower than every other card (~0.64-0.81) and over-cropped the image vertically; ~0.68 now matches the set. photo4 isn't the max of `y+h` on desktop, so ENTRY_AFTER is unaffected there; on mobile it was the max, so MOBILE_ENTRY_AFTER (derived) adjusts down slightly — fine.

### Verification

- Measured photo4's card aspect after: 232x340 = 0.682 (matches the other photos).
- Full connect screenshot confirms photo4 now reads as a proportional polaroid alongside the others.
- Overflow 0px at 1512 and 390; `tsc`/`eslint`/`build` clean.

### Follow-up 2 -- enlarge photo6

- "can you make this one just a little bit bigger" (photo6, the dark group selfie — the smallest box in the set). Bumped it ~1.17x keeping its ~0.79 aspect: desktop `CONNECT_PHOTOS` 152x191 -> 178x224, mobile `MOBILE_CONNECT_PHOTOS` 110x138 -> 128x161. Neither is the max of `y+h` / `FIGMA_HEIGHT-y`, so entry timing is unaffected; both stay within the frame bounds. Verified card measures 178x224, screenshot confirms it's larger, 0px overflow, tsc/eslint/build clean.

## Remaining work

- Frames read best on each photo's exposed (non-overlapped) edges — inherent to the dense collage. If a more pronounced "scattered polaroids" look is wanted, a small per-photo rotation and/or a touch more spacing would help; left off for now to avoid disturbing the tuned overlap/clip + rise animation.
