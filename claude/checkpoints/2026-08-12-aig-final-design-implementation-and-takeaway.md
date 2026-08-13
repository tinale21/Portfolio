# Checkpoint — AIG case study: Final Design Implementation + Takeaway sections

## Context

Final two AIG case study sections: "Final Design Implementation" (an intro paragraph pair, then 5 text+video rows — Homepage, Map, About, Explore ATL, Photo Booth) and "Takeaway" (a short statement + reflection paragraphs). This completes the AIG case study's full section set.

## Human directions

- "Now let's do the final design implementation and takeaway. Use the same text font size and video size rule you did for the visual directions section" — provided a motion reference recording, one Figma dev-mode screenshot, a full composite reference screenshot, and 5 videos explicitly mapped to Homepage/Map/About/Explore ATL/Photo Booth.
- "can you add a bit more space between the exploration & iterations section and the final design implementation section" — three follow-up rounds, each asking for more: pt-16 → pt-28 → pt-36 → pt-44.
- "can you make the 'Designed for both first-time...' paragraph have the same width as the videos and is in #6E7681".
- "how much space is between the visual directions section and the exploration & iterations section" — a plain measurement question, answered via Puppeteer rather than recalled from memory.
- "can you increase a bit more" / "doo pt-30" / "add 2pt" — three more rounds tuning that same Visual-Directions-to-Exploration gap: pt-28 → pt-36 → pt-[120px] → pt-[122px].
- "can you make the 'This project was my first...' paragraph the same width as the videos and also in #6E7681" — same fix applied to Takeaway's paragraphs (which have no video of their own to size against, but reused the same 597px width by instruction).
- "let's build and push".

## Records of resistance / things I got wrong and had to correct

- Nothing went wrong in the build itself, but two rounds of "how much/add more space" feedback (Visual Directions↔Exploration & Final Design Implementation↔Exploration) required real care not to conflate: they're different section-pair gaps, controlled by different files' padding, and needed independent verification each round rather than assuming one fix covered both.
- "doo pt-30" required recognizing Tailwind's default spacing scale skips from `28` to `32` (no `30` step) — used the arbitrary-value equivalent (`pt-[120px]`, 30 × 4px) rather than silently rounding to the nearest real utility class.
- Caught before it shipped: `INTRO.paragraphs` and `TAKEAWAY.paragraphs` were both originally set to `w-[650px]`, wider than the 597px video cap — fixed to exactly match once asked, verified the two are pixel-identical (both flush at the same 68px right-edge gap).

## Successes

- Watched the motion reference recording before writing any code, confirmed it was a plain sequential scroll with none of Exploration & Iterations' extra motion (no progress bar, no tilt) — avoided over-building unrequested animation.
- Reused Visual Directions' exact established rules (15px text, video capped at 597px + ml-auto) end-to-end rather than re-deriving new values, per direct instruction — kept the two sections visually consistent.
- Verified every spacing/color/width change via actual computed styles and Puppeteer measurements at each of the many iterative rounds, rather than assuming a class edit "worked."

## State at this checkpoint

- **New `src/components/case-studies/aig/AigFinalDesignImplementation.tsx`**: "Final Design Implementation" eyebrow, intro row (statement + 2 paragraphs, paragraphs 597px wide, `#6E7681`), then 5 text+video rows (each video capped at 597px, `ml-auto`, matching Visual Directions exactly). Section top padding: `pt-[122px]` (after several rounds of "add more space").
- **New `src/components/case-studies/aig/AigTakeaway.tsx`**: "Takeaway" eyebrow + statement + 2 reflection paragraphs, matched to the same 597px width / `#6E7681` color as Final Design Implementation's intro, despite having no video of its own.
- **New `public/projects/aig-fdi-{homepage,map,about,explore-atl,photo-booth}.mp4`**: scaled to 1600px wide, CRF 18, no crop needed (same 1.7888:1 source aspect as Visual Directions), no audio present in any source.
- **Modified `src/components/case-studies/aig/AigExplorationIterations.tsx`**: top padding tuned across several rounds to `pt-[122px]` for more space below Visual Directions.
- **Modified `src/app/work/aig/page.tsx`**: now renders all 9 AIG sections in order — Hero → Project Overview → Key Contribution → Research Method → Key Findings → Visual Directions → Exploration & Iterations → Final Design Implementation → Takeaway. This completes the AIG case study.
- Verified: `npx tsc --noEmit` clean, both a plain `npm run build` and a `NEXT_PUBLIC_BASE_PATH=/Portfolio` build succeed, all 9 case-study video `src` attributes correctly prefixed in the GH-Pages-flavored build output, no overflow at 1512/1920px (the pre-existing, unrelated `AigProjectOverview` overflow at 1280px still applies, untouched).
