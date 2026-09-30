# Checkpoint — Fix Secondary Research cards painting over the nav

## Context

The Secondary Research collage cards/pills rendered *on top of* the sticky nav bar when scrolled past it.

## Human directions

- "the link cards are doing a weird thing where it goes over the nav bar when scrolled"

## Records of resistance / things I got wrong and had to correct

- Root cause: the collage's pills use z-index values up to 55, and the sticky nav is `z-50`. The collage container was `position: relative` with `z-index: auto`, which does NOT establish a stacking context — so the pills' z-indexes competed with the nav at the ROOT stacking context, and 55 > 50 meant they painted over the nav when they scrolled behind it.
- Fix: added `isolation: isolate` (Tailwind `isolate`) to each collage container, creating a new stacking context. The pills' z-indexes are now scoped inside it, and the whole container sits below the nav's `z-50` at the root. (Didn't just lower the pill z-indexes, since they need their relative ordering; isolation is the clean fix and keeps the design intact.)
- Verified via hit-test: `document.elementFromPoint` at the nav's center now returns a nav link inside `<header>` (not a card), and a full screenshot shows cards cut off cleanly at the nav's bottom edge.

## State at this checkpoint

- **Modified** `AigSecondaryResearch.tsx`, `WayveSecondaryResearch.tsx`, `EmoraSecondaryResearch.tsx`: added `isolate` to the desktop collage container (`relative isolate mx-auto h-[540px] max-w-[980px]`).

## Verification

- Hit-test at the nav center returns a nav link (`insideNav: true`) while cards intersect the nav band — nav paints on top.
- Screenshot confirms cards scroll behind the nav.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.

## Remaining work

- None flagged.
