# Checkpoint — Framer video frames: fixed Safari-specific asymmetric border

## Context

Follow-up to `2026-08-17-framer-prototype-video-no-crop.md`. After that fix, the user checked on their actual iPhone and reported the black bezel around the Final Design prototype video was clearly asymmetric (thick top, thin/cut bottom).

## Human directions

- "can you recheck the framer final design video on mobile, i don't think it is centered to the outline. it also seems cropped on the bottom"
- After investigation and a clarifying question, the user attached a real-device screenshot and diagnosed it themselves: "the top outline is much thicker than the bottom, which is cutting it. i think you would just need to shift the video up in the outline, right?"

## Records of resistance / things I got wrong and had to correct

- My first-pass diagnosis was wrong in a useful way: pixel-measured the border in headless Chromium and got a perfectly symmetric 10px on all four sides, and confirmed the video file's real dimensions (1800x994, checked directly via `cv2`, not trusted from a code comment) exactly matched the frame's `aspect-ratio`. Chromium showed nothing wrong. I nearly concluded "not a bug, it's just the source recording's own content framing" — the user's real-device screenshot proved that conclusion wrong. The actual bug only reproduces in Safari/WebKit, which this session has no way to test directly (tried Playwright's WebKit build; unsupported on this machine's macOS 13.0). Lesson: a clean headless-Chromium measurement does not rule out a real bug — it only rules out a *Chromium* bug. Should have flagged the cross-browser gap explicitly *before* presenting my "not cropped, it's the source content" theory as settled, rather than needing the user's device screenshot to correct it.
- The user's own theory ("shift the video up in the outline") was a reasonable guess at the symptom, but the actual fix isn't a position shift — it's removing the mechanism that was producing an inconsistent height in the first place. Explained this rather than just implementing what was literally asked, since a positional nudge would've been fighting the underlying bug rather than fixing it (and wouldn't have been reliable across different viewport widths).

## Successes

- Root cause: both this file's prototype-video frame and `FramerRedesignBeforeAfter.tsx`'s slider frame used `aspect-ratio` + `box-sizing: content-box` together to size the bordered frame — a technique this codebase's own prior comments already flagged as fragile (the original AIG-era comment describes exactly this kind of border-symmetry bug once before, on the border-box side; this is the content-box side of the same underlying fragility, apparently still not fully spec-compliant in WebKit).
- Replaced `aspect-ratio` entirely with the older "responsive embed" padding-percentage technique on **both** files (not just the one reported — same shared technique, same latent bug, so fixed proactively rather than waiting for a second bug report): a zero-height spacer div with `padding-top` set to the ratio's height-as-percent-of-width establishes the frame's height, independent of any `aspect-ratio` property support at all. Percentage padding relative to a containing block's width has been correctly implemented in every browser for decades — this sidesteps the suspected WebKit bug rather than working around a specific symptom of it.
- This let the border-sizing math get *simpler*, not just more robust: switched back to Tailwind's default `box-sizing: border-box`, so `width: 100%` (`w-full`) directly gives the correct total on-screen footprint at any border width, with no `calc()` needed at all (previously required `calc(100% - 2×border)` specifically to compensate for content-box sizing).
- Verified the Before & After slider's drag math (`updateFromClientX`, reads live `getComputedStyle(el).borderLeftWidth`) needed zero changes — `getBoundingClientRect()` always reports the border-box regardless of an element's own `box-sizing`, so this was already correct and stayed correct through the sizing-model swap.
- Verified via Puppeteer: border still measures pixel-perfect symmetric in Chromium (unchanged from before, as expected — Chromium never reproduced the bug); desktop dimensions are byte-for-byte identical to before the rewrite (1148×612 total frame, 1100×564 content, 24px border); a simulated drag on the mobile slider still lands the handle at the mathematically correct position; full horizontal-overflow sweep across all four case studies still comes back at 0px.
- Could not verify the actual WebKit/Safari fix directly (no WebKit binary available for this macOS version via Playwright) — the underlying technique is a well-established, decades-old cross-browser pattern with no known engine-specific quirks, but real confirmation depends on the user rechecking on their device.
- `npx tsc --noEmit` and `npx eslint` clean; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## State at this checkpoint

- **Modified** `FramerRedesignBeforeAfter.tsx`: replaced `aspect-ratio`/`box-sizing: content-box` with a padding-percentage spacer + `border-box` sizing; wrapped all previously-direct absolutely-positioned children (images, clip layer, divider, handle, labels) in a new `absolute inset-0` wrapper div, since the spacer needs to be the first, un-positioned child that establishes height via normal flow.
- **Modified** `FramerRedesignFinalDesign.tsx`: same treatment applied to the prototype video frame; video element itself is now `absolute inset-0` instead of a plain flow child, for the same reason.
- Per-screen video frames (Workspace/Guided Tutorial/etc., further down the same file) were **not** touched — they use a much thinner 0.5px border and were never reported as buggy; left as border-box + aspect-ratio as-is.

## Remaining mobile work

- **Needs real-device confirmation** — this fix is theoretically sound (avoids the exact mechanism suspected to cause the bug) and verified as unchanged/correct in Chromium, but wasn't confirmed against actual Safari/WebKit rendering. Please recheck on your phone.
