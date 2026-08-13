# Checkpoint — NavBar theme detection bug fix

## Context

Real bug report: the nav bar sometimes showed the wrong light/dark theme when landing on a page, only correcting itself after the user scrolled a little. User provided 3 screenshots (Work page showing a dark nav over a light page, About page same issue, Home page showing a light nav over a dark hero) as evidence.

## Human directions

- "there seems to be something with the nav bar where it doesn't always know whether it should be in dark mode or light mode and it not until you scroll a little bit down that it knows which one to use" — 3 screenshots attached.
- "let's build and push".

## Root cause

`NavBar` is rendered once in the root layout (`src/app/layout.tsx`), so it never unmounts across client-side navigations — only the page content underneath it swaps. Its theme-detection `useEffect` had an empty dependency array (`[]`), so it only ran `updateTheme()` once, on the very first mount, and thereafter only on `scroll`/`resize` events. Navigating to a new page via `next/link` left `dark` holding whatever value it had on the *previous* page until the user scrolled far enough to trigger a recheck — exactly the reported symptom, and it explains all 3 screenshots as one root cause (each showing a theme left over from wherever the user had been before), not three separate bugs.

## Fix

Added `pathname` (from `usePathname()`, already in scope) to the effect's dependency array, so it re-subscribes and immediately re-runs `updateTheme()` on every route change, before any scroll happens.

## Verification

Puppeteer test clicking through Home → Work → About → Home via client-side navigation (`page.click('a[href=...]')`, no scrolling, no full reload), checking the header's background color and class list immediately after each transition:
- Home (fresh load): dark (`#262626`) — correct, Hero is `data-nav-theme="dark"`.
- Work (client nav): light (`bg-white`) — correct.
- About (client nav): light — correct.
- Home again (client nav): dark — correct, confirmed the fix works both directions, not just on first load.

## State at this checkpoint

- **Modified `src/components/NavBar.tsx`**: theme-detection effect's dependency array changed from `[]` to `[pathname]`, with an added comment explaining the root cause for future reference.
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, 4-page navigation sequence confirmed correct theme with zero scroll in every case.
