# Checkpoint — Prevent Footer showing alongside the About page mission quote

## Context

The mission quote ("My mission is to use research, empathy, and visual design...") at the bottom of the About page didn't have enough space below it before the (dark) Footer — when scrolled to a natural reading position, the Footer's top edge was already visible in the same viewport, undercutting the quote's own dedicated moment on screen.

## Human directions

- 'for the about page: when the quote "My mission is to use.." appears, i want there to be enough white space so we don't see the footer here: [screenshot showing the quote with the dark footer bar peeking in at the very bottom]'

## Records of resistance / things I got wrong and had to correct

- A prior checkpoint (`2026-08-09-about-mission-spacing.md`) had already flagged that this section's `min-h-[60vh]` + `items-center` combination can make `pb-*` stop mapping 1:1 onto the actual on-screen gap once `min-h` starts dominating the section's height at taller viewports — so I measured empirically rather than just bumping the padding value and assuming it'd work.
- Measured the ACTUAL problem first: scrolled to the point where the quote's own section is vertically centered in the viewport (a natural "reading" position) and measured how many px of the Footer's top edge intruded into the viewport, across several realistic viewport heights (800/900/1032px desktop, mobile 844px) — found 107-207px of Footer visible in every case, confirming this wasn't a minor nitpick.
- First attempt (`pb-88` → `pb-[700px]`) fixed most heights but still left a 49px sliver at 1032px viewport height (the size closest to the user's own screenshot) — re-measured rather than assuming one round was enough, then increased again to `pb-[850px]`, which brought every height from 700-1032px to a clean 0px, with only a negligible 8px sliver starting to reappear at unusually tall 1100px+ windows (a reasonable tradeoff rather than chasing an unbounded viewport height with unlimited padding).

## Successes

- Diagnosed and verified purely through direct pixel measurement (`getBoundingClientRect()` on the Footer relative to viewport height at a realistic scroll position) rather than eyeballing screenshots, matching the pattern that resolved this exact section's spacing ambiguity in the earlier checkpoint.
- Reproduced the user's reported scenario almost exactly (1512x1032 viewport, quote centered) and confirmed via screenshot that the Footer is now fully out of frame.

## State at this checkpoint

- **Modified** `src/components/about/AboutSection.tsx`: the mission-quote section's bottom padding increased from `pb-88` (352px) to `pb-[850px]`.

## Verification

- Puppeteer: measured Footer intrusion (px of Footer visible in viewport) at the quote's centered-scroll position across viewport heights 700/800/900/1000/1032/1100/1200/1300px and mobile (390x844) — 0px from 700-1032px and mobile, negligible (8px) at 1100px, growing only for uncommonly tall windows beyond that.
- Full-page screenshot at 1512x1032 (matching the user's reported scenario) confirms the quote is fully visible with no Footer intrusion.
- Full overflow sweep across all 7 pages, both breakpoints (1512px/390px), still 0px.
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Remaining work

- None currently flagged. Extremely tall browser windows (1100px+ viewport height) will start to show a small sliver of the Footer again — not fully eliminated, since doing so would require pushing the padding even further and bloating the gap on more common, shorter viewports.

## Follow-up -- replace blank padding with a pin-hold, like Hero's intro

Same-day.

### Human directions

- "it better but a bit too much white space. maybe it could be like the exact amount with a pin hold duration before users scroll to see the footer there too"

### Records of resistance / things I got wrong and had to correct

- First attempt: reused HeroSection's exact sticky-pin-wrapper pattern (wrapper sized to `stickyContentHeight + HOLD`, sticky child at `top: NAV_HEIGHT`) but kept the quote's own content block at `min-h-[60vh]`. Verification (scanning `footerVisiblePx` across the full scroll range in 100px steps, not just spot-checking a couple of positions) showed the Footer was intruding into the viewport (46-146px) *while the quote was still actively pinned in place* — a real bug, not just insufficient hold distance.
- Root-caused via direct scroll-position math rather than guessing at bigger `HOLD` values: a sticky child shorter than the viewport leaves a "hollow" gap below the visually-pinned content, still inside the (taller, hold-driven) pin wrapper. The Footer can peek up through that hollow gap from below the instant `scrollY` passes `wrapperDocBottom - viewportHeight` — a completely different, *earlier* trigger than when the sticky element itself releases (`scrollY` passing `wrapperDocTop + wrapperHeight - stickyHeight - NAV_HEIGHT`). Increasing `HOLD` alone doesn't close this gap; it just delays the (still-broken) peekthrough slightly.
- Fixed by changing the sticky content's own height from `min-h-[60vh]` to `min-h-[calc(100vh-64px)]` (filling the full viewport below the nav, same subtraction pattern HeroSection's own collage block uses) — with no hollow space left inside the wrapper, the Footer genuinely cannot render on-screen until the full hold has elapsed. Re-verified with the same full-range scan: `footerVisiblePx` is exactly 0 for every scroll position during the pin, only becoming nonzero once the quote's on-screen position starts moving again (true release).

### Successes

- Caught the bug via a dense scroll-position scan (100px steps across the entire relevant range) rather than a few spot checks — the earlier version's bug only showed up because of this density; sparser sampling in the very first pass had accidentally landed on scroll positions where the (real) peekthrough wasn't yet visible.
- Verified the fix on both a representative desktop range (1512×900, 1512×1032) and mobile (390×844) before considering it done.

### State at this checkpoint

- **Modified** `src/components/about/AboutSection.tsx`: replaced the flat `pb-[850px]` with the same sticky-pin-hold mechanism `HeroSection.tsx` uses for its intro paragraph — a `MISSION_HOLD = 300` constant, a measured `pinWrapperHeightPx` state (`stickyContentHeight + MISSION_HOLD`), and a `position: sticky` child at `top: NAV_HEIGHT (64)`. The quote's own section changed from `min-h-[60vh] ... pt-40 pb-24` to `min-h-[calc(100vh-64px)]` (no extra padding needed — full-viewport centering handles it), which is also what makes the hold leak-proof (see above).

### Verification

- Puppeteer: scanned `footerVisiblePx` across the full scroll range (settle -> hold -> release) in 100px increments at 1512×900, 1512×1032, and 390×844 — 0 throughout the entire pinned duration in every case, only becoming positive once the quote's on-screen position resumes moving (confirmed release).
- Screenshots of both the fully-pinned state (quote at full opacity, zero Footer) and the released state (quote scrolled up normally, Footer cleanly revealed beneath it) confirm the transition looks like a natural section handoff, not a glitch.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.
