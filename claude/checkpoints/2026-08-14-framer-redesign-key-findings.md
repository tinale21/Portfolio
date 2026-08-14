# Checkpoint — Framer Redesign Key Findings

## Context

Built Framer Redesign's Key Findings section, a direct structural port of AIG's Key Findings component (the 3-card grid with the tuned custom drop shadow).

## Human directions

- "do the key findings now: [screenshot]. use the same rules and drop shadow as the aig" — provided a full reference screenshot (Screenshot 2026-08-14 at 12.47.06 PM.png) with all three findings' numbers and text.

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — clean, direct port, same pattern already used for Wayve's and Emora's Key Findings sections.

## Successes

- Reused AIG's already-reworked shadow (`0px 4px 10px -4px rgba(0,0,0,0.15)`) exactly as specified, no re-derivation needed.

## State at this checkpoint

- **New `src/components/case-studies/framer-redesign/FramerRedesignKeyFindings.tsx`**: structurally identical to `AigKeyFindings.tsx` — same card treatment (10px radius, 2px solid `#F9FAFB` border, white background, 11px number-to-text gap, 80px/80px vertical and 56px/55px horizontal padding), same flex-1 row stretching to `lg:px-[68px]` with `gap-10`, same `#5465DF` number / black body text both at 16px, same shadow.
- **Modified `src/app/work/framer-redesign/page.tsx`**: renders `<FramerRedesignKeyFindings />` after `<FramerRedesignResearchMethod />`.
- Verified: `npx tsc --noEmit` clean; screenshot comparison matches the reference exactly (cards, shadow, colors, copy); `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds; no new horizontal overflow beyond the pre-existing, unrelated Project Overview `w-[650px]` issue.

## Remaining Framer Redesign work

Everything past Key Findings — whatever sections the reference design calls for next — is not yet built.
