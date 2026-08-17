# Checkpoint — Lightbox: fixed fuzzy enlarged images

## Context

Same-day follow-up to the desktop lightbox feature (`2026-08-17-desktop-lightbox-feature.md`). Some images looked soft/fuzzy when viewed enlarged.

## Human directions

- "ok that's great. is there any way to restore image quality for some images like the ones in exploration & iterations. they appear a bit fuzzy in enlarge view"

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — investigated before touching code, since "restore image quality" implied a compression/optimization problem, but this site's `next.config.ts` sets `images: { unoptimized: true }` (required — GitHub Pages has no image-optimization server to call), meaning `next/image` was already serving the original source file byte-for-byte with zero recompression. There was no "quality" setting to turn up. The actual cause was pure CSS upscaling: the lightbox sized enlarged media to `85vw`/`85vh` regardless of the source file's own resolution, and Exploration & Iterations' source PNGs (1696x1024) are the lowest-resolution of any lightbox-wrapped image on the site — on a large/high-DPI screen, 85vh alone can exceed 1696px, stretching the image past its native pixel size.

## Successes

- Checked every lightbox-wrapped image's actual source resolution before diagnosing (`PIL`/`Pillow`, not guessed): Exploration & Iterations sources are 1696x1024 (AIG/Wayve/Framer, all identical), while Project Overview photos are 2388x1204 — over 40% higher resolution. This confirmed the user's specific example (Exploration & Iterations) wasn't arbitrary; it's genuinely the most exposed set of images to this bug.
- Fix reads the exact intrinsic pixel size directly off each image's own static-import metadata (`StaticImageData.width`/`.height`, available since these are all statically imported, not remote URLs) — no measurement or guessing needed. Caps the modal's `max-width`/`max-height` at `min(85vw, sourceWidthPx)` / `min(85vh, sourceHeightPx)`, so an image can still shrink to fit smaller viewports (unaffected on typical screens) but is never scaled up past 1:1 (fixes the actual bug) — one CSS change, no new dependencies, no per-image special-casing.
- Verified via Puppeteer against the production build at two viewport sizes: at 2560x1440 (where the old code would have stretched a 1696x1024 source past its native size), the enlarged image now renders at exactly 1696x1024 — capped, not upscaled, confirmed sharp via screenshot (wireframe text/lines crisp, no softness). At 1512x900 (a normal viewport, well under the native size), rendering is unaffected — same 1267x765 display size as before, confirming the fix only engages exactly when needed.
- Confirmed the fix doesn't affect the higher-res Project Overview photos at all — still fill the full 85vw (1285px) exactly as before, since their 2388px native cap is far larger and never binds.
- Scope: string-src media (all videos, plus Framer's video-based Project Overview) fall back to the original plain `85vw`/`85vh` behavior unchanged — `next/image` doesn't expose intrinsic dimensions for those ahead of load the same way static imports do, and the user's report was specifically about images, not videos.
- Full horizontal-overflow sweep across all four case studies at both mobile and desktop widths still comes back at 0px.
- `npx tsc --noEmit` and `npx eslint` clean; both the plain production build and the `NEXT_PUBLIC_BASE_PATH=/Portfolio` GitHub Pages build succeed.

## State at this checkpoint

- **Modified** `src/components/case-studies/Lightbox.tsx`: the modal's `<Image>` branch now caps `max-width`/`max-height` at the image's own intrinsic pixel size (via inline `style`, since the value is dynamic per image) instead of an unconditional `85vw`/`85vh` Tailwind class. The `<video>` branch is unchanged.

## Remaining work

- None currently flagged. If videos ever need the same treatment (a low-res source video looking soft enlarged), the fix would need to read `video.videoWidth`/`videoHeight` after metadata loads (not available synchronously like a static image import), a bit more involved than this pass.
