# Checkpoint — Add Education section above Experiences

## Context

New homepage section, above Experiences, listing SCAD — same visual/text rules as Experiences per direct instruction.

## Human directions

- 'i want to add a section above the experiences section on the home page. this section will follow the same text and spacing rules as the experiences section. The title of the section is "Education" Below on the left would be "Savannah College of Art and Design" / "BFA, User Experience (UX) Design (Minor: Film and Television)" and on the right side: "Sep 2023 - May 2027" / "Atlanta, GA"'

## Records of resistance / things I got wrong and had to correct

- Before writing anything, traced `ExperiencesSection`'s negative `margin-top` ("pull") mechanic, shared with `ConnectSection` via `getConnectExitTiming` — it pulls whichever section sits directly after Connect up to visually sweep over Connect's still-pinned dark heading as the user scrolls. Adding Education as its own top-level `<section>` between Connect and Experiences (the naive reading of "add a section above") would have made Education the one absorbing that pull instead — and Education, being a single row, is far shorter than the pull's own enforced minimum (300px, see `connect-data.ts`'s `Math.max(300, ...)`), which would have guaranteed the effect overshoot straight through Education and dragged Experiences (and everything after it) up into Connect's dark area. Caught this from the code's own comments before touching anything, not by shipping it and noticing the bug live.
- Resolved by keeping Education and Experiences inside the *same* pulled `<section>` (Education's heading+row first, Experiences' heading+rows below, extra top margin between the two blocks) rather than as two independent top-level sections in `page.tsx`. Documented why directly in `ExperiencesSection.tsx` so this doesn't look like an accident on a future pass. Verified the fix actually holds, not just in theory: screenshotted the Connect→Education scroll transition at several scroll offsets and confirmed the white sweep-over-Connect effect still triggers correctly, and confirmed via `getBoundingClientRect` that "Trusted By" (the section right after Experiences) still renders on a white background at its expected position rather than getting pulled into Connect's dark area.
- One test artifact, not a real bug: an early screenshot appeared to show the "Education" heading missing entirely. Turned out to be `scrollIntoView({block:"start"})` aligning the heading exactly behind the site's `sticky top-0` nav header (confirmed by checking `NavBar.tsx` directly) — a byproduct of the test method, not the actual page. Fixed by scrolling to an offset that clears the sticky nav before screenshotting, rather than concluding the heading was actually broken.

## Successes

- Reused `ExperienceRow`/`Experience` as-is instead of writing a new component — the requested layout (bold line + light line on the left, right-aligned date/location) maps directly onto the existing fields (`title`/`company`/`date`/`location`), and the instruction was explicit about matching Experiences' own text/spacing rules exactly, so reusing the identical component guarantees that rather than approximating it.
- Verified via Puppeteer against `next dev`: Education renders correctly on both desktop and mobile with the exact text requested, zero horizontal overflow at either breakpoint.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error flagged in every checkpoint this session.

## State at this checkpoint

- **Added** `src/components/experiences/education-data.ts`: one `Experience`-typed entry for SCAD.
- **Modified** `src/components/experiences/ExperiencesSection.tsx`: renders the Education heading + row(s) before the existing "Experiences" heading + rows, inside the same pulled `<section>` (with a comment explaining why, tied to the Connect-overlap pull constraint). No changes to `connect-data.ts` — the combined Education+Experiences height stays comfortably above the pull's cap, same margin of safety as before.

## Remaining work

- None currently flagged.
