"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/icons/LogoMark";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

function NavLink({
  href,
  label,
  active,
  dark,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  dark: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
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
  useEffect(() => {
    function updateTheme() {
      const header = headerRef.current;
      if (!header) return;
      const navBottom = header.getBoundingClientRect().height;
      const sections = document.querySelectorAll<HTMLElement>("[data-nav-theme]");
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
  }, []);

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
          aria-label="Home"
          className={`shrink-0 transition-colors duration-300 ${dark ? "text-white" : "text-black"}`}
        >
          <LogoMark className="h-[28px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-4 md:flex"
        >
          {NAV_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              {i > 0 && (
                <span aria-hidden="true" className="select-none text-[#7A7575]">
                  /
                </span>
              )}
              <NavLink
                href={link.href}
                label={link.label}
                active={isActive(link.href)}
                dark={dark}
              />
            </span>
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
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </div>
      </nav>
    </header>
  );
}
