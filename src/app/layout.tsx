import type { Metadata } from "next";
import { Inter, Inria_Serif } from "next/font/google";
import Script from "next/script";
import { ReactLenis } from "lenis/react";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Figma dev-mode inspect originally specified Inria Serif Bold (700) for
// the headline's "Tina" (and equivalent word in the other phrases), later
// switched to Regular (400) per design feedback — kept loading both
// weights in case Bold is needed again. Weight 300 + italic style added
// for the About page's "Tina Le" signature (italic 300) and trait names
// (italic 400).
const inriaSerif = Inria_Serif({
  variable: "--font-inria-serif",
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tina Le — Portfolio",
  description: "Portfolio of Tina Le",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inriaSerif.variable} antialiased`}
    >
      <body className="flex flex-col">
        {/* Browsers restore the pre-refresh scroll position by default
            (history.scrollRestoration defaults to "auto"), which reads as
            "refresh didn't reset the page." Opting into manual restoration
            here — before the browser applies its own — makes a refresh
            behave like a fresh page load, starting at the top. Runs via
            beforeInteractive so it executes as the HTML streams in, ahead
            of the browser's own restoration and ahead of hydration. */}
        <Script id="disable-scroll-restoration" strategy="beforeInteractive">
          {`if ("scrollRestoration" in history) { history.scrollRestoration = "manual"; }`}
        </Script>
        {/* Per direct instruction ("slightly delayed and fluid... but
            not overly slow or floaty... responsive and natural"), site-
            wide inertial scroll via Lenis. `root` mode renders zero
            extra DOM (confirmed by reading the library's own source —
            it returns `children` directly, no wrapper div), so this
            doesn't disturb `<body>`'s own `flex flex-col` sticky-footer
            layout at all. In its default "root" configuration, Lenis
            drives the real native window scroll position every frame
            (not a CSS-transform fake), so every scroll-linked effect
            already in this codebase (Framer Motion's useScroll, the
            NavBar theme detector, HeroSection's headline-arrival
            listener, etc.) keeps working unmodified — confirmed by
            reading the library's own `setScroll()` implementation.
            lerp-based (no explicit duration/easing) rather than a
            fixed-duration-per-gesture animation, since duration-based
            easing is what tends to read as "floaty" for continuous
            wheel scrolling — lerp instead continuously re-targets
            toward the latest input, which is what "responsive and
            natural" was asking for. 0.1 is the library's own tuned
            default for this exact feel; kept explicit here rather than
            omitted, so the intent is documented instead of just
            inherited silently. touch (syncTouch: false, the default)
            is deliberately left un-smoothed — touchscreens already have
            good native momentum scrolling, and smoothing it on top
            reads as laggy rather than fluid. respectReducedMotion is
            also a default, kept explicit for the same reason. */}
        <ReactLenis
          root
          options={{
            lerp: 0.1,
            smoothWheel: true,
            syncTouch: false,
            respectReducedMotion: true,
          }}
        >
          <NavBar />
          {children}
          <Footer />
        </ReactLenis>
      </body>
    </html>
  );
}
