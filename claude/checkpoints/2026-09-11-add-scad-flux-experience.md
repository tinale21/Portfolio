# Checkpoint — Add SCAD FLUX ATL experience row

## Context

Adds one more (most recent) entry to the home page's Experiences list.

## Human directions

- "for the experiences section on the home page, i want to add one more recent one. this will go above the scadpro delta one. it will be 'Visual Designer / SCAD FLUX ATL' on the left, and then 'Sep 2026 - Present / Atlanta, GA' on the right"

## State at this checkpoint

- **Modified** `src/components/experiences/experiences-data.ts`: prepended a new entry to `EXPERIENCES` (first in the array = top of the list, above SCADpro x Delta): `{ title: "Visual Designer", company: "SCAD FLUX ATL", date: "Sep 2026 - Present", location: "Atlanta, GA" }`. No `mobileCompany` needed — "SCAD FLUX ATL" is short enough to fit at phone width.

## Verification

- Puppeteer at 1512px and 390px: confirmed the new row renders first (title "Visual Designer", company "SCAD FLUX ATL", date "Sep 2026 - Present", location "Atlanta, GA"), directly above the SCADpro x Delta row, with the divider between them; 0px overflow at both breakpoints.
- Desktop screenshot confirms clean rendering (title/company left, date/location right).
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Remaining work

- None currently flagged.
