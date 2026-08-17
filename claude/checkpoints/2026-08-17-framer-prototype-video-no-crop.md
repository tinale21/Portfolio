# Checkpoint — Framer prototype video: guaranteed no crop on mobile

## Context

Same-day follow-up to the thinner-bezel and tighter-spacing fixes on Framer's Final Design prototype video (`FramerRedesignFinalDesign.tsx`).

## Human directions

- "for the framer final design video on mobile, can you still make sure the video is not cropped but you can keep the black outline the same thickness as it is right now"

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — but worth recording the investigation before the fix: measured the frame and video geometry directly (both the video file's real intrinsic dimensions via `cv2`, and the live rendered DOM boxes via Puppeteer) and found the frame's `aspect-ratio: 1800/994` already matches the video file's actual native 1800x994 dimensions exactly, so `object-cover` wasn't visibly cropping anything under the conditions this session could reproduce (headless Chromium). Implemented the fix anyway as a direct, literal fulfillment of the request rather than concluding "nothing to do" — `object-contain` is the only way to *guarantee* zero cropping regardless of any future video-file swap, rounding differences, or engine-specific `aspect-ratio` quirks (e.g. Safari/iOS, which the user's own earlier screen recording was captured on and which this session has no way to test directly).

## Successes

- Changed the prototype video's `className` from `object-cover` to `object-contain lg:object-cover` — mobile now always shows the full, unclipped video (letterboxing into the frame's own `#1D1D1D` bezel-matching background if the ratios ever drift), desktop is byte-for-byte unchanged.
- Did *not* touch border width, frame width, or aspect-ratio — matches "keep the black outline the same thickness as it is right now" precisely; only the video's own `object-fit` changed.
- Verified via Puppeteer: `getComputedStyle(video).objectFit` reports `"contain"` on mobile (390px) and `"cover"` on desktop (1512px) after the change; full horizontal-overflow sweep across all four case studies still comes back at 0px; mobile screenshot confirms the video renders identically to before (since the ratios already matched, this is a no-visual-regression, guarantee-only change).
- `npx tsc --noEmit` and `npx eslint` clean; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## State at this checkpoint

- **Modified** `FramerRedesignFinalDesign.tsx`: prototype video's `object-cover` → `object-contain lg:object-cover`. Border width, frame width, and aspect-ratio are all unchanged from the prior two checkpoints.

## Remaining mobile work

- None currently flagged.
