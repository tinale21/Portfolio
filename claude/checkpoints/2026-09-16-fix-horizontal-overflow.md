# Checkpoint — Eliminate horizontal scroll site-wide

## Context

Audited the whole site for horizontal overflow (per direct request, "especially the case studies") and fixed every source of document-level horizontal scroll.

## Human directions

- "can you double check everything to make sure there is no horizontal scroll, especially the case studies"

## Records of resistance / things I got wrong and had to correct

- Built a thorough Puppeteer audit: every page (/, /about, /work, and all 4 case studies) at 10 widths (320/360/375/390/414/768/820/1024/1280/1512), scrolling top-to-bottom at each (to catch scroll-driven transforms), measuring `documentElement.scrollWidth - clientWidth`.
- First pass flagged the case studies' "try these projects" marquee cards as culprits — but those turned out to be a RED HERRING: they're inside an `overflow-hidden` track, so their off-screen `getBoundingClientRect` extents don't actually cause document scroll. Wrote a second, precise diagnostic that walks up each overflowing element's ancestors and ignores anything inside an `overflow: hidden/clip/auto/scroll` container, which surfaced the REAL culprits.
- Key realization on the biggest issue: the case study Project Overview's right column (paragraphs + media) is a fixed `lg:w-[650px]` block pushed right with `ml-auto` inside a `lg:flex-1` parent. Its right edge is anchored at a fixed 1510px regardless of viewport, so it fit only at >=1510px and overflowed EVERY laptop width from 1024-1509 (up to 486px at 1024). The 1512px reference "worked" only by a 2px coincidence — this was a real, widespread bug, not an edge case.

## Real overflow sources found & fixed

1. **Case study Project Overview right column** (all 4: aig/emora/wayve/framer) — fixed `lg:w-[650px]` -> `lg:w-full lg:max-w-[650px]` on both the paragraph block and the media block, so they cap at 650px but shrink to fit narrower desktops instead of overflowing. Two-column layout preserved at every lg+ width; the right column just narrows slightly (e.g. ~584px at 1512, was overflowing to 650).
2. **Emora "Our Design Principles"** (@768: 48px) — four cards went `sm:flex-row` (4 side-by-side) from 640px up, too tight to fit until lg. Changed to a responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, with `min-w-0` on cards so long words can't force overflow.
3. **Wayve Research Method** giant stat number (@320: 6px) — `text-[127px]` -> `text-[112px] min-[360px]:text-[127px]` (RollingDigit uses em units, so it scales); full size preserved at 360px+ where it already fit.
4. **About trait entries** (@1024: 11px) — the two 300px text columns + 318px photo needed ~1180px but went side-by-side at `lg` (1024). Bumped the side-by-side composition (row direction, column widths/alignment, and the overlap translate offsets) from `lg` to `xl`; below xl it stacks (the clean mobile composition). Photo size and page padding kept at `lg`. 1512 layout unchanged (xl=1280 <= 1512).

## Verification

- Re-ran the full audit (7 pages x 10 widths, with through-scroll): **0 horizontal overflow everywhere** — no OVERFLOW lines reported.
- Visual spot-checks at the previously-broken widths: AIG Project Overview @1280 (two-column intact, no overflow), Emora principles @768 (clean 2x2 grid), About @1024 (clean stacked entry). All good.
- Desktop 1512 layouts unchanged for About (xl still side-by-side) and case studies (columns just cap instead of overflow).
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Remaining work

- None. The "try these projects" marquee legitimately extends beyond the viewport inside its own `overflow-hidden` track — that's by design and does not cause document scroll.
