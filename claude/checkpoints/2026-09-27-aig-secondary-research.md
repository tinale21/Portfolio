# Checkpoint — AIG "Secondary Research" section

## Context

New section in the AIG case study, placed between Research Method and Key Findings, showing the secondary-research sources as scattered "link pill" cards, styled after a reference (celinafang.framer.website/work/detoxbox).

## Human directions

- "add something in my AIG case study ... after the research method and right before key findings ... called 'Secondary Research'. I want to use this reference with how they display their articles [scattered overlapping link cards]. You don't have to add the 'analyzed 20+...' just add the 'Secondary Research' title using the same text rule as i have for all my titles ... these are the links: [9 URLs, some run together]"

## Records of resistance / things I got wrong and had to correct

- Several of the provided URLs were mashed together with no separator. Parsed them by splitting on `https://`, and reconstructed the one that was genuinely split: the tail `s-2024-best-financial-innovation-labs/` (which had landed at the end of the toponetouch fragment) belongs to `gfmag.com/technology/innovator` -> `https://gfmag.com/technology/innovators-2024-best-financial-innovation-labs/`. Confirmed the full 9-link list with the user before building (they approved all 9).
- Scope: the reference shows full article-preview cards (OG thumbnail + title + description + favicon) plus app icons. That needs per-link metadata/images, which a static export (no optimization/fetch server) can't produce, and the user only provided URLs — so built the URL-pill style (the other prominent element in the reference), which is fully achievable from URLs alone. Title only ("Secondary Research"), no "analyzed 20+..." blurb, per instruction.
- Overflow safety (recalling this session's earlier fixed-px-in-a-%-box bug): the desktop scatter positions AND pill widths are ALL in `%` (each pill's `left + width <= ~95`), so no pill can extend past the container at any viewport width. Verified 0px overflow at 1512/1280/1024/390.
- Title style: matched the majority of AIG section eyebrows (`font-sans text-base text-[#707682]` with `px-5 sm:px-8 lg:px-[68px]`) — the "same text rule" as the other titles.

## State at this checkpoint

- **Added** `src/components/case-studies/aig/AigSecondaryResearch.tsx`: `"Secondary Research"` eyebrow + the 9 sources as clickable pills (`<a target="_blank" rel="noopener noreferrer">`, chain icon + underlined URL). Desktop (lg+): absolutely-positioned scattered/overlapping collage in a bounded `%`-based relative box with small rotations and a staggered scroll-reveal. Below lg: a clean stacked list (also scroll-revealed).
- **Modified** `src/app/work/aig/page.tsx`: imported and placed `<AigSecondaryResearch />` between `<AigResearchMethod />` and `<AigKeyFindings />`.

## Verification

- Screenshots: desktop shows the scattered link-pill collage; mobile shows a stacked list — both readable, matching the reference's pill style.
- Links are real `target="_blank"` anchors to the 9 confirmed URLs.
- Overflow sweep on `/work/aig` (scrolling) at 1512/1280/1024/390: 0px.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.

## Follow-up -- add 3 full article cards + re-tune scatter

### Human directions

- "i want some to have full article preview cards" + supplied a thumbnail image and title for three links: medium ("Interactive Museum Experiences: How Technology is Shaping Visitor Engagement"), visix ("Transforming Spaces Into Shared Experiences"), gfmag ("The Innovators 2024—Best Financial Innovation Labs"). "Also can you reevaluate the reference for how each link and card is positioned."

### State at this checkpoint

- **Added** `src/assets/case-studies/aig/secondary/{museum,visix,gfmag}.webp`: the three supplied thumbnails, resized to 800px-wide WebP (28-93KB).
- **Rewrote** `AigSecondaryResearch.tsx` with a mixed item model: 3 `card` items (thumbnail in a 16:10 object-cover box + bold title + source domain with a link glyph) and 6 `pill` items (unchanged URL pills). Re-tuned the desktop `LAYOUT` to match the reference more closely: the 3 cards are the larger central anchors (lower z) and the 6 pills layer on top of / around their edges (higher z), with small rotations — a denser, overlapping cluster rather than an even spread. Still all-`%` positioning (left + width <= ~95) for overflow safety. Mobile stacks cards then pills.

### Verification

- Screenshots: desktop shows the 3 image cards anchoring the collage with pills overlapping their edges (close to the reference); mobile stacks the cards (image + title + source) and pills cleanly.
- Cards and pills are all real `target="_blank"` links.
- Overflow sweep on `/work/aig` (scrolling) at 1512/1280/1024/768/390: 0px.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.

## Follow-up 2 -- match the reference's tight overlapping cluster

### Human feedback

- "the way the links and card stack doesn't look like the reference" (re-shared the reference: a dense CENTERED cluster where the 3 cards overlap each other and the pills sit on top of them crossing edges — not an even spread).

### State at this checkpoint

- **Modified** `AigSecondaryResearch.tsx`: shrank the desktop cluster container to `max-w-[980px] h-[540px]` (centered, whitespace either side) and re-tuned `LAYOUT` so the three cards overlap each other (visix left / medium center-front / gfmag right, edges overlapping) and the six pills layer on top (higher z) crossing card boundaries — matching the reference's packed pile. Still all-`%` (left + width <= ~95) for overflow safety. Mobile stacked layout unchanged.

### Verification

- Screenshot: now reads as the reference's tight, centered, overlapping cluster (cards overlapping, pills layered over them).
- Overflow sweep `/work/aig` at 1512/1280/1024/768/390: 0px. `tsc`/`eslint`/`build` clean.

## Follow-up -- interactive position tuning + remove tilt

Same-day, iterative (many small "move X by Npx" requests). Converted px nudges
to % of the fixed cluster box (960x540: 1px x = ~0.102%, 1px y = ~0.185%).

- Removed the per-item tilt (dropped `rotate` from `LAYOUT` and the motion
  props) so every card/pill sits straight, per direct request.
- Fine-tuned individual positions/z-index one at a time (medium card lower,
  toponetouch pill repositioned onto the museum image, robinpowered onto the
  gfmag card, etc.), including sending some pills behind/in front of the
  medium card via z-index.
- Swapped the gokorbyt and aimultiple pill positions, then nudged aimultiple
  down repeatedly (top-center, now `top: 31.43`, overlapping the visix card).
- Removed the gokorbyt pill entirely (per follow-up); collage is now 3 cards
  + 5 pills (aimultiple, robinpowered, finovate, toponetouch, crowntv).
- Section bottom padding bumped `pb-16` -> `pb-32` for more space before
  Key Findings.

Positions remain all-`%` in `LAYOUT` (left + width <= ~95) so overflow stays
0px at every width. This state is committed so a cloud session can pick it up.

## Remaining work

- The other 6 sources remain URL pills (no thumbnails/titles supplied). If any should become cards too, provide an image + title and move it to a `card` item. Scatter positions live in the `LAYOUT` array (indexed to `ITEMS`), easy to re-tune.
