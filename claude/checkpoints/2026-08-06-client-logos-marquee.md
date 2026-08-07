# Checkpoint — Client logos marquee section

## Context

Third Home page section: an infinite, always-scrolling horizontal marquee of 5 client logos (AIG, Ronald McDonald House Atlanta, Georgia International Convention Center, Delta, Ziora Copilot), clipped by two visible vertical gray rules. This is the client-logos row spotted (and explicitly deferred) during the Selected Projects section work.

## Human directions

- Provided two unrelated reference screen recordings (a Porsche/Aestura/UBS marquee and a dark "skills pills" marquee) purely to convey the intended *motion* — continuous, constant-speed, seamless right-to-left scroll, no easing or pausing.
- Provided the 5 actual logo SVGs directly (not via Figma export inspection).
- Clarified the two gray lines are not just my-eyes-only annotations: they should render as actual visible 2px vertical rules marking the clip boundary, with logos hard-clipping there (no fade).
- Confirmed no hover-to-pause behavior, matching both references.
- After building, reported "a weird long gap between the Ziora Copilot logo and the AIG in the loop" — asked to leave as-is and view live after I demonstrated (via direct measurement) the CSS gap is uniformly 116px everywhere, including that transition.

## Records of resistance / things I got wrong and had to correct

- Nothing required correction this round, but one thing was worth verifying empirically rather than assuming: when the user reported an uneven-looking gap, I didn't assume either "there's a bug" or "it's fine" — I measured every consecutive logo pair's actual on-screen gap via `getBoundingClientRect()` (all nine gaps, including the Ziora→AIG wrap point, came back exactly 116px). This ruled out a real spacing/animation defect and pointed instead to a *perceptual* cause: AIG's own logo asset is a small wordmark inside a bordered box on a plain white background, so the transition from Ziora's dense, edge-to-edge content into AIG's mostly-white box can read as a much longer gap than the identically-spaced transitions between other logos. Reported this finding plainly instead of either dismissing the report or changing code to mask a non-bug.

## Successes

- Computed the exact seamless-loop translate distance up front (1345px = 765px of logo widths + 5×116px of gaps, including the trailing connector gap between the two duplicated copies) rather than using a naive `-50%`, which would have been off by several percent given the uniform-gap structure (verified: doubled track width is 2574px, so -50% would translate 1287px — 58px short of the correct 1345px). Confirmed the seamless wrap visually via screenshots taken mid-cycle.
- Checked each of the 5 logo SVGs for baked-in internal whitespace (comparing declared viewBox size to actual ink bounding box) before laying anything out, rather than assuming native SVG dimensions were tight — found GICC and Delta both have real but *vertical* padding (which doesn't affect horizontal spacing) and near-zero horizontal padding on all five, which is what let me rule out "SVG padding" as the cause of the reported gap and correctly localize it to AIG's own visual design instead.
- Used `motion-safe:animate-[...]` (Tailwind's reduced-motion-aware variant) instead of a manual media query, getting `prefers-reduced-motion` support for free with no extra CSS.

## State at this checkpoint

- `ClientLogosSection` renders after `ProjectsSection` on the Home page, marked `data-nav-theme="light"`.
- Section horizontal padding (114px at the 1512px reference width) and logo/gap sizing are implemented as fixed pixel values (not fluid percentages), matching how the Projects section's badges were done — this section's Figma spec was given in absolute pixels, not frame-relative percentages like the Hero collage.
- The "long gap" perception around the AIG logo is a known, measured-and-explained non-bug — left as-is pending the user viewing it live; a follow-up (tightening the global gap, or treating AIG specially) may come after that.
- Animation duration (28s per cycle) and section vertical padding (`py-12`/`py-16`/`py-20` responsive) are estimates, not sourced from Figma — same caveat as the Projects section's own unspecified vertical rhythm.
