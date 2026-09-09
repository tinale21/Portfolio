# Checkpoint — Replace a Connect section photo

## Context

Swaps one of the six photos in the homepage "Let's Connect!" section for a different one.

## Human directions

- "on the let's connect section on the homepage can you replace this photo: [Washington Monument reflecting-pool photo of two people] for this photo instead: [mirror selfie, /Users/tinale/Downloads/IMG_8792 2.JPG]"

## Records of resistance / things I got wrong and had to correct

- Identified which of the six photos was the one to replace by actually viewing each `photo{1-6}.webp` rather than guessing — it was `photo4.webp` (the two-people-at-the-Washington-Monument shot), not assumed by index.
- The replacement JPG was stored as 4032x3024 landscape with EXIF orientation 6 (display-rotated 90° to portrait) — a raw resize would have baked in a sideways image. Applied `ImageOps.exif_transpose` first so the saved WebP is upright, matching how the phone/Photos displays it (3024x4032 portrait).
- Matched the existing Connect photo pipeline exactly (see 2026-09-03 checkpoint): resized to 800px wide and encoded as WebP q82, so this photo stays consistent with the other five (small file, same format) rather than dropping in a 2.4MB JPG that would reintroduce the slow-load problem that section was just fixed for.
- The new photo's aspect ratio (0.75) differs from the one it replaced (0.51), and the photo box uses `object-cover` — so rather than assume the crop would look fine, simulated the exact `object-cover` crop for photo4's box (232:458) with PIL and confirmed the subject (face + phone) lands centered and well-composed, with only the store-shelf edges cropped off.

## State at this checkpoint

- **Replaced** `src/assets/connect/photo4.webp` with the new mirror-selfie image (EXIF-corrected, 800px-wide WebP, 90KB). Same filename, so `connect-data.ts`'s existing `import photo4 from "@/assets/connect/photo4.webp"` needs no change — pure asset swap.
- No code changes.

## Verification

- Viewed the saved `photo4.webp` directly — upright and correct (not sideways).
- Simulated the `object-cover` crop for photo4's box aspect and confirmed the subject stays centered/well-framed.
- `npx tsc --noEmit` and `npm run build` clean; build emits the new WebP into the static export.

## Remaining work

- None currently flagged.
