# Checkpoint — Wayve "Data Points" section

## Context

New section for the Wayve case study, placed after Secondary Research and before
Key Findings. Modeled on the reference (celinafang.framer.website/work/nectar): a
field of faded sticky notes behind a bold centered count ("500+ Data Points").
Per direct instruction it uses the site's own type (Inter) and the brand purple
`#4A25A9` for the number instead of the reference's orange. Each note is signed
"Tina".

## Human directions

- "add this data point section after my secondary research for my wayve case study
  … use the typography we have been using … don't do the orange, do #4A25A9. Also
  use these text for the sticky notes [24 provided]."
- Iterated many times on the sticky-note field: notes must not overlap/stack; must
  be evenly spaced; must have varied heights (not all identical); the "500+ Data
  Points" callout must sit on the white background inside a clean rectangle with no
  notes behind it (no feather/overlay); add a radial edge fade; decrease then
  slightly increase the overall height; and finally — make the notes the **square
  shape** of a sticky note.
- Authorized editing / adding / decreasing the note text to make the layout work.

## Records of resistance

- Repeatedly flagged a genuine geometric conflict: even vertical spacing + varied
  per-card heights + a clean rectangular gap + a flush bottom cannot all be perfect
  in a simple row-grid. Walked through why (row-grid gaps shift with card height;
  masonry needs an overlay for the gap which slices notes). Resolved only once the
  user chose the square-note direction — uniform square cells make spacing even,
  the gap genuinely empty, and the bottom flush, all at once.
- Did not fabricate a research statistic for the "500+" number — flagged it as a
  placeholder from the reference for the user to confirm/replace (still open).
- The source text included the "six-month retention" finding twice; kept both
  (placed far apart) rather than inventing a replacement, and flagged it.

## State at this checkpoint

- **New** `src/components/case-studies/wayve/WayveDataPoints.tsx`: a 7-column grid
  of `aspect-square` sticky notes (uniform squares → even spacing both axes, clean
  empty center gap, flush bottom). The callout spans the 3 center cells of the
  middle row (`gridColumn: 3 / 6`, `gridRow: 2`) — genuinely empty cells, so the
  count reads as text on the white background, no overlay. A radial mask
  (`ellipse 66% 74%`, solid to 36%, transparent at 83%) fades the field toward the
  edges while keeping the middle clear. 24 notes (condensed to fit the squares);
  the one leftover grid cell lands in the faded bottom-right corner. Laid out at a
  fixed `DESIGN_W` (1240) and transform-scaled to the container via ResizeObserver
  (same fixed-design-stage pattern as the Secondary Research collage), so nothing
  causes horizontal overflow.
- **Modified** `src/app/work/wayve/page.tsx`: import + render `<WayveDataPoints />`
  between `<WayveSecondaryResearch />` and `<WayveKeyFindings />`.

## Verification

- Puppeteer: desktop (1512) full-section and mobile (390) both render the square
  grid, even spacing, centered callout on white, and edge fade.
- Horizontal overflow 0px at mobile widths and desktop.
- `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Remaining work

- Confirm/replace the placeholder **"500+"** number with Wayve's actual data-point
  count.
- Decide whether to drop the duplicate six-month-retention note.
