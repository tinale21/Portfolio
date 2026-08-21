# Checkpoint — Remux every case study video for faststart (streaming playback)

## Context

Follow-up to a same-day question: "the videos for the hero of each case study takes a while to load in, is there any way to fix that without decreasing the quality." Diagnosed and fixed the four hero videos first (see below), then found the identical problem across nearly every other video on the site and got explicit sign-off to fix those too.

## Human directions

- "the videos for the hero of each case study takes a while to load in, is there any way to fix that without decreasing the quality or no"
- "yes fix those too with the same technique"

## Records of resistance / things I got wrong and had to correct

- Went in checking file size/resolution/bitrate first (same angle as the About-page-photos fix earlier this session) — but these hero videos turned out to be reasonably encoded already (moderate bitrates, resolution roughly matching display size). The real cause was structural, not about quality at all: inspected each MP4's top-level box layout directly (`ftyp`/`free`/`mdat`/`moov` atom positions, parsed by hand since no `ffprobe`/`mediainfo` is installed) and found the `moov` atom — the index a browser needs before it can decode *anything* — sitting at the very end of the file, after the entire `mdat` payload, in 3 of 4 hero videos (`aig-hero.mp4`: moov at byte 8,578,186 of an 8.6MB file). Browsers can't start playing until they've fetched enough to reach that index, so effectively the whole file had to download first. This is a known artifact of some export/recording pipelines (e.g., QuickTime screen recordings default to writing the index last) — nothing to do with codec, bitrate, or resolution.
- No `ffmpeg -movflags faststart` available locally — used macOS's built-in `avconvert` with `PresetPassthrough` instead (fast-start is its default behavior per `avconvert --help`, with a `--disableFastStart` flag confirming that). Didn't just trust that the preset name implies zero re-encoding — verified it directly: compared file sizes before/after (all within ~0.1% of original, consistent with pure container repackaging) and, more importantly, generated a QuickLook thumbnail frame from both the original and remuxed file for every single video and confirmed the two were byte-for-byte identical PNGs (`diff -q`) before trusting any of them — proof the decoded pixel content genuinely didn't change, not just an assumption from the preset's name.
- First attempt at scripting the batch remux (21 files) as an inline bash `for` loop inside one command silently collapsed all 21 filenames into a single malformed path (`avconvert` error showed all 21 names %20-joined into one invalid source argument) — root cause not fully diagnosed, but rather than fight inline shell quoting further, wrote it as a proper `.sh` script file with a real bash array and ran that instead, which worked correctly on the first attempt.
- Second near-miss: a fast/lightweight verification pass right after the batch run only read the first 200 bytes of each output file to check atom order, which misreported all 21 as still non-faststart (the `moov` atom itself is far larger than 200 bytes, so the scan ran out of buffer before ever reaching `mdat`). Caught this by noticing the file-size diffs were still all near-zero (the actual signal that the remux had worked) despite the faststart check disagreeing, re-ran the check reading full files, and got a clean "ALL OK" — didn't report success (or failure) off a check that was itself broken.

## Successes

- Found the same problem was site-wide before being asked to look, not just in the hero videos: scanned every `.mp4` under `public/` (28 files) — only the 4 small homepage/Work-grid thumbnail videos (`aig.mp4`, `emora.mp4`, `framer-redesign.mp4`, `wayve.mp4`) were already faststart-enabled; every other video, hero or not, had the same unstreamable structure. Surfaced this clearly as a separate, explicit ask rather than silently expanding scope beyond "the hero videos" — user confirmed to fix all of them.
- All 24 affected files (3 hero + 21 case-study-body videos; the 4th hero, Emora's, reuses the already-good `emora.mp4`) verified two ways before being trusted: (1) `moov`-before-`mdat` byte position confirmed via a full-file atom scan, (2) decoded frame content confirmed byte-identical via QuickLook thumbnail diff against the original, for every single file — not spot-checked, all 21 individually.
- Verified via Puppeteer against `next dev`, on the actual rendered pages (not just the raw files): every `<video>` element across all four case study pages — heroes, "Final Design Implementation" sections, and the cross-page "Try These Projects" thumbnail videos — reports `readyState: 4` (`HAVE_ENOUGH_DATA`) with no decode errors. Full overflow sweep (all 7 pages, both breakpoints) still 0px.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error flagged in every checkpoint this session.

## State at this checkpoint

- **Modified** 24 files under `public/projects/*.mp4` — remuxed in place (same filenames, same codecs/bitrate/resolution/duration, only the internal container layout changed to put `moov` before `mdat`). No source code changes; nothing in any `.tsx` file needed to change since `<video src>` paths are unaffected.

## Remaining work

- None currently flagged. If future videos are added to this project, worth running them through the same `avconvert --preset PresetPassthrough` pass (or equivalent) before committing, since whatever export pipeline produced these defaults to the slow, non-streamable layout.
