# Checkpoint — Replace the About "Foodie" photo

## Context

Swaps the photo in the About page's "Foodie" trait entry for a different one.

## Human directions

- "on the about section, can you replace this image: [red-haired person biting a sandwich, warm indoor light] for this image instead: [/Users/tinale/Downloads/BBC97F51-7178-4CF9-8E66-3B3798D2A0C5.JPG — wider shot of the same, eating at eggslut by a window]"

## Records of resistance / things I got wrong and had to correct

- Confirmed which of the four About photos was the target by viewing them rather than guessing — it was `about2.jpg` (the "Foodie" entry, alt "...eating a breakfast sandwich...").
- Matched the existing About image pipeline rather than the Connect one: the About photos are JPGs at ~1281-1350px wide / 1800 tall (~350-576KB each), not the 800px WebP the Connect section uses. Saved the replacement as a 1350x1800 JPG (q85, progressive, 426KB) — exactly matching about1/about4's dimensions and in line with their file sizes — instead of dropping in the raw 2480x3307 / 930KB source or a mismatched WebP.
- The replacement's EXIF orientation was already normal (1), so no rotation was needed — but checked before assuming, same as the Connect swap where it did need correcting.
- The About photos aren't shown at their natural crop: `AboutEntry.tsx` applies `object-cover` into a 318x471 box **plus** a `scale(1.6)` zoom (`BASE_PHOTO_SCALE`) and a ±80px vertical parallax as you scroll. So rather than just eyeball the full photo, simulated the actual rendered framing — object-cover → 1.6x center zoom → and both parallax extremes (±80px) — and confirmed the subject's face stays well-composed and never clips at rest or at either scroll extreme.
- Updated the `alt` text to match the new photo's actual setting (was "eating a breakfast sandwich at an outdoor cafe table"; the new photo is indoors at a window counter at eggslut) rather than leaving a now-inaccurate description.

## State at this checkpoint

- **Replaced** `src/assets/about/about2.jpg` with the new eggslut photo (EXIF-normal, resized to 1350x1800 JPG q85, 426KB). Same filename, so `about-data.ts`'s existing `import about2 from "@/assets/about/about2.jpg"` needs no change.
- **Modified** `src/components/about/about-data.ts`: updated the Foodie entry's `alt` to accurately describe the new image.

## Verification

- Viewed the saved `about2.jpg` — correct, upright.
- Simulated the true on-screen framing (object-cover + 1.6x zoom + parallax top/rest/bottom) and confirmed the subject stays well-framed with no clipping across the full scroll range.
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean; build emits the new JPG into the static export.

## Remaining work

- None currently flagged.
