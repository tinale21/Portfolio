# Checkpoint — Combine copyright and "All Rights Reserved." onto one line

## Context

Follow-up to the previous checkpoint (`2026-08-30-footer-all-rights-reserved.md`), which put "All Rights Reserved." on its own line below the copyright text.

## Human directions

- "instead of puting it below the 2026 Tina Le, can you just put it in the same line"
- "build and push"

## Records of resistance / things I got wrong and had to correct

- None.

## Successes

- Verified via Puppeteer that the combined line ("© 2026 Tina Le. All Rights Reserved.") fits on one line without wrapping at both 390px (mobile) and 1512px (desktop) viewports, with zero horizontal overflow.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error flagged in every checkpoint this session.

## State at this checkpoint

- **Modified** `src/components/Footer.tsx`: removed the `<br />` between the copyright and "All Rights Reserved." text, joined them into a single line with a period separator ("© 2026 Tina Le. All Rights Reserved.").

## Remaining work

- None currently flagged.
