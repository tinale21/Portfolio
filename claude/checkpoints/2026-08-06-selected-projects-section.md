# Checkpoint — Selected Projects section

## Context

First build of the second Home page section: a 2×2 grid of looping video "thumbnails" for four projects (AIG, Wayve, Emora, Framer Redesign), each clickable through to a (placeholder) project page. This replaces the temporary white scroll-space placeholder that had stood in for "whatever comes after the Hero" since the Hero work began.

## Human directions

- Four project thumbnails are looping videos (not static images); clicking one navigates to that project's page.
- Provided: a Figma prototype screen recording showing the four cards autoplaying/looping unattended (no hover-trigger), and the four actual source video files (AIG, Wayve, Emora, Framer Redesign logo/brand animations).
- Once dev-mode Figma screenshots were requested, provided 14 across two rounds covering: heading/subtext typography, card dimensions and corner radius, badge sizing/typography/colors, the outer frame width, and the grid gap — plus a direct answer that the `1px solid #F4F4F5` border applies only to Emora's card and badge, not the other three.
- Confirmed scope explicitly: build only the 4-card grid now; a client-logos row also present in the same Figma frame is out of scope for this pass.
- Confirmed routing approach: placeholder `/work/{slug}` pages now, real content later.

## Records of resistance / things I got wrong and had to correct

- Nothing was implemented incorrectly this round — the two rounds of dev-mode screenshots were gathered *before* writing any component code (continuing this project's established habit of verifying against Figma exactly rather than estimating from a scaled prototype recording), so there was no rework needed once building started. Two ambiguities were resolved by asking rather than guessing before coding:
  - Whether the visible client-logos row in the same Figma frame should be built now (asked directly — deferred).
  - Whether the `1px solid #F4F4F5` border seen on Emora's badge was Emora-specific or shared by cards with light/near-white backgrounds generally (a "2 selected" Figma inspect screenshot showing a shared stroke value on both AIG's and Emora's rectangles briefly suggested it might be universal — asked directly rather than trusting an ambiguous multi-select UI reading, and the user confirmed it's Emora-only).

## Successes

- Reused the frame-by-frame video analysis technique (already established for the Hero's scroll-motion reference) to extract exact source-video content and confirm all four provided files matched what the Figma prototype showed, before writing any code.
- Cross-checked the Figma frame's measured left/right margin (~67–68px at the 1512px reference width) against `NavBar`'s existing container padding (`px-5 sm:px-8 lg:px-[68px]`) and found they matched almost exactly — reused the same container class rather than inventing a new one-off margin value, keeping the site's spacing system consistent.
- Transcoded all four source videos (originally ~37MB combined, dominated by a 32MB unconverted screen recording for Wayve) down to ~1.3MB combined: scaled to 1280px wide, audio stripped (all playback is muted anyway), `+faststart` for progressive loading. Generated poster JPEGs from each video's actual first frame (not an arbitrary later frame) so there's zero visual mismatch between the poster and the video's own opening frame.
- Verified end-to-end via Puppeteer rather than eyeballing: all four videos' `paused`/`muted`/`loop` state confirmed programmatically, click-through to a placeholder project page confirmed, and mobile single-column stacking confirmed via screenshot.

## State at this checkpoint

- `ProjectsSection` (2×2 video grid) is live on the Home page immediately after `HeroSection`, marked `data-nav-theme="light"` so the NavBar's dark/light switch (from the previous checkpoint) applies correctly.
- `/work/[slug]` is a single dynamic route with `generateStaticParams` for the four known projects, rendering a minimal "coming soon" placeholder — intentionally not yet split into individual per-project page files, since real per-project layouts don't exist yet.
- The client-logos row visible in the same Figma frame is explicitly out of scope — not built, no assets/spec gathered for it yet.
- Section-level vertical padding and the heading-to-subtext / subtext-to-grid spacing were not given exact Figma values (only horizontal margin and card/badge/typography specs were) — currently reasonable estimates (`py-16`/`py-20`/`py-24` responsive, `mt-2`, `mt-10`), not yet confirmed against Figma.
