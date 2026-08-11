# Checkpoint — AIG case study: Hero + Project Overview sections

## Context

First AIG case study sections, built one-by-one from Figma dev-mode data, a Figma prototype recording, and the user's provided demo reel footage. This establishes the per-project case-study route pattern (`src/app/work/aig/page.tsx`, "graduated" out of the generic `src/app/work/[slug]/page.tsx` placeholder) that the rest of the case studies will follow.

## Human directions

- Provided the AIG Figma design export + prototype recording, asked for analysis first before building ("i will provide you after with all the assets... but for now just analyze and have an understanding of it").
- Provided Hero section assets (logo reuse, meta row copy, demo reel video) one section at a time ("let's do this one by one").
- Iterative feedback on the hero logo (no border), hero video height (550 → 450 → 480 → 510 → 500), and confirmed no audio on any site videos.
- Provided Project Overview assets (Figma dev-mode screenshots, team photo) and, across many rounds, precise corrections: vertical gaps (via Figma's ruler tool: 87px video→heading, 325px statement→Problem, 85px paragraphs→photo), exact Figma line-break matching (not text-justify), a block-level right shift (not per-line text-align), an orphaned "a" line-break fix, and paragraph/photo width matched then scaled together (594 → 650px).
- Discovered and fixed a real horizontal-overflow ceiling for the left column (605px max at the 1512px reference width) via direct trial-and-measurement.
- "shift the team image down 5px" — applied as `mt-[85px]` → `mt-[90px]`.
- "is there a way to make the aig video on the case study quality better like i sent you" — root-caused to a too-low encoding bitrate, not resolution.
- "let's build and push".

## Records of resistance / things I got wrong and had to correct

- Initially inferred the bold-statement→Problem gap as 96px (assumed same as the Problem→Solution gap) since it wasn't in the original redlines — corrected to the ruler-tool-measured 325px once the user sent precise screenshots. Established practice going forward: say explicitly when a gap is inferred vs. measured, rather than presenting a guess as fact.
- Misread "can you make the lining of the words the same" as a request for `text-align: justify` — user clarified they meant matching Figma's exact line breaks. Reverted justify, implemented explicit line arrays instead.
- Misread "align the text to the right padding" as per-line `text-align: right` — user clarified they wanted the whole block shifted as a unit, ragged-right preserved. Fixed via a fixed-width block + `ml-auto` instead.
- Left column body text drifted from Figma's real line breaks after early edits (e.g. Solution wrapping to 3 lines instead of Figma's 4) — user caught this with a side-by-side screenshot; re-transcribed all three blocks (bold statement/Problem/Solution) to hard-coded line arrays matching exactly.
- Widening the left column to 640px caused real, measured horizontal overflow (`scrollWidth` 1545 vs `clientWidth` 1512) at the 1512px reference viewport — binary-searched down to the confirmed-safe 605px maximum rather than guessing.
- The hero video was originally cropped/encoded at only ~832 kb/s, causing visible gradient banding — found the original 4K source file still on disk (`~/Downloads/AIG demo reel_smaller verdion_audio 1.mp4`), confirmed pixel-for-pixel that the existing crop (`crop=3840:1532:0:314,scale=1378:550`) was unchanged, and re-encoded from the source at CRF 18 (~1.67 Mbps, ~2x the old bitrate) instead of just re-compressing the already-degraded output.

## Successes

- Recognized the per-project case-study route pattern early enough to exclude `aig` from the generic `[slug]` route's `generateStaticParams()` before it could collide.
- Used ffmpeg (via the bundled `imageio_ffmpeg` binary, no system install needed) to losslessly strip audio and precisely crop the hero video to spec.
- Verified every spacing/overflow/line-break claim with Puppeteer measurements (via `puppeteer-core` + local Chrome, the established pattern for this project) rather than eyeballing — caught the real overflow ceiling and the real video banding issue this way.
- For the video quality request, didn't just re-encode the existing (already-compressed) file at a higher bitrate — went back to find the original untouched source and re-derived the exact crop by pixel-matching frames, so the fix addresses the actual root cause instead of polishing already-lossy data.

## State at this checkpoint

- **New `src/app/work/aig/page.tsx`**: renders `AigHero` + `AigProjectOverview`.
- **New `src/components/case-studies/aig/AigHero.tsx`**: AIG badge/logo, "American International Group" h1, 4-column meta row, hero video (`/projects/aig-hero.mp4`).
- **New `src/components/case-studies/aig/AigProjectOverview.tsx`**: two-column layout — left column (`lg:w-[605px]`, bold statement + Problem + Solution, hard-coded Figma line breaks) and right column (`lg:flex-1`, 3 intro paragraphs at `lg:w-[650px] lg:ml-auto` + team photo at the same width, `mt-[90px]` above the photo).
- **New `src/assets/case-studies/aig/team-photo.png`**: team photo asset.
- **New `public/projects/aig-hero.mp4`**: hero video, 1378×550, no audio, re-encoded at CRF 18 (~1.67 Mbps) from the original 4K source.
- **Modified `src/app/work/[slug]/page.tsx`**: `generateStaticParams()` excludes `"aig"`.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds (static export generates `/work/aig` as its own route, `/work/[slug]` correctly excludes it), dev server serves the AIG page and the new video correctly.
- Remaining AIG sections (Key Contribution, Research Method, Key Findings, Visual Directions, Exploration & Iterations, Final Design Implementation, Takeaway, related-projects row) not yet built — to be done one section at a time as the user provides assets, same as Hero and Project Overview.
