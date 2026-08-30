# Checkpoint — Logo marquee: always animate regardless of reduced-motion

## Context

User reported the "Trusted By" logo marquee appeared frozen for a friend viewing on Windows, while it worked fine for the user.

## Human directions

- "can you double check the logo scroll. it works for me but when my friend checked it out the logo scroll was frozen and not scrolling; my friend is viewing it on a window[s]"
- Asked how to handle it; chose "Always animate, ignore the OS setting" over keeping the accessible default or adding a static fallback.

## Records of resistance / things I got wrong and had to correct

- None — diagnosed before guessing. The marquee's `<div>` used Tailwind's `motion-safe:` variant, which only applies the animation class under `@media (prefers-reduced-motion: no-preference)`. Confirmed directly via `page.emulateMediaFeatures` rather than assuming: under `prefers-reduced-motion: reduce`, computed `animationName` was `none` (animation fully disabled, not just slowed) — an exact match for "frozen and not scrolling." Windows has an easily-toggled "Animation effects" accessibility setting that maps straight to this media query, plausibly explaining why one visitor saw it and the user didn't.
- This was working as designed (respecting an explicit accessibility preference is standard practice, not a bug) — flagged it as a real product decision rather than silently "fixing" it, since removing `motion-safe:` trades away that accessibility behavior. Asked the user directly; they chose to always animate.

## Successes

- Verified the fix the same way the bug was diagnosed: re-ran the same `prefers-reduced-motion: reduce` emulation after the change and confirmed `animationName` now stays `logo-marquee` in both states.
- Full overflow sweep (desktop + mobile) still 0px. `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error flagged in every checkpoint this session.

## State at this checkpoint

- **Modified** `src/components/logos/ClientLogosSection.tsx`: the marquee track's `motion-safe:animate-[logo-marquee_28s_linear_infinite]` class changed to unconditional `animate-[logo-marquee_28s_linear_infinite]`.

## Remaining work

- None currently flagged. Worth knowing for future decorative animations on this site: the same `motion-safe:` pattern may exist elsewhere and would have the identical "looks frozen" failure mode for reduced-motion visitors if one ever gets a similar report.
