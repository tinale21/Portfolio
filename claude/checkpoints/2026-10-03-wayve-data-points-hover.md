# Checkpoint — Wayve "Data Points" sticky-note hover state

## Context

Follow-up to the Data Points section (see
`2026-10-03-wayve-data-points-section.md`). The resting sticky notes are faded
(gray text on white) so they read as background texture behind the "500+ Data
Points" callout. The user wanted a way to actually read any individual note.

## Human directions

- "when a user hovers over one of the sticky notes it turns the sticky note color
  into #D3BDFF with the text black for them to read (the sticky note does back to
  how it was when user is not hovering over that sticky note)."
- Confirmed "looks good" after review.

## Records of resistance

- None. Straightforward CSS hover; no pushback needed.

## State at this checkpoint

- **Modified** `src/components/case-studies/wayve/WayveDataPoints.tsx`: the `Note`
  card is now a `group` with `hover:bg-[#D3BDFF] hover:border-[#D3BDFF]`; the body
  text uses `group-hover:text-black` and the "Tina" signature `group-hover:text-[#4A4A4A]`,
  all with `transition-colors duration-200`. Reverts automatically on mouse-out
  (pure CSS hover). No other behavior changed.

## Verification

- Puppeteer: hovered a center note — it fills `#D3BDFF` with black, readable text
  while the rest stay faded; reverts on mouse-out.
- `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Remaining work

- Still open from the section checkpoint: confirm/replace the placeholder "500+"
  number; decide whether to drop the duplicate six-month-retention note.
