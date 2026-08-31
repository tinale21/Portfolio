"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { LogoMark } from "@/components/icons/LogoMark";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

// Per direct instruction, clicking the nav item for the page you're
// already on scrolls back to the top instead of being a dead click —
// Next.js's own <Link> doesn't navigate (and so doesn't reset scroll
// position) when its href matches the current route. Deliberately
// scoped to an *exact* pathname match: on a case study page like
// /work/aig, "Work" still navigates to the /work list as normal (per
// direct instruction, clicking "Work" there should go to the list,
// not scroll the case study page itself) — only /work's own "Work"
// link (and "/"'s own Home/logo, "/about"'s own About) gets the
// scroll-to-top behavior.
//
// Routed through Lenis's own scrollTo (not a raw window.scrollTo) now
// that the site has site-wide Lenis smoothing (see layout.tsx) — Lenis
// keeps its own internal target/animated scroll state and drives the
// native scroll position from that every frame, so a native
// `behavior: "smooth"` call bypasses Lenis entirely and the two fight
// (Lenis's next frame snaps the scroll back toward its own, stale,
// target). `lenis?.` falls back to nothing in the split-second before
// the root ReactLenis instance mounts, which native scrollTo covered
// naturally — vanishingly unlikely to matter since nothing is
// scrollable to click away from that early, but kept as a safety net.
function scrollToTop(lenis: ReturnType<typeof useLenis>) {
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

function NavLink({
  href,
  label,
  active,
  dark,
  lenis,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  dark: boolean;
  lenis: ReturnType<typeof useLenis>;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.();
        if (active) {
          e.preventDefault();
          scrollToTop(lenis);
        }
      }}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`text-sm tracking-normal uppercase transition-colors duration-300 ${
        dark ? "text-white" : "text-black"
      } ${active ? "font-medium" : "font-light"}`}
    >
      {label}
    </Link>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const isActive = (href: string) => pathname === href;

  // Switches the nav's color scheme to match whatever section currently
  // sits behind it — dark text/logo on a dark section's own background
  // color, dark-on-white otherwise — so the nav never renders dark-on-dark
  // or light-on-light as the page scrolls through sections with different
  // backgrounds. Each top-level section opts in via a `data-nav-theme`
  // ("dark" | "light") attribute; sections that don't set one are treated
  // as light. Checked against the nav's own rendered height (not a
  // hardcoded constant) so it keeps working if that height changes again.
  //
  // Iterates in reverse (last DOM match wins) rather than forward, because
  // sections can visually overlap — e.g. Connect's exit deliberately pulls
  // Experiences up over its tail end so the outgoing heading appears to
  // scroll behind the incoming section. During that overlap, both
  // sections' rects straddle navBottom at once; the later one in DOM order
  // is the one actually painted on top (plain sibling stacking, no z-index
  // involved), so it's the one whose theme should win.
  //
  // NavBar lives in the root layout, so it never unmounts across
  // client-side navigations — only the page content underneath swaps.
  // Without `pathname` in the dependency array, this effect ran exactly
  // once (on the very first mount) and then only ever re-fired on scroll/
  // resize, so `dark` kept whatever value it had on the *previous* page
  // until the user scrolled far enough to trigger a recheck — the reported
  // bug ("doesn't know light/dark until you scroll a little"). Re-running
  // on every pathname change re-measures against the new page's own
  // top section immediately, before any scroll happens.
  useEffect(() => {
    function updateTheme() {
      const header = headerRef.current;
      if (!header) return;
      const navBottom = header.getBoundingClientRect().height;
      const sections = [...document.querySelectorAll<HTMLElement>("[data-nav-theme]")].reverse();
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= navBottom && rect.bottom > navBottom) {
          setDark(section.dataset.navTheme === "dark");
          return;
        }
      }
    }

    updateTheme();
    window.addEventListener("scroll", updateTheme, { passive: true });
    window.addEventListener("resize", updateTheme);
    return () => {
      window.removeEventListener("scroll", updateTheme);
      window.removeEventListener("resize", updateTheme);
    };
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        dark ? "border-[#313132] bg-[#262626]" : "border-[#E7E9EB] bg-white"
      }`}
    >
      <div className="flex h-[64px] items-center justify-between px-5 sm:px-8 lg:px-[68px]">
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              scrollToTop(lenis);
            }
          }}
          aria-label="Home"
          className={`shrink-0 transition-colors duration-300 ${dark ? "text-white" : "text-black"}`}
        >
          <LogoMark className="h-[28px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isActive(link.href)}
              dark={dark}
              lenis={lenis}
            />
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <line
              x1="1"
              y1="1"
              x2="21"
              y2="1"
              stroke={dark ? "white" : "black"}
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`origin-center transition-[transform,stroke] duration-300 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <line
              x1="1"
              y1="8"
              x2="21"
              y2="8"
              stroke={dark ? "white" : "black"}
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`transition-[opacity,stroke] duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}
            />
            <line
              x1="1"
              y1="15"
              x2="21"
              y2="15"
              stroke={dark ? "white" : "black"}
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`origin-center transition-[transform,stroke] duration-300 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </svg>
        </button>
      </div>

      {/* Mobile nav panel */}
      <nav
        id="mobile-nav-menu"
        aria-label="Primary"
        className={`overflow-hidden border-t transition-[max-height,background-color,border-color] duration-300 ease-in-out md:hidden ${
          dark ? "border-[#313132] bg-[#262626]" : "border-[#E7E9EB] bg-white"
        } ${menuOpen ? "max-h-60" : "max-h-0 border-t-0"}`}
      >
        <div className="flex flex-col gap-6 px-5 py-6 sm:px-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isActive(link.href)}
              dark={dark}
              lenis={lenis}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </div>
      </nav>
    </header>
  );
}
