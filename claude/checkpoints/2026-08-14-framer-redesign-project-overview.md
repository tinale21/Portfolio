# Checkpoint — Framer Redesign Project Overview, and a hero video quality fix

## Context

Two pieces of work: bumped the Hero video's encode quality per direct feedback, then built Project Overview, a direct structural port of AIG's Project Overview with a video (not a static photo) in the media slot.

## Human directions

- "is there any way to make the quality of the video higher" — the Hero video.
- "ok now let's do the project overview. again, use the same rules as the aig one. [motion reference recording] [reference screenshot #1, with AIG's leftover placeholder copy in the right column]. video: Scene (7).mp4"
- [interrupted my measurement of the reference screenshot's media-box aspect ratio] "the box video should be the same size as the aig" — use AIG's exact 597x301 box, not a new ratio derived from this reference.
- [after I flagged the placeholder-copy issue and asked how to proceed, with no response after 60s] provided a corrected reference screenshot (Screenshot 2026-08-14 at 10.45.28 AM.png) with real Framer-specific right-column copy.

## Records of resistance / things I got wrong and had to correct

- Nothing to correct in the sense of a wrong implementation — but this section involved catching and correctly handling a real content problem rather than a styling one: the first reference screenshot's right-column paragraphs were verbatim AIG placeholder text (mentions "AIG's Atlanta Innovation Hub," "SCADpro," a "4K kiosk display"). Flagged this directly instead of transcribing obviously-wrong content, asked the user how to proceed via a direct question, and when there was no response within the wait window, said explicitly that I'd proceed with a reasonable draft rather than silently guessing — before I could act on that fallback, the user supplied the real corrected copy, which is what's actually used in the final file.
- Started manually pixel-measuring the reference screenshot's media-box aspect ratio (in-progress, mid-calculation) when the user interrupted to clarify it should just match AIG's existing 597x301 box exactly — stopped the manual measurement immediately rather than finishing an unnecessary calculation.

## Successes

- For the Hero video quality request, recognized the previous downscale-to-1378x550 step was an unnecessary quality loss (the source crop's own native resolution, 1920x766, was already higher than that) — dropped the redundant downscale and lowered CRF from 18 to 15, rather than just bumping resolution without also addressing compression quality.
- Correctly generalized AIG's Project Overview media slot (a static `<Image>`) to a `<video>` for this project, since the reference clearly shows a short looping animation there instead of a photo — kept every other property of that box (597:301 aspect, 650px width, 90px gap, rounded-10) identical to AIG's, changing only the element type needed to render video instead of a still image.

## State at this checkpoint

- **Modified `src/components/case-studies/framer-redesign/FramerRedesignHero.tsx`**: video encode changed from a downscaled 1378x550/CRF18 to the crop's native 1920x766/CRF15 — same CSS box size, higher source quality (see previous checkpoint's video for context; this is a follow-up fix within the same file).
- **New `src/components/case-studies/framer-redesign/FramerRedesignProjectOverview.tsx`**: structurally identical to `AigProjectOverview.tsx` (605px/187px/650px column layout, same typography/spacing rhythm) with a `<video>` in the media slot instead of `<Image>`, same 597:301 box.
- **New `public/projects/framer-redesign-overview.mp4`** (1600x900, 3.4s, no audio): scaled from the 1920x1080 `Scene (7).mp4` source, no crop needed.
- **Modified `src/app/work/framer-redesign/page.tsx`**: renders `<FramerRedesignProjectOverview />` after `<FramerRedesignHero />`.
- Verified: `npx tsc --noEmit` clean; screenshot comparison matches the reference layout; video confirmed `readyState: 4` at the correct 650x327.7 rendered box size (matching the 597:301 aspect scaled up); `NEXT_PUBLIC_BASE_PATH=/Portfolio npm run build` succeeds with the video path correctly prefixed; no new horizontal overflow beyond the pre-existing, unrelated `w-[650px]` issue shared by every case study's Project Overview section.

## Remaining Framer Redesign work

Everything past Project Overview — whatever sections the reference design calls for next — is not yet built.
