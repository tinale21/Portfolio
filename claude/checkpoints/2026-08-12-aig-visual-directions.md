# Checkpoint — AIG case study: Visual Directions section

## Context

Sixth AIG case study section: three "direction" rows (On the Horizon / Future Forward / United in Innovation), each pairing a title+description with an autoplaying video, built from 16 Figma dev-mode screenshots plus a Figma prototype recording and three raw screen-recording source videos.

## Human directions

- "let's do the visual directions. these are the figma dev but i want everything to go to the right and left padding so you can adjust from the figma dev numbers to meet this requirement across all screens" — provided 16 screenshots, three source videos explicitly mapped to row names, and a Figma prototype recording.
- "the 3 videos are too big, can you scale them down" — capped at their original Figma size (597px) instead of stretching via flex-1.
- "can you move the 3 videos to the right so they are at the right padding" — added `ml-auto` once the cap left them left-aligned with empty space after them.
- "can you make the text within the visual direction beside the title 'Visual Directions' 1px text size smaller" — row title/description 16→15px.
- "can you reduce the space a bit between the '[title]' and '[description]' ..." (all three rows) — gap 31→16px.
- "let's build and push".

## Records of resistance / things I got wrong and had to correct

- Nearly assumed the "play button" icon visible on each video in the static Figma dev-mode screenshots meant these were click-to-play elements, a real departure from every other video on this page (which all autoplay). Checked the Figma prototype recording first — it clearly shows each video already playing/cycling as the page scrolls, with no click or hover interaction. The play button turned out to be Figma's own editor-only affordance for video layers, not part of the actual design. Building click-to-play here would have been a real, avoidable mismatch with the reference.
- Found and fixed a real pre-existing bug while wiring up these videos: `AigHero.tsx`'s hero video used a raw `/projects/aig-hero.mp4` path with no `BASE_PATH` prefix — the exact bug class already fixed on `ProjectCard` early in this project, just missed on this one file. Verified the fix (and the three new videos) with an actual `NEXT_PUBLIC_BASE_PATH=/Portfolio` build, confirming all four video `src` attributes are correctly prefixed in the built HTML, not just assumed correct from reading the code.
- Initially made the video `flex-1` with no cap (matching the "stretch to padding" request) — grew the video to 1240px+ on a 1920px viewport, well past the source design, which read as too big once seen. Capped at the video's own original Figma width (597px) via `max-w`, which then left it left-aligned with dead space before the right padding — fixed with `ml-auto` per the very next round of feedback.

## Successes

- Checked the reference motion (Figma prototype) before writing any video-behavior code, rather than assuming the "obvious" autoplay pattern or the "obvious" click-to-play pattern from the static export alone.
- The three source recordings turned out to already be almost exactly the target 597:334 aspect ratio (0.08% off) — recognized this before reaching for a crop filter, so the encode is a straight scale with no unnecessary cropping logic.
- Systematically re-grepped the whole `src/` tree for other raw, unprefixed asset paths after finding the `AigHero` bug, rather than assuming it was the only instance — confirmed the `projects-data.ts` raw strings are fine since they're prefixed where consumed.

## State at this checkpoint

- **New `src/components/case-studies/aig/AigVisualDirections.tsx`**: "Visual Directions" eyebrow (16px, unaltered) + 3 rows, each a text column (512px, title 15px/#707682 + 16px gap + description 15px/500/#000) beside a video column (597×334 max, `ml-auto`, flush to the right padding, autoplay/loop/muted/playsInline). Row-to-row gap and section padding are inferred (not in the redlines), flagged in the file's comment.
- **New `public/projects/aig-{on-the-horizon,future-forward,united-in-innovation}.mp4`**: scaled to 1600px wide, CRF 18, no crop needed, no audio present in the sources.
- **Modified `src/components/case-studies/aig/AigHero.tsx`**: fixed the missing `BASE_PATH` prefix on the hero video's `src`.
- **Modified `src/app/work/aig/page.tsx`**: now renders Hero → Project Overview → Key Contribution → Research Method → Key Findings → Visual Directions in order.
- Verified: `npx tsc --noEmit` clean, both a plain `npm run build` and a `NEXT_PUBLIC_BASE_PATH=/Portfolio` build succeed, all four video `src` attributes correctly prefixed in the GH-Pages-flavored build output, no horizontal overflow at 1512/1920px (the known, unrelated `AigProjectOverview` overflow at 1280px still applies, untouched this round), and autoplay/pause behavior for all four videos tracks viewport visibility exactly like the Figma prototype reference.
- Remaining AIG sections (Exploration & Iterations, Final Design Implementation, Takeaway, related-projects row) not yet built.
