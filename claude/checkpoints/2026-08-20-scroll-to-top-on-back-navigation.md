# Checkpoint — Reset scroll to top on browser back/forward navigation

## Context

User reported the site "doing something odd" via a screen recording (`Screen Recording 2026-08-20 at 3.17.15 AM.mov`, shot against the live production site, www.tinanle.com): navigating page to page, then using the browser's back button, the destination page doesn't start at the top.

## Human directions

- "the site is doing something odd where when you are going from page to page, if i go back to page, it doesn't start at the top: [screen recording]"

## Records of resistance / things I got wrong and had to correct

- Couldn't read the `.mov` directly (binary) and no `ffmpeg`/`ffprobe` on this machine — used `qlmanage -t` to pull a single QuickLook thumbnail frame instead of giving up on the recording entirely. That one frame only confirmed the user was testing on the live site and interacting with the nav, not enough on its own to diagnose the mechanism — so rather than guess further from a single frame, reproduced the exact interaction directly against the codebase instead (real wheel-scroll events + `page.goBack()` in Puppeteer) and let that be the source of truth.
- First reproduction attempt used `page.evaluate(() => window.scrollTo(0, 800))` to simulate the user having scrolled — this silently no-op'd (scrollY stayed 0). Root cause: Lenis (desktop) maintains its own internal scroll target and re-syncs the native scroll position to it every animation frame, so a raw `scrollTo` call that doesn't go through Lenis's own API gets immediately fought back to Lenis's last (unchanged) target on the next frame. Same class of issue as the site-wide Lenis integration checkpoint from earlier this session. Fixed by dispatching real `page.mouse.wheel()` events instead, which Lenis actually listens to.
- Second reproduction attempt hit a false negative: serving the static-exported `out/` directory via a plain `python3 -m http.server` and requesting `/work` returned a raw directory listing (`aig/`, `emora/`, etc. as literal link text) instead of the actual page, because `/work` is both a route and a directory name in the export output, and a plain file server doesn't do GitHub Pages' clean-URL resolution. This exact caveat was already flagged in an earlier checkpoint this session (`2026-08-19-lenis-desktop-only.md`) — re-ran the reproduction against `next dev`'s real clean routing instead, which resolved the ambiguity and gave a trustworthy result.

## Successes

- Confirmed the actual mechanism via direct reproduction rather than assumption: Next's `<Link>` already scrolls to the top of the destination page on a normal forward click (confirmed `scrollY: 0` on arrival) — that's Next's own built-in behavior, nothing in this codebase implements it. Browser back/forward is a separate code path: Next's App Router keeps its own per-history-entry scroll cache for it (independent of the `history.scrollRestoration = "manual"` override already in `layout.tsx`, which only affects full-page reloads) and restores the exact prior scroll position instead of resetting to top — reproduced exactly: scrolled `/work` to `807px`, navigated to a case study, scrolled there too, hit back, landed back on `/work` at `807px`, not `0`.
- Fixed with a single, narrowly-scoped client component (`ScrollToTopOnNavigate.tsx`) rather than fighting Next's internal router state directly — it watches `usePathname()` and resets scroll on every change, which is a no-op duplicate on the forward-click case `<Link>` already handles correctly, and is the actual fix for the back/forward case. Routed through Lenis's `scrollTo(0, { immediate: true })` when mounted (desktop), same reasoning as `NavBar.tsx`'s existing `scrollToTop` helper (a raw `window.scrollTo` fights Lenis's per-frame resync) — but `immediate: true` here, not animated, since this is a navigation-position reset, not a user-triggered "scroll to top" action; it shouldn't visibly replay a scroll animation on every page load.
- Verified via Puppeteer against `next dev` with real wheel-scroll events: multi-hop back/forward (home → work → about → back → back → forward) all land at `scrollY: 0`; confirmed on both desktop (Lenis path) and mobile (native `window.scrollTo` path, no Lenis mounted). Regression-checked NavBar's existing same-page-nav-link scroll-to-top still works (settles at `0` given enough time for its own animated scroll — a `22px`-off reading in one hastier test run was just the animation still in flight, not a regression, confirmed by re-running with a longer wait).
- Full overflow sweep across all seven pages, both breakpoints, still 0px. `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error already flagged in every checkpoint this session.

## State at this checkpoint

- **Added** `src/components/ScrollToTopOnNavigate.tsx`: client component, no rendered output, resets scroll to `0` on every `usePathname()` change (skips the very first mount to avoid interfering with the initial page load's own scroll position).
- **Modified** `src/app/layout.tsx`: mounted `<ScrollToTopOnNavigate />` inside `<SmoothScroll>` (alongside `NavBar`), so it can read Lenis's context on desktop.

## Remaining work

- None currently flagged.
