"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";

// Per direct feedback ("the mobile is a bit laggy"), Lenis is desktop-
// only now — this used to be mounted unconditionally in the (server)
// root layout, so mobile paid Lenis's per-frame overhead (it re-applies
// scroll position via its own RAF loop every frame regardless of input
// device, even with `syncTouch: false` leaving the actual *smoothing*
// off for touch) for zero benefit, since touch was already unsmoothed.
// Not mounting `<ReactLenis>` at all below `lg` means mobile gets
// completely untouched native scroll — no Lenis instance, no listeners,
// no per-frame work — rather than an active-but-unsmoothed one.
//
// Same matchMedia("(min-width: 1024px)") pattern already established
// across this codebase (Lightbox, HeroSection, TryTheseProjects, the
// Framer tilt fix) — defaults to `false` (no Lenis) until the effect
// resolves it on mount, the same accepted one-frame correction those
// other call sites already use, so a real desktop visitor briefly sees
// native scroll before Lenis takes over rather than mobile ever seeing
// a flash of smoothing that then disappears.
const DESKTOP_QUERY = "(min-width: 1024px)";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (!isDesktop) return children;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        respectReducedMotion: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
