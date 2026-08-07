# Checkpoint — Cross-section typography polish, typewriter accent color

## Context

A long, fast-iterating polish pass touching four areas: the client-logos section gained a heading and lost its earlier optical-spacing tweak, the Projects section heading was resized/restyled to match it, the Hero collage got another size bump, and the typewriter headline gained an accent color.

## Human directions

- Client logos section: uniform spacing feels too crowded → widen it; then directly asked "is the spacing between each logo the same?" (it wasn't, by design, from an earlier optical-spacing fix) → asked to make it fully uniform once told about the intentional AIG tightening.
- Add "Companies I've Work For" heading above the logo marquee, then iterated through several rounds: match Projects section's font/size/padding, try Inter, revert to Inria Serif but smaller, try semibold (flagged as unavailable, went bold), try medium (flagged as resolving to Regular, kept bold). Caught own typo mid-thread ("Work" → "Worked") and asked for it fixed alongside a 2px spacing tweak.
- Projects section heading: shrink text, try bold, try semibold (flagged, chose Regular instead), match it to the logos heading exactly then match the subtext proportionally, remove the italic "thoughtfully" emphasis entirely, several rounds of small type-size and top-padding nudges (down to 1px increments).
- Hero collage: another explicit bump, 84% → 88%.
- Typewriter headline: unify "I'm" and the rest to the same font (Inter) — first asked for same *weight*, then corrected mid-message to same *font* entirely; then asked for the rest to be a weight *lower* than "I'm," disliked the result and asked to revert to matching weight (500) but instead add a distinct color (#AE62AA) to the rest while "I'm" stays the base color; thickened the cursor (2px → 4px); changed the cursor's color from inherited (`bg-current`) to the same explicit accent color; added spacing between the last letter and the cursor; changed the first phrase text from "I'm Tina" to "I'm Tina Le!".

## Records of resistance / things I got wrong and had to correct

- Nothing required a factual correction this round — every "wrong" turn was the user directly trying an option, disliking it, and asking for something else (e.g., semibold → flagged as unavailable → user picked bold; medium on Inria Serif → flagged as resolving to Regular → user kept bold; weight-lower-than-"I'm" on the typewriter → user disliked it in practice, not from a flagged constraint, and asked to revert). The one genuine mid-message self-correction was the user's own: "same weight as I'm" corrected to "same font as I'm" before I'd acted on the first version.
- Consistently re-applied the established habit of flagging font-weight limitations (Inria Serif has no 500/600 cut) *before* implementing, rather than silently applying a value that would resolve to something else — this happened three separate times in this round (logos heading semibold, logos heading medium, and implicitly again when the Projects heading was matched to the logos heading's already-resolved Bold).

## Successes

- Reused the exact `getComputedStyle` verification pattern established over the previous several checkpoints for every single-property tweak in this round (font-family, font-weight, color, background-color, margin, padding) rather than trusting a screenshot alone — caught nothing wrong this round, but the discipline held even for very small, "obviously correct" one-line changes.
- Kept the derived-from-shared-constant patterns intact through this round's edits (e.g. the logos marquee's `COPY_WIDTH_PX`/`MARQUEE_DISTANCE_PX` auto-recomputing when `GAP` changed, requiring no manual re-sync) — no regressions reintroduced from earlier fixed bugs (marquee coverage, seamless loop math) despite several unrelated edits to the same file.

This round also included one earlier, smaller change: the card-deck quote's line split was adjusted so line 1 reads more pronouncedly longer than line 2 ("...but how" moved up from line 2), widening `QUOTE_WIDTH` (530 → 570) so the longer first line still renders as a single line rather than wrapping.

## State at this checkpoint

- Client logos section: uniform 170px gap (post-scale ~110.5px) between every logo, no more AIG-specific tightening. Heading "Companies I've Worked For" — Inria Serif, 24px, bold, left-aligned, offset to align with the Projects heading despite the two sections having different horizontal padding.
- Projects section heading: Inria Serif, 26px, Regular (not bold — semibold isn't available, and bold was tried and moved away from), no italic emphasis on any word. Subtext scaled to 16px to match. Top padding tuned down in 1-2px increments from an initial overshoot.
- Hero collage now at 88% scale (up from 84%).
- Typewriter headline: both "I'm" and the rest are Inter Medium (500); "I'm" keeps the headline's base color, the rest and the cursor are both `#AE62AA`; cursor is 4px wide with 12px of leading space; first phrase is "I'm Tina Le!".
