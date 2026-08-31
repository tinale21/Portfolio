# Checkpoint — Scroll-reveal for Experiences, Education, and My Toolbox

## Context

Adds a fade-up-on-scroll reveal to the individual rows in the Experiences and Education lists, and to each icon in the My Toolbox row, so content animates in as the user scrolls to it instead of just being static.

## Human directions

- "ok now for the experiences, education, and my toolbox section can you make it appear as users scroll. kind of similar to this: [screen recording, /Users/tinale/Desktop/Screen Recording 2026-08-30 at 10.02.09 PM.mov]"

## Records of resistance / things I got wrong and had to correct

- Couldn't play the reference `.mov` directly, and `ffmpeg`/`ffprobe` aren't installed on this machine. Reused this session's earlier workaround: `avconvert --start T --duration 0.05` to cut ten ~50ms micro-clips spaced across the video's ~3s length, then `qlmanage -t` to thumbnail each into a viewable PNG, rather than guessing at the effect from the user's one-line description.
- Initial pass at 0.3s-spaced samples showed every row fully opaque in every frame — looked like a plain scroll with no visible animation at all. Rather than concluding there was no effect, zoomed into the very first frame's bottom two rows and found "Wall of Portfolios" rendering at visibly lower opacity (a dim gray) than the fully-white "Darkfolios" row directly above it — the fade is real, just fast enough (well under 0.3s) that most samples landed after it had already completed. Confirmed the effect is a **per-row** fade-in-on-scroll (each list row/item individually animates from dim/low-opacity to fully opaque as it's scrolled into view), not a single whole-section fade.

## Successes

- Matched the codebase's existing scroll-reveal convention (`whileInView`, `viewport={{ once: false }}`, `easeOut`) already used in `AboutSection.tsx` and `HeroSection.tsx`'s intro paragraph, rather than introducing a second, inconsistent animation style — added a `y: 16 -> 0` translate on top of the existing opacity-only pattern to get the "fade up" look the reference showed.
- Verified via Puppeteer (not just visually) that rows animate in both directions: scrolled computed `opacity`/`transform` on rows above and below the viewport mid-scroll and confirmed rows past the trigger point show `opacity: 1, transform: none` while a row scrolled back out above shows `opacity: 0` again (matching `once: false`'s replay-every-time behavior already established elsewhere on the site).
- Caught two genuine mid-transition frames via screenshot (Education rows fading up while scrolling, and the Toolbox icon row visibly staggering — last icon still nearly invisible while earlier ones were opaque) confirming the animation reads correctly, not just that the code compiles.

## State at this checkpoint

- **Modified** `src/components/experiences/ExperienceRow.tsx`: added `"use client"` and wrapped the row in a `motion.div` (`initial={{opacity:0, y:16}}`, `whileInView={{opacity:1, y:0}}`, `viewport={{once:false, amount:0.4}}`, `transition={{duration:0.5, ease:"easeOut"}}`). Since both the Experiences and Education lists in `ExperiencesSection.tsx` render through this same shared row component, both got the reveal from a single change.
- **Modified** `src/components/toolbox/ToolboxSection.tsx`: added `"use client"` and `framer-motion` import; each icon is now wrapped in its own `motion.div` with the same fade-up transition, staggered by `delay: i * 0.05` per index so icons cascade in left-to-right rather than all animating at once.

## Verification

- `npx tsc --noEmit` and `npx eslint .` both clean.
- Full overflow sweep across all 7 pages, both breakpoints (1512px/390px), still 0px.
- `npm run build` succeeds.
- Puppeteer-measured opacity/transform states confirm the reveal triggers and reverses correctly while scrolling; screenshots confirm the visual result matches the reference recording's per-item fade-up pattern.

## Remaining work

- None currently flagged.

## Follow-up -- stronger motion for Experiences/Education rows

Same-day.

### Human directions

- "it good but it seems it a bit faint for the experience and education sections"

### State at this checkpoint

- **Modified** `src/components/experiences/ExperienceRow.tsx`: increased the fade-up travel distance from `y: 16` to `y: 32` and slowed the transition from `duration: 0.5` to `0.6`, so the reveal reads as more noticeable. Left the Toolbox icons' animation untouched — the feedback was specific to Experiences/Education.

### Verification

- Screenshot mid-scroll shows the last row in view still visibly lower-opacity/offset compared to the fully-settled rows above it, confirming the transition window is now easier to catch by eye (previously the smaller/faster version could resolve before being noticed).
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.
