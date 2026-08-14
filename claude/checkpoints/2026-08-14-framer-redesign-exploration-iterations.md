# Checkpoint — Framer Redesign Exploration & Iterations

## Context

Built Framer Redesign's Exploration & Iterations section, a direct structural and motion port of AIG's Exploration & Iterations component, with this project's own black/gray accent colors (color-sampled from the reference, not AIG's blue/lavender).

## Human directions

- "now let's do the exploration & iterations: [screenshot]. use the same rule and motion as the aig one. Images: [3 images] (Low-fi Exploration) (Mid-fi Iteration) (Prototype)" — provided a full reference screenshot (Screenshot 2026-08-14 at 12.54.33 PM.png) and three composite images directly.

## Records of resistance / things I got wrong and had to correct

- Before building, noticed the "Prototype" image (Rectangle 136.png) had a terminal window overlaid on the Framer-editor mockup showing what looked like an actual dev session — GitHub username, local file paths (`/Users/tinale/Documents/GitHub/Framer`), git push errors. This wasn't obviously an intentional design element, so flagged it directly and asked how to proceed rather than assuming either way (using it as-is could expose personal info; silently cropping it could remove something intentional). User confirmed to use it as provided.
- First verification screenshot (captured after scrolling down through the section and then back up) showed the section rendering with only the eyebrow label and no visible steps — looked like a broken component at first glance. Checked the actual DOM before assuming a bug: all three headings, all three badges, and the full section HTML were present and correct, with zero console errors. Root cause was in the *test script*, not the component: `AigExplorationIterations`'s motion is a continuous function of live scroll position (`useScroll`/`useTransform`, not a one-time `whileInView` trigger), so scrolling back up past a step's trigger threshold after passing through it makes it genuinely go back to `opacity: 0` — exactly the "re-triggers every time it re-enters view" behavior already documented for this component. Fixed the verification approach (capture at each step's own scroll position, don't scroll back up before checking) instead of second-guessing the component itself.

## Successes

- Sampled the reference screenshot's actual pixel colors before choosing the badge/divider colors, rather than defaulting to AIG's blue out of habit — found black (`#000000`) for the active badge/divider and `#BFBFBF` for the divider track, and used those directly. This mirrors the same kind of deliberate per-project color substitution already established for Wayve's own Exploration & Iterations section.
- Diagnosed the blank-looking first screenshot correctly as a test artifact rather than a real bug by checking the DOM state directly before touching any component code — avoided "fixing" a component that was never broken.

## State at this checkpoint

- **New `src/components/case-studies/framer-redesign/FramerRedesignExplorationIterations.tsx`**: structurally and motion-wise identical to `AigExplorationIterations.tsx` — same 380px column width, same badge/divider/heading/body typography and spacing, same per-block scroll-progress-bar motion (`useScroll` offset `["start 80%", "start 30%"]`) and image-tilt behavior, same centered fixed-width layout. Badge and divider active color changed to `#000000` and the inactive track to `#BFBFBF`, matching this reference's own palette (color-sampled directly).
- **New `src/assets/case-studies/framer-redesign/exploration/{low-fi,mid-fi,prototype}.png`**: copied directly from the provided files (all 1696x1024, matching AIG's own exploration image dimensions exactly).
- **Modified `src/app/work/framer-redesign/page.tsx`**: renders `<FramerRedesignExplorationIterations />` after `<FramerRedesignKeyFindings />`.
- Verified: `npx tsc --noEmit` clean; screenshots at each step's own scroll-triggered position confirm all three steps render correctly (headings, descriptions, images with tilt, black badges, scroll-progress dividers); `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds; no new horizontal overflow beyond the pre-existing, unrelated Project Overview `w-[650px]` issue.

## Remaining Framer Redesign work

Everything past Exploration & Iterations — whatever sections the reference design calls for next — is not yet built.
