# Checkpoint — "Click to expand!" custom cursor on expandable media

## Context

Adds a Figma-style custom cursor: hovering any expandable (Lightbox-wrapped) photo/video in a case study replaces the pointer with the default black arrow plus an orange-red "Click to expand!" label. Clicking still opens the lightbox; the native cursor returns on mouse-out.

## Human directions

- "for any of the videos or photos that are in my case studies that are able to be expanded ... when a user hovers over any of those expandable videos or photos, their mouse changes to show the text 'Click to expand!' I want it to look like the figma mouse text that i have here: [Screen Recording ... 3.27.32 PM.mov]. And then they can click on it and it expands. their mouse also goes back to normal once they hover out."

## Records of resistance / things I got wrong and had to correct

- Matched the exact look from the reference recording rather than guessing: extracted frames (avconvert micro-clips -> qlmanage thumbnails), confirmed it's the OS black arrow with a rounded pill to its lower-right, and color-sampled the pill background to `#EF3F1E` (a red-orange). Pill: white medium-weight text, mostly-rounded with a slightly sharper top-left corner near the cursor tip.
- Reused the existing `Lightbox` wrapper (it already wraps all ~8 expandable media across the case studies via `cloneElement`) instead of touching each call site — so "every expandable photo/video" is covered by one change, and the guarantee "only expandable media" is automatic (non-expandable media isn't wrapped).
- Kept it desktop-only, matching Lightbox's existing `matchMedia("(min-width: 1024px)")` gate — mobile has no custom cursor at all (verified 0 `.cursor-none` elements at 390px).
- Position performance: the cursor follows the pointer by writing `transform` directly to the DOM node in a mousemove handler (a ref), not React state, so no re-render per move. Seeded the initial position from the host's `mouseenter` event so there's no flash at (0,0) before the first move.
- First Puppeteer hover test failed (found the wrong element; Lenis smooth-scroll had also moved it mid-test) — re-tested by targeting a real `.cursor-none` element, scrolling and letting Lenis settle, then hovering. Confirmed the mechanism was actually fine.

## State at this checkpoint

- **Added** `src/components/case-studies/ExpandCursor.tsx`: a portal-to-body, `pointer-events-none`, `position: fixed` follower with the arrow SVG (tip at 0,0) + the `#EF3F1E` "Click to expand!" pill; framer-motion pop-in (scale/opacity); position via direct `transform` writes on a ref.
- **Modified** `src/components/case-studies/Lightbox.tsx`: the desktop trigger clone now adds `onMouseEnter`/`onMouseLeave` (tracking `hovered` + the enter position) and swaps `cursor-zoom-in` -> `cursor-none` (hides the native pointer over the media); renders `<ExpandCursor>` while `hovered && isDesktop && !isOpen`. The existing click-to-open is preserved (and closes the custom cursor on click).

## Verification

- Puppeteer on `/work/aig`: hovering a trigger shows the "Click to expand!" label and the media's computed `cursor` is `none`; screenshot matches the reference (black arrow + orange-red pill).
- Behavior test: `labelOnHover: true`, click opens the modal (`modalOpen: true`), label hidden while open (`labelWhileOpen: false`), label gone after moving off (`labelAfterOut: false`).
- Mobile (390px): 0 `.cursor-none` elements — unaffected, native behavior.
- Overflow sweep across all 4 case studies at 1512/390: 0px. `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.

## Follow-up -- fix double cursor for custom OS pointers

### Human feedback

- "since i have a custom mouse color when i go to hover, two mouses appears"

### Records of resistance / things I got wrong and had to correct

- Root cause: when a visitor customizes their OS pointer (macOS Accessibility > Pointer color/outline), the browser **ignores CSS `cursor: none`** and keeps drawing the system cursor. My first version drew its own arrow AND set `cursor: none` — so those users saw two arrows (the un-hidden OS one + my drawn one). This is an OS accessibility override a web page cannot defeat.
- Fix: stop drawing our own arrow and stop hiding the native cursor. `ExpandCursor` now renders ONLY the orange-red "Click to expand!" pill, and the Lightbox trigger uses `cursor-default` (native arrow stays visible) instead of `cursor-none`. Everyone gets exactly one cursor (their real system arrow) + the label — and it still matches the Figma reference (arrow + pill). Bonus: users with a custom pointer color now see the label next to *their* pointer.

### State at this checkpoint

- **Modified** `ExpandCursor.tsx`: removed the arrow SVG; renders only the label pill (same `#EF3F1E`, offset just below-right of the pointer, same pop-in). Position still driven by direct `transform` writes on a ref.
- **Modified** `Lightbox.tsx`: trigger className `cursor-none` -> `cursor-default`.

### Verification

- Puppeteer: hovering a trigger shows the "Click to expand!" label, no drawn `<svg>` arrow exists, and the media's computed cursor is `default` (native arrow visible) — so only one cursor renders regardless of OS pointer customization.
- Click-to-open, label-hidden-while-open, revert-on-mouseout, and mobile-unaffected all still hold (logic unchanged).
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` clean.

## Follow-up 2 -- type the label out (typewriter)

### Human feedback

- "right now the text kind of just pops up, can we make it like the figma text where it types it out. reference the video i sent for that motion"

### Records of resistance / things I got wrong and had to correct

- Re-checked the reference recording (cropped the label mid-animation): it types character-by-character with a thin white blinking caret ("Click to e|"), like typing into a text field. Implemented exactly that rather than a generic fade.

### State at this checkpoint

- **Modified** `ExpandCursor.tsx`: replaced the scale/opacity pop with a typewriter — a `count` state advances one char every `TYPE_MS_PER_CHAR` (55ms) via setTimeout, rendering `label.slice(0, count)`; the pill (whitespace-nowrap) grows as it types. Added a thin white blinking caret (1.5px bar, framer-motion opacity blink). Typing restarts each hover (component remounts per hover).

### Verification

- Puppeteer: sampled the pill's text over time while hovering — `["Cl","Clic","Click ","Click to","Click to e","Click to exp","Click to expand","Click to expand!",...]` — confirming it types out then holds.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` clean.

## Remaining work

- None flagged. Typing speed is `TYPE_MS_PER_CHAR = 55` (~0.9s total) — easy to tune. The label sits lower-right of the pointer; edge-flip near the right screen edge is a possible future nicety.
