# Checkpoint — Site-wide inertial scroll via Lenis

## Context

New feature request, site-wide (not scoped to any one page or case study). This is the first change this session that touches the root layout and the core scroll mechanism every other scroll-linked animation in the codebase depends on.

## Human directions

- "Add smooth inertial scrolling to the site using Lenis. I want the scrolling to feel slightly delayed and fluid, like a high-end design portfolio, but not overly slow or floaty. Keep the scrolling responsive and natural."

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — but this was the highest-integration-risk change of the session, so the investigation before writing any code mattered more than usual. Before touching anything, surveyed every scroll-dependent file in the codebase (9 files: NavBar, AboutEntry, the three ExplorationIterations files, both PhilosophySection variants, HeroSection, both ConnectSection variants) and read Lenis's own source (not just its docs) to confirm two load-bearing assumptions before committing to the approach:
  1. That `<ReactLenis root>` renders zero extra DOM (confirmed by reading `lenis-react.mjs` directly: `root && root !== 'asChild' ? children : <div>...</div>` — root mode returns `children` untouched). This mattered because `<body>` relies on `flex flex-col` for its sticky-footer layout; an extra wrapper div would have silently broken that.
  2. That Lenis's default "root" mode actually drives the *real* native scroll position every frame (`wrapper.scrollTo({top: scroll, behavior: 'instant'})`, confirmed in `lenis.mjs`'s `setScroll()`), not a CSS-transform fake. This is what let every existing `window.scrollY` read and Framer Motion `useScroll()` call keep working with zero code changes elsewhere.
  Skipping this and just wiring up `<ReactLenis root>` on faith would have risked either a broken footer or nine files worth of silently-broken scroll animations discovered one at a time.
- Also caught a real (if narrow) integration bug before it shipped, not after: Lenis's own auto-stop-on-`overflow:hidden` watches `document.documentElement` (confirmed via its `rootElement` getter), but the Lightbox component (built earlier this session) locks scroll via `document.body.style.overflow`, not `documentElement`. Without an explicit fix, Lenis would have kept hijacking wheel/touch input and smoothly scrolling the page *behind* an open lightbox modal — invisible during the interaction but very present once the modal closed (the page would visibly "jump" to wherever Lenis's uninterrupted background scroll had ended up). Fixed by calling `lenis.stop()`/`lenis.start()` explicitly in the Lightbox's existing open/close effect, alongside the pre-existing overflow toggle rather than replacing it.

## Successes

- Went with lerp-based smoothing (`lerp: 0.1`, no explicit `duration`/`easing`) rather than a fixed-duration-per-gesture animation — duration-based easing is what tends to read as "floaty" for continuous wheel scrolling (each scroll commits to a fixed-length animation regardless of new input), while lerp continuously re-targets toward the latest input every frame, which is what "responsive and natural" was actually asking for. 0.1 is Lenis's own tuned default for exactly this feel, kept explicit in the options object (not omitted) so the intent is documented rather than silently inherited.
- Left `syncTouch: false` (the default) deliberately — touchscreens already have good native momentum scrolling, and layering Lenis's own smoothing on top of that reads as laggy rather than fluid. Lenis's smoothing is scoped to wheel/trackpad input, which is where "high-end portfolio" inertial scroll is actually expected.
- Kept `respectReducedMotion: true` (the default, also kept explicit) — users with `prefers-reduced-motion` set get instant, untouched scrolling; this wasn't asked for but is a reasonable accessibility default to preserve rather than silently drop.
- Routed `NavBar`'s scroll-to-top clicks (added just two checkpoints ago) through `lenis.scrollTo(0)` instead of leaving them on raw `window.scrollTo({behavior: 'smooth'})` — the two compete for control of the native scroll position (Lenis maintains its own internal target/animated scroll state and would fight a native smooth-scroll animation happening outside its own RAF loop), so this had to change together with the main Lenis install, not as an afterthought.
- Hit the same dev-mode-only React StrictMode flakiness with the Lightbox's `.cursor-zoom-in` triggers as in two earlier checkpoints this session — recognized it immediately from precedent instead of re-diagnosing, and went straight to testing against a production build.
- Verified via Puppeteer against the production build: `<html>` gains the `lenis` class on mount; a simulated wheel scroll produces a clearly decelerating `scrollY` sequence over ~900ms (495→756→1001→...→1494, easing into its target) rather than an instant jump; NavBar's scroll-to-top now animates the same way (739→405→201→...→0) instead of jumping or using native smooth-scroll; opening a Lightbox and attempting to wheel-scroll leaves `scrollY` at 0 the entire time (Lenis genuinely stopped, not just visually obscured behind the backdrop), and closing it restores normal scrolling immediately; a full scroll-through of the homepage (Hero → Philosophy → Connect, ~20 wheel events) produces zero console/page errors; a case study's Exploration & Iterations progress bar (a *per-element* `useScroll` target, not just window-level) still fills correctly through a scroll pass (0px → 148.9px → 229.4px, capping at its max) confirming per-element scroll tracking survived the change too.
- Full horizontal-overflow sweep across all seven pages (home, about, work, and all four case studies) at both mobile and desktop widths comes back at 0px.
- `npx tsc --noEmit` and `npx eslint` clean; both the plain production build and the `NEXT_PUBLIC_BASE_PATH=/Portfolio` GitHub Pages build succeed.

## State at this checkpoint

- **Added dependency**: `lenis` (1.3.26) via `npm install lenis`. `package-lock.json` picked up an unrelated pre-existing `nanoid` advisory from Tailwind/Next's own `postcss` chain while installing — confirmed via `npm ls nanoid` this was already present before the install, not introduced by it; left untouched (out of scope, would need an unrelated dependency bump to address).
- **Modified** `src/app/layout.tsx`: imports `ReactLenis` from `lenis/react` and the library's small base stylesheet (`lenis/dist/lenis.css`); wraps `<NavBar />{children}<Footer />` in `<ReactLenis root options={{ lerp: 0.1, smoothWheel: true, syncTouch: false, respectReducedMotion: true }}>`.
- **Modified** `src/components/NavBar.tsx`: the scroll-to-top helper (added in `2026-08-17-nav-click-scroll-to-top.md`) now calls `lenis.scrollTo(0)` via `useLenis()`, threaded through to both `NavLink` instances (desktop nav + mobile menu) and the logo's own click handler. Falls back to native `window.scrollTo` only in the split-second before the root Lenis instance mounts.
- **Modified** `src/components/case-studies/Lightbox.tsx`: added `lenis.stop()`/`lenis.start()` to the existing open/close effect, alongside (not replacing) the pre-existing `document.body.style.overflow` toggle.

## Remaining work

- None currently flagged. If the current feel ("slightly delayed and fluid... not overly slow or floaty") isn't quite right once tried live, the one number to adjust is `lerp` in `layout.tsx` — lower (e.g. 0.07-0.08) for more delay/smoothing, higher (e.g. 0.13-0.15) for snappier/more responsive.
