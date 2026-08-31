# Checkpoint — Remove "/" separators from desktop nav

## Context

Removes the "/" characters between Home, Work, and About in the desktop nav, tightening the spacing to compensate.

## Human directions

- 'can you remove the "/" on the nav bar between home, work, and about. you can reduce the space between the three a little to make up for the / removal'

## Records of resistance / things I got wrong and had to correct

- None.

## State at this checkpoint

- **Modified** `src/components/NavBar.tsx`: removed the per-item wrapping `<span>` and its `/` separator; the desktop `<nav>` now renders the three `NavLink`s directly. Outer nav gap reduced from `gap-4` (16px) to `gap-3` (12px) to keep the row from reading too loose without the visual separators. Mobile nav panel (hamburger menu) never used the slash separator and is unchanged.

## Verification

- Puppeteer: confirmed nav text content is now `"HomeWorkAbout"` (no slash characters) and the gap between each link's bounding box is a consistent 12px.
- Full overflow sweep across all 7 pages, both breakpoints (1512px/390px), still 0px.
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Remaining work

- None currently flagged.

## Follow-up -- more space between nav items

Same-day.

### Human directions

- "add a bit more space between home, work, and about"

### State at this checkpoint

- **Modified** `src/components/NavBar.tsx`: desktop nav gap increased from `gap-3` (12px) to `gap-6` (24px).

### Verification

- Puppeteer: confirmed the gap between each link's bounding box is now a consistent 24px.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.
