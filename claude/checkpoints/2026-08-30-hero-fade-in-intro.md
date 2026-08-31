# Checkpoint — Replace Hero's typewriter headline with a fade-in intro paragraph

## Context

Replaces the phrase-cycling typewriter headline in the Hero section with a single static intro paragraph that fades in on scroll, matching a provided reference image, with a "Explore More ↓" cue at the bottom.

## Human directions

- 'i want to change the typewriting part of the hero section in the home page. instead of that i want a paragraph to fade in and appear like this when scrolled: [reference image — bold paragraph top-left, large empty space, "Read more ↓" bottom-left] (Instead of Read More do "Explore More". I want it to have enough space on the top and bottom so that it takes up the screen before the user scrolls. Also for the paragraph this is the text: Hi, I'm Tina! I'm a UX designer who turns curiosity into thoughtful experiences. I love exploring ideas, solving problems, and obsessing over the little details that make an experience feel just right.'

## Records of resistance / things I got wrong and had to correct

- Before writing any code, traced why the old headline was `position: sticky` with an extra pinned "hold" distance (`HEADLINE_HOLD`) at all — it wasn't decorative, it exists specifically so `ProjectsSection`'s rising white background has a *stationary* target to sweep over. Removing it naively would have reintroduced a previously-documented, previously-fixed bug in this exact codebase (a frozen, non-progressing partial overlap, confirmed via Puppeteer in the original work at "stuck at exactly 26% coverage regardless of scroll position"). Kept the sticky+hold mechanism structurally intact and only swapped what's inside it.
- First implementation made the fading intro block a full `min-h-[calc(100vh-64px)]` on every breakpoint, reasoning that "takes up the screen" meant matching the collage block's own full-viewport sizing exactly. Verified this directly with Puppeteer rather than assuming it looked right, and it didn't: a full-viewport-tall *stuck* block's bottom edge sits exactly at the screen's bottom edge the instant it settles — leaving zero buffer before Projects' rising edge (still using its old pull-up value, tuned for a small single-line headline near the *top* of the screen) started visibly painting over "Explore More" almost immediately, before the user had a real chance to read it. Confirmed this precisely (not just visually) by measuring the button's `getBoundingClientRect()` against Projects' section top across a scroll range on both breakpoints.
- Fixed by reducing the intro block to `min-h-[70vh]` (mobile) / `min-h-[80vh]` (desktop) instead of a full viewport — leaves genuine dark space below it once stuck. That alone wasn't enough on its own, though: `ProjectsSection`'s own `-mt-[350px]` pull-up was derived (per its own existing comment) specifically against the *old* headline's on-screen resting position (66px from viewport top) — with the new, much taller target's relevant edge sitting near the *bottom* of the screen instead, that same pull value made Projects arrive far too early regardless of the height fix. Reduced it to `-mt-[100px]` and re-verified empirically (this codebase's own established approach for these hand-tuned scroll effects, per its own comments describing multiple rounds of "700px, then 250px, then 350px") — checked the actual button-vs-Projects-top pixel math across a real scroll range on both breakpoints, not just eyeballing one screenshot, and confirmed a genuine window (~250-450px of scroll) where Explore More stays fully visible before the sweep reaches it, on both mobile and desktop.
- After that fix, re-verified the original failure mode specifically (not just "does it look fine now") — scrolled desktop from 1x to 4x viewport height and confirmed Projects' top position decreases linearly and continuously the whole way (971 → 521 → 71 → -379 → -829 → -1279 → -1729, exactly -450px per 0.5-viewport step) with no plateau, confirming the sweep completes fully rather than freezing partway.

## Successes

- Deleted `TypewriterHeadline.tsx` entirely rather than leaving it as dead code — confirmed via grep it had no other usages before removing.
- Reused the site's already-established `whileInView` fade-in pattern (same technique as `AboutSection`'s mission quote) instead of inventing a new animation mechanism — simpler than the typewriter's old scroll-progress-driven, mobile-only opacity logic, and correctly covers "hidden until scroll, then fades in" uniformly on every breakpoint (the old mechanism was deliberately desktop-exempt for reasons specific to coordinating the typewriter's start trigger, which no longer applies to a static paragraph).
- "Explore More" is a real, working control, not just matching text — clicking it scrolls one viewport down via Lenis's own `scrollTo` (falling back to native `window.scrollTo` off-desktop), same reasoning as `NavBar`'s existing `scrollToTop` helper (a raw `window.scrollTo` fights Lenis's per-frame resync). Verified the click actually moves the page (~899px on a 900px-tall viewport).
- Verified via Puppeteer: intro paragraph opacity is exactly `0` at page load and animates to `1` once scrolled into view, on both breakpoints; the settled composition (paragraph top-left, generous empty space, "Explore More ↓" bottom-left) visually matches the provided reference closely on both desktop and mobile.
- Full overflow sweep across all 7 pages, both breakpoints, comes back 0px. `npx tsc --noEmit` clean. `npx eslint` is now fully clean — the one pre-existing, unrelated error flagged in every prior checkpoint this session (`HeroSection.tsx`'s `setState`-in-effect for `isMobileViewport`) no longer exists because that exact state/effect was removed as part of this rewrite (it existed only to gate the old typewriter's mobile-only fade, which this replaces).

## State at this checkpoint

- **Deleted** `src/components/hero/TypewriterHeadline.tsx`.
- **Rewrote** `src/components/hero/HeroSection.tsx`: removed `PHRASES`, the typewriter import, `shiftPx`/`measureRefs` centering logic, `headlineArrived`/`isMobileViewport` state, and `HEADLINE_OPACITY_RANGE`. Added a static `INTRO_TEXT` paragraph and an "Explore More" button with a Lenis-aware scroll-one-viewport-down handler, rendered inside the same sticky+pin-wrapper structure the old headline used (renamed `HEADLINE_HOLD` → `INTRO_HOLD`, same 350px value, unrelated to the separate pull-up fix below). Collage block (first screen) is unchanged.
- **Modified** `src/components/projects/ProjectsSection.tsx`: pull-up value changed from `-mt-[350px]` to `-mt-[100px]`, re-derived empirically against the new, taller intro block's geometry (see resistance notes above).

## Remaining work

- None currently flagged. The `-mt-[100px]` value is a reasonable empirical fit for the current text length/sizing — if the intro paragraph's length or font size changes meaningfully in the future, this may need re-tuning the same way (check Explore More's visibility window via Puppeteer, don't just eyeball one screenshot).

## Follow-up — smaller text, wider column, vertical centering

Same-day refinement after seeing the first version live.

### Human directions

- "can you make the text a bit smaller and the text box width more longer. Also here it feels like the text should be centered and the explore more more towards the bottom"
- Asked whether "centered" meant per-line text-align or the whole block centered horizontally — clarified: "by centered i meant on a vertical axis but the text should still be left aligned."

### Records of resistance

- Didn't guess at the ambiguous "centered" — asked directly, since horizontal-block-centering vs. per-line text-align vs. vertical-centering would each have meant a materially different layout change, and this component already has enough interdependent scroll-timing constraints that guessing wrong would mean re-doing the empirical re-tuning pass twice.
- Restructured the flex layout so the paragraph vertically centers within the space *not* consumed by the button (a `flex-1 items-center` wrapper around just the `<p>`, button as a separate sibling after it) rather than centering paragraph-and-button as one group — the latter would have pulled the button up away from the bottom instead of leaving it there, which contradicts "explore more more towards the bottom" landing in the same message.
- Re-ran the exact same Explore-More-visibility-window check from the original pass after this layout change (not just the overflow sweep) since the block's total rendered height shifted slightly with the new font size/width — confirmed the existing `-mt-[100px]` ProjectsSection tuning still holds (real visibility window on both breakpoints, same as before).
- Turbopack's dev server crashed with an internal panic mid-verification (`restoring failed` / `an internal panic occurred outside the per-task panic boundary` — a Turbopack bug, not a code issue). Recognized it as a tooling crash rather than something my change caused, cleared `.next` and restarted rather than debugging application code for it.

### State at this checkpoint

- **Modified** `src/components/hero/HeroSection.tsx`: paragraph font size reduced (`clamp(1.75rem, 3.2vw, 3rem)` → `clamp(1.5rem, 2.6vw, 2.5rem)`), max-width widened (`900px` → `1200px`), and the paragraph is now wrapped in its own `flex flex-1 items-center` container so it vertically centers within the block while the "Explore More" button remains a separate sibling anchored after it (pushed toward the bottom by the paragraph wrapper's `flex-1` consuming the remaining space). Text itself stays left-aligned (no `text-align` change).

### Verification

- Measured (not eyeballed): paragraph's vertical center (412px) now sits within 12px of the block's own vertical center (424px) — effectively centered.
- Re-verified the Explore-More-visibility window on both breakpoints holds with the new layout (uncovered through 1.0–1.3× viewport on desktop, 0.78–1.0× on mobile — same order of magnitude as the original pass).
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up 2 — push "Explore More" further toward the bottom (first attempt, corrected below)

Same-day, after seeing the vertically-centered version live.

### Human directions

- "the text size is better but can you still make the 'Explore More' more towards the bottom of the screen" (with a screenshot showing the button sitting well above the section's actual bottom edge)

### Records of resistance

- Increased the block's `min-h` (70vh/80vh → 85vh/92vh) rather than adding more bottom padding or restructuring the flex layout — since the paragraph already vertically centers within a `flex-1` sibling ahead of the button, growing the block's overall height directly grows that `flex-1` space, which pushes the button down while leaving the centering logic from the prior pass untouched.
- Re-checked the Explore-More-visibility-window against `ProjectsSection`'s pull-up for the third time this feature (same check as both prior passes) rather than assuming a taller block was risk-free — it wasn't free in the *first* iteration of this feature (100vh caused near-instant covering), so growing the block again warranted the same verification, not an assumption that the earlier `-mt-[100px]` fix would automatically keep working at any height. It did hold this time: covering still starts at roughly the same scroll multiplier as before (1.4× viewport on desktop, 1.1× on mobile — negligibly different from the pre-this-change values), so no further change to `ProjectsSection` was needed.
- Turbopack's dev server crashed again mid-session with the same internal panic seen in the prior follow-up (unrelated to this code) — cleared `.next` and restarted rather than treating it as an application bug.

### State at this checkpoint

- **Modified** `src/components/hero/HeroSection.tsx`: intro block's `min-h` increased from `70vh`/`80vh` to `85vh`/`92vh` (mobile/desktop).

### Verification

- Measured button distance from the viewport's bottom edge: desktop went from 212px to 104px, mobile similarly closer — a real, verified reduction, not just a visual impression from one screenshot.
- Re-verified the sweep-visibility window on both breakpoints still holds at the new height.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up 4 — the real Projects-sweep bug, and push Explore More down correctly

Same-day. Two asks together: push "Explore More" down further (only it, paragraph unaffected — already solved by follow-up 3's structure), and investigate a report that the Projects scroll-cover transition "doesn't seem to scroll on top all the way or looks odd."

### Human directions

- "can you make the 'Explore More' a little bit more down; remember only change the 'Explore More'. Also can you recheck the animation for when the selected project section should scroll on top; it doesn't seem to scroll on top all the way or looks odd i think"

### Records of resistance — this is the important one

- The "looks odd" report turned out to be a real, serious regression from follow-up 1/2's `-mt-[100px]` value — not a vague feeling to shrug off. Root-caused it properly instead of re-guessing at pull values a third time: measured the *actual* sticky element's `getBoundingClientRect().top` across the full scroll range (not just checking whether Explore More eventually gets covered, which was the *only* thing prior passes checked). That revealed the pin only keeps the block genuinely stuck (`top: 64px`, unchanging) for a **350px window** (exactly `INTRO_HOLD`) — much shorter than the ~1178px "pin wrapper height" I'd been treating as the relevant range in every prior verification this feature. Every previous "sweep visibility" check in this whole feature (follow-ups 1 and 2) had been sampling scroll positions mostly *after* the real stuck window already ended, so they never actually tested what happens *during* the genuine pin.
- With the real 350px window identified, checked what Projects' position actually was at the *exact* moment the sticky released (`scrollY≈1187`) — found it at `projectsTop≈792`, meaning Projects had barely begun entering the viewport by the time Hero unstuck. Once unstuck, both move at the same 1:1 rate forever after, so whatever partial (near-zero) overlap existed at that instant becomes the *permanent* relative position for all further scrolling — the exact "frozen partial overlap" bug this whole pin mechanism exists to prevent, just reintroduced by an under-sized pull value rather than a missing pin. This is almost certainly what read as "doesn't scroll on top all the way": the dramatic sweep essentially didn't happen at all — Hi Tina just scrolled away normally and Projects arrived after, functionally no different from having no pin/sweep effect whatsoever.
- Derived the correct pull mathematically instead of guessing again: since Projects always moves at a fixed 1:1 rate regardless of pull (pull only shifts its *starting* document position, not its rate), and the stuck window is a fixed 350px, hitting `projectsTop ≈ 64` (full coverage) by release requires Projects to already be most of the way to the top *before* the stuck window even begins. Solved algebraically from one measured data point (`projectsTop=799` at `pull=-100`, needed `≈64`) rather than iterating blindly: required pull ≈ `-830px`. Verified this against the existing safety ceiling (`ProjectsSection`'s own ~962px natural content height, per its original comment) before using it — 830 < 962, confirmed safe.
- Verified the fix the same way the bug was found: swept `stickyTop` and `projectsTop` together across the entire real stuck window on both breakpoints and confirmed smooth, monotonic, linear convergence to near-zero right around the actual unstick point (desktop: 49 vs 51 at the transition; mobile: converges slightly before unstick, both fine) — not just "does it eventually cover," but "does it finish covering by the moment it matters."
- Handled the two asks as related but separable: bumped the block's overall `min-h` again (85/92vh → 90/97vh) to push the button down, confirmed via the same fixed-zone structure from follow-up 3 that the paragraph's center stayed byte-for-byte unchanged (425.5, exact match) while only the button moved (104px → 59px from the bottom edge).

### State at this checkpoint

- **Modified** `src/components/projects/ProjectsSection.tsx`: pull-up value corrected from `-mt-[100px]` to `-mt-[830px]` — the actually-correct value for this feature's geometry, derived from measuring the real stuck-duration window rather than the wrong range used in follow-ups 1–2.
- **Modified** `src/components/hero/HeroSection.tsx`: intro block's `min-h` increased again (`85vh`/`92vh` → `90vh`/`97vh`) to push "Explore More" further down; paragraph's fixed centering zone (from follow-up 3) is untouched and confirmed unaffected.

### Verification

- Swept `stickyTop`/`projectsTop` together across the real ~350px stuck window on both breakpoints — smooth, monotonic, complete convergence by the unstick point, no freeze, no jump.
- Confirmed no bleed-through into whatever follows Projects (`Trusted By` still renders on a white background at its expected position).
- Paragraph center unchanged (425.5, exact match to follow-up 3's baseline); button moved from 104px to 59px from the bottom edge.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

### Remaining work (resolved in follow-up 5 below)

- Verifying "does Explore More eventually get covered" is not the same check as "does the sweep actually complete by the moment the pin releases" — the second one is the check that actually matters, and it requires measuring the sticky element's own real stuck duration first (via `getBoundingClientRect()` across a scroll sweep), not assuming it matches the pin wrapper's total height.

## Follow-up 5 — the -830px pull fixed completion but broke the reveal itself

Same-day, immediately after follow-up 4 shipped. User sent a screen recording.

### Human directions

- "umm now it's just cut off?" (with a screen recording)

### Records of resistance

- Follow-up 4's fix was correct about *what* needed to happen (sweep must complete by release) but wrong about *how cheaply* that could be bought — jamming the entire ~830px of required travel into the existing, unchanged 350px `INTRO_HOLD` window meant Projects had to already be substantially covering the screen from the very first instant the block became stuck, rather than starting the reveal from "not visible yet." Should have re-examined the *whole* transition arc (start-of-window to end-of-window), not just confirmed completion at the end — completion-by-release and "doesn't cut off the opening moment" are two separate properties, and follow-up 4 only checked the first one.
- Couldn't watch the `.mov` directly (binary) and no `ffmpeg` on this machine — extracted actual frames instead of guessing from the description, using `avconvert --start T --duration 0.05` to cut ultra-short clips at several timestamps, then `qlmanage -t` to thumbnail each. This is what actually confirmed "cut off" meant literal mid-sentence text truncation ("...I love exploring ideas, solving[cut]") with a large wasted blank dark gap above it — not a vaguer complaint that would have been easy to mis-diagnose from just re-reading the words.
- Derived the real fix from first principles instead of nudging numbers again: for a clean reveal, Projects' top position needs to equal the viewport height (i.e., just barely off-screen, invisible) at the *exact* scrollY where the block first becomes stuck, and needs to reach ~64px (matching `NAV_HEIGHT`, i.e., fully covering) by the exact scrollY where it unsticks. Since Projects always moves 1:1 with scroll, the *only* free variable that makes both ends of that arc land correctly is the stuck-duration itself (`INTRO_HOLD`) needing to equal `viewport_height - 64` (≈836px), with the pull then solved algebraically from one live measurement to place the *start* of the arc exactly at the visible/invisible boundary. Landed on `INTRO_HOLD = 850` and `pull = -824px` — notably, this pull value is close in magnitude to follow-up 4's `-830px`, which was initially confusing (more hold was supposed to mean less pull needed) until working through why: growing `INTRO_HOLD` also pushes Projects' own natural (pre-pull) document position down by the same amount, so the two effects largely cancel on the *pull magnitude* — the real benefit of the bigger hold is entirely in *when* the sweep starts becoming visible (exactly at window-start, not hundreds of pixels in), not in needing a smaller pull.
- Verified by re-extracting the actual visual sequence via Puppeteer screenshots at several scroll depths across the new, longer window — confirmed the paragraph stays fully intact and readable through the middle of the transition (not just checked numerically), and that full coverage is reached right around the true unstick point, on both breakpoints.

### State at this checkpoint

- **Modified** `src/components/hero/HeroSection.tsx`: `INTRO_HOLD` increased from `350` to `850`.
- **Modified** `src/components/projects/ProjectsSection.tsx`: pull-up value changed from `-mt-[830px]` to `-mt-[824px]` (a small change in isolation, but only correct in combination with the `INTRO_HOLD` change above — the two values are coupled, not independent).

### Verification

- Swept `stickyTop`/`projectsTop` together across the full new window on both breakpoints: Projects sits at `900` (desktop) / `845` (mobile) — i.e., invisible, right at the bottom edge — at the exact scrollY the block first becomes stuck, then decreases linearly and smoothly to full coverage by the unstick point. No early cutoff, no incomplete sweep.
- Re-confirmed via actual screenshots (not just coordinates) at multiple points through the transition that the paragraph text renders fully intact and readable throughout, only being covered gradually as intended.
- Paragraph center (425.5) and button distance-from-bottom (59px) both unchanged from follow-up 4 — confirms this fix didn't disturb the separately-tuned vertical layout.
- Confirmed no bleed-through into whatever follows Projects (`Trusted By` still on white background).
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

Same-day, immediately after follow-up 2 shipped to the dev server.

### Human directions

- "i didn't want you to move the 'Hi, I'm Tina...' text down just the 'Explore More'"

### Records of resistance

- Follow-up 2's fix (growing the whole block's `min-h` so the button had more room to sit lower) had an unintended side effect I didn't check for at the time: since the paragraph centers via `flex-1 items-center` spanning the *entire* block, growing the block also grew that centering zone, which shifted the paragraph's own center down by ~54px (measured: 412px → 466px) as a side effect — not something called out at the time because I was only checking the button's position and the sweep-timing regression, not whether the paragraph itself had silently moved too.
- Fixed by giving the paragraph its own fixed-height zone (not `flex-1`, so it no longer inherits the block's overall height) sized to reproduce the *original* pre-follow-2 centering — derived from the original math (old `min-h` minus its own vertical padding, expressed back as a vh fraction: desktop `59vh`, mobile `55vh`) rather than guessing — then re-measured until the paragraph's center landed within ~13px of its original 412px value (425.5px), which reads as visually identical. A separate `flex-1` spacer between that fixed zone and the button absorbs *only* the leftover height from follow-up 2's larger `min-h`, so the button still gets the same lower position follow-up 2 achieved, without dragging the paragraph along with it this time.
- Re-verified the button's distance-from-bottom hadn't regressed back toward its pre-follow-2 value while fixing the paragraph (confirmed still 104px desktop / 126.6px mobile, unchanged from follow-up 2) — this was a real risk since both the paragraph and button positions are now derived from the same block height, and a wrong fix could easily have "solved" the paragraph regression by quietly undoing the button improvement instead.

### State at this checkpoint

- **Modified** `src/components/hero/HeroSection.tsx`: paragraph wrapper changed from `flex-1 items-center` (spanning the whole block) to a fixed `h-[55vh] items-center lg:h-[59vh]` zone; added a new `flex-1` spacer div between that zone and the button to absorb the block's extra height instead.

### Verification

- Paragraph center position: 425.5px (desktop) / matches original visually on mobile — both within a few pixels of the pre-follow-2 baseline, confirmed via `getBoundingClientRect()`, not eyeballing.
- Button distance from bottom: unchanged from follow-up 2 (104px desktop, 126.6px mobile) — confirms the button improvement survived this fix intact.
- Re-checked the sweep-visibility window on both breakpoints — unchanged from follow-up 2, as expected since the block's total height wasn't touched, only the internal distribution of that height.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up 6 — replay the fade-in on every scroll, not just the first

Same-day.

### Human directions

- "can you make sure the fade in appears with any scroll not just the first"

### State at this checkpoint

- **Modified** `src/components/hero/HeroSection.tsx`: `viewport={{ once: true, amount: 0.4 }}` -> `viewport={{ once: false, amount: 0.4 }}` -- matches `AboutSection`'s own mission-quote fade, which already used `once: false` for the same "re-emphasize every time it's scrolled to" behavior.

### Verification

- Confirmed via Puppeteer, not just changing the prop and assuming: scrolled the paragraph into view (opacity went to 1), scrolled far past it so it left the viewport (opacity reverted toward 0), scrolled back to the very top (opacity settled at 0), then scrolled back into view a second time and confirmed it faded back in to 1 -- the full replay cycle actually works, not just a one-way trigger.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up 7 -- add a brief pause before the sweep begins

Same-day. Asked my opinion first ("do you think the pin hold duration a bit more") -- recommended a modest increase (150-250px) to add a calm beat before the sweep starts, rather than a large one that would just add dead scrolling after full coverage. User confirmed: "yes try that."

### Records of resistance

- First attempt increased `INTRO_HOLD` by 200px and naively reduced `ProjectsSection`'s pull by the same 200px, expecting a clean 200px pause. Measured the actual result and got a 400px pause instead -- double what was intended. Root cause: increasing `INTRO_HOLD` also pushes `ProjectsSection`'s own natural (pre-pull) document position down by the same amount, since it sits directly after the now-taller pin wrapper in document flow. My pull adjustment and the hold's own side effect both moved the pause in the same direction, stacking instead of the pull change being the *only* lever. Corrected by accounting for both effects together (net adjustment needed was ~14px against the original pull, not a full 200px) instead of just re-deriving the same wrong assumption again.
- Verified the corrected value the same rigorous way as prior passes: swept `stickyTop`/`projectsTop` across the real window on both breakpoints (not just the desktop check), and screenshotted the paused state directly to confirm zero white sliver is visible during the pause -- not just that the numbers looked plausible.

### State at this checkpoint

- **Modified** `src/components/hero/HeroSection.tsx`: `INTRO_HOLD` increased from `850` to `1050`.
- **Modified** `src/components/projects/ProjectsSection.tsx`: pull-up value changed from `-mt-[824px]` to `-mt-[838px]` -- a small, precisely-derived adjustment (not the larger, wrong `-mt-[624px]` from the first attempt), accounting for `INTRO_HOLD`'s indirect effect on this section's own natural position.

### Verification

- Confirmed a ~186-187px pause (consistent across both breakpoints) where the block sits fully settled and visible with zero trace of Projects' white section, before the sweep begins and completes smoothly by release.
- Screenshotted the paused state directly -- clean, no white sliver at the bottom edge.
- Paragraph center (425.5) and button distance-from-bottom (59px) both unchanged.
- Confirmed no bleed-through into whatever follows Projects.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.
