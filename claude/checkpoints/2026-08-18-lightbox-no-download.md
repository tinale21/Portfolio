# Checkpoint — Lightbox: block obvious download paths

## Context

Same-day follow-up to the desktop lightbox feature (`2026-08-17-desktop-lightbox-feature.md`).

## Human directions

- "for the expanded view on desktop, can you make it so people can't download"

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — flagged directly in the code comment rather than letting it look like a stronger guarantee than it is: this blocks the two obvious download paths (right-click "Save As", the browser's native video download button) but isn't airtight — anyone using dev tools can still get the file. Worth knowing since "can't download" could otherwise read as a stronger promise than what client-side HTML attributes can actually deliver.

## Successes

- Images: `draggable={false}` (blocks drag-to-desktop-to-save) + `onContextMenu={(e) => e.preventDefault()}` (blocks right-click → "Save Image As").
- Videos: `controlsList="nodownload"` (hides the download icon Chrome/Edge show in native `<video controls>` by default) + the same `onContextMenu` prevention (blocks right-click → "Save Video As").
- Hit the same dev-mode-only StrictMode flakiness as the original lightbox build (`.cursor-zoom-in` elements intermittently not gaining their click handler in `next dev`) — recognized it immediately from the prior checkpoint instead of re-diagnosing, and went straight to testing against a production build.
- Verified via Puppeteer against the production build: image has `draggable: false`, and a dispatched `contextmenu` event reports `defaultPrevented` (event listener fires and calls `preventDefault()`); video has `controlslist="nodownload"` as a real DOM attribute, and its own `contextmenu` event is likewise prevented.
- Full horizontal-overflow sweep across all four case studies still comes back at 0px (this change touches only element attributes, no layout).
- `npx tsc --noEmit` and `npx eslint` clean; both the plain production build and the `NEXT_PUBLIC_BASE_PATH=/Portfolio` GitHub Pages build succeed.

## State at this checkpoint

- **Modified** `src/components/case-studies/Lightbox.tsx`: added `draggable`/`onContextMenu` to the modal's `<Image>`, and `controlsList`/`onContextMenu` to the modal's `<video>`. Nothing else changed — the small thumbnail triggers (outside the modal) are untouched, since the request was specifically about "the expanded view."

## Remaining work

- None currently flagged.
