# Checkpoint — Add "All Rights Reserved." to footer

## Context

Small copy addition below the footer's copyright line.

## Human directions

- 'at the bottom of the "@ Tina Le" can you put "All Rights Reserved"'
- 'can you do "All Rights Reserved."' (added a trailing period)
- "build and push"

## Records of resistance / things I got wrong and had to correct

- None.

## Successes

- Verified via Puppeteer on both desktop and mobile that the new line renders correctly under the copyright text with no overflow.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error flagged in every checkpoint this session.

## State at this checkpoint

- **Modified** `src/components/Footer.tsx`: added a `<br />` and "All Rights Reserved." as a second line inside the existing copyright `<p>`, same styling (no new classes needed).

## Remaining work

- None currently flagged.
