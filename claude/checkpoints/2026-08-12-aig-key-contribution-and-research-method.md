# Checkpoint — AIG case study: Key Contribution + Research Method sections

## Context

Continued building the AIG case study section-by-section from Figma dev-mode screenshots. This session added Key Contribution (3-icon row) and Research Method (2x2 stat grid with a slot-machine digit-roll reveal), following the same measure-first, flag-what's-inferred workflow used for Hero and Project Overview.

## Human directions

- "next let's do the key contribution part" — provided Figma dev-mode screenshots + 3 icon SVGs (material-symbols computer-outline, flowsheet-outline, ix user-manual).
- "can you make the text with the icon 14px" (was 15px per Figma) — "ok good now can you scale the 3 icon svg to match the reduced text size a bit" — scaled 72px → 64px.
- "let's do the the research method" — provided 16 Figma dev-mode screenshots plus, critically, a screen recording and a reference site (shubhiagarwal06.framer.website) for the intended motion.
- First motion pass (slide-up + un-blur + fade, matching the About page's mission-quote technique) was built and reported — user then said: "can you check the motion again. this looks like the numbers are just fading in but on the site, it looks like the numbers are changing like a slot machine" + a second, more targeted screen recording.
- "can you make the text within the research method beside the section title 'Research Method' 1px smaller text size" — heading 20→19px, description 16→15px.
- "did you also change the text size on the numbers" — no, confirmed unchanged.
- "can you change the big numbers too" — 128→127px.
- "let build and push".

## Records of resistance / things I got wrong and had to correct

- **Misread the motion on the first pass.** Built a plain scroll-linked blur/fade for the whole stat block (reasonable, matched an existing pattern in this codebase) but it wasn't what was being asked for. The user caught it immediately and pointed at a second recording. Frame-by-frame extraction via ffmpeg (same tool used earlier for the AIG hero video) made the actual effect obvious: each digit rolls vertically through several values with motion blur before landing — a real odometer/slot-machine effect, not a fade.
- **Shipped a real bug in the digit-roll math and caught it via measurement, not eyeballing.** Used `translateY(-400%)` intending to move the strip up by 4 digit-heights, but CSS `%` in a transform is relative to the *element's own* box — the 5-digit strip's full height (640px), not one digit (128px) — so `-400%` moved it 2560px, five times too far, scrolling the numbers completely off-screen and invisible. First Puppeteer screenshot showed blank space where the numbers should be; rather than guessing at a fix, checked the actual computed `transform` value, recognized the 5x discrepancy, and corrected to `-80%` (i.e. `(STEPS-1)/STEPS`), then re-verified computed transform equaled exactly `-512px` (4 × 127px) before trusting it.
- **Key Contribution's horizontal icon-row inset (216px) and Research Method's row-gap/number-to-divider gap** were not directly captured in any of the provided redlines — flagged clearly in code comments as inferred rather than presented as measured fact, consistent with this project's established rule.

## Successes

- Reused the About page's `whileInView`/`once: false` pattern for the container-level reveal, and layered the new digit-roll on top via Framer Motion variant propagation (the digit strip has no `initial`/`animate` of its own — it inherits "hidden"/"visible" from its motion.div ancestor), so both effects stay perfectly in sync off one shared scroll trigger rather than two separately-timed animations.
- Diagnosed the invisible-numbers bug by reading actual computed `transform` values in Puppeteer rather than assuming the CSS percentage math was correct — caught a real, non-obvious CSS gotcha (percentage-in-transform relative to own box, not a child's) before it shipped.
- Kept the icon SVGs at their exact Figma-exported 72×72 size (no manual resizing needed) and scaled down cleanly via Tailwind classes for the later "match the reduced text" feedback.

## State at this checkpoint

- **New `src/components/case-studies/aig/AigKeyContribution.tsx`**: 3-icon row (72px SVGs scaled to 64px), 14px/500 text, on a `#F7F7F7` section background. Icon row horizontal inset (216px per side) is Figma-confirmed for item 1's position; items 2/3 spacing assumes symmetry (flagged as such).
- **New `src/components/case-studies/aig/AigResearchMethod.tsx`**: 2×2 stat grid (Employee Interviews/Personas & Journeys/Site Visit/Research Phase), each with a 127px number (`RollingDigit` component doing a 5-step vertical digit-roll with blur), a 304×2px divider, a 19px heading, and a 15px description. Whole item slides up/un-blurs/fades in via `whileInView` (`once: false`); the number's digit roll is driven by the same trigger via variants propagation.
- **New `src/assets/case-studies/aig/icons/`**: `competitor-research.svg`, `prototypes.svg`, `user-manual.svg`.
- **Modified `src/app/work/aig/page.tsx`**: now renders Hero → Project Overview → Key Contribution → Research Method in order.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds (static export generates `/work/aig` correctly), digit-roll animation verified via Puppeteer computed-style checks (transform, filter) at rest, mid-roll, and settled — not just visually eyeballed.
- Remaining AIG sections (Key Findings, Visual Directions, Exploration & Iterations, Final Design Implementation, Takeaway, related-projects row) not yet built.
