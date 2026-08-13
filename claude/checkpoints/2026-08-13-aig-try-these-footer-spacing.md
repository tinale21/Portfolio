# Checkpoint — AIG "Try These" section: footer spacing

## Context

Small follow-up to the "If This Caught Your Eye, Try These" section: more breathing room before the footer.

## Human directions

- "can you add more space between the if this caught your eye, try these section and the footer"
- "let's build and push"

## State at this checkpoint

- **Modified `src/components/case-studies/TryTheseProjects.tsx`**: bottom padding `pb-16` → `pb-28`. Verified via measurement: gap to the footer went from 64px to 112px.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds.
