// Shared between ProjectCard and NdaProjectCard's hover-swap badge so the
// two never drift apart. Split per-property (rather than one flat
// `transition` object) because both the pill and its text children now
// carry `layout` — without this split, the text's own opacity/y transition
// was silently also driving its layout animation, clashing with the
// pill's spring and making each card's swap feel different depending on
// how much its text width happened to change.
export const BADGE_LAYOUT_TRANSITION = { type: "spring" as const, stiffness: 500, damping: 40 };
export const BADGE_FADE_TRANSITION = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };
