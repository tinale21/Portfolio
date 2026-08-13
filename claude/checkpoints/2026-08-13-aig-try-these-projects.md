# Checkpoint — AIG case study: "If This Caught Your Eye, Try These" section

## Context

Final AIG case study section: a continuous, seamless auto-scrolling marquee of related project thumbnails, excluding whichever project is currently being viewed. Built as a shared, reusable component (not AIG-specific) since every case study page will need the same "try these" strip with a different exclusion.

## Human directions

- "the 'If This Caught Your Eye, Try These' is suppose to be a scroll of my other projects that users can click on to go to that project's case study. for this use the existing thumbnails for AIG, Framer Redesign, Emora, and Wayve (but remember to not show the one for the project/case study they are currently viewing)... The scroll motion would like something similar to this: [recording] (there should be no breaks)" — provided 3 Figma dev-mode screenshots and a motion reference from a different portfolio site.
- "can you add more space between the final design implementation section and the if this caught your eye, try these section" — Takeaway sits directly between the two in page order, so interpreted as the Takeaway→TryThese gap and adjusted that.
- "can you make the scroll cut where the left and right padding is rather than scrolling across the whole screen."
- "ket's build and push" [sic].

## Records of resistance / things I got wrong and had to correct

- First attempt at "cut at the padding" put both the padding and `overflow-hidden` on the same div — didn't work, and a first verification pass with the wrong DOM selector wrongly showed 0px on each side (measuring the outer div, which still spans the full section width since padding is inside its own box). Re-checked with the correct selector, then reasoned through *why* it wasn't working: `overflow-hidden` clips at an element's own padding-box outer edge, so padding on that same element doesn't cut content there — it just adds blank space inside an already-full-width clip boundary. Fixed by splitting into two nested divs: outer carries the padding (matching every other section's content width), inner carries a bare `overflow-hidden` with no padding of its own, so its clip boundary sits exactly at the already-inset edge. Verified afterward with the corrected selector: exactly 68px clipped on each side.
- Two cards (Emora, Framer Redesign) rendered as near-blank/white in a screenshot — extracted their first frames directly via ffmpeg to confirm this is genuinely how those existing, already-shipped video assets look at frame 0 (not a bug introduced by this new component), rather than assuming something was broken.

## Successes

- Reused `projects-data.ts` and its existing video/poster assets directly — no new asset processing needed, and the `bordered` flag (Emora-only, for its white-background video) carried over automatically since it's read from the same source data.
- Watched the reference recording before building and correctly identified it as a continuous, non-paginated marquee (not a snap-scroll carousel) — implemented via the standard triple-the-list + infinite-linear-translate technique, verified the animation is genuinely running (not static) via computed transform values sampled a second apart.
- Built as a shared component (`src/components/case-studies/TryTheseProjects.tsx`, not nested under `aig/`) taking a `currentSlug` prop from the start, anticipating reuse on the other case study pages rather than needing to refactor later.

## State at this checkpoint

- **New `src/components/case-studies/TryTheseProjects.tsx`**: "If This Caught Your Eye, Try These" eyebrow + an infinite auto-scrolling marquee of 530x286px cards (10px radius, Emora bordered), each linking to `/work/{slug}`. Filters `PROJECTS` by `currentSlug` before rendering. Clip boundary matches the standard page padding (`px-5 sm:px-8 lg:px-[68px]`) via the two-div split described above. Section top padding `pt-28` for extra space below Takeaway.
- **Modified `src/app/work/aig/page.tsx`**: appends `<TryTheseProjects currentSlug="aig" />` as the final section — this completes the AIG case study's full section set.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, no overflow at 1512px, correct 3-project exclusion confirmed via DOM inspection (Wayve/Emora/Framer Redesign shown, AIG excluded), marquee clip boundary confirmed at exactly 68px on both sides.
- Not yet wired into the other case study pages (Wayve/Emora/Framer Redesign don't have dedicated routes yet — they still fall back to the generic `[slug]` placeholder) — will need `<TryTheseProjects currentSlug="..." />` added once those get their own dedicated pages.
