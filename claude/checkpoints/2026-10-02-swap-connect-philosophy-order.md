# Checkpoint — Swap Connect and Philosophy section order (home)

## Context

Swaps the order of the "Let's Connect!" (ConnectSection) and the "Design is not just what we make, but how thoughtfully we make it." (PhilosophySection) sections on the home page.

## Human directions

- "can you switch the let's connect section and the 'design is not...' section"

## Records of resistance / things I got wrong and had to correct

- Both are pinned-scroll sections, so I checked for coupling before swapping. Confirmed each is self-contained: PhilosophySection (`data-nav-theme="light"`, `bg-white`) and ConnectSection (`data-nav-theme="dark"`, `bg-[#262626]`) each measure their own wrapper/viewport and don't depend on their siblings. (ConnectSection's leftover `hold` from the earlier Experiences move is also self-contained.) So a plain reorder in `page.tsx` is safe.
- New section boundaries are all clean light/dark transitions: Projects (white) → Connect (dark) → Philosophy (white) → Footer (dark).

## State at this checkpoint

- **Modified** `src/app/page.tsx`: swapped `<PhilosophySection />` and `<ConnectSection />`. Home is now Hero → Projects → Connect → Philosophy.

## Verification

- Puppeteer confirmed DOM order: Connect wrapper (docTop 2961) now precedes Philosophy wrapper (docTop 5633).
- Screenshots: both pinned sections render and animate correctly in their new spots (Connect's polaroids + "Let's Connect!"; Philosophy's scattered project screenshots + quote).
- Overflow sweep (scrolling) at 390/768/1512: 0px.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.

## Follow-up — restore the sweep-over-Connect effect on Philosophy

### Human feedback

- "theres a large space in the bottom of the let's connect. it should still have that pull effect where the 'design is not...' section goes above the let's connect"

### What was happening

- The "large space" was Connect's `hold` region (extra pinned scroll at the end of Connect). That `hold` only exists to give the *following* section room to sweep up over Connect's pinned heading. When ExperiencesSection (which owned that sweep via a negative margin-top `pull`) was moved to the About page, nothing was left to do the sweeping — so the `hold` showed as empty dark space.

### Fix

- **Modified** `src/components/philosophy/PhilosophySection.tsx`: PhilosophySection now follows Connect, so it inherits the sweep. Added the same `getConnectExitTiming().pull`-derived negative `marginTop` to its desktop wrapper (the `hidden lg:block bg-white` div) that ExperiencesSection used to carry. Its white wrapper now pulls up to overlap Connect's tail and rises over the pinned "Let's Connect!" heading, consuming the dark gap.
- Why it's safe on a self-pinned section: during the sweep the wrapper's top is still below the viewport top, so its own `sticky top-0` child hasn't engaged — it rises as a plain opaque white block (exactly how the static Experiences section did), then pins and runs its image-spread once fully in view. Its progress is computed from the live `wrapperTop`, which already accounts for the margin, so the internal animation timing self-corrects and is unaffected. The pull (≤~550px) is far under the wrapper's own `100vh + 1200px` height, so no overshoot.

### Verification

- Scroll sequence through the hold region: "Let's Connect!" stays pinned on dark while the white Philosophy section rises from the bottom up over it — the dark gap is gone.
- Philosophy's own pinned animation (images spread + "Design is not just what we make..." quote) still renders correctly after the pull.
- Overflow 0px at 390/768/1512; `tsc`/`eslint`/`build` clean.

## Follow-up — make the sweep go ALL THE WAY (full cover) + fix mobile

### Human feedback

- "can you make sure it goes all the way" (screenshot showed the white stopping partway, leaving a dark band with the heading at the top that lingered as Connect scrolled away).

### Root cause

- The old `getConnectExitTiming` was tuned so the rising white reached only the heading's CENTER (viewportHeight/2) by Connect's release. The reveal needs a full viewportHeight of travel to go bottom→top, but Connect's `hold` only provided ~490px of pinned scroll — so the top half of the cover necessarily completed AFTER release, showing a shrinking dark band for ~430px of post-release scroll.
- Also surfaced a mobile gap: `ConnectMobileSection` uses the same `hold`, but `PhilosophyMobileSection` had no `pull` (Experiences had been the mobile cover too), so mobile Connect had an uncovered dark `hold`.

### Fix

- **Reworked `getConnectExitTiming`** (`connect-data.ts`): `pull = stickyHeight + COVER_MARGIN` (the exact overlap for the white top to reach the very top of the viewport right before release — derived: philTop = releaseScroll + stickyHeight − pull, so pull = stickyHeight lands the cover at y=0 at release) and `hold = viewportHeight + REVEAL_MARGIN` (a full viewport of pinned scroll so the entire reveal completes WHILE pinned, starting a beat after the photos exit). Both are breakpoint-aware, so desktop and mobile each get correct values. Replaced the old `PULL_MARGIN`/center-reach model.
- **Added the matching pull to `PhilosophyMobileSection`** so mobile also sweeps over `ConnectMobileSection` (restoring what the moved Experiences section used to do on mobile).

### Verification

- Desktop: y=120 (just under the nav) turns light ~80px BEFORE Connect releases, and the pre-release screenshot shows the white fully covering the dark (no band) — it goes all the way. Mid-sweep frame shows the white rising over the still-pinned heading.
- Philosophy's own image-spread + quote animation still correct with the larger pull.
- Mobile: PhilosophyMobile now sweeps up over ConnectMobile (y=140 light near release) — no dark gap.
- Overflow 0px at 390/768/1512; `tsc`/`eslint`/`build` clean.

## Remaining work

- None. (Connect is ~470px taller now on account of the full-viewport `hold`, but that scroll is the active sweep, not dead space.)
