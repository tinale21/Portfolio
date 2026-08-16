# Checkpoint — Philosophy quote section: vertical mobile layout

## Context

Continuing the mobile-issues pass: the home page's "Design is not just what we make, but how thoughtfully we make it." section (PhilosophySection) was using desktop's landscape Figma frame (1512x982) directly, which scales proportionally with viewport width — on mobile this squashed the whole 8-image composition into a short, cramped horizontal strip.

## Human directions

- "ok now for the "design is not just what we make, but how throughtfuly we make it." section on mobile, it looks like it stuck horizontally but you should adjust it to be vertical for mobile. this is what the reference looks like on mobile: [motion recording, blakemitchelldsgn.com]"

## Records of resistance / things I got wrong and had to correct

- Nothing shipped incorrectly, but did initially over-plan a literal "rebuild the pin-and-spread mechanism in a portrait orientation" approach before catching that it doesn't work: desktop's `position: sticky` pin only functions because the sticky box is *shorter* than the viewport it's pinned against. A portrait composition tall enough to comfortably fit 8 images stacked vertically would exceed a typical mobile viewport height, and a sticky element taller than its viewport can only ever show its top slice while pinned — the rest never becomes visible in a controlled way. Caught this via the math (not by building it first and finding it broken), and switched to a different, standard mobile pattern instead (see Successes).
- Also caught, before shipping, that an unrelated cartoon-house image showing up mid-screenshot during verification looked at first like a bug — checked the actual source PNG assets directly instead of assuming, and confirmed it's legitimate existing content (rect-25.png, already used on desktop too), not something introduced by this change.

## Successes

- Watched the reference recording frame-by-frame rather than skimming it, and correctly identified its actual mechanism: images peeking in from the screen edges with plain vertical-flow text between them (not a pinned spread-apart animation) — used that as the basis for the mobile redesign instead of forcing desktop's mechanism into an orientation it can't support.
- Reused the same 8 source images and their existing `PHILOSOPHY_IMAGES` pairing structure (indices 0-1, 2-3, 4-5, 6-7 — already documented as 4 spatial pairs in `philosophy-data.ts`'s own comment) rather than inventing new mobile-specific image data — each pair rendered as a self-contained "large photo + smaller overlapping photo" block (same visual relationship desktop already has per-pair), alternating which corner the smaller photo overlaps for rhythm.
- Used `framer-motion`'s `whileInView` for a simple fade/slide-up reveal per pair and the quote — a standard, reliable mobile scroll-reveal pattern, instead of trying to adapt the complex progress-driven cluster-spread math powering desktop.
- Quote's forced 2-line break (`QUOTE_LINES`, tuned for desktop's 570px-wide box) is joined with a space instead on mobile, letting it wrap naturally at the much narrower width rather than forcing a break tuned for a different box size.
- Verified the desktop composition is completely untouched: screenshots at both a mid-scroll (partially spread) and fully-settled scroll position match the pre-existing design exactly — same pin-and-spread mechanism, same final image positions, same quote fade.

## State at this checkpoint

- **New `src/components/philosophy/PhilosophyMobileSection.tsx`**: renders the 4 `PHILOSOPHY_IMAGES` pairs as stacked "large + overlapping small" blocks with the quote in the middle, each revealing via `whileInView` fade/slide-up; `lg:hidden`.
- **Modified `src/components/philosophy/PhilosophySection.tsx`**: wraps the existing (unchanged) desktop pin-and-spread composition in `hidden lg:block`; renders `<PhilosophyMobileSection />` as a preceding sibling. No changes to any of the desktop-only logic (`progress`, `pxScale`, `clusterCenterY`, `PIN_SCROLL_DISTANCE`, etc.) or to `PhilosophyImage.tsx`.
- Verified: `npx tsc --noEmit` clean; zero horizontal overflow at 390px; scroll-captured screenshots confirm all 4 pairs + quote render correctly and in the right order on mobile; desktop screenshots at two different scroll positions (mid-spread and fully-settled) confirm pixel-identical behavior to before; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## Follow-up: add the actual stack-to-spread motion

- "the intended card stack motion isn't there; there is no motion at all... it should start stacked one behind another and then move out when users scroll down on mobile" — the first pass's `whileInView` fade/slide-up wasn't the effect being asked for.
- Re-watched the reference at denser frame intervals (every 0.5s instead of every 1s) and this time caught the actual mechanism: a card visibly duplicates/fans out progressively as you scroll, tracking scroll position continuously — not a fixed-duration reveal-on-enter.
- Rebuilt each pair's motion using `framer-motion`'s `useScroll({ target: pairRef })` for a *local* scroll progress specific to that pair, then mapped that progress to the small photo's transform: starts pulled in toward the large photo's center (stacked behind it, scaled to 0.8) at progress 0, animates to its resting "peeking corner" position (the existing static CSS offset, scale 1) at progress 1. The large photo gets a much subtler scale/opacity settle so the whole pair reads as "unpacking," not just the small photo moving alone.
- Caught and fixed a real bug in the first attempt at this, via direct numeric measurement rather than assuming it was fine: the initial scroll offset range (`["start 0.9", "start 0.4"]`) front-loaded most of the transition into the ~84px sliver right as the pair started entering the viewport — by the time enough of the pair was actually visible to perceive the change, it already read as mostly or fully spread, so the "stacked" state was essentially never seen. Confirmed this by sampling `getComputedStyle(...).transform` at 50px scroll increments and cross-referencing against the element's `getBoundingClientRect().top` at each point.
- Fixed by switching to `["start end", "start center"]` — progress 0 exactly when the pair's top edge first touches the viewport's bottom edge, progress 1 once that edge reaches the viewport's vertical center. Re-verified numerically: the transform now progresses smoothly from scale 0.8 to 1.0 while the element's own `top` moves from ~970px (barely visible) to ~355px (settled in the upper-middle) — a genuinely visible transition, confirmed via a mid-scroll screenshot showing the small photo clearly smaller/more centered than its resting position.
- Verified: `npx tsc --noEmit` clean; zero horizontal overflow; desktop screenshot at the fully-settled scroll position still pixel-identical to the pre-existing design; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## Remaining mobile work

None identified yet beyond what's already been addressed in this mobile-issues pass (hero collage, Selected Projects autoplay, this section). Other mobile-only issues elsewhere on the site have not yet been identified.
