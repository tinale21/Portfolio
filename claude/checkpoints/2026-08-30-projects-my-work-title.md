# Checkpoint — Rename Selected Projects heading to "My Work"

## Context

Simplifies the homepage Projects section heading and removes its descriptor, matching the plainer heading style already used by Experiences/Education.

## Human directions

- 'Can you change the "Selected project.." title as well its descriptor to just "My Work". Use the same padding as the title for the experience title and eduction title'

## Records of resistance / things I got wrong and had to correct

- The h2 itself already used the identical classes to `ExperiencesSection`'s "Experiences"/"Education" headings (`font-serif text-[26px] font-bold text-black`) — no change needed there. Interpreted "same padding as the title" as referring to the *gap between the title and the content below it*, since that's the one place these sections actually differed: Experience/Education use `mt-4` between heading and content, while Projects used `mt-10` on its grid specifically sized to leave room for the (now-removed) descriptor paragraph. Changed it to `mt-4` to match once the descriptor was gone.

## Successes

- Verified via Puppeteer that "Selected projects" no longer appears anywhere on the page, "My Work" renders with the same heading style as Experiences/Education, and the reduced gap to the project grid looks correct on both desktop and mobile.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## State at this checkpoint

- **Modified** `src/components/projects/ProjectsSection.tsx`: heading text changed from "Selected projects, thoughtfully curated." to "My Work"; removed the descriptor paragraph ("A small collection of work exploring clarity, care, and human-centered design."); grid's top margin changed from `mt-10` to `mt-4` to match Experiences'/Education's heading-to-content spacing now that there's no descriptor to make room for.

## Remaining work

- None currently flagged.

## Follow-up -- more space below the title

Same-day.

### Human directions

- 'can you add more space between the "My Work" title and the rest of the section'

### State at this checkpoint

- **Modified** `src/components/projects/ProjectsSection.tsx`: grid's top margin changed from `mt-4` back to `mt-10` (the original pre-rename gap) per direct feedback wanting more room specifically here -- a deliberate divergence from Experiences'/Education's `mt-4` now, not an oversight.

### Verification

- Visually confirmed via screenshot on desktop; full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up -- bigger heading text

Same-day. Prior message asking for more spacing was ambiguous (the referenced comparison, Experiences' own title-to-content gap, is actually smaller than what "My Work" already had) -- asked for clarification instead of guessing; user redirected to a different, unambiguous request instead.

### Human directions

- 'can you make the "My Work" text a bit bigger'

### State at this checkpoint

- **Modified** `src/components/projects/ProjectsSection.tsx`: heading font size increased from `text-[26px]` to `text-[32px]` -- a deliberate divergence from Experiences'/Education's `text-[26px]` now, not shared styling.

### Verification

- Visually confirmed via screenshot on both desktop and mobile. Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up -- bring the descriptor back

Same-day.

### Human directions

- "can you actually bring back the descriptor for the selected work"

### State at this checkpoint

- **Modified** `src/components/projects/ProjectsSection.tsx`: restored the descriptor paragraph ("A small collection of work exploring clarity, care, and human-centered design.") right below "My Work", same text and mt-2 spacing as before it was removed. Heading's bigger size (text-[32px]) and the grid's larger top margin (mt-10) from the prior two follow-ups are both untouched.

### Verification

- Visually confirmed via screenshot: descriptor renders correctly under the bigger heading, with the grid's generous spacing still intact below it. Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up -- bigger descriptor text

Same-day.

### Human directions

- "can you make the descriptor a little bit bigger"

### State at this checkpoint

- **Modified** `src/components/projects/ProjectsSection.tsx`: descriptor's font size increased from `text-base` (16px) to `text-lg` (18px).

### Verification

- Visually confirmed via screenshot -- text still fits comfortably within its existing max-w-[746px]. Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up -- even more space before the grid

Same-day.

### Human directions

- "can you add more space between the my work title + descriptor to the content in the section"

### State at this checkpoint

- **Modified** `src/components/projects/ProjectsSection.tsx`: grid's top margin increased from `mt-10` to `mt-16`.

### Verification

- Visually confirmed via screenshot on desktop. Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up -- revert the mt-16 change

Same-day, immediately after.

### Human directions

- "revert that last change"

### State at this checkpoint

- **Reverted** `src/components/projects/ProjectsSection.tsx`: grid's top margin back to `mt-10` (undoing the `mt-16` from the immediately preceding follow-up).
