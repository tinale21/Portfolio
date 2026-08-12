# Checkpoint — AIG case study: Key Findings section

## Context

Fifth AIG case study section (after Hero, Project Overview, Key Contribution, Research Method): a 3-card row of numbered findings from Figma dev-mode screenshots, then heavily iterated on directly (sizing, spacing, and shadow) once seen rendered.

## Human directions

- "let's now do the key findings" — provided 15 Figma dev-mode screenshots.
- "i want the boxes to fix to fit to the left and right padding. you don't have to use the size or spacing i gave you on the figma dev" — explicit permission to depart from the measured 422px/59px card width/gap in favor of a stretched, padding-bound layout.
- "can you make the text within the key findings beside the title 'Key Findings' 1px font size smaller" → "reduce it 1px smaller" → "can you do 16px" — three rounds, number/body text went 20→19→18→16px.
- "can you increase the spacing between each three key findings and then just make the box a bit more taller instead. still make sure it goes to the right and left padding" — gap 32→48px, vertical padding 69/70→90/90px.
- "reduce it a bit" — eased both back (gap 48→40px, vertical padding 90→80px).
- "the drop shadow is a bit too much and mushy. can you try fixing it" — replaced the literal Figma shadow with a tighter one.
- "ok let's build and push".

## Records of resistance / things I got wrong and had to correct

- **Shipped the fixed-width layout first, per the original Figma redlines, and it broke.** 3 cards at the confirmed 422px width + 2 gaps at the confirmed 59px = 1384px total, which didn't fit inside the standard 68px-padded content area (1376px) — card 3 silently wrapped to its own row. Caught via a Puppeteer screenshot, not assumed fixed by just trusting the redline math. Initially patched with an exact-fit 64px padding value: correct, but only for this one case, and it became moot anyway once the user explicitly said the fixed sizing didn't need to be followed at all — switched to `flex-1` cards filling the standard 68px padding, which is more robust across viewport widths than either fixed-width approach.
- **The literal Figma box-shadow read as "mushy" once actually rendered** (`2px 4px 13px 3px #E8E9EA` — a positive 3px spread stacked with a 13px blur produces a soft, indistinct halo rather than a defined edge). Fixed by using a *negative* spread (`-4px`) to pull the shadow back toward the card, a smaller 10px blur, and a translucent black (`rgba(0,0,0,0.15)`) instead of a flat light gray — a deliberate departure from the literal Figma value once it was clear the value looked wrong on screen, not just a blind port.

## Successes

- Correctly anticipated that the user's "don't have to match the Figma size/spacing" note meant a fully flexible, `flex-1`-based row rather than trying to preserve any of the original fixed dimensions — verified the result stays flush to the padding at 1512px, 1920px, and 1280px, with zero overflow at any of them.
- Iterated the several back-to-back sizing tweaks (font size x3, spacing x2) using pure Tailwind class edits with a computed-style Puppeteer check after each one, rather than assuming the class change "worked" from reading the diff alone.

## State at this checkpoint

- **New `src/components/case-studies/aig/AigKeyFindings.tsx`**: "Key Findings" eyebrow (16px/400, `#707682`) + 3-card row. Cards are `flex-1`, bounded by the standard `lg:px-[68px]` page padding, `gap-10` between them (40px), padding `80px` top/bottom / `56px`/`55px` left/right, `10px` corner radius, `2px solid #F9FAFB` border, and the reworked shadow (`0px 4px 10px -4px rgba(0,0,0,0.15)`). Number (`01`/`02`/`03`, `#5465DF`) and body text both at 16px, matching the eyebrow's size but distinguished by weight/color.
- **Modified `src/app/work/aig/page.tsx`**: now renders Hero → Project Overview → Key Contribution → Research Method → Key Findings in order.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, no horizontal overflow at 1512/1920/1280px viewports (all checked via Puppeteer, not assumed).
- Noted but explicitly NOT fixed this session (pre-existing, unrelated): `AigProjectOverview`'s fixed `lg:w-[650px]` paragraph/photo block overflows at 1280px — flagged to the user, out of scope for this round.
- Remaining AIG sections (Visual Directions, Exploration & Iterations, Final Design Implementation, Takeaway, related-projects row) not yet built.
