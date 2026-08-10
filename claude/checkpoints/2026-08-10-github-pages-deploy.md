# Checkpoint — GitHub Pages static export + deploy workflow

## Context

The user asked "what is my public server" — turned out there wasn't one. GitHub Pages showed as "enabled" in the repo's settings but was 404ing, because nothing in the repo actually builds/publishes to it (no static-export config, no Actions workflow). Discussed Vercel vs. GitHub Pages, confirmed a GitHub Pages site can move to a custom domain later without re-deciding anything now, and the user picked GitHub Pages.

## Human directions

- "what is my public server" — led to discovering there wasn't one.
- "everything seems to have been pushed" (GitHub Desktop screenshot) — corrected my assumption that nothing had been pushed; verified it actually had, via `git fetch` + comparing local/remote logs.
- "is vercel paid" → answered from general knowledge (free Hobby tier exists, paid tiers are for teams/commercial use), flagged that exact current pricing should be double-checked since it's outside what I can verify live.
- "if i did it through github pages, can i then move it to a custom domain later" → confirmed yes, explained the DNS/Settings steps, reiterated that Next.js needing a static-export conversion is the separate, real piece of work regardless of domain choice.
- "yes set taht up" [sic].

## Records of resistance / things I got wrong and had to correct

- **Corrected my own claim once given evidence**: told the user "nothing has been pushed" based on my sandbox's git state, which was accurate *at the time* but became stale the moment they pushed via GitHub Desktop outside my sandbox. When shown a screenshot proving otherwise, didn't argue from my last-known state — ran `git fetch` immediately and confirmed local now matched `origin/main` before saying anything further.
- **Found a real, easy-to-miss bug before it could ship**: `output: "export"` + `basePath` only auto-prefixes `next/link` and `next/image` — this app's project-card videos use a raw `<video src="/projects/x.mp4">` string, which would have 404'd on GitHub Pages (served under `/Portfolio/`, not domain root) while working perfectly fine in local dev, where there's no basePath to expose the gap. Grepped the whole `src/` tree for every raw leading-slash asset reference before considering the config change "done," not just the one file I happened to be looking at.
- **Didn't hardcode the basePath directly into `next.config.ts`**: routed it through a `NEXT_PUBLIC_BASE_PATH` env var (empty by default, only set inside the GitHub Actions workflow) specifically so local `npm run dev`/`npm run build` and any future Vercel deploy are completely unaffected — Vercel serves from a domain root and would break if a `/Portfolio` basePath were baked in unconditionally.
- **Verified the actual build artifact, not just that the build command exited 0**: ran the static-export build locally with the same `NEXT_PUBLIC_BASE_PATH=/Portfolio` the Actions workflow will use, then grepped the real output HTML to confirm `next/link` hrefs, video `src`, and poster `src` were all correctly prefixed — not just trusting that setting `basePath` in config "should" work.

## Successes

- Audited the whole codebase for route handlers / server actions / middleware *before* committing to static export, confirming none exist — this app was clean for `output: "export"` with zero functional rework needed elsewhere.
- Caught the raw-video-path basePath gap by grepping systematically for every hardcoded leading-slash string across `src/`, rather than only checking the files immediately touched by this change.
- Kept local dev, local build, and any hypothetical Vercel deploy path completely unaffected by an opt-in-only env var, rather than a blanket `NODE_ENV === "production"` check (which would have wrongly applied the GitHub Pages basePath to a Vercel production build too).

## State at this checkpoint

- **`next.config.ts`**: `output: "export"`, `basePath: BASE_PATH` (from the new `src/lib/base-path.ts`), `images.unoptimized: true` (GitHub Pages has no image-optimization server).
- **New `src/lib/base-path.ts`**: `export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ""` — single source of truth for both `next.config.ts` and any app code that needs to manually prefix a raw public/ asset path.
- **`ProjectCard.tsx`**: video `src`/poster now `${BASE_PATH}${project.videoSrc}` / `${BASE_PATH}${project.posterSrc}` instead of the raw string, so they resolve correctly once served under `/Portfolio/`.
- **New `public/.nojekyll`**: empty marker file so GitHub Pages' default Jekyll processing doesn't ignore the `_next/` output folder (Jekyll ignores underscore-prefixed paths by default).
- **New `.github/workflows/deploy.yml`**: builds on every push to `main` (`npm ci` → `npm run build` with `NEXT_PUBLIC_BASE_PATH=/Portfolio` → uploads `./out` as a Pages artifact → deploys via `actions/deploy-pages`).
- Verified locally: a static-export build with `NEXT_PUBLIC_BASE_PATH=/Portfolio` succeeds and produces correctly-prefixed HTML (checked via direct `grep` on the built `out/*.html` files); a plain `npm run build` with no env var still succeeds too, confirming local dev/build is unaffected.
- **Manual step still required, outside my reach**: the user needs to go to the repo's Settings → Pages → Source and switch it from "Deploy from a branch" to "GitHub Actions" for this workflow to actually take effect — I have no `gh` CLI or API auth in this sandbox to do that myself.
