# Checkpoint — Selected Projects card autoplay fix

## Context

Continuing the mobile-issues pass: the home page's "Selected projects" cards were showing a play button on mobile instead of autoplaying their preview videos.

## Human directions

- "ok the hero on mobile is looking good. now the selected projects on mobile are not autoplaying and require users to have to click a play button"

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — but flagged an honest limitation to the user rather than claiming full verification: this environment can't reproduce mobile Safari/Chrome's actual autoplay-blocking behavior (headless desktop Chrome via Puppeteer already autoplays muted video freely, matching the pre-fix code's behavior too, so it can't confirm the *original* bug or definitively prove the fix resolves it on a real device). Applied the standard, well-established mitigation instead of guessing at something more exotic.

## Successes

- Diagnosed the likely root cause without over-fitting to a single theory: the bare `autoPlay` HTML attribute is well known to be unreliable on mobile browsers, especially with several `<video>` elements all attempting to autoplay simultaneously on one page (this grid has 4, one per project) — even when muted+playsInline, which should otherwise qualify for autoplay everywhere.
- Used the standard, robust fix rather than a mobile-specific hack: an `IntersectionObserver` that explicitly calls `video.play()` once each card's video is actually in view, as a JS-driven backup to the (kept, unremoved) `autoPlay` attribute. This is a strict addition, not a replacement — browsers where the plain attribute already works see no behavior change.
- Confirmed via Puppeteer this doesn't break anything: all 4 cards' videos still play (not paused, `currentTime` advancing) at both a 390px mobile viewport and 1512px desktop; desktop screenshot shows no visual regression.

## State at this checkpoint

- **Modified `src/components/projects/ProjectCard.tsx`**: added a `videoRef` and a `useEffect` with an `IntersectionObserver` (`threshold: 0.1`) that calls `videoRef.current.play().catch(() => {})` once the card's video scrolls into view. The existing `autoPlay muted loop playsInline` attributes are untouched.
- Verified: `npx tsc --noEmit` clean; all 4 project videos confirmed playing via Puppeteer at both mobile (390px) and desktop (1512px) viewports; desktop screenshot shows no visual regression; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds.

## Follow-up: still broken on first/cold load on a real device

- "ok the selected project is still having autoplaying problems when you first load to the site on mobile" — the `IntersectionObserver` fix wasn't sufficient on its own.
- Added two more defensive layers against the most likely *timing* cause — the observer firing before the browser has buffered enough of the video to actually start playing: `preload="auto"` (asks the browser to prioritize fetching this video's data immediately instead of deferring it), and a second `attemptPlay()` trigger wired to the video's own `loadeddata` event, gated by an `isIntersectingRef` so it only actually calls `play()` if the card is also in view. `attemptPlay` is idempotent (calling `play()` on an already-playing video is a harmless no-op), so having two triggers can't double-play or otherwise misbehave.
- Flagged an important caveat directly rather than implying this is now guaranteed fixed: some mobile browsers expose a hard, user-level autoplay preference (iOS Safari: Settings > Safari > Auto-Play > "Never Auto-Play") that blocks *all* autoplay, muted or not, regardless of any JS `play()` call — no web-side code can override that setting. If the symptom persists after this change, that's worth checking directly on the device before assuming it's still a code bug.
- Verified: `npx tsc --noEmit` clean; all 4 project videos still confirmed playing via Puppeteer (no regression from the added `loadeddata` listener); `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds. Same limitation as the first pass — this environment can't reproduce or definitively confirm-fix the actual mobile-browser autoplay-blocking behavior.

## Remaining mobile work

- Same underlying pattern (`autoPlay muted loop playsInline` with no JS-driven fallback) is used across every case-study Hero/section video in the codebase (AIG, Wayve, Emora, Framer Redesign — `grep -l autoPlay src/components/case-studies` turns up ~11 files). Only fixed the one the user actually flagged (home page Selected Projects); if the same play-button symptom shows up on any case-study page, the identical fix would apply there too.
- Could not verify on an actual mobile device/browser from this environment — headless Chrome's autoplay policy doesn't reproduce the reported bug, so this fix is based on established best practice for this exact class of issue, not a confirmed-fixed repro. If it's still broken after this pass, check the device's own autoplay setting (see caveat above) before looking for further code causes.
