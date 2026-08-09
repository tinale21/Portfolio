# Checkpoint — About page refinement (alignment fix, bleed experiment + revert, sizing/crop tuning)

## Context

Follow-up session to the initial About page build. Covers: fixing text-to-photo alignment using precisely re-verified Figma measurements, a "Tina Le" dramatic-bleed-off-the-page experiment that was ultimately reverted, and several rounds of small tuning (image size, parallax range, Animal Friend's photo crop).

## Human directions

- "the text isn't matching to how it aligned to the picture in my figma reference photo. i also want the text to match how much lines it is in my figma" — led to re-measuring Figma dev-mode screenshots precisely.
- "not quite. try recreating it: [4 full-frame PNG renders]" — a completely different-looking reference (black background, huge cropped "Tina Le" bleeding off-page) that turned out to need clarification.
- Asked whether the black background / missing trait-tagline-caption meant a new minimal design or just an incomplete export; picked "they exist off-canvas in this export" (keep the content, reposition to match the new treatment).
- "the background is suppose to be white, it just wasn't exported" — confirmed background was never meant to change.
- "revert the change" — after the bleed effect kept overlapping/breaking, asked to fully undo it.
- "make the images a little bit bigger, also make the parallax range a little bit more" → "can you do only 8% bigger" (precise correction on the vague first pass).
- "can you fix the crop of the animal photo so that it cropped more to the left" → "shift it more" → "i don't want it too zoomed. i want to be able to see the white cat" → "can you shift it more to the left".
- "lets build and push".

## Records of resistance / things I got wrong and had to correct

- **A real, embarrassing measurement error, caught and fixed**: re-verifying "which Figma screenshot shows which element selected" by reading 4 images in one parallel tool call, then writing analysis from memory of that batch, silently mismatched files to content (e.g. treated a screenshot that actually showed "Tina Le" selected as if it showed "Explorer"). This produced a completely wrong first alignment fix. Caught it by re-reading each file **one at a time** and diffing against what the dev-mode panel actually said, which is now the standing lesson: never trust batched multi-image analysis for anything where "which file is which" matters — verify sequentially.
- **Correct alignment finding, once measurement was fixed**: using connected-component contour detection (not eyeballing) on the corrected file set, found the trait/tagline/caption text sit 23–30% down the photo's height, not centered and not flush-top as two earlier attempts assumed. Fixed via lg-only top-margins + gaps derived from that percentage, scaled to each breakpoint's actual photo height.
- **The "4 new reference frame" detour**: spent significant effort trying to reverse-engineer an oversized, dramatically-cropped "Tina Le" signature from a 4x-scale PNG export, including a wrong assumption (that the black background was a real design change) corrected directly by the user, and a font-size/glyph measurement that went through several wrong turns (mistaking a background/photo edge anti-aliasing artifact for a letter stroke, mismeasuring x-height because of tree-branch contamination in the color threshold). Implemented three different bleed mechanisms (absolute positioning with manual top/transform math, then a simpler overflow-based right-aligned approach) before landing on one that didn't overlap "Explorer" — and even that was explicitly called a "tuned-by-eye first pass," not a claimed exact match.
- **Reverted cleanly on request**: rather than trying to salvage or partially keep the bleed work, restored AboutEntry.tsx to the exact pre-bleed state (plain 48px "Tina Le" in its own right-aligned column, `lg:mt-[101px]` on the trait word, no section-level `overflow-hidden`) — confirmed by diffing against the version captured earlier in the conversation.
- **object-position turned out to be a dead end for the Animal Friend crop**: first attempt used `object-position` to shift the crop left, tried 20% then 5% with zero visible difference. Root cause, found by actually checking the source file's real dimensions (1460x2052) rather than trusting old dev-mode metadata (which said 2048x2048): the photo's real aspect ratio already almost exactly matches the 365:513 box, so `object-fit: cover` has essentially no overflow for `object-position` to pan within. Switched to a zoom-then-translate approach (`photoZoom` + `photoPanX` in about-data.ts, combined into a single `transform: scale(...) translateX(...)` in AboutEntry.tsx) — that's what actually produced a visible shift.
- **Zoom went too far, then was walked back on direct feedback**: `photoZoom: 1.3, photoPanX: 12` cropped in tight enough that the white cat's context (rest of its face, the other cats) was lost — user said "i don't want it too zoomed, i want to be able to see the white cat." Backed off to `1.1/8`, then increased again to `1.2/14` for "shift it more" once zoom was no longer the complaint, just position.

## Successes

- Every "is this actually shifted / does this actually cover the frame" question was settled by Puppeteer screenshots and computed-style checks (parallax `transform` values at scroll extremes, `scrollWidth` vs `clientWidth` to catch introduced horizontal scrollbars, mobile-viewport edge-gap checks) rather than assuming the code was correct.
- Once the bleed effect was clearly not converging on something clean after three implementation attempts, stopped and reverted fully on request rather than continuing to patch — didn't try to defend the earlier work or leave a half-migrated state.
- Diagnosed the object-position dead-end by going back to first principles (checking the actual file's pixel dimensions) instead of continuing to tweak a percentage that had already been shown not to matter.

## State at this checkpoint

- **`src/components/about/AboutEntry.tsx`**: back to the pre-bleed layout (plain-column "Tina Le" + trait, `lg:mt-[101px]`/`lg:gap-[44px]` on the name column, `lg:mt-[130px]`/`lg:gap-[112px]` on the tagline column, both derived from Figma's measured 23.1%/29.8% offsets). Photo box now 205/259/335px (8% bigger than the original 190/240/310) across breakpoints. Parallax range is now `PARALLAX_RANGE_PX = 80` (was 60), photo scale is a `BASE_PHOTO_SCALE = 1.6` JS constant (was a `scale-[1.6]` Tailwind class) combined with each entry's optional `photoZoom`/`photoPanX` into a single inline `transform`.
- **`src/components/about/about-data.ts`**: `AboutEntry` type has `photoZoom?: number` and `photoPanX?: number` (replacing an earlier, non-functional `objectPosition?: string`). Only the Animal Friend entry sets them: `photoZoom: 1.2, photoPanX: 14`.
- No dramatic "bleed" signature effect — shelved, not shipped. If revisited, the working pieces (right-align + `whitespace-nowrap` overflow is simpler and more robust than absolute positioning) are worth reusing, but exact sizing needs a cleaner reference than a 4x-scale PNG export to measure from.
