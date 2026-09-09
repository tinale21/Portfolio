# Checkpoint — Natural mobile wrapping for Project Overview text

## Context

On the case study pages, the Project Overview column's bold statement, "The Problem", and "The Solution" text had hard-coded line breaks tuned for the wide desktop column, which produced ragged orphan lines on mobile.

## Human directions

- "can you also check on mobile that the text for the project overview, the problem, and the solution and wrapping normally on mobile"

## Records of resistance / things I got wrong and had to correct

- Confirmed the problem via a mobile (390px) screenshot before changing anything: the left column's bold statement / Problem / Solution each wrapped their desktop "lines" independently and then force-broke via `<br>`, leaving short orphan lines ("engagement at AIG's Atlanta Innovation Hub.", "traditional wayfinding." on their own). The right column's intro paragraphs (plain strings) already wrapped cleanly — the contrast confirmed the hard `<br>`s were the cause.
- These hard breaks exist on purpose for desktop (the code comments explain each `*_LINES` array is broken to match Figma's exact line breaks at the 605px column width) — so the fix had to keep them at `lg`+ and only relax them on mobile, not delete them.
- The `Lines` helper is duplicated identically across all four case-study ProjectOverview files — updated all four so behavior stays consistent.
- When verifying, a page-wide `section br` check showed 5 still-visible `<br>`s on Wayve mobile. Traced them to a *different* component (`WayveHowWayveScales`, the "01 Technology / 02 Venue Activation / 03 Digital Ownership" cards), not the Project Overview — and screenshotted that section to confirm it wraps fine on mobile anyway (its breaks fall at natural points). Left it untouched: it's outside the named scope and isn't broken.

## State at this checkpoint

- **Modified** `AigProjectOverview`, `WayveProjectOverview`, `EmoraProjectOverview`, `FramerRedesignProjectOverview`: the shared `Lines` helper's `<br />` between lines is now `<br className="hidden lg:block" />` preceded by a `{" "}` space. Below `lg` the break is `display:none` and the space joins the lines so the text wraps naturally to the mobile width; at `lg`+ the break is active, reproducing Figma's exact desktop line breaks. The `PARAGRAPHS` (right column) were already plain wrapping strings — untouched.

## Verification

- Mobile (390px) screenshots of AIG and Wayve Project Overview: bold statement, Problem, and Solution now wrap naturally and fill the column evenly, no orphan lines.
- Puppeteer br-visibility check: on mobile, all four ProjectOverview `<br>`s are `display:none` (collapsed to spaces); on desktop (1512px) all are visible, and the bold statement is still 2 lines — Figma desktop breaks preserved.
- Emora and Framer: 0 visible ProjectOverview brs on mobile, 0px overflow.
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Remaining work

- None for the requested scope.
