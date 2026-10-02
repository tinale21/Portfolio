# Checkpoint — Move Experiences/Education + Toolbox from home to About

## Context

Moves the Experiences/Education section and the My Toolbox section off the home page and onto the About page, placed right before the "My mission is to..." quote.

## Human directions

- "can you move my experiences, education, and my toolbox section to my about page right before the 'My mission is to...' quote"

## Records of resistance / things I got wrong and had to correct

- Caught a real coupling before moving blindly: `ExperiencesSection` carried a Connect-specific negative margin-top "pull" (`getConnectExitTiming().pull`) whose entire job was to sweep its white background up over ConnectSection's pinned heading on the home page. On the About page there's no Connect, so that pull would have yanked Experiences up over the preceding trait entry. Stripped the pull (and the now-unused `useEffect`/`getConnectExitTiming` import) so it's a plain section in normal flow.
- Removing Experiences from after Connect on the home page exposed Connect's leftover `hold` scroll region (that `hold` existed only to give the pull room). Checked the result: it's ~490px (~0.5 viewport) of the pinned "Let's Connect!" heading on dark before the footer — and since both Connect and the Footer are dark (#262626), it reads as a seamless dark-to-dark close with the CTA heading lingering, not broken dead space. Left as-is; flagged to the user as optionally tightenable.

## State at this checkpoint

- **Modified** `src/app/page.tsx`: removed `<ExperiencesSection />` and `<ToolboxSection />` (and their imports). Home is now Hero → Projects → Philosophy → Connect.
- **Modified** `src/components/experiences/ExperiencesSection.tsx`: removed the Connect `pull` (negative margin-top, `useState`/`useEffect`, `getConnectExitTiming` import, `"use client"`); now a plain `<section>`. Experiences + Education content unchanged.
- **Modified** `src/components/about/AboutSection.tsx`: imported and rendered `<ExperiencesSection />` then `<ToolboxSection />` between the trait entries and the mission-quote pin wrapper.

## Verification

- About (desktop + mobile): order is Experiences → Education → My Toolbox → mission quote, as requested; sections render correctly and mobile stacks fine.
- Home (desktop): Connect flows seamlessly into the footer (dark→dark), no white gap or broken layout.
- Overflow sweep (scrolling) on `/` and `/about` at 390/768/1512: 0px everywhere.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` all clean.

## Remaining work

- Optional: trim ConnectSection's leftover `hold` (~0.5 viewport of pinned heading before the footer on home) now that nothing sweeps over it. Left intact since it reads fine dark-to-dark; easy to reduce if the user wants a tighter Connect→footer.
