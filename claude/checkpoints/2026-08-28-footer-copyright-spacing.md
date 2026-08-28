# Checkpoint — Move footer copyright line up

## Context

Quick spacing tweak to the footer's "© 2026 Tina Le" line, added earlier this session.

## Human directions

- 'can you make the "@2026 Tina Le" in the footer a bit higher'
- "build and push"

## Records of resistance / things I got wrong and had to correct

- None. Reduced the margin above the copyright line and verified the actual rendered gap via `getBoundingClientRect` (not just visual comparison of two differently-scrolled screenshots, which initially looked confusing side-by-side) — confirmed exactly 24px on desktop, down from 48px.

## Successes

- Verified via Puppeteer: desktop gap between the footer's logo/columns row and the copyright line went from 48px to 24px (exact, measured); mobile went from 28px to 16px via the same proportional halving. Zero horizontal overflow.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error flagged in every checkpoint this session.

## State at this checkpoint

- **Modified** `src/components/Footer.tsx`: copyright line's top margin changed from `mt-7 lg:mt-12` (28px/48px) to `mt-4 lg:mt-6` (16px/24px).

## Remaining work

- None currently flagged.
