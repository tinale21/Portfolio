# Checkpoint — Let's Connect section: vertical mobile layout

## Context

Continuing the mobile-issues pass: the home page's "Let's Connect!" section (ConnectSection) used desktop's landscape 1512x982 Figma frame directly for mobile too, spreading 6 photos across the full frame width — reading as "horizontal" and cramped on a phone, the same class of problem PhilosophySection had before its own mobile rebuild earlier in this pass.

## Human directions

- "ok great." (confirming the Philosophy corner-rounding fix was resolved)
- "now for the let's connect section on mobile; it is currently built horizontal but for mobile it should be rebuilt vertically"
- Asked via `AskUserQuestion` whether a mobile reference existed (as it had for the hero collage and Philosophy section) — answer: "No reference, use your judgment."

## Records of resistance / things I got wrong and had to correct

- Nothing to correct this pass — applied lessons directly from the Philosophy corner-rounding saga (see below) rather than repeating the same mistake on a new component.

## Successes

- Diagnosed that the underlying *motion* (photos rising from below, arriving staggered, continuing to rise and exit above) was already vertical-only (`translateY`, no horizontal drift, per the desktop component's own existing comment) — what actually needed fixing was the *spatial layout* (6 photos scattered across a full 1512-wide landscape frame), not the motion direction. This is a materially different diagnosis than Philosophy's "images need to spread differently," and shaped a more surgical fix.
- Applied the Philosophy corner-rounding lesson *proactively* rather than rediscovering it: built `ConnectMobilePhoto.tsx` from the start using percentage-based `top` animation (`useTransform` producing `%` strings) instead of a `y` transform — the exact "`overflow-hidden rounded-[10px]` + transform on the same element" pattern that took 4 rounds of real-device failures to fix on Philosophy. `ConnectPhoto.tsx` (desktop) still uses the transform-based version and was **not** touched, matching the standing "don't change desktop" instruction — but the mobile rebuild didn't inherit its latent bug.
- Split the 6 desktop photos into 2 mobile columns of 3 by their *existing* desktop `x` position (`x < 756`, half of 1512, vs. `x >= 756`) rather than reassigning them by hand — a clean, coincidental 3/3 split that preserves which photo reads as "left-side" vs. "right-side" from the original design instead of arbitrary reshuffling.
- Noticed and fixed a real cross-component coupling risk before it caused a bug: `ExperiencesSection.tsx` (the next section) pulls itself up by an amount computed from `getConnectExitTiming()`, which hardcoded desktop's `FIGMA_WIDTH`/`HEIGHT` to compute Connect's sticky-child height. Since `ExperiencesSection` calls this with the live viewport size with no breakpoint awareness of its own, left as-is it would have sized the pull-up effect against desktop's geometry even when Connect's *mobile* branch (with completely different frame proportions) was the one actually rendered. Made `getConnectExitTiming` branch on the same `1024px` breakpoint Tailwind's `lg:` uses, so the two components' geometry stays in sync at both breakpoints.
- Verified the full cross-section handoff on mobile, not just the section in isolation: scrolled well past the pin release into `ExperiencesSection`'s content and confirmed the white background sweeps up over the still-pinned dark heading correctly, with no leftover Connect content bleeding through and no overflow — the same effect desktop already has, now working on mobile too.

## State at this checkpoint

- **Modified `src/components/connect/connect-data.ts`**: added `MOBILE_FIGMA_WIDTH/HEIGHT` (360x600, portrait), `MOBILE_CONNECT_PHOTOS` (6 photos in 2 columns of 3, aspect ratios preserved from each photo's desktop dimensions), `MOBILE_ENTRY_BEFORE/AFTER`, `MOBILE_HEADING_FONT_SIZE_VW`, `MOBILE_PIN_SCROLL_DISTANCE` (700, vs. desktop's 1200); made `getConnectExitTiming` breakpoint-aware (branches at 1024px, matching Tailwind's `lg`).
- **New `src/components/connect/ConnectMobilePhoto.tsx`**: same 3-point rise/arrive/exit motion as `ConnectPhoto.tsx`, but animates `top` as a percentage string instead of a `y` transform — no `transform` anywhere in this component.
- **New `src/components/connect/ConnectMobileSection.tsx`**: mirrors `ConnectSection.tsx`'s pin/wrapper-height/heading-centering structure closely, pointed at the mobile constants and photo component.
- **Modified `src/components/connect/ConnectSection.tsx`**: renders `<ConnectMobileSection />` as a sibling; wraps the existing (unchanged) desktop pin composition in `hidden lg:block`. No changes to any desktop-only logic, or to `ConnectPhoto.tsx`.
- Verified: `npx tsc --noEmit` clean; zero horizontal overflow at both 390px and 1512px; screenshots across the mobile pin range show photos rising in 2 staggered columns with correctly-rounded corners and the heading readable in front of/behind them appropriately; desktop screenshot mid-scroll confirmed pixel-identical to the pre-existing design; full mobile handoff into `ExperiencesSection` confirmed working (white background sweeps over the pinned heading, no bleed-through); `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## Remaining mobile work

None identified yet. Other mobile-only issues elsewhere on the site have not yet been flagged.
