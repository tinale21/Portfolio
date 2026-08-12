# Checkpoint — AIG hero video swap

## Context

Replaced the AIG case study's hero video with a new source file the user provided (`~/Desktop/AIGDEMO.mp4`), using the same crop/encode pipeline established when the original hero video's quality was fixed earlier in this project.

## Human directions

- "can you replace the aig hero video on the case study to this: /Users/tinale/Desktop/AIGDEMO.mp4"
- "lets build and push".

## Records of resistance / things I got wrong and had to correct

- Nothing went wrong outright, but this wasn't a blind reuse of the old crop parameters: the new source is framed differently from the original demo reel (a full-screen capture of the actual kiosk prototype, content extending close to the frame edges, vs. the original's "device mockup floating on a gradient with lots of margin"). Since the target display aspect ratio (1378:550 ≈ 2.51:1) is much wider than the source's native 16:9, hitting it always requires trimming ~630px of vertical space regardless of content — so before trusting the same `crop=3840:1532:0:314` center-crop on this new, differently-framed video, checked frames across the *entire* 36.8s clip (not just one moment) to confirm no important UI content (card titles, buttons, QR codes) gets clipped. It held up cleanly throughout.

## Successes

- Reused the established pipeline exactly (crop → scale to 1378×550 → libx264 CRF 18 → strip audio) rather than re-deriving it, since the AIG hero's spec was already locked in from earlier work.
- Verified in the browser afterward, not just via ffmpeg's own output log: confirmed the served video byte-count matches the new encode exactly, correct 1378×550 dimensions, autoplay/muted state, and no audio track, plus a rendered screenshot.

## State at this checkpoint

- **`public/projects/aig-hero.mp4`**: replaced. Source: `~/Desktop/AIGDEMO.mp4` (originally 3840x2160, 36.83s, with audio). Same crop as before (`crop=3840:1532:0:314,scale=1378:550`), encoded with libx264 at CRF 18 (~1.86 Mbps), audio stripped (`-an`). No code changes — `AigHero.tsx` already referenced `/projects/aig-hero.mp4` by path, so this was purely an asset swap.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, dev server serves the new file (byte-for-byte match confirmed via `curl`), video plays correctly in a live Puppeteer check.
