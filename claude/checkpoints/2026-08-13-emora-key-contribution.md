# Checkpoint — Emora Key Contribution

## Context

Built Emora's Key Contribution section, a direct structural port of AIG's Key Contribution component. Also covers a handful of small spacing tweaks made to Project Overview in this same window, requested individually between this section and the last checkpoint.

## Human directions

- "can you shift the the problem and the solution sections together up by 5px" — Project Overview's statement-to-Problem gap `325px` → `320px` (Solution's position is relative to Problem, so both moved together).
- "shift it 3px up" — `320px` → `317px`.
- "shift it 4px down" — `317px` → `321px`.
- "shift the image 5px down" — Project Overview's paragraphs-to-image gap `90px` → `95px`.
- "shift the image 1px down" — `95px` → `96px`.
- "now do the key contribution section. follow the same rules as the aig one. [screenshot]. Icons: ic_baseline-tablet.svg, mdi_presentation.svg, guidance_pen.svg" — provided a full reference screenshot (Screenshot 2026-08-13 at 6.55.38 PM.png) and the three icon assets directly.

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — the small Project Overview spacing nudges were applied exactly as requested each time, and Key Contribution was a clean, direct port.

## Successes

- Checked the three provided icon SVGs' native dimensions (75x75) before copying them in, confirming they're close enough to AIG's own 72x72 source icons that the same 64px scale-down treatment applies with no adjustment needed.

## State at this checkpoint

- **Modified `src/components/case-studies/emora/EmoraProjectOverview.tsx`**: statement-to-Problem gap now `321px` (from AIG's original `325px`, after three small direct-feedback nudges); paragraphs-to-image gap now `96px` (from AIG's original `90px`, after two nudges).
- **New `src/components/case-studies/emora/EmoraKeyContribution.tsx`**: structurally identical to `AigKeyContribution.tsx` — same `#F7F7F7` background, `#6C727D` eyebrow, `pt-[59px]`/`pb-[78px]` section padding, `mt-[67px]` eyebrow-to-row gap, 64px icons, 14px item text, `lg:px-[216px]` row inset with `sm:justify-between`.
- **New `src/assets/case-studies/emora/icons/{learning-app,presentation,visual-design}.svg`**: copied directly from the provided icon files.
- **Modified `src/app/work/emora/page.tsx`**: renders `<EmoraKeyContribution />` after `<EmoraProjectOverview />`.
- Verified: `npx tsc --noEmit` clean at every step; screenshot comparison for Key Contribution matches the reference closely; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds; no new horizontal overflow beyond the pre-existing, already-flagged `w-[650px]` Project Overview issue shared by all three case studies.

## Remaining Emora work

Everything past Key Contribution — whatever sections the reference design calls for next — is not yet built.
