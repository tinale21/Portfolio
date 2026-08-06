# Checkpoint — Hero scroll interaction, collage depth, and typewriter headline

## Context

Second implementation pass on the Hero section, building on the prior checkpoint's approved Step 1 (static collage) and Step 2 (scroll-linked translate). This pass covers the collage's 3D depth/tilt effect and Step 3 (headline + typewriter), taking the Hero section to feature-complete.

## Human directions

- Headline requirement, stated explicitly: it exists in the DOM from the start, sits below the fold on load purely because of its position in normal flow (not animated in), never itself translates/fades/slides, and only its text should animate — via a typewriter effect that starts once the headline becomes visible.
- Exact typewriter typography from Figma dev-mode: `"I'm "` in Inter SemiBold (600), the rest of each phrase in Inria Serif Bold (700), text color `#E4E7EC` — confirmed to apply identically across all 4 phrases.
- Collage motion was clarified/revised significantly after the prior checkpoint: initial ask was translate-only scroll response; later, after reviewing reference footage, the user asked for real depth — first tried as per-photo scale, corrected (via direct inspection of a reference site's live CSS) to a whole-group `rotateX` tilt with `perspective`, then further refined to add per-photo `translateZ` depth separation so photos foreshorten at different rates during the tilt.
- Many rounds of fine depth-tuning between specific named Figma rectangles (e.g. "add more depth between rectangle 117 and rectangle 125", "rectangle 121 looks slanted", "rectangle 124 goes behind rectangle 120") — each treated as a targeted, isolated adjustment rather than a full re-tune.
- Explicit process constraint carried over from before: don't move to the next step without approval; verify empirically (screenshots/DOM), don't just claim success.

## Records of resistance / things I got wrong and had to correct

- **Growing vs. tilting**: first depth attempt used per-photo `scale` shrink (0.96) for parallax. User reported the effect wasn't noticeable and, from a screen recording, that the reference "tilts towards you" rather than shrinking. Decomposed the reference site's live `matrix3d()` transform directly (not eyeballed) and found the actual mechanism was a `rotateX` on the whole collage wrapper, not per-photo scale — reimplemented accordingly.
- **Rotation magnitude undershot twice**: -8° (first "extremely subtle" attempt) and then -16° were both reported as too subtle; settled at -24° with tighter perspective (1200px → 800px).
- **Static depth silently regressed the approved rest-state layout**: giving each photo a constant `translateZ` shrank/repositioned the smallest background photos even at scroll=0, because perspective foreshortening applies regardless of rotation angle. User reported two photos had become invisible. Fixed by animating each photo's own `translateZ` from 0 up to its full depth in sync with scroll progress, so scroll=0 renders pixel-identical to the originally-approved flat layout.
- **z-index vs. 3D depth conflict**: `presentationRoom` (z-index 21) briefly rendered behind `wallCritique` (z-index 16) during scroll. Root cause: `transform-style: preserve-3d` makes the browser sort overlapping siblings by actual 3D depth, silently overriding CSS `z-index` when the two disagree. Fixed by keeping each photo's `depth` monotonic with its `z`, and left a code comment in `collage-layout.ts` warning about this constraint for future depth edits.
- **Slant/keystone artifact on `presentationRoom`**: a real geometric side-effect (not insufficient depth) of combining its off-center, low, far-right position with too much depth under rotation — fixed by walking its depth down across several rounds, balanced against the z-index monotonicity constraint above.
- **Typewriter trigger drifted from the headline's real position**: the trigger was written as "collage scroll-progress reaches 1," which worked only because, at the time, progress hitting 1 happened to coincide with the headline's arrival on screen. Later, per user request, the headline's top padding was reduced to move it up the page. That decoupled the two — the headline's absolute document position moved, but the trigger threshold didn't. Verified via Puppeteer (stepping scroll position and reading the headline's live `getBoundingClientRect()` alongside its rendered text) that the typewriter was starting only after the headline had already scrolled mostly behind the sticky nav (a ~57px sliver of a 136px-tall element), and would scroll fully out of view on any further scrolling. Fixed by triggering directly off the headline element's own bounding rect (visible below the nav, above the viewport bottom) instead of collage progress — now typing starts around scroll≈550–600px with the full headline comfortably on screen, confirmed by re-running the same step-through measurement and a visual screenshot.
- General pattern across this whole session: several depth/rotation questions were answered wrong on first guess from screenshots alone (direction of tilt, growing vs. shrinking, whether the reference pins/scroll-jacks) and only resolved correctly by decomposing live computed CSS transform values or DOM rects directly — screenshots alone were repeatedly insufficient or misleading for motion questions.

## Successes

- The build → lint → Puppeteer (screenshot + direct DOM/computed-style measurement) verification loop caught every bug above objectively — none of them were caught by visual inspection alone; all were confirmed via numbers (rect coordinates, matrix decomposition, rendered span text) before being called fixed.
- Decomposing a reference site's live `matrix3d()` into rotateX angle and translateZ, rather than estimating from video/screenshots, was the difference between guessing and knowing for every motion-related fix in this session.
- Keeping `depth` monotonic with `z` (with the reasoning documented in `collage-layout.ts`) has held up across many rounds of depth tuning since the rule was written, with no repeat of the stacking-order bug.

## State at this checkpoint

- Hero section is feature-complete: static collage (Step 1), scroll-linked translate + rotateX/depth tilt (Step 2), and headline + typewriter (Step 3) are all implemented and, per the user's latest request, verified.
- `page.tsx` still has a temporary `h-[150vh] bg-white` placeholder below the Hero, explicitly marked for removal once the next real section is built.
- No further Home page sections (e.g. "Selected Projects") have been requested yet.
