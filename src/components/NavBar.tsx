"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`text-sm tracking-normal text-black uppercase ${
        active ? "font-medium" : "font-light"
      }`}
    >
      {label}
    </Link>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E7E9EB] bg-white">
      <div className="flex h-[64px] items-center justify-between px-5 sm:px-8 lg:px-[68px]">
        <Link href="/" aria-label="Home" className="shrink-0 text-black">
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
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`origin-center transition-transform ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <line
              x1="1"
              y1="8"
              x2="21"
              y2="8"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`}
            />
            <line
              x1="1"
              y1="15"
              x2="21"
              y2="15"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`origin-center transition-transform ${
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
        className={`overflow-hidden border-t border-[#E7E9EB] bg-white transition-[max-height] duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-60" : "max-h-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-6 px-5 py-6 sm:px-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isActive(link.href)}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </div>
      </nav>
    </header>
  );
}
