# Checkpoint — Emora Research Method

## Context

Built Emora's Research Method section, a direct structural and motion port of AIG's Research Method component (the rolling-digit odometer numbers).

## Human directions

- "ok now do the research method: [screenshot]. use same rules and motion as the aig" — provided a full reference screenshot (Screenshot 2026-08-13 at 7.08.38 PM.png) with all four items' numbers, headings, and descriptions.

## Records of resistance / things I got wrong and had to correct

- My own Puppeteer verification script broke on this section specifically: I added a `scrollIntoView` step before taking a `boundingBox()`-clipped screenshot (needed here, unlike prior sections, because this section's `whileInView` motion trigger requires actually scrolling it into view to fire). `boundingBox()` returns viewport-relative coordinates, but `page.screenshot({clip})` interprets those coordinates as document-relative — after scrolling, the mismatch meant the screenshot silently grabbed the *hero* section instead (whose document position happened to be near the post-scroll viewport-relative y of ~0). Caught this because the screenshot content didn't match what I expected, not because of an error — fixed by computing `rect.y + window.scrollY` to get true document-relative coordinates before clipping, and re-verified against the same clip technique used successfully on non-scrolled sections earlier in this build.

## Successes

- Recognized quickly that the wrong screenshot content was a coordinate-space bug in my *verification tooling*, not a bug in the actual component — didn't start second-guessing or modifying the component code based on a broken screenshot.

## State at this checkpoint

- **New `src/components/case-studies/emora/EmoraResearchMethod.tsx`**: structurally and motion-wise identical to `AigResearchMethod.tsx` — same `RollingDigit` odometer component (each digit rolls through 5 values on a vertical strip with mid-roll blur), same container blur/slide/fade-in via `whileInView` (`once: false`), same divider (304x2px, `#E4E4E4`), same typography (127px/600 numbers, 19px/600 headings, 15px/500 `#707682` descriptions), same 2-column grid with `lg:px-[280px]`/`lg:gap-x-[344px]`, same section padding/eyebrow-to-grid gap.
- **Modified `src/app/work/emora/page.tsx`**: renders `<EmoraResearchMethod />` after `<EmoraKeyContribution />`.
- Verified: `npx tsc --noEmit` clean; screenshot (using corrected document-relative clip coordinates) confirms all four items, the rolling-digit motion settling correctly, and the "week" suffix rendering next to "2" exactly as in the reference; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds; no new horizontal overflow beyond the pre-existing, already-flagged `w-[650px]` Project Overview issue.

## Remaining Emora work

Everything past Research Method — whatever sections the reference design calls for next — is not yet built.
