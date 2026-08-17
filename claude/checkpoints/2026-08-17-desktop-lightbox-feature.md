# Checkpoint — Desktop-only lightbox: click photos/videos to view full-size

## Context

New feature request, not a mobile-issues-pass fix: a desktop-only "click to view full" interaction for media across every case study, modeled on a reference recording of another portfolio's own lightbox.

## Human directions

- "ok now for desktop, i want to make it where users can click on video or photo to view it in full. it would work similar to this reference video: [Screen Recording 2026-08-17 at 12.30.36 PM.mov]. This would apply to all the case studies project overview pictures/videos, the exploration & iterations photos, all final design videos, and aig's visual directions videos"

## Records of resistance / things I got wrong and had to correct

- Watched the reference recording (frame-extracted via `cv2`) to confirm the exact interaction before building anything: dimmed backdrop, media centered and scaled up (not replicating the thumbnail's own tilt/border), close button top-right, click-backdrop-to-close. Simplified one thing deliberately rather than trying to match exactly: the reference's enlarged image kept the small thumbnail's own polaroid tilt; this site's thumbnails have wildly different per-instance styling (rotation, borders, aspect ratios) across 12 different call sites, so the lightbox always presents media the same clean way (centered, `object-contain`, no inherited rotation) rather than trying to parameterize every source treatment — a deliberate simplification, flagged here in case that reads as a miss rather than a choice.
- Hit a real scare mid-implementation: after wiring up all 12 call sites, `dev`-mode testing showed the `cursor-zoom-in` class and click behavior working on only ~8 of 12 elements, seemingly at random. Spent real effort chasing this as a genuine bug (added temporary debug logging, confirmed via console output that React *was* re-rendering every instance with the correct state) before testing against an actual **production build** instead of `next dev` — the production build showed all 12/12 working correctly on the first try. Root cause: React StrictMode's double-effect-invocation in dev mode, interacting unpredictably with 12 simultaneous `matchMedia` listeners mounting at once — a dev-mode-only artifact, not a real bug. Lesson: when something intermittently fails only in `next dev` with many concurrent client components mounting at once, test against a production build before concluding there's a logic bug — StrictMode's double-invoke behavior can produce exactly this kind of flaky-looking symptom.

## Successes

- Built one shared component (`src/components/case-studies/Lightbox.tsx`) rather than one-off implementations per call site, following this codebase's existing convention of shared case-study components living directly in `case-studies/` (matching `TryTheseProjects.tsx`).
- Chose `cloneElement` over wrapping children in a new `<div>`, specifically because many of the 12 target elements rely on being a *direct* flex child (`ml-auto`, `flex-1`, `max-w-[597px]` for right-alignment; `next/image`'s `fill` prop requiring its direct parent to establish size) — introducing a wrapper div would have silently broken that positioning at every site that isn't a simple block layout. `cloneElement` adds zero new DOM nodes, so the existing element keeps its exact position in the tree and just gains an `onClick` + `cursor-zoom-in` class. Verified this held after the fact: measured a Visual Directions video's `ml-auto`-driven right alignment (597px wide, exactly 68px from the section's right edge, matching the page's standard `lg:px-[68px]`) and an Exploration & Iterations text/image alternation (`imageFirst: false` still renders text-left/image-right on desktop) — both pixel-identical to pre-Lightbox behavior.
- Desktop-only via the same `matchMedia("(min-width: 1024px)")` pattern already established multiple times this session (Framer bezel/tilt fixes, TryTheseProjects marquee sizing) — no new convention introduced. Confirmed on mobile: zero elements get the `cursor-zoom-in` class, and clicking a thumbnail does nothing extra (no modal, no state change).
- Modal supports three ways to close (X button, backdrop click, Escape key) — all three verified working via Puppeteer against the production build. Body scroll is locked (`overflow: hidden`) while open and restored on close.
- Video lightboxes get native `controls` added (the small background-loop thumbnails don't have them) so users can actually pause/scrub/unmute once they've chosen to view the full video — the underlying thumbnail keeps its original `autoPlay muted loop playsInline` behavior unaffected.
- Scoped precisely to what was named — 12 call sites across Project Overview (4), Exploration & Iterations (3 — Emora has no such section), Final Design videos (4, including Framer's uniquely-styled prototype video frame plus its 5 per-screen videos), and AIG's Visual Directions (3). Framer's Before & After Overview slider was deliberately *not* wrapped — it already has its own drag-to-compare pointer interaction, and the user's list didn't include it.
- Verified via Puppeteer against the actual production build (not dev mode, given the StrictMode scare above): exact expected zoom-enabled element count per case study (AIG 12, Wayve 8, Emora 4, Framer 10); click → open → correct media renders; all three close methods work; mobile is fully inert; full horizontal-overflow sweep at both mobile and desktop widths across all four case studies comes back at 0px.
- `npx tsc --noEmit` and `npx eslint` clean; both the plain production build and the `NEXT_PUBLIC_BASE_PATH=/Portfolio` GitHub Pages build succeed.

## State at this checkpoint

- **New** `src/components/case-studies/Lightbox.tsx`: the shared component described above.
- **Modified** (import + wrap only, no structural changes otherwise): `AigProjectOverview.tsx`, `WayveProjectOverview.tsx`, `EmoraProjectOverview.tsx`, `FramerRedesignProjectOverview.tsx`, `AigExplorationIterations.tsx`, `WayveExplorationIterations.tsx`, `FramerRedesignExplorationIterations.tsx`, `AigFinalDesignImplementation.tsx`, `WayveFinalDesignImplementation.tsx`, `EmoraFinalDesignImplementation.tsx`, `FramerRedesignFinalDesign.tsx` (two wraps — prototype video + per-screen videos), `AigVisualDirections.tsx`.

## Remaining work

- None currently flagged. If the "always upright, never inherits thumbnail styling" simplification (see Records of resistance) isn't what was wanted, that's a one-file change (`Lightbox.tsx`'s modal `<Image>`/`<video>` className) rather than a per-call-site one.
