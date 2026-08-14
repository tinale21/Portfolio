# Checkpoint — Emora Design Principles: match Figma redlines exactly

## Context

Follow-up to the initial Our Design Principles build. First pass approximated card sizing from a screenshot; this round used actual Figma dev-mode redlines the user provided (5 screenshots: per-element pixel-distance overlays plus the Figma inspector's own generated CSS) to replace those approximations with exact values.

## Human directions

- "not quite. [5 Figma redline screenshots]" — the redlines show explicit `width: 328px; height: 425px;`, `border-radius: 10px; border: 2px solid #F9FAFB; background: #FFF;` for each card (Figma's own CSS panel output), plus pixel-distance annotations for icon/text internal spacing and an inter-card gap of 25px.

## Records of resistance / things I got wrong and had to correct

- Set `w-[328px] h-[425px]` on each card but left them in a plain flex row with no `shrink-0`. Flexbox's default `flex-shrink: 1` silently compressed every card down to ~307px wide to avoid overflowing the container — the cards *looked* reasonable and my overflow check (`docWidth` vs `docClientWidth`) reported no change, which nearly let this pass unnoticed. Caught it by directly measuring each card's own `getBoundingClientRect()` rather than trusting the aggregate page-overflow number, which found the real 328→307 shrink.
- Adding `shrink-0` fixed the sizing to true 328px but exposed a real, if small, overflow: at a standard 1440px viewport, `4×328px + 3×25px = 1387px` doesn't fit the page's ~1372px content width, overflowing by about 15px. This is a genuine side effect of matching Figma's literal fixed dimensions — not a bug to silently paper over. Flagged it explicitly to the user rather than either (a) silently shrinking the cards again to avoid it, or (b) shipping it without mentioning it. It's currently masked in the page's aggregate `scrollWidth` by the larger pre-existing Project Overview overflow, but is real and independent of that older bug.

## Successes

- Trusted the explicit Figma-generated CSS values (`width: 328px`, etc.) as authoritative over my own screenshot-based pixel measurements from the previous round, since the user provided the actual dev-mode inspector output this time rather than a flat screenshot.
- Didn't declare the fix "done" on the first passing overflow check — went back and verified each card's actual rendered width individually once something felt off (cards looked visually plausible, which is exactly when a silent flexbox-shrink bug is easiest to miss).

## Follow-up: drop literal redline width, fit to page padding instead

After the overflow was flagged, direct feedback: "you don't have to use the exact numbers on the figma. can you make sure they fit to the left and right padding. can you also reduce the width of the boxes so that the content in it is centered horizontally in the boxes; you can then just add more space between each box to make up for the smaller width." Then, after narrowing: "add more padding into each box right now the width is too small. also maybe increase the text box width size to help a little."

- Measured the widest actual wrapped line across all four principles' text via `getBoundingClientRect()` (~163px) rather than guessing a narrower width, then sized the card around that plus padding — first pass landed on 240px, which read as too cramped per the follow-up, widened to 280px with `p-10` (up from `p-8`).
- Replaced the fixed `gap-[25px]` with `sm:justify-between`, so the browser distributes whatever space the narrower cards free up evenly between them and the row always spans exactly from the left page padding to the right page padding — confirmed by measuring the outermost cards' `getBoundingClientRect()` directly (left edge at 68px, right edge at 1372px = 1440 − 68, at every tested viewport width from 1024px to 1512px), rather than trusting only the aggregate `scrollWidth` check, which stays flat at its pre-existing value regardless of what this section does and so can't by itself confirm the fix.
- This fully resolves the overflow this section had introduced — no longer flagged as an open issue.

## Follow-up: widen further, fix a real double-gap bug, and re-wrap the text

- "increase the text box width the boxes to give the box more width. the spaces between the boxes are too big" — widened cards to 320px. Measuring afterward turned up a real bug, not just a tuning nudge: the last card's right edge landed at 1444px on a 1440px viewport — past the *entire* viewport, not just past the padded content area. Root cause: `sm:justify-between` was still stacked on top of the base (mobile-stacking) `gap-8` class, and CSS `gap` sets a *minimum* spacing that `justify-content` distributes additional free space on top of — it doesn't get overridden by `justify-content` the way I'd assumed. Fixed with `sm:gap-0` so `justify-between` owns 100% of the spacing. Re-verified the row's outer edges land exactly on the page padding again after the fix, the same direct-measurement check used for every width change in this section.
- "you increased the text box but didn't add more words per line" — accurate: the body text was still using the explicit line-break lock from the original narrow-column pass, so widening the card just added unused whitespace instead of longer lines. Removed the hard `<br />` breaks entirely and switched to a plain wrapped string, since the exact Figma line breaks were already deprioritized two rounds earlier in favor of a layout that fits this site's real page padding — locking to a specific line-break array only makes sense when matching a specific reference width exactly, which this section no longer does by design.

## State at this checkpoint

- **Modified `src/components/case-studies/emora/EmoraDesignPrinciples.tsx`**: cards are `sm:w-[320px] sm:h-[425px] sm:shrink-0` with `p-10` padding; row uses `sm:justify-between sm:gap-0` (the `gap-0` addition is the fix for the double-gap bug above) so it always fits exactly between the page's `lg:px-[68px]` padding at any viewport width. Body text is now a plain wrapped string (4 lines at the current width) instead of an explicit line-break array.
- Verified: `npx tsc --noEmit` clean at each step; card positions measured directly via `getBoundingClientRect()` after every width change (not just the aggregate `scrollWidth` check, which can't detect a row that's still correctly bounded on the left but overflowing on the right); confirmed row edges land exactly on page padding at 1024px, 1280px, 1440px, and 1512px viewports; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## Remaining Emora work

Everything past Our Design Principles — whatever sections the reference design calls for next — is not yet built. The pre-existing Project Overview `w-[650px]` overflow (present since AIG's original build) remains open and unrelated to this section.
