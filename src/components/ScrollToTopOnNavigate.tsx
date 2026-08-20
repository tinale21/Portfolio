"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

// Next's <Link> already scrolls to the top of the destination page on a
// normal forward click (per its own docs: "if the Page is not visible in
// the viewport, Next.js will scroll to the top"). Browser back/forward
// navigation is a separate code path — Next's App Router keeps its own
// per-history-entry scroll cache for it, independent of the
// history.scrollRestoration override above, and restores whatever
// position that page was at when the user navigated away from it rather
// than resetting to the top. That reads as "going back doesn't start at
// the top" per direct report, and breaks the "every page starts fresh"
// feel the rest of the site already establishes (see NavBar's own
// scroll-to-top-on-current-page-click). Confirmed via Puppeteer against
// `next dev` with real wheel-scrolls + an actual page.goBack(): without
// this, returning to a previously-scrolled page landed back at its old
// scrollY instead of 0.
//
// usePathname() changes on every route transition regardless of how it
// was triggered (Link click, router.push, or back/forward), so resetting
// scroll here on every pathname change covers the gap uniformly — it's a
// harmless no-op duplicate on the forward-click case Link already
// handles, and the actual fix for back/forward.
//
// Routed through Lenis's own scrollTo when it's mounted (desktop only),
// same reasoning as NavBar's scrollToTop: a raw `window.scrollTo` fights
// Lenis's own per-frame resync back to its last tracked (stale) target.
// `{ immediate: true }` snaps instantly rather than animating — this is
// a navigation reset, not a user-triggered "back to top" action, so it
// shouldn't visibly re-play a scroll animation on every page load.
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}
