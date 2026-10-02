# Checkpoint — Scaled side-by-side About entries on mobile

## Human directions

- "can you do the same for the foodie, wanderer, potterhead, and animal friend on mobile, where the text and image isn't listed one by one but just scaled down. don't change anything for the desktop"

## Approach / resistance

- Mirrored the Secondary Research mobile fix: render the SAME side-by-side composition as desktop at a fixed design size and `transform: scale()` it down to the available width, instead of the previous stacked (name / photo / tagline vertical) mobile layout.
- Switched at `lg` (1024px) to keep "desktop" literally unchanged: the existing responsive row is now `hidden lg:flex` (byte-for-byte unchanged at lg+ — still stacks at lg–xl, side-by-side at xl+), and a new `lg:hidden` path renders the scaled composition for < lg.
- Two gotchas handled:
  - The desktop composition uses `clamp(..., vw, ...)` font sizes and `xl:` translate micro-offsets. `vw` resolves against the tiny mobile viewport (not the design stage), so reusing them would produce wrong sizes once scaled. The mobile composition therefore uses fixed px sizes = the clamp() maxes (trait 3.25rem, tagline 1.5rem, caption 0.95rem) and drops the desktop-only translate offsets, so it scales predictably.
  - A CSS transform doesn't shrink layout size, so the MOBILE_DESIGN_W (1046px) stage would force page horizontal scroll. The scaled stage is `position: absolute` inside an `overflow-hidden` box (height = design height × scale); scale is measured via `ResizeObserver` (= box width ÷ 1046).
- MOBILE_DESIGN_W 1046 = two 300px text columns + 318px photo + two 64px gaps; MOBILE_DESIGN_H 480 (photo, the tallest element, is 471). Composition is `items-center justify-center`, so nothing clips.

## State at this checkpoint

- **Modified** `src/components/about/AboutEntry.tsx`: added `MOBILE_DESIGN_W/H` constants, a `mobileRef` + `mobileScale` ResizeObserver, a `lg:hidden` scaled side-by-side composition, and made the existing row `hidden lg:flex`. Pin-hold + photo parallax (`y`) unchanged and shared by both paths.

## Verification

- Mobile (390): shows the scaled side-by-side composition (trait | photo | tagline), not the one-by-one stack.
- Desktop (1512): unchanged (verified against the prior screenshot). lg-range (1100): still stacks, unchanged.
- Overflow 0px at 390/1100/1512; `tsc`/`eslint`/`build` clean.

## Follow-up — make the mobile images bigger

- "it not scale exactly right on mobile, make the images a little bigger for mobile" → enlarged the mobile photo box (318x471 → 400x592, same 0.675 ratio) and tightened the composition gap (gap-16 → gap-8), so the photo takes a bigger share of the design width and renders ~20%+ larger once scaled. `MOBILE_DESIGN_W` 1046 → 1064, `MOBILE_DESIGN_H` 480 → 600. Text columns kept at 300 (symmetric; "Potterhead", the longest single-line trait, still fits without wrapping — verified). Desktop untouched. Verified Foodie + Potterhead on mobile (bigger photo, no clipping), 0px overflow, `tsc`/`eslint`/`build` clean.

## Remaining work

- Minor quirk at the 1024–1279 (iPad-landscape / small-laptop) range: it keeps the existing STACKED layout, so resizing goes scaled-side-by-side (<1024) → stacked (1024–1279) → side-by-side (1280+). Kept this to honor "don't change desktop" (everything ≥1024 is untouched). If a consistent scaled look up to 1280 is preferred, switch the breakpoint from `lg` to `xl` — easy follow-up.
