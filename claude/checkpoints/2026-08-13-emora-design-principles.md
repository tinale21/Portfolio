# Checkpoint — Emora Our Design Principles

## Context

Built a new section format for Emora: a 4-card grid, each with a self-contained icon badge, a number, and a body statement — sharing Key Findings' card treatment and drop shadow but otherwise its own new layout (no prior AIG/Wayve section uses this format).

## Human directions

- "now let's do the 'Our Design Principles'. this is a slightly different format than before. still use the same drop shadow as the key findings. [screenshot]. Icons: Group 1000013360-63.svg" — provided a full reference screenshot (Screenshot 2026-08-13 at 7.25.54 PM.png) and four icon badge SVGs directly.

## Records of resistance / things I got wrong and had to correct

- First verification screenshot showed the icon badges as blank — a Puppeteer `img.naturalWidth: 0, complete: false` result even though `curl` confirmed the SVG files were served correctly (200, valid `image/svg+xml`, well-formed content) and even loaded fine when navigated to directly as a standalone document. Initially suspected a repeat of the earlier dev-server Tailwind-caching lag and restarted the dev server, which didn't fix it. Root cause: Next.js `Image` lazy-loads by default, and this section sits far below the fold — my verification script was checking `naturalWidth` immediately after page load without ever scrolling the section into view, so the lazy images had never started loading. Confirmed by scrolling the section into view first, which fixed it immediately. Not a component bug at all — a gap in the verification script.

## Successes

- Since this is a new, un-redlined format, pixel-sampled the reference screenshot directly (darkest-pixel-in-region technique, same as used for How Wayve Scales) rather than eyeballing: number color `#7F7F7F`, body text pure black, eyebrow `#717682` (matches the site's standard `#707682` within screenshot rounding) — all confirmed, not guessed.
- Recognized the four icon SVGs are already complete, self-contained badges (65x65, 10px-rounded corners, `#ABD1D1` background baked in) and used them as-is rather than re-implementing a separate wrapper div + bare icon glyph.
- Correctly scoped the "same drop shadow as Key Findings" instruction narrowly — reused only the shadow value and its accompanying card treatment (border, radius, white background), not Key Findings' own number color/weight, since the user explicitly flagged this as "a slightly different format."

## State at this checkpoint

- **New `src/components/case-studies/emora/EmoraDesignPrinciples.tsx`**: 4-card flex row (`flex-1`, stretching to `lg:px-[68px]`), each card white/`rounded-[10px]`/`border-2 border-[#F9FAFB]` with Key Findings' exact shadow (`0px 4px 10px -4px rgba(0,0,0,0.15)`), containing a 64x64 icon badge, a `#7F7F7F` number, and black body text (both at 16px/text-base).
- **New `src/assets/case-studies/emora/icons/{human-centered,guided-learning,connected-devices,data-privacy}.svg`**: copied directly from the provided files.
- **Modified `src/app/work/emora/page.tsx`**: renders `<EmoraDesignPrinciples />` after `<EmoraKeyFindings />`.
- Verified: `npx tsc --noEmit` clean; screenshot (after correctly scrolling to trigger lazy-loaded icons) confirms all four icons, numbers, and copy match the reference; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds; no new horizontal overflow beyond the pre-existing, already-flagged `w-[650px]` Project Overview issue.

## Remaining Emora work

Everything past Our Design Principles — whatever sections the reference design calls for next — is not yet built.
