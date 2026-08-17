# Checkpoint — Exploration & Iterations: fixed mobile order, no tilt on mobile

## Context

Same-day follow-up to the Exploration & Iterations mobile bar fixes (`2026-08-17-case-study-exploration-mobile-overflow.md`, `2026-08-17-exploration-iterations-bar-vertical.md`). Two more mobile-only refinements to the same section across AIG, Wayve, and Framer Redesign.

## Human directions

- "for mobile only on the exploration & iterations, sinces it vertical, can you make it appear for all steps the number first (e.g. 01), then the image, than the title and description. also can you make the image not tilt on mobile"

## Records of resistance / things I got wrong and had to correct

- Nothing to correct from the user this pass, but one implementation pitfall caught before it shipped: my first instinct for "no tilt on mobile" was a plain `useState` + `matchMedia` boolean feeding directly into `useTransform(scrollYProgress, [0, 0.3], [0, isDesktop ? deg : 0])`. `useTransform`'s array-form input/output ranges are captured once and aren't guaranteed to pick up a changed target value on a later re-render (a known framer-motion gotcha, not something I'd hit before in this codebase). Switched to the more robust pattern: two independently-reactive motion values (the scroll-driven tilt angle, and a `matchMedia`-driven 0/1 scale factor) combined via the multi-input `useTransform([a, b], ([av, bv]) => ...)` overload, which framer-motion properly re-derives whenever either source motion value changes.

## Successes

- **Order fix**: previously mobile order was governed by `imageFirst` (the same flag that decides left/right column placement on desktop) via a ternary swapping which block rendered first — so on mobile, steps with `imageFirst: false` showed title/description *before* the image. Per direct feedback, mobile should always be number → image → text, regardless of `imageFirst`. Fixed by keeping a single DOM order (image, divider, text) always, and using Tailwind `order-*` utilities to reposition per breakpoint: `order-1`/`order-3` (mobile-always) on the image/text blocks, overridden by `lg:order-1`/`lg:order-3` based on `imageFirst` to reproduce the exact original desktop alternation. Divider is `order-2` unconditionally (always the visual middle).
- **Tilt fix**: the image's `rotate` scroll-in tilt (0deg → ±5deg) previously applied identically at every breakpoint. Per direct feedback, disabled it below `lg` — kept the desktop tilt calculation exactly as before, multiplied by a new `desktopTiltScale` motion value (0 on mobile, 1 on desktop) driven by `window.matchMedia("(min-width: 1024px)")`, the same query and listener pattern already established in `HeroSection.tsx` for its own viewport-dependent motion — reused rather than inventing a new convention.
- Verified per-file via Puppeteer at a step with `imageFirst: false` (AIG step 02 "Mid-fi", Wayve step 02 "Concept Exploration", Framer step 02 "Mid-fi Iteration") — mobile screenshots confirm number → image (untilted) → vertical bar → title/description in every case; desktop screenshots confirm the original text-left/image-right alternation and tilt are both byte-for-byte unchanged.
- Full horizontal-overflow sweep across all four case studies (including Emora, untouched by this section) still comes back at 0px after the change.
- `npx tsc --noEmit` and `npx eslint` clean; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds for all 8 static routes.

## State at this checkpoint

- **Modified** `AigExplorationIterations.tsx`, `WayveExplorationIterations.tsx`, `FramerRedesignExplorationIterations.tsx`: added `DESKTOP_QUERY = "(min-width: 1024px)"` constant, a `desktopTiltScale` motion value + `matchMedia` effect, `order-*` classes on the image/text blocks and divider, and removed the `imageFirst ? a : b` DOM-order ternary in favor of always rendering image → divider → text with CSS `order` handling the per-breakpoint visual position.

## Remaining mobile work

- None currently flagged.
