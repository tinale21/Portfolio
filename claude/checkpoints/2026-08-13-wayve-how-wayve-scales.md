# Checkpoint — Wayve "How Wayve Scales"

## Context

Built a genuinely new section format for the Wayve case study: a 5-item scaling roadmap with a continuous scalloped photo band and alternating top/bottom numbered callouts (01-05). No prior AIG or Wayve section shares this layout, so nothing to port — this was designed straight from the provided reference screenshot and a Figma SVG export.

## Human directions

- "Now next is the 'How Wayve Scales' this is a new format." — provided a reference screenshot (title "How Wayve Scales" / "From Event to Ecosystem", 5 numbered items 01-05 alternating above/below a continuous photo band) and a Figma-exported SVG (`Group 1000013359.svg`, 15MB).

## Records of resistance / things I got wrong and had to correct

- The 15MB SVG embedded all 5 photos as full-resolution base64 PNGs (1102-1656px each) inside a `<pattern>`/`<use>`/objectBoundingBox structure — far too heavy to ship as-is. Extracted the 5 images out, resized (longest side capped at 900px), and re-encoded as JPEG (quality 82), cutting total image weight from ~11.5MB to ~590KB.
- Initially tried to reverse-engineer the SVG's ~15 additional purple paths (`#4A25A9`/`#895FCF`) assuming they were flattened "01"-"05" digit glyphs. A naive regex-based bounding-box check gave inconsistent, overlapping results. Rendered the actual SVG in a real headless Chrome tab and called `getBBox()` on every path directly instead of guessing from raw path-command text — this revealed the purple paths are layered/overlapping shapes at ambiguous, overlapping positions, not clean digit outlines. Rather than risk misreproducing an effect I couldn't confidently interpret, built the numbers as plain live text instead, matching how every other numbered section in this codebase already works — a more maintainable and defensible choice than guessing at flattened vector data.
- Almost tried to hand-derive the original `objectBoundingBox` pattern-matrix math to swap in the new, differently-sized JPEGs (the original matrices were tuned to the exact original pixel dimensions). Recognized this was fiddly and error-prone, and switched to a cleaner native-SVG approach instead: plain `<image>` elements with `preserveAspectRatio="xMidYMid slice"` (SVG's built-in equivalent of CSS `object-fit: cover`) clipped by `<clipPath>`, which handles any image's aspect ratio correctly with no manual matrix math.
- Kept the 9 photo-band/white-notch paths (the actual pill/scallop shape) 100% verbatim from the source file, in their original document order, since that z-stacking is what produces the correct pinched-seam look between segments — did not attempt to approximate this with independent rounded-corner divs, which would not have reproduced the interlocking notch effect faithfully.

## Successes

- Confirmed via direct `getBBox()` measurement (not assumption) which interpretation of the ambiguous purple paths was actually correct before committing to a rendering approach.
- Verified the source SVG's own two purple colors (`#4A25A9`, `#895FCF`) directly from the file rather than eyeballing the reference screenshot, and reused Wayve's own already-established `#4A25A9` (matching `WayveExplorationIterations`' `ACTIVE_COLOR`) for consistency.
- Confirmed the resulting section introduces no new horizontal overflow — checked against the same pre-existing `w-[650px]` Project Overview bug flagged in the prior checkpoint, still present, still unrelated.

## State at this checkpoint

- **New `src/components/case-studies/wayve/WayveHowWayveScales.tsx`**: eyebrow + "From Event to Ecosystem" statement, a responsive inline SVG (viewBox `0 0 1396 288`) reproducing the exact scalloped photo band from the source file (5 photos, 4 white notch seams, verbatim `d` path data), and a 5-column text grid above/below it alternating per item (01/03/05 above, 02/04 below), each with number → heading → description in the matching reading order.
- **New `public/case-studies/wayve/scales/{technology,venue-activation,digital-ownership,social-sharing,new-users}.jpg`**: extracted from the source SVG, resized (max 900px), JPEG q82.
- **Modified `src/app/work/wayve/page.tsx`**: renders `<WayveHowWayveScales />` after `<WayveFinalDesignImplementation />`.
- Verified: `npx tsc --noEmit` clean; screenshot comparison against the reference shows a close match (photo order, scalloped seams, alternating layout, colors); `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds with all 5 image hrefs correctly prefixed with `/Portfolio`; no new horizontal overflow introduced (same pre-existing Project Overview issue as before, untouched).
- Approximated (no dev-mode redlines provided for this new format): spacing rhythm and type sizes (heading `text-2xl font-bold`, number `text-6xl font-bold`, description `text-[15px]`) — derived from the reference screenshot's visual proportions and checked by direct screenshot comparison, consistent with how other un-redlined sections in this codebase were built.

## Remaining Wayve work

- Takeaway section and the "Try These" marquee (`<TryTheseProjects currentSlug="wayve" />`) are still not built.
