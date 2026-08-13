# Checkpoint — Wayve case study: Hero through Key Findings

## Context

Started the second case study (Wayve), following the exact same section-by-section, one-at-a-time process established for AIG. The defining instruction across this whole session was to reuse AIG's already-established coloring/sizing/spacing/motion rules directly rather than re-deriving new values from scratch for each section — this repo now has two case studies sharing one visual language by construction, not by coincidence.

## Human directions

- "now let's move on to the Wayve case study... Like the AIG case study we will do this one section at a time. Let's start with the hero. For this use the same text rule and spacing rule as you used for the AIG hero." — provided a full-page design mockup (5528x32768 PNG), a page-level motion reference, the Wayve logo SVG, and a hero video source.
- "ok now let's do the project overview. again use the same text sizing and color, image sizing, spacing rule." — provided a reference screenshot and a team photo. Followed by several rounds of direct feedback: "reduce the image height a bit" → "increase it a little bit" → "shift the Problem and Solution section together down a bit" → "increase the size of the image now a bit" → "is the image width the same as the paragraph" → "make the image the same width as the paragraph" → "make the image the same height it was before" → "shift the Problem and Solution section together down by 5px".
- "ok great now let's do the key contribution section. again use the same coloring, sizing, and spacing rule as the AIG one." — provided 3 icon SVGs and a reference screenshot.
- "ok now let's do the research method. again make sure coloring, sizing, and spacing is the same as the AIG. also make sure it has the same motion used in the AIG."
- "ok now let's do the key findings. again use the same coloring, sizing, and spacing rule as the aig one. also use the same drop shadow as the aig one."
- "let's build and push".

## Records of resistance / things I got wrong and had to correct

- **Real overflow bug caught mid-request, not after.** "increase the size of the image now a bit" (Project Overview's team photo) — tried 700px, got 48px of genuine page overflow (confirmed via `scrollWidth`/`clientWidth`, not assumed), binary-searched down to a real safe maximum of 652px — only 2px more than the original. Reported this transparently rather than quietly landing on a value indistinguishable from "no change."
- **A photo-width/height back-and-forth that needed careful sequencing.** The 652px result was flagged as a mismatch once the user asked directly whether it matched the paragraph's own 650px width — reverted to exactly 650px. Then "make the image the same height it was before" was genuinely ambiguous (before the last width bump? before all the height tweaks?) — reasoned through it explicitly in the code comment: since width was already back to 650px, the aspect-locked height had already silently reverted to the pre-bump value (299px), so "before" most plausibly meant the *original* un-modified 597:301 aspect, which is what got restored.
- Otherwise, no corrections — direct 1:1 reuse of AIG's structure/values across Hero, Key Contribution, Research Method, and Key Findings all matched the provided reference screenshots on the first pass, verified each time via Puppeteer (overflow checks, computed styles, line-break comparisons, digit-roll transform sampling) rather than assumed correct from the code alone.

## Successes

- **Hero's video aspect ratio wasn't just copied from AIG — it was independently verified against a precise pixel-boundary scan of the new mockup**, which happened to confirm the mockup uses the identical 1512px reference width and 67/68px page-padding convention as AIG, and that the video box's *native* Figma size (1378x550) matches AIG's own *pre-tuning* redline exactly — informing the decision to reuse AIG's already-tuned final value (500px) rather than re-shipping 550 and risking the same multi-round resize conversation again.
- **Research Method's motion was copied verbatim, not just visually matched** — the same `RollingDigit` component, `CONTAINER_VARIANTS`/`DIGIT_VARIANTS`, and shared-trigger variants-propagation technique, then re-verified independently for Wayve's own content (confirmed the digit-roll settles at the mathematically correct transform value for a 127px-font 5-step strip, not just "looks right").
- Correctly recognized that "220+" needed zero special-casing — `RollingDigit`'s existing digit/non-digit branch already passes `+` through as static text, so it worked identically to how AIG's own "weeks" suffix is handled as a separate field.

## State at this checkpoint

- **New route `src/app/work/wayve/page.tsx`**: renders Hero → Project Overview → Key Contribution → Research Method → Key Findings, in that order. Wayve excluded from the generic `[slug]` fallback route (`GRADUATED_SLUGS` in `src/app/work/[slug]/page.tsx`, alongside `aig`).
- **New `src/components/case-studies/wayve/`**: `WayveHero.tsx`, `WayveProjectOverview.tsx`, `WayveKeyContribution.tsx`, `WayveResearchMethod.tsx`, `WayveKeyFindings.tsx` — each a direct structural port of its AIG counterpart with Wayve's own copy/assets.
- **New assets**: `src/assets/logos/wayve.svg`, `src/assets/case-studies/wayve/team-photo.png`, `src/assets/case-studies/wayve/icons/{survey,persona,ux-design}.svg`, `public/projects/wayve-hero.mp4` (cropped/encoded with the same technique as AIG's hero video: center-crop to 2.505:1, 1378x550, CRF 18, no audio).
- Verified: `npx tsc --noEmit` clean, both a plain `npm run build` and a `NEXT_PUBLIC_BASE_PATH=/Portfolio` build succeed, the Wayve hero video's `src` correctly prefixed in the GH-Pages-flavored build output, no overflow at 1512px across all 5 sections, digit-roll motion confirmed via computed transform sampling.
- Remaining Wayve sections (Visual Directions, Exploration & Iterations, Final Design Implementation, Takeaway, Try These) not yet built — same one-section-at-a-time process to continue.
