# Checkpoint — Mobile hero photo collage fix

## Context

Started a new phase of work: fixing mobile-only layout issues across the site, beginning with the home page hero photo collage. Desktop must stay untouched throughout this phase unless explicitly requested.

## Human directions

- "ok now i want to work on the mobile layout of the website; there are some things that look off. please don't change anything about the desktop version moving forward unless i tell you. this only applies to mobile."
- "first, i want to fix that hero photo collage in the home page. this is what the reference looks like on mobile: [motion recording] https://ovo-campione.framer.website/ . nothing about the logic of the motion should change but the images will probably need to be scaled and position differently"

## Records of resistance / things I got wrong and had to correct

- Nothing to correct this pass — root-caused the overflow bug before changing any values (see below), rather than just nudging percentages until it looked right.

## Successes

- Diagnosed the actual root cause of the mobile collage overflowing past the screen edges (visible in the current-state screenshot: photos touching/exceeding both edges of a 390px viewport) rather than just shrinking numbers until it happened to fit: the old mobile container was `w-full max-w-[420px] px-6` — but CSS resolves an absolutely-positioned child's `top`/`left`/`width`/`height` percentages against the containing block's *padding* box, not its content box, so `px-6` never actually inset the photos at all. The composition was effectively laid out edge-to-edge the whole time.
- Fixed at the container level, not by re-deriving percentages to dodge the same padding trap: switched the mobile container to a narrower, centered box with no padding (`w-[78%] max-w-[300px] mx-auto`), matching the same technique the desktop composition already uses (`DESKTOP_SCALE` + `mx-auto` in HeroCollage.tsx) — shrink the box itself rather than padding it.
- Used the provided reference recording (campione.framer.website mobile) to inform the new composition's *feel* — a tight, mostly-overlapping stack with the portrait large and centered and the four supporting photos tucked mostly behind it — rather than the previous four-corners-plus-center arrangement that read as more spread out.
- Confirmed via Puppeteer at both 390px and 375px viewports that `document.documentElement.scrollWidth` now exactly equals `clientWidth` (no horizontal overflow at all, vs. the previous visible edge-bleed).
- Confirmed via screenshot at 1512px that the desktop composition is pixel-identical to before — only `mobileCollageLayout`/the `lg:hidden` container branch changed; `desktopCollageLayout`, `DESKTOP_SCALE`, and the `lg:block` container were untouched.
- Confirmed the scroll-linked upward translate (the only motion mobile actually uses — no depth/rotateX since mobile photos have no `depth` set) still animates correctly post-scroll — same `HeroSection.tsx`/`CollagePhoto.tsx` motion logic, completely untouched; only the static layout config changed.

## State at this checkpoint

- **Modified `src/components/hero/collage-layout.ts`**: rewrote `mobileCollageLayout`'s five photos' `top`/`left`/`width`/`height`/`rotate` to a tighter, mostly-overlapping stack (portrait large and centered, the other four pulled in closer and rotated slightly, tucked mostly behind it); added `mobileCollageAspect = "4 / 5"` (previously a bare `aspect-[5/6]` class on the container, not a named export — pulled out for parity with `desktopCollageAspect`).
- **Modified `src/components/hero/HeroCollage.tsx`**: mobile container div changed from `relative mx-auto aspect-[5/6] w-full max-w-[420px] px-6 lg:hidden` to `relative mx-auto w-[78%] max-w-[300px] lg:hidden` with `aspectRatio: mobileCollageAspect` in an inline style (matching how the desktop branch already sets its aspect ratio inline). Desktop branch (`lg:block`) untouched.
- Verified: `npx tsc --noEmit` clean; Puppeteer screenshots at 390px and 375px show a tight, contained, centered cluster with zero horizontal overflow; 1512px desktop screenshot confirmed pixel-identical to the pre-change baseline; scroll-triggered upward translate confirmed still working; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## Follow-up: match the reference's size/position more closely

- "you did scale it but the positioning of the images don't look like how the reference does on mobile. i want it to be similar to the size and position of the image as the reference" — the first pass fixed the overflow but didn't actually match the reference's composition: the portrait was too small (56% width) and the two top photos sat mostly *beside* the portrait rather than *behind* it, reading as their own fully-visible photos rather than a peeking sliver.
- Re-measured the reference directly off a gridded frame (50px grid overlaid on the 1170x2532 native frame) instead of eyeballing again: read pixel bounding boxes for the portrait and its surrounding photos, converted each to a % of the composition's own bounding box.
- Key finding from the re-measurement: the reference's top photo sits *entirely within* the portrait's horizontal span, so it's fully hidden behind the portrait except for a sliver at the top — while the bottom two photos actually render *in front of* the portrait, covering its bottom corners. Reproduced this with explicit z-index layering (top pair z:10/11, portrait z:20, bottom pair z:30/31) instead of one flat z:10 for every supporting photo.
- Updated `mobileCollageLayout`: portrait grown from 56%→68% width / 74%→77% height; top two photos (scadproGroup, wallCritique) narrowed and pulled inward to sit mostly behind the portrait's own horizontal span (peeking only at the very top); bottom two photos (constructionSite, presentationRoom) enlarged slightly and given higher z-index than the portrait so they sit in front, matching the reference's shirt/glass-square photos.
- Verified: `npx tsc --noEmit` clean; screenshot confirms the new composition reads as a portrait-dominant stack with slivers peeking above and prominent photos covering the bottom corners, matching the reference's structure; still zero horizontal overflow at 390px/375px; desktop screenshot still pixel-identical; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## Follow-up: switched to the full 9-photo Figma-sourced composition

- "on mobile i can only see 5 images instead of all 9" — provided 9 screenshots of a Figma frame (iPhone 16, 393x852pt) with the Inspect panel open on each of 9 rectangles, one at a time. Each screenshot's Layout panel gave that layer's exact width/height, and the 4-directional distance-to-frame-edge callouts gave its position — confirmed every rectangle's `left+width+right=393` and `top+height+bottom=852` before trusting the numbers.
- Root cause: the two earlier passes both worked from a curated 5-photo subset (`scadproGroup`, `wallCritique`, `portrait`, `constructionSite`, `presentationRoom`) inherited from the very first mobile layout — matching the reference's *feel* but never actually using all 9 photos `desktopCollageLayout` uses. The user's own Figma mobile frame confirmed the intended mobile design does use all 9.
- Read off all 9 boxes precisely (px, relative to the 393x852 frame) and mapped each Figma rectangle to the matching desktop photo by visual content (portrait, constructionSite, and presentationRoom were unambiguous from what's visible in each screenshot's selection; the remaining six — scadproGroup, workshopTable, wallCritique, lobbyWalk, aigKiosk, officeMeeting — matched by content/position against their established desktop roles).
- Converted every box to independent width%/height% of the 393x852 frame (same two-axis-independent-% technique `desktopCollageLayout` already uses against its own 1512x650 frame) rather than eyeballing again.
- z-index: gave the two bottom photos (`constructionSite`, `presentationRoom`) higher z than the portrait since they render fully legible over the portrait's bottom corners in the Figma frame; the other six sit behind the portrait, visible only where its own box doesn't reach — same reasoning as the previous pass, now applied to the correct full photo set.
- Container (`HeroCollage.tsx`): since the Figma frame's own ~22px/393 (≈5.6%) side margins are already baked into the percentages, the mobile container no longer needs the artificial `w-[78%]` shrink from the previous pass — switched to `w-full max-w-[430px]` (a bare width cap so it doesn't scale past native size on wider phones, nothing more).
- Verified: `npx tsc --noEmit` clean; screenshot confirms all 9 photos now render (portrait dominant and centered, the other 8 layered around/behind/in front of it per the Figma frame); zero horizontal overflow at 390px/375px; desktop screenshot still pixel-identical; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## Remaining mobile work

User said "there are some things that look off" about mobile generally — this checkpoint only covers the home page hero collage. Other mobile-only issues elsewhere on the site have not yet been identified or addressed.
