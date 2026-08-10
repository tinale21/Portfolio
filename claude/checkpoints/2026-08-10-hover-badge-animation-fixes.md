# Checkpoint — Hover badge animation fixes (stretch, inconsistency, overflow)

## Context

Three rounds of bug reports against the hover-to-description badge feature added earlier this session, each caught on a screen recording rather than described in words. All three turned out to be real, measurable defects in how the pill's width animation interacted with its text children — not one-off visual noise.

## Human directions

- "when i hover in and then hover out, there is a split second where you see text stretch out: [video] is there a way to fix that"
- "they seem to all have different animinations?" — a much vaguer report than the first two, no video this time.
- "i feel like the text for Wayve comes out faster than its bubble, can you check me on that" — explicitly asked to be checked/verified, not just fixed on faith.
- "let's build and push".

## Records of resistance / things I got wrong and had to correct

- **First fix (stretch on hover-out) was correct but incomplete**: adding `layout` to the text spans (so Framer Motion could apply its scale-correction to them during the parent's width resize) fixed the visible stretch, verified frame-by-frame — but it silently introduced the SECOND bug, because those spans still carried their own flat `transition={{ duration: 0.28, ... }}`, which now also governed their own layout animation and clashed with the parent pill's spring. Didn't catch this myself; the user did, from a vague "they feel different" report with no video.
- **Diagnosing "they feel different" required actual measurement, not a guess-and-tweak cycle**: read back through the component and recognized the transition-object reuse was the likely culprit (one `transition` prop was being asked to govern layout, opacity, AND y simultaneously, for both parent and children, with different intents). Fixed by splitting into per-property transitions (`{ layout: SPRING, opacity: FADE, y: FADE }`) and extracting the shared constants into `badge-transition.ts` so `ProjectCard` and `NdaProjectCard` can't drift.
- **Third bug required real numeric proof before touching code**: rather than assuming the user's "text comes out faster" impression was right or guessing at a timing tweak, measured pill-width vs. text-opacity vs. text-overflow-past-pill-edge over time via Puppeteer. Confirmed precisely: at 80ms into the transition, text opacity was already ~77% while the pill was only ~53% grown, with text visibly spilling up to 105px past the pill's white background (which had no `overflow-hidden`) onto the card's video/image behind it. This was a genuine, previously-unnoticed defect, not a subjective timing complaint.
- **Puppeteer hover-simulation reliability was itself a minor obstacle**: several early measurement attempts using manual `page.mouse.move()` sequences produced flat, unchanging widths (hover state silently never triggering, or capturing the wrong transition direction) before switching to Puppeteer's built-in `page.hover(selector)` helper, which reliably dispatched the events needed for React's `onMouseEnter` to fire.

## Successes

- Every fix in this session was verified with real before/after measurement (rendered screenshots for the stretch fix, Puppeteer-measured width/opacity/overflow numbers for the spillage fix) rather than "I changed the code, it should be fixed now."
- Treated a vague, video-free report ("they seem to all have different animations") with the same rigor as the video-backed ones — read the code for the actual mechanism (the transition-object reuse) rather than asking the user for more detail or guessing at a generic smoothing tweak.
- Kept the fix centralized (`badge-transition.ts`) once a second component started sharing the same animation values, rather than patching both `ProjectCard.tsx` and `NdaProjectCard.tsx` independently a third time.

## State at this checkpoint

- **New file**: `src/components/projects/badge-transition.ts` — exports `BADGE_LAYOUT_TRANSITION` (`{ type: "spring", stiffness: 500, damping: 40 }`) and `BADGE_FADE_TRANSITION` (`{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }`), imported by both card components.
- **`ProjectCard.tsx` / `NdaProjectCard.tsx`**: the hover-swap pill now has `overflow-hidden` (text can no longer visibly spill past the pill's white background while it's still growing/shrinking); both text spans inside `AnimatePresence` use `layout` with an explicit per-property `transition` object (`layout` → spring, `opacity`/`y` → fade) instead of a single flat transition; the parent pill's own `layout` transition is also expressed as `{ layout: BADGE_LAYOUT_TRANSITION }` for symmetry.
- Build passes clean, no TypeScript errors.
