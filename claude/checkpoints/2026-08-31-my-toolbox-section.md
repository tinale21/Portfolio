# Checkpoint — Replace "Trusted By" with "My Toolbox:"

## Context

Replaces the homepage's "Trusted By" client-logo marquee with a new "My Toolbox:" section listing the software/platforms used, styled as colored app-icon squares matching a provided reference image.

## Human directions

- 'ok now i want to change the "trusted by" section into something entirely else. I want the title to be "My Toolbox:" and then next to it will be icons of platforms/softwares i use. I want the icons to be this kind: [reference image — colored rounded-square app icons]. I want the icons to be: Figma, Framer, Claude, Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro, Canva, Mirosoft 360 (I would look if you would be able to source all the icons yourself. I also want to the icons to appear next to the "My Toolbox:" rather than below it. Also, can you make the sections between the education and my toolbox the same spacing as used for the spacing between the experience section and the education section'

## Records of resistance / things I got wrong and had to correct

- Checked whether the underlying `logos-data.ts`/`CLIENT_LOGOS` array (which the old "Trusted By" marquee used) was safe to remove entirely, rather than assuming it was only used there — it wasn't: `CyclingClientLogo.tsx` (used on the Work listing page's "Previously at" line) imports from the same file. Kept `logos-data.ts` untouched and only removed `ClientLogosSection.tsx` itself (the actual "Trusted By" component being replaced) plus its now-orphaned `logo-marquee` `@keyframes` in `globals.css`, confirmed via grep that nothing else referenced either before deleting.
- For sourcing icons "myself": checked `simple-icons` (an MIT/CC0-licensed npm package of official brand SVG glyphs) first rather than freehand-drawing everything — it has accurate, official glyphs for Figma, Framer, and Claude. It does **not** have Adobe Photoshop/Illustrator/Premiere Pro or Canva at all (Adobe and Canva are known holdouts with stricter brand-asset policies), confirmed by searching the full 3,457-icon list under every plausible name rather than assuming absence from one failed guess.
- For the three Adobe apps, Adobe's own real icons are just a solid color square + a bold two-letter monogram (Ps/Ai/Pr) — reproduced that exactly (weight, two-tone color pairing per app) rather than treating it as an icon that needs traced artwork, since letterforms are the actual design.
- For Figma specifically: `simple-icons`' own Figma glyph is a flattened single-color silhouette (all five pieces merged into one path), which loses the multi-color look the reference image shows. Used Figma's actual published 5-piece brand mark instead (three circles + two puzzle shapes, each with its own official color) rather than settling for the monochrome version, since color is a big part of Figma's recognizability.
- For Canva and Microsoft 365, where I wasn't confident I could accurately reproduce the *current* official marks from memory (Canva's real logo is a two-tone paint-drop "C" shape; current Microsoft 365 uses a more organic "flower" icon, not the classic four squares) — deliberately chose simpler, lower-risk representations instead of guessing at exact path geometry: a bold white "C" on Canva's real brand gradient, and the older-but-universally-recognized four-color-squares Microsoft mark (exact, well-documented official colors) rather than an uncertain attempt at the newer icon. Flagged both as intentional simplifications in code comments, not silent inaccuracies.
- `toolbox-data.ts` initially failed to compile — a `.ts` file can't contain JSX (the icon elements assigned per tool), which only became an error at the type-check step. Renamed to `.tsx` rather than restructuring the data to avoid JSX.
- Hit a stale leftover `next dev` process from earlier in the session still bound to port 3000, causing a fresh server to silently fail over to 3001 and then exit due to the conflict. Diagnosed via the actual `next dev` output (which names the conflicting PID) rather than assuming my new server was broken, killed the stale process, and restarted clean before trusting any further verification.

## Successes

- Verified the two riskiest simplifications (Figma's multi-color mark, Adobe's lettermarks) render clearly and recognizably at actual size via a cropped screenshot of just the Figma icon, not just eyeballing the full row.
- Verified via Puppeteer: zero `pageerror`s on load, "My Toolbox:" and all 8 icons present in the DOM, icons sit inline next to the heading on desktop and wrap onto their own line/rows on mobile without any horizontal overflow.
- Confirmed no leftover references to the removed `ClientLogosSection` or `logo-marquee` anywhere in the codebase after deleting both.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## State at this checkpoint

- **Added** `src/components/toolbox/icons.tsx`: glyph-only components for Figma (5-piece official color mark), Framer and Claude (via `simple-icons` path data), Adobe Photoshop/Illustrator/Premiere Pro (lettermark + app-specific accent color), Canva (simplified white "C"), and Microsoft 365 (classic four-color-squares mark).
- **Added** `src/components/toolbox/ToolIcon.tsx`: the shared rounded-square colored badge wrapper each icon sits inside.
- **Added** `src/components/toolbox/toolbox-data.tsx`: the 8-tool list (name, background color/gradient, icon element) in the requested order.
- **Added** `src/components/toolbox/ToolboxSection.tsx`: renders "My Toolbox:" with the icon row inline beside it (wraps on narrow screens); top padding (`pt-12 sm:pt-14 lg:pt-16`) matches the gap Experiences uses to separate itself from Education in `ExperiencesSection.tsx`, per direct instruction.
- **Deleted** `src/components/logos/ClientLogosSection.tsx` and its `@keyframes logo-marquee` in `globals.css` — fully replaced, confirmed unused elsewhere first.
- **Modified** `src/app/page.tsx`: swapped `ClientLogosSection` for `ToolboxSection`.
- **Untouched**: `src/components/logos/logos-data.ts` and its client-logo SVG assets — still used by `CyclingClientLogo.tsx` on the Work listing page.

## Remaining work

- None currently flagged. If the Canva/Microsoft 365 simplifications ever need to become pixel-accurate to their current official marks, that would require sourcing the real vector artwork directly (e.g., from each company's own brand-asset pages) rather than reconstructing from memory.

## Follow-up -- smaller icons, less corner rounding

Same-day.

### Human directions

- "can you make the icons a bit smaller and with less corner rounding"

### State at this checkpoint

- **Modified** `src/components/toolbox/ToolIcon.tsx`: badge size reduced (`h-12 w-12 sm:h-14 sm:w-14` -> `h-9 w-9 sm:h-11 sm:w-11`), corner rounding reduced (`rounded-2xl` -> `rounded-lg`).
- **Modified** `src/components/toolbox/toolbox-data.tsx` and `icons.tsx`: every glyph's own size scaled down proportionally to match the smaller badges (SVG icons and the Adobe/Canva lettermark font sizes), so nothing looks oversized or cramped inside the new smaller squares.

### Verification

- Visually confirmed via screenshot on both desktop and mobile -- icons read clearly at the smaller size, all 7 non-Microsoft icons now fit on one row on mobile (previously wrapped after 6). Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up -- more rounding, Microsoft outline, tighter spacing

Same-day.

### Human directions

- "add just a little bit more corner round. also add a light gray outline for the window 360 icon so it doesn't blend in the background. also reduce the spacing between each icons a little bit"

### State at this checkpoint

- **Modified** `src/components/toolbox/ToolIcon.tsx`: corner rounding increased (`rounded-lg` -> `rounded-xl`); added an optional `outline` prop that adds a light gray border (`border border-[#E5E5E5]`), used only where an icon's own background is too close to the page's white to read its edges.
- **Modified** `src/components/toolbox/toolbox-data.tsx`: added `outline: true` to the Microsoft 365 entry (its white background otherwise disappeared into the section's own white background) and extended the `Tool` type with the new optional field.
- **Modified** `src/components/toolbox/ToolboxSection.tsx`: icon row gap reduced (`gap-3 sm:gap-4` -> `gap-2 sm:gap-3`); passes the new `outline` field through to each `ToolIcon`.

### Verification

- Visually confirmed via screenshot on both desktop and mobile: Microsoft 365's icon now has a visible boundary against the white background, corners read slightly rounder, icons sit closer together, and all 8 icons now fit on a single row on mobile (previously 7 + a wrapped 8th). Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint`, and `npm run build` all clean.

## Follow-up -- fix Education-to-Toolbox spacing mismatch

Same-day.

### Human directions

- "is the space between the education section and the my toolbox section the same amount of space used between the experience section and the education section"

### Records of resistance / things I got wrong and had to correct

- The original "match the spacing" instruction was implemented by copying the same class values (`pt-12 sm:pt-14 lg:pt-16` on `ToolboxSection`, matching `ExperiencesSection`'s `mt-12 sm:mt-14 lg:mt-16` between its two headings) without accounting for the fact that Experiences and Education share ONE `<section>` (so the gap is a single margin), while `ToolboxSection` is a SEPARATE `<section>` after `ExperiencesSection` — meaning its top padding stacks on top of `ExperiencesSection`'s own bottom padding (`pb-10 sm:pb-14 lg:pb-16`) instead of being the only spacing in play. Measured via Puppeteer before touching anything: actual gaps were 64px vs 132px at desktop (should both be 64px), 56px vs ~140px at tablet, 48px vs ~88px at mobile — confirming they did NOT match despite the class values looking parallel.
- Caught a red herring in my own first measurement: comparing a section's outer bottom edge (which already includes its own padding-bottom) to the next section's heading double-counted one side's padding and made the gap look closer to correct (68px) than it actually was. Re-measured content-row-bottom to next-heading-top on both sides (the same methodology used for the Experiences->Education gap) to get an apples-to-apples number.

### State at this checkpoint

- **Modified** `src/components/toolbox/ToolboxSection.tsx`: top padding changed from `pt-12 sm:pt-14 lg:pt-16` to `pt-2 sm:pt-0 lg:pt-0` — the amount still needed on top of `ExperiencesSection`'s own `pb-10 sm:pb-14 lg:pb-16` so the two paddings sum to the target 48/56/64px total, instead of each independently trying to *be* 48/56/64px and stacking to roughly double that.

### Verification

- Re-measured content-to-heading gaps after the fix: mobile 48px vs 48px (exact), tablet 56px vs 60px, desktop 64px vs 68px. The remaining 0-4px is intrinsic line-height/leading difference between the 26px "Education" `<h2>` and the 24px "My Toolbox:" `<p>` (different font sizes have different default leading), not a padding error — the CSS padding values themselves are now mathematically exact. Confirmed visually via a full-page screenshot spanning Experiences through Education through My Toolbox: the two gaps now read as the same rhythm.
- Full overflow sweep across all 7 pages, both breakpoints (1512px/390px), still 0px. `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Follow-up -- thinner Microsoft outline, more space before footer

Same-day.

### Human directions

- "can you make the mircosoft outline a bit thinner. can you also increase the spacing between the my toolbox section and the footer"

### State at this checkpoint

- **Modified** `src/components/toolbox/ToolIcon.tsx`: the `outline` prop no longer uses Tailwind's `border` utility class (which floors at 1px) — switched to an inline `borderWidth: "0.5px"` (plus explicit `borderStyle`/`borderColor`) so the Microsoft 365 hairline can go thinner than Tailwind's minimum.
- **Modified** `src/components/toolbox/ToolboxSection.tsx`: bottom padding increased from `pb-10 sm:pb-14 lg:pb-16` to `pb-16 sm:pb-20 lg:pb-24`, widening the gap before the footer.

### Verification

- Measured the icon-row-to-footer gap via Puppeteer before/after: desktop 64px -> 96px, mobile 40px -> 64px.
- Cropped an element-level screenshot of just the Microsoft 365 icon — outline reads visibly thinner while still distinguishing the white icon from the section's white background.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Follow-up -- faint drop shadow on icons

Same-day.

### Human directions

- "can you add a small faint drop shadow to the icons"

### State at this checkpoint

- **Modified** `src/components/toolbox/ToolIcon.tsx`: added `shadow-[0_1px_3px_rgba(0,0,0,0.08)]` to each icon badge — a low-opacity, small-offset shadow rather than Tailwind's built-in `shadow`/`shadow-md` scale, which read too heavy for icons this small.

### Verification

- Cropped zoomed screenshots (via PIL, since Puppeteer's own `clip` screenshot intermittently returned garbled/unrelated image data in this environment) of both the darkest icon (Figma, black background) and the lightest (Microsoft 365, white background + hairline outline) — shadow reads as a faint lift under both without looking heavy.
- Full overflow sweep across all 7 pages, both breakpoints, still 0px. `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.
