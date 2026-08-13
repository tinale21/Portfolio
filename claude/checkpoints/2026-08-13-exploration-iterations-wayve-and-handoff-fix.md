# Checkpoint — Wayve Exploration & Iterations + cross-case-study motion fix

## Context

Built Wayve's Exploration & Iterations section (reusing AIG's established spacing/text/motion, with Wayve-specific active/inactive colors), then found and fixed a real motion bug in the shared scroll-progress-bar technique — a bug that turned out to exist in AIG's original version too, and got backported there once confirmed.

## Human directions

- "can you make it where the previous active state finishes when it goes to the next" — Wayve's Exploration & Iterations was showing adjacent steps' progress bars filling simultaneously for a long scroll range instead of handing off cleanly.
- "i want to apply this to aig too" — port the same fix back to the original AIG section.
- "let's build and push".

## Records of resistance / things I got wrong and had to correct

- Nothing to correct in the sense of a wrong first attempt, but the fix itself took two iterations to land: first tried switching the `useScroll` offset from `["start end", "end start"]` (spans a block's entire viewport transit) to `["start end", "start start"]` (ties completion to the block's top reaching the viewport top) — measured a real improvement (overlap window roughly halved) but not enough. Narrowed further to `["start 80%", "start 30%"]`, which shrank the overlap to ~100px. Each step was verified by directly sampling both steps' bar heights at 100px scroll increments — not assumed from the code change alone.
- Explicitly reasoned through (and documented) why *true* zero overlap isn't achievable with this technique: each block's trigger is computed independently of its neighbors, and the math requires the gap between consecutive item-tops to exceed the viewport height, which doesn't hold for this content. Said so directly rather than continuing to narrow the window until it looked zero in one specific viewport size while being fragile elsewhere.

## Successes

- Diagnosed the bug with real measurement before touching code: sampled step 1 and step 2's bar heights across a scroll range and found step 2 was already 10-15% filled while step 1 was still only ~35% done — a concrete ~800px overlap window, not just a vague "feels off."
- Given "the same motion as AIG" was the standing rule for this whole Wayve build, correctly recognized that a motion bug found on Wayve's *copy* of AIG's code was really a bug in the shared technique itself, and proactively verified it reproduced on AIG's own page (same measurement approach, same numbers) before porting the fix back — rather than treating it as Wayve-only.

## State at this checkpoint

- **New `src/components/case-studies/wayve/WayveExplorationIterations.tsx`**: 4-step timeline (Research & Discovery / Concept Exploration / Validation & Refinement / Final Solution), structurally identical to AIG's version (380px columns, badge/heading/body typography, image tilt, centered fixed-width layout) with Wayve-specific colors (`#4A25A9` active, `#D2C8E9` inactive, both verified via computed style).
- **New `src/assets/case-studies/wayve/exploration/`**: the four provided composite images (1696x1024, matching AIG's own exploration image dimensions exactly).
- **Modified `src/components/case-studies/aig/AigExplorationIterations.tsx`**: same `useScroll` offset fix ported back (`["start end", "end start"]` → `["start 80%", "start 30%"]`), verified independently on AIG's own page.
- **Modified `src/app/work/wayve/page.tsx`**: appends `<WayveExplorationIterations />` after Key Findings.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, no overflow on either case study page, handoff timing confirmed via direct bar-height sampling on both AIG and Wayve (same ~100px overlap on both, down from AIG's original ~800px).
