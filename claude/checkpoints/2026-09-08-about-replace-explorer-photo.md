# Checkpoint — Replace the About "Explorer" photo

## Context

Swaps the photo in the About page's "Explorer" trait entry (the Chicago River shot) for a Chicago skyline photo taken across Lake Michigan.

## Human directions

- "can you replace this image on the about page: [Chicago River, person looking at Trump Tower] to this image instead: [/Users/tinale/Downloads/IMG_2123.JPG — landscape Chicago skyline across the lake at dusk, with strangers on the pier in the foreground]"

## Records of resistance / things I got wrong and had to correct

- Confirmed the target was `about1.jpg` (the Explorer entry, caption "City views hit different in Chicago") by viewing it, not assuming.
- The replacement was **landscape** (4032x3024, aspect 1.333) going into a **portrait** box (aspect 0.675) that also applies a 1.6x zoom + ±80px vertical parallax (`AboutEntry.tsx`). A naive drop-in would crop unpredictably. Simulated the full render pipeline (object-cover → 1.6x zoom → parallax extremes) on the raw image first — the rest/top framings looked good, but the **bottom parallax extreme pulled the foreground strangers (a man in a cap + another head) into focus**, which would look like random people are the subject.
- Rather than accept that, pre-cropped the source to a clean portrait composition at the exact box aspect (0.675): skyline centered, moody sky above, water below, and the foreground people cropped out entirely. Because the source now matches the box aspect, `object-cover` is a no-op and the framing is fully predictable — only the intended skyline/sky/water shows across the whole parallax range.
- First crop attempt (crop_h=2600) still left a sliver of a stranger at the very bottom edge of the *source* file — below the zoom+parallax visible range so it never actually rendered, but not something worth shipping in the asset. Tightened to crop_h=2430 to remove them from the source entirely, then re-simulated the bottom extreme to confirm the skyline stays well-placed and the frame is clean.
- Matched the existing About pipeline (JPG, resized to 1350px wide, q85 progressive, 394KB — in line with the other three About photos) rather than the Connect section's WebP, and updated the `alt` text (was "Tina Le on a bridge over the Chicago River..."; the new photo has no person, so it's now "The Chicago skyline at dusk seen across Lake Michigan, under a cloudy sky").

## State at this checkpoint

- **Replaced** `src/assets/about/about1.jpg` with the new skyline photo. Same filename, so `about-data.ts`'s import needs no change.
- **Modified** `src/components/about/about-data.ts`: updated the Explorer entry's `alt` to describe the new image.

## Follow-up -- keep the strangers (revert the people-removal crop)

- "you can have the strangers it ok" — the user is fine with the foreground people appearing at the bottom parallax extreme, so the pre-crop that removed them was unnecessary. Re-saved `about1.jpg` as the full uncropped composition (EXIF-corrected, resized to height 1800 -> 2400x1800, q85 progressive, 591KB — in line with the original 576KB), letting `object-cover` + the 1.6x zoom + parallax frame it the same way every other About photo is handled. This is exactly the render previewed earlier (skyline centered at rest, strangers visible at the bottom scroll extreme). Alt text unchanged — the skyline is still the dominant subject.

## Verification

- Simulated the on-screen framing across the parallax range earlier for this exact full-image pipeline; skyline reads well at rest, strangers appear only at the bottom extreme (now acceptable per feedback).
- Viewed the saved `about1.jpg`.
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Follow-up -- switched to a different photo (street/fire-escapes)

- "can you actually do this image instead: [/Users/tinale/Downloads/IMG_2161.JPG — upward shot of a downtown Chicago street, old building with fire escapes, skyscrapers beyond]" — superseded the skyline photo above.
- The file had EXIF orientation 6 (stored landscape 4032x3024, displays as portrait 3024x4032) — applied `ImageOps.exif_transpose` so it's upright. Its portrait aspect (0.75) is close to the box (0.675), so `object-cover` crops minimally.
- Processed through the standard About pipeline (1350x1800 JPG, q85 progressive, 606KB). Simulated the render (object-cover + 1.6x zoom + parallax rest/top/bottom) and confirmed it's well-composed and upright with no issues at any scroll position. Updated the `alt` accordingly ("A downtown Chicago street with fire escapes climbing an old building and skyscrapers beyond").

## Remaining work

- None currently flagged.
