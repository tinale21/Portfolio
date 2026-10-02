# Checkpoint — More white space between My Works and Let's Connect

## Human directions

- "can you add a little more white space between the my works section and the let's connect section"

## Context

Home order is Hero → Projects (My Works) → Connect → Philosophy. The gap wanted is between the Projects section's last cards and the dark Connect section.

## State at this checkpoint

- **Modified** `src/components/projects/ProjectsSection.tsx`: bottom padding increased `pb-10 sm:pb-14 lg:pb-16` → `pb-24 sm:pb-28 lg:pb-32` (40/56/64 → 96/112/128px). The Projects and Connect sections are flush (gap 0, as expected), so the extra space is this section's own bottom padding below the project cards, before Connect begins. Top padding / the `-mt-[838px]` Hero-sweep pull are unchanged.

## Verification

- Screenshot: clear white gap below the project cards before the dark Connect section.
- Overflow 0px at 390/768/1512; `tsc`/`eslint`/`build` clean.
