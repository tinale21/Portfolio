# Checkpoint — Case study Project Overview mobile spacing

## Context

Continuing the mobile-issues pass: on every case study page (AIG, Wayve, Emora, Framer Redesign), the "Project Overview" section's gap before "The Problem" was a large desktop-tuned pixel value, applied unconditionally — reading as an oddly huge gap on mobile next to the much smaller "Problem"-to-"Solution" gap right below it.

## Human directions

- "ok now for the case studies on mobile, can you make the project overview section and the the problem section have the same spacing between both section as the spacing between the the problem section and the aolution section (for mobile only)"

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — same root-cause pattern as the About section fix earlier in this pass (a Figma-ruler-measured desktop pixel value applied with no breakpoint gating), recognized and fixed the same way without needing to iterate.

## Successes

- Checked all four case studies before assuming the fix generalized identically — each has its *own* Figma-measured statement-to-Problem gap (AIG 325px, Wayve 365px, Emora 321px, Framer Redesign 312px), all different, but every one paired with the identical 51px Problem-to-Solution gap. Fixed each with its own correct desktop value preserved via `lg:`, not a single copy-pasted number.
- Verified the pre-existing, unrelated `w-[650px]` horizontal-overflow issue (flagged and left out of scope in earlier checkpoints this session) still measures as the same ~10px baseline after this change, not made worse by it.

## State at this checkpoint

- **Modified** `AigProjectOverview.tsx`, `WayveProjectOverview.tsx`, `EmoraProjectOverview.tsx`, `FramerRedesignProjectOverview.tsx`: each section's statement-to-"The Problem" gap changed from an unconditional `mt-[Npx]` (325/365/321/312px respectively) to `mt-[51px] lg:mt-[Npx]` — mobile now matches the 51px Problem-to-Solution gap; desktop keeps its original Figma-measured value unchanged.
- Verified: `npx tsc --noEmit` clean; mobile screenshots (AIG, Wayve) confirm the two gaps now read as visually equal; desktop screenshot (AIG) confirmed pixel-identical to the pre-existing design; horizontal overflow unchanged from the pre-existing baseline (~10px, the known unrelated `w-[650px]` issue); `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## Remaining mobile work

- The pre-existing `w-[650px]` Project Overview horizontal-overflow issue (present since AIG's original build, affects all four case studies) remains flagged but unfixed, out of scope unless asked.
- No other mobile issues currently flagged.
