# Checkpoint — Nav bar + Hero section (Steps 1–2)

## Context

First implementation pass on the portfolio site: Next.js/TypeScript/Tailwind scaffold, the shared `NavBar`, and the Home page Hero section (photo collage + scroll interaction). Headline/typewriter (Step 3) is not built yet.

## Human directions

- Nav: sticky, no scroll-based style changes, Inter font, active page shown via font-weight only (medium vs light), decorative `/` separators, hamburger menu on mobile. Height reduced twice (84px → 74px → 64px), logo and text reduced 2px each, all per direct feedback rather than Figma numeric specs.
- Hero collage: explicitly required to be pixel-accurate to Figma, not estimated from the exported PNG. User supplied Figma dev-mode "Inspect" screenshots (exact `left/top/width/height/border-radius` per photo) partway through and told me to treat those as source of truth, overriding earlier PNG-based measurements.
- Explicit process constraint: implement one step at a time (static layout → scroll interaction → headline), stop for review between each, don't build ahead.
- Scroll interaction: tied directly to scroll position (not a triggered/one-shot animation), reversible, translate only (no scale), ~1 viewport height of scroll distance, no scroll-jacking/pinning — page must keep scrolling normally.
- Multiple follow-up refinements after initial "Figma-accurate" pass: swap z-order of two photos, reduce overall collage scale (94% → 84%), fix a white line artifact on one photo (transparent PNG padding flattened to white during JPEG conversion), fix vertical/horizontal centering (twice — see below), replace the portrait asset, reorder z-index of two more photos.

## Records of resistance / things I got wrong and had to correct

- **First "Figma-accurate" attempt was actually PNG-reverse-engineered**, not really Figma-sourced — I used feature-matching (ORB/RANSAC) and template-matching against the flattened reference PNG. It was fairly accurate but the user correctly rejected this as not being true source-of-truth and supplied real Figma Inspect screenshots instead.
- **"Optical centering" overcorrection**: user asked the collage to feel optically centered (not just the portrait). I computed an area-weighted visual centroid and shifted the container off geometric-center to compensate. This overshot — the geometric bounding box ended up ~32px off-center — and the user reported it looked *less* balanced. Reverted to plain geometric centering, which was correct all along (Figma's own bounding box is symmetric: 359px margins both sides at the 1512 reference width).
- **Vertical centering, three iterations**:
  1. First just let the collage sit at the top of a `min-h-screen` section — user pointed out this isn't centered, just top-anchored with slack collected below.
  2. Added `flex items-center` on the Hero section — better, but the section itself was `min-h-screen` while sitting *after* the nav in flow, so nav + section together exceeded one viewport (nav height spilled past the fold). Centering within the section wasn't the same as centering within what's visible on load. Fixed by sizing the section to `calc(100vh - navHeight)` instead.
  3. Even after that, the *container* used to position the photos had an asymmetric internal bounding box — sized to touch the content's bottom edge exactly but with ~60px of unused space above the topmost photo. Centering that container centered the box, not the visible content. User caught this via a screenshot annotation. Fixed by tight-cropping the container to the true top-to-bottom content bounds before centering.
- **White line artifact**: root cause was 1–4px of fully-transparent padding baked into 3 of the 9 original Figma-exported PNGs (not something I introduced), which flattened to solid white when I converted them to JPEG (no alpha channel). Found by checking alpha channels directly, not guessing from the visual symptom.
- Two separate coupling points now exist between `NavBar`'s height and the Hero's layout math (`HeroSection.tsx`'s `calc(100vh - Npx)` and `collage-layout.ts`'s percentage denominators) — every time nav height changed, both had to be recomputed by hand. Flagged this to the user each time; no request yet to remove the coupling (e.g., via a shared constant or CSS variable), so it remains manual.

## Successes

- Feature-matching + template-matching the production photos against the reference PNG (before real Figma numbers were available) was validated against known aspect ratios and came back essentially exact — useful technique to remember for future asset-position recovery when no dev-mode access exists.
- Once given real Figma Inspect screenshots, cross-validated the rectangle→photo mapping via aspect-ratio comparison against the actual production assets — all 9 matched with zero difference, which caught nothing wrong that time but is a cheap, worthwhile sanity check before trusting a manual transcription.
- Typewriter timing (Step 3, not yet wired in) was already extracted precisely from a motion reference video in an earlier session via frame-by-frame extraction — reusable once Step 3 starts.
- Self-verification loop worked well throughout: build → lint → Puppeteer screenshot/DOM measurement → compare numerically, rather than eyeballing. Caught the centering bugs objectively (measuring actual rendered left/right and top/bottom margins) rather than relying on visual impression alone.

## State at this checkpoint

- Nav bar: complete, reviewed and approved.
- Hero: Step 1 (static collage) and Step 2 (scroll-linked translate) complete and reviewed. Step 3 (headline + typewriter) not started — `TypewriterHeadline.tsx` exists from earlier scaffolding but is not yet wired into `HeroSection`.
- No git history existed before this commit — this is the first commit for the project.
