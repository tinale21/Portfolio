# Checkpoint — Left-align case study hero metadata on mobile

## Context

On the individual case study pages, the hero's Timeline/Role/Platform/Team Size metadata wasn't reliably left-aligned on mobile — on AIG "Platform" and on Wayve "Team Size" were pushed to the right edge.

## Human directions

- "on mobile for the individual case studies can you make sure the timeline, role, platform, team size is all to the left (like how framer's case study is on mobile)"
- Clarification: "the only one that appears off is the wayve and aig. wayve has the team size on the right on mobile and aig has the platform on the right on mobile"

## Records of resistance / things I got wrong and had to correct

- Didn't guess at the cause — measured all four case studies' meta column positions on mobile (390px) via Puppeteer. Found: framer-redesign and emora had all four columns at left:20 (correct), while AIG had "Platform" at left:308 and Wayve had "Team Size" at left:296 (pushed right).
- Root cause: all four heroes share the identical meta row markup `flex flex-wrap gap-x-[203px] gap-y-6`. On a narrow screen, `flex-wrap` packs two columns onto one row *when they're narrow enough to fit*, and the huge 203px `gap-x` then flings the second one to the right edge. Whether this happens is purely content-width-dependent — AIG's "Kiosk"/"15" and Wayve's values are narrow enough to pair up, while framer/emora's wider values ("Web Application" etc.) never fit two per row, so they stacked correctly *by accident*. So framer/emora only looked right coincidentally, not by design.
- Fixed it at the layout level for all four (not just the two visibly-broken ones): the code comments state these heroes intentionally share identical spacing classes, and framer/emora could break too if their copy ever changed. Diverging them would undermine that intent.

## State at this checkpoint

- **Modified** all four case-study hero files (`AigHero`, `WayveHero`, `EmoraHero`, `FramerRedesignHero`): meta row class changed from `flex flex-wrap gap-x-[203px] gap-y-6` to `flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:gap-x-[203px] lg:gap-y-6`. Below `lg` it's a left-aligned vertical stack; at `lg`+ (where the ~921px-wide row actually has room) it's the original single row with the 203px column gap. Added an explanatory comment to each.

## Verification

- Puppeteer at 390px: all four case studies now have every meta column at left:20 (fully left-aligned, `allLeftAligned=true`).
- Puppeteer at 1512px: framer and aig still render as a single row (all columns same top, spaced ~203px) — desktop layout unchanged.
- Screenshot of AIG mobile confirms the clean left-aligned stack.
- Overflow sweep on all four case study pages at 1512px and 390px: 0px.
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Remaining work

- None currently flagged. (These four hero components are near-identical copies; if more shared behavior accumulates, they'd be a candidate for extracting a shared `CaseStudyHero`/meta component — out of scope here.)
