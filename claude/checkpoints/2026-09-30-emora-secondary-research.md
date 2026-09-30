# Checkpoint — Emora "Secondary Research" section

## Context

Replicates the Secondary Research section in the Emora case study, between Research Method and Key Findings, same layout/spacing as AIG/Wayve, with Emora's own links.

## Human directions

- "add the same secondary research section in my Emora case study ... between the Research Method and Key Findings. Same positioning and spacing, we are just replacing the links." Provided 3 card links (title + image) and 5 more URL-pill links.

## Records of resistance / things I got wrong and had to correct

- Mapped the 3 supplied images to their articles/files: Autism Speaks → `2025-Empower-Walk-+-5K-Run---NY---Large-crop.jpg.webp`; JMIR "Toward Continuous Social Phenotyping" → `d49c25e1fcd043dd4a93e9849e3978f8 (1) 1.png`; sparkforautism "Autism, Meltdowns..." → `mother-daughter 1.png`. Processed all to 800px-wide WebP; stripped `?utm_source` from every href/display.
- Kept it as a separate copy (`EmoraSecondaryResearch.tsx`), same as the AIG/Wayve pattern — same LAYOUT (3 cards + 5 pills) and `pt-16 pb-32` spacing so it starts visually matched, tunable independently. Included the `min-w-0` pill-text fix from the Wayve version up front so long URLs (pbs.org, autismparentingmagazine, jamanetwork) wrap within their pills.

## State at this checkpoint

- **Added** `src/assets/case-studies/emora/secondary/{autismspeaks,jmir,sparkforautism}.webp` (33-45KB each).
- **Added** `src/components/case-studies/emora/EmoraSecondaryResearch.tsx`: same overlapping-collage design, 3 article cards + 5 URL pills.
- **Modified** `src/app/work/emora/page.tsx`: placed `<EmoraSecondaryResearch />` between `<EmoraResearchMethod />` and `<EmoraKeyFindings />`.

## Verification

- Screenshots: desktop matches the AIG/Wayve collage with Emora's cards/pills; all long URLs wrap inside their pills; mobile stacks cleanly.
- All links are real `target="_blank"` anchors (utm stripped).
- Overflow sweep on `/work/emora` (scrolling) at 1512/1280/1024/768/390: 0px.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.

## Remaining work

- None flagged. All three case studies (AIG, Wayve, Emora) now have a Secondary Research section; each is its own component with an independent `LAYOUT`.
