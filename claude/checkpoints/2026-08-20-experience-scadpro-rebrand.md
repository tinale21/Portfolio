# Checkpoint — Experience section: "SCADpro x [Company]", drop "Intern", mobile abbreviation

## Context

The homepage's Experience list (`experiences-data.ts` → `ExperiencesSection`/`ExperienceRow`) previously listed each SCADpro-sponsored project the same way as a regular internship (e.g., "UX Designer Intern" / "Delta Air Lines"). These three rows are specifically SCADpro studio projects, not employer-run internships, so the copy needed to reflect that.

## Human directions

- "For my experience section can you remove the word intern from the Delta Air Lines, Georgia International Convention Center, and AIG. Can you also add the 'SCADpro x ...' so for example instead of 'Delta Air Lines' it is now 'SCADpro x Delta Air Lines' (this applies to only Delta Air Lines, Georgia International Convention Center, and AIG"
- "my local dev isnt work[ing]" / "my dev server is not working" — separate, parallel investigation (see below), resolved without a code change.
- "for mobile can you do 'SCADpro x GICC' but leave 'SCADpro x Georgia International Convention Center' for desktop"
- "build and push"

## Records of resistance / things I got wrong and had to correct

- Nothing to note on the Experience copy change itself — straightforward, scoped exactly as instructed, verified by checking Ziora Copilot and Ronald McDonald House rows were untouched.
- Separate to this feature: user reported "my local dev isnt work[ing]" twice across two turns without specifics either time. Rather than keep guessing, checked everything observable from this side first (port 3000 free, no conflicting/zombie processes, disk space fine, `.next` ownership correct, `npm ls` resolves cleanly) — all healthy, so the problem wasn't reproducible from here. Asked the user to run `npm run dev` themselves via `! npm run dev` so the real output would land in the conversation rather than continuing to guess blind. Their first screenshot only showed the browser-side symptom (`ERR_CONNECTION_REFUSED`, i.e. nothing listening on port 3000) — not the actual server error. The following `! npm run dev` run succeeded cleanly (`Ready in 436ms`, serving `200`s), so whatever the original failure was (most likely: dev server simply wasn't running yet when they checked the browser) resolved itself without a code change — didn't fabricate a root cause for something that turned out not to reproduce.

## Successes

- For the mobile-abbreviation follow-up, added an optional `mobileCompany` field to the `Experience` type rather than a special-cased conditional in the row component keyed to a specific company string — keeps `ExperienceRow.tsx` generic (falls back to the regular `company` string whenever `mobileCompany` isn't set, so the other four rows render exactly as before with zero branching change) and keeps the abbreviation itself as pure data in `experiences-data.ts`, next to the row it belongs to.
- Matched the swap to the site's established mobile/desktop breakpoint (`lg`, 1024px — same one `SmoothScroll`, `Lightbox`, `HeroSection`, etc. already use for this distinction) rather than the `sm` (640px) breakpoint `ExperienceRow`'s own internal layout happens to reflow at, since those are two different concerns (row layout vs. device-class content) that happened to live in the same file.
- Verified via Puppeteer: mobile viewport shows "SCADpro x GICC" and never renders the full company name into the DOM's text content at that width; desktop viewport shows the full name and never renders the abbreviation. Zero horizontal overflow at 390px.
- `npx tsc --noEmit` clean; `npx eslint` shows only the same pre-existing, unrelated `HeroSection.tsx` error flagged in every checkpoint this session.

## State at this checkpoint

- **Modified** `src/components/experiences/experiences-data.ts`: Delta Air Lines, Georgia International Convention Center, and AIG rows changed from `title: "UX Designer Intern"` / plain company name to `title: "UX Designer"` / `"SCADpro x <Company>"`. Ziora Copilot and Ronald McDonald House rows unchanged. Added an optional `mobileCompany` field to the `Experience` type, set only on the Georgia International Convention Center row (`"SCADpro x GICC"`).
- **Modified** `src/components/experiences/ExperienceRow.tsx`: renders `mobileCompany` (if present) below `lg`, `company` at `lg` and above, via two responsively-hidden spans; unchanged fallback to plain `company` text when `mobileCompany` isn't set.

## Remaining work

- None currently flagged.
