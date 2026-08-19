# Checkpoint — Lenis smooth scroll: desktop-only

## Context

Same-day follow-up to `2026-08-19-lenis-smooth-scroll.md`. Mobile felt laggy with Lenis active, even though touch input was already left unsmoothed (`syncTouch: false`).

## Human directions

- "can you remove the limus scroll on mobile but keep it for desktop. the mobile is a bit laggy" ("limus" — Lenis)

## Records of resistance / things I got wrong and had to correct

- One test gave a false negative before I dug into why: verifying the mobile nav's scroll-to-top fallback against the static-exported `out/` directory served via a plain local file server (`.html` URLs, e.g. `/work.html`) showed the scroll *not* resetting to top. Rather than assume that was a real regression, compared it against the same test run through `next dev` (clean `/work` URL, matching how this was originally verified in the nav checkpoint) — that passed correctly, confirming the first result was an artifact of the local test harness's URL structure (`usePathname()`-based active-link matching doesn't resolve the same way against a raw `.html` file path as it does against the clean routes the real GitHub Pages deployment actually serves), not a bug in the site itself.

## Successes

- Root cause of the mobile lag: Lenis's own `setScroll()` re-applies the scroll position via `wrapper.scrollTo({..., behavior: 'instant'})` on every animation frame regardless of input device — `syncTouch: false` only turns off the *smoothing* for touch gestures, it doesn't stop Lenis from running at all. Mobile was paying that per-frame overhead for a feature that wasn't even doing anything for touch users.
- Rather than just calling `lenis.stop()` on mobile (which would still leave the instance constructed, listening, and doing *some* work), moved the conditional to whether `<ReactLenis>` mounts *at all* — a new client component (`SmoothScroll.tsx`) checks the same `matchMedia("(min-width: 1024px)")` breakpoint already used everywhere else in this codebase, and simply renders `children` directly (no Lenis instance, no listeners, no RAF loop) below `lg`. Mobile now gets completely untouched native scroll.
- This composed cleanly with the two integration points from the original Lenis pass without needing to touch either of their files: NavBar's scroll-to-top already had a `lenis ?? window.scrollTo(...)` fallback (added for the brief pre-mount window on desktop) — that same fallback now naturally handles the *entire* mobile experience too, since `useLenis()` returns `undefined` whenever there's no Lenis provider ancestor, which is permanently true on mobile now. Lightbox's `lenis?.stop()`/`start()` calls are also unaffected (optional-chained no-ops on mobile) and moot anyway since Lightbox itself is already desktop-only.
- Verified via Puppeteer against a production build: `document.documentElement.classList.contains("lenis")` is `true` on a 1512px viewport and `false` on a 390px one; a simulated wheel scroll on desktop produces the same decelerating sample sequence confirmed in the original Lenis checkpoint, while the identical scroll on mobile jumps to its full target in a single frame (all 8 samples identical) — genuinely native, not just visually similar. Confirmed the mobile nav's scroll-to-top still resets `scrollY` to `0` (via its native fallback) once retested against the correct clean-URL environment.
- Full horizontal-overflow sweep across all seven pages (home, about, work, four case studies) comes back at 0px.
- `npx tsc --noEmit` and `npx eslint` clean; the `NEXT_PUBLIC_BASE_PATH=/Portfolio` GitHub Pages build succeeds.

## State at this checkpoint

- **Added** `src/components/SmoothScroll.tsx`: a client component wrapping `<ReactLenis root>` behind the same desktop `matchMedia` check used throughout this codebase; renders `children` unwrapped on mobile.
- **Modified** `src/app/layout.tsx`: replaced the direct `<ReactLenis root options={{...}}>` usage with `<SmoothScroll>`, moving the Lenis options object into the new component. Comment trimmed to remove detail that's now more accurately described in `SmoothScroll.tsx` itself.

## Remaining work

- None currently flagged.
