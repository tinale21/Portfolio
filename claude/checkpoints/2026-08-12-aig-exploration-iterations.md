# Checkpoint — AIG case study: Exploration & Iterations section

## Context

Seventh AIG case study section: a centered 3-step timeline (Low-fi/Mid-fi/High-fi), each step pairing a composite screenshot with a heading/description across a scroll-driven progress bar. Built from 9 Figma dev-mode screenshots, 3 composite fidelity images, a motion reference recording, and a reference site (maestroclass.framer.website) — then iterated through several rounds of direct feedback on layout and motion.

## Human directions

- "let's do the exploration & iterations. this is the motion i want when users scroll through the timeline" — provided the motion reference recording, reference site, 9 Figma screenshots, and 3 composite fidelity images (low-fi/mid-fi/high-fi).
- "the 3 images are way too big, scale down" — capped at 600px (was unbounded flex-1).
- "the layout is still not correct for this... the content doesn't have to go to the right and left padding, we can keep this centered... you also didn't include the active and disactive bar for the scroll which is also making the animation not correct. Look again at the motion reference" — two annotated screenshots showing the intended centered layout and a divider/progress-bar element I'd omitted entirely.
- "the motion is looking great so far. can you also try adding the image tilt as users scroll like the reference motion".
- "from the reference, it looks like it starts straight and then tilts when you scroll. increase the tilt a bit" — corrected the tilt's direction and magnitude.
- "decrease the tilt a bit now. also the tilt for the mid-fi should be to the other way since it on the right".
- "can you make the text within the exploration & iterations beside the title 'Exploration & Iteration' 1px text size smaller".
- "let's build and push".

## Records of resistance / things I got wrong and had to correct

- **Missed the scroll progress bar entirely on the first build.** Read the Figma redlines as just describing a plain static divider line between image and text. The user's correction ("you also didn't include the active and disactive bar for the scroll") sent me back to the same redlines with fresh eyes — the "39px"/"280px" height readings I'd seen earlier turned out to be two DIFFERENT layered rectangles (a light `#D4D8F7` track plus an indigo `#5465DF` active fill), not one static line. Rebuilt as a genuine per-step scroll progress indicator using the `useScroll`/`useTransform` pattern already established in `AboutEntry.tsx`, rather than continuing to treat it as decoration.
- **Got the image-cap layout wrong the same way as Visual Directions** (capped width left the row's default packing stranding content off-center) before the user clarified the section should just be a centered fixed-width column instead of stretching to page padding at all — a cleaner fix than chasing `ml-auto`/`justify-between` tuning again.
- **Got the tilt direction backwards on the first pass** (started tilted, straightened to 0deg) — corrected to start straight and tilt in as it scrolls, per direct feedback after re-checking the reference. Also initially used the same tilt direction for every step regardless of which side the image was on; corrected to mirror the angle's sign based on `imageFirst` once the user pointed out Mid-fi (image-right) should tilt the opposite way from Low-fi/High-fi (image-left).
- Iterated tilt magnitude twice (4deg → 7deg → 5deg) purely from direct feedback, since the exact angle isn't measurable from compressed reference video.

## Successes

- Once corrected, verified the progress bar's fill and the image's rotation both via actual computed `style` values at a range of scroll offsets (not just visually) — confirmed the bar height and rotate angle both progress smoothly and non-linearly with scroll position, not snapping.
- Recognized that "centered, not padding-stretched" was a cleaner structural fix than continuing to patch the flex-packing issue from the padding-stretched version — didn't try to force the old approach to work.
- Correctly generalized "the tilt for mid-fi should go the other way" into a `imageFirst ? -5 : 5` rule tied to the existing alternating-side data, rather than hardcoding a one-off exception for step 2.

## State at this checkpoint

- **New `src/components/case-studies/aig/AigExplorationIterations.tsx`**: "Exploration & Iterations" eyebrow (standard page padding) + a centered, fixed-width (826px) 3-step timeline. Each step (`ExplorationStep`) uses its own `useScroll`/`useTransform` to drive: content opacity/y/blur fade-in, a per-step progress bar (light track + indigo active fill growing 0→100% height), and an image tilt (0deg → ±5deg, sign depending on which side the image is on). Heading 31px, description 15px (both reduced from Figma's 32px/16px per direct feedback).
- **New `src/assets/case-studies/aig/exploration/{low-fi,mid-fi,high-fi}.png`**: the three composite fidelity images, used directly as provided.
- **Modified `src/app/work/aig/page.tsx`**: now renders Hero → Project Overview → Key Contribution → Research Method → Key Findings → Visual Directions → Exploration & Iterations in order.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, no overflow at 1512/1920px (the pre-existing, unrelated `AigProjectOverview` overflow at 1280px still applies, untouched this round), badge/divider alignment confirmed at identical x-coordinates, progress bar and tilt animations confirmed via computed style values across scroll positions.
- Remaining AIG sections (Final Design Implementation, Takeaway, related-projects row) not yet built.
