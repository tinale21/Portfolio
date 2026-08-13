# Checkpoint — How Wayve Scales polish, Takeaway, Try These

## Context

Closed out the Wayve case study build: several rounds of direct visual feedback on "How Wayve Scales" (already committed as `bf2b898`, this checkpoint covers everything since), then added the final two sections — Takeaway (ported from AIG) and the shared "If This Caught Your Eye, Try These" marquee.

## Human directions (this batch, in order)

- "ok great. now let's do the key contribution..." (earlier, unrelated to this batch)
- "can you make the number centered to the height of the heading and description for each" — numbers were top-aligned against the heading+description column; switched the row to `items-center`.
- "can you put more space between the 'From Event to Ecosystem' and the rest of the content within" — bumped that gap from `mt-16` to `mt-24`.
- "for the first image, can you crop it to the top so we see the top of the phone" — Technology segment was showing the mid-grip area; switched to `preserveAspectRatio="xMidYMin slice"`.
- "can you crop the 5th image to the top too so we see the girl's face" — New Users segment. `xMidYMin` alone showed only sky/buildings (the display box is very short relative to the source photo's height, so a Min-anchored slice barely gets past the top margin). Pre-cropped the *source* JPEG itself to a window matching the display box's exact aspect ratio, centered on her face — verified against the un-cropped high-res source with a few iterations (first pass still clipped her chin; shifted the crop center down ~60px and re-verified).
- "ok great. now add the takeaway [screenshot]. use the same text color, sizing, and spacing as the aig takeaway" — ported `AigTakeaway.tsx` structurally as `WayveTakeaway.tsx`.
- "add more space between the how wayve scales section and the takeaway section" — bumped `WayveTakeaway`'s `pt-16` to `pt-36`.
- "add more space between the final design implementation section and the how wayve scales section" — bumped `WayveHowWayveScales`'s `pt-16` to `pt-36`.
- "reduce it a bit" — that last change read as too much; brought it back down to `pt-24`.
- "ok great. now add the 'If This Caught Your Eye, Try These' section after the takeaway. use the same text and video sizing, spacing, and color as the aig one. but remember to replace wayve with aig since this is already the wayve case study" — wired the existing shared `TryTheseProjects` component (already built for AIG, parameterized by `currentSlug`) into Wayve's page with `currentSlug="wayve"`. No new component needed; this one was designed for reuse from the start.
- "let's build and push"

## Records of resistance / things I got wrong and had to correct

- First attempt at cropping the New Users photo used only `preserveAspectRatio="xMidYMin slice"` (SVG's built-in top-anchor). This showed almost nothing of her — the display box's aspect ratio (~2.79:1, very short/wide) means a Min-anchored slice only reveals a thin strip starting at the very top of the source photo, which in this photo is empty sky/rooftops well above her head. Recognized that per-photo `preserveAspectRatio` tuning wasn't going to work for this one and switched strategy: pre-crop the *source file* to a window whose own aspect ratio already matches the display box, centered on the actual subject, so the default centered "slice" just shows exactly that window with no further need for edge-anchoring.
- That first source crop still cut off her chin. Rather than eyeball a second guess, recomputed the crop center by identifying the visible face span in the un-cropped high-res source (~y 290–680 of 1651) and nudging the window center down by 60px, then re-verified against a fresh test crop before writing the final asset.
- Bumped the FDI→How-Wayve-Scales gap to `pt-36`, which per next feedback ("reduce it a bit") turned out to be too much — brought it back to `pt-24`. Noting this since it's the kind of thing worth remembering as a starting point rather than re-guessing from scratch if a similar gap comes up again in this case study.

## Successes

- For the face-crop problem, didn't keep tweaking `preserveAspectRatio` values blindly — recognized when the *display box's* extreme aspect ratio made that approach fundamentally unworkable for this specific photo, and switched to fixing it at the source instead.
- Recognized "If This Caught Your Eye, Try These" required zero new component code — `TryTheseProjects` was already built generically (takes `currentSlug`, filters itself out of the project list) specifically so every future case study could reuse it. Wired it in directly rather than building a Wayve-specific duplicate.

## State at this checkpoint

- **Modified `src/components/case-studies/wayve/WayveHowWayveScales.tsx`**: number+heading+description row now vertically centered (`items-center`); `mt-16` → `mt-24` below "From Event to Ecosystem"; Technology photo `preserveAspectRatio` → `xMidYMin slice`; New Users photo reverted to default `xMidYMid slice` (crop now baked into the source file instead); section top padding `pt-16` → `pt-24` (net, after the `pt-36` overshoot).
- **Modified `public/case-studies/wayve/scales/new-users.jpg`**: re-cropped to a 900×323 window (matching the display box's exact aspect ratio) centered on her face, replacing the earlier centered/uncropped version.
- **New `src/components/case-studies/wayve/WayveTakeaway.tsx`**: direct structural port of `AigTakeaway.tsx` with Wayve's own copy (transcribed from the reference screenshot), same 15px/medium typography, same `#6E7681` right-column color, same 512px/597px column widths.
- **Modified `src/app/work/wayve/page.tsx`**: renders `<WayveTakeaway />` after `<WayveHowWayveScales />`, then `<TryTheseProjects currentSlug="wayve" />` after that — the Wayve case study is now feature-complete end to end.
- Verified: `npx tsc --noEmit` clean at every step; screenshot comparisons for each visual change; `TryTheseProjects` confirmed to exclude Wayve and include aig/emora/framer-redesign (9 links = 3 projects × 3 for the marquee loop); all videos confirmed `readyState: 4` with no load errors; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds; no new horizontal overflow introduced anywhere (the pre-existing `w-[650px]` Project Overview issue, still present, still unrelated, flagged again for visibility).

## Wayve case study status

Complete: Hero, Project Overview, Key Contribution, Research Method, Key Findings, Exploration & Iterations, Final Design Implementation, How Wayve Scales, Takeaway, Try These. No sections remain un-built.

## Known pre-existing issue (not fixed here, flagged again)

Wayve's Project Overview section has a `w-[650px]` column that overflows the page horizontally at standard viewport widths (confirmed present since the Final Design Implementation checkpoint, unrelated to any of this session's work). Still needs a separate fix.
