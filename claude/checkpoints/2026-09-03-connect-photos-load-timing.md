# Checkpoint — Fix Connect section photos loading in late

## Context

The photos in the "Let's Connect!" section sometimes popped in visibly late during the scroll reveal instead of already being loaded when they animated into view.

## Human directions

- "sometimes the photos in the let's connect section don't load in on time"

## Records of resistance / things I got wrong and had to correct

- Diagnosed the actual root cause before changing anything rather than reaching straight for `priority`/`eager`. Two compounding problems: (1) `next.config.ts` sets `images.unoptimized: true` (required for the static GitHub Pages export — there's no image-optimization server), so `next/image` ships the **original source files as-is**; and (2) those source files were ~1000-1900px-wide PNGs weighing 0.65-2.9MB each (~12MB total) but displayed at only ~250px wide — so the browser was downloading 10-40x more bytes than needed. On top of that, `next/image`'s default `loading="lazy"` meant each multi-MB file only *started* downloading as its photo scrolled into view, and the scroll-reveal animation gives essentially no lead time — hence the late pop-in.
- Chose `loading="eager"` over `priority`: `priority` also injects `<link rel="preload">` + `fetchPriority="high"`, which for six mid-page decorative images would compete with above-the-fold LCP content. `eager` just removes the lazy gate so they begin downloading on page load (plenty of lead time before the user scrolls down), without the preload-priority cost — appropriate now that the files are small.
- Verified nothing else imported these photos (only `connect-data.ts`) before converting/deleting the PNGs, and confirmed PIL's WebP support was actually present before relying on it.
- Both the desktop (`ConnectPhoto`) and mobile (`ConnectMobilePhoto`) components render in the DOM simultaneously (responsive show/hide), so eager-loading both would seem to be 12 downloads — but they reference the same six URLs, so the browser fetches each file only once. Confirmed via the rendered DOM (12 `<img>` entries, 6 unique srcs).

## State at this checkpoint

- **Converted** `src/assets/connect/photo{1-6}.png` → `photo{1-6}.webp`: resized to 800px wide (retina-safe for the ~250-450px display width) and re-encoded as WebP q82. Total dropped from ~12MB to ~670KB (individual files now 21-173KB). Old PNGs deleted.
- **Modified** `src/components/connect/connect-data.ts`: imports updated from `.png` to `.webp`, with a comment explaining the resize/format/eager rationale.
- **Modified** `src/components/connect/ConnectPhoto.tsx` and `ConnectMobilePhoto.tsx`: added `loading="eager"` to the `next/image` so the photos fetch up front instead of lazily on scroll.

## Verification

- Puppeteer on the running dev server: all six photos report `loading="eager"`, `complete: true`, and correct WebP `naturalWidth` (800, or 608 for the one already-small photo) — i.e. fully downloaded, not mid-fetch.
- Screenshot of the Connect section confirms every photo renders crisp and correctly positioned after the format/size change.
- Confirmed the WebP files are correctly emitted into the static export (`out/_next/static/media/photo*.webp`, all small).
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Remaining work

- None currently flagged. If other image-heavy sections (e.g. the About trait photos, or case-study hero images) ever get the same "loads late" report, the same root cause applies site-wide — `unoptimized: true` means every `next/image` source ships as-authored, so oversized source files are the thing to check first.
