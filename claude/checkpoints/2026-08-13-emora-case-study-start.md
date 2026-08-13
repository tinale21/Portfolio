# Checkpoint — Start Emora case study: Hero

## Context

Started the third case study, Emora, following the same "graduated route" pattern as AIG and Wayve. Built just the Hero section this round.

## Human directions

- "now let's move on to the Emora case study. we will again work on this section by section. let's start with the hero section for emora. use the same text and video sizing, color, and spacing as the aig one. (the video is the same emora thumbnail video we have been using but if you need it again, let me know." — provided a full-page reference screen recording (Screen Recording 2026-08-13 at 6.29.35 PM.mov, a browser mockup showing the live reference design end to end) and the Emora app-icon logo (Group 20 1.svg).

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — this section was a direct, uneventful port of AIG's already-established hero pattern once the reference materials were gathered.

## Successes

- Instead of guessing whether the existing `public/projects/emora.mp4` (already used as this project's homepage/Work-grid thumbnail) was the same video referenced for the hero, extracted a frame from each and compared directly — confirmed pixel-identical content (the app-icon reveal animation) before reusing it, rather than assuming based on the user's description alone.
- The existing thumbnail video is 1280x720 (16:9), notably narrower than AIG/Wayve's wide 1378:500 hero box. Before committing to reuse it as-is (avoiding a re-recording request), checked the icon graphic's own vertical position within the source frame to confirm object-cover's crop wouldn't clip it — the icon sits centered with generous margin, well inside the resulting crop window.
- Transcribed all four meta values (Timeline, Role, Platform, Team Size) directly from the reference recording rather than asking the user to repeat information already visible on screen.

## State at this checkpoint

- **New `src/components/case-studies/emora/EmoraHero.tsx`**: structurally identical to `AigHero.tsx` — same logo sizing (`h-[34px]`), h1 typography (32px/400), meta row (14px label/value, 203px column gap), and video box (1378:500 aspect, 10px radius, `#F4F4F5` border). Reuses the existing `/projects/emora.mp4` directly — no new video asset.
- **New `src/assets/logos/emora.svg`**: copied from the provided `Group 20 1.svg`.
- **New `src/app/work/emora/page.tsx`**: renders `<EmoraHero />`, following the same graduated-route pattern as `/work/aig` and `/work/wayve`.
- **Modified `src/app/work/[slug]/page.tsx`**: added `"emora"` to `GRADUATED_SLUGS` so the generic fallback route no longer handles it.
- Verified: `npx tsc --noEmit` clean; dev server responds 200 on `/work/emora`; Puppeteer confirms h1 text/typography, video loads (`readyState: 4`), no horizontal overflow; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds with `/work/emora` now a dedicated static route and the video src correctly prefixed with `/Portfolio`.

## Remaining Emora work

Everything past the Hero — Project Overview, and whatever other sections the reference design calls for — is not yet built.
