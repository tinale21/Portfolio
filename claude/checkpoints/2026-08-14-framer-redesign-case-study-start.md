# Checkpoint — Start Framer Redesign case study: Hero

## Context

Started the fourth and final case study, Framer Redesign, following the same "graduated route" pattern as AIG, Wayve, and Emora. Built just the Hero section this round — and this graduation happened to be the one that finally emptied out the generic `/work/[slug]` fallback route entirely, which required a follow-up fix.

## Human directions

- "ook now let's move on to the framer redesign case study, we will start with the hero section: [motion reference recording] [reference screenshot]. again use the same text and video sizing, coloring, and spacing as the aig one. logo: lineicons_framer (1).svg video: Feature Animation.mp4"

## Records of resistance / things I got wrong and had to correct

- Adding `"framer-redesign"` to `GRADUATED_SLUGS` emptied out `generateStaticParams()` for the generic `/work/[slug]` route entirely (all 4 projects in `projects-data.ts` are now graduated) — Next.js's static export (`output: "export"`) requires at least one generated route per dynamic page, so the build failed with "returned an empty array from generateStaticParams()". Recognized this wasn't a bug to patch around but a sign the fallback route had reached the natural end of its usefulness, and deleted `src/app/work/[slug]/` entirely rather than propping it up with a fake placeholder route.
- Deleting `.next` to clear a stale generated-type error (`Cannot find module '../../src/app/work/[slug]/page.js'`) also wiped Next's own ambient type declarations (e.g. `LayoutProps`), breaking `tsc --noEmit` a second time in an unrelated way. Recognized this as a byproduct of the cache deletion, not a real code issue, and fixed it by running a plain `next build` once to regenerate `.next/types` before re-checking.

## Successes

- Before committing to AIG's exact 1378x550 video encode dimensions (per direct instruction, no "adjust for that" caveat this time, unlike Emora's Final Design Implementation), sampled frames across the *entire* 38.87s source animation (not just the first frame) to confirm the resulting center-crop wouldn't cut into any stage's core content — several stages of the animation use nearly the full frame height, so this check mattered.
- Recognized the build failure as a structural milestone (last project graduated, fallback route now genuinely obsolete) rather than trying to keep the old route alive with a workaround.

## State at this checkpoint

- **New `src/components/case-studies/framer-redesign/FramerRedesignHero.tsx`**: structurally identical to `AigHero.tsx` — same logo sizing (`h-[34px]`), h1 typography (32px/400), meta row (14px label/value, 203px column gap), and video box (1378:500 aspect, 10px radius, `#F4F4F5` border, 1378x550 source encode).
- **New `src/assets/logos/framer-redesign.svg`**: copied from the provided `lineicons_framer (1).svg`.
- **New `public/projects/framer-redesign-hero.mp4`** (1.4MB, 1378x550, 38.87s, no audio): center-cropped from the 1920x1080 source (`crop=1920:766:0:157`) to match the target aspect, then scaled down; audio stripped (source had a track).
- **New `src/app/work/framer-redesign/page.tsx`**: renders `<FramerRedesignHero />`, following the graduated-route pattern.
- **Removed `src/app/work/[slug]/page.tsx`** (and its now-empty directory): the generic fallback route this project used before graduating — no longer has any project left to serve now that all 4 are graduated, and Next's static export requires `generateStaticParams()` to return at least one route.
- Verified: `npx tsc --noEmit` clean; dev server responds 200 on `/work/framer-redesign`; Puppeteer confirms h1 text/typography, video loads (`readyState: 4`), no horizontal overflow; plain `next build` and `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` both succeed, the latter with the video src correctly prefixed with `/Portfolio`.

## Remaining Framer Redesign work

Everything past the Hero — Project Overview, and whatever other sections the reference design calls for — is not yet built.
