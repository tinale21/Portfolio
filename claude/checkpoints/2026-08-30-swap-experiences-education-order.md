# Checkpoint — Swap Experiences and Education order

## Context

Reorders the two lists inside the homepage's combined Experiences/Education section (Education used to render first, Experiences second).

## Human directions

- "can you switch the experiences section and the education section"

## Records of resistance / things I got wrong and had to correct

- None — a straightforward JSX reorder. Moved the `mt-12 sm:mt-14 lg:mt-16` spacing (previously on "Experiences" to separate it from Education above it) onto "Education" instead, since it's now the second heading and needs that same separation from Experiences above it; "Experiences" no longer needs any top margin since nothing precedes it in this section any more.

## Successes

- Verified via Puppeteer that the heading order in the DOM is now `["Experiences", "Education"]`, and visually confirmed the spacing between them still reads correctly (matches the original gap, just applied to the other heading now).
- Confirmed the section's own scroll-pull mechanics (tied to Connect's exit timing) are unaffected — `Trusted By` still renders correctly on a white background after this section, same as before.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## State at this checkpoint

- **Modified** `src/components/experiences/ExperiencesSection.tsx`: swapped the order of the "Experiences" and "Education" heading + row-list blocks; moved the inter-heading top margin from "Experiences" to "Education" to match.

## Remaining work

- None currently flagged.
