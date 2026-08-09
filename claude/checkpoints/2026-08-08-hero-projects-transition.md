# Checkpoint — Hero → Projects "scrolls behind" transition

## Context

Extending the Connect → Experiences "next section scrolls in front of the previous one" effect to Hero → Selected Projects. Turned out to require real structural changes to Hero, not just a pull-amount tweak, and surfaced two genuine bugs along the way.

## Human directions

- "can you make the same transition you did for the Let's Connect section to the experience section... for the hero section to selected project section."
- "i didn't want you to cut the frame. the transition is also not working" — the first attempt (a plain negative-margin pull, mirroring Experiences' *initial* broken approach) produced a hard, static-looking slice through the headline text.
- Given a choice between reverting, building a real pin-based transition, or a simpler fade effect, picked **build a real pin-based transition**.
- "the transition is working; however, there seems to be a lot of extra space here" (screenshot showing a large empty dark rectangle below the pinned, fully-typed headline).
- "add a little more space" (after the dead-space fix had swung a bit too tight).
- "let's build and push".

## Records of resistance / things I got wrong and had to correct

- **First attempt, wrong mental model carried over**: implemented the Hero→Projects overlap the same way as Connect→Experiences' *first* (broken) attempt — a fixed negative margin on Projects, assuming pull alone would produce a cover effect. Diagnosed via direct Puppeteer measurement (not screenshots) that the overlap was frozen at exactly 26% no matter how far past it you scrolled — since neither Hero's headline nor Projects' rising edge was pinned, both moved at the identical 1:1 scroll rate, so whatever partial overlap first occurred could never change. This is structurally different from Connect (whose heading actually is pinned) and needed the same fix Connect eventually got, not a pull-amount retune.
- **Reused a completely wrong-scale constant**: before diagnosing the frozen-overlap bug, first tried PULL=450px (reused directly from Experiences) without recomputing for Hero's much smaller page-position numbers — this made the white section start peeking in at scrollY=0, before the user had scrolled at all. Caught via direct position-tracing, not visual inspection.
- **Retrofitting the pin surfaced a second, unrelated real bug**: wrapping the headline in a `position: sticky` structure did nothing at all at first — measured `h1.top` decreasing continuously and linearly with scroll, never sticking. Root cause: the outer Hero `<section>` had `overflow-hidden` (needed to clip the collage during its tilt/translate animation), and *any* ancestor with a non-visible overflow between a sticky element and its containing block disables sticky positioning entirely — a well-known but easy-to-forget CSS interaction. Fixed by moving `overflow-hidden` down to only wrap the collage's own container, leaving the section (and therefore the now-sticky headline below it) unaffected.
- **Dead-space tuning, iterated with real measurements each time**: 700px of hold left ~500px of plain dark dead space before the cover started rising (matching the user's screenshot exactly). Tried 150px — overcorrected, covering was already 37% underway the instant the headline finished sticking, no beat to read it at all. Landed on 250px (~100px of dead time measured), then bumped to 350px per direct feedback that it could use a little more room.

## Successes

- Every single claim in this thread — "is the overlap frozen or progressing", "is sticky actually engaging", "how much dead time is there", "is there bleed-through into Philosophy" — was settled via direct Puppeteer position/computed-style measurement, never by eyeballing a screenshot and guessing. This is what caught both real bugs (frozen overlap, broken sticky) that would have been very easy to misdiagniose as "needs more pull" if only judged by screenshots.
- Recognized quickly, once asked to choose an approach, that the frozen-overlap problem couldn't be fixed by retuning pull/hold values at all — it needed the same architectural fix (pinning) Connect already has, and said so plainly with the measured evidence (26% fixed overlap) rather than continuing to tweak numbers on a broken foundation.

## State at this checkpoint

- **HeroSection**: `overflow-hidden` moved from the outer `<section>` to just the collage's own wrapper div. The headline is now wrapped in a pin structure (outer div sized to `stickyHeight + HEADLINE_HOLD`, sticky child at `top: NAV_HEIGHT`) so it holds at a fixed screen position (measured at `top: 66px`) for `HEADLINE_HOLD` (350px) of extra scroll before releasing normally. All of the headline's own internal padding/spacing (carefully tuned in earlier sessions) is untouched — it's wrapped, not restructured internally.
- **ProjectsSection**: pulled up via `-mt-[350px]` (derived from `stickyHeight (352) − headlineY (66) + buffer`), verified via Puppeteer to progressively cover the pinned headline (0% → 37% → 74% → 100%, not frozen) with no bleed-through into PhilosophySection afterward.
