# Checkpoint — Philosophy/card-deck section, logo marquee bug fix, and polish round

## Context

Fourth Home page section: a scroll-pinned "card deck" reveal where 8 project screenshots start stacked into one pile over a hidden quote, then spread apart to their exact Figma positions as the user scrolls, uncovering the quote. Also fixed a real coverage bug in the client-logos marquee (discovered while investigating a "weird gap" report), and did a round of cross-section spacing/scale polish per direct feedback.

## Human directions

- Described the card-deck animation in prose first, then provided a motion reference video and confirmed via direct site inspection that this animation is genuinely `position: sticky`-pinned (unlike the Hero collage, which explicitly is not).
- Explicit workflow for the assets: exported images are the *final* state only (already at their exact Figma size/position); the clustered starting look must be built entirely from temporary CSS `translate`/`scale` on top of that final layout, never by resizing the source assets. Corner radius via CSS, not baked into the PNGs.
- Iterated on the starting cluster multiple rounds: "stacked one behind the other like a deck of cards, none peeking out" (led to removing all per-image scatter offsets — every card now shares one exact center point), then "images aren't the same size" (led to switching from a single aspect-preserving `scale` to independent `scaleX`/`scaleY` targeting one fixed card size).
- Typography on the quote: hanging punctuation on both quote marks, first line reading longer than second, then explicitly "only two lines" (not three).
- Went back to the client-logos section and asked to scale it down twice (0.8, then 0.65×), which is what surfaced the real bug (see below).
- Also asked to reduce spacing between Projects/Logos/Philosophy sections, then to reverse a section-width change that made the card-deck frame "too small... doesn't fit my desktop view correctly" — caught within the same round and reverted before it shipped.
- Went back to the Hero collage once more and asked for a modest size increase (84% → 88%).
- Final round: quote felt too small after narrowing it to fit 2 lines — asked to grow the card size instead of shrinking the font further, then specifically asked for the width/height increase to be by the *same amount* (caught and corrected an initial mismatched +8.7%/+9.7% bump to a clean, single 10% scale factor applied to both).

## Records of resistance / things I got wrong and had to correct

- **A real, measurable bug in the logos marquee, not a perception issue this time.** After scaling the marquee down (twice), the user reported "a weird gap between Ziora Copilot and AIG... I don't think it's continuously looping." My first verification attempt (pausing the CSS animation and scrubbing via a negative `animation-delay`) produced physically inconsistent transform values and was itself unreliable — caught this by cross-checking against the Web Animations API's `currentTime`, which gave clean, math-consistent numbers. That in turn revealed the actual bug: shrinking the logos (`LOGO_SCALE`) shrank the marquee's repeating "copy width" below the fixed visible viewport width, so the 2 rendered copies no longer provided continuous coverage through a full scroll cycle — there was a genuine ~465px blank gap near the end of each loop. Fixed by rendering enough copies (8) to guarantee coverage regardless of scale or viewport width, rather than hand-tuning the copy count to the current numbers.
- **Overcorrected the Philosophy section's width in the same conversation it was introduced.** Capping the composition at `max-w-[1100px]` to reduce perceived "empty frame" whitespace between sections shrank the whole thing (including final image positions) below what matched the other full-width sections. Reverted it in the same turn once the user flagged it, keeping only the parts of that fix that were genuinely correct (removing an unnecessary forced-100vh sticky container).
- **First 2-line quote split silently rendered as 3 lines.** Merging "but" onto line 1 made that line too wide for the box, so it auto-wrapped again — caught before reporting success by checking the paragraph's rendered height programmatically (still 122px, unchanged from the 3-line version) rather than trusting that specifying 2 array entries would produce 2 visual lines.
- **First width/height bump wasn't actually uniform** (500/460=+8.7% width, 340/310=+9.7% height) despite looking like a deliberate matched pair — user caught this by directly asking for the exact numbers, which prompted rederiving both from one shared scale constant instead of two independently-eyeballed values.

## Successes

- Verified the "no perceptible jump" claim for the marquee twice with two different techniques, and explicitly distrusted the first (delay-scrubbing) once its output didn't match hand-computed expectations, rather than reporting a false "confirmed working" based on a flawed check.
- Kept the Philosophy section's positioning system (percentage-of-Figma-reference for layout, JS-measured `pxScale` only for the animated translate distances) unchanged through several rounds of size/scale tweaks — every adjustment this round was a constant change (card size, quote width, font clamp), never touching the underlying per-image position math, so the Figma-matched final layout never had to be re-verified from scratch each time.
- Caught the 3-line quote regression and the non-uniform scale-up before reporting either as done, by measuring rendered output (span positions, paragraph height) instead of asserting the change would obviously work.

## State at this checkpoint

- `PhilosophySection` is feature-complete: pinned scroll-reveal, 8 images at exact Figma positions/sizes, uniform uncluster-to-cluster animation, hanging-quote 2-line quote text, all verified against the starting-state coverage requirement.
- Client logos marquee: `REPEAT_COUNT = 8` is now the safety margin against future scale/viewport changes reintroducing the coverage bug; `LOGO_SCALE = 0.65`, with AIG's two adjacent gaps tightened (`TIGHT_GAP = 70` vs `NORMAL_GAP = 116`) for optical spacing.
- Hero collage back up to 88% scale (from 84%).
- Cross-section vertical padding tightened on Projects and Logos sections.
- No further Home page sections requested yet.
