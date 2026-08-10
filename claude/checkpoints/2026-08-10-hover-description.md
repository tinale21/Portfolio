# Checkpoint — Project card hover-to-description badges

## Context

Added a hover interaction to every project card on the Work page (and, since the component is shared, the homepage too): the bottom-left "{name} · {year}" badge crossfades into a short one-line description on hover, then reverts on mouse-leave.

## Human directions

- "i want to make it so the bubble changes to a brief description of what the project is like this: [motion reference video] i can provide you with the copy once you understand" — video-first spec again, copy to follow once the mechanism was proven out.
- "ok the hover works great. do you know if theres a way to make that transition feel smoother though" — an open-ended ask for a design opinion, not a specific bug.
- "ok now apply the same for the others. Emora: ... Wayve: ... AIG: ... Delta & GICC: Email me to learn more!" — final copy for all six cards.
- "let's build and push".

## Records of resistance / things I got wrong and had to correct

- Nothing corrected after the fact this round — but two judgment calls worth recording:
  - **Built the mechanism against one known description before asking for the rest**: rather than asking "what should the description be for all 4?" up front, extracted the one description visible in the reference video (Framer Redesign's, clearly readable on a paused frame), wired the whole hover/animation mechanism against that single real example, verified it worked end-to-end, *then* asked for the remaining copy — proving the mechanism actually matched the reference before asking the user to hand over content for cards that weren't built yet.
  - **"Make it feel smoother" was treated as a real design question, not a vague complaint to guess at**: proposed three concrete, specific changes (spring physics instead of flat-duration easing for the pill's width, a small vertical slide added to the text's opacity fade so it doesn't read as a flat flicker, and syncing the width/text timing so they read as one motion instead of two) rather than just bumping a duration number and hoping.
  - **Extended the same mechanic to the two NDA cards on request**, even though they aren't `Link`s and previously had zero interactivity — added local hover state to a plain `div` and reused the identical spring/fade values from `ProjectCard`, rather than inventing a second, slightly-different animation for consistency's sake.

## Successes

- Verified the hover mechanism with real Puppeteer mouse events (`page.mouse.move` to the card's center, wait, screenshot; move away, wait, screenshot) at every step — for the initial build, the smoothness tweak, and the final 6-card rollout — rather than just reading the code and asserting it should work.
- Kept `ProjectCard`'s and `NdaProjectCard`'s hover-badge implementations in sync deliberately (identical spring constants, identical easing curve, identical duration) so a future timing tweak to one doesn't quietly drift from the other.

## State at this checkpoint

- **`src/components/projects/ProjectCard.tsx`**: now `"use client"`, tracks hover state, and the bottom-left badge is a `motion.span` with `layout` (spring: `stiffness: 500, damping: 40`) wrapping an `AnimatePresence mode="popLayout"` crossfade (`opacity` + 4px vertical slide, `duration: 0.28`, `ease: [0.22, 1, 0.36, 1]`) between the name/year and `project.description`.
- **`src/components/projects/projects-data.ts`**: all four real projects now have a `description` — Framer Redesign ("Simplifying Framer's onboarding for new creators."), Emora ("Supporting emotional expression through wearable technology."), Wayve ("Reimagining music discovery through play and creativity."), AIG ("Designing an interactive kiosk experience for AIG.").
- **`src/components/work/NdaProjectCard.tsx`**: same hover mechanism added (previously fully static/non-interactive) — both Delta and GICC show `"Email me to learn more!"` on hover via a shared `NDA_DESCRIPTION` constant in `nda-projects-data.ts`.
- This affects the homepage's Selected Projects section too, since it reuses the same `ProjectCard` component — not scoped to `/work` only.
