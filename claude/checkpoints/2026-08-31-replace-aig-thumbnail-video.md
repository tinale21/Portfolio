# Checkpoint — Replace AIG project thumbnail video

## Context

Swaps the looping thumbnail video shown on the AIG project card — both on the home page's "My Work" grid and the `/work` page's "My Work" grid, since both read from the same shared `PROJECTS` data (`src/components/projects/projects-data.ts`) and render through the same `ProjectCard.tsx` — for a new source clip provided by the user.

## Human directions

- "can you replace the aig thumbnail video card on both the My Work on the home page as well as My Work on the work page to this video instead: /Users/tinale/Desktop/AIG Vid New.mp4"

## Records of resistance / things I got wrong and had to correct

- Confirmed before touching anything that both pages' AIG card share one file (`public/projects/aig.mp4` via `projects-data.ts`'s single `PROJECTS` array) rather than each page keeping its own copy — a single asset swap covers both, no risk of only updating one.
- The new source file was 4K (3840x2160, 4.9s, ~1.4MB) with an AAC audio track — far larger/higher-res than needed for a small `object-cover` thumbnail card, and inconsistent with every other project's thumbnail (`emora.mp4`, `wayve.mp4`, `framer-redesign.mp4`), which are all pre-existing 1280x720 encodes. Downscaled to `Preset1280x720` via `avconvert` (no `ffmpeg`/`ffprobe` available on this machine) to match the sizing convention of the other three thumbnails rather than shipping a 4K file into a ~335px-tall card.
- Regenerated `aig-poster.jpg` from the new video's first frame (matching how the old poster was clearly just the video's own frame 0 — a mostly-blank moment right as the intro animation starts) rather than leaving the old poster mismatched against the new video's actual opening frame.
- Verified via Puppeteer that the new video actually loads and plays on both pages (`readyState: 4`, correct `1280x720`, `duration: ~4.9s` matching the source) rather than assuming a file-copy alone was sufficient — screenshotted both the home page's AIG card and the full `/work` grid mid-playback to confirm the new content (an "AIG SCADpro" title card) renders in place of the old video.
- Deliberately left `aig-hero.mp4` (the case-study page's own hero video, used on `/work/aig` itself) untouched — the request was specifically about the thumbnail card, not the case study page's hero.

## State at this checkpoint

- **Replaced** `public/projects/aig.mp4`: re-encoded from the user's new source at 1280x720 (was previously also 1280x720, encoded from the prior source).
- **Replaced** `public/projects/aig-poster.jpg`: regenerated from the new video's first frame at 1280x720.
- No code changes — `projects-data.ts` and `ProjectCard.tsx` already reference these paths by filename, so the swap is asset-only.

## Verification

- Puppeteer: confirmed the video element on both `/` and `/work` resolves to `aig.mp4`, loads fully (`readyState: 4`), reports the new video's actual dimensions/duration, and visually renders the new content on both pages via screenshot.
- Full overflow sweep across all 7 pages, both breakpoints (1512px/390px), still 0px.
- `npx tsc --noEmit`, `npx eslint .`, and `npm run build` all clean.

## Remaining work

- None currently flagged.
