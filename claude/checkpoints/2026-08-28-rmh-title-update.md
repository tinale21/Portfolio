# Checkpoint — Update Ronald McDonald House experience title

## Context

Small copy fix in the Experiences list.

## Human directions

- 'now under the Experiences section for the Ronald McDonald House instead of "UX Designer Intern (Lead)" can you do "UX Design Lead (Contract)"'
- "build and push"

## Records of resistance / things I got wrong and had to correct

- None.

## Successes

- Verified via Puppeteer that the new title text renders and the old one no longer appears anywhere on the page. Zero horizontal overflow.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error flagged in every checkpoint this session.

## State at this checkpoint

- **Modified** `src/components/experiences/experiences-data.ts`: Ronald McDonald House's `title` changed from "UX Designer Intern (Lead)" to "UX Design Lead (Contract)".

## Remaining work

- None currently flagged.
