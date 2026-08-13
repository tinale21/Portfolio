# Checkpoint — Emora Project Overview

## Context

Built Emora's Project Overview section, a direct structural port of AIG's own Project Overview component.

## Human directions

- "Now let's do the project overview section: [screenshot]. use the same rules as the aig one. image: [Rectangle 133.png]" — provided a full reference screenshot (Screenshot 2026-08-13 at 6.40.50 PM.png) with all copy, and the overview illustration asset directly.

## Records of resistance / things I got wrong and had to correct

- Nothing to correct — this was a clean, direct port once the reference screenshot and image asset were in hand.

## Successes

- Checked the provided illustration's exact pixel dimensions (2388x1204, aspect 1.983:1) before writing any layout code, and found it matches AIG/Wayve's team-photo slot (597:301, the same 1.983:1 ratio) exactly — dropped it into the identical 650px-wide box with no new aspect-ratio math needed, rather than assuming a mismatch and rebuilding the sizing.
- The illustration itself already bakes in a caption line ("Emora combines wearables and apps to build emotional clarity and confidence.") in a custom brand font, distinct from the site's Inter stack. Rather than trying to recreate that caption as separate live text (which would drift from the reference's actual lettering), used the image as-is — confirmed first that the asset has no real transparency (alpha channel flat at 255) so `object-cover` behaves exactly like the plain-photograph case already established.
- Confirmed the section's ~70px horizontal overflow is the same pre-existing issue already flagged on Wayve's Project Overview (both use the identical `605px + 187px + 650px` fixed-width math) — and traced it back further this time: AIG's own original `AigProjectOverview.tsx` has the exact same `lg:w-[650px]` construction, meaning this bug has existed since the very first case study, not something introduced by either Wayve or Emora's ports. Still out of scope to fix here without being asked, but worth having pinned down precisely.

## State at this checkpoint

- **New `src/components/case-studies/emora/EmoraProjectOverview.tsx`**: structurally identical to `AigProjectOverview.tsx` — same column widths/gaps (605px/187px/650px), same typography (16px/400/#707682 eyebrows, 16px/500/#000 left-column body, 14px/500/#6E7681 right-column paragraphs), same spacing rhythm (325px statement-to-Problem, 51px Problem-to-Solution, 90px paragraphs-to-image, 87px section top padding). Left-column line breaks transcribed directly from the reference screenshot; right-column paragraphs left as plain wrapped strings, matching AIG/Wayve's own convention once widened past their Figma reference.
- **New `src/assets/case-studies/emora/overview-illustration.png`**: copied directly from the provided `Rectangle 133.png`, used as-is (no cropping/re-export).
- **Modified `src/app/work/emora/page.tsx`**: renders `<EmoraProjectOverview />` after `<EmoraHero />`.
- Verified: `npx tsc --noEmit` clean; screenshot comparison against the reference shows a close match; `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds; no *new* horizontal overflow beyond the pre-existing, now-confirmed-to-predate-Wayve `w-[650px]` issue shared by all three case studies' Project Overview sections.

## Remaining Emora work

Everything past Project Overview — whatever sections the reference design calls for next — is not yet built.
